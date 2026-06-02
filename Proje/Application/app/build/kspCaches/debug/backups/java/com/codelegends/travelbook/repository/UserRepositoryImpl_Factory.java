package com.codelegends.travelbook.repository;

import com.codelegends.travelbook.core.session.SessionManager;
import com.codelegends.travelbook.service.UserAuthApiService;
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
public final class UserRepositoryImpl_Factory implements Factory<UserRepositoryImpl> {
  private final Provider<UserAuthApiService> userAuthApiServiceProvider;

  private final Provider<SessionManager> sessionManagerProvider;

  private UserRepositoryImpl_Factory(Provider<UserAuthApiService> userAuthApiServiceProvider,
      Provider<SessionManager> sessionManagerProvider) {
    this.userAuthApiServiceProvider = userAuthApiServiceProvider;
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public UserRepositoryImpl get() {
    return newInstance(userAuthApiServiceProvider.get(), sessionManagerProvider.get());
  }

  public static UserRepositoryImpl_Factory create(
      Provider<UserAuthApiService> userAuthApiServiceProvider,
      Provider<SessionManager> sessionManagerProvider) {
    return new UserRepositoryImpl_Factory(userAuthApiServiceProvider, sessionManagerProvider);
  }

  public static UserRepositoryImpl newInstance(UserAuthApiService userAuthApiService,
      SessionManager sessionManager) {
    return new UserRepositoryImpl(userAuthApiService, sessionManager);
  }
}
