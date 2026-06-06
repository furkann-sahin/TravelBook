package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.UserRepository
import com.codelegends.travelbook.util.AuthValidators
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UserLoginUiState(
    val email: String = "",
    val password: String = "",
    val isPasswordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
)

sealed interface UserLoginEvent {
    data class NavigateToHome(val session: UserSession) : UserLoginEvent
    data object NavigateToRegister : UserLoginEvent
}

@HiltViewModel
class UserLoginViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserLoginUiState())
    val uiState: StateFlow<UserLoginUiState> = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<UserLoginEvent>()
    val events: SharedFlow<UserLoginEvent> = _events.asSharedFlow()

    fun onEmailChanged(email: String) {
        _uiState.update { it.copy(email = email, errorMessage = null) }
    }

    fun onPasswordChanged(password: String) {
        _uiState.update { it.copy(password = password, errorMessage = null) }
    }

    fun onPasswordVisibilityToggled() {
        _uiState.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onRegisterClicked() {
        viewModelScope.launch {
            _events.emit(UserLoginEvent.NavigateToRegister)
        }
    }

    fun login() {
        val state = _uiState.value
        val validationError = AuthValidators.validateEmail(state.email)
            ?: AuthValidators.validatePassword(state.password)

        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            
            val result = userRepository.loginUser(
                UserLoginInput(
                    email = state.email.trim(),
                    password = state.password
                )
            )

            when (result) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false) }
                    _events.emit(UserLoginEvent.NavigateToHome(result.data))
                }
                is ApiResult.Error -> {
                    _uiState.update { 
                        it.copy(
                            isLoading = false, 
                            errorMessage = result.message 
                        ) 
                    }
                }
            }
        }
    }
}
