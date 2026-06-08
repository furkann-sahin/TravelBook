package com.codelegends.travelbook.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.compose.AsyncImage
import com.codelegends.travelbook.core.config.AppConfig
import com.codelegends.travelbook.model.ReviewDto
import com.codelegends.travelbook.model.UserTourDetailDto
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.ui.theme.RoadOrange
import com.codelegends.travelbook.util.FormatUtils
import com.codelegends.travelbook.viewmodel.UserTourDetailViewModel

@Composable
fun UserTourDetailScreen(
    tourId: String,
    onNavigateBack: () -> Unit,
    viewModel: UserTourDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(tourId) {
        viewModel.loadTourDetail(tourId)
    }

    LaunchedEffect(uiState.snackbarMessage) {
        uiState.snackbarMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.dismissSnackbar()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { paddingValues ->
        Box(modifier = Modifier.fillMaxSize().padding(paddingValues)) {
            if (uiState.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else if (!uiState.errorMessage.isNullOrBlank()) {
                Column(
                    modifier = Modifier.align(Alignment.Center).padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(text = uiState.errorMessage!!, color = MaterialTheme.colorScheme.error, textAlign = TextAlign.Center)
                    Spacer(Modifier.height(8.dp))
                    Button(onClick = { viewModel.loadTourDetail(tourId) }) {
                        Text("Tekrar Dene")
                    }
                }
            } else {
                uiState.tour?.let { tour ->
                    UserTourDetailContent(
                        tour = tour,
                        uiState = uiState,
                        viewModel = viewModel,
                        onNavigateBack = onNavigateBack
                    )
                }
            }
        }
    }
}

@Composable
private fun UserTourDetailContent(
    tour: UserTourDetailDto,
    uiState: com.codelegends.travelbook.viewmodel.UserTourDetailUiState,
    viewModel: UserTourDetailViewModel,
    onNavigateBack: () -> Unit
) {
    val navBarHeight = LocalNavBarHeight.current
    var contentVisible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { contentVisible = true }

    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        // Hero Section
        UserTourHeroSection(tour = tour, onNavigateBack = onNavigateBack)

        AnimatedVisibility(
            visible = contentVisible,
            enter = fadeIn(animationSpec = tween(400)) + slideInVertically(animationSpec = tween(400)) { it / 8 }
        ) {
            Column(
                modifier = Modifier.padding(horizontal = 16.dp).padding(bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Spacer(Modifier.height(8.dp))
                
                // Basic Info
                UserTourInfoCard(tour = tour)

                // Description
                if (!tour.description.isNullOrBlank()) {
                    TourDescriptionCard(description = tour.description)
                }

                // Destinations & Services
                if (!tour.places.isNullOrEmpty() || !tour.services.isNullOrEmpty()) {
                    TourPlacesServicesCard(tour = tour)
                }

                // Reviews Section
                ReviewsSection(
                    tourId = tour.id ?: tour.objectId ?: "",
                    reviews = tour.reviews ?: emptyList(),
                    uiState = uiState,
                    viewModel = viewModel
                )

                Spacer(Modifier.height(navBarHeight + 16.dp))
            }
        }
    }
}

@Composable
private fun UserTourHeroSection(
    tour: UserTourDetailDto,
    onNavigateBack: () -> Unit
) {
    val imageUrl = tour.images?.firstOrNull()?.let { AppConfig.resolveImageUrl(it) }

    Box(modifier = Modifier.fillMaxWidth().height(300.dp)) {
        if (!imageUrl.isNullOrBlank()) {
            AsyncImage(
                model = imageUrl,
                contentDescription = tour.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        } else {
            TourHeroPlaceholder(modifier = Modifier.fillMaxSize())
        }

        Box(
            modifier = Modifier.fillMaxSize().background(
                Brush.verticalGradient(
                    colorStops = arrayOf(
                        0.0f to Color.Black.copy(alpha = 0.3f),
                        0.4f to Color.Transparent,
                        1.0f to Color.Black.copy(alpha = 0.7f)
                    )
                )
            )
        )

        IconButton(
            onClick = onNavigateBack,
            modifier = Modifier.align(Alignment.TopStart).padding(8.dp)
        ) {
            Surface(shape = CircleShape, color = Color.Black.copy(alpha = 0.4f)) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Geri",
                    tint = Color.White,
                    modifier = Modifier.padding(8.dp).size(20.dp)
                )
            }
        }

        Column(
            modifier = Modifier.align(Alignment.BottomStart).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = tour.title ?: "Tur Detayı",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Surface(shape = RoundedCornerShape(20.dp), color = RoadOrange) {
                    Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Star, null, tint = Color.White, modifier = Modifier.size(14.dp))
                        Text(text = "%.1f".format(tour.rating ?: 0.0), color = Color.White, style = MaterialTheme.typography.labelMedium)
                    }
                }
                Text(text = "${tour.reviewCount ?: 0} Değerlendirme", color = Color.White, style = MaterialTheme.typography.labelSmall)
            }
        }
    }
}

