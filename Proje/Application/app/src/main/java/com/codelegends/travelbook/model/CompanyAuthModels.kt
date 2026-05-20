package com.codelegends.travelbook.model

data class CompanyLoginInput(
    val email: String,
    val password: String
)

data class CompanyRegisterInput(
    val name: String,
    val email: String,
    val password: String,
    val phone: String,
    val address: String,
    val description: String
)
