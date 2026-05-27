package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyLoginInput
import com.codelegends.travelbook.model.CompanyRegisterInput
import com.codelegends.travelbook.model.GuideLoginInput
import com.codelegends.travelbook.model.GuideRegisterInput
import com.codelegends.travelbook.model.UserSession

interface AuthRepository {
    suspend fun loginCompany(input: CompanyLoginInput): ApiResult<UserSession>

    suspend fun loginGuide(input: GuideLoginInput): ApiResult<UserSession>

    suspend fun registerCompany(input: CompanyRegisterInput): ApiResult<UserSession>

    suspend fun registerGuide(input: GuideRegisterInput): ApiResult<UserSession>
}
