package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyLoginInput
import com.codelegends.travelbook.model.CompanyRegisterInput
import com.codelegends.travelbook.model.UserSession

interface AuthRepository {
    suspend fun loginCompany(input: CompanyLoginInput): ApiResult<UserSession>

    suspend fun registerCompany(input: CompanyRegisterInput): ApiResult<UserSession>
}
