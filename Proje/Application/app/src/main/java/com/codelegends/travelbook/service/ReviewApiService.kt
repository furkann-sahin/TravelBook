package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.CreateReviewRequest
import com.codelegends.travelbook.model.ReviewDto
import com.codelegends.travelbook.model.UpdateReviewRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

/**
 * Service for managing tour reviews.
 */
interface ReviewApiService {

    /**
     * Adds a new review to a specific tour.
     */
    @POST("tours/{tourId}/reviews")
    suspend fun createReview(
        @Path("tourId") tourId: String,
        @Body request: CreateReviewRequest
    ): Response<ApiObjectEnvelope<ReviewDto>>

    /**
     * Updates an existing review.
     */
    @PUT("reviews/{reviewId}")
    suspend fun updateReview(
        @Path("reviewId") reviewId: String,
        @Body request: UpdateReviewRequest
    ): Response<ApiObjectEnvelope<ReviewDto>>

    /**
     * Deletes an existing review.
     */
    @DELETE("reviews/{reviewId}")
    suspend fun deleteReview(
        @Path("reviewId") reviewId: String
    ): Response<Unit>
}
