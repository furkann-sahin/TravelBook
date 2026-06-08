package com.codelegends.travelbook.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AlternateEmail
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.RateReview
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.core.config.AppConfig
import com.codelegends.travelbook.ui.components.companyprofile.CompanyInfoRow
import com.codelegends.travelbook.ui.components.companyprofile.CompanyProfileHeroCard
import com.codelegends.travelbook.ui.components.companyprofile.CompanyProfileSectionCard
import com.codelegends.travelbook.ui.components.companyprofile.CompanySocialRow
import com.codelegends.travelbook.ui.components.companyprofile.CompanyStatCard
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.viewmodel.CompanyProfileViewModel
import kotlinx.coroutines.launch
import com.codelegends.travelbook.util.readImagePickerPayload
import java.text.SimpleDateFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CompanyProfileScreen(
    onAccountDeleted: () -> Unit = {},
    viewModel: CompanyProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val uriHandler = LocalUriHandler.current
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    val profileImagePicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            val payload = context.contentResolver.readImagePickerPayload(uri, "company-profile")
            if (payload == null) {
                viewModel.showInfoMessage("Görsel okunamadı veya 5 MB sınırı aşıldı")
                return@launch
            }

            viewModel.uploadProfileImage(
                fileName = payload.fileName,
                mimeType = payload.mimeType,
                bytes = payload.bytes
            )
        }
    }

    val bannerImagePicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            val payload = context.contentResolver.readImagePickerPayload(uri, "company-banner")
            if (payload == null) {
                viewModel.showInfoMessage("Görsel okunamadı veya 5 MB sınırı aşıldı")
                return@launch
            }

            viewModel.uploadBannerImage(
                fileName = payload.fileName,
                mimeType = payload.mimeType,
                bytes = payload.bytes
            )
        }
    }

    LaunchedEffect(uiState.infoMessage) {
        val message = uiState.infoMessage ?: return@LaunchedEffect
        snackbarHostState.showSnackbar(message)
        viewModel.consumeInfoMessage()
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp)
                .padding(
                    top = innerPadding.calculateTopPadding() - 14.dp,
                    bottom = innerPadding.calculateBottomPadding()
                ),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            when {
                uiState.isLoading -> {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }

                !uiState.errorMessage.isNullOrBlank() -> {
                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text(
                                text = uiState.errorMessage.orEmpty(),
                                color = MaterialTheme.colorScheme.onErrorContainer
                            )
                            OutlinedButton(onClick = viewModel::retry) {
                                Text(text = "Tekrar Dene")
                            }
                        }
                    }
                }

                uiState.profile == null -> {
                    Card(
                        shape = RoundedCornerShape(14.dp),
                        border = CardDefaults.outlinedCardBorder()
                    ) {
                        Text(
                            text = "Profil bilgisi bulunamadi.",
                            modifier = Modifier.padding(16.dp),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                else -> {
                    val profile = uiState.profile
                    if (profile != null) {
                        val memberSince = formatMemberSince(profile.createdAt)

                        CompanyProfileHeroCard(
                            companyName = profile.name,
                            email = profile.email,
                            rating = profile.rating,
                            profileImageUrl = AppConfig.resolveImageUrl(profile.profileImageUrl),
                            bannerImageUrl = AppConfig.resolveImageUrl(profile.bannerImageUrl),
                            editableName = uiState.form.name,
                            isEditing = uiState.isEditing,
                            isSaving = uiState.isSaving,
                            isUploadingProfileImage = uiState.isUploadingProfileImage,
                            isUploadingBannerImage = uiState.isUploadingBannerImage,
                            onNameChange = viewModel::onNameChanged,
                            onEditClick = viewModel::startEditing,
                            onSaveClick = viewModel::saveProfile,
                            onCancelClick = viewModel::cancelEditing,
                            onProfileImageClick = { profileImagePicker.launch("image/*") },
                            onBannerImageClick = { bannerImagePicker.launch("image/*") }
                        )

                        if (!uiState.saveErrorMessage.isNullOrBlank()) {
                            Card(
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = uiState.saveErrorMessage.orEmpty(),
                                        modifier = Modifier.weight(1f),
                                        color = MaterialTheme.colorScheme.onErrorContainer
                                    )
                                    TextButton(onClick = viewModel::dismissSaveError) {
                                        Text("Kapat")
                                    }
                                }
                            }
                        }

                        CompanyProfileSectionCard(
                            title = "Hakkımızda",
                            leadingIcon = Icons.Default.Info
                        ) {
                            if (uiState.isEditing) {
                                OutlinedTextField(
                                    value = uiState.form.description,
                                    onValueChange = viewModel::onDescriptionChanged,
                                    label = { Text("Açıklama") },
                                    minLines = 3,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            } else {
                                Text(
                                    text = profile.description.ifBlank {
                                        "Henüz bir açıklama eklenmedi. Düzenle ile firmanızı tanıtabilirsiniz."
                                    },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    lineHeight = MaterialTheme.typography.bodyMedium.lineHeight
                                )
                            }
                        }

                        CompanyProfileSectionCard(
                            title = "İletişim ve Sosyal Medya",
                            leadingIcon = Icons.Default.Phone
                        ) {
                            BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
                                val twoColumns = maxWidth >= 560.dp
                                if (twoColumns) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Column(
                                            modifier = Modifier.weight(1f),
                                            verticalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            CompanyInfoRow(
                                                icon = Icons.Default.Email,
                                                label = "E-posta",
                                                value = profile.email
                                            )
                                            if (uiState.isEditing) {
                                                OutlinedTextField(
                                                    value = uiState.form.phone,
                                                    onValueChange = viewModel::onPhoneChanged,
                                                    label = { Text("Telefon") },
                                                    modifier = Modifier.fillMaxWidth()
                                                )
                                            } else {
                                                CompanyInfoRow(
                                                    icon = Icons.Default.Phone,
                                                    label = "Telefon",
                                                    value = profile.phone
                                                )
                                            }
                                        }

                                        Column(
                                            modifier = Modifier.weight(1f),
                                            verticalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            if (uiState.isEditing) {
                                                OutlinedTextField(
                                                    value = uiState.form.address,
                                                    onValueChange = viewModel::onAddressChanged,
                                                    label = { Text("Adres") },
                                                    modifier = Modifier.fillMaxWidth()
                                                )
                                            } else {
                                                CompanyInfoRow(
                                                    icon = Icons.Default.LocationOn,
                                                    label = "Adres",
                                                    value = profile.address
                                                )
                                            }

                                            CompanyInfoRow(
                                                icon = Icons.Default.CalendarMonth,
                                                label = "Üyelik Tarihi",
                                                value = memberSince
                                            )
                                        }
                                    }
                                } else {
                                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                        CompanyInfoRow(
                                            icon = Icons.Default.Email,
                                            label = "E-posta",
                                            value = profile.email
                                        )

                                        if (uiState.isEditing) {
                                            OutlinedTextField(
                                                value = uiState.form.phone,
                                                onValueChange = viewModel::onPhoneChanged,
                                                label = { Text("Telefon") },
                                                modifier = Modifier.fillMaxWidth()
                                            )

                                            OutlinedTextField(
                                                value = uiState.form.address,
                                                onValueChange = viewModel::onAddressChanged,
                                                label = { Text("Adres") },
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                        } else {
                                            CompanyInfoRow(
                                                icon = Icons.Default.Phone,
                                                label = "Telefon",
                                                value = profile.phone
                                            )

                                            CompanyInfoRow(
                                                icon = Icons.Default.LocationOn,
                                                label = "Adres",
                                                value = profile.address
                                            )
                                        }

                                        CompanyInfoRow(
                                            icon = Icons.Default.CalendarMonth,
                                            label = "Üyelik Tarihi",
                                            value = memberSince
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Sosyal Medya",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )

                            if (uiState.isEditing) {
                                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    OutlinedTextField(
                                        value = uiState.form.instagram,
                                        onValueChange = viewModel::onInstagramChanged,
                                        label = { Text("Instagram") },
                                        placeholder = { Text("https://instagram.com/firma") },
                                        modifier = Modifier.fillMaxWidth()
                                    )

                                    OutlinedTextField(
                                        value = uiState.form.linkedin,
                                        onValueChange = viewModel::onLinkedinChanged,
                                        label = { Text("LinkedIn") },
                                        placeholder = { Text("https://linkedin.com/company/firma") },
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                }
                            } else {
                                CompanySocialRow(
                                    icon = Icons.Default.AlternateEmail,
                                    label = "Instagram",
                                    value = profile.instagram
                                )
                                normalizeUrl(profile.instagram)?.let { instagramUrl ->
                                    TextButton(onClick = { uriHandler.openUri(instagramUrl) }) {
                                        Text(text = "Instagram profilini aç")
                                    }
                                }

                                CompanySocialRow(
                                    icon = Icons.Default.Link,
                                    label = "LinkedIn",
                                    value = profile.linkedin
                                )
                                normalizeUrl(profile.linkedin)?.let { linkedinUrl ->
                                    TextButton(onClick = { uriHandler.openUri(linkedinUrl) }) {
                                        Text(text = "LinkedIn profilini aç")
                                    }
                                }
                            }
                        }

                        CompanyProfileSectionCard(
                            title = "İstatistikler",
                            leadingIcon = Icons.Default.Map
                        ) {
                            val statsItems = listOf(
                                Triple(
                                    Icons.Default.Map,
                                    uiState.stats.totalTours.toString(),
                                    "Toplam Tur"
                                ),
                                Triple(
                                    Icons.Default.Star,
                                    "%.1f".format(uiState.stats.averageRating),
                                    "Ortalama Puan"
                                ),
                                Triple(
                                    Icons.Default.RateReview,
                                    uiState.stats.totalReviews.toString(),
                                    "Değerlendirme"
                                ),
                                Triple(
                                    Icons.Default.Groups,
                                    uiState.stats.totalGuides.toString(),
                                    "Kayıtlı Rehber"
                                )
                            )

                            BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
                                val columns = if (maxWidth < 620.dp) 2 else 4
                                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    statsItems.chunked(columns).forEach { row ->
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            row.forEach { stat ->
                                                CompanyStatCard(
                                                    icon = stat.first,
                                                    value = stat.second,
                                                    label = stat.third,
                                                    modifier = Modifier.weight(1f)
                                                )
                                            }

                                            if (row.size < columns) {
                                                repeat(columns - row.size) {
                                                    Spacer(modifier = Modifier.weight(1f))
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        Card(
                            shape = RoundedCornerShape(20.dp),
                            border = CardDefaults.outlinedCardBorder(),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.55f)
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(horizontal = 18.dp, vertical = 16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    androidx.compose.material3.Icon(
                                        imageVector = Icons.Default.DeleteForever,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.error
                                    )
                                    Text(
                                        text = "Tehlikeli Bölge",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = MaterialTheme.colorScheme.error
                                    )
                                }

                                Text(
                                    text = "Hesabı silmek tüm firma verilerini kalıcı olarak kaldırır.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )

                                OutlinedButton(onClick = viewModel::openDeleteDialog) {
                                    Text(text = "Hesabı Sil")
                                }
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
        }
    }

    val dialogProfile = uiState.profile
    if (uiState.isDeleteDialogVisible && dialogProfile != null) {
        AlertDialog(
            onDismissRequest = {
                if (!uiState.isDeleting) {
                    viewModel.closeDeleteDialog()
                }
            },
            title = {
                Text(
                    text = "Hesabı Kalıcı Olarak Sil",
                    color = MaterialTheme.colorScheme.error,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Onay için firma adını girin: ${dialogProfile.name}"
                    )

                    if (!uiState.deleteErrorMessage.isNullOrBlank()) {
                        Text(
                            text = uiState.deleteErrorMessage.orEmpty(),
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }

                    OutlinedTextField(
                        value = uiState.deleteConfirmText,
                        onValueChange = viewModel::onDeleteConfirmTextChanged,
                        label = { Text("Firma Adı") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { viewModel.deleteAccount(onAccountDeleted) },
                    enabled = !uiState.isDeleting
                ) {
                    Text(text = if (uiState.isDeleting) "Siliniyor" else "Sil")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { viewModel.closeDeleteDialog() },
                    enabled = !uiState.isDeleting
                ) {
                    Text(text = "Vazgeç")
                }
            }
        )
    }
}

private fun formatMemberSince(createdAt: String?): String {
    if (createdAt.isNullOrBlank()) return "Belirtilmedi"

    val output = SimpleDateFormat("dd MMMM yyyy", Locale.forLanguageTag("tr-TR"))
    val formats = listOf(
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        "yyyy-MM-dd'T'HH:mm:ssX",
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    )

    formats.forEach { format ->
        runCatching {
            val parser = SimpleDateFormat(format, Locale.US)
            val date = parser.parse(createdAt)
            if (date != null) {
                return output.format(date)
            }
        }
    }

    return createdAt
}

private fun normalizeUrl(raw: String): String? {
    if (raw.isBlank()) return null
    val normalized = raw.trim()
    return if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        normalized
    } else {
        "https://$normalized"
    }
}
