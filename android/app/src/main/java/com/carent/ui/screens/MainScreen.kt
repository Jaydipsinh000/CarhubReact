package com.carent.ui.screens

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.carent.navigation.Screen

@Composable
fun MainScreen(rootNavController: NavHostController) {
    val bottomNavController = rememberNavController()
    val items = listOf(
        NavigationItem("Home", Icons.Default.Home, Screen.Home.route),
        NavigationItem("Wishlist", Icons.Default.Favorite, "wishlist"),
        NavigationItem("Profile", Icons.Default.Person, "profile")
    )

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by bottomNavController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                items.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.title) },
                        label = { Text(item.title) },
                        selected = currentRoute == item.route,
                        onClick = {
                            bottomNavController.navigate(item.route) {
                                popUpTo(bottomNavController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = bottomNavController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(onCarClick = { carId ->
                    rootNavController.navigate(Screen.CarDetails.createRoute(carId))
                })
            }
            composable("wishlist") {
                // Temporary Placeholder for Wishlist
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                    Text("Your Wishlist will appear here")
                }
            }
            composable("profile") {
                ProfileScreen(onLogout = {
                    rootNavController.navigate(Screen.Login.route) {
                        popUpTo(0)
                    }
                })
            }
        }
    }
}

data class NavigationItem(val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector, val route: String)
