package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.core.session.SessionManager;
import com.codelegends.travelbook.repository.GuideRepository;
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
public final class GuideCompaniesViewModel_Factory implements Factory<GuideCompaniesViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private final Provider<GuideRepository> guideRepositoryProvider;

  private GuideCompaniesViewModel_Factory(Provider<SessionManager> sessionManagerProvider,
      Provider<GuideRepository> guideRepositoryProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
    this.guideRepositoryProvider = guideRepositoryProvider;
  }

  @Override
  public GuideCompaniesViewModel get() {
    return newInstance(sessionManagerProvider.get(), guideRepositoryProvider.get());
  }

  public static GuideCompaniesViewModel_Factory create(
      Provider<SessionManager> sessionManagerProvider,
      Provider<GuideRepository> guideRepositoryProvider) {
    return new GuideCompaniesViewModel_Factory(sessionManagerProvider, guideRepositoryProvider);
  }

  public static GuideCompaniesViewModel newInstance(SessionManager sessionManager,
      GuideRepository guideRepository) {
    return new GuideCompaniesViewModel(sessionManager, guideRepository);
  }
}
