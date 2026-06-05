package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.auth.JwtDecoder
import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserLoginRequestDto
import com.codelegends.travelbook.model.UserRegisterInput
import com.codelegends.travelbook.model.UserRegisterRequestDto
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.service.UserAuthApiService
import retrofit2.Response
import java.io.IOException
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val userAuthApiService: UserAuthApiService,
    private val sessionManager: SessionManager,
) : UserRepository {

    override suspend fun loginUser(input: UserLoginInput): ApiResult<UserSession> {
        val request = UserLoginRequestDto(
            email = input.email,
            password = input.password
        )
        return try {
            val response = userAuthApiService.loginUser(request)

            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Giriş başarısız oldu"
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

            val displayName = payload.name
                ?.takeIf { it.isNotBlank() }
                ?: email.substringBefore('@').ifBlank { "Kullanıcı" }

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

    override suspend fun registerUser(input: UserRegisterInput): ApiResult<UserSession> {
        val request = UserRegisterRequestDto(
            name = "${input.firstName} ${input.lastName}".trim(),
            email = input.email,
            password = input.password,
            phone = input.phone
        )
        return try {
            val response = userAuthApiService.registerUser(request)

            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Kayıt başarısız oldu"
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

            val displayName = payload.name
                ?.takeIf { it.isNotBlank() }
                ?: "${input.firstName} ${input.lastName}"

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
