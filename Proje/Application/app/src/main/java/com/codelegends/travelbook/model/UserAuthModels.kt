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
    val name: String,
    val email: String,
    val password: String,
    val phone: String
)

// DTO for listing guides from user panel
data class UserGuideProfileDto(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val objectId: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val name: String? = null, // Fallback for single name field
    val email: String? = null,
    val phone: String? = null,
    val biography: String? = null,
    val profileImageUrl: String? = null,
    val languages: List<String>? = null,
    val expertRoutes: List<String>? = null,
    val experienceYears: Int? = null,
    val rating: Double? = null,
    val available: Boolean? = null
)
