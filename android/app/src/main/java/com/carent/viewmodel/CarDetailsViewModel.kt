package com.carent.viewmodel

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.carent.api.RetrofitInstance
import com.carent.models.Car
import kotlinx.coroutines.launch

class CarDetailsViewModel : ViewModel() {
    var car = mutableStateOf<Car?>(null)
    var isLoading = mutableStateOf(false)
    var error = mutableStateOf<String?>(null)

    fun fetchCarById(id: String) {
        viewModelScope.launch {
            isLoading.value = true
            try {
                val response = RetrofitInstance.api.getCarById(id)
                car.value = response
                error.value = null
            } catch (e: Exception) {
                error.value = "Failed to load car details: ${e.message}"
            } finally {
                isLoading.value = false
            }
        }
    }
}
