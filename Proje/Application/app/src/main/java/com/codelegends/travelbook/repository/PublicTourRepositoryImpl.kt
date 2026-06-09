package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import android.util.Log
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.model.PlatformStatsDto
import com.codelegends.travelbook.model.PlatformStatsSummary
import com.codelegends.travelbook.model.PublicTourDto
import com.codelegends.travelbook.model.PurchaseDataDto
import com.codelegends.travelbook.model.UserTourDetailDto
import com.codelegends.travelbook.service.TourApiService
import java.io.IOException
import javax.inject.Inject

const val TAG = "PublicTourRepo"

class PublicTourRepositoryImpl @Inject constructor(
    private val tourApiService: TourApiService
) : PublicTourRepository {
    
    // Geçici session bazlı cache: tourId -> purchaseId
    private val purchaseCache = mutableMapOf<String, String>()

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

    override suspend fun getTourDetail(tourId: String): ApiResult<UserTourDetailDto> {
        return try {
            val response = tourApiService.getTourDetail(tourId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Tur detayı yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val detail = response.body()?.data
                ?: return ApiResult.Error("Tur detayı yüklenemedi")

            Log.d(TAG, "getTourDetail Başarılı. Kapasite: ${detail.remainingCapacity}/${detail.totalCapacity}")
            ApiResult.Success(detail)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Tur detayı yüklenemedi")
        }
    }

    override suspend fun purchaseTour(tourId: String): ApiResult<PurchaseDataDto> {
        Log.d(TAG, "purchaseTour tetiklendi. tourId: $tourId")
        return try {
            val response = tourApiService.purchaseTour(tourId)
            val request = response.raw().request
            Log.d(TAG, "Request URL: ${request.url}")
            Log.d(TAG, "Request Method: ${request.method}")
            Log.d(TAG, "Has Auth Header: ${request.header("Authorization") != null}")
            
            if (!response.isSuccessful) {
                val errorBody = response.errorBody()?.string()
                Log.e(TAG, "purchaseTour başarısız. Code: ${response.code()}, Body: $errorBody")
                val message = ApiErrorParser.parse(
                    rawBody = errorBody,
                    fallbackMessage = "Tur satın alınamadı"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            val data = response.body()?.data ?: return ApiResult.Error("İşlem başarısız")
            Log.d(TAG, "purchaseTour başarılı.")
            
            // Başarılı satın almada cache'e ekle
            data.purchaseId?.let { pid -> purchaseCache[tourId] = pid }
            
            ApiResult.Success(data)
        } catch (e: IOException) {
            Log.e(TAG, "purchaseTour IOException: ${e.message}")
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            Log.e(TAG, "purchaseTour Exception: ${e.message}")
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun cancelPurchase(purchaseId: String): ApiResult<Unit> {
        Log.d(TAG, "cancelPurchase tetiklendi. purchaseId: $purchaseId")
        return try {
            val response = tourApiService.cancelPurchase(purchaseId)
            val request = response.raw().request
            Log.d(TAG, "Request URL: ${request.url}")
            
            if (!response.isSuccessful) {
                val errorBody = response.errorBody()?.string()
                Log.e(TAG, "cancelPurchase başarısız. Code: ${response.code()}, Body: $errorBody")
                val message = ApiErrorParser.parse(
                    rawBody = errorBody,
                    fallbackMessage = "Satın alma iptal edilemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            Log.d(TAG, "cancelPurchase başarılı.")
            
            // Başarılı iptalde cache'den kaldır
            val tourIdToRemove = purchaseCache.filterValues { it == purchaseId }.keys.firstOrNull()
            tourIdToRemove?.let { purchaseCache.remove(it) }

            ApiResult.Success(Unit)
        } catch (e: IOException) {
            Log.e(TAG, "cancelPurchase IOException: ${e.message}")
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            Log.e(TAG, "cancelPurchase Exception: ${e.message}")
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override fun isTourPurchased(tourId: String): Boolean {
        return purchaseCache.containsKey(tourId)
    }

    override fun getPurchaseId(tourId: String): String? {
        return purchaseCache[tourId]
    }

    private fun mapTour(dto: PublicTourDto): FeaturedTourSummary {
        val id = dto.id ?: dto.objectId ?: ""
        val title = dto.name ?: dto.title ?: "Tur"
        val imagePath = dto.imageUrl ?: dto.images?.firstOrNull()

        // Cache kontrolü ekle: Yerel cache'de varsa oradan al, yoksa DTO'dan al
        val isLocallyPurchased = purchaseCache.containsKey(id)
        val finalIsPurchased = isLocallyPurchased || (dto.isPurchased ?: false)
        val finalPurchaseId = if (isLocallyPurchased) purchaseCache[id] else dto.purchaseId

        return FeaturedTourSummary(
            id = id,
            title = title,
            departureLocation = dto.departureLocation.orEmpty(),
            arrivalLocation = dto.arrivalLocation.orEmpty(),
            price = dto.price ?: 0.0,
            startDate = dto.startDate.orEmpty(),
            endDate = dto.endDate.orEmpty(),
            imagePath = imagePath,
            rating = dto.rating ?: 0.0,
            companyName = dto.companyName.orEmpty(),
            isPurchased = finalIsPurchased,
            purchaseId = finalPurchaseId
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
