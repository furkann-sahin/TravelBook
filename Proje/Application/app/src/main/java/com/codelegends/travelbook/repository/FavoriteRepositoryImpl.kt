package com.codelegends.travelbook.repository

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.codelegends.travelbook.core.network.ApiErrorParser
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.AddFavoriteRequest
import com.codelegends.travelbook.model.FavoriteDto
import com.codelegends.travelbook.service.TourApiService
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.favoriteDataStore by preferencesDataStore(name = "travelbook_favorites")

@Singleton
class FavoriteRepositoryImpl @Inject constructor(
    private val tourApiService: TourApiService,
    @ApplicationContext private val context: Context
) : FavoriteRepository {

    private val gson = Gson()
    private val favoritesKey = stringPreferencesKey("favorite_list")
    private val repositoryScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _favoritesFlow = MutableStateFlow<List<FavoriteDto>>(emptyList())
    override val favoritesFlow: StateFlow<List<FavoriteDto>> = _favoritesFlow.asStateFlow()

    init {
        loadFromDataStore()
    }

    private fun loadFromDataStore() {
        repositoryScope.launch {
            try {
                val json = context.favoriteDataStore.data.map { it[favoritesKey] }.first()
                if (!json.isNullOrBlank()) {
                    val type = object : TypeToken<List<FavoriteDto>>() {}.type
                    val list: List<FavoriteDto> = gson.fromJson(json, type)
                    _favoritesFlow.value = list
                }
            } catch (e: Exception) {
                // Ignore load errors
            }
        }
    }

    private suspend fun saveToDataStore(list: List<FavoriteDto>) {
        try {
            val json = gson.toJson(list)
            context.favoriteDataStore.edit { it[favoritesKey] = json }
        } catch (e: Exception) {
            // Ignore save errors
        }
    }

    override suspend fun getFavorites(userId: String): ApiResult<List<FavoriteDto>> {
        return try {
            val response = tourApiService.getFavorites(userId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favoriler yüklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            val data = response.body()?.data.orEmpty()
            
            _favoritesFlow.value = data
            saveToDataStore(data)
            
            ApiResult.Success(data)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun addFavorite(userId: String, tourId: String): ApiResult<FavoriteDto> {
        return try {
            val response = tourApiService.addFavorite(userId, AddFavoriteRequest(tourId))
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favorilere eklenemedi"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            val data = response.body()?.data ?: return ApiResult.Error("İşlem başarısız")
            
            val currentList = _favoritesFlow.value.toMutableList()
            if (currentList.none { it.tourId == tourId }) {
                currentList.add(data)
                _favoritesFlow.value = currentList
                saveToDataStore(currentList)
            }

            ApiResult.Success(data)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override suspend fun removeFavorite(userId: String, tourId: String): ApiResult<Unit> {
        return try {
            val response = tourApiService.removeFavorite(userId, tourId)
            if (!response.isSuccessful) {
                val message = ApiErrorParser.parse(
                    rawBody = response.errorBody()?.string(),
                    fallbackMessage = "Favorilerden kaldırılamadı"
                )
                return ApiResult.Error(message = message, code = response.code())
            }
            
            val currentList = _favoritesFlow.value.toMutableList()
            val removed = currentList.removeAll { it.tourId == tourId }
            if (removed) {
                _favoritesFlow.value = currentList
                saveToDataStore(currentList)
            }
            
            ApiResult.Success(Unit)
        } catch (e: IOException) {
            ApiResult.Error("Bağlantı hatası")
        } catch (e: Exception) {
            ApiResult.Error(e.message ?: "Beklenmeyen bir hata oluştu")
        }
    }

    override fun isFavorite(tourId: String): Boolean {
        return _favoritesFlow.value.any { it.tourId == tourId }
    }

    override fun clearCache() {
        _favoritesFlow.value = emptyList()
        repositoryScope.launch {
            context.favoriteDataStore.edit { it.clear() }
        }
    }
}
