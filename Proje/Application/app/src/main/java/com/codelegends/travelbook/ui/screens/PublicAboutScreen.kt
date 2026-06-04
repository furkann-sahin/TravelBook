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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.SupportAgent
import androidx.compose.material.icons.filled.TravelExplore
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.model.PlatformStatsSummary
import com.codelegends.travelbook.ui.components.TravelBookBrandLogo
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.viewmodel.PublicAboutViewModel
import java.text.NumberFormat
import java.util.Locale

private data class AboutFeature(
    val icon: ImageVector,
    val title: String,
    val description: String,
    val tint: Color
)

private data class TeamMember(
    val name: String,
    val role: String
)

private val aboutFeatures = listOf(
    AboutFeature(
        icon = Icons.Default.TravelExplore,
        title = "Kolay Tur Keşfi",
        description = "Yüzlerce turu arama ve filtreleme ile hızlıca keşfedin.",
        tint = Color(0xFFD35400)
    ),
    AboutFeature(
        icon = Icons.Default.Security,
        title = "Güvenli Rezervasyon",
        description = "Doğrulanmış tur firmaları ve güvenli akışlarla rezervasyon yapın.",
        tint = Color(0xFF2D3436)
    ),
    AboutFeature(
        icon = Icons.Default.Speed,
        title = "Hızlı Deneyim",
        description = "Modern Android mimarisi ile akıcı ve kararlı bir kullanım deneyimi.",
        tint = Color(0xFF2980B9)
    ),
    AboutFeature(
        icon = Icons.Default.SupportAgent,
        title = "Profesyonel Rehberlik",
        description = "Deneyimli rehberler ile daha güvenli ve zengin seyahat planlaması.",
        tint = Color(0xFF27AE60)
    )
)

private val teamMembers = listOf(
    TeamMember(name = "Furkan Fatih Şahin", role = "Takım Lideri"),
    TeamMember(name = "Beyza Keklikoğlu", role = "Geliştirici"),
    TeamMember(name = "Recep Arslan", role = "Geliştirici"),
    TeamMember(name = "Ümmü Fidan", role = "Geliştirici")
)

@Composable
fun PublicAboutScreen(
    viewModel: PublicAboutViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .background(MaterialTheme.colorScheme.background)
    ) {
        AboutHeroSection()

        AboutStatsSection(
            stats = uiState.stats,
            isLoading = uiState.isLoading,
            errorMessage = uiState.errorMessage,
            onRetry = viewModel::retry,
            modifier = Modifier.padding(top = 12.dp)
        )

        AboutMissionSection()
        AboutFeaturesSection()
        AboutTeamSection()

        Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
    }
}

@Composable
private fun AboutHeroSection() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF2D3436),
                        Color(0xFF4A5568),
                        Color(0xFFD35400)
                    )
                )
            )
            .padding(horizontal = 20.dp, vertical = 28.dp)
    ) {
        Box(
            modifier = Modifier
                .size(180.dp)
                .align(Alignment.TopEnd)
                .background(Color.White.copy(alpha = 0.05f), CircleShape)
        )

        Box(
            modifier = Modifier
                .size(120.dp)
                .align(Alignment.BottomStart)
                .background(Color.White.copy(alpha = 0.04f), CircleShape)
        )

        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            AssistChip(
                onClick = {},
                label = {
                    Text(
                        text = "Seyahat Platformu",
                        fontWeight = FontWeight.SemiBold
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Explore,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                colors = AssistChipDefaults.assistChipColors(
                    containerColor = Color.White.copy(alpha = 0.18f),
                    labelColor = Color.White,
                    leadingIconContentColor = Color.White
                )
            )

            Spacer(modifier = Modifier.height(14.dp))

            TravelBookBrandLogo(
                iconSize = 30.dp,
                textStyle = MaterialTheme.typography.headlineSmall,
                textColor = Color.White
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Seyahatin Yeni Adı",
                style = MaterialTheme.typography.titleLarge,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Gezginleri, tur firmalarını ve rehberleri tek platformda buluşturan modern seyahat deneyimi.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.92f),
                textAlign = TextAlign.Center,
                lineHeight = MaterialTheme.typography.bodyMedium.lineHeight
            )
        }
    }
}

