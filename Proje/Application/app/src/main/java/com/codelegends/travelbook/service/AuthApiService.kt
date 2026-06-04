package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.AuthResponseDto
import com.codelegends.travelbook.model.CompanyLoginRequestDto
import com.codelegends.travelbook.model.CompanyRegisterRequestDto
import com.codelegends.travelbook.model.GuideLoginRequestDto
import com.codelegends.travelbook.model.GuideRegisterRequestDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("companies/auth/login")
    suspend fun loginCompany(
        @Body request: CompanyLoginRequestDto
    ): Response<AuthResponseDto>

    @POST("guides/auth/login")
    suspend fun loginGuide(
        @Body request: GuideLoginRequestDto
    ): Response<AuthResponseDto>

    @POST("companies/auth/register")
    suspend fun registerCompany(
        @Body request: CompanyRegisterRequestDto
    ): Response<AuthResponseDto>

    @POST("guides/auth/register")
    suspend fun registerGuide(
        @Body request: GuideRegisterRequestDto
    ): Response<AuthResponseDto>
}
