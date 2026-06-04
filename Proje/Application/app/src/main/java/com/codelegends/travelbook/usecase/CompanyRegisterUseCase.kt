package com.codelegends.travelbook.usecase

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyRegisterInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.AuthRepository
import javax.inject.Inject

/**
 * CompanyRegisterUseCase is a use case class responsible for handling the company registration process.
 * It interacts with the AuthRepository to perform the registration operation and returns the result.
 *
 * @property authRepository The repository that provides authentication-related operations.
 */
class CompanyRegisterUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(input: CompanyRegisterInput): ApiResult<UserSession> {
        return authRepository.registerCompany(input)
    }
}
