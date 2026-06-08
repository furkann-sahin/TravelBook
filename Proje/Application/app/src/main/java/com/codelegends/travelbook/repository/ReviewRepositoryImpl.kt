package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CreateReviewRequest
import com.codelegends.travelbook.model.ReviewDto
import com.codelegends.travelbook.model.UpdateReviewRequest
import com.codelegends.travelbook.service.ReviewApiService
import java.io.IOException
import javax.inject.Inject

class ReviewRepositoryImpl @Inject constructor(
    private val reviewApiService: ReviewApiService
) : ReviewRepository {

    override suspend fun createReview(tourId: String, request: CreateReviewRequest): ApiResult<ReviewDto> {
        return try {
            val response = reviewApiService.createReview(tourId, request)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Yorum eklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val review = response.body()?.data
                ?: return ApiResult.Error("Sunucu geçersiz yanıt döndürdü")

            ApiResult.Success(review)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Yorum eklenirken bir hata oluştu")
        }
    }

    override suspend fun updateReview(reviewId: String, request: UpdateReviewRequest): ApiResult<ReviewDto> {
        return try {
            val response = reviewApiService.updateReview(reviewId, request)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Yorum güncellenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            val review = response.body()?.data
                ?: return ApiResult.Error("Sunucu geçersiz yanıt döndürdü")

            ApiResult.Success(review)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Yorum güncellenirken bir hata oluştu")
        }
    }

    override suspend fun deleteReview(reviewId: String): ApiResult<Unit> {
        return try {
            val response = reviewApiService.deleteReview(reviewId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Yorum silinemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }

            ApiResult.Success(Unit)
        } catch (_: IOException) {
            ApiResult.Error("Bağlantı hatası. Lütfen internetinizi kontrol edin")
        } catch (exception: Exception) {
            ApiResult.Error(exception.message ?: "Yorum silinirken bir hata oluştu")
        }
    }
}
