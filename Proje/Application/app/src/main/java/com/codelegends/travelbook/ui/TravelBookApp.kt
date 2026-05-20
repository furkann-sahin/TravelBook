package com.codelegends.travelbook.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.codelegends.travelbook.ui.navigation.AppNavGraph
import com.codelegends.travelbook.ui.navigation.AppRoute
import com.codelegends.travelbook.viewmodel.AppEntryViewModel

@Composable
fun TravelBookApp(
    appEntryViewModel: AppEntryViewModel = hiltViewModel()
) {
    val entryState by appEntryViewModel.state.collectAsState()

    if (entryState.isLoading) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        return
    }

    val startRoute = if (AppRoute.isCompanyRole(entryState.session?.role)) {
        AppRoute.CompanyShell.route
    } else {
        AppRoute.PublicShell.route
    }

    AppNavGraph(
        startDestination = startRoute
    )
}
