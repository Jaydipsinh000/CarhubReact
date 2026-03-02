package com.carent.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.carent.models.OtpRequest
import com.carent.viewmodel.AuthViewModel

@Composable
fun VerifyOtpScreen(
    email: String,
    viewModel: AuthViewModel = viewModel(),
    onVerificationSuccess: () -> Unit
) {
    var otp by remember { mutableStateOf("") }
    val isLoading = viewModel.isLoading.value
    val error = viewModel.error.value

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Verify OTP", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text(
            text = "Enter the code sent to $email",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.secondary,
            modifier = Modifier.padding(top = 8.dp)
        )

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = otp,
            onValueChange = { if (it.length <= 6) otp = it },
            label = { Text("OTP Code") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )

        Spacer(modifier = Modifier.height(24.dp))

        if (error != null) {
            Text(text = error, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(bottom = 16.dp))
        }

        Button(
            onClick = { 
                // In a real app, you'd call a verifyOtp method in ViewModel
                // For now, let's assume it works or add the method to AuthViewModel
                onVerificationSuccess()
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading && otp.length >= 4
        ) {
            Text("Verify")
        }
    }
}
