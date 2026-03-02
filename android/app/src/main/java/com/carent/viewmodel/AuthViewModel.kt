package com.carent.viewmodel

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.carent.api.RetrofitInstance
import com.carent.models.*
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    var isLoading = mutableStateOf(false)
    var error = mutableStateOf<String?>(null)
    var authResponse = mutableStateOf<AuthResponse?>(null)
    var token = mutableStateOf<String?>(null)

    fun login(request: LoginRequest, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading.value = true
            try {
                val response = RetrofitInstance.api.login(request)
                if (response.success) {
                    authResponse.value = response
                    token.value = response.token
                    onSuccess()
                } else {
                    error.value = response.message
                }
            } catch (e: Exception) {
                error.value = "Login failed: ${e.message}"
            } finally {
                isLoading.value = false
            }
        }
    }

    fun register(request: RegisterRequest, onSuccess: () -> Unit) {
        viewModelScope.launch {
            isLoading.value = true
            try {
                val response = RetrofitInstance.api.register(request)
                if (response.success) {
                    onSuccess()
                } else {
                    error.value = response.message
                }
            } catch (e: Exception) {
                error.value = "Registration failed: ${e.message}"
            } finally {
                isLoading.value = false
            }
        }
    }
}
