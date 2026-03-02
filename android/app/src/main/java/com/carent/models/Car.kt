package com.carent.models

import com.google.gson.annotations.SerializedName

data class Car(
    @SerializedName("_id") val id: String,
    val name: String,
    val brand: String,
    val pricePerDay: Double,
    val fuelType: String,
    val seats: Int,
    val transmission: String,
    val images: List<String>,
    val available: Boolean,
    val listingType: String,
    val features: List<String>,
    val history: String? = null,
    val createdBy: String? = null
)
