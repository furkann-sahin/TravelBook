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
public final class GuideShellViewModel_Factory implements Factory<GuideShellViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private GuideShellViewModel_Factory(Provider<SessionManager> sessionManagerProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public GuideShellViewModel get() {
    return newInstance(sessionManagerProvider.get());
  }

  public static GuideShellViewModel_Factory create(
      Provider<SessionManager> sessionManagerProvider) {
    return new GuideShellViewModel_Factory(sessionManagerProvider);
  }

  public static GuideShellViewModel newInstance(SessionManager sessionManager) {
    return new GuideShellViewModel(sessionManager);
  }
}
