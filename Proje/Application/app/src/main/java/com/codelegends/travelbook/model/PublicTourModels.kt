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
