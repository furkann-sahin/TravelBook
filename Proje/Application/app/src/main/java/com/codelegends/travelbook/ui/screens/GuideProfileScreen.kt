package com.codelegends.travelbook.ui.screens

import android.content.ContentResolver
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.compose.AsyncImage
import com.codelegends.travelbook.ui.components.TravelBookTextField
import com.codelegends.travelbook.viewmodel.GuideProfileViewModel
import com.codelegends.travelbook.viewmodel.GuideProfileUiState
import java.util.*

@Composable
fun GuideProfileScreen(
    onAccountDeleted: () -> Unit,
    viewModel: GuideProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val snackbarHostState = remember { SnackbarHostState() }

    // Image Picker Launchers
    val profileImageLauncher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let { context.contentResolver.readImageUploadPayload(it)?.let { p -> viewModel.uploadProfileImage(p.fileName, p.mimeType, p.bytes) } }
    }
    val bannerImageLauncher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let { context.contentResolver.readImageUploadPayload(it)?.let { p -> viewModel.uploadBannerImage(p.fileName, p.mimeType, p.bytes) } }
    }
    val galleryImageLauncher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let { context.contentResolver.readImageUploadPayload(it)?.let { p -> viewModel.uploadGalleryImage(p.fileName, p.mimeType, p.bytes) } }
    }

    LaunchedEffect(uiState.infoMessage) {
        uiState.infoMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.consumeInfoMessage()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            if (uiState.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (uiState.errorMessage != null) {
                Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                    Text(uiState.errorMessage!!, color = MaterialTheme.colorScheme.error)
                    Button(onClick = viewModel::retry) { Text("Tekrar Dene") }
                }
            } else {
                val profile = uiState.profile ?: return@Scaffold
                Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
                    // Header Section
                    ProfileHeader(
                        uiState = uiState,
                        onEdit = viewModel::startEditing,
                        onSave = viewModel::saveProfile,
                        onCancel = viewModel::cancelEditing,
                        onProfileImageClick = { profileImageLauncher.launch("image/*") },
                        onBannerImageClick = { bannerImageLauncher.launch("image/*") },
                        onAvailabilityChange = viewModel::onAvailabilityChanged
                    )

                    // Completion Bar
                    ProfileCompletionBar(uiState.completionPercentage)

                    Spacer(Modifier.height(16.dp))

                    // Sections
                    Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                        InfoSection(
                            title = "Hakkımda",
                            icon = Icons.Default.Info,
                            isEditing = uiState.isEditing
                        ) {
                            if (uiState.isEditing) {
                                TravelBookTextField(
                                    value = uiState.form.biography,
                                    onValueChange = viewModel::onBiographyChanged,
                                    label = "Biyografi",
                                    singleLine = false,
                                    minLines = 3,
                                    maxLines = 5
                                )
                            } else {
                                Text(profile.biography.ifBlank { "Henüz bir biyografi eklenmedi." }, style = MaterialTheme.typography.bodyMedium)
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        InfoSection(title = "Uzmanlık Bilgileri", icon = Icons.Default.Verified, isEditing = uiState.isEditing) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                if (uiState.isEditing) {
                                    TravelBookTextField(value = uiState.form.languages, onValueChange = viewModel::onLanguagesChanged, label = "Diller", helperText = "Virgülle ayırarak yazın")
                                    TravelBookTextField(value = uiState.form.expertRoutes, onValueChange = viewModel::onExpertRoutesChanged, label = "Uzman Rotalar", helperText = "Virgülle ayırarak yazın")
                                    TravelBookTextField(value = uiState.form.experienceYears, onValueChange = viewModel::onExperienceYearsChanged, label = "Deneyim Yılı", keyboardType = androidx.compose.ui.text.input.KeyboardType.Number)
                                } else {
                                    InfoRow(label = "Diller", value = profile.languages.joinToString(", ").ifBlank { "-" })
                                    InfoRow(label = "Uzman Rotalar", value = profile.expertRoutes.joinToString(", ").ifBlank { "-" })
                                    InfoRow(label = "Deneyim Yılı", value = "${profile.experienceYears} Yıl")
                                }
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        InfoSection(title = "İletişim Bilgileri", icon = Icons.Default.ContactPage, isEditing = uiState.isEditing) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                InfoRow(label = "E-posta", value = profile.email)
                                if (uiState.isEditing) {
                                    TravelBookTextField(value = uiState.form.phone, onValueChange = viewModel::onPhoneChanged, label = "Telefon", keyboardType = androidx.compose.ui.text.input.KeyboardType.Phone)
                                } else {
                                    InfoRow(label = "Telefon", value = profile.phone.ifBlank { "-" })
                                }
                                InfoRow(label = "Üyelik Tarihi", value = formatMemberSince(profile.createdAt))
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        InfoSection(title = "Sosyal Medya", icon = Icons.Default.Share, isEditing = uiState.isEditing) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                if (uiState.isEditing) {
                                    TravelBookTextField(value = uiState.form.instagram, onValueChange = viewModel::onInstagramChanged, label = "Instagram")
                                    TravelBookTextField(value = uiState.form.linkedin, onValueChange = viewModel::onLinkedinChanged, label = "LinkedIn")
                                } else {
                                    SocialRow(label = "Instagram", value = profile.instagram)
                                    SocialRow(label = "LinkedIn", value = profile.linkedin)
                                }
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        InfoSection(title = "İstatistikler", icon = Icons.Default.BarChart, isEditing = false) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                StatCard(Modifier.weight(1f), "Toplam Tur", "${uiState.stats?.totalTours ?: 0}", Icons.Default.Map)
                                StatCard(Modifier.weight(1f), "Deneyim", "${profile.experienceYears} Yıl", Icons.Default.History)
                                StatCard(Modifier.weight(1f), "Puan", "${profile.rating}", Icons.Default.Star)
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        InfoSection(title = "Öne Çıkan Kareler", icon = Icons.Default.Collections, isEditing = true) {
                            Column {
                                if (profile.galleryImages.isEmpty()) {
                                    Text("Henüz fotoğraf eklenmedi.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                } else {
                                    GalleryGrid(images = profile.galleryImages, onDelete = viewModel::removeGalleryImage)
                                }
                                Spacer(Modifier.height(12.dp))
                                Button(
                                    onClick = { galleryImageLauncher.launch("image/*") },
                                    enabled = !uiState.isUploadingGalleryImage,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    if (uiState.isUploadingGalleryImage) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
                                    else {
                                        Icon(Icons.Default.AddAPhoto, null, Modifier.size(18.dp))
                                        Spacer(Modifier.width(8.dp))
                                        Text("Fotoğraf Ekle")
                                    }
                                }
                            }
                        }

                        Spacer(Modifier.height(40.dp))

                        // Danger Zone
                        DangerZone(
                            fullName = profile.fullName,
                            confirmText = uiState.deleteConfirmText,
                            onConfirmChange = viewModel::onDeleteConfirmTextChanged,
                            onDeleteClick = viewModel::openDeleteDialog
                        )

                        Spacer(Modifier.height(100.dp))
                    }
                }
            }
        }
    }

    if (uiState.isDeleteDialogVisible) {
        AlertDialog(
            onDismissRequest = viewModel::closeDeleteDialog,
            title = { Text("Hesabı Sil") },
            text = { Text("Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?") },
            confirmButton = {
                TextButton(
                    onClick = { viewModel.deleteAccount(onAccountDeleted) },
                    enabled = !uiState.isDeleting,
                    colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error)
                ) {
                    if (uiState.isDeleting) CircularProgressIndicator(Modifier.size(20.dp))
                    else Text("SİL")
                }
            },
            dismissButton = {
                TextButton(onClick = viewModel::closeDeleteDialog) { Text("İPTAL") }
            }
        )
    }
}

