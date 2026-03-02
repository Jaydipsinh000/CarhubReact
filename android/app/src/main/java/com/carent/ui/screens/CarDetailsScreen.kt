package com.carent.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.carent.viewmodel.CarDetailsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CarDetailsScreen(
    carId: String,
    viewModel: CarDetailsViewModel = viewModel(),
    onBackClick: () -> Unit
) {
    val car = viewModel.car.value
    val isLoading = viewModel.isLoading.value
    val error = viewModel.error.value

    LaunchedEffect(carId) {
        viewModel.fetchCarById(carId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(car?.name ?: "Car Details") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else if (error != null) {
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.align(Alignment.Center)
                )
            } else if (car != null) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                ) {
                    val imageUrl = if (car.images.isNotEmpty()) {
                        car.images[0].replace("localhost", "10.0.2.2")
                    } else {
                        ""
                    }

                    AsyncImage(
                        model = imageUrl,
                        contentDescription = car.name,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(250.dp),
                        contentScale = ContentScale.Crop
                    )

                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = car.name,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = car.brand,
                            fontSize = 18.sp,
                            color = MaterialTheme.colorScheme.secondary
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            DetailItem("Price", "₹${car.pricePerDay}/day")
                            DetailItem("Fuel", car.fuelType)
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            DetailItem("Transmission", car.transmission)
                            DetailItem("Seats", "${car.seats}")
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Features",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        car.features.forEach { feature ->
                            Text(text = "• $feature", fontSize = 16.sp)
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Button(
                            onClick = { /* TODO: Implement Booking */ },
                            modifier = Modifier.fillMaxWidth(),
                            shape = MaterialTheme.shapes.medium
                        ) {
                            Text("Book Now", fontSize = 18.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DetailItem(label: String, value: String) {
    Column {
        Text(text = label, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(text = value, fontSize = 16.sp, fontWeight = FontWeight.Medium)
    }
}
