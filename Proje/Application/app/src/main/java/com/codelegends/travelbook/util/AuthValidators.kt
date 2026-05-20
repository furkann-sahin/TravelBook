package com.codelegends.travelbook.util

import android.util.Patterns

// AuthValidators provides validation functions for email and password fields in authentication forms.
object AuthValidators {
    fun validateEmail(email: String): String? {
        if (email.isBlank()) return "E-posta zorunludur"
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) return "Geçerli bir e-posta girin"
        return null
    }

    fun validatePassword(password: String): String? {
        if (password.isBlank()) return "Şifre zorunludur"
        if (password.length < 6) return "Şifre en az 6 karakter olmalıdır"
        if (password.length > 128) return "Şifre en fazla 128 karakter olmalıdır"
        return null
    }
}
