package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.model.PlatformStatsSummary

interface PublicTourRepository {
    suspend fun getFeaturedTours(limit: Int = 4): ApiResult<List<FeaturedTourSummary>>

    suspend fun getFilteredTours(
        location: String? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        startDate: String? = null,
        endDate: String? = null
    ): ApiResult<List<FeaturedTourSummary>>

    suspend fun getPlatformStats(): ApiResult<PlatformStatsSummary>
}
