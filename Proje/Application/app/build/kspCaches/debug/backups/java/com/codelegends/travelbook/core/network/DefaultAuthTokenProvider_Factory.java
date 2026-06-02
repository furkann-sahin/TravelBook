package com.codelegends.travelbook.core.network;

import com.codelegends.travelbook.core.session.SessionManager;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Provider;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;

@ScopeMetadata("javax.inject.Singleton")
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
public final class DefaultAuthTokenProvider_Factory implements Factory<DefaultAuthTokenProvider> {
  private final Provider<SessionManager> sessionManagerProvider;

  private DefaultAuthTokenProvider_Factory(Provider<SessionManager> sessionManagerProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public DefaultAuthTokenProvider get() {
    return newInstance(sessionManagerProvider.get());
  }

  public static DefaultAuthTokenProvider_Factory create(
      Provider<SessionManager> sessionManagerProvider) {
    return new DefaultAuthTokenProvider_Factory(sessionManagerProvider);
  }

  public static DefaultAuthTokenProvider newInstance(SessionManager sessionManager) {
    return new DefaultAuthTokenProvider(sessionManager);
  }
}
