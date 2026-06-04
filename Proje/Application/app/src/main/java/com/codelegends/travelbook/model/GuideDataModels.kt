package com.codelegends.travelbook.model

data class GuideProfileDto(
    val id: String?,
    val objectId: String?,
    val firstName: String?,
    val lastName: String?,
    val email: String?,
    val phone: String?,
    val biography: String?,
    val profileImageUrl: String?,
    val bannerImageUrl: String?,
    val languages: List<String>?,
    val expertRoutes: List<String>?,
    val experienceYears: Int?,
    val rating: Double?,
    val totalTours: Int?,
    val available: Boolean?,
    val instagram: String?,
    val linkedin: String?,
    val galleryImages: List<String>?,
    val createdAt: String?
)

data class GuideProfileUpdateRequest(
    val firstName: String,
    val lastName: String,
    val phone: String?,
    val biography: String?,
    val languages: List<String>,
    val expertRoutes: List<String>,
    val experienceYears: Int,
    val available: Boolean,
    val instagram: String?,
    val linkedin: String?
)

data class GuideImageUploadDto(
    val profileImageUrl: String? = null,
    val bannerImageUrl: String? = null,
    val galleryImageUrl: String? = null
)

// Domain Models
data class GuideProfileSummary(
    val id: String,
    val firstName: String,
    val lastName: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val biography: String,
    val profileImageUrl: String?,
    val bannerImageUrl: String?,
    val languages: List<String>,
    val expertRoutes: List<String>,
    val experienceYears: Int,
    val rating: Double,
    val available: Boolean,
    val instagram: String,
    val linkedin: String,
    val galleryImages: List<String>,
    val createdAt: String?
)

data class GuideProfileStatsSummary(
    val totalTours: Int,
    val experienceYears: Int,
    val rating: Double
)

data class GuideCompanyRegistrationRequest(
    val companyId: String
)
