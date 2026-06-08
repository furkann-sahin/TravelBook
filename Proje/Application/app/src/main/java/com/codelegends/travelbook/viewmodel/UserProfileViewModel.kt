package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UpdatePasswordRequestDto
import com.codelegends.travelbook.model.UserProfileDto
import com.codelegends.travelbook.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UserProfileUiState(
    val isLoading: Boolean = false,
    val profile: UserProfileDto? = null,
    val errorMessage: String? = null,
    val isPasswordDialogOpen: Boolean = false,
    val isDeleteDialogOpen: Boolean = false,
    val isUpdatingPassword: Boolean = false,
    val isDeletingAccount: Boolean = false,
    val passwordForm: PasswordForm = PasswordForm(),
    val snackbarMessage: String? = null
)

data class PasswordForm(
    val currentPassword: String = "",
    val newPassword: String = "",
    val newPasswordConfirm: String = ""
)

@HiltViewModel
class UserProfileViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserProfileUiState())
    val uiState: StateFlow<UserProfileUiState> = _uiState.asStateFlow()

    init {
        loadProfile()
    }

    fun loadProfile() {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val userId = session?.userId
            if (userId.isNullOrBlank()) {
                _uiState.update { it.copy(errorMessage = "Oturum bulunamadı") }
                return@launch
            }

            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = userRepository.getUserProfile(userId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false, profile = result.data) }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    fun openPasswordDialog() = _uiState.update { it.copy(isPasswordDialogOpen = true, passwordForm = PasswordForm()) }
    fun closePasswordDialog() = _uiState.update { it.copy(isPasswordDialogOpen = false) }
    fun openDeleteDialog() = _uiState.update { it.copy(isDeleteDialogOpen = true) }
    fun closeDeleteDialog() = _uiState.update { it.copy(isDeleteDialogOpen = false) }

    fun onCurrentPasswordChanged(v: String) = _uiState.update { it.copy(passwordForm = it.passwordForm.copy(currentPassword = v)) }
    fun onNewPasswordChanged(v: String) = _uiState.update { it.copy(passwordForm = it.passwordForm.copy(newPassword = v)) }
    fun onNewPasswordConfirmChanged(v: String) = _uiState.update { it.copy(passwordForm = it.passwordForm.copy(newPasswordConfirm = v)) }

    fun updatePassword() {
        val state = _uiState.value
        val form = state.passwordForm
        if (form.currentPassword.isBlank() || form.newPassword.isBlank() || form.newPasswordConfirm.isBlank()) {
            _uiState.update { it.copy(snackbarMessage = "Lütfen tüm alanları doldurun") }
            return
        }
        if (form.newPassword != form.newPasswordConfirm) {
            _uiState.update { it.copy(snackbarMessage = "Yeni şifreler eşleşmiyor") }
            return
        }
        if (form.newPassword.length < 6) {
            _uiState.update { it.copy(snackbarMessage = "Şifre en az 6 karakter olmalıdır") }
            return
        }

        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val userId = session?.userId ?: return@launch

            _uiState.update { it.copy(isUpdatingPassword = true) }
            val request = UpdatePasswordRequestDto(form.currentPassword, form.newPassword)
            when (val result = userRepository.updateUserPassword(userId, request)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isUpdatingPassword = false, isPasswordDialogOpen = false, snackbarMessage = "Şifreniz başarıyla güncellendi") }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isUpdatingPassword = false, snackbarMessage = result.message) }
                }
            }
        }
    }

    fun deleteAccount(onAccountDeleted: () -> Unit) {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val userId = session?.userId ?: return@launch

            _uiState.update { it.copy(isDeletingAccount = true) }
            when (val result = userRepository.deleteUserAccount(userId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isDeletingAccount = false, isDeleteDialogOpen = false) }
                    onAccountDeleted()
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isDeletingAccount = false, snackbarMessage = result.message) }
                }
            }
        }
    }

    fun dismissSnackbar() = _uiState.update { it.copy(snackbarMessage = null) }
}
