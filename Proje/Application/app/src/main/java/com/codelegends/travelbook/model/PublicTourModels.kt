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
    val companyName: String? = null
)

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
    val companyName: String
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
    val reviews: List<ReviewDto>? = null
)

data class CreateReviewRequest(
    val comment: String,
    val rating: Int
)

data class UpdateReviewRequest(
    val comment: String,
    val rating: Int
)
