package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.UpdatePasswordRequestDto
import com.codelegends.travelbook.model.UpdateProfileRequestDto
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserPurchaseDto
import com.codelegends.travelbook.model.UserProfileDto
import com.codelegends.travelbook.model.UserRegisterInput
import com.codelegends.travelbook.model.UserSession

interface UserRepository {
    suspend fun loginUser(input: UserLoginInput): ApiResult<UserSession>
    suspend fun registerUser(input: UserRegisterInput): ApiResult<UserSession>

    suspend fun getUserProfile(userId: String): ApiResult<UserProfileDto>
    suspend fun getUserPurchases(userId: String, status: String? = null): ApiResult<List<UserPurchaseDto>>
    suspend fun updateUserProfile(userId: String, request: UpdateProfileRequestDto): ApiResult<UserProfileDto>
    suspend fun updateUserPassword(userId: String, request: UpdatePasswordRequestDto): ApiResult<Unit>
    suspend fun deleteUserAccount(userId: String): ApiResult<Unit>
}