@Composable
private fun AboutStatsSection(
    stats: PlatformStatsSummary?,
    isLoading: Boolean,
    errorMessage: String?,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val statItems = listOf(
        "Kayıtlı Kullanıcı" to stats?.userCount,
        "Aktif Tur" to stats?.tourCount,
        "Tur Firması" to stats?.companyCount,
        "Rehber" to stats?.guideCount
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder(),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (!errorMessage.isNullOrBlank()) {
                Text(
                    text = errorMessage,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )

                OutlinedButton(onClick = onRetry) {
                    Text(text = "Tekrar Dene")
                }
            }

            statItems.chunked(2).forEach { rowItems ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(IntrinsicSize.Min),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    rowItems.forEach { (label, value) ->
                        StatValueCard(
                            label = label,
                            value = if (isLoading) null else value,
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                        )
                    }

                    if (rowItems.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
private fun StatValueCard(
    label: String,
    value: Int?,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxHeight()
            .shadow(
                elevation = 0.dp,
                shape = RoundedCornerShape(16.dp),
                clip = false
            )
            .background(
                MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
            )
            .heightIn(min = 100.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            if (value == null) {
                CircularProgressIndicator(
                    modifier = Modifier.size(18.dp),
                    strokeWidth = 2.dp
                )
            } else {
                Text(
                    text = NumberFormat.getNumberInstance(Locale.forLanguageTag("tr-TR"))
                        .format(value),
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.secondary,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun AboutMissionSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 18.dp, vertical = 28.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Groups,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.secondary,
            modifier = Modifier.size(40.dp)
        )

        Text(
            text = "Misyonumuz",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold,
            textAlign = TextAlign.Center
        )

        Text(
            text = "TravelBook; seyahat severleri güvenilir tur firmaları ve profesyonel rehberlerle buluşturarak daha güvenli, hızlı ve keyifli bir planlama deneyimi sunar.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun AboutFeaturesSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Neden TravelBook?",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold
        )

        Text(
            text = "Seyahat ekosistemini tek bir modern uygulamada birleştiren temel güçler.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        aboutFeatures.chunked(2).forEach { rowFeatures ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(IntrinsicSize.Min),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                rowFeatures.forEach { feature ->
                    FeatureCard(
                        feature = feature,
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                    )
                }

                if (rowFeatures.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun FeatureCard(
    feature: AboutFeature,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxHeight(),
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = feature.icon,
                contentDescription = null,
                tint = feature.tint,
                modifier = Modifier.size(28.dp)
            )

            Text(
                text = feature.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = feature.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun AboutTeamSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 28.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        AssistChip(
            modifier = Modifier.align(Alignment.CenterHorizontally),
            onClick = {},
            label = { Text(text = "CodeLegends") },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Verified,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
            },
            colors = AssistChipDefaults.assistChipColors(
                containerColor = MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f),
                labelColor = MaterialTheme.colorScheme.secondary,
                leadingIconContentColor = MaterialTheme.colorScheme.secondary
            )
        )

        Text(
            text = "Ekibimiz",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold
        )

        Text(
            text = "TravelBook'u hayata geçiren yazılım mühendisliği ekibi.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        teamMembers.chunked(2).forEach { rowMembers ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(IntrinsicSize.Min),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                rowMembers.forEach { member ->
                    TeamMemberCard(
                        member = member,
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                    )
                }

                if (rowMembers.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun TeamMemberCard(
    member: TeamMember,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxHeight(),
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(58.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.18f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = member.name.firstOrNull()?.uppercase() ?: "T",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.secondary
                )
            }

            Text(
                text = member.name,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )

            Text(
                text = member.role,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.secondary,
                textAlign = TextAlign.Center
            )
        }
    }
}
