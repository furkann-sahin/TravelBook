package com.codelegends.travelbook.hilt

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

// Application class annotated with @HiltAndroidApp to trigger Hilt's code generation and setup
@HiltAndroidApp
class TravelBookApplication : Application()