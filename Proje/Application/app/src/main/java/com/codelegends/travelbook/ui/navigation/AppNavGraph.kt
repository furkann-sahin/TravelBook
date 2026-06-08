package com.codelegends.travelbook.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import com.codelegends.travelbook.ui.components.TravelBookBottomNavigation
import com.codelegends.travelbook.ui.components.TravelBookBrandLogo
import com.codelegends.travelbook.ui.components.TravelBookNavItem
import com.codelegends.travelbook.ui.screens.CompanyDashboardScreen
import com.codelegends.travelbook.ui.screens.CompanyGuidesScreen
import com.codelegends.travelbook.ui.screens.CompanyHomeScreen
import com.codelegends.travelbook.ui.screens.CompanyProfileScreen
import com.codelegends.travelbook.ui.screens.CompanyTourDetailScreen
import com.codelegends.travelbook.ui.screens.CompanyToursScreen
import com.codelegends.travelbook.ui.screens.CreateTourScreen
import com.codelegends.travelbook.ui.screens.GuideDashboardScreen
import com.codelegends.travelbook.ui.screens.GuideCompaniesScreen
import com.codelegends.travelbook.ui.screens.GuideMyCompaniesScreen
import com.codelegends.travelbook.ui.screens.GuideMyToursScreen
import com.codelegends.travelbook.ui.screens.GuideHomeScreen
import com.codelegends.travelbook.ui.screens.GuideProfileScreen
import com.codelegends.travelbook.ui.screens.LoginScreen
import com.codelegends.travelbook.ui.screens.PublicAboutScreen
import com.codelegends.travelbook.ui.screens.PublicHomeScreen
import com.codelegends.travelbook.ui.screens.PublicToursScreen
import com.codelegends.travelbook.ui.screens.RegisterScreen
import com.codelegends.travelbook.ui.screens.TourListingScreen
import com.codelegends.travelbook.ui.screens.UserGuideListScreen
import com.codelegends.travelbook.ui.screens.UserHomeScreen
import com.codelegends.travelbook.ui.screens.UserTourDetailScreen
import com.codelegends.travelbook.viewmodel.CompanyShellViewModel
import com.codelegends.travelbook.viewmodel.GuideShellViewModel
import com.codelegends.travelbook.viewmodel.UserShellViewModel

/**
 * Height of the floating bottom nav bar provided by the active shell.
 * Screens add a matching [Spacer] at the end of their scrollable content
 * so the last item scrolls fully clear of the overlay without
 * permanently shrinking the visible screen area.
 */
val LocalNavBarHeight = compositionLocalOf { 0.dp }

