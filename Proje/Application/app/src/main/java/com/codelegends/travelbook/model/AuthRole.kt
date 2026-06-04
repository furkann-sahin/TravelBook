package com.codelegends.travelbook.model

enum class AuthRole(val key: String, val displayName: String) {
    USER("user", "Kullanıcı"),
    COMPANY("company", "Firma"),
    GUIDE("guide", "Rehber");

    companion object {
        fun fromKey(key: String): AuthRole =
            entries.firstOrNull { it.key == key } ?: USER
    }
}
