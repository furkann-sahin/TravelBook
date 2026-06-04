package com.codelegends.travelbook.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = Charcoal,
    onPrimary = SurfaceWhite,
    primaryContainer = CharcoalDark,
    onPrimaryContainer = SurfaceWhite,

    secondary = RoadOrange,
    onSecondary = SurfaceWhite,
    secondaryContainer = RoadOrangeDark,
    onSecondaryContainer = SurfaceWhite,

    background = CharcoalDark,
    onBackground = SurfaceWhite,
    surface = Charcoal,
    onSurface = SurfaceWhite,
    onSurfaceVariant = TextSecondary,
    error = RoadOrangeLight
)

private val LightColorScheme = lightColorScheme(
    primary = Charcoal,
    onPrimary = SurfaceWhite,
    primaryContainer = CharcoalLight,
    onPrimaryContainer = SurfaceWhite,

    secondary = RoadOrange,
    onSecondary = SurfaceWhite,
    secondaryContainer = RoadOrangeLight,
    onSecondaryContainer = SurfaceWhite,

    background = WarmBackground,
    onBackground = Charcoal,
    surface = SurfaceWhite,
    onSurface = Charcoal,
    onSurfaceVariant = TextSecondary,
    error = RoadOrangeDark
)

@Composable
fun TravelBookTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && darkTheme -> DarkColorScheme
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}