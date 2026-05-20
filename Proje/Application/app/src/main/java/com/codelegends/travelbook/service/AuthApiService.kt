package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.AuthResponseDto
import com.codelegends.travelbook.model.CompanyLoginRequestDto
import com.codelegends.travelbook.model.CompanyRegisterRequestDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("companies/auth/login")
    suspend fun loginCompany(
        @Body request: CompanyLoginRequestDto
    ): Response<AuthResponseDto>

    @POST("companies/auth/register")
    suspend fun registerCompany(
        @Body request: CompanyRegisterRequestDto
    ): Response<AuthResponseDto>
}
