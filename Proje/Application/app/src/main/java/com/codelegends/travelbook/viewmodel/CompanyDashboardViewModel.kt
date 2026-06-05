package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
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

data class CompanyDashboardUiState(
    val session: UserSession? = null,
    val isLoading: Boolean = true,
    val isLoggingOut: Boolean = false,
    val errorMessage: String? = null,
    val totalTours: Int = 0,
    val averageRating: Double = 0.0,
    val totalReviews: Int = 0,
    val totalGuides: Int = 0
)

@HiltViewModel
class CompanyDashboardViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CompanyDashboardUiState())
    val uiState: StateFlow<CompanyDashboardUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoad()
    }

    fun retry() {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            loadDashboard(companyId)
        }
    }

    private fun observeSessionAndLoad() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update {
                    it.copy(
                        session = session,
                        errorMessage = null
                    )
                }

                if (session == null || !session.role.equals("company", ignoreCase = true)) {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            totalTours = 0,
                            averageRating = 0.0,
                            totalReviews = 0,
                            totalGuides = 0
                        )
                    }
                    return@collectLatest
                }

                loadDashboard(session.userId)
            }
        }
    }

    private suspend fun loadDashboard(companyId: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }

        val toursResult = companyTourRepository.listTours(companyId)
        val profileResult = companyTourRepository.getCompanyProfile(companyId)

        when (toursResult) {
            is ApiResult.Success -> {
                val tours = toursResult.data
                val ratedTours = tours.filter { it.rating > 0.0 }
                val avgRating = if (ratedTours.isEmpty()) {
                    0.0
                } else {
                    ratedTours.sumOf { it.rating } / ratedTours.size
                }

                val guideCount = when (profileResult) {
                    is ApiResult.Success -> profileResult.data.registeredGuideCount
                    is ApiResult.Error -> 0
                }

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = null,
                        totalTours = tours.size,
                        averageRating = avgRating,
                        totalReviews = tours.sumOf { tour -> tour.reviewCount },
                        totalGuides = guideCount
                    )
                }
            }

            is ApiResult.Error -> {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = toursResult.message,
                        totalTours = 0,
                        averageRating = 0.0,
                        totalReviews = 0,
                        totalGuides = 0
                    )
                }
            }
        }
    }
}
