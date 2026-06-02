package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.core.session.SessionManager;
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
public final class UserShellViewModel_Factory implements Factory<UserShellViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private UserShellViewModel_Factory(Provider<SessionManager> sessionManagerProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public UserShellViewModel get() {
    return newInstance(sessionManagerProvider.get());
  }

  public static UserShellViewModel_Factory create(Provider<SessionManager> sessionManagerProvider) {
    return new UserShellViewModel_Factory(sessionManagerProvider);
  }

  public static UserShellViewModel newInstance(SessionManager sessionManager) {
    return new UserShellViewModel(sessionManager);
  }
}
