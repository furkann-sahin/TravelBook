package com.codelegends.travelbook.core.auth

import android.util.Base64
import org.json.JSONObject

data class JwtPayload(
    val id: String?,
    val name: String?,
    val email: String?,
    val role: String?,
    val exp: Long?
)

object JwtDecoder {
    fun decode(token: String): JwtPayload? {
        val parts = token.split('.')
        if (parts.size < 2) return null

        return try {
            val payloadPart = parts[1]
            val paddedPayload =
                payloadPart.padEnd(payloadPart.length + (4 - payloadPart.length % 4) % 4, '=')
            val decodedBytes = Base64.decode(paddedPayload, Base64.URL_SAFE)
            val json = JSONObject(String(decodedBytes, Charsets.UTF_8))

            JwtPayload(
                id = json.optNullableString("id"),
                name = json.optNullableString("name"),
                email = json.optNullableString("email"),
                role = json.optNullableString("role"),
                exp = if (json.has("exp")) json.optLong("exp") else null
            )
        } catch (_: Exception) {
            null
        }
    }

    private fun JSONObject.optNullableString(key: String): String? {
        val value = optString(key)
        return value.takeIf { it.isNotBlank() }
    }
}
