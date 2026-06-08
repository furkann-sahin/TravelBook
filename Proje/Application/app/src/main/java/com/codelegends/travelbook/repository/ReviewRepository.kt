package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CreateReviewRequest
import com.codelegends.travelbook.model.ReviewDto
import com.codelegends.travelbook.model.UpdateReviewRequest

/**
 * Repository for managing tour reviews.
 */
interface ReviewRepository {
    suspend fun createReview(tourId: String, request: CreateReviewRequest): ApiResult<ReviewDto>
    suspend fun updateReview(reviewId: String, request: UpdateReviewRequest): ApiResult<ReviewDto>
    suspend fun deleteReview(reviewId: String): ApiResult<Unit>
}
