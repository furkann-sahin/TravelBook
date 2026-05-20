package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.UserSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

// Data class to hold the state of the app entry point, including loading status and user session information
data class AppEntryState(
    val isLoading: Boolean = true,
    val session: UserSession? = null
)

/**
 * ViewModel for the app's entry point. It manages the loading state and user session information.
 * It listens to changes in the session flow from the SessionManager and updates the state accordingly.
 */
@HiltViewModel
class AppEntryViewModel @Inject constructor(
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _state = MutableStateFlow(AppEntryState())
    val state: StateFlow<AppEntryState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            sessionManager.sessionFlow.collect { session ->
                _state.update {
                    it.copy(
                        isLoading = false,
                        session = session
                    )
                }
            }
        }
    }
}
