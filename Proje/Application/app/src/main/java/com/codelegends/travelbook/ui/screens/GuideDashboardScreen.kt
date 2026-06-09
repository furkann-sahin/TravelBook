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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.ui.theme.TravelBookTheme
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel

private data class GuideQuickAction(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val onClick: () -> Unit
)

@Composable
fun GuideDashboardScreen(
    onOpenCompanies: () -> Unit,
    onOpenMyCompanies: () -> Unit,
    onOpenMyTours: () -> Unit,
    onOpenProfile: () -> Unit,
    viewModel: GuideDashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    val quickActions = listOf(
        GuideQuickAction(
            "Tur Firmaları",
            "Tüm tur firmalarını görüntüleyin ve kayıt olun",
            Icons.Default.Business,
            onOpenCompanies
        ),
        GuideQuickAction(
            "Profilim",
            "Rehber bilgilerinizi görüntüleyin ve düzenleyin",
            Icons.Default.Person,
            onOpenProfile
        ),
        GuideQuickAction(
            "Kayıtlı Tur Firmalarım",
            "Kayıt olduğunuz tur firmalarını yönetin",
            Icons.Default.CheckCircle,
            onOpenMyCompanies
        ),
        GuideQuickAction(
            "Kayıtlı Turlarım",
            "Şirket tarafından atanılan turlarınızı görüntüleyin",
            Icons.Default.Map,
            onOpenMyTours
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Top
    ) {
        // Welcome Banner (Firma Paneli stili)
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
                    text = "Hoş geldiniz, ${uiState.session?.name ?: "Rehber"}",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )
                Text(
                    text = "Burası rehber ana sayfanız. Dashboard ve rehberlik operasyonlarına hızlı erişim sağlayabilirsiniz.",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }
        }

        Column(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Hızlı Erişim",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            quickActions.chunked(2).forEach { rowActions ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(IntrinsicSize.Min),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    rowActions.forEach { action ->
                        GuideDashboardActionCard(
                            action = action,
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                        )
                    }
                    if (rowActions.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
    }
}

@Composable
private fun GuideDashboardActionCard(
    action: GuideQuickAction,
    modifier: Modifier = Modifier
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
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                Text(
                    text = "Görüntüle",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.secondary
                )
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(12.dp)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GuideDashboardScreenPreview() {
    TravelBookTheme {
        GuideDashboardScreen(
            onOpenCompanies = {},
            onOpenMyCompanies = {},
            onOpenMyTours = {},
            onOpenProfile = {}
        )
    }
}