@Composable
private fun UserTourInfoCard(tour: UserTourDetailDto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text("Fiyat", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("₺${tour.price?.toInt() ?: 0}", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }
                if (!tour.companyName.isNullOrBlank()) {
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Firma", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(tour.companyName, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                    }
                }
            }
            HorizontalDivider()
            TourInfoRow(icon = Icons.Default.LocationOn, label = "Konum", value = tour.location ?: "-")
            TourInfoRow(
                icon = Icons.Default.CalendarMonth,
                label = "Tarih",
                value = "${FormatUtils.formatDate(tour.startDate.orEmpty())} - ${FormatUtils.formatDate(tour.endDate.orEmpty())}"
            )
        }
    }
}

@Composable
private fun ReviewsSection(
    tourId: String,
    reviews: List<ReviewDto>,
    uiState: com.codelegends.travelbook.viewmodel.UserTourDetailUiState,
    viewModel: UserTourDetailViewModel
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        SectionHeader(icon = Icons.Default.Star, title = "Yorumlar (${reviews.size})")

        // Add Review Form (Only if logged in and not editing)
        if (uiState.currentUserId != null && uiState.editingReviewId == null) {
            AddReviewForm(
                comment = uiState.reviewComment,
                rating = uiState.reviewRating,
                isSubmitting = uiState.isSubmittingReview,
                onCommentChange = viewModel::onReviewCommentChanged,
                onRatingChange = viewModel::onReviewRatingChanged,
                onSubmit = { viewModel.submitReview(tourId) }
            )
        }

        if (reviews.isEmpty()) {
            Text(
                text = "Henüz yorum yapılmamış. İlk yorumu siz yapın!",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
                textAlign = TextAlign.Center
            )
        } else {
            reviews.forEach { review ->
                if (uiState.editingReviewId == (review.id ?: review.objectId)) {
                    EditReviewForm(
                        comment = uiState.editComment,
                        rating = uiState.editRating,
                        isSubmitting = uiState.isSubmittingReview,
                        onCommentChange = viewModel::onEditCommentChanged,
                        onRatingChange = viewModel::onEditRatingChanged,
                        onSave = { viewModel.updateReview(tourId) },
                        onCancel = viewModel::cancelEditingReview
                    )
                } else {
                    ReviewItem(
                        review = review,
                        isOwnReview = uiState.currentUserId == review.userId,
                        onEdit = { viewModel.startEditingReview(review) },
                        onDelete = { viewModel.deleteReview(tourId, review.id ?: review.objectId ?: "") }
                    )
                }
            }
        }
    }
}

