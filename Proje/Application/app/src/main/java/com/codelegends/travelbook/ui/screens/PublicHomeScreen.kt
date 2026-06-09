package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.BookOnline
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Celebration
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.TravelExplore
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.core.config.AppConfig
import com.codelegends.travelbook.model.FeaturedTourSummary
import com.codelegends.travelbook.ui.components.TBEmptyState
import com.codelegends.travelbook.ui.components.TBErrorCard
import com.codelegends.travelbook.ui.components.TBLoadingContent
import com.codelegends.travelbook.ui.components.TBRatingRow
import com.codelegends.travelbook.ui.components.TourCardImage
import com.codelegends.travelbook.ui.components.TravelBookBrandLogo
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.util.FormatUtils
import com.codelegends.travelbook.viewmodel.PublicHomeViewModel

private data class RoleCardItem(
    val icon: ImageVector,
    val title: String,
    val description: String,
    val tint: Color
)

private data class StepItem(
    val icon: ImageVector,
    val title: String,
    val description: String
)

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun PublicHomeScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToRegister: () -> Unit,
    showTopBar: Boolean = true,
    viewModel: PublicHomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    val roles = listOf(
        RoleCardItem(
            icon = Icons.Default.Explore,
            title = "Gezginler İçin",
            description = "Yüzlerce tur arasından seçim yapın ve unutulmaz deneyimler yaşayın.",
            tint = Color(0xFFD35400)
        ),
        RoleCardItem(
            icon = Icons.Default.Business,
            title = "Firmalar İçin",
            description = "Turlarınızı oluşturun, yönetin ve binlerce gezgine ulaşın.",
            tint = Color(0xFF2980B9)
        ),
        RoleCardItem(
            icon = Icons.Default.Person,
            title = "Rehberler İçin",
            description = "Uzmanlığınızı paylaşın ve rehberlik kariyerinizi ilerletin.",
            tint = Color(0xFF27AE60)
        )
    )

    val steps = listOf(
        StepItem(
            Icons.Default.Search,
            "Keşfet",
            "İlgi alanınıza uygun turları arayın ve filtreleyin."
        ),
        StepItem(
            Icons.Default.BookOnline,
            "Seç ve Katıl",
            "Detayları inceleyin ve rezervasyon yapın."
        ),
        StepItem(
            Icons.Default.Celebration,
            "Deneyimleyin",
            "Profesyonel rehberler eşliğinde maceraya çıkın."
        )
    )

    if (showTopBar) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        TravelBookBrandLogo(
                            iconSize = 24.dp,
                            textStyle = MaterialTheme.typography.titleLarge,
                            textColor = Color.White
                        )
                    },
                    actions = {
                        TextButton(onClick = onNavigateToLogin) {
                            Text(text = "Giriş Yap", color = Color.White)
                        }
                        Button(
                            onClick = onNavigateToRegister,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD35400)),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Text(text = "Kayıt Ol")
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF2D3436))
                )
            }
        ) { innerPadding ->
            PublicHomeContent(
                innerPadding = innerPadding,
                roles = roles, steps = steps,
                isLoading = uiState.isLoading,
                tours = uiState.featuredTours,
                errorMessage = uiState.errorMessage,
                onRetry = viewModel::retry,
                onNavigateToLogin = onNavigateToLogin,
                onNavigateToRegister = onNavigateToRegister
            )
        }
    } else {
        PublicHomeContent(
            innerPadding = PaddingValues(0.dp),
            roles = roles, steps = steps,
            isLoading = uiState.isLoading,
            tours = uiState.featuredTours,
            errorMessage = uiState.errorMessage,
            onRetry = viewModel::retry,
            onNavigateToLogin = onNavigateToLogin,
            onNavigateToRegister = onNavigateToRegister
        )
    }
}

@Composable
private fun PublicHomeContent(
    innerPadding: PaddingValues,
    roles: List<RoleCardItem>,
    steps: List<StepItem>,
    isLoading: Boolean,
    tours: List<FeaturedTourSummary>,
    errorMessage: String?,
    onRetry: () -> Unit,
    onNavigateToLogin: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(innerPadding)
    ) {
        HeroSection(onExploreTours = onNavigateToLogin, onNavigateToRegister = onNavigateToRegister)
        RolesSection(roles = roles)
        FeaturedToursSection(
            isLoading = isLoading,
            tours = tours,
            errorMessage = errorMessage,
            onRetry = onRetry
        )
        StepsSection(steps = steps)
        CtaSection(
            onNavigateToRegister = onNavigateToRegister,
            onNavigateToLogin = onNavigateToLogin
        )
    }
}

// ─── Hero ────────────────────────────────────────────────────────────────────

