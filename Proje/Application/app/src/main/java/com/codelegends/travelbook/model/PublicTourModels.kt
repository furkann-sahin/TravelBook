package com.codelegends.travelbook.model

import com.google.gson.annotations.SerializedName

data class PublicTourListResponseDto(
    val status: String? = null,
    val message: String? = null,
    val data: List<PublicTourDto>? = null
)

data class PublicTourDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val name: String? = null,
    val title: String? = null,
    val location: String? = null,
    val departureLocation: String? = null,
    val arrivalLocation: String? = null,
    val price: Double? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val imageUrl: String? = null,
    val images: List<String>? = null,
    val rating: Double? = null,
    val companyName: String? = null,
    @SerializedName("totalCapacity") val totalCapacity: Int? = null,
    @SerializedName("filledCapacity") val filledCapacity: Int? = null,
    @SerializedName("isPurchased") val isPurchased: Boolean? = null,
    @SerializedName("purchaseId") val purchaseId: String? = null
) {
    val remainingCapacity: Int
        get() = (totalCapacity ?: 0) - (filledCapacity ?: 0)
}

data class FeaturedTourSummary(
    val id: String,
    val title: String,
    val location: String,
    val departureLocation: String,
    val arrivalLocation: String,
    val price: Double,
    val startDate: String,
    val endDate: String,
    val imagePath: String?,
    val rating: Double,
    val companyName: String,
    val isPurchased: Boolean = false,
    val purchaseId: String? = null
)

data class PlatformStatsDto(
    val userCount: Int? = null,
    val tourCount: Int? = null,
    val companyCount: Int? = null,
    val guideCount: Int? = null
)

data class PlatformStatsSummary(
    val userCount: Int,
    val tourCount: Int,
    val companyCount: Int,
    val guideCount: Int
)

data class ReviewDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val tourId: String? = null,
    val userId: String? = null,
    val userName: String? = null,
    val comment: String? = null,
    val rating: Int? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class UserTourDetailDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val title: String? = null,
    val description: String? = null,
    val price: Double? = null,
    val location: String? = null,
    val departureLocation: String? = null,
    val arrivalLocation: String? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val duration: String? = null,
    val included: List<String>? = null,
    val services: List<String>? = null,
    val places: List<String>? = null,
    val images: List<String>? = null,
    val rating: Double? = null,
    val reviewCount: Int? = null,
    val companyName: String? = null,
    val guideName: String? = null,
    val reviews: List<ReviewDto>? = null,
    @SerializedName("totalCapacity") val totalCapacity: Int? = null,
    @SerializedName("filledCapacity") val filledCapacity: Int? = null,
    val isPurchased: Boolean? = null,
    val purchaseId: String? = null
) {
    val remainingCapacity: Int
        get() = ((totalCapacity ?: 0) - (filledCapacity ?: 0)).coerceAtLeast(0)

    val isFull: Boolean
        get() = totalCapacity != null && totalCapacity > 0 && (filledCapacity ?: 0) >= totalCapacity
}

data class CreateReviewRequest(
    val comment: String,
    val rating: Int
)

data class UpdateReviewRequest(
    val comment: String,
    val rating: Int
)

data class PurchaseDataDto(
    @SerializedName("purchaseId") val purchaseId: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    @SerializedName("tourId") val tourId: String? = null,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("status") val status: String? = null
) {
    val id: String?
        get() = purchaseId ?: objectId
}
