package com.codelegends.travelbook.core.network

/**
 * A sealed class representing the result of an API call.
 *
 * @param T The type of data expected on a successful API call.
 */
sealed interface ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>

    data class Error(
        val message: String,
        val code: Int? = null
    ) : ApiResult<Nothing>
}
