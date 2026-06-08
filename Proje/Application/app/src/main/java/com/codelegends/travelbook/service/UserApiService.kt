package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.UpdatePasswordRequestDto
import com.codelegends.travelbook.model.UpdateProfileRequestDto
import com.codelegends.travelbook.model.UserProfileDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path

interface UserApiService {
    @GET("users/{userId}")
    suspend fun getUserProfile(
        @Path("userId") userId: String
    ): Response<ApiObjectEnvelope<UserProfileDto>>

    @PUT("users/{userId}")
    suspend fun updateUserProfile(
        @Path("userId") userId: String,
        @Body request: UpdateProfileRequestDto
    ): Response<ApiObjectEnvelope<UserProfileDto>>

    @PUT("users/{userId}/password")
    suspend fun updateUserPassword(
        @Path("userId") userId: String,
        @Body request: UpdatePasswordRequestDto
    ): Response<Unit>

    @DELETE("users/{userId}")
    suspend fun deleteUserAccount(
        @Path("userId") userId: String
    ): Response<Unit>
}
