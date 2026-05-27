package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.ui.theme.TravelBookTheme
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel

data class GuideQuickAction(
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
    val navBarHeight = LocalNavBarHeight.current

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
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp)
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        // Hoş geldiniz bölümü
        Text(
            text = "Hoş geldiniz, ${uiState.session?.name ?: "Rehber"}",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Burası rehber ana sayfanız. Dashboard ve rehberlik operasyonlarına hızlı erişim için aşağıdaki modülleri kullanabilirsiniz.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Hızlı Erişim Kartları
        quickActions.forEach { action ->
            GuideQuickActionCard(
                action = action,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }

        Spacer(modifier = Modifier.height(navBarHeight + 24.dp))
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

@Composable
private fun GuideQuickActionCard(
    action: GuideQuickAction,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable { action.onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(
                        color = MaterialTheme.colorScheme.primary,
                        shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = action.icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column {
                Text(
                    text = action.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = action.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
