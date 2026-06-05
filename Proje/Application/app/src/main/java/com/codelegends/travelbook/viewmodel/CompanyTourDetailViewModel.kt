package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CompanyTourDetail
import com.codelegends.travelbook.model.UpdateTourRequest
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

data class TourDetailUiState(
    val isLoading: Boolean = false,
    val tour: CompanyTourDetail? = null,
    val errorMessage: String? = null,
    val isEditDialogOpen: Boolean = false,
    val isDeleteDialogOpen: Boolean = false,
    val isSaving: Boolean = false,
    val isDeleting: Boolean = false,
    val snackbarMessage: String? = null,
    val editForm: EditTourForm = EditTourForm()
)

data class EditTourForm(
    val name: String = "",
    val description: String = "",
    val departureLocation: String = "",
    val arrivalLocation: String = "",
    val places: List<String> = emptyList(),
    val price: String = "",
    val totalCapacity: String = "",
    val startDate: String = "",
    val endDate: String = "",
    val services: List<String> = emptyList()
)

sealed class TourDetailEvent {
    data object NavigateBack : TourDetailEvent()
}

@HiltViewModel
class CompanyTourDetailViewModel @Inject constructor(
    private val sessionManager: SessionManager,
    private val companyTourRepository: CompanyTourRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TourDetailUiState())
    val uiState: StateFlow<TourDetailUiState> = _uiState.asStateFlow()

    private val _events = Channel<TourDetailEvent>(Channel.BUFFERED)
    val events = _events.receiveAsFlow()

    fun load(tourId: String) {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val companyId = session?.userId?.takeIf { it.isNotBlank() }
            if (companyId == null) {
                _uiState.update { it.copy(errorMessage = "Oturum bilgisi bulunamadı.") }
                return@launch
            }

            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = companyTourRepository.getTourDetail(companyId, tourId)) {
                is ApiResult.Success -> {
                    val tour = result.data
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            tour = tour,
                            editForm = EditTourForm(
                                name = tour.name,
                                description = tour.description,
                                departureLocation = tour.departureLocation,
                                arrivalLocation = tour.arrivalLocation,
                                places = tour.places,
                                price = if (tour.price > 0) tour.price.toInt().toString() else "0",
                                totalCapacity = tour.totalCapacity.toString(),
                                startDate = tour.startDate.take(10),
                                endDate = tour.endDate.take(10),
                                services = tour.services
                            )
                        )
                    }
                }

                is ApiResult.Error -> _uiState.update {
                    it.copy(isLoading = false, errorMessage = result.message)
                }
            }
        }
    }

    fun openEditDialog() = _uiState.update { it.copy(isEditDialogOpen = true) }
    fun closeEditDialog() = _uiState.update { it.copy(isEditDialogOpen = false) }
    fun openDeleteDialog() = _uiState.update { it.copy(isDeleteDialogOpen = true) }
    fun closeDeleteDialog() = _uiState.update { it.copy(isDeleteDialogOpen = false) }
    fun dismissSnackbar() = _uiState.update { it.copy(snackbarMessage = null) }

    fun onEditNameChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(name = v)) }

    fun onEditDescriptionChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(description = v)) }

    fun onEditDepartureChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(departureLocation = v)) }

    fun onEditArrivalChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(arrivalLocation = v)) }

    fun onEditPriceChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(price = v)) }

    fun onEditCapacityChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(totalCapacity = v)) }

    fun onEditStartDateChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(startDate = v)) }

    fun onEditEndDateChanged(v: String) =
        _uiState.update { it.copy(editForm = it.editForm.copy(endDate = v)) }

    fun addEditService(service: String) {
        val trimmed = service.trim()
        if (trimmed.isBlank()) return
        _uiState.update { state ->
            val updated = if (trimmed in state.editForm.services) state.editForm.services
            else state.editForm.services + trimmed
            state.copy(editForm = state.editForm.copy(services = updated))
        }
    }

    fun removeEditService(service: String) = _uiState.update {
        it.copy(editForm = it.editForm.copy(services = it.editForm.services - service))
    }

    fun addEditPlace(place: String) {
        val trimmed = place.trim()
        if (trimmed.isBlank()) return
        _uiState.update { state ->
            val updated = if (trimmed in state.editForm.places) state.editForm.places
            else state.editForm.places + trimmed
            state.copy(editForm = state.editForm.copy(places = updated))
        }
    }

    fun removeEditPlace(place: String) = _uiState.update {
        it.copy(editForm = it.editForm.copy(places = it.editForm.places - place))
    }

    fun saveEdit(tourId: String) {
        val state = _uiState.value
        val form = state.editForm
        val error = validateEdit(form)
        if (error != null) {
            _uiState.update { it.copy(snackbarMessage = error) }
            return
        }

        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val companyId = session?.userId?.takeIf { it.isNotBlank() } ?: return@launch

            _uiState.update { it.copy(isSaving = true) }

            val body = UpdateTourRequest(
                name = form.name.trim(),
                description = form.description.trim(),
                departureLocation = form.departureLocation.trim(),
                arrivalLocation = form.arrivalLocation.trim(),
                places = form.places,
                price = form.price.toDoubleOrNull() ?: 0.0,
                totalCapacity = form.totalCapacity.toIntOrNull() ?: 1,
                startDate = form.startDate,
                endDate = form.endDate,
                services = form.services
            )

            when (val result = companyTourRepository.updateTour(companyId, tourId, body)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isSaving = false,
                            isEditDialogOpen = false,
                            tour = result.data,
                            snackbarMessage = "Tur başarıyla güncellendi."
                        )
                    }
                }

                is ApiResult.Error -> _uiState.update {
                    it.copy(isSaving = false, snackbarMessage = result.message)
                }
            }
        }
    }

    fun deleteTour(tourId: String) {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            val companyId = session?.userId?.takeIf { it.isNotBlank() } ?: return@launch

            _uiState.update { it.copy(isDeleting = true) }

            when (val result = companyTourRepository.deleteTour(companyId, tourId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(isDeleting = false, isDeleteDialogOpen = false) }
                    _events.send(TourDetailEvent.NavigateBack)
                }

                is ApiResult.Error -> _uiState.update {
                    it.copy(isDeleting = false, snackbarMessage = result.message)
                }
            }
        }
    }

    private fun validateEdit(form: EditTourForm): String? {
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
