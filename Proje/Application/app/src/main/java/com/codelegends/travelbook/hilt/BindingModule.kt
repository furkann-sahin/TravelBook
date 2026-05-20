package com.codelegends.travelbook.hilt

import com.codelegends.travelbook.core.network.AuthTokenProvider
import com.codelegends.travelbook.core.network.DefaultAuthTokenProvider
import com.codelegends.travelbook.core.session.DataStoreSessionManager
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.repository.AuthRepository
import com.codelegends.travelbook.repository.AuthRepositoryImpl
import com.codelegends.travelbook.repository.CompanyTourRepository
import com.codelegends.travelbook.repository.CompanyTourRepositoryImpl
import com.codelegends.travelbook.repository.PublicTourRepository
import com.codelegends.travelbook.repository.PublicTourRepositoryImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton


@Module
@InstallIn(SingletonComponent::class)
abstract class BindingModule {

    @Binds
    @Singleton
    abstract fun bindSessionManager(
        implementation: DataStoreSessionManager
    ): SessionManager

    @Binds
    @Singleton
    abstract fun bindAuthTokenProvider(
        implementation: DefaultAuthTokenProvider
    ): AuthTokenProvider

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        implementation: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindCompanyTourRepository(
        implementation: CompanyTourRepositoryImpl
    ): CompanyTourRepository

    @Binds
    @Singleton
    abstract fun bindPublicTourRepository(
        implementation: PublicTourRepositoryImpl
    ): PublicTourRepository
}
