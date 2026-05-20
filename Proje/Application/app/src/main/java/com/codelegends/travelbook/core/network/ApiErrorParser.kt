package com.codelegends.travelbook.core.network

import org.json.JSONObject

object ApiErrorParser {
    fun parse(rawBody: String?, fallbackMessage: String): String {
        if (rawBody.isNullOrBlank()) return fallbackMessage

        return try {
            val json = JSONObject(rawBody)
            val message = json.optString("message").takeIf { it.isNotBlank() }
                ?: json.optString("error").takeIf { it.isNotBlank() }

            message ?: fallbackMessage
        } catch (_: Exception) {
            fallbackMessage
        }
    }
}
