package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.FavoriteDto
import kotlinx.coroutines.flow.StateFlow

interface FavoriteRepository {
    val favoritesFlow: StateFlow<List<FavoriteDto>>

    suspend fun getFavorites(userId: String): ApiResult<List<FavoriteDto>>
    suspend fun addFavorite(userId: String, tourId: String): ApiResult<FavoriteDto>
    suspend fun removeFavorite(userId: String, tourId: String): ApiResult<Unit>
    
    // Cache methods for instant UI updates
    fun isFavorite(tourId: String): Boolean
    fun clearCache()
}
