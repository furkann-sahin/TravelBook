package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.auth.JwtDecoder
import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UpdatePasswordRequestDto
import com.codelegends.travelbook.model.UpdateProfileRequestDto
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserLoginRequestDto
import com.codelegends.travelbook.model.UserPurchaseDto
import com.codelegends.travelbook.model.UserProfileDto
import com.codelegends.travelbook.model.UserRegisterInput
import com.codelegends.travelbook.model.UserRegisterRequestDto
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.service.UserApiService
import com.codelegends.travelbook.service.UserAuthApiService
import java.io.IOException
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val userAuthApiService: UserAuthApiService,
    private val userApiService: UserApiService,
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
            firstName = input.firstName,
            lastName = input.lastName,
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

    override suspend fun getUserProfile(userId: String): ApiResult<UserProfileDto> {
        return try {
            val response = userApiService.getUserProfile(userId)
            if (response.isSuccessful) {
                val profile = response.body()?.data
                if (profile != null) {
                    ApiResult.Success(profile)
                } else {
                    ApiResult.Error("Profil bilgileri alınamadı")
                }
            } else {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Profil bilgileri getirilirken bir hata oluştu"
                )
                ApiResult.Error(message, response.code())
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun getUserPurchases(
        userId: String,
        status: String?
    ): ApiResult<List<UserPurchaseDto>> {
        return try {
            val response = userApiService.getUserPurchases(userId, status)
            if (response.isSuccessful) {
                val purchases = response.body()?.data.orEmpty()
                ApiResult.Success(purchases)
            } else {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Seyahat geçmişi alınamadı"
                )
                ApiResult.Error(message, response.code())
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun updateUserProfile(
        userId: String,
        request: UpdateProfileRequestDto
    ): ApiResult<UserProfileDto> {
        return try {
            val response = userApiService.updateUserProfile(userId, request)
            if (response.isSuccessful) {
                val profile = response.body()?.data
                if (profile != null) {
                    ApiResult.Success(profile)
                } else {
                    ApiResult.Error("Profil güncellendi ancak veriler alınamadı")
                }
            } else {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Profil güncellenirken bir hata oluştu"
                )
                ApiResult.Error(message, response.code())
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun updateUserPassword(
        userId: String,
        request: UpdatePasswordRequestDto
    ): ApiResult<Unit> {
        return try {
            val response = userApiService.updateUserPassword(userId, request)
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Şifre güncellenirken bir hata oluştu"
                )
                ApiResult.Error(message, response.code())
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun deleteUserAccount(userId: String): ApiResult<Unit> {
        return try {
            val response = userApiService.deleteUserAccount(userId)
            if (response.isSuccessful) {
                sessionManager.clearSession()
                ApiResult.Success(Unit)
            } else {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Hesap silinirken bir hata oluştu"
                )
                ApiResult.Error(message, response.code())
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Beklenmeyen bir hata oluştu")
        }
    }
}
