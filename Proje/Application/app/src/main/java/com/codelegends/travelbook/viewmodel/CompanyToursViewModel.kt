package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.CompanyTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CompanyToursUiState(
    val session: UserSession? = null,
    val tours: List<CompanyTourSummary> = emptyList(),
    val isLoading: Boolean = true,
    val isLoggingOut: Boolean = false,
    val errorMessage: String? = null
)

@HiltViewModel
class CompanyToursViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CompanyToursUiState())
    val uiState: StateFlow<CompanyToursUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoadTours()
    }

    fun retry() {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            loadTours(companyId)
        }
    }

    private fun observeSessionAndLoadTours() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session, errorMessage = null) }

                if (session == null || !session.role.equals("company", ignoreCase = true)) {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            tours = emptyList()
                        )
                    }
                    return@collectLatest
                }

                loadTours(session.userId)
            }
        }
    }

    private suspend fun loadTours(companyId: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }

        when (val result = companyTourRepository.listTours(companyId)) {
            is ApiResult.Success -> {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        tours = result.data,
                        errorMessage = null
                    )
                }
            }

            is ApiResult.Error -> {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        tours = emptyList(),
                        errorMessage = result.message
                    )
                }
            }
        }
    }
}
