package com.codelegends.travelbook.repository;

import com.codelegends.travelbook.core.session.SessionManager;
import com.codelegends.travelbook.service.AuthApiService;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Provider;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;

@ScopeMetadata
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast",
    "deprecation",
    "nullness:initialization.field.uninitialized"
})
public final class AuthRepositoryImpl_Factory implements Factory<AuthRepositoryImpl> {
  private final Provider<AuthApiService> authApiServiceProvider;

  private final Provider<SessionManager> sessionManagerProvider;

  private AuthRepositoryImpl_Factory(Provider<AuthApiService> authApiServiceProvider,
      Provider<SessionManager> sessionManagerProvider) {
    this.authApiServiceProvider = authApiServiceProvider;
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public AuthRepositoryImpl get() {
    return newInstance(authApiServiceProvider.get(), sessionManagerProvider.get());
  }

  public static AuthRepositoryImpl_Factory create(Provider<AuthApiService> authApiServiceProvider,
      Provider<SessionManager> sessionManagerProvider) {
    return new AuthRepositoryImpl_Factory(authApiServiceProvider, sessionManagerProvider);
  }

  public static AuthRepositoryImpl newInstance(AuthApiService authApiService,
      SessionManager sessionManager) {
    return new AuthRepositoryImpl(authApiService, sessionManager);
  }
}
