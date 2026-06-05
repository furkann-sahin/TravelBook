package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.PlatformStatsSummary
import com.codelegends.travelbook.repository.PublicTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PublicAboutUiState(
    val isLoading: Boolean = true,
    val stats: PlatformStatsSummary? = null,
    val errorMessage: String? = null
)

@HiltViewModel
class PublicAboutViewModel @Inject constructor(
    private val publicTourRepository: PublicTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PublicAboutUiState())
    val uiState: StateFlow<PublicAboutUiState> = _uiState.asStateFlow()

    init {
        loadStats()
    }

    fun retry() {
        loadStats()
    }

    private fun loadStats() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            when (val result = publicTourRepository.getPlatformStats()) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            stats = result.data,
                            errorMessage = null
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            stats = null,
                            errorMessage = result.message
                        )
                    }
                }
            }
        }
    }
}
