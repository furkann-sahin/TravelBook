package com.codelegends.travelbook.ui.screens

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Map
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.codelegends.travelbook.ui.components.TBEmptyState

@Composable
fun PublicToursScreen() {
    TBEmptyState(
        icon = Icons.Default.Map,
        title = "Turlar Yakında",
        subtitle = "Firmalar tarafından sunulan turları buradan keşfedebileceksiniz.",
        modifier = Modifier.fillMaxSize()
    )
}

