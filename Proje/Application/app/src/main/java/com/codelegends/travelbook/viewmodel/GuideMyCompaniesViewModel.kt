package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyProfileSummary
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

data class GuideMyCompaniesUiState(
    val session: UserSession? = null,
    val myCompanies: List<CompanyProfileSummary> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isRemoving: Boolean = false,
    val infoMessage: String? = null
)

@HiltViewModel
class GuideMyCompaniesViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val guideRepository: GuideRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(GuideMyCompaniesUiState())
    val uiState: StateFlow<GuideMyCompaniesUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoad()
    }

    fun retry() {
        loadMyCompanies()
    }

    private fun observeSessionAndLoad() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session) }
                loadMyCompanies()
            }
        }
    }

    private fun loadMyCompanies() {
        val guideId = _uiState.value.session?.userId ?: return
        
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = guideRepository.listMyCompanies(guideId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false, myCompanies = result.data) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    fun removeFromCompany(companyId: String) {
        val guideId = _uiState.value.session?.userId ?: return
        
        viewModelScope.launch {
            _uiState.update { it.copy(isRemoving = true) }
            when (val result = guideRepository.removeFromCompany(guideId, companyId)) {
                is ApiResult.Success -> {
                    _uiState.update { 
                        it.copy(
                            isRemoving = false, 
                            infoMessage = "Kayıt başarıyla silindi" 
                        ) 
                    }
                    loadMyCompanies()
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
