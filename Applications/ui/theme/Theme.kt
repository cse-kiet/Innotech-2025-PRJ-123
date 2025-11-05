package com.navrakshak.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// NavRakshak Color Scheme based on your CSS variables
private val LightColors = lightColorScheme(
    primary = Color(0xFF030213),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFE9EBEF),
    onPrimaryContainer = Color(0xFF030213),
    secondary = Color(0xFFF2F2F5),
    onSecondary = Color(0xFF030213),
    secondaryContainer = Color(0xFFECECF0),
    onSecondaryContainer = Color(0xFF717182),
    tertiary = Color(0xFF6DB24D), // Green accent for NavRakshak
    onTertiary = Color(0xFFFFFFFF),
    error = Color(0xFFD4183D),
    onError = Color(0xFFFFFFFF),
    background = Color(0xFFFFFFFF),
    onBackground = Color(0xFF1C1B1F),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1C1B1F),
    surfaceVariant = Color(0xFFF3F3F5),
    onSurfaceVariant = Color(0xFF717182),
    outline = Color(0x1A000000),
    outlineVariant = Color(0xFFCBCED4)
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFFFFFF),
    onPrimary = Color(0xFF1C1B1F),
    primaryContainer = Color(0xFF2D2D2D),
    onPrimaryContainer = Color(0xFFFFFFFF),
    secondary = Color(0xFF2D2D2D),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFF2D2D2D),
    onSecondaryContainer = Color(0xFFB3B3B3),
    tertiary = Color(0xFF6DB24D), // Green accent for NavRakshak
    onTertiary = Color(0xFFFFFFFF),
    error = Color(0xFFFF6B6B),
    onError = Color(0xFF1C1B1F),
    background = Color(0xFF1C1B1F),
    onBackground = Color(0xFFFFFFFF),
    surface = Color(0xFF1C1B1F),
    onSurface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFF2D2D2D),
    onSurfaceVariant = Color(0xFFB3B3B3),
    outline = Color(0xFF2D2D2D),
    outlineVariant = Color(0xFF404040)
)

@Composable
fun NavRakshakTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Set to false to use our custom colors
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColors
        else -> LightColors
    }
    
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}