package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyProfileStatsSummary
import com.codelegends.travelbook.model.CompanyProfileSummary
import com.codelegends.travelbook.model.CompanyProfileUpdateRequest
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.CompanyTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CompanyProfileFormState(
    val name: String = "",
    val phone: String = "",
    val address: String = "",
    val description: String = "",
    val instagram: String = "",
    val linkedin: String = ""
)

data class CompanyProfileUiState(
    val session: UserSession? = null,
    val profile: CompanyProfileSummary? = null,
    val stats: CompanyProfileStatsSummary = CompanyProfileStatsSummary(
        totalTours = 0,
        averageRating = 0.0,
        totalReviews = 0,
        totalGuides = 0
    ),
    val form: CompanyProfileFormState = CompanyProfileFormState(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isEditing: Boolean = false,
    val isSaving: Boolean = false,
    val saveErrorMessage: String? = null,
    val isUploadingProfileImage: Boolean = false,
    val isUploadingBannerImage: Boolean = false,
    val isDeleteDialogVisible: Boolean = false,
    val deleteConfirmText: String = "",
    val isDeleting: Boolean = false,
    val deleteErrorMessage: String? = null,
    val infoMessage: String? = null
)

@HiltViewModel
class CompanyProfileViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CompanyProfileUiState())
    val uiState: StateFlow<CompanyProfileUiState> = _uiState.asStateFlow()

    init {
        observeSessionAndLoadProfile()
    }

    fun retry() {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            loadProfileAndStats(companyId)
        }
    }

    fun startEditing() {
        val profile = _uiState.value.profile ?: return
        _uiState.update {
            it.copy(
                isEditing = true,
                form = profile.toForm(),
                saveErrorMessage = null
            )
        }
    }

    fun cancelEditing() {
        val profile = _uiState.value.profile
        _uiState.update {
            it.copy(
                isEditing = false,
                form = profile?.toForm() ?: CompanyProfileFormState(),
                saveErrorMessage = null
            )
        }
    }

    fun onNameChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(name = value)) }
    }

    fun onPhoneChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(phone = value)) }
    }

    fun onAddressChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(address = value)) }
    }

    fun onDescriptionChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(description = value)) }
    }

    fun onInstagramChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(instagram = value)) }
    }

    fun onLinkedinChanged(value: String) {
        _uiState.update { it.copy(form = it.form.copy(linkedin = value)) }
    }

    fun dismissSaveError() {
        _uiState.update { it.copy(saveErrorMessage = null) }
    }

    fun consumeInfoMessage() {
        _uiState.update { it.copy(infoMessage = null) }
    }

    fun openDeleteDialog() {
        _uiState.update {
            it.copy(
                isDeleteDialogVisible = true,
                deleteConfirmText = "",
                deleteErrorMessage = null
            )
        }
    }

    fun closeDeleteDialog() {
        _uiState.update {
            it.copy(
                isDeleteDialogVisible = false,
                deleteConfirmText = "",
                deleteErrorMessage = null
            )
        }
    }

    fun onDeleteConfirmTextChanged(value: String) {
        _uiState.update { it.copy(deleteConfirmText = value) }
    }

    fun saveProfile() {
        val session = _uiState.value.session ?: return
        val companyId = session.userId
        val form = _uiState.value.form

        if (form.name.isBlank() || form.phone.isBlank() || form.address.isBlank()) {
            _uiState.update {
                it.copy(saveErrorMessage = "Firma adı, telefon ve adres alanları zorunludur")
            }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, saveErrorMessage = null) }

            val body = CompanyProfileUpdateRequest(
                name = form.name.trim(),
                phone = form.phone.trim(),
                address = form.address.trim(),
                description = form.description.trim(),
                instagram = form.instagram.trim(),
                linkedin = form.linkedin.trim()
            )

            when (val result = companyTourRepository.updateCompanyProfile(companyId, body)) {
                is ApiResult.Success -> {
                    val updatedProfile = result.data
                    syncSessionName(updatedProfile)

                    _uiState.update {
                        it.copy(
                            profile = updatedProfile,
                            form = updatedProfile.toForm(),
                            isEditing = false,
                            isSaving = false,
                            saveErrorMessage = null,
                            infoMessage = "Profil başarıyla güncellendi"
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            saveErrorMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun uploadProfileImage(
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ) {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            _uiState.update { it.copy(isUploadingProfileImage = true, saveErrorMessage = null) }

            when (
                val result = companyTourRepository.uploadCompanyProfileImage(
                    companyId = companyId,
                    fileName = fileName,
                    mimeType = mimeType,
                    bytes = bytes
                )
            ) {
                is ApiResult.Success -> {
                    _uiState.update { state ->
                        state.copy(
                            isUploadingProfileImage = false,
                            profile = state.profile?.copy(profileImageUrl = result.data),
                            infoMessage = "Profil resmi güncellendi"
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isUploadingProfileImage = false,
                            saveErrorMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun uploadBannerImage(
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ) {
        val companyId = _uiState.value.session?.userId.orEmpty()
        if (companyId.isBlank()) return

        viewModelScope.launch {
            _uiState.update { it.copy(isUploadingBannerImage = true, saveErrorMessage = null) }

            when (
                val result = companyTourRepository.uploadCompanyBannerImage(
                    companyId = companyId,
                    fileName = fileName,
                    mimeType = mimeType,
                    bytes = bytes
                )
            ) {
                is ApiResult.Success -> {
                    _uiState.update { state ->
                        state.copy(
                            isUploadingBannerImage = false,
                            profile = state.profile?.copy(bannerImageUrl = result.data),
                            infoMessage = "Kapak görseli güncellendi"
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isUploadingBannerImage = false,
                            saveErrorMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun deleteAccount(onDeleted: () -> Unit) {
        val state = _uiState.value
        val companyId = state.session?.userId.orEmpty()
        val profileName = state.profile?.name.orEmpty()
        if (companyId.isBlank()) return

        if (state.deleteConfirmText != profileName) {
            _uiState.update {
                it.copy(deleteErrorMessage = "Onay için firma adını doğru girmelisiniz")
            }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isDeleting = true, deleteErrorMessage = null) }

            when (val result = companyTourRepository.deleteCompanyAccount(companyId)) {
                is ApiResult.Success -> {
                    sessionManager.clearSession()
                    _uiState.update { it.copy(isDeleting = false) }
                    onDeleted()
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isDeleting = false,
                            deleteErrorMessage = result.message
                        )
                    }
                }
            }
        }
    }

    private fun observeSessionAndLoadProfile() {
        viewModelScope.launch {
            sessionManager.sessionFlow.collectLatest { session ->
                _uiState.update { it.copy(session = session, errorMessage = null) }

                if (session == null || !session.role.equals("company", ignoreCase = true)) {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            profile = null,
                            isEditing = false,
                            saveErrorMessage = null
                        )
                    }
                    return@collectLatest
                }

                loadProfileAndStats(session.userId)
            }
        }
    }

    private suspend fun loadProfileAndStats(companyId: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }

        coroutineScope {
            val profileDeferred = async { companyTourRepository.getCompanyProfile(companyId) }
            val toursDeferred = async { companyTourRepository.listTours(companyId) }
            val guidesDeferred = async { companyTourRepository.listGuides(companyId) }

            val profileResult = profileDeferred.await()
            val toursResult = toursDeferred.await()
            val guidesResult = guidesDeferred.await()

            when (profileResult) {
                is ApiResult.Success -> {
                    val profile = profileResult.data
                    val stats = buildStats(
                        profile = profile,
                        toursResult = toursResult,
                        guidesResult = guidesResult
                    )

                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            profile = profile,
                            stats = stats,
                            form = profile.toForm(),
                            errorMessage = null
                        )
                    }
                }

                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            profile = null,
                            errorMessage = profileResult.message
                        )
                    }
                }
            }
        }
    }

    private fun buildStats(
        profile: CompanyProfileSummary,
        toursResult: ApiResult<List<CompanyTourSummary>>,
        guidesResult: ApiResult<List<com.codelegends.travelbook.model.CompanyGuideSummary>>
    ): CompanyProfileStatsSummary {
        val tours = if (toursResult is ApiResult.Success) toursResult.data else emptyList()
        val guides = if (guidesResult is ApiResult.Success) guidesResult.data else emptyList()
        val ratedTours = tours.filter { it.rating > 0.0 }
        val averageRating = if (ratedTours.isNotEmpty()) {
            ratedTours.sumOf { it.rating } / ratedTours.size
        } else {
            profile.rating
        }

        return CompanyProfileStatsSummary(
            totalTours = if (tours.isNotEmpty()) tours.size else profile.tourCount,
            averageRating = averageRating,
            totalReviews = tours.sumOf { it.reviewCount },
            totalGuides = if (guides.isNotEmpty()) guides.size else profile.registeredGuideCount
        )
    }

    private suspend fun syncSessionName(profile: CompanyProfileSummary) {
        val session = _uiState.value.session ?: return
        sessionManager.saveSession(
            session.copy(
                name = profile.name.ifBlank { session.name },
                email = profile.email.ifBlank { session.email }
            )
        )
    }

    private fun CompanyProfileSummary.toForm(): CompanyProfileFormState {
        return CompanyProfileFormState(
            name = name,
            phone = phone,
            address = address,
            description = description,
            instagram = instagram,
            linkedin = linkedin
        )
    }

    fun showInfoMessage(message: String) {
        _uiState.update { it.copy(infoMessage = message) }
    }

}