@Composable
private fun HeroSection(onExploreTours: () -> Unit, onNavigateToRegister: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF1A1E20), Color(0xFF2D3436), Color(0xFFD35400))
                )
            )
            .padding(horizontal = 24.dp, vertical = 44.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Surface(
                shape = CircleShape,
                color = Color.White.copy(alpha = 0.12f),
                modifier = Modifier.size(88.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.TravelExplore,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Keşfedin, Oluşturun\nve Rehberlik Edin",
                style = MaterialTheme.typography.headlineMedium,
                color = Color.White,
                textAlign = TextAlign.Center,
                fontWeight = FontWeight.ExtraBold,
                lineHeight = MaterialTheme.typography.headlineMedium.lineHeight
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "TravelBook — gezginleri, tur firmalarını ve rehberleri tek bir platformda buluşturan seyahat deneyimi.",
                style = MaterialTheme.typography.bodyLarge,
                color = Color.White.copy(alpha = 0.85f),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = onExploreTours,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD35400)),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(vertical = 14.dp)
            ) {
                Icon(
                    Icons.Default.Explore,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Turları Keşfet", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToRegister,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        Color.White.copy(alpha = 0.5f)
                    )
                ) {
                    Text(text = "Firma Ol", fontWeight = FontWeight.SemiBold, maxLines = 1)
                }
                OutlinedButton(
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToRegister,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        Color.White.copy(alpha = 0.5f)
                    )
                ) {
                    Text(text = "Rehber Ol", fontWeight = FontWeight.SemiBold, maxLines = 1)
                }
            }
        }
    }
}

// ─── Roles ───────────────────────────────────────────────────────────────────

@Composable
private fun RolesSection(roles: List<RoleCardItem>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 32.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Herkes İçin Bir Platform",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            text = "İster dünyayı keşfedin, ister turlarınızı yönetin, ister rehberlik yapın.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(4.dp))
        roles.forEach { role ->
            RoleCard(role = role)
        }
    }
}

@Composable
private fun RoleCard(role: RoleCardItem) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = role.tint.copy(alpha = 0.12f),
                modifier = Modifier.size(52.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = role.icon,
                        contentDescription = null,
                        tint = role.tint,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(3.dp)
            ) {
                Text(
                    text = role.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = role.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

// ─── Featured Tours ───────────────────────────────────────────────────────────

@Composable
private fun FeaturedToursSection(
    isLoading: Boolean,
    tours: List<FeaturedTourSummary>,
    errorMessage: String?,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
            .padding(horizontal = 20.dp, vertical = 32.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Öne Çıkan Turlar",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            text = "En popüler deneyimlerden bir seçki.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(4.dp))

        when {
            isLoading -> TBLoadingContent()
            !errorMessage.isNullOrBlank() -> TBErrorCard(message = errorMessage, onRetry = onRetry)
            tours.isEmpty() -> TBEmptyState(
                icon = Icons.Default.TravelExplore,
                title = "Öne çıkan tur bulunamadı",
                subtitle = "Turlar yakında burada görüntülenecek."
            )

            else -> tours.forEach { tour -> FeaturedTourCard(tour = tour) }
        }
    }
}

@Composable
private fun FeaturedTourCard(tour: FeaturedTourSummary) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.background),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column {
            val imageUrl = AppConfig.resolveImageUrl(tour.imagePath)
            TourCardImage(
                imageUrl = imageUrl,
                contentDescription = tour.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
            )

            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = tour.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                val route =
                    if (tour.departureLocation.isNotBlank() && tour.arrivalLocation.isNotBlank()) {
                        "${tour.departureLocation} → ${tour.arrivalLocation}"
                    } else "Konum bilgisi yok"


                if (route.isNotBlank()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowForward,
                            null,
                            tint = MaterialTheme.colorScheme.secondary,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            route,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                val dateStr = FormatUtils.formatDateRange(tour.startDate, tour.endDate)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.CalendarMonth,
                        null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        dateStr,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                TBRatingRow(rating = tour.rating)

                if (tour.companyName.isNotBlank()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Business,
                            null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            tour.companyName,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (tour.price <= 0.0) "Fiyat yakında" else "₺${tour.price.toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    TextButton(onClick = {}) {
                        Text(
                            "Keşfet",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.secondary
                        )
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowForward,
                            null,
                            modifier = Modifier.size(14.dp),
                            tint = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }
        }
    }
}

// ─── Steps ────────────────────────────────────────────────────────────────────

@Composable
private fun StepsSection(steps: List<StepItem>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 32.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Nasıl Çalışır?",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.ExtraBold
        )
        Spacer(modifier = Modifier.height(4.dp))
        steps.forEachIndexed { index, step ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.secondary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = MaterialTheme.colorScheme.onSecondary,
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleSmall
                        )
                    }
                    Column(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(3.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                step.icon,
                                null,
                                tint = MaterialTheme.colorScheme.secondary,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                step.title,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            step.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

@Composable
private fun CtaSection(onNavigateToRegister: () -> Unit, onNavigateToLogin: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF1A1E20), Color(0xFF2D3436), Color(0xFF4A5568))
                )
            )
            .padding(start = 24.dp, end = 24.dp, top = 36.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFD35400).copy(alpha = 0.18f)
            ) {
                Text(
                    text = "ÜCRETSİZ",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFD35400),
                    letterSpacing = 1.sp
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Maceraya Hazır mısınız?",
                style = MaterialTheme.typography.headlineSmall,
                color = Color.White,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Hemen ücretsiz hesap oluşturun ve TravelBook dünyasını keşfetmeye başlayın.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.85f),
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = onNavigateToRegister,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD35400)),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(vertical = 14.dp)
            ) {
                Text(text = "Ücretsiz Kayıt Ol", fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedButton(
                modifier = Modifier.fillMaxWidth(),
                onClick = onNavigateToLogin,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    Color.White.copy(alpha = 0.4f)
                )
            ) {
                Text(text = "Giriş Yap", fontWeight = FontWeight.SemiBold)
            }
            Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
        }
    }
}


