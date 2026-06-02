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

data class TourListingUiState(
    val tours: List<FeaturedTourSummary> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    // Filters
    val location: String = "",
    val minPrice: String = "",
    val maxPrice: String = "",
    val startDate: String = "",
    val endDate: String = ""
)

@HiltViewModel
class TourListingViewModel @Inject constructor(
    private val publicTourRepository: PublicTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TourListingUiState())
    val uiState: StateFlow<TourListingUiState> = _uiState.asStateFlow()

    init {
        fetchTours()
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
