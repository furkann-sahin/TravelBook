package com.codelegends.travelbook.model

data class ApiListEnvelope<T>(
    val status: String? = null,
    val message: String? = null,
    val data: List<T>? = null
)

data class ApiObjectEnvelope<T>(
    val status: String? = null,
    val message: String? = null,
    val data: T? = null
)
