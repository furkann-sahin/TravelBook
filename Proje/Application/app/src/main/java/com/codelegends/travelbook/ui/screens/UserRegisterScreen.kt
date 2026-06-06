package com.codelegends.travelbook.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.ui.components.TravelBookPasswordField
import com.codelegends.travelbook.ui.components.TravelBookTextField
import com.codelegends.travelbook.ui.theme.TravelBookTheme
import com.codelegends.travelbook.viewmodel.UserRegisterEvent
import com.codelegends.travelbook.viewmodel.UserRegisterViewModel

@Composable
fun UserRegisterScreen(
    onNavigateToHome: (UserSession) -> Unit,
    onNavigateToLogin: () -> Unit,
    viewModel: UserRegisterViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var isPasswordVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                is UserRegisterEvent.NavigateToHome -> onNavigateToHome(event.session)
                UserRegisterEvent.NavigateToLogin -> onNavigateToLogin()
            }
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Kayıt Ol",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            AnimatedVisibility(visible = !uiState.errorMessage.isNullOrBlank()) {
                Surface(
                    color = MaterialTheme.colorScheme.errorContainer,
                    shape = MaterialTheme.shapes.small,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                ) {
                    Text(
                        text = uiState.errorMessage.orEmpty(),
                        color = MaterialTheme.colorScheme.onErrorContainer,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(12.dp),
                        textAlign = TextAlign.Center
                    )
                }
            }

            TravelBookTextField(
                value = uiState.firstName,
                onValueChange = viewModel::onFirstNameChanged,
                label = "Ad",
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            TravelBookTextField(
                value = uiState.lastName,
                onValueChange = viewModel::onLastNameChanged,
                label = "Soyad",
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            TravelBookTextField(
                value = uiState.email,
                onValueChange = viewModel::onEmailChanged,
                label = "E-posta",
                keyboardType = KeyboardType.Email,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            TravelBookTextField(
                value = uiState.phone,
                onValueChange = viewModel::onPhoneChanged,
                label = "Telefon",
                keyboardType = KeyboardType.Phone,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            TravelBookPasswordField(
                value = uiState.password,
                onValueChange = viewModel::onPasswordChanged,
                label = "Şifre",
                isVisible = isPasswordVisible,
                onVisibilityToggle = { isPasswordVisible = !isPasswordVisible },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = viewModel::register,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium,
                enabled = !uiState.isLoading
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.height(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "Kayıt Ol",
                        style = MaterialTheme.typography.titleMedium,
                        modifier = Modifier.padding(vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Zaten hesabınız var mı?",
                    style = MaterialTheme.typography.bodyMedium
                )
                TextButton(
                    onClick = viewModel::onLoginClicked,
                    enabled = !uiState.isLoading
                ) {
                    Text(
                        text = "Giriş Yap",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.secondary
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun UserRegisterScreenPreview() {
    TravelBookTheme {
        Surface {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Kayıt Ol",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(32.dp))
                TravelBookTextField(value = "", onValueChange = {}, label = "Ad")
                Spacer(modifier = Modifier.height(16.dp))
                TravelBookTextField(value = "", onValueChange = {}, label = "Soyad")
                Spacer(modifier = Modifier.height(16.dp))
                TravelBookTextField(value = "", onValueChange = {}, label = "E-posta")
                Spacer(modifier = Modifier.height(16.dp))
                TravelBookPasswordField(value = "", onValueChange = {}, label = "Şifre", isVisible = false, onVisibilityToggle = {})
                Spacer(modifier = Modifier.height(24.dp))
                Button(onClick = {}, modifier = Modifier.fillMaxWidth()) {
                    Text("Kayıt Ol")
                }
                Spacer(modifier = Modifier.height(16.dp))
                Row {
                    Text("Zaten hesabınız var mı?")
                    TextButton(onClick = {}) {
                        Text("Giriş Yap", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
