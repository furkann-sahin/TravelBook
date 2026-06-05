package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.GuideRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class GuideMyToursUiState(
    val session: UserSession? = null,
    val tours: List<CompanyTourSummary> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isRemoving: Boolean = false,
    val infoMessage: String? = null
)

@HiltViewModel
class GuideMyToursViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val guideRepository: GuideRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(GuideMyToursUiState())
    val uiState: StateFlow<GuideMyToursUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoad()
    }

    fun retry() {
        loadTours()
    }

    private fun observeSessionAndLoad() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session) }
                loadTours()
            }
        }
    }

    private fun loadTours() {
        val guideId = _uiState.value.session?.userId ?: return
        
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = guideRepository.listMyTours(guideId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false, tours = result.data) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    fun removeRegistration(tourId: String) {
        val guideId = _uiState.value.session?.userId ?: return
        
        viewModelScope.launch {
            _uiState.update { it.copy(isRemoving = true) }
            when (val result = guideRepository.removeTourRegistration(guideId, tourId)) {
                is ApiResult.Success -> {
                    _uiState.update { 
                        it.copy(
                            isRemoving = false, 
                            infoMessage = "Tur kaydı başarıyla silindi" 
                        ) 
                    }
                    loadTours()
                }
                is ApiResult.Error -> {
                    _uiState.update { 
                        it.copy(
                            isRemoving = false, 
                            errorMessage = result.message 
                        ) 
                    }
                }
            }
        }
    }

    fun consumeInfoMessage() {
        _uiState.update { it.copy(infoMessage = null) }
    }
}
