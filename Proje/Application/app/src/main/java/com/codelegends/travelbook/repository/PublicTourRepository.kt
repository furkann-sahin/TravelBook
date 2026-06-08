package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.model.PlatformStatsSummary
import com.codelegends.travelbook.model.PurchaseDataDto
import com.codelegends.travelbook.model.UserTourDetailDto

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

    suspend fun getTourDetail(tourId: String): ApiResult<UserTourDetailDto>

    suspend fun purchaseTour(tourId: String): ApiResult<PurchaseDataDto>

    suspend fun cancelPurchase(purchaseId: String): ApiResult<Unit>

    fun isTourPurchased(tourId: String): Boolean

    fun getPurchaseId(tourId: String): String?
}
