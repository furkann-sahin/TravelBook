package com.codelegends.travelbook.hilt

import com.codelegends.travelbook.repository.UserRepository
import com.codelegends.travelbook.repository.UserRepositoryImpl
import com.codelegends.travelbook.service.UserAuthApiService
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class UserAuthModule {

    @Binds
    @Singleton
    abstract fun bindUserRepository(
        userRepositoryImpl: UserRepositoryImpl
    ): UserRepository

    companion object {
        @Provides
        @Singleton
        fun provideUserAuthApiService(retrofit: Retrofit): UserAuthApiService {
            return retrofit.create(UserAuthApiService::class.java)
        }
    }
}
