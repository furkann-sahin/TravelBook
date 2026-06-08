package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UserPurchaseDto
import com.codelegends.travelbook.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UserPurchasesUiState(
    val isLoading: Boolean = false,
    val futurePurchases: List<UserPurchaseDto> = emptyList(),
    val pastPurchases: List<UserPurchaseDto> = emptyList(),
    val errorMessage: String? = null
)

@HiltViewModel
class UserPurchasesViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserPurchasesUiState())
    val uiState: StateFlow<UserPurchasesUiState> = _uiState.asStateFlow()

    init {
        loadPurchases()
    }

    fun loadPurchases() {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val userId = session?.userId
            if (userId.isNullOrBlank()) {
                _uiState.update { it.copy(errorMessage = "Oturum bulunamadı") }
                return@launch
            }

            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val futureResult = userRepository.getUserPurchases(userId, "future")
            val pastResult = userRepository.getUserPurchases(userId, "past")

            if (futureResult is ApiResult.Success && pastResult is ApiResult.Success) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        futurePurchases = futureResult.data,
                        pastPurchases = pastResult.data
                    )
                }
            } else {
                val error = (futureResult as? ApiResult.Error)?.message
                    ?: (pastResult as? ApiResult.Error)?.message
                    ?: "Seyahat bilgileri alınamadı"
                _uiState.update { it.copy(isLoading = false, errorMessage = error) }
            }
        }
    }
}
