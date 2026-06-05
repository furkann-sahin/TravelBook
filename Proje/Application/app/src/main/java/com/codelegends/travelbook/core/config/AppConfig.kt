package com.codelegends.travelbook.core.config

import com.codelegends.travelbook.BuildConfig

object AppConfig {
    val apiBaseUrl: String = BuildConfig.API_BASE_URL.ensureTrailingSlash()
    val backendOrigin: String = apiBaseUrl.removeSuffix("api/").removeSuffix("/")

    const val CONNECT_TIMEOUT_SECONDS: Long = 30
    const val READ_TIMEOUT_SECONDS: Long = 30
    const val WRITE_TIMEOUT_SECONDS: Long = 30

    fun resolveImageUrl(path: String?): String? {
        if (path.isNullOrBlank()) return null
        return if (path.startsWith("http")) {
            path
        } else {
            "$backendOrigin${if (path.startsWith('/')) path else "/$path"}"
        }
    }
}

private fun String.ensureTrailingSlash(): String =
    if (endsWith('/')) this else "$this/"
