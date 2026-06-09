package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyGuideDto
import com.codelegends.travelbook.model.CompanyGuideSummary
import com.codelegends.travelbook.model.CompanyProfileDto
import com.codelegends.travelbook.model.CompanyProfileSummary
import com.codelegends.travelbook.model.CompanyProfileUpdateRequest
import com.codelegends.travelbook.model.CompanyTourDetail
import com.codelegends.travelbook.model.CompanyTourDetailDto
import com.codelegends.travelbook.model.CompanyTourDto
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.model.CreateTourRequest
import com.codelegends.travelbook.model.UpdateTourRequest
import com.codelegends.travelbook.service.CompanyTourApiService
import com.google.gson.Gson
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import javax.inject.Inject

class CompanyTourRepositoryImpl @Inject constructor(
    private val companyTourApiService: CompanyTourApiService
) : CompanyTourRepository {

    override suspend fun listTours(companyId: String): ApiResult<List<CompanyTourSummary>> {
        return try {
            val response = companyTourApiService.listCompanyTours(companyId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Turlar yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val data = response.body()?.data.orEmpty()
            ApiResult.Success(data.map(::mapTour))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Turlar yüklenemedi")
        }
    }

    override suspend fun getTourDetail(
        companyId: String,
        tourId: String
    ): ApiResult<CompanyTourDetail> {
        return try {
            val response = companyTourApiService.getCompanyTour(companyId, tourId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Tur detayı yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val dto = response.body()?.data
                ?: return ApiResult.Error("Tur detayı yüklenemedi")

            ApiResult.Success(mapTourDetail(dto))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Tur detayı yüklenemedi")
        }
    }

    override suspend fun createTour(
        companyId: String,
        request: CreateTourRequest,
        imageFileName: String?,
        imageMimeType: String?,
        imageBytes: ByteArray?
    ): ApiResult<Unit> {
        return try {
            val plainText = "text/plain".toMediaTypeOrNull()
            val gson = Gson()

            val namePart = request.name.toRequestBody(plainText)
            val descriptionPart = request.description.toRequestBody(plainText)
            val departurePart = request.departureLocation.toRequestBody(plainText)
            val arrivalPart = request.arrivalLocation.toRequestBody(plainText)
            val placesPart = gson.toJson(request.places).toRequestBody(plainText)
            val pricePart = request.price.toString().toRequestBody(plainText)
            val capacityPart = request.totalCapacity.toString().toRequestBody(plainText)
            val startDatePart = request.startDate.toRequestBody(plainText)
            val endDatePart = request.endDate.toRequestBody(plainText)
            val servicesPart = gson.toJson(request.services).toRequestBody(plainText)
            val guideIdPart = request.guideId?.takeIf { it.isNotBlank() }
                ?.toRequestBody(plainText)

            val imagePart =
                if (imageBytes != null && !imageFileName.isNullOrBlank() && !imageMimeType.isNullOrBlank()) {
                    val requestBody = imageBytes.toRequestBody(imageMimeType.toMediaTypeOrNull())
                    MultipartBody.Part.createFormData("image", imageFileName, requestBody)
                } else {
                    null
                }

            val response = companyTourApiService.createCompanyTour(
                companyId = companyId,
                name = namePart,
                description = descriptionPart,
                departureLocation = departurePart,
                arrivalLocation = arrivalPart,
                places = placesPart,
                price = pricePart,
                totalCapacity = capacityPart,
                startDate = startDatePart,
                endDate = endDatePart,
                services = servicesPart,
                guideId = guideIdPart,
                image = imagePart
            )

            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Tur oluşturulamadı"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            ApiResult.Success(Unit)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Tur oluşturulamadı")
        }
    }

    override suspend fun updateTour(
        companyId: String,
        tourId: String,
        body: UpdateTourRequest
    ): ApiResult<CompanyTourDetail> {
        return try {
            val response = companyTourApiService.updateCompanyTour(companyId, tourId, body)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Tur güncellenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val dto = response.body()?.data
                ?: return ApiResult.Error("Tur güncellenemedi")

            ApiResult.Success(mapTourDetail(dto))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Tur güncellenemedi")
        }
    }

    override suspend fun deleteTour(companyId: String, tourId: String): ApiResult<Unit> {
        return try {
            val response = companyTourApiService.deleteCompanyTour(companyId, tourId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Tur silinemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            ApiResult.Success(Unit)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Tur silinemedi")
        }
    }

    override suspend fun listGuides(companyId: String): ApiResult<List<CompanyGuideSummary>> {
        return try {
            val response = companyTourApiService.listCompanyGuides(companyId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Rehberler yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val data = response.body()?.data.orEmpty()
            ApiResult.Success(data.map(::mapGuide))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Rehberler yüklenemedi")
        }
    }

    override suspend fun getCompanyProfile(companyId: String): ApiResult<CompanyProfileSummary> {
        return try {
            val response = companyTourApiService.getCompanyProfile(companyId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Firma bilgileri yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val dto = response.body()?.data
                ?: return ApiResult.Error("Firma bilgileri yüklenemedi")

            ApiResult.Success(mapProfile(dto))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Firma bilgileri yüklenemedi")
        }
    }

    override suspend fun updateCompanyProfile(
        companyId: String,
        body: CompanyProfileUpdateRequest
    ): ApiResult<CompanyProfileSummary> {
        return try {
            val response = companyTourApiService.updateCompanyProfile(companyId, body)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Firma profili güncellenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val dto = response.body()?.data
                ?: return ApiResult.Error("Firma profili güncellenemedi")

            ApiResult.Success(mapProfile(dto))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Firma profili güncellenemedi")
        }
    }

    override suspend fun uploadCompanyProfileImage(
        companyId: String,
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ): ApiResult<String> {
        return uploadImage(
            companyId = companyId,
            fileName = fileName,
            mimeType = mimeType,
            bytes = bytes,
            isBanner = false
        )
    }

    override suspend fun uploadCompanyBannerImage(
        companyId: String,
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ): ApiResult<String> {
        return uploadImage(
            companyId = companyId,
            fileName = fileName,
            mimeType = mimeType,
            bytes = bytes,
            isBanner = true
        )
    }

    override suspend fun deleteCompanyAccount(companyId: String): ApiResult<Unit> {
        return try {
            val response = companyTourApiService.deleteCompanyAccount(companyId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Firma hesabı silinemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            ApiResult.Success(Unit)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Firma hesabı silinemedi")
        }
    }

    private fun mapTour(dto: CompanyTourDto): CompanyTourSummary {
        val id = dto.id ?: dto.objectId ?: ""
        val imagePath = dto.imageUrl ?: dto.images?.firstOrNull()

        return CompanyTourSummary(
            id = id,
            name = dto.name.orEmpty(),
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

    private fun mapTourDetail(dto: CompanyTourDetailDto): CompanyTourDetail {
        val id = dto.id ?: dto.objectId ?: ""
        val guide = dto.guide
        val guideName = listOf(guide?.firstName, guide?.lastName)
            .filterNot { it.isNullOrBlank() }
            .joinToString(" ")
            .ifBlank { null }
        val imagePath = dto.imageUrl ?: dto.images?.firstOrNull()

        return CompanyTourDetail(
            id = id,
            name = dto.name.orEmpty(),
            description = dto.description.orEmpty(),
            departureLocation = dto.departureLocation.orEmpty(),
            arrivalLocation = dto.arrivalLocation.orEmpty(),
            places = dto.places.orEmpty(),
            price = dto.price ?: 0.0,
            totalCapacity = dto.totalCapacity ?: 0,
            filledCapacity = dto.filledCapacity ?: 0,
            startDate = dto.startDate.orEmpty(),
            endDate = dto.endDate.orEmpty(),
            imagePath = imagePath,
            services = dto.services.orEmpty(),
            rating = dto.rating ?: 0.0,
            reviewCount = dto.reviewCount ?: 0,
            guideName = guideName,
            guideEmail = guide?.email,
            guidePhone = guide?.phone
        )
    }

    private fun mapGuide(dto: CompanyGuideDto): CompanyGuideSummary {
        val fullName = listOf(dto.firstName, dto.lastName)
            .filterNot { it.isNullOrBlank() }
            .joinToString(" ")
            .ifBlank { "Rehber" }

        return CompanyGuideSummary(
            id = dto.id ?: dto.objectId ?: "",
            fullName = fullName,
            email = dto.email.orEmpty(),
            phone = dto.phone.orEmpty(),
            languages = dto.languages.orEmpty(),
            expertRoutes = dto.expertRoutes.orEmpty(),
            rating = dto.rating ?: 0.0,
            profileImagePath = dto.profileImageUrl
        )
    }

    private fun mapProfile(dto: CompanyProfileDto): CompanyProfileSummary {
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

    private suspend fun uploadImage(
        companyId: String,
        fileName: String,
        mimeType: String,
        bytes: ByteArray,
        isBanner: Boolean
    ): ApiResult<String> {
        return try {
            val requestBody = bytes.toRequestBody(mimeType.toMediaTypeOrNull())
            val imagePart = MultipartBody.Part.createFormData(
                name = "image",
                filename = fileName,
                body = requestBody
            )

            val response = if (isBanner) {
                companyTourApiService.uploadCompanyBannerImage(companyId, imagePart)
            } else {
                companyTourApiService.uploadCompanyProfileImage(companyId, imagePart)
            }

            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = if (isBanner) {
                        "Kapak görseli yüklenemedi"
                    } else {
                        "Profil görseli yüklenemedi"
                    }
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val data = response.body()?.data
            val path = if (isBanner) data?.bannerImageUrl else data?.profileImageUrl
            if (path.isNullOrBlank()) {
                return ApiResult.Error(
                    if (isBanner) {
                        "Kapak görseli yüklenemedi"
                    } else {
                        "Profil görseli yüklenemedi"
                    }
                )
            }

            ApiResult.Success(path)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(
                exception.message ?: if (isBanner) {
                    "Kapak görseli yüklenemedi"
                } else {
                    "Profil görseli yüklenemedi"
                }
            )
        }
    }
}
