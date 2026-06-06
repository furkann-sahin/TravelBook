package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.model.PlatformStatsDto
import com.codelegends.travelbook.model.PlatformStatsSummary
import com.codelegends.travelbook.model.PublicTourDto
import com.codelegends.travelbook.service.TourApiService
import java.io.IOException
import javax.inject.Inject

class PublicTourRepositoryImpl @Inject constructor(
    private val tourApiService: TourApiService
) : PublicTourRepository {

    override suspend fun getFeaturedTours(limit: Int): ApiResult<List<FeaturedTourSummary>> {
        return try {
            val response = tourApiService.getTours(limit = limit)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Öne çıkan turlar yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val tours = response.body()?.data.orEmpty().take(limit).map(::mapTour)
            ApiResult.Success(tours)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Öne çıkan turlar yüklenemedi")
        }
    }

    override suspend fun getFilteredTours(
        location: String?,
        minPrice: Double?,
        maxPrice: Double?,
        startDate: String?,
        endDate: String?
    ): ApiResult<List<FeaturedTourSummary>> {
        return try {
            val response = tourApiService.getTours(
                location = location,
                minPrice = minPrice,
                maxPrice = maxPrice,
                startDate = startDate,
                endDate = endDate
            )
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Turlar yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val tours = response.body()?.data.orEmpty().map(::mapTour)
            ApiResult.Success(tours)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Turlar yüklenemedi")
        }
    }

    override suspend fun getPlatformStats(): ApiResult<PlatformStatsSummary> {
        return try {
            val response = tourApiService.getStats()
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Platform istatistikleri yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val stats = response.body()?.data
                ?: return ApiResult.Error("Platform istatistikleri yüklenemedi")

            ApiResult.Success(mapStats(stats))
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Platform istatistikleri yüklenemedi")
        }
    }

    private fun mapTour(dto: PublicTourDto): FeaturedTourSummary {
        val id = dto.id ?: dto.objectId ?: ""
        val title = dto.name ?: dto.title ?: "Tur"
        val imagePath = dto.imageUrl ?: dto.images?.firstOrNull()

        return FeaturedTourSummary(
            id = id,
            title = title,
            location = dto.location.orEmpty(),
            departureLocation = dto.departureLocation.orEmpty(),
            arrivalLocation = dto.arrivalLocation.orEmpty(),
            price = dto.price ?: 0.0,
            startDate = dto.startDate.orEmpty(),
            endDate = dto.endDate.orEmpty(),
            imagePath = imagePath,
            rating = dto.rating ?: 0.0,
            companyName = dto.companyName.orEmpty()
        )
    }

    private fun mapStats(dto: PlatformStatsDto): PlatformStatsSummary {
        return PlatformStatsSummary(
            userCount = dto.userCount ?: 0,
            tourCount = dto.tourCount ?: 0,
            companyCount = dto.companyCount ?: 0,
            guideCount = dto.guideCount ?: 0
        )
    }
}
