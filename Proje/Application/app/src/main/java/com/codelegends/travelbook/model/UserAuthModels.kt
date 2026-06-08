package com.codelegends.travelbook.model

import com.google.gson.annotations.SerializedName

// Domain layer model
data class UserLoginInput(
    val email: String,
    val password: String
)

// API layer model
data class UserLoginRequestDto(
    val email: String,
    val password: String
)

data class UserRegisterInput(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val phone: String
)

data class UserRegisterRequestDto(
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("phone") val phone: String
)

// DTO for listing guides from user panel
data class UserGuideProfileDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    @SerializedName("firstName") val firstName: String? = null,
    @SerializedName("lastName") val lastName: String? = null,
    @SerializedName("name") val name: String? = null, // Fallback for single name field
    @SerializedName("email") val email: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("biography") val biography: String? = null,
    @SerializedName("profileImageUrl") val profileImageUrl: String? = null,
    @SerializedName("languages") val languages: List<String>? = null,
    @SerializedName("expertRoutes") val expertRoutes: List<String>? = null,
    @SerializedName("experienceYears") val experienceYears: Int? = null,
    @SerializedName("rating") val rating: Double? = null,
    @SerializedName("available") val available: Boolean? = null
)

data class UserProfileDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("firstName") val firstName: String? = null,
    @SerializedName("lastName") val lastName: String? = null,
    @SerializedName("name") val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null
)

data class UpdateProfileRequestDto(
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("phone") val phone: String
)

data class UpdatePasswordRequestDto(
    val currentPassword: String,
    val newPassword: String
)
