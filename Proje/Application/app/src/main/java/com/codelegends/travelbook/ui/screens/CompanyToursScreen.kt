package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.codelegends.travelbook.core.config.AppConfig
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.ui.components.TBEmptyState
import com.codelegends.travelbook.ui.components.TBErrorCard
import com.codelegends.travelbook.ui.components.TBLoadingContent
import com.codelegends.travelbook.ui.components.TBRatingRow
import com.codelegends.travelbook.ui.components.TourCardImage
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.util.FormatUtils
import com.codelegends.travelbook.viewmodel.CompanyToursViewModel

@Composable
fun CompanyToursScreen(
    onCreateTour: () -> Unit = {},
    onOpenTourDetail: (String) -> Unit = {},
    viewModel: CompanyToursViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) viewModel.retry()
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Map,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(28.dp)
                )
                Text(
                    text = "  Turlarım",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
            }
            Button(
                onClick = onCreateTour,
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Text(" Yeni Tur", fontWeight = FontWeight.SemiBold)
            }
        }

        when {
            uiState.isLoading -> TBLoadingContent()

            !uiState.errorMessage.isNullOrBlank() -> TBErrorCard(
                message = uiState.errorMessage.orEmpty(),
                onRetry = viewModel::retry
            )

            uiState.tours.isEmpty() -> TBEmptyState(
                icon = Icons.Default.Map,
                title = "Henüz tur bulunmuyor",
                subtitle = "Yeni tur oluşturduğunuzda bu sayfada listelenecektir.",
                actionLabel = "Yeni Tur",
                onAction = onCreateTour
            )

            else -> {
                uiState.tours.forEach { tour ->
                    CompanyTourCard(tour = tour, onClick = { onOpenTourDetail(tour.id) })
                }
            }
        }
        Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun CompanyTourCard(tour: CompanyTourSummary, onClick: () -> Unit = {}) {
    Card(
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        onClick = onClick
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            val imageUrl = AppConfig.resolveImageUrl(tour.imagePath)
            TourCardImage(
                imageUrl = imageUrl,
                contentDescription = tour.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(170.dp)
            )

            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = tour.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CalendarMonth,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = " ${FormatUtils.formatDateRange(tour.startDate, tour.endDate)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                if (tour.rating > 0.0) {
                    TBRatingRow(rating = tour.rating, reviewCount = tour.reviewCount)
                }

                if (tour.services.isNotEmpty()) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        tour.services.forEach { service ->
                            AssistChip(
                                onClick = {},
                                label = {
                                    Text(
                                        text = service,
                                        style = MaterialTheme.typography.labelSmall
                                    )
                                },
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary)
                            )
                        }
                    }
                }

                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = FormatUtils.formatPrice(tour.price),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    TextButton(onClick = onClick) {
                        Icon(
                            imageVector = Icons.Default.Visibility,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(text = " Detaylar", style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        }
    }
}

