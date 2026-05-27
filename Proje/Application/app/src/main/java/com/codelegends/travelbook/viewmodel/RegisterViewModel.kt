package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.AuthRole
import com.codelegends.travelbook.model.CompanyRegisterInput
import com.codelegends.travelbook.model.GuideRegisterInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.usecase.CompanyRegisterUseCase
import com.codelegends.travelbook.usecase.GuideRegisterUseCase
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

data class RegisterUiState(
    val selectedRoleIndex: Int = 1,
    // Common
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val phone: String = "",
    // Company
    val name: String = "",
    val address: String = "",
    val description: String = "",
    // Guide
    val firstName: String = "",
    val lastName: String = "",
    val biography: String = "",
    val languages: String = "",
    val expertRoutes: String = "",
    val experienceYears: String = "",
    val instagram: String = "",
    val linkedin: String = "",

    val isPasswordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

sealed interface RegisterEvent {
    data object NavigateToLogin : RegisterEvent
    data class NavigateToHome(val session: UserSession) : RegisterEvent
    data object NavigateBack : RegisterEvent
}

@HiltViewModel
class RegisterViewModel @Inject constructor(
    private val companyRegisterUseCase: CompanyRegisterUseCase,
    private val guideRegisterUseCase: GuideRegisterUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<RegisterEvent>()
    val events: SharedFlow<RegisterEvent> = _events.asSharedFlow()

    fun onRoleSelected(index: Int) =
        _uiState.update { it.copy(selectedRoleIndex = index, errorMessage = null) }

    fun onNameChanged(v: String) = _uiState.update { it.copy(name = v, errorMessage = null) }

    fun onEmailChanged(v: String) = _uiState.update { it.copy(email = v, errorMessage = null) }

    fun onPasswordChanged(v: String) =
        _uiState.update { it.copy(password = v, errorMessage = null) }

    fun onConfirmPasswordChanged(v: String) =
        _uiState.update { it.copy(confirmPassword = v, errorMessage = null) }

    fun onPhoneChanged(v: String) = _uiState.update { it.copy(phone = v, errorMessage = null) }

    fun onAddressChanged(v: String) = _uiState.update { it.copy(address = v, errorMessage = null) }

    fun onDescriptionChanged(v: String) =
        _uiState.update { it.copy(description = v, errorMessage = null) }

    // Guide Handlers
    fun onFirstNameChanged(v: String) = _uiState.update { it.copy(firstName = v, errorMessage = null) }
    fun onLastNameChanged(v: String) = _uiState.update { it.copy(lastName = v, errorMessage = null) }
    fun onBiographyChanged(v: String) = _uiState.update { it.copy(biography = v, errorMessage = null) }
    fun onLanguagesChanged(v: String) = _uiState.update { it.copy(languages = v, errorMessage = null) }
    fun onExpertRoutesChanged(v: String) = _uiState.update { it.copy(expertRoutes = v, errorMessage = null) }
    fun onExperienceYearsChanged(v: String) = _uiState.update { it.copy(experienceYears = v, errorMessage = null) }
    fun onInstagramChanged(v: String) = _uiState.update { it.copy(instagram = v, errorMessage = null) }
    fun onLinkedinChanged(v: String) = _uiState.update { it.copy(linkedin = v, errorMessage = null) }

    fun onPasswordVisibilityToggled() =
        _uiState.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }

    fun onLoginClicked() = viewModelScope.launch { _events.emit(RegisterEvent.NavigateToLogin) }

    fun onBackClicked() = viewModelScope.launch { _events.emit(RegisterEvent.NavigateBack) }

    fun submit() {
        val state = _uiState.value
        val role = AuthRole.entries[state.selectedRoleIndex]

        when (role) {
            AuthRole.COMPANY -> submitCompany(state)
            AuthRole.GUIDE -> submitGuide(state)
            else -> {
                _uiState.update {
                    it.copy(errorMessage = "Bu rol için kayıt desteği yakında eklenecek")
                }
            }
        }
    }

    private fun submitCompany(state: RegisterUiState) {
        val validationError = validateCompanyForm(state)
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = companyRegisterUseCase(
                CompanyRegisterInput(
                    name = state.name.trim(),
                    email = state.email.trim(),
                    password = state.password,
                    phone = state.phone.trim(),
                    address = state.address.trim(),
                    description = state.description.trim()
                )
            )
            handleResult(result)
        }
    }

    private fun submitGuide(state: RegisterUiState) {
        val validationError = validateGuideForm(state)
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val result = guideRegisterUseCase(
                GuideRegisterInput(
                    firstName = state.firstName.trim(),
                    lastName = state.lastName.trim(),
                    email = state.email.trim(),
                    password = state.password,
                    phone = state.phone.trim().ifBlank { null },
                    biography = state.biography.trim().ifBlank { null },
                    languages = state.languages.split(",").map { it.trim() }.filter { it.isNotBlank() },
                    expertRoutes = state.expertRoutes.split(",").map { it.trim() }.filter { it.isNotBlank() },
                    experienceYears = state.experienceYears.toIntOrNull() ?: 0,
                    instagram = state.instagram.trim().ifBlank { null },
                    linkedin = state.linkedin.trim().ifBlank { null }
                )
            )
            handleResult(result)
        }
    }

    private suspend fun handleResult(result: ApiResult<UserSession>) {
        when (result) {
            is ApiResult.Success -> {
                _uiState.update { it.copy(isLoading = false) }
                _events.emit(RegisterEvent.NavigateToHome(result.data))
            }
            is ApiResult.Error -> {
                _uiState.update {
                    it.copy(isLoading = false, errorMessage = result.message)
                }
            }
        }
    }

    private fun validateGuideForm(state: RegisterUiState): String? {
        if (state.firstName.isBlank()) return "Ad zorunludur"
        if (state.lastName.isBlank()) return "Soyad zorunludur"
        AuthValidators.validateEmail(state.email)?.let { return it }
        AuthValidators.validatePassword(state.password)?.let { return it }
        if (state.password != state.confirmPassword) return "Şifreler eşleşmiyor"
        return null
    }

    private fun validateCompanyForm(state: RegisterUiState): String? {
        if (state.name.isBlank()) return "Firma adı zorunludur"
        if (state.name.trim().length < 2) return "Firma adı en az 2 karakter olmalı"
        AuthValidators.validateEmail(state.email)?.let { return it }
        AuthValidators.validatePassword(state.password)?.let { return it }
        if (state.password != state.confirmPassword) return "Şifreler eşleşmiyor"
        if (state.phone.isBlank()) return "Telefon zorunludur"
        if (state.address.isBlank()) return "Adres zorunludur"
        if (state.description.isBlank()) return "Açıklama zorunludur"
        return null
    }
}
