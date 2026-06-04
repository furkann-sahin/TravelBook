package com.codelegends.travelbook.model

// Represents the user's session information after successful authentication
data class UserSession(
    val token: String,
    val userId: String,
    val name: String,
    val email: String,
    val role: String,
    val expiresAtEpochSeconds: Long?
)
