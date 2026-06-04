package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.*
import com.codelegends.travelbook.service.GuideApiService
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import javax.inject.Inject

class GuideRepositoryImpl @Inject constructor(
    private val guideApiService: GuideApiService
) : GuideRepository {

    override suspend fun getAllGuides(): ApiResult<List<GuideProfileSummary>> {
        return try {
            val response = guideApiService.getAllGuides()
            if (response.isSuccessful) {
                val data = response.body()?.data.orEmpty()
                ApiResult.Success(data.map { it.toUserSummary() })
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Rehberler yüklenemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    private fun UserGuideProfileDto.toUserSummary(): GuideProfileSummary {
        val fName = this.firstName ?: this.name?.substringBefore(" ") ?: ""
        val lName = this.lastName ?: this.name?.substringAfter(" ", "") ?: ""
        val full = this.name ?: "$fName $lName".trim()

        return GuideProfileSummary(
            id = this.id ?: this.objectId ?: "",
            firstName = fName,
            lastName = lName,
            fullName = full.ifBlank { "İsimsiz Rehber" },
            email = this.email.orEmpty(),
            phone = this.phone.orEmpty(),
            biography = this.biography.orEmpty(),
            profileImageUrl = this.profileImageUrl,
            bannerImageUrl = null,
            languages = this.languages ?: emptyList(),
            expertRoutes = this.expertRoutes ?: emptyList(),
            experienceYears = this.experienceYears ?: 0,
            rating = this.rating ?: 0.0,
            available = this.available ?: true,
            instagram = "",
            linkedin = "",
            galleryImages = emptyList(),
            createdAt = null
        )
    }

    override suspend fun getProfile(guideId: String): ApiResult<GuideProfileSummary> {
        return try {
            val response = guideApiService.getGuideDetail(guideId)
            if (response.isSuccessful) {
                response.body()?.data?.let {
                    ApiResult.Success(it.toSummary())
                } ?: ApiResult.Error("Profil bilgisi bulunamadı")
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun updateProfile(guideId: String, request: GuideProfileUpdateRequest): ApiResult<GuideProfileSummary> {
        return try {
            val response = guideApiService.updateGuideProfile(guideId, request)
            if (response.isSuccessful) {
                response.body()?.data?.let {
                    ApiResult.Success(it.toSummary())
                } ?: ApiResult.Error("Profil güncellendi ancak veri alınamadı")
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun deleteAccount(guideId: String): ApiResult<Unit> {
        return try {
            val response = guideApiService.deleteGuide(guideId)
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun uploadProfileImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String> {
        val part = MultipartBody.Part.createFormData(
            "image",
            fileName,
            bytes.toRequestBody(mimeType.toMediaTypeOrNull())
        )
        return try {
            val response = guideApiService.uploadProfileImage(guideId, part)
            if (response.isSuccessful) {
                val url = response.body()?.data?.profileImageUrl
                if (url != null) ApiResult.Success(url) else ApiResult.Error("Görsel URL alınamadı")
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun uploadBannerImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String> {
        val part = MultipartBody.Part.createFormData(
            "image",
            fileName,
            bytes.toRequestBody(mimeType.toMediaTypeOrNull())
        )
        return try {
            val response = guideApiService.uploadBannerImage(guideId, part)
            if (response.isSuccessful) {
                val url = response.body()?.data?.bannerImageUrl
                if (url != null) ApiResult.Success(url) else ApiResult.Error("Görsel URL alınamadı")
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun uploadGalleryImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String> {
        val part = MultipartBody.Part.createFormData(
            "image",
            fileName,
            bytes.toRequestBody(mimeType.toMediaTypeOrNull())
        )
        return try {
            val response = guideApiService.uploadGalleryImage(guideId, part)
            if (response.isSuccessful) {
                val url = response.body()?.data?.galleryImageUrl
                if (url != null) ApiResult.Success(url) else ApiResult.Error("Görsel URL alınamadı")
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun removeGalleryImage(guideId: String, imageUrl: String): ApiResult<Unit> {
        return try {
            val response = guideApiService.removeGalleryImage(guideId, imageUrl)
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "İşlem başarısız oldu"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun listCompanies(): ApiResult<List<CompanyProfileSummary>> {
        return try {
            val response = guideApiService.listCompaniesForGuide()
            if (response.isSuccessful) {
                val data = response.body()?.data.orEmpty()
                ApiResult.Success(data.map(::mapCompanyProfile))
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Tur firmaları yüklenemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun registerToCompany(guideId: String, companyId: String): ApiResult<Unit> {
        return try {
            val response = guideApiService.applyToCompany(
                guideId = guideId,
                request = GuideCompanyRegistrationRequest(companyId = companyId)
            )
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Firmaya kayıt olunamadı"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun listMyCompanies(guideId: String): ApiResult<List<CompanyProfileSummary>> {
        return try {
            val response = guideApiService.listMyCompanies(guideId)
            if (response.isSuccessful) {
                val data = response.body()?.data.orEmpty()
                ApiResult.Success(data.map(::mapCompanyProfile))
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Kayıtlı firmalar yüklenemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun removeFromCompany(guideId: String, companyId: String): ApiResult<Unit> {
        return try {
            val response = guideApiService.removeFromCompany(guideId, companyId)
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Kayıt silinemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun listMyTours(guideId: String): ApiResult<List<CompanyTourSummary>> {
        return try {
            val response = guideApiService.listMyTours(guideId)
            if (response.isSuccessful) {
                val data = response.body()?.data.orEmpty()
                ApiResult.Success(data.map(::mapTour))
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Turlar yüklenemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    override suspend fun removeTourRegistration(guideId: String, tourId: String): ApiResult<Unit> {
        return try {
            val response = guideApiService.removeTourRegistration(guideId, tourId)
            if (response.isSuccessful) {
                ApiResult.Success(Unit)
            } else {
                ApiResult.Error(ApiErrorParser.parse(response.errorBody()?.string(), "Tur kaydı silinemedi"))
            }
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        }
    }

    private fun mapTour(dto: CompanyTourDto): CompanyTourSummary {
        val id = dto.id ?: dto.objectId ?: ""
        val imagePath = dto.imageUrl ?: dto.images?.firstOrNull()

        return CompanyTourSummary(
            id = id,
            name = dto.name.orEmpty(),
            location = dto.location.orEmpty(),
            departureLocation = dto.departureLocation.orEmpty(),
            arrivalLocation = dto.arrivalLocation.orEmpty(),
            price = dto.price ?: 0.0,
            startDate = dto.startDate.orEmpty(),
            endDate = dto.endDate.orEmpty(),
            imagePath = imagePath,
            services = dto.services.orEmpty(),
            rating = dto.rating ?: 0.0,
            reviewCount = dto.reviewCount ?: 0
        )
    }

    private fun mapCompanyProfile(dto: CompanyProfileDto): CompanyProfileSummary {
        return CompanyProfileSummary(
            id = dto.id ?: dto.objectId.orEmpty(),
            name = dto.name.orEmpty(),
            email = dto.email.orEmpty(),
            phone = dto.phone.orEmpty(),
            address = dto.address.orEmpty(),
            description = dto.description.orEmpty(),
            instagram = dto.instagram.orEmpty(),
            linkedin = dto.linkedin.orEmpty(),
            profileImageUrl = dto.profileImageUrl,
            bannerImageUrl = dto.bannerImageUrl,
            createdAt = dto.createdAt,
            rating = dto.rating ?: 0.0,
            tourCount = dto.tourCount ?: 0,
            registeredGuideCount = dto.registeredGuides.orEmpty().size
        )
    }

    private fun GuideProfileDto.toSummary(): GuideProfileSummary {
        val id = this.id ?: this.objectId ?: ""
        val fName = this.firstName.orEmpty()
        val lName = this.lastName.orEmpty()
        return GuideProfileSummary(
            id = id,
            firstName = fName,
            lastName = lName,
            fullName = "$fName $lName".trim(),
            email = this.email.orEmpty(),
            phone = this.phone.orEmpty(),
            biography = this.biography.orEmpty(),
            profileImageUrl = this.profileImageUrl,
            bannerImageUrl = this.bannerImageUrl,
            languages = this.languages ?: emptyList(),
            expertRoutes = this.expertRoutes ?: emptyList(),
            experienceYears = this.experienceYears ?: 0,
            rating = this.rating ?: 0.0,
            available = this.available ?: true,
            instagram = this.instagram.orEmpty(),
            linkedin = this.linkedin.orEmpty(),
            galleryImages = this.galleryImages ?: emptyList(),
            createdAt = this.createdAt
        )
    }
}
