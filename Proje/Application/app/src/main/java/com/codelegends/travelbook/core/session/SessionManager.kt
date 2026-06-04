package com.codelegends.travelbook.core.session

import com.codelegends.travelbook.model.UserSession
import kotlinx.coroutines.flow.Flow

// Interface for managing user sessions, including saving, clearing, and retrieving session information
interface SessionManager {
    val sessionFlow: Flow<UserSession?>

    suspend fun saveSession(session: UserSession)

    suspend fun clearSession()

    suspend fun getToken(): String?
}
