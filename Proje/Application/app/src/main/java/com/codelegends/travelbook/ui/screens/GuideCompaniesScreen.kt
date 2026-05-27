package com.codelegends.travelbook.ui.screens

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
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.compose.AsyncImage
import com.codelegends.travelbook.core.config.AppConfig
import com.codelegends.travelbook.model.CompanyProfileSummary
import com.codelegends.travelbook.ui.components.TBEmptyState
import com.codelegends.travelbook.ui.components.TBErrorCard
import com.codelegends.travelbook.ui.components.TBLoadingContent
import com.codelegends.travelbook.ui.components.TBRatingRow
import com.codelegends.travelbook.ui.navigation.LocalNavBarHeight
import com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel

@Composable
fun GuideCompaniesScreen(
    viewModel: GuideCompaniesViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.infoMessage) {
        uiState.infoMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.consumeInfoMessage()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.Business,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = "Tur Firmaları",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                if (uiState.companies.isNotEmpty()) {
                    Text(
                        text = "${uiState.companies.size} firma listeleniyor",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        when {
            uiState.isLoading -> TBLoadingContent()

            !uiState.errorMessage.isNullOrBlank() -> TBErrorCard(
                message = uiState.errorMessage.orEmpty(),
                onRetry = viewModel::retry
            )

            uiState.companies.isEmpty() -> TBEmptyState(
                icon = Icons.Default.Business,
                title = "Henüz firma bulunmuyor",
                subtitle = "Sisteme kayıtlı firmalar burada görünecek."
            )

            else -> {
                uiState.companies.forEach { company ->
                    val isRegistered = uiState.registeredCompanyIds.contains(company.id)
                    GuideCompanyCard(
                        company = company,
                        onRegister = { viewModel.registerToCompany(company.id) },
                        isRegistering = uiState.isRegistering,
                        isRegistered = isRegistered
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(LocalNavBarHeight.current))
    }
}

@Composable
private fun GuideCompanyCard(
    company: CompanyProfileSummary,
    onRegister: () -> Unit,
    isRegistering: Boolean,
    isRegistered: Boolean
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                val imageUrl = company.profileImageUrl?.let { AppConfig.resolveImageUrl(it) }
                if (imageUrl != null) {
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = company.name,
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = company.name.firstOrNull()?.uppercaseChar()?.toString() ?: "?",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = company.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    if (company.rating > 0.0) {
                        TBRatingRow(rating = company.rating)
                    }
                }
            }

            if (company.address.isNotBlank()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = company.address,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (company.description.isNotBlank()) {
                Text(
                    text = company.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2
                )
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            Button(
                onClick = onRegister,
                modifier = Modifier.fillMaxWidth(),
                enabled = !isRegistering && !isRegistered,
                shape = RoundedCornerShape(10.dp),
                colors = if (isRegistered) {
                    ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer,
                        contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                } else {
                    ButtonDefaults.buttonColors()
                }
            ) {
                val buttonText = when {
                    isRegistered -> "Kayıt Olundu"
                    isRegistering -> "Kaydediliyor..."
                    else -> "Kayıt Ol"
                }
                Text(text = buttonText)
            }
        }
    }
}
