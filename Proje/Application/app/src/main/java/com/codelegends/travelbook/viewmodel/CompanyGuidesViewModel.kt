package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyGuideSummary
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

data class CompanyGuidesUiState(
    val session: UserSession? = null,
    val guides: List<CompanyGuideSummary> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null
)

@HiltViewModel
class CompanyGuidesViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CompanyGuidesUiState())
    val uiState: StateFlow<CompanyGuidesUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoadGuides()
    }

    fun retry() {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            loadGuides(companyId)
        }
    }

    private fun observeSessionAndLoadGuides() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session, errorMessage = null) }

                if (session == null || !session.role.equals("company", ignoreCase = true)) {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            guides = emptyList()
                        )
                    }
                    return@collectLatest
                }

                loadGuides(session.userId)
            }
        }
    }

    private suspend fun loadGuides(companyId: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }

        when (val result = companyTourRepository.listGuides(companyId)) {
            is ApiResult.Success -> {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        guides = result.data,
                        errorMessage = null
                    )
                }
            }

            is ApiResult.Error -> {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        guides = emptyList(),
                        errorMessage = result.message
                    )
                }
            }
        }
    }
}