@Composable
private fun ProfileHeader(
    uiState: GuideProfileUiState,
    onEdit: () -> Unit,
    onSave: () -> Unit,
    onCancel: () -> Unit,
    onProfileImageClick: () -> Unit,
    onBannerImageClick: () -> Unit,
    onAvailabilityChange: (Boolean) -> Unit
) {
    val profile = uiState.profile ?: return
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            Box(modifier = Modifier.fillMaxWidth().height(180.dp)) {
                AsyncImage(
                    model = profile.bannerImageUrl ?: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
                Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.5f)))))
                
                IconButton(
                    onClick = onBannerImageClick,
                    modifier = Modifier.align(Alignment.TopEnd).padding(12.dp).background(Color.Black.copy(alpha = 0.4f), CircleShape)
                ) {
                    Icon(Icons.Default.AddPhotoAlternate, null, tint = Color.White)
                }

                if (uiState.isUploadingBannerImage) {
                    CircularProgressIndicator(Modifier.align(Alignment.Center), color = Color.White)
                }
            }

            Box(modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp).offset(y = (-40).dp)) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Box(modifier = Modifier.size(100.dp).clip(CircleShape).border(4.dp, MaterialTheme.colorScheme.surface, CircleShape).background(MaterialTheme.colorScheme.surface).clickable { onProfileImageClick() }) {
                        if (profile.profileImageUrl != null) {
                            AsyncImage(
                                model = profile.profileImageUrl,
                                contentDescription = null,
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Default.AccountCircle,
                                contentDescription = null,
                                modifier = Modifier.fillMaxSize(),
                                tint = Color.Gray
                            )
                        }
                        Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.2f)), contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.CameraAlt, null, tint = Color.White, modifier = Modifier.size(24.dp))
                        }
                        if (uiState.isUploadingProfileImage) {
                            CircularProgressIndicator(Modifier.align(Alignment.Center), color = Color.White)
                        }
                    }
                    
                    Spacer(Modifier.width(16.dp))
                    
                    Column(Modifier.weight(1f).padding(bottom = 4.dp)) {
                        if (uiState.isEditing) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                TravelBookTextField(value = uiState.form.firstName, onValueChange = { }, label = "Ad", modifier = Modifier.weight(1f))
                                TravelBookTextField(value = uiState.form.lastName, onValueChange = { }, label = "Soyad", modifier = Modifier.weight(1f))
                            }
                        } else {
                            Text(profile.fullName, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                SuggestionChip(
                                    onClick = {},
                                    label = { Text("Rehber") },
                                    icon = { Icon(Icons.Default.CardTravel, null, Modifier.size(16.dp)) }
                                )
                                Spacer(Modifier.width(8.dp))
                                if (profile.rating > 0) {
                                    Icon(Icons.Default.Star, null, tint = Color(0xFFFFB300), modifier = Modifier.size(16.dp))
                                    Text("${profile.rating}", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp).padding(bottom = 24.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.FiberManualRecord,
                        null,
                        tint = if (profile.available) Color(0xFF4CAF50) else Color(0xFF9E9E9E),
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(if (profile.available) "Müsait" else "Meşgul", style = MaterialTheme.typography.bodySmall)
                    Spacer(Modifier.width(12.dp))
                    Switch(checked = profile.available, onCheckedChange = onAvailabilityChange, scale = 0.8f)
                }

                Row {
                    if (uiState.isEditing) {
                        IconButton(onClick = onCancel) { Icon(Icons.Default.Close, null, tint = MaterialTheme.colorScheme.error) }
                        Button(onClick = onSave, enabled = !uiState.isSaving) {
                            if (uiState.isSaving) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
                            else {
                                Icon(Icons.Default.Save, null, Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Kaydet")
                            }
                        }
                    } else {
                        Button(onClick = onEdit) {
                            Icon(Icons.Default.Edit, null, Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Düzenle")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ProfileCompletionBar(percentage: Int) {
    Column(Modifier.fillMaxWidth().padding(24.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Profil Tamamlama", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            Text("%$percentage", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.ExtraBold, color = if(percentage > 70) Color(0xFF4CAF50) else Color(0xFFD35400))
        }
        Spacer(Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { percentage / 100f },
            modifier = Modifier.fillMaxWidth().height(10.dp).clip(CircleShape),
            color = if(percentage > 70) Color(0xFF4CAF50) else Color(0xFFD35400),
            trackColor = MaterialTheme.colorScheme.surfaceVariant
        )
        if (percentage < 100) {
            Text("İpucu: Fotoğraf veya biyografi ekleyerek profilinizi güçlendirin.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 8.dp))
        }
    }
}

@Composable
private fun InfoSection(title: String, icon: ImageVector, isEditing: Boolean, content: @Composable () -> Unit) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(12.dp))
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(12.dp))
        content()
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Column(Modifier.fillMaxWidth()) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
private fun SocialRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Icon(if(label == "Instagram") Icons.Default.CameraAlt else Icons.Default.Link, null, Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.width(8.dp))
        Text(label, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(80.dp))
        Text(value.ifBlank { "Eklenmedi" }, style = MaterialTheme.typography.bodyMedium, color = if(value.isNotBlank()) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun StatCard(modifier: Modifier, label: String, value: String, icon: ImageVector) {
    Card(modifier = modifier, shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))) {
        Column(Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, null, Modifier.size(20.dp), tint = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(4.dp))
            Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.ExtraBold)
            Text(label, style = MaterialTheme.typography.labelSmall, textAlign = TextAlign.Center)
        }
    }
}

@Composable
private fun GalleryGrid(images: List<String>, onDelete: (String) -> Unit) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(100.dp),
        modifier = Modifier.heightIn(max = 400.dp),
        contentPadding = PaddingValues(4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(images) { url ->
            Box(Modifier.aspectRatio(1f).clip(RoundedCornerShape(8.dp))) {
                AsyncImage(model = url, contentDescription = null, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
                IconButton(
                    onClick = { onDelete(url) },
                    modifier = Modifier.align(Alignment.TopEnd).size(24.dp).background(Color.Black.copy(alpha = 0.5f), CircleShape)
                ) {
                    Icon(Icons.Default.Close, null, tint = Color.White, modifier = Modifier.size(14.dp))
                }
            }
        }
    }
}

@Composable
private fun DangerZone(fullName: String, confirmText: String, onConfirmChange: (String) -> Unit, onDeleteClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.1f)),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.error.copy(alpha = 0.2f))
    ) {
        Column(Modifier.padding(20.dp)) {
            Text("Tehlikeli Bölge", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Hesabınızı silmek tüm verilerinizi kalıcı olarak kaldıracaktır.", style = MaterialTheme.typography.bodySmall)
            Spacer(Modifier.height(16.dp))
            
            OutlinedTextField(
                value = confirmText,
                onValueChange = onConfirmChange,
                label = { Text("Silmek için tam adınızı yazın") },
                placeholder = { Text(fullName) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            Spacer(Modifier.height(12.dp))
            
            Button(
                onClick = onDeleteClick,
                modifier = Modifier.fillMaxWidth(),
                enabled = confirmText == fullName,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
            ) {
                Icon(Icons.Default.DeleteForever, null)
                Spacer(Modifier.width(8.dp))
                Text("Hesabımı Kalıcı Olarak Sil")
            }
        }
    }
}

@Composable
fun Switch(checked: Boolean, onCheckedChange: (Boolean) -> Unit, scale: Float = 1f) {
    androidx.compose.material3.Switch(
        checked = checked,
        onCheckedChange = onCheckedChange,
        modifier = Modifier.padding(0.dp)
    )
}

// Helpers
private fun formatMemberSince(date: String?): String {
    return "Ocak 2024" // TODO: Actual parsing
}

data class LocalImagePayload(
    val fileName: String,
    val mimeType: String,
    val bytes: ByteArray
)

private fun ContentResolver.readImageUploadPayload(uri: Uri): LocalImagePayload? {
    return try {
        val bytes = openInputStream(uri)?.use { it.readBytes() } ?: return null
        val fileName = "upload_${System.currentTimeMillis()}.jpg"
        val mimeType = getType(uri) ?: "image/jpeg"
        LocalImagePayload(fileName, mimeType, bytes)
    } catch (e: Exception) { null }
}
