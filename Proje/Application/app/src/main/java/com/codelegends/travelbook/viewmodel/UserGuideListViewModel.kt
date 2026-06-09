package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.GuideProfileSummary
import com.codelegends.travelbook.repository.GuideRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UserGuideListUiState(
    val guides: List<GuideProfileSummary> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class UserGuideListViewModel @Inject constructor(
    private val guideRepository: GuideRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserGuideListUiState())
    val uiState: StateFlow<UserGuideListUiState> = _uiState.asStateFlow()

    init {
        fetchGuides()
    }

    fun fetchGuides() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = guideRepository.getAllGuides()) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(guides = result.data, isLoading = false) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(errorMessage = result.message, isLoading = false) }
                }
            }
        }
    }
}
