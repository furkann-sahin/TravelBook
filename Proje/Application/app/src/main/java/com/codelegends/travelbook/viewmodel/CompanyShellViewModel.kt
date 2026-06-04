package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UserSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CompanyShellUiState(
    val session: UserSession? = null,
    val isLoggingOut: Boolean = false
)

@HiltViewModel
class CompanyShellViewModel @Inject constructor(
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(CompanyShellUiState())
    val uiState: StateFlow<CompanyShellUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            sessionManager.sessionFlow.collect { session ->
                _uiState.update { it.copy(session = session) }
            }
        }
    }

    fun logout(onLoggedOut: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoggingOut = true) }
            sessionManager.clearSession()
            _uiState.update { it.copy(isLoggingOut = false) }
            onLoggedOut()
        }
    }
}
