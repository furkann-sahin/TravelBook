package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.repository.PublicTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PublicHomeUiState(
    val isLoading: Boolean = true,
    val featuredTours: List<FeaturedTourSummary> = emptyList(),
    val errorMessage: String? = null
)

@HiltViewModel
class PublicHomeViewModel @Inject constructor(
    private val publicTourRepository: PublicTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PublicHomeUiState())
    val uiState: StateFlow<PublicHomeUiState> = _uiState.asStateFlow()

    init {
        loadFeaturedTours()
    }

    fun retry() {
        loadFeaturedTours()
    }

    private fun loadFeaturedTours() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = publicTourRepository.getFeaturedTours(limit = 4)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            featuredTours = result.data,
                            errorMessage = null
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            featuredTours = emptyList(),
                            errorMessage = result.message
                        )
                    }
                }
            }
        }
    }
}
