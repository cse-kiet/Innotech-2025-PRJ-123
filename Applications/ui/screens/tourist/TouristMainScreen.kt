package com.navrakshak.app.ui.screens.tourist

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.navrakshak.app.data.model.TouristTab
import com.navrakshak.app.ui.components.TopAppBar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TouristMainScreen(
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onLogout: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(TouristTab.DASHBOARD) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = "NavRakshak",
                isDarkTheme = isDarkTheme,
                onThemeToggle = onThemeToggle,
                onLogout = onLogout,
                showBackButton = false
            )
        },
        bottomBar = {
            TouristBottomNavigation(
                selectedTab = selectedTab,
                onTabSelected = { selectedTab = it }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                TouristTab.DASHBOARD -> TouristDashboardScreen()
                TouristTab.DIGITAL_ID -> DigitalIDScreen()
                TouristTab.EMERGENCY -> EmergencyPanelScreen()
                TouristTab.SETTINGS -> SettingsScreen(
                    isDarkTheme = isDarkTheme,
                    onThemeToggle = onThemeToggle
                )
            }
        }
    }
}

@Composable
private fun TouristBottomNavigation(
    selectedTab: TouristTab,
    onTabSelected: (TouristTab) -> Unit
) {
    NavigationBar {
        val tabs = listOf(
            TouristTab.DASHBOARD to TabItem("Dashboard", Icons.Default.Dashboard),
            TouristTab.DIGITAL_ID to TabItem("Digital ID", Icons.Default.Badge),
            TouristTab.EMERGENCY to TabItem("Emergency", Icons.Default.Warning),
            TouristTab.SETTINGS to TabItem("Settings", Icons.Default.Settings)
        )

        tabs.forEach { (tab, item) ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label
                    )
                },
                label = { Text(item.label) },
                selected = selectedTab == tab,
                onClick = { onTabSelected(tab) }
            )
        }
    }
}

private data class TabItem(
    val label: String,
    val icon: ImageVector
)