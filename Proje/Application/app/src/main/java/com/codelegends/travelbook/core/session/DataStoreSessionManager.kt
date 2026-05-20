package com.codelegends.travelbook.core.session

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.codelegends.travelbook.model.UserSession
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

// Extension property to create a DataStore instance for session management
private val Context.sessionDataStore by preferencesDataStore(name = "travelbook_session")

/**
 * DataStoreSessionManager is responsible for managing user session data using Android's DataStore.
 * It implements the SessionManager interface, providing methods to save, clear, and retrieve session information.
 */
@Singleton
class DataStoreSessionManager @Inject constructor(
    @param:ApplicationContext private val context: Context
) : SessionManager {

    private object Keys {
        val token = stringPreferencesKey("token")
        val userId = stringPreferencesKey("user_id")
        val name = stringPreferencesKey("name")
        val email = stringPreferencesKey("email")
        val role = stringPreferencesKey("role")
        val exp = longPreferencesKey("exp")
    }

    override val sessionFlow: Flow<UserSession?> =
        context.sessionDataStore.data
            .catch { throwable ->
                if (throwable is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw throwable
                }
            }
            .map { preferences ->
                preferences.toSessionOrNull()
            }

    override suspend fun saveSession(session: UserSession) {
        context.sessionDataStore.edit { preferences ->
            preferences[Keys.token] = session.token
            preferences[Keys.userId] = session.userId
            preferences[Keys.name] = session.name
            preferences[Keys.email] = session.email
            preferences[Keys.role] = session.role
            session.expiresAtEpochSeconds?.let { preferences[Keys.exp] = it }
        }
    }

    override suspend fun clearSession() {
        context.sessionDataStore.edit { preferences ->
            preferences.clear()
        }
    }

    override suspend fun getToken(): String? {
        val preferences = context.sessionDataStore.data.first()
        return preferences[Keys.token]
    }

    private fun Preferences.toSessionOrNull(): UserSession? {
        val tokenValue = this[Keys.token] ?: return null
        val userIdValue = this[Keys.userId] ?: return null
        val emailValue = this[Keys.email] ?: return null
        val roleValue = this[Keys.role] ?: return null

        return UserSession(
            token = tokenValue,
            userId = userIdValue,
            name = this[Keys.name].orEmpty(),
            email = emailValue,
            role = roleValue,
            expiresAtEpochSeconds = this[Keys.exp]
        )
    }
}
