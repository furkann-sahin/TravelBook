package com.codelegends.travelbook.usecase

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.GuideRegisterInput
import com.codelegends.travelbook.model.UserSession
import com.codelegends.travelbook.repository.AuthRepository
import javax.inject.Inject

class GuideRegisterUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(input: GuideRegisterInput): ApiResult<UserSession> {
        return authRepository.registerGuide(input)
    }
}
