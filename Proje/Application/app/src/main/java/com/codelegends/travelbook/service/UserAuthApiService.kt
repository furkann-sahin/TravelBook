package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.AuthResponseDto
import com.codelegends.travelbook.model.UserLoginRequestDto
import com.codelegends.travelbook.model.UserRegisterRequestDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface UserAuthApiService {
    @POST("users/auth/login")
    suspend fun loginUser(
        @Body request: UserLoginRequestDto
    ): Response<AuthResponseDto>

    @POST("users/auth/register")
    suspend fun registerUser(
        @Body request: UserRegisterRequestDto
    ): Response<AuthResponseDto>
}
