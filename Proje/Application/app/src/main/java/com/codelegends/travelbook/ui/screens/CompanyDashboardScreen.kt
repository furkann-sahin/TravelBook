package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.RateReview
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.ui.components.TBErrorCard
import com.codelegends.travelbook.ui.components.TBLoadingContent
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel

private data class DashboardStat(
    val title: String,
    val value: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector
)

private data class QuickAction(
    val title: String,
    val description: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val onClick: () -> Unit
)

@Composable
fun CompanyDashboardScreen(
    onOpenTours: () -> Unit,
    onOpenGuides: () -> Unit = {},
    onOpenProfile: () -> Unit = {},
    viewModel: CompanyDashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Top
    ) {
        // Welcome Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF1A1E20), Color(0xFF2D3436), Color(0xFF4A5568))
                    )
                )
                .padding(horizontal = 24.dp, vertical = 28.dp)
        ) {
            Column {
                Text(
                    text = "Firma Dashboard",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )
                Text(
                    text = "Yönetim metriklerinizi buradan takip edin.",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }
        }

        Column(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

            when {
                uiState.isLoading -> TBLoadingContent()

                !uiState.errorMessage.isNullOrBlank() -> TBErrorCard(
                    message = uiState.errorMessage.orEmpty(),
                    onRetry = viewModel::retry
                )

                else -> {
                    // Stats section
                    Text(
                        text = "İstatistikler",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    val stats = listOf(
                        DashboardStat(
                            "Toplam Tur",
                            uiState.totalTours.toString(),
                            Icons.Default.Map
                        ),
                        DashboardStat(
                            "Ortalama Puan",
                            "%.1f".format(uiState.averageRating),
                            Icons.Default.Star
                        ),
                        DashboardStat(
                            "Değerlendirme",
                            uiState.totalReviews.toString(),
                            Icons.Default.RateReview
                        ),
                        DashboardStat(
                            "Kayıtlı Rehber",
                            uiState.totalGuides.toString(),
                            Icons.Default.Groups
                        )
                    )

                    stats.chunked(2).forEach { rowStats ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(IntrinsicSize.Min),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            rowStats.forEach { item ->
                                StatCard(
                                    modifier = Modifier
                                        .weight(1f)
                                        .fillMaxHeight(),
                                    item = item
                                )
                            }
                            if (rowStats.size == 1) {
                                Card(
                                    modifier = Modifier.weight(1f),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.background)
                                ) {}
                            }
                        }
                    }

                    HorizontalDivider()

                    // Quick Access section
                    Text(
                        text = "Hızlı Erişim",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    val quickActions = listOf(
                        QuickAction(
                            title = "Turlarım",
                            description = "Turlarınızı yönetin ve yeni tur oluşturun.",
                            icon = Icons.Default.Map,
                            onClick = onOpenTours
                        ),
                        QuickAction(
                            title = "Rehberlerim",
                            description = "Firmanıza kayıtlı rehberleri görüntüleyin.",
                            icon = Icons.Default.Groups,
                            onClick = onOpenGuides
                        ),
                        QuickAction(
                            title = "Profilim",
                            description = "Firma bilgilerinizi güncelleyin.",
                            icon = Icons.Default.Person,
                            onClick = onOpenProfile
                        )
                    )

                    quickActions.chunked(2).forEach { rowActions ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(IntrinsicSize.Min),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            rowActions.forEach { action ->
                                QuickActionCard(
                                    modifier = Modifier
                                        .weight(1f)
                                        .fillMaxHeight(),
                                    action = action
                                )
                            }
                            if (rowActions.size == 1) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
    }
}

@Composable
private fun StatCard(
    modifier: Modifier,
    item: DashboardStat
) {
    Card(
        modifier = modifier.fillMaxHeight(),
        shape = RoundedCornerShape(14.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.secondary
            )
            Text(
                text = item.value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.ExtraBold
            )
            Text(
                text = item.title,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun QuickActionCard(
    modifier: Modifier,
    action: QuickAction
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        onClick = action.onClick
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Icon(
                imageVector = action.icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.secondary,
                modifier = Modifier.size(32.dp)
            )
            Text(
                text = action.title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = action.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(2.dp))
            TextButton(
                onClick = action.onClick,
                contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)
            ) {
                Text(
                    text = "Görüntüle →",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.secondary
                )
            }
        }
    }
}
