package com.codelegends.travelbook.core.network

import com.codelegends.travelbook.core.session.SessionManager
import javax.inject.Inject
import javax.inject.Singleton

interface AuthTokenProvider {
    suspend fun getToken(): String?
}

@Singleton
class DefaultAuthTokenProvider @Inject constructor(
    private val sessionManager: SessionManager
) : AuthTokenProvider {
    override suspend fun getToken(): String? = sessionManager.getToken()
}
