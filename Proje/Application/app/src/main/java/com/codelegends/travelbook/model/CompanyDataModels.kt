package com.codelegends.travelbook.model

import com.google.gson.annotations.SerializedName

data class CompanyTourDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val name: String? = null,
    val location: String? = null,
    val departureLocation: String? = null,
    val arrivalLocation: String? = null,
    val price: Double? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val imageUrl: String? = null,
    val images: List<String>? = null,
    val services: List<String>? = null,
    val rating: Double? = null,
    val reviewCount: Int? = null
)

data class CompanyTourDetailDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val name: String? = null,
    val description: String? = null,
    val departureLocation: String? = null,
    val arrivalLocation: String? = null,
    val places: List<String>? = null,
    val price: Double? = null,
    val totalCapacity: Int? = null,
    val remainingCapacity: Int? = null,
    val startDate: String? = null,
    val endDate: String? = null,
    val imageUrl: String? = null,
    val images: List<String>? = null,
    val services: List<String>? = null,
    val rating: Double? = null,
    val reviewCount: Int? = null,
    val guide: CompanyTourGuideDto? = null
)

data class CompanyTourGuideDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val email: String? = null,
    val phone: String? = null
)

data class CreateTourRequest(
    val name: String,
    val description: String,
    val departureLocation: String,
    val arrivalLocation: String,
    val places: List<String>,
    val price: Double,
    val totalCapacity: Int,
    val startDate: String,
    val endDate: String,
    val services: List<String>,
    val guideId: String? = null
)

data class UpdateTourRequest(
    val name: String,
    val description: String,
    val departureLocation: String,
    val arrivalLocation: String,
    val places: List<String>,
    val price: Double,
    val totalCapacity: Int,
    val startDate: String,
    val endDate: String,
    val services: List<String>
)

data class CompanyProfileDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val name: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val description: String? = null,
    val rating: Double? = null,
    val tourCount: Int? = null,
    val registeredGuides: List<String>? = null,
    val profileImageUrl: String? = null,
    val bannerImageUrl: String? = null,
    val instagram: String? = null,
    val linkedin: String? = null,
    val createdAt: String? = null
)

data class CompanyProfileUpdateRequest(
    val name: String,
    val phone: String,
    val address: String,
    val description: String,
    val instagram: String,
    val linkedin: String
)

data class CompanyImageUploadDto(
    val profileImageUrl: String? = null,
    val bannerImageUrl: String? = null
)

data class CompanyGuideDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val languages: List<String>? = null,
    val expertRoutes: List<String>? = null,
    val rating: Double? = null,
    val profileImageUrl: String? = null
)

data class CompanyTourSummary(
    val id: String,
    val name: String,
    val location: String,
    val departureLocation: String,
    val arrivalLocation: String,
    val price: Double,
    val startDate: String,
    val endDate: String,
    val imagePath: String?,
    val services: List<String>,
    val rating: Double,
    val reviewCount: Int
)

data class CompanyTourDetail(
    val id: String,
    val name: String,
    val description: String,
    val departureLocation: String,
    val arrivalLocation: String,
    val places: List<String>,
    val price: Double,
    val totalCapacity: Int,
    val remainingCapacity: Int,
    val startDate: String,
    val endDate: String,
    val imagePath: String?,
    val services: List<String>,
    val rating: Double,
    val reviewCount: Int,
    val guideName: String?,
    val guideEmail: String?,
    val guidePhone: String?
)

data class CompanyProfileSummary(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val address: String,
    val description: String,
    val instagram: String,
    val linkedin: String,
    val profileImageUrl: String?,
    val bannerImageUrl: String?,
    val createdAt: String?,
    val rating: Double,
    val tourCount: Int,
    val registeredGuideCount: Int
)

data class CompanyProfileStatsSummary(
    val totalTours: Int,
    val averageRating: Double,
    val totalReviews: Int,
    val totalGuides: Int
)

data class CompanyGuideSummary(
    val id: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val languages: List<String>,
    val expertRoutes: List<String>,
    val rating: Double,
    val profileImagePath: String?
)
