package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.AddFavoriteRequest
import com.codelegends.travelbook.model.FavoriteDto
import com.codelegends.travelbook.service.TourApiService
import java.io.IOException
import javax.inject.Inject

class FavoriteRepositoryImpl @Inject constructor(
    private val tourApiService: TourApiService
) : FavoriteRepository {

    override suspend fun getFavorites(userId: String): ApiResult<List<FavoriteDto>> {
        return try {
            val response = tourApiService.getFavorites(userId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favoriler yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            val data = response.body()?.data.orEmpty()
            
            // API'den gelenleri cache'e al
            favoriteCache.clear()
            data.mapNotNull { it.tourId }.forEach { favoriteCache.add(it) }
            
            ApiResult.Success(data)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun addFavorite(userId: String, tourId: String): ApiResult<FavoriteDto> {
        return try {
            val response = tourApiService.addFavorite(userId, AddFavoriteRequest(tourId))
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favorilere eklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            val data = response.body()?.data ?: return ApiResult.Error("İşlem başarısız")
            
            data.tourId?.let { favoriteCache.add(it) } // Cache'e ekle

            ApiResult.Success(data)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun removeFavorite(userId: String, tourId: String): ApiResult<Unit> {
        return try {
            val response = tourApiService.removeFavorite(userId, tourId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favorilerden kaldırılamadı"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            
            favoriteCache.remove(tourId) // Cache'den sil
            
            ApiResult.Success(Unit)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    // Cache management
    private val favoriteCache = mutableSetOf<String>()

    override fun isFavorite(tourId: String): Boolean {
        return favoriteCache.contains(tourId)
    }

    override fun clearCache() {
        favoriteCache.clear()
    }
}
