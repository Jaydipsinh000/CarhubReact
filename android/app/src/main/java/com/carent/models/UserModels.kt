package com.carent.models

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val phone: String? = null,
    val role: String = "user"
)

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val user: UserData?,
    val token: String?
)

data class UserData(
    @SerializedName("_id") val id: String,
    val name: String,
    val email: String,
    val role: String,
    val isVerified: Boolean,
    val phone: String? = null
)

data class OtpRequest(
    val email: String,
    val otp: String
)
