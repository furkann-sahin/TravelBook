package com.codelegends.travelbook.usecase

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyLoginInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.AuthRepository
import javax.inject.Inject

/**
 * CompanyLoginUseCase is a use case class responsible for handling the company login process.
 * It interacts with the AuthRepository to perform the login operation and returns the result.
 *
 * @property authRepository The repository that provides authentication-related operations.
 */
class CompanyLoginUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(input: CompanyLoginInput): ApiResult<UserSession> {
        return authRepository.loginCompany(input)
    }
}
