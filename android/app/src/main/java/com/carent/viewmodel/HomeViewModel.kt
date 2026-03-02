package com.carent.viewmodel

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.carent.api.RetrofitInstance
import com.carent.models.Car
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {
    var cars = mutableStateOf<List<Car>>(emptyList())
    var isLoading = mutableStateOf(false)
    var error = mutableStateOf<String?>(null)

    init {
        fetchCars()
    }

    fun fetchCars() {
        viewModelScope.launch {
            isLoading.value = true
            try {
                val response = RetrofitInstance.api.getAllCars()
                cars.value = response
                error.value = null
            } catch (e: Exception) {
                error.value = "Failed to load cars: ${e.message}"
            } finally {
                isLoading.value = false
            }
        }
    }
}
