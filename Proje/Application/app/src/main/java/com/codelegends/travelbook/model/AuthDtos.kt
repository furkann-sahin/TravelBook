package com.codelegends.travelbook.model

data class CompanyLoginRequestDto(
    val email: String,
    val password: String
)

data class GuideLoginRequestDto(
    val email: String,
    val password: String
)

data class CompanyRegisterRequestDto(
    val name: String,
    val email: String,
    val password: String,
    val phone: String,
    val address: String,
    val description: String
)

data class GuideRegisterRequestDto(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val phone: String? = null,
    val biography: String? = null,
    val languages: List<String> = emptyList(),
    val expertRoutes: List<String> = emptyList(),
    val experienceYears: Int = 0,
    val instagram: String? = null,
    val linkedin: String? = null
)

data class AuthResponseDto(
    val status: String? = null,
    val message: String? = null,
    val statusCode: Int? = null,
    val token: String? = null
)