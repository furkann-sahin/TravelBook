package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.auth.JwtDecoder
import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.AuthResponseDto
import com.codelegends.travelbook.model.CompanyLoginInput
import com.codelegends.travelbook.model.CompanyLoginRequestDto
import com.codelegends.travelbook.model.CompanyRegisterInput
import com.codelegends.travelbook.model.CompanyRegisterRequestDto
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.service.AuthApiService
import retrofit2.Response
import java.io.IOException
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authApiService: AuthApiService,
    private val sessionManager: SessionManager
) : AuthRepository {

    override suspend fun loginCompany(input: CompanyLoginInput): ApiResult<UserSession> {
        val request = CompanyLoginRequestDto(
            email = input.email,
            password = input.password
        )
        return authenticate(expectedRole = "company") {
            authApiService.loginCompany(request)
        }
    }

    override suspend fun registerCompany(input: CompanyRegisterInput): ApiResult<UserSession> {
        val request = CompanyRegisterRequestDto(
            name = input.name,
            email = input.email,
            password = input.password,
            phone = input.phone,
            address = input.address,
            description = input.description
        )
        return authenticate(expectedRole = "company") {
            authApiService.registerCompany(request)
        }
    }

    private suspend fun authenticate(
        expectedRole: String,
        call: suspend () -> Response<AuthResponseDto>
    ): ApiResult<UserSession> {
        return try {
            val response = call()

            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "İşlem başarısız oldu"
                )
                return ApiResult.Error(
                    message = message,
                    code = response.code()
                )
            }

            val token = response.body()?.token
            if (token.isNullOrBlank()) {
                return ApiResult.Error("Sunucu geçersiz token döndürdü")
            }

            val payload = JwtDecoder.decode(token)
                ?: return ApiResult.Error("Sunucu geçersiz token döndürdü")

            val userId = payload.id.orEmpty()
            val email = payload.email.orEmpty()
            val role = payload.role.orEmpty().lowercase()

            if (userId.isBlank() || email.isBlank() || role.isBlank()) {
                return ApiResult.Error("Token içeriği eksik")
            }

            if (role != expectedRole) {
                return ApiResult.Error("Beklenmeyen rol: $role")
            }

            val displayName = payload.name
                ?.takeIf { it.isNotBlank() }
                ?: email.substringBefore('@').ifBlank {
                    expectedRole.replaceFirstChar { it.uppercase() }
                }

            val session = UserSession(
                token = token,
                userId = userId,
                name = displayName,
                email = email,
                role = role,
                expiresAtEpochSeconds = payload.exp
            )

            sessionManager.saveSession(session)
            ApiResult.Success(session)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Beklenmeyen bir hata oluştu")
        }
    }
}
