package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.AuthRole
import com.codelegends.travelbook.model.CompanyLoginInput
import com.codelegends.travelbook.model.GuideLoginInput
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.UserRepository
import com.codelegends.travelbook.usecase.CompanyLoginUseCase
import com.codelegends.travelbook.usecase.GuideLoginUseCase
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

data class LoginUiState(
    val selectedRoleIndex: Int = 1,
    val email: String = "",
    val password: String = "",
    val isPasswordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

sealed interface LoginEvent {
    data object NavigateToRegister : LoginEvent
    data class NavigateToHome(val session: UserSession) : LoginEvent
    data object NavigateBack : LoginEvent
}

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val companyLoginUseCase: CompanyLoginUseCase,
    private val guideLoginUseCase: GuideLoginUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<LoginEvent>()
    val events: SharedFlow<LoginEvent> = _events.asSharedFlow()

    fun onRoleSelected(index: Int) =
        _uiState.update { it.copy(selectedRoleIndex = index, errorMessage = null) }

    fun onEmailChanged(email: String) =
        _uiState.update { it.copy(email = email, errorMessage = null) }

    fun onPasswordChanged(password: String) =
        _uiState.update { it.copy(password = password, errorMessage = null) }

    fun onPasswordVisibilityToggled() =
        _uiState.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }

    fun onRegisterClicked() = viewModelScope.launch { _events.emit(LoginEvent.NavigateToRegister) }

    fun onBackClicked() = viewModelScope.launch { _events.emit(LoginEvent.NavigateBack) }

    fun submit() {
        val state = _uiState.value
        val role = AuthRole.entries[state.selectedRoleIndex]

        when (role) {
            AuthRole.USER -> submitUser(state)
            AuthRole.COMPANY -> submitCompany(state)
            AuthRole.GUIDE -> submitGuide(state)
        }
    }

    private fun submitUser(state: LoginUiState) {
        val validationError = validateForm(state)
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
            handleResult(result)
        }
    }

    private fun submitCompany(state: LoginUiState) {
        val validationError = validateForm(state)
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = companyLoginUseCase(
                CompanyLoginInput(
                    email = state.email.trim(),
                    password = state.password
                )
            )
            handleResult(result)
        }
    }

    private fun submitGuide(state: LoginUiState) {
        val validationError = validateForm(state)
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = guideLoginUseCase(
                GuideLoginInput(
                    email = state.email.trim(),
                    password = state.password
                )
            )
            handleResult(result)
        }
    }

    private suspend fun handleResult(result: ApiResult<UserSession>) {
        when (result) {
            is ApiResult.Success -> {
                _uiState.update { it.copy(isLoading = false) }
                _events.emit(LoginEvent.NavigateToHome(result.data))
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

    private fun validateForm(state: LoginUiState): String? {
        return AuthValidators.validateEmail(state.email)
            ?: AuthValidators.validatePassword(state.password)
    }
}
