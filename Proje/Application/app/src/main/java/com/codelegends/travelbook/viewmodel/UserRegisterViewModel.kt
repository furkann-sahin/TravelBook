package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.UserRegisterInput
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

data class UserRegisterUiState(
    val firstName: String = "",
    val lastName: String = "",
    val email: String = "",
    val phone: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
)

sealed interface UserRegisterEvent {
    data class NavigateToHome(val session: UserSession) : UserRegisterEvent
    data object NavigateToLogin : UserRegisterEvent
}

@HiltViewModel
class UserRegisterViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserRegisterUiState())
    val uiState: StateFlow<UserRegisterUiState> = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<UserRegisterEvent>()
    val events: SharedFlow<UserRegisterEvent> = _events.asSharedFlow()

    fun onFirstNameChanged(name: String) {
        _uiState.update { it.copy(firstName = name, errorMessage = null) }
    }

    fun onLastNameChanged(name: String) {
        _uiState.update { it.copy(lastName = name, errorMessage = null) }
    }

    fun onEmailChanged(email: String) {
        _uiState.update { it.copy(email = email, errorMessage = null) }
    }

    fun onPhoneChanged(phone: String) {
        _uiState.update { it.copy(phone = phone, errorMessage = null) }
    }

    fun onPasswordChanged(password: String) {
        _uiState.update { it.copy(password = password, errorMessage = null) }
    }

    fun onLoginClicked() {
        viewModelScope.launch {
            _events.emit(UserRegisterEvent.NavigateToLogin)
        }
    }

    fun register() {
        val state = _uiState.value
        
        val validationError = when {
            state.firstName.isBlank() -> "Ad zorunludur"
            state.lastName.isBlank() -> "Soyad zorunludur"
            state.phone.isBlank() -> "Telefon numarası zorunludur"
            else -> AuthValidators.validateEmail(state.email)
                ?: AuthValidators.validatePassword(state.password)
        }

        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val result = userRepository.registerUser(
                UserRegisterInput(
                    firstName = state.firstName.trim(),
                    lastName = state.lastName.trim(),
                    email = state.email.trim(),
                    password = state.password,
                    phone = state.phone.trim()
                )
            )

            when (result) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false) }
                    _events.emit(UserRegisterEvent.NavigateToHome(result.data))
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
