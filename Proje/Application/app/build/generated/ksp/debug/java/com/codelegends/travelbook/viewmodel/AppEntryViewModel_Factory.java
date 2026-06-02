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
public final class AppEntryViewModel_Factory implements Factory<AppEntryViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private AppEntryViewModel_Factory(Provider<SessionManager> sessionManagerProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
  }

  @Override
  public AppEntryViewModel get() {
    return newInstance(sessionManagerProvider.get());
  }

  public static AppEntryViewModel_Factory create(Provider<SessionManager> sessionManagerProvider) {
    return new AppEntryViewModel_Factory(sessionManagerProvider);
  }

  public static AppEntryViewModel newInstance(SessionManager sessionManager) {
    return new AppEntryViewModel(sessionManager);
  }
}
