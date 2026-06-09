package com.codelegends.travelbook.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.clickable
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.TravelExplore
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuAnchorType
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.InputChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.compose.AsyncImage
import com.codelegends.travelbook.viewmodel.CreateTourEvent
import com.codelegends.travelbook.viewmodel.CreateTourViewModel
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.TimeZone
import com.codelegends.travelbook.util.FormatUtils
import com.codelegends.travelbook.util.readImagePickerPayload
import kotlin.OptIn
import kotlin.String
import kotlin.Unit
import kotlin.collections.firstOrNull
import kotlin.collections.forEach
import kotlin.collections.isNotEmpty
import kotlin.text.isNullOrBlank
import kotlin.text.orEmpty

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun CreateTourScreen(
    onNavigateBack: () -> Unit,
    onTourCreated: () -> Unit,
    viewModel: CreateTourViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var serviceInput by remember { mutableStateOf("") }
    var placeInput by remember { mutableStateOf("") }
    var imagePreviewUri by remember { mutableStateOf<Uri?>(null) }
    var guideMenuExpanded by remember { mutableStateOf(false) }
    var showStartDatePicker by remember { mutableStateOf(false) }
    var showEndDatePicker by remember { mutableStateOf(false) }

    val imagePicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            val payload = context.contentResolver.readImagePickerPayload(uri, "tour-image")
            if (payload == null) {
                snackbarHostState.showSnackbar("Görsel okunamadı veya 5 MB sınırı aşıldı")
                return@launch
            }
            imagePreviewUri = uri
            viewModel.setImage(payload.fileName, payload.mimeType, payload.bytes)
        }
    }

    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                CreateTourEvent.TourCreated -> onTourCreated()
                CreateTourEvent.NavigateBack -> onNavigateBack()
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Yeni Tur Oluştur", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Geri"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                windowInsets = WindowInsets(0, 0, 0, 0)
            )
        },
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        contentWindowInsets = WindowInsets(0, 0, 0, 0)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            if (!uiState.errorMessage.isNullOrBlank()) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.errorContainer,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = uiState.errorMessage.orEmpty(),
                        modifier = Modifier.padding(12.dp),
                        color = MaterialTheme.colorScheme.onErrorContainer,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            SectionLabel("Tur Bilgileri")

            OutlinedTextField(
                value = uiState.form.name,
                onValueChange = viewModel::onNameChanged,
                label = { Text("Tur Adı *") },
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            OutlinedTextField(
                value = uiState.form.description,
                onValueChange = viewModel::onDescriptionChanged,
                label = { Text("Açıklama *") },
                minLines = 3,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = uiState.form.departureLocation,
                    onValueChange = viewModel::onDepartureLocationChanged,
                    label = { Text("Kalkış Yeri *") },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium
                )
                OutlinedTextField(
                    value = uiState.form.arrivalLocation,
                    onValueChange = viewModel::onArrivalLocationChanged,
                    label = { Text("Varış Yeri *") },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium
                )
            }

            SectionLabel("Gezilecek Yerler")

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = placeInput,
                    onValueChange = { placeInput = it },
                    label = { Text("Yer ekle") },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium,
                    singleLine = true
                )
                Spacer(Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        viewModel.addPlace(placeInput)
                        placeInput = ""
                    }
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Ekle")
                }
            }

            if (uiState.places.isNotEmpty()) {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    uiState.places.forEach { place ->
                        InputChip(
                            selected = false,
                            onClick = { viewModel.removePlace(place) },
                            label = { Text(place) },
                            trailingIcon = {
                                Icon(
                                    imageVector = Icons.Default.DeleteForever,
                                    contentDescription = "Kaldır",
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        )
                    }
                }
            }

            SectionLabel("Ücret ve Kapasite")

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = uiState.form.price,
                    onValueChange = viewModel::onPriceChanged,
                    label = { Text("Fiyat (₺) *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium
                )
                OutlinedTextField(
                    value = uiState.form.totalCapacity,
                    onValueChange = viewModel::onCapacityChanged,
                    label = { Text("Kapasite *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium
                )
            }

            SectionLabel("Tarihler")

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(modifier = Modifier.weight(1f)) {
                    OutlinedTextField(
                        value = if (uiState.form.startDate.isBlank()) ""
                                else FormatUtils.formatDate(uiState.form.startDate),
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Başlangıç Tarihi *") },
                        trailingIcon = {
                            Icon(Icons.Default.CalendarMonth, contentDescription = null)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = MaterialTheme.shapes.medium
                    )
                    Box(modifier = Modifier.matchParentSize().clickable { showStartDatePicker = true })
                }
                Box(modifier = Modifier.weight(1f)) {
                    OutlinedTextField(
                        value = if (uiState.form.endDate.isBlank()) ""
                                else FormatUtils.formatDate(uiState.form.endDate),
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Bitiş Tarihi *") },
                        trailingIcon = {
                            Icon(Icons.Default.CalendarMonth, contentDescription = null)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = MaterialTheme.shapes.medium
                    )
                    Box(modifier = Modifier.matchParentSize().clickable { showEndDatePicker = true })
                }
            }

            SectionLabel("Tur Görseli")

            if (imagePreviewUri != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                ) {
                    AsyncImage(
                        model = imagePreviewUri,
                        contentDescription = "Tur görseli önizleme",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                    OutlinedButton(
                        onClick = {
                            imagePreviewUri = null
                            viewModel.clearImage()
                        },
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                    ) {
                        Icon(
                            Icons.Default.DeleteForever,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text("Kaldır")
                    }
                }
            } else {
                OutlinedButton(
                    onClick = { imagePicker.launch("image/*") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.CloudUpload, contentDescription = null)
                    Spacer(Modifier.width(6.dp))
                    Text("Görsel Yükle")
                }
                Text(
                    text = "JPEG, PNG veya WebP • Maks. 5 MB",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            SectionLabel("Dahil Hizmetler")

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = serviceInput,
                    onValueChange = { serviceInput = it },
                    label = { Text("Hizmet ekle") },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium,
                    singleLine = true
                )
                Spacer(Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        viewModel.addService(serviceInput)
                        serviceInput = ""
                    }
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Ekle")
                }
            }

            if (uiState.services.isNotEmpty()) {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    uiState.services.forEach { service ->
                        InputChip(
                            selected = false,
                            onClick = { viewModel.removeService(service) },
                            label = { Text(service) },
                            trailingIcon = {
                                Icon(
                                    imageVector = Icons.Default.DeleteForever,
                                    contentDescription = "Kaldır",
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        )
                    }
                }
            }

            SectionLabel("Rehber Atama (İsteğe Bağlı)")

            if (uiState.isGuidesLoading) {
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                }
            } else if (uiState.guides.isNotEmpty()) {
                ExposedDropdownMenuBox(
                    expanded = guideMenuExpanded,
                    onExpandedChange = { guideMenuExpanded = it },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val selectedGuideName = uiState.guides
                        .firstOrNull { it.id == uiState.selectedGuideId }?.fullName
                        ?: "Rehber seçin"
                    OutlinedTextField(
                        value = selectedGuideName,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Rehber") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = guideMenuExpanded) },
                        modifier = Modifier
                            .menuAnchor(
                                type = ExposedDropdownMenuAnchorType.PrimaryNotEditable
                            )
                            .fillMaxWidth(),
                        shape = MaterialTheme.shapes.medium
                    )
                    ExposedDropdownMenu(
                        expanded = guideMenuExpanded,
                        onDismissRequest = { guideMenuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Rehber seçin") },
                            onClick = {
                                viewModel.onGuideSelected("")
                                guideMenuExpanded = false
                            }
                        )
                        uiState.guides.forEach { guide ->
                            DropdownMenuItem(
                                text = { Text(guide.fullName) },
                                onClick = {
                                    viewModel.onGuideSelected(guide.id)
                                    guideMenuExpanded = false
                                }
                            )
                        }
                    }
                }
            } else {
                Card(
                    shape = RoundedCornerShape(10.dp),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.TravelExplore,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "Henüz kayıtlı rehber bulunmuyor.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(Modifier.height(8.dp))

            Button(
                onClick = viewModel::submit,
                enabled = !uiState.isLoading,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                    Spacer(Modifier.width(8.dp))
                }
                Text(
                    text = if (uiState.isLoading) "Oluşturuluyor..." else "Turu Oluştur",
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(Modifier.height(16.dp))
        }
    }

    if (showStartDatePicker) {
        val startDatePickerState = rememberDatePickerState(
            initialSelectedDateMillis = uiState.form.startDate.isoDateToMillis()
        )
        DatePickerDialog(
            onDismissRequest = { showStartDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    startDatePickerState.selectedDateMillis?.let { millis ->
                        viewModel.onStartDateChanged(millisToIsoDate(millis))
                    }
                    showStartDatePicker = false
                }) { Text("Tamam") }
            },
            dismissButton = {
                TextButton(onClick = { showStartDatePicker = false }) { Text("İptal") }
            }
        ) {
            DatePicker(state = startDatePickerState)
        }
    }

    if (showEndDatePicker) {
        val endDatePickerState = rememberDatePickerState(
            initialSelectedDateMillis = uiState.form.endDate.isoDateToMillis()
        )
        DatePickerDialog(
            onDismissRequest = { showEndDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    endDatePickerState.selectedDateMillis?.let { millis ->
                        viewModel.onEndDateChanged(millisToIsoDate(millis))
                    }
                    showEndDatePicker = false
                }) { Text("Tamam") }
            },
            dismissButton = {
                TextButton(onClick = { showEndDatePicker = false }) { Text("İptal") }
            }
        ) {
            DatePicker(state = endDatePickerState)
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleSmall,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.secondary
    )
}

private fun millisToIsoDate(millis: Long): String {
    val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
    cal.timeInMillis = millis
    return "%04d-%02d-%02d".format(
        cal.get(Calendar.YEAR),
        cal.get(Calendar.MONTH) + 1,
        cal.get(Calendar.DAY_OF_MONTH)
    )
}

private fun String.isoDateToMillis(): Long? {
    if (length < 10) return null
    return try {
        val parts = split("-")
        val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
        cal.set(Calendar.YEAR, parts[0].toInt())
        cal.set(Calendar.MONTH, parts[1].toInt() - 1)
        cal.set(Calendar.DAY_OF_MONTH, parts[2].toInt())
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        cal.timeInMillis
    } catch (_: Exception) { null }
}
