package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel
import com.codelegends.travelbook.viewmodel.TourDetailEvent

// ─────────────────────────────────────────────────────────────────────────────
// Root Screen
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun CompanyTourDetailScreen(
    tourId: String,
    onNavigateBack: () -> Unit,
    viewModel: CompanyTourDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(tourId) { viewModel.load(tourId) }

    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                TourDetailEvent.NavigateBack -> onNavigateBack()
            }
        }
    }

    LaunchedEffect(uiState.snackbarMessage) {
        val msg = uiState.snackbarMessage
        if (!msg.isNullOrBlank()) {
            snackbarHostState.showSnackbar(msg)
            viewModel.dismissSnackbar()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        contentWindowInsets = WindowInsets(0, 0, 0, 0)
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = MaterialTheme.colorScheme.secondary,
                        strokeWidth = 3.dp
                    )
                }

                !uiState.errorMessage.isNullOrBlank() -> {
                    Text(
                        text = uiState.errorMessage.orEmpty(),
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(24.dp)
                    )
                }

                uiState.tour != null -> {
                    TourDetailContent(
                        tour = uiState.tour!!,
                        onNavigateBack = onNavigateBack,
                        onEdit = viewModel::openEditDialog,
                        onDelete = viewModel::openDeleteDialog,
                        modifier = Modifier.fillMaxSize()
                    )
                }

                else -> {
                    Text(
                        text = "Tur bilgisi bulunamadı.",
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(24.dp),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }

    if (uiState.isEditDialogOpen) {
        TourEditDialog(
            state = uiState.editForm,
            isSaving = uiState.isSaving,
            onDismiss = viewModel::closeEditDialog,
            onSave = { viewModel.saveEdit(tourId) },
            onNameChanged = viewModel::onEditNameChanged,
            onDescriptionChanged = viewModel::onEditDescriptionChanged,
            onDepartureChanged = viewModel::onEditDepartureChanged,
            onArrivalChanged = viewModel::onEditArrivalChanged,
            onPriceChanged = viewModel::onEditPriceChanged,
            onCapacityChanged = viewModel::onEditCapacityChanged,
            onStartDateChanged = viewModel::onEditStartDateChanged,
            onEndDateChanged = viewModel::onEditEndDateChanged,
            onAddService = viewModel::addEditService,
            onRemoveService = viewModel::removeEditService,
            onAddPlace = viewModel::addEditPlace,
            onRemovePlace = viewModel::removeEditPlace
        )
    }

    if (uiState.isDeleteDialogOpen) {
        TourDeleteDialog(
            tourName = uiState.tour?.name.orEmpty(),
            isDeleting = uiState.isDeleting,
            onConfirm = { viewModel.deleteTour(tourId) },
            onDismiss = viewModel::closeDeleteDialog
        )
    }
}

