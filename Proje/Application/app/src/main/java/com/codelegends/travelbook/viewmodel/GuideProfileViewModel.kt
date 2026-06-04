package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.*
import com.codelegends.travelbook.repository.GuideRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class GuideProfileFormState(
    val firstName: String = "",
    val lastName: String = "",
    val phone: String = "",
    val biography: String = "",
    val languages: String = "",
    val expertRoutes: String = "",
    val experienceYears: String = "",
    val available: Boolean = true,
    val instagram: String = "",
    val linkedin: String = ""
)

data class GuideProfileUiState(
    val session: UserSession? = null,
    val profile: GuideProfileSummary? = null,
    val stats: GuideProfileStatsSummary? = null,
    val form: GuideProfileFormState = GuideProfileFormState(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isEditing: Boolean = false,
    val isSaving: Boolean = false,
    val saveErrorMessage: String? = null,
    val isUploadingProfileImage: Boolean = false,
    val isUploadingBannerImage: Boolean = false,
    val isUploadingGalleryImage: Boolean = false,
    val isDeleteDialogVisible: Boolean = false,
    val deleteConfirmText: String = "",
    val isDeleting: Boolean = false,
    val deleteErrorMessage: String? = null,
    val infoMessage: String? = null,
    val completionPercentage: Int = 0
)

@HiltViewModel
class GuideProfileViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val guideRepository: GuideRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(GuideProfileUiState())
    val uiState: StateFlow<GuideProfileUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoadProfile()
    }

    fun retry() {
        _uiState.value.session?.userId?.let { loadProfile(it) }
    }

    fun startEditing() {
        _uiState.update { it.copy(isEditing = true) }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(isEditing = false, form = it.profile?.toForm() ?: GuideProfileFormState()) }
    }

    // Form Handlers
    fun onFirstNameChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(firstName = v)) }
    fun onLastNameChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(lastName = v)) }
    fun onPhoneChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(phone = v)) }
    fun onBiographyChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(biography = v)) }
    fun onLanguagesChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(languages = v)) }
    fun onExpertRoutesChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(expertRoutes = v)) }
    fun onExperienceYearsChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(experienceYears = v)) }
    fun onAvailabilityChanged(v: Boolean) = _uiState.update { it.copy(form = it.form.copy(available = v)) }
    fun onInstagramChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(instagram = v)) }
    fun onLinkedinChanged(v: String) = _uiState.update { it.copy(form = it.form.copy(linkedin = v)) }

    fun dismissSaveError() = _uiState.update { it.copy(saveErrorMessage = null) }
    fun consumeInfoMessage() = _uiState.update { it.copy(infoMessage = null) }
    fun openDeleteDialog() = _uiState.update { it.copy(isDeleteDialogVisible = true, deleteConfirmText = "") }
    fun closeDeleteDialog() = _uiState.update { it.copy(isDeleteDialogVisible = false) }
    fun onDeleteConfirmTextChanged(v: String) = _uiState.update { it.copy(deleteConfirmText = v) }

    fun saveProfile() {
        val state = _uiState.value
        val guideId = state.session?.userId ?: return
        val form = state.form

        if (form.firstName.isBlank() || form.lastName.isBlank()) {
            _uiState.update { it.copy(saveErrorMessage = "Ad ve Soyad zorunludur") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, saveErrorMessage = null) }
            val request = GuideProfileUpdateRequest(
                firstName = form.firstName,
                lastName = form.lastName,
                phone = form.phone.ifBlank { null },
                biography = form.biography.ifBlank { null },
                languages = form.languages.split(",").map { it.trim() }.filter { it.isNotBlank() },
                expertRoutes = form.expertRoutes.split(",").map { it.trim() }.filter { it.isNotBlank() },
                experienceYears = form.experienceYears.toIntOrNull() ?: 0,
                available = form.available,
                instagram = form.instagram.ifBlank { null },
                linkedin = form.linkedin.ifBlank { null }
            )

            when (val result = guideRepository.updateProfile(guideId, request)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            isEditing = false,
                            profile = result.data,
                            form = result.data.toForm(),
                            infoMessage = "Profil başarıyla güncellendi",
                            completionPercentage = calculateCompletion(result.data)
                        )
                    }
                    syncSessionName(result.data)
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isSaving = false, saveErrorMessage = result.message) }
                }
            }
        }
    }

    fun uploadProfileImage(fileName: String, mimeType: String, bytes: ByteArray) {
        val guideId = _uiState.value.session?.userId ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isUploadingProfileImage = true) }
            when (val result = guideRepository.uploadProfileImage(guideId, fileName, mimeType, bytes)) {
                is ApiResult.Success -> {
                    val updatedProfile = _uiState.value.profile?.copy(profileImageUrl = result.data)
                    _uiState.update { it.copy(isUploadingProfileImage = false, profile = updatedProfile, infoMessage = "Profil fotoğrafı güncellendi") }
                    updatedProfile?.let { _uiState.update { s -> s.copy(completionPercentage = calculateCompletion(it)) } }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isUploadingProfileImage = false, saveErrorMessage = result.message) }
                }
            }
        }
    }

    fun uploadBannerImage(fileName: String, mimeType: String, bytes: ByteArray) {
        val guideId = _uiState.value.session?.userId ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isUploadingBannerImage = true) }
            when (val result = guideRepository.uploadBannerImage(guideId, fileName, mimeType, bytes)) {
                is ApiResult.Success -> {
                    val updatedProfile = _uiState.value.profile?.copy(bannerImageUrl = result.data)
                    _uiState.update { it.copy(isUploadingBannerImage = false, profile = updatedProfile, infoMessage = "Kapak fotoğrafı güncellendi") }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isUploadingBannerImage = false, saveErrorMessage = result.message) }
                }
            }
        }
    }

    fun uploadGalleryImage(fileName: String, mimeType: String, bytes: ByteArray) {
        val guideId = _uiState.value.session?.userId ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isUploadingGalleryImage = true) }
            when (val result = guideRepository.uploadGalleryImage(guideId, fileName, mimeType, bytes)) {
                is ApiResult.Success -> {
                    val currentGallery = _uiState.value.profile?.galleryImages.orEmpty()
                    val updatedProfile = _uiState.value.profile?.copy(galleryImages = currentGallery + result.data)
                    _uiState.update { it.copy(isUploadingGalleryImage = false, profile = updatedProfile, infoMessage = "Fotoğraf galeriye eklendi") }
                    updatedProfile?.let { _uiState.update { s -> s.copy(completionPercentage = calculateCompletion(it)) } }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isUploadingGalleryImage = false, saveErrorMessage = result.message) }
                }
            }
        }
    }

    fun removeGalleryImage(imageUrl: String) {
        val guideId = _uiState.value.session?.userId ?: return
        viewModelScope.launch {
            when (val result = guideRepository.removeGalleryImage(guideId, imageUrl)) {
                is ApiResult.Success -> {
                    val currentGallery = _uiState.value.profile?.galleryImages.orEmpty()
                    val updatedProfile = _uiState.value.profile?.copy(galleryImages = currentGallery - imageUrl)
                    _uiState.update { it.copy(profile = updatedProfile, infoMessage = "Fotoğraf galeriden silindi") }
                    updatedProfile?.let { _uiState.update { s -> s.copy(completionPercentage = calculateCompletion(it)) } }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(saveErrorMessage = result.message) }
                }
            }
        }
    }

    fun deleteAccount(onDeleted: () -> Unit) {
        val guideId = _uiState.value.session?.userId ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isDeleting = true, deleteErrorMessage = null) }
            when (val result = guideRepository.deleteAccount(guideId)) {
                is ApiResult.Success -> {
                    sessionManager.clearSession()
                    onDeleted()
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isDeleting = false, deleteErrorMessage = result.message) }
                }
            }
        }
    }

    private fun observeSessionAndLoadProfile() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collect { session ->
                _uiState.update { it.copy(session = session) }
                session?.userId?.let { loadProfile(it) }
            }
        }
    }

    private fun loadProfile(guideId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = guideRepository.getProfile(guideId)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            profile = result.data,
                            form = result.data.toForm(),
                            stats = result.data.toStats(),
                            completionPercentage = calculateCompletion(result.data)
                        )
                    }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    private fun calculateCompletion(p: GuideProfileSummary): Int {
        val fields = listOf(
            p.firstName.isNotBlank(),
            p.lastName.isNotBlank(),
            p.email.isNotBlank(),
            p.phone.isNotBlank(),
            p.biography.isNotBlank(),
            p.profileImageUrl != null,
            p.languages.isNotEmpty(),
            p.expertRoutes.isNotEmpty(),
            p.experienceYears > 0,
            p.galleryImages.isNotEmpty()
        )
        return (fields.count { it } * 100) / fields.size
    }

    private fun syncSessionName(p: GuideProfileSummary) {
        viewModelScope.launch {
            val currentSession = _uiState.value.session ?: return@launch
            if (currentSession.name != p.fullName) {
                sessionManager.saveSession(currentSession.copy(name = p.fullName))
            }
        }
    }

    private fun GuideProfileSummary.toForm() = GuideProfileFormState(
        firstName = firstName,
        lastName = lastName,
        phone = phone,
        biography = biography,
        languages = languages.joinToString(", "),
        expertRoutes = expertRoutes.joinToString(", "),
        experienceYears = experienceYears.toString(),
        available = available,
        instagram = instagram,
        linkedin = linkedin
    )

    private fun GuideProfileSummary.toStats() = GuideProfileStatsSummary(
        totalTours = 0, // Should be fetched from backend if available
        experienceYears = experienceYears,
        rating = rating
    )
}
