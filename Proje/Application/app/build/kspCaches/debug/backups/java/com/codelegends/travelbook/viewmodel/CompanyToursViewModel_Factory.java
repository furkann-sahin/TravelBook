package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.core.session.SessionManager;
import com.codelegends.travelbook.repository.CompanyTourRepository;
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
public final class CompanyToursViewModel_Factory implements Factory<CompanyToursViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private final Provider<CompanyTourRepository> companyTourRepositoryProvider;

  private CompanyToursViewModel_Factory(Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
    this.companyTourRepositoryProvider = companyTourRepositoryProvider;
  }

  @Override
  public CompanyToursViewModel get() {
    return newInstance(sessionManagerProvider.get(), companyTourRepositoryProvider.get());
  }

  public static CompanyToursViewModel_Factory create(
      Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    return new CompanyToursViewModel_Factory(sessionManagerProvider, companyTourRepositoryProvider);
  }

  public static CompanyToursViewModel newInstance(SessionManager sessionManager,
      CompanyTourRepository companyTourRepository) {
    return new CompanyToursViewModel(sessionManager, companyTourRepository);
  }
}
