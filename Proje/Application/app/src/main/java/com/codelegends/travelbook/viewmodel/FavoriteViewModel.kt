package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.FavoriteDto
import com.codelegends.travelbook.repository.FavoriteRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FavoriteUiState(
    val favorites: List<FavoriteDto> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val snackbarMessage: String? = null,
    val currentUserId: String? = null
)

@HiltViewModel
class FavoriteViewModel @Inject constructor(
    private val favoriteRepository: FavoriteRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(FavoriteUiState())
    val uiState: StateFlow<FavoriteUiState> = _uiState.asStateFlow()

    init {
        loadFavorites()
    }

    fun loadFavorites() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val session = sessionManager.sessionFlow.firstOrNull()
            val userId = session?.userId
            
            if (userId == null) {
                _uiState.update { it.copy(isLoading = false, errorMessage = "Kullanıcı oturumu bulunamadı") }
                return@launch
            }

            _uiState.update { it.copy(currentUserId = userId) }
            
            // Veri gelmeden önce cache'i temizle ve API'den taze veriyi çek
            favoriteRepository.getFavorites(userId)

            when (val result = favoriteRepository.getFavorites(userId)) {
                is ApiResult.Success -> {
                    // tourId null olanları filtrele (Bozuk veri koruması)
                    val validFavorites = result.data.filter { it.tourId != null && it.tour != null }
                    _uiState.update { it.copy(favorites = validFavorites, isLoading = false) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(errorMessage = result.message, isLoading = false) }
                }
            }
        }
    }

    fun removeFavorite(tourId: String) {
        val userId = _uiState.value.currentUserId ?: return
        viewModelScope.launch {
            when (val result = favoriteRepository.removeFavorite(userId, tourId)) {
                is ApiResult.Success -> {
                    _uiState.update { state ->
                        state.copy(
                            favorites = state.favorites.filter { it.tourId != tourId },
                            snackbarMessage = "Favorilerden kaldırıldı"
                        )
                    }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(snackbarMessage = result.message) }
                }
            }
        }
    }

    fun dismissSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }
}
