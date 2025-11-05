package com.navrakshak.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.navrakshak.app.data.model.UserType
import com.navrakshak.app.ui.screens.auth.LoginScreen
import com.navrakshak.app.ui.screens.tourist.TouristMainScreen
import com.navrakshak.app.ui.screens.authority.AuthorityMainScreen

@Composable
fun NavRakshakApp() {
    var isLoggedIn by remember { mutableStateOf(false) }
    var userType by remember { mutableStateOf(UserType.TOURIST) }
    var isDarkTheme by remember { mutableStateOf(false) }

    if (!isLoggedIn) {
        LoginScreen(
            isDarkTheme = isDarkTheme,
            onThemeToggle = { isDarkTheme = !isDarkTheme },
            onLogin = { type ->
                isLoggedIn = true
                userType = type
            }
        )
    } else {
        when (userType) {
            UserType.TOURIST -> {
                TouristMainScreen(
                    isDarkTheme = isDarkTheme,
                    onThemeToggle = { isDarkTheme = !isDarkTheme },
                    onLogout = { isLoggedIn = false }
                )
            }
            UserType.AUTHORITY -> {
                AuthorityMainScreen(
                    isDarkTheme = isDarkTheme,
                    onThemeToggle = { isDarkTheme = !isDarkTheme },
                    onLogout = { isLoggedIn = false }
                )
            }
        }
    }
}