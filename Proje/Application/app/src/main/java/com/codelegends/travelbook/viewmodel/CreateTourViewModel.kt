package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyGuideSummary
import com.codelegends.travelbook.model.CreateTourRequest
import com.codelegends.travelbook.repository.CompanyTourRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CreateTourForm(
    val name: String = "",
    val description: String = "",
    val departureLocation: String = "",
    val arrivalLocation: String = "",
    val price: String = "",
    val totalCapacity: String = "",
    val startDate: String = "",
    val endDate: String = ""
)

data class CreateTourUiState(
    val form: CreateTourForm = CreateTourForm(),
    val services: List<String> = emptyList(),
    val places: List<String> = emptyList(),
    val selectedGuideId: String = "",
    val guides: List<CompanyGuideSummary> = emptyList(),
    val isGuidesLoading: Boolean = false,
    val imageFileName: String? = null,
    val imageMimeType: String? = null,
    val imageBytes: ByteArray? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as CreateTourUiState

        if (isGuidesLoading != other.isGuidesLoading) return false
        if (isLoading != other.isLoading) return false
        if (form != other.form) return false
        if (services != other.services) return false
        if (places != other.places) return false
        if (selectedGuideId != other.selectedGuideId) return false
        if (guides != other.guides) return false
        if (imageFileName != other.imageFileName) return false
        if (imageMimeType != other.imageMimeType) return false
        if (!imageBytes.contentEquals(other.imageBytes)) return false
        if (errorMessage != other.errorMessage) return false

        return true
    }

    override fun hashCode(): Int {
        var result = isGuidesLoading.hashCode()
        result = 31 * result + isLoading.hashCode()
        result = 31 * result + form.hashCode()
        result = 31 * result + services.hashCode()
        result = 31 * result + places.hashCode()
        result = 31 * result + selectedGuideId.hashCode()
        result = 31 * result + guides.hashCode()
        result = 31 * result + (imageFileName?.hashCode() ?: 0)
        result = 31 * result + (imageMimeType?.hashCode() ?: 0)
        result = 31 * result + (imageBytes?.contentHashCode() ?: 0)
        result = 31 * result + (errorMessage?.hashCode() ?: 0)
        return result
    }
}

sealed class CreateTourEvent {
    data object NavigateBack : CreateTourEvent()
    data object TourCreated : CreateTourEvent()
}

@HiltViewModel
class CreateTourViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CreateTourUiState())
    val uiState: StateFlow<CreateTourUiState> = _uiState.asStateFlow()

    private val _events = Channel<CreateTourEvent>(Channel.BUFFERED)
    val events = _events.receiveAsFlow()

    init {
        loadGuides()
    }

    private fun loadGuides() {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull() ?: return@launch
            val companyId = session.userId.takeIf { it.isNotBlank() } ?: return@launch

            _uiState.update { it.copy(isGuidesLoading = true) }
            when (val result = companyTourRepository.listGuides(companyId)) {
                is ApiResult.Success -> _uiState.update {
                    it.copy(guides = result.data, isGuidesLoading = false)
                }

                is ApiResult.Error -> _uiState.update { it.copy(isGuidesLoading = false) }
            }
        }
    }

    fun onNameChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(name = value)) }

    fun onDescriptionChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(description = value)) }

    fun onDepartureLocationChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(departureLocation = value)) }

    fun onArrivalLocationChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(arrivalLocation = value)) }

    fun onPriceChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(price = value)) }

    fun onCapacityChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(totalCapacity = value)) }

    fun onStartDateChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(startDate = value)) }

    fun onEndDateChanged(value: String) =
        _uiState.update { it.copy(form = it.form.copy(endDate = value)) }

    fun onGuideSelected(guideId: String) = _uiState.update { it.copy(selectedGuideId = guideId) }

    fun addService(service: String) {
        val trimmed = service.trim()
        if (trimmed.isBlank()) return
        _uiState.update { state ->
            if (trimmed in state.services) state
            else state.copy(services = state.services + trimmed)
        }
    }

    fun removeService(service: String) =
        _uiState.update { it.copy(services = it.services - service) }

    fun addPlace(place: String) {
        val trimmed = place.trim()
        if (trimmed.isBlank()) return
        _uiState.update { state ->
            if (trimmed in state.places) state
            else state.copy(places = state.places + trimmed)
        }
    }

    fun removePlace(place: String) = _uiState.update { it.copy(places = it.places - place) }

    fun setImage(fileName: String, mimeType: String, bytes: ByteArray) {
        _uiState.update {
            it.copy(
                imageFileName = fileName,
                imageMimeType = mimeType,
                imageBytes = bytes
            )
        }
    }

    fun clearImage() {
        _uiState.update { it.copy(imageFileName = null, imageMimeType = null, imageBytes = null) }
    }

    fun submit() {
        val state = _uiState.value
        val form = state.form

        val validationError = validate(form)
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val companyId = session?.userId?.takeIf { it.isNotBlank() }
            if (companyId == null) {
                _uiState.update { it.copy(errorMessage = "Oturum bilgisi bulunamadı.") }
                return@launch
            }

            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val request = CreateTourRequest(
                name = form.name.trim(),
                description = form.description.trim(),
                departureLocation = form.departureLocation.trim(),
                arrivalLocation = form.arrivalLocation.trim(),
                places = state.places,
                price = form.price.toDoubleOrNull() ?: 0.0,
                totalCapacity = form.totalCapacity.toIntOrNull() ?: 1,
                startDate = form.startDate,
                endDate = form.endDate,
                services = state.services,
                guideId = state.selectedGuideId.takeIf { it.isNotBlank() }
            )

            when (val result = companyTourRepository.createTour(
                companyId = companyId,
                request = request,
                imageFileName = state.imageFileName,
                imageMimeType = state.imageMimeType,
                imageBytes = state.imageBytes
            )) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isLoading = false) }
                    _events.send(CreateTourEvent.TourCreated)
                }

                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    private fun validate(form: CreateTourForm): String? {
        if (form.name.isBlank()) return "Tur adı zorunludur."
        if (form.description.isBlank()) return "Açıklama zorunludur."
        if (form.departureLocation.isBlank()) return "Kalkış yeri zorunludur."
        if (form.arrivalLocation.isBlank()) return "Varış yeri zorunludur."

        val price = form.price.toDoubleOrNull()
        if (price == null || price < 0) return "Geçerli bir fiyat giriniz."

        if (form.startDate.isBlank()) return "Başlangıç tarihi zorunludur."
        if (form.endDate.isBlank()) return "Bitiş tarihi zorunludur."
        if (form.endDate <= form.startDate) return "Bitiş tarihi başlangıç tarihinden sonra olmalıdır."

        val capacity = form.totalCapacity.toIntOrNull()
        if (capacity == null || capacity < 1) return "Kapasite en az 1 olmalıdır."

        return null
    }
}
