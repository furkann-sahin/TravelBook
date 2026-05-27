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

data class GuideCompaniesUiState(
    val session: UserSession? = null,
    val companies: List<CompanyProfileSummary> = emptyList(),
    val registeredCompanyIds: Set<String> = emptySet(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isRegistering: Boolean = false,
    val infoMessage: String? = null
)

@HiltViewModel
class GuideCompaniesViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val guideRepository: GuideRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(GuideCompaniesUiState())
    val uiState: StateFlow<GuideCompaniesUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoadCompanies()
    }

    fun retry() {
        loadCompanies()
    }

    private fun observeSessionAndLoadCompanies() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session) }
                loadCompanies()
            }
        }
    }

    private fun loadCompanies() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = guideRepository.listCompanies()) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false, companies = result.data) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    fun registerToCompany(companyId: String) {
        val guideId = _uiState.value.session?.userId
        
        if (guideId.isNullOrBlank()) {
            _uiState.update { it.copy(errorMessage = "Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.") }
            return
        }
        
        viewModelScope.launch {
            _uiState.update { it.copy(isRegistering = true, errorMessage = null) }
            when (val result = guideRepository.registerToCompany(guideId, companyId)) {
                is ApiResult.Success -> {
                    _uiState.update { 
                        it.copy(
                            isRegistering = false,
                            registeredCompanyIds = it.registeredCompanyIds + companyId,
                            infoMessage = "Firmaya başarıyla kayıt olundu" 
                        ) 
                    }
                }
                is ApiResult.Error -> {
                    _uiState.update { 
                        it.copy(
                            isRegistering = false, 
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
