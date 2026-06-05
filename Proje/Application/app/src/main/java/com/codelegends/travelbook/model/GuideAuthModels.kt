package com.codelegends.travelbook.model

data class GuideRegisterInput(
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