@Composable
private fun AddReviewForm(
    comment: String,
    rating: Int,
    isSubmitting: Boolean,
    onCommentChange: (String) -> Unit,
    onRatingChange: (Int) -> Unit,
    onSubmit: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.3f))
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Yorum Yap", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            RatingBar(rating = rating, onRatingChange = onRatingChange)
            OutlinedTextField(
                value = comment,
                onValueChange = onCommentChange,
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Deneyiminizi paylaşın...") },
                minLines = 2,
                shape = RoundedCornerShape(8.dp)
            )
            Button(
                onClick = onSubmit,
                modifier = Modifier.align(Alignment.End),
                enabled = !isSubmitting && comment.isNotBlank()
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                } else {
                    Text("Gönder")
                }
            }
        }
    }
}

@Composable
private fun EditReviewForm(
    comment: String,
    rating: Int,
    isSubmitting: Boolean,
    onCommentChange: (String) -> Unit,
    onRatingChange: (Int) -> Unit,
    onSave: () -> Unit,
    onCancel: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Yorumu Düzenle", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
            RatingBar(rating = rating, onRatingChange = onRatingChange)
            OutlinedTextField(
                value = comment,
                onValueChange = onCommentChange,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            )
            Row(modifier = Modifier.align(Alignment.End), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                TextButton(onClick = onCancel, enabled = !isSubmitting) { Text("İptal") }
                Button(onClick = onSave, enabled = !isSubmitting && comment.isNotBlank()) {
                    if (isSubmitting) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                    } else {
                        Text("Güncelle")
                    }
                }
            }
        }
    }
}

@Composable
private fun ReviewItem(
    review: ReviewDto,
    isOwnReview: Boolean,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    var showDeleteConfirm by remember { mutableStateOf(false) }

    if (showDeleteConfirm) {
        androidx.compose.material3.AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("Yorumu Sil") },
            text = { Text("Bu yorumu silmek istediğinizden emin misiniz?") },
            confirmButton = {
                TextButton(onClick = { onDelete(); showDeleteConfirm = false }) { Text("Sil", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) { Text("Vazgeç") }
            }
        )
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text(text = review.userName ?: "Kullanıcı", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                    Text(text = FormatUtils.formatDate(review.createdAt.orEmpty()), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    repeat(5) { index ->
                        Icon(
                            imageVector = if (index < (review.rating ?: 0)) Icons.Default.Star else Icons.Outlined.StarBorder,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = if (index < (review.rating ?: 0)) RoadOrange else MaterialTheme.colorScheme.outline
                        )
                    }
                }
            }
            Text(text = review.comment.orEmpty(), style = MaterialTheme.typography.bodyMedium)
            
            if (isOwnReview) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onEdit) { Text("Düzenle", style = MaterialTheme.typography.labelMedium) }
                    TextButton(onClick = { showDeleteConfirm = true }) { Text("Sil", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.error) }
                }
            }
        }
    }
}

@Composable
private fun RatingBar(rating: Int, onRatingChange: (Int) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        repeat(5) { index ->
            val starIndex = index + 1
            IconButton(onClick = { onRatingChange(starIndex) }, modifier = Modifier.size(32.dp)) {
                Icon(
                    imageVector = if (starIndex <= rating) Icons.Default.Star else Icons.Outlined.StarBorder,
                    contentDescription = "$starIndex Puan",
                    tint = if (starIndex <= rating) RoadOrange else MaterialTheme.colorScheme.outline,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}

// These functions were used in CompanyTourDetail but we need them here for consistency or we can use existing ones if they are public.
// I'll re-implement or call existing ones if available.
// Re-implementing simplified versions for User context.

@Composable
private fun TourPlacesServicesCard(tour: UserTourDetailDto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            if (!tour.places.isNullOrEmpty()) {
                SectionHeader(icon = Icons.Default.LocationOn, title = "Gezilecek Yerler")
                Text(tour.places.joinToString(", "), style = MaterialTheme.typography.bodyMedium)
            }
            if (!tour.services.isNullOrEmpty()) {
                if (!tour.places.isNullOrEmpty()) HorizontalDivider()
                SectionHeader(icon = Icons.Default.Description, title = "Dahil Hizmetler")
                Text(tour.services.joinToString(", "), style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}
