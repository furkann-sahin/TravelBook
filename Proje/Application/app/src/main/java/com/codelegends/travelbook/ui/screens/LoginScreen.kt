package com.codelegends.travelbook.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.CardTravel
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.model.AuthRole
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.ui.components.TravelBookBrandLogo
import com.codelegends.travelbook.ui.components.TravelBookPasswordField
import com.codelegends.travelbook.ui.components.TravelBookTextField
import com.codelegends.travelbook.viewmodel.LoginEvent
import com.codelegends.travelbook.viewmodel.LoginViewModel

private val roleIcons: List<ImageVector> = listOf(
    Icons.Default.Person,
    Icons.Default.Business,
    Icons.Default.CardTravel
)

@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit,
    onNavigateToHome: (UserSession) -> Unit,
    onNavigateBack: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                LoginEvent.NavigateToRegister -> onNavigateToRegister()
                is LoginEvent.NavigateToHome -> onNavigateToHome(event.session)
                LoginEvent.NavigateBack -> onNavigateBack()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF2D3436),
                        Color(0xFF636E72),
                        Color(0xFF2D3436)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    TravelBookBrandLogo(
                        iconSize = 36.dp,
                        textStyle = MaterialTheme.typography.headlineSmall,
                        textColor = MaterialTheme.colorScheme.primary
                    )

                    Spacer(Modifier.height(8.dp))

                    Text(
                        text = "Lütfen rolünüzü seçin ve giriş bilgilerinizi girin.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )

                    Spacer(Modifier.height(20.dp))

                    PrimaryTabRow(
                        selectedTabIndex = uiState.selectedRoleIndex,
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        contentColor = MaterialTheme.colorScheme.primary
                    ) {
                        AuthRole.entries.forEachIndexed { index, role ->
                            Tab(
                                selected = uiState.selectedRoleIndex == index,
                                onClick = { viewModel.onRoleSelected(index) },
                                icon = {
                                    Icon(
                                        imageVector = roleIcons[index],
                                        contentDescription = null,
                                        modifier = Modifier.size(18.dp)
                                    )
                                },
                                text = {
                                    Text(
                                        text = role.displayName,
                                        fontWeight = if (uiState.selectedRoleIndex == index) {
                                            FontWeight.Bold
                                        } else {
                                            FontWeight.Normal
                                        },
                                        fontSize = 13.sp
                                    )
                                }
                            )
                        }
                    }

                    Spacer(Modifier.height(20.dp))

                    AnimatedVisibility(visible = !uiState.errorMessage.isNullOrBlank()) {
                        Column {
                            Surface(
                                modifier = Modifier.fillMaxWidth(),
                                color = MaterialTheme.colorScheme.errorContainer,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = uiState.errorMessage.orEmpty(),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 12.dp, vertical = 10.dp),
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                            Spacer(Modifier.height(12.dp))
                        }
                    }

                    TravelBookTextField(
                        value = uiState.email,
                        onValueChange = viewModel::onEmailChanged,
                        label = "E-posta",
                        keyboardType = KeyboardType.Email
                    )

                    Spacer(Modifier.height(10.dp))

                    TravelBookPasswordField(
                        value = uiState.password,
                        onValueChange = viewModel::onPasswordChanged,
                        label = "Şifre",
                        isVisible = uiState.isPasswordVisible,
                        onVisibilityToggle = viewModel::onPasswordVisibilityToggled
                    )

                    Spacer(Modifier.height(20.dp))

                    val selectedRole = AuthRole.entries[uiState.selectedRoleIndex]
                    val isRoleSupported = selectedRole == AuthRole.COMPANY || selectedRole == AuthRole.GUIDE || selectedRole == AuthRole.USER

                    Button(
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !uiState.isLoading && isRoleSupported,
                        onClick = viewModel::submit,
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(vertical = 14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.secondary
                        )
                    ) {
                        Text(
                            text = if (uiState.isLoading) "Giriş yapılıyor..." else "Giriş Yap",
                            style = MaterialTheme.typography.labelLarge,
                            fontSize = 16.sp
                        )
                    }

                    Spacer(Modifier.height(12.dp))

                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Hesabınız yok mu? ",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        TextButton(
                            onClick = viewModel::onRegisterClicked,
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text(
                                text = "Hesap Oluştur",
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }

                    TextButton(onClick = viewModel::onBackClicked) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = null,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            text = "Ana Sayfaya Dön",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
