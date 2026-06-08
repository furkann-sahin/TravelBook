package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.repository.FavoriteRepository
import com.codelegends.travelbook.repository.PublicTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TourListingUiState(
    val tours: List<FeaturedTourSummary> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    // Filters
    val location: String = "",
    val minPrice: String = "",
    val maxPrice: String = "",
    val startDate: String = "",
    val endDate: String = "",
    // Favorites
    val favoriteTourIds: Set<String> = emptySet(),
    val snackbarMessage: String? = null,
    val currentUserId: String? = null,
    val togglingFavoriteId: String? = null
)

@HiltViewModel
class TourListingViewModel @Inject constructor(
    private val publicTourRepository: PublicTourRepository,
    private val favoriteRepository: FavoriteRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(TourListingUiState())
    val uiState: StateFlow<TourListingUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            _uiState.update { it.copy(currentUserId = session?.userId) }
            refreshFavorites()
            fetchTours()
        }
    }

    private fun refreshFavorites() {
        val userId = _uiState.value.currentUserId ?: return
        viewModelScope.launch {
            when (val result = favoriteRepository.getFavorites(userId)) {
                is ApiResult.Success -> {
                    val ids = result.data.mapNotNull { it.tourId }.toSet()
                    _uiState.update { it.copy(favoriteTourIds = ids) }
                }
                else -> {
                    // Cache'den yükle (Eğer API hatası varsa veya cache zaten doluysa)
                    val cachedIds = _uiState.value.tours.map { it.id }.filter { favoriteRepository.isFavorite(it) }.toSet()
                    if (cachedIds.isNotEmpty()) {
                        _uiState.update { it.copy(favoriteTourIds = cachedIds) }
                    }
                }
            }
        }
    }

    fun toggleFavorite(tourId: String) {
        val userId = _uiState.value.currentUserId ?: return
        val isFavorite = _uiState.value.favoriteTourIds.contains(tourId)

        viewModelScope.launch {
            _uiState.update { it.copy(togglingFavoriteId = tourId) }
            
            val result = if (isFavorite) {
                favoriteRepository.removeFavorite(userId, tourId)
            } else {
                when (val addRes = favoriteRepository.addFavorite(userId, tourId)) {
                    is ApiResult.Success -> ApiResult.Success(Unit)
                    is ApiResult.Error -> ApiResult.Error(addRes.message, addRes.code)
                }
            }

            when (result) {
                is ApiResult.Success -> {
                    _uiState.update { state ->
                        val newIds = if (isFavorite) {
                            state.favoriteTourIds - tourId
                        } else {
                            state.favoriteTourIds + tourId
                        }
                        state.copy(
                            favoriteTourIds = newIds,
                            togglingFavoriteId = null,
                            snackbarMessage = if (isFavorite) "Favorilerden kaldırıldı" else "Favorilere eklendi"
                        )
                    }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(snackbarMessage = result.message, togglingFavoriteId = null) }
                }
            }
        }
    }

    fun dismissSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }

    fun onLocationChanged(value: String) {
        _uiState.update { it.copy(location = value) }
    }

    fun onMinPriceChanged(value: String) {
        _uiState.update { it.copy(minPrice = value) }
    }

    fun onMaxPriceChanged(value: String) {
        _uiState.update { it.copy(maxPrice = value) }
    }

    fun onStartDateChanged(value: String) {
        _uiState.update { it.copy(startDate = value) }
    }

    fun onEndDateChanged(value: String) {
        _uiState.update { it.copy(endDate = value) }
    }

    fun applyFilters() {
        fetchTours()
    }

    fun clearFilters() {
        _uiState.update {
            it.copy(
                location = "",
                minPrice = "",
                maxPrice = "",
                startDate = "",
                endDate = ""
            )
        }
        fetchTours()
    }

    fun fetchTours() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val state = _uiState.value
            val result = publicTourRepository.getFilteredTours(
                location = state.location.ifBlank { null },
                minPrice = state.minPrice.toDoubleOrNull(),
                maxPrice = state.maxPrice.toDoubleOrNull(),
                startDate = state.startDate.ifBlank { null },
                endDate = state.endDate.ifBlank { null }
            )

            when (result) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(tours = result.data, isLoading = false) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(errorMessage = result.message, isLoading = false) }
                }
            }
        }
    }
}
