package com.codelegends.travelbook.model

data class CompanyLoginRequestDto(
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

data class AuthResponseDto(
    val status: String? = null,
    val message: String? = null,
    val statusCode: Int? = null,
    val token: String? = null
)