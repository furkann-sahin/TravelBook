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

    val sessionRole = entryState.session?.role
    android.util.Log.d("TravelBookApp", "Current session role: $sessionRole")

    val startRoute = when {
        AppRoute.isCompanyRole(sessionRole) -> {
            android.util.Log.d("TravelBookApp", "Matching as Company role")
            AppRoute.CompanyShell.route
        }
        AppRoute.isGuideRole(sessionRole) -> {
            android.util.Log.d("TravelBookApp", "Matching as Guide role")
            AppRoute.GuideShell.route
        }
        AppRoute.isUserRole(sessionRole) -> {
            android.util.Log.d("TravelBookApp", "Matching as User role")
            AppRoute.UserShell.route
        }
        else -> {
            android.util.Log.d("TravelBookApp", "Defaulting to Public shell")
            AppRoute.PublicShell.route
        }
    }
    android.util.Log.d("TravelBookApp", "Final start route: $startRoute")

    AppNavGraph(
        startDestination = startRoute
    )
}
