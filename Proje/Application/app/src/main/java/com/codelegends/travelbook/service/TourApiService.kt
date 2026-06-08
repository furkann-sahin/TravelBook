package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.PlatformStatsDto
import com.codelegends.travelbook.model.PublicTourListResponseDto
import com.codelegends.travelbook.model.PurchaseDataDto
import com.codelegends.travelbook.model.UserTourDetailDto
import retrofit2.Response
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface TourApiService {
    @GET("tours")
    suspend fun getTours(
        @Query("limit") limit: Int? = null,
        @Query("location") location: String? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null,
        @Query("startDate") startDate: String? = null,
        @Query("endDate") endDate: String? = null

    ): Response<PublicTourListResponseDto>

    @GET("tours/stats")
    suspend fun getStats(): Response<ApiObjectEnvelope<PlatformStatsDto>>

    @GET("tours/{tourId}")
    suspend fun getTourDetail(
        @Path("tourId") tourId: String
    ): Response<ApiObjectEnvelope<UserTourDetailDto>>

    @POST("users/tours/{tourId}/purchases")
    suspend fun purchaseTour(@Path("tourId") tourId: String): Response<ApiObjectEnvelope<PurchaseDataDto>>

    @DELETE("users/purchases/{purchaseId}")
    suspend fun cancelPurchase(@Path("purchaseId") purchaseId: String): Response<ApiObjectEnvelope<Unit>>
}
