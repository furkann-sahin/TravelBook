package com.codelegends.travelbook.usecase

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.GuideLoginInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.AuthRepository
import javax.inject.Inject

class GuideLoginUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(input: GuideLoginInput): ApiResult<UserSession> {
        return authRepository.loginGuide(input)
    }
}
