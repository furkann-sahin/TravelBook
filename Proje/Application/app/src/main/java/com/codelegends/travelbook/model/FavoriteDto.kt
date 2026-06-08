package com.codelegends.travelbook.model

import com.google.gson.annotations.SerializedName

data class FavoriteDto(
    @SerializedName("_id") val id: String? = null,
    val userId: String? = null,
    val tourId: String? = null,
    val tour: PublicTourDto? = null,
    val createdAt: String? = null
)

data class AddFavoriteRequest(
    val tourId: String
)
