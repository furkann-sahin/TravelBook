package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.UserLoginInput
import com.codelegends.travelbook.model.UserRegisterInput
import com.codelegends.travelbook.model.UserSession

interface UserRepository {
    suspend fun loginUser(input: UserLoginInput): ApiResult<UserSession>
    suspend fun registerUser(input: UserRegisterInput): ApiResult<UserSession>
}