@Composable
fun AppNavGraph(
    startDestination: String,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(AppRoute.PublicShell.route) {
            PublicAppShell(
                onNavigateToLogin = {
                    navController.navigate(AppRoute.Login.route) {
                        launchSingleTop = true
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(AppRoute.Register.route) {
                        launchSingleTop = true
                    }
                }
            )
        }

        navigation(
            startDestination = AppRoute.Login.route,
            route = AppRoute.AuthGraph.route
        ) {
            composable(AppRoute.Login.route) {
                LoginScreen(
                    onNavigateToRegister = {
                        navController.navigate(AppRoute.Register.route) {
                            launchSingleTop = true
                        }
                    },
                    onNavigateToHome = { session ->
                        android.util.Log.d("TravelBookNav", "Navigating to home. Role: ${session.role}")
                        val route = when {
                            AppRoute.isCompanyRole(session.role) -> AppRoute.CompanyShell.route
                            AppRoute.isGuideRole(session.role) -> AppRoute.GuideShell.route
                            AppRoute.isUserRole(session.role) -> AppRoute.UserShell.route
                            else -> AppRoute.PublicShell.route
                        }
                        android.util.Log.d("TravelBookNav", "Calculated route: $route")
                        navController.navigate(route) {
                            popUpTo(AppRoute.AuthGraph.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },
                    onNavigateBack = {
                        navController.navigate(AppRoute.PublicShell.route) {
                            popUpTo(AppRoute.AuthGraph.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }

            composable(AppRoute.Register.route) {
                RegisterScreen(
                    onNavigateToLogin = {
                        navController.navigate(AppRoute.Login.route) {
                            launchSingleTop = true
                        }
                    },
                    onNavigateToHome = { session ->
                        android.util.Log.d("TravelBookNav", "Navigating to home. Role: ${session.role}")
                        val route = when {
                            AppRoute.isCompanyRole(session.role) -> AppRoute.CompanyShell.route
                            AppRoute.isGuideRole(session.role) -> AppRoute.GuideShell.route
                            AppRoute.isUserRole(session.role) -> AppRoute.UserShell.route
                            else -> AppRoute.PublicShell.route
                        }
                        android.util.Log.d("TravelBookNav", "Calculated route: $route")
                        navController.navigate(route) {
                            popUpTo(AppRoute.AuthGraph.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    },
                    onNavigateBack = {
                        navController.navigate(AppRoute.PublicShell.route) {
                            popUpTo(AppRoute.AuthGraph.route) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
            }
        }

        composable(AppRoute.CompanyShell.route) {
            CompanyAppShell(
                onLoggedOut = {
                    navController.navigate(AppRoute.PublicShell.route) {
                        popUpTo(AppRoute.CompanyShell.route) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            )
        }

        composable(AppRoute.GuideShell.route) {
            GuideAppShell(
                onLoggedOut = {
                    navController.navigate(AppRoute.PublicShell.route) {
                        popUpTo(AppRoute.GuideShell.route) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            )
        }

        composable(AppRoute.UserShell.route) {
            UserAppShell(
                onLoggedOut = {
                    navController.navigate(AppRoute.Login.route) {
                        popUpTo(AppRoute.UserShell.route) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun UserAppShell(
    onLoggedOut: () -> Unit,
    viewModel: UserShellViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val shellNavController = rememberNavController()
    val navBackStackEntry by shellNavController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showBottomBar = AppRoute.userTabRoutes.contains(currentRoute)
    var menuExpanded by remember { mutableStateOf(false) }

    val tabs = listOf(
        TravelBookNavItem(AppRoute.UserTours.route, "Turlar", Icons.Default.Map),
        TravelBookNavItem(AppRoute.UserGuides.route, "Rehberler", Icons.Default.People),
        TravelBookNavItem(
            route = AppRoute.UserHome.route,
            label = "",
            icon = Icons.Default.Home,
            contentDescription = "Ana Sayfa",
            isHome = true
        ),
        TravelBookNavItem(AppRoute.UserProfile.route, "Profilim", Icons.Default.Person)
    )

    val density = LocalDensity.current
    var navBarHeightPx by remember { mutableIntStateOf(0) }
    val navBarHeightDp = with(density) { navBarHeightPx.toDp() }

    Scaffold(
        topBar = {
            if (showBottomBar) TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        TravelBookBrandLogo(
                            iconSize = 24.dp,
                            textStyle = MaterialTheme.typography.titleMedium,
                            textColor = MaterialTheme.colorScheme.onSurface,
                            spacing = 6.dp
                        )

                        Spacer(modifier = Modifier.width(8.dp))

                        Surface(
                            color = MaterialTheme.colorScheme.primary,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "KULLANICI PANELİ",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onPrimary,
                                letterSpacing = 0.6.sp
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { menuExpanded = true }) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Menü"
                        )
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text(text = uiState.session?.email.orEmpty()) },
                            onClick = {},
                            enabled = false
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Default.Info,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Hakkımızda") },
                            onClick = {
                                menuExpanded = false
                                shellNavController.navigate(AppRoute.PublicAbout.route) {
                                    launchSingleTop = true
                                }
                            }
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.Logout,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Çıkış Yap") },
                            enabled = !uiState.isLoggingOut,
                            onClick = {
                                menuExpanded = false
                                viewModel.logout(onLoggedOut)
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            if (showBottomBar) {
                AppBottomNavBar(
                    items = tabs,
                    currentRoute = currentRoute,
                    onRouteSelected = { route ->
                        if (currentRoute != route) shellNavController.navigateToTopLevel(route)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .onSizeChanged { navBarHeightPx = it.height }
                )
            }
        }
    ) { innerPadding ->
        CompositionLocalProvider(LocalNavBarHeight provides if (showBottomBar) navBarHeightDp else 0.dp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = innerPadding.calculateTopPadding())
            ) {
                NavHost(
                    navController = shellNavController,
                    startDestination = AppRoute.UserHome.route,
                    modifier = Modifier.fillMaxSize()
                ) {
                    composable(AppRoute.UserHome.route) {
                        UserHomeScreen(
                            onExploreTours = {
                                shellNavController.navigateToTopLevel(AppRoute.UserTours.route)
                            }
                        )
                    }

                    composable(AppRoute.UserTours.route) {
                        TourListingScreen(
                            onTourClick = { tourId ->
                                shellNavController.navigate(AppRoute.UserTourDetail.createRoute(tourId))
                            }
                        )
                    }

                    composable(
                        route = AppRoute.UserTourDetail.route,
                        arguments = listOf(
                            androidx.navigation.navArgument("tourId") {
                                type = androidx.navigation.NavType.StringType
                            }
                        )
                    ) { backStackEntry ->
                        val tourId = backStackEntry.arguments?.getString("tourId").orEmpty()
                        UserTourDetailScreen(
                            tourId = tourId,
                            onNavigateBack = { shellNavController.popBackStack() }
                        )
                    }

                    composable(AppRoute.UserGuides.route) {
                        UserGuideListScreen(
                            onGuideClick = { /* TODO: Open Detail */ }
                        )
                    }

                    composable(AppRoute.UserProfile.route) {
                        com.codelegends.travelbook.ui.screens.UserProfileScreen(
                            onAccountDeleted = onLoggedOut
                        )
                    }

                    composable(AppRoute.PublicAbout.route) {
                        PublicAboutScreen()
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PublicAppShell(
    onNavigateToLogin: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    val shellNavController = rememberNavController()
    val navBackStackEntry by shellNavController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val tabs = listOf(
        TravelBookNavItem(AppRoute.PublicTours.route, "Turlar", Icons.Default.Map),
        TravelBookNavItem(
            route = AppRoute.PublicHome.route,
            label = "",
            icon = Icons.Default.Home,
            contentDescription = "Ana Sayfa",
            isHome = true
        ),
        TravelBookNavItem(AppRoute.PublicAbout.route, "Hakkında", Icons.Default.Info)
    )

    // Measure the actual rendered height of the floating nav bar so that
    // page content can be padded exactly by that amount — no hard-coded
    // constant, works correctly across all gesture-nav modes and screen sizes.
    val density = LocalDensity.current
    var navBarHeightPx by remember { mutableIntStateOf(0) }
    val navBarHeightDp = with(density) { navBarHeightPx.toDp() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    TravelBookBrandLogo(
                        iconSize = 28.dp,
                        textStyle = MaterialTheme.typography.titleLarge,
                        textColor = MaterialTheme.colorScheme.onSurface
                    )
                },
                actions = {
                    TextButton(onClick = onNavigateToLogin) {
                        Text(text = "Giriş Yap")
                    }
                    Button(onClick = onNavigateToRegister) {
                        Text(text = "Kayıt Ol")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
    ) { innerPadding ->
        CompositionLocalProvider(LocalNavBarHeight provides navBarHeightDp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = innerPadding.calculateTopPadding())
            ) {
                NavHost(
                    navController = shellNavController,
                    startDestination = AppRoute.PublicHome.route,
                    modifier = Modifier.fillMaxSize()
                ) {
                    composable(AppRoute.PublicHome.route) {
                        PublicHomeScreen(
                            onNavigateToLogin = onNavigateToLogin,
                            onNavigateToRegister = onNavigateToRegister,
                            showTopBar = false
                        )
                    }

                    composable(AppRoute.PublicTours.route) {
                        PublicToursScreen()
                    }

                    composable(AppRoute.PublicAbout.route) {
                        PublicAboutScreen()
                    }
                }

                AppBottomNavBar(
                    items = tabs,
                    currentRoute = currentRoute,
                    onRouteSelected = { route ->
                        if (currentRoute != route) shellNavController.navigateToTopLevel(route)
                    },
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .onSizeChanged { navBarHeightPx = it.height }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CompanyAppShell(
    onLoggedOut: () -> Unit,
    viewModel: CompanyShellViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val shellNavController = rememberNavController()
    val navBackStackEntry by shellNavController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showBottomBar = AppRoute.companyTabRoutes.contains(currentRoute)
    var menuExpanded by remember { mutableStateOf(false) }

    val tabs = listOf(
        TravelBookNavItem(AppRoute.CompanyTours.route, "Turlar", Icons.Default.Map),
        TravelBookNavItem(AppRoute.CompanyGuides.route, "Rehberler", Icons.Default.People),
        TravelBookNavItem(
            route = AppRoute.CompanyHome.route,
            label = "",
            icon = Icons.Default.Home,
            contentDescription = "Ana Sayfa",
            isHome = true
        ),
        TravelBookNavItem(AppRoute.CompanyDashboard.route, "Panel", Icons.Default.Dashboard),
        TravelBookNavItem(AppRoute.CompanyProfile.route, "Profil", Icons.Default.Person)
    )

    val density = LocalDensity.current
    var navBarHeightPx by remember { mutableIntStateOf(0) }
    val navBarHeightDp = with(density) { navBarHeightPx.toDp() }

    Scaffold(
        topBar = {
            if (showBottomBar) TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        TravelBookBrandLogo(
                            iconSize = 24.dp,
                            textStyle = MaterialTheme.typography.titleMedium,
                            textColor = MaterialTheme.colorScheme.onSurface,
                            spacing = 6.dp
                        )

                        Spacer(modifier = Modifier.width(8.dp))

                        Surface(
                            color = MaterialTheme.colorScheme.secondary,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "FİRMA PANELİ",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onSecondary,
                                letterSpacing = 0.6.sp
                            )
                        }
                    }
                },
                navigationIcon = {},
                actions = {
                    IconButton(onClick = { menuExpanded = true }) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Menü"
                        )
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text(text = uiState.session?.email.orEmpty()) },
                            onClick = {},
                            enabled = false
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Default.Info,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Hakkımızda") },
                            onClick = {
                                menuExpanded = false
                                shellNavController.navigate(AppRoute.PublicAbout.route) {
                                    launchSingleTop = true
                                }
                            }
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.Logout,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Çıkış Yap") },
                            enabled = !uiState.isLoggingOut,
                            onClick = {
                                menuExpanded = false
                                viewModel.logout(onLoggedOut)
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            if (showBottomBar) {
                AppBottomNavBar(
                    items = tabs,
                    currentRoute = currentRoute,
                    onRouteSelected = { route ->
                        if (currentRoute != route) shellNavController.navigateToTopLevel(route)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .onSizeChanged { navBarHeightPx = it.height }
                )
            }
        }
    ) { innerPadding ->
        CompositionLocalProvider(LocalNavBarHeight provides if (showBottomBar) navBarHeightDp else 0.dp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = innerPadding.calculateTopPadding())
            ) {
                NavHost(
                    navController = shellNavController,
                    startDestination = AppRoute.CompanyHome.route,
                    modifier = Modifier
                        .fillMaxSize()
                ) {
                    composable(AppRoute.CompanyHome.route) {
                        CompanyHomeScreen(
                            onOpenDashboard = {
                                shellNavController.navigate(AppRoute.CompanyDashboard.route) {
                                    launchSingleTop = true
                                }
                            },
                            onOpenTours = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyTours.route)
                            },
                            onOpenGuides = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyGuides.route)
                            },
                            onOpenProfile = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyProfile.route)
                            }
                        )
                    }

                    composable(AppRoute.CompanyDashboard.route) {
                        CompanyDashboardScreen(
                            onOpenTours = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyTours.route)
                            },
                            onOpenGuides = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyGuides.route)
                            },
                            onOpenProfile = {
                                shellNavController.navigateToTopLevel(AppRoute.CompanyProfile.route)
                            }
                        )
                    }

                    composable(AppRoute.CompanyTours.route) {
                        CompanyToursScreen(
                            onCreateTour = {
                                shellNavController.navigate(AppRoute.CompanyTourCreate.route)
                            },
                            onOpenTourDetail = { tourId ->
                                shellNavController.navigate(
                                    AppRoute.CompanyTourDetail.createRoute(
                                        tourId
                                    )
                                )
                            }
                        )
                    }

                    composable(AppRoute.CompanyTourCreate.route) {
                        CreateTourScreen(
                            onNavigateBack = { shellNavController.popBackStack() },
                            onTourCreated = { shellNavController.popBackStack() }
                        )
                    }

                    composable(
                        route = AppRoute.CompanyTourDetail.route,
                        arguments = listOf(
                            androidx.navigation.navArgument("tourId") {
                                type = androidx.navigation.NavType.StringType
                            }
                        )
                    ) { backStackEntry ->
                        val tourId = backStackEntry.arguments?.getString("tourId").orEmpty()
                        CompanyTourDetailScreen(
                            tourId = tourId,
                            onNavigateBack = { shellNavController.popBackStack() }
                        )
                    }

                    composable(AppRoute.CompanyGuides.route) {
                        CompanyGuidesScreen(
                        )
                    }

                    composable(AppRoute.CompanyProfile.route) {
                        CompanyProfileScreen(onAccountDeleted = onLoggedOut)
                    }

                    composable(AppRoute.PublicAbout.route) {
                        PublicAboutScreen()
                    }
                }
            }
        } // CompositionLocalProvider
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GuideAppShell(
    onLoggedOut: () -> Unit,
    viewModel: GuideShellViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val shellNavController = rememberNavController()
    val navBackStackEntry by shellNavController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showBottomBar = AppRoute.guideTabRoutes.contains(currentRoute)
    var menuExpanded by remember { mutableStateOf(false) }

    val tabs = listOf(
        TravelBookNavItem(AppRoute.GuideCompanies.route, "Firmalar", Icons.Default.Business),
        TravelBookNavItem(AppRoute.GuideDashboard.route, "Panel", Icons.Default.Dashboard),
        TravelBookNavItem(
            route = AppRoute.GuideHome.route,
            label = "",
            icon = Icons.Default.Home,
            contentDescription = "Ana Sayfa",
            isHome = true
        ),
        TravelBookNavItem(AppRoute.GuideMyTours.route, "Turlar", Icons.Default.Map),
        TravelBookNavItem(AppRoute.GuideProfile.route, "Profilim", Icons.Default.Person)
    )

    val density = LocalDensity.current
    var navBarHeightPx by remember { mutableIntStateOf(0) }
    val navBarHeightDp = with(density) { navBarHeightPx.toDp() }

    Scaffold(
        topBar = {
            if (showBottomBar) TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        TravelBookBrandLogo(
                            iconSize = 24.dp,
                            textStyle = MaterialTheme.typography.titleMedium,
                            textColor = MaterialTheme.colorScheme.onSurface,
                            spacing = 6.dp
                        )

                        Spacer(modifier = Modifier.width(8.dp))

                        Surface(
                            color = MaterialTheme.colorScheme.secondary,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "REHBER PANELİ",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onSecondary,
                                letterSpacing = 0.6.sp
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { menuExpanded = true }) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Menü"
                        )
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text(text = uiState.session?.email.orEmpty()) },
                            onClick = {},
                            enabled = false
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Default.Info,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Hakkımızda") },
                            onClick = {
                                menuExpanded = false
                                shellNavController.navigate(AppRoute.PublicAbout.route) {
                                    launchSingleTop = true
                                }
                            }
                        )
                        DropdownMenuItem(
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.Logout,
                                    contentDescription = null
                                )
                            },
                            text = { Text("Çıkış Yap") },
                            enabled = !uiState.isLoggingOut,
                            onClick = {
                                menuExpanded = false
                                viewModel.logout(onLoggedOut)
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            if (showBottomBar) {
                AppBottomNavBar(
                    items = tabs,
                    currentRoute = currentRoute,
                    onRouteSelected = { route ->
                        if (currentRoute != route) shellNavController.navigateToTopLevel(route)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .onSizeChanged { navBarHeightPx = it.height }
                )
            }
        }
    ) { innerPadding ->
        CompositionLocalProvider(LocalNavBarHeight provides if (showBottomBar) navBarHeightDp else 0.dp) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = innerPadding.calculateTopPadding())
            ) {
                NavHost(
                    navController = shellNavController,
                    startDestination = AppRoute.GuideHome.route,
                    modifier = Modifier.fillMaxSize()
                ) {
                    composable(AppRoute.GuideHome.route) {
                        GuideHomeScreen(
                            onOpenDashboard = {
                                shellNavController.navigate(AppRoute.GuideDashboard.route) {
                                    launchSingleTop = true
                                }
                            },
                            onOpenCompanies = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideCompanies.route)
                            },
                            onOpenMyCompanies = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideMyCompanies.route)
                            },
                            onOpenMyTours = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideMyTours.route)
                            },
                            onOpenProfile = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideProfile.route)
                            }
                        )
                    }

                    composable(AppRoute.GuideDashboard.route) {
                        GuideDashboardScreen(
                            onOpenCompanies = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideCompanies.route)
                            },
                            onOpenMyCompanies = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideMyCompanies.route)
                            },
                            onOpenMyTours = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideMyTours.route)
                            },
                            onOpenProfile = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideProfile.route)
                            }
                        )
                    }

                    composable(AppRoute.GuideCompanies.route) {
                        GuideCompaniesScreen(
                            onNavigateBack = { shellNavController.popBackStack() }
                        )
                    }

                    composable(AppRoute.GuideMyCompanies.route) {
                        GuideMyCompaniesScreen(
                            onNavigateBack = { shellNavController.popBackStack() },
                            onExploreCompanies = {
                                shellNavController.navigateToTopLevel(AppRoute.GuideCompanies.route)
                            }
                        )
                    }

                    composable(AppRoute.GuideMyTours.route) {
                        GuideMyToursScreen(
                            onNavigateBack = { shellNavController.popBackStack() }
                        )
                    }

                    composable(AppRoute.GuideProfile.route) {
                        GuideProfileScreen(onAccountDeleted = onLoggedOut)
                    }

                    composable(AppRoute.PublicAbout.route) {
                        PublicAboutScreen()
                    }
                }
            }
        }
    }
}

@Composable
private fun PlaceholderScreen(title: String) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(text = "$title Yakında Eklenecek", style = MaterialTheme.typography.titleLarge)
    }
}

private fun NavHostController.navigateToTopLevel(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }
}

/**
 * Shared nav bar overlay for every shell (Public, Company, …).
 * Owns the responsive horizontal padding and proper WindowInsets handling
 * so that every flow uses exactly one implementation.
 * The visual style (transparent pill, spacing, animations) lives entirely
 * inside [TravelBookBottomNavigation] and is unchanged.
 */
@Composable
private fun AppBottomNavBar(
    items: List<TravelBookNavItem>,
    currentRoute: String?,
    onRouteSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(modifier = modifier.fillMaxWidth()) {
        val horizontalPadding = when {
            maxWidth < 600.dp -> 8.dp
            maxWidth < 900.dp -> 14.dp
            else -> 28.dp
        }
        TravelBookBottomNavigation(
            items = items,
            currentRoute = currentRoute,
            onRouteSelected = onRouteSelected,
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = horizontalPadding, vertical = 10.dp)
        )
    }
}
