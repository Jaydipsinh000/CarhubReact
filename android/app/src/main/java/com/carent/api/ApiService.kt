package com.carent.api

import com.carent.models.Car
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {
    @GET("cars")
    suspend fun getAllCars(): List<Car>

    @GET("cars/{id}")
    suspend fun getCarById(@Path("id") id: String): Car
}
