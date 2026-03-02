package com.carent.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.carent.ui.screens.HomeScreen
import com.carent.ui.screens.CarDetailsScreen

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object CarDetails : Screen("car_details/{carId}") {
        fun createRoute(carId: String) = "car_details/$carId"
    }
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(onCarClick = { carId ->
                navController.navigate(Screen.CarDetails.createRoute(carId))
            })
        }
        composable(
            route = Screen.CarDetails.route,
            arguments = listOf(navArgument("carId") { })
        ) { backStackEntry ->
            val carId = backStackEntry.arguments?.getString("carId") ?: ""
            CarDetailsScreen(
                carId = carId,
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
