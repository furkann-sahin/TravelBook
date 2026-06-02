package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.PlatformStatsDto
import com.codelegends.travelbook.model.PublicTourListResponseDto
import retrofit2.Response
import retrofit2.http.GET
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
}
