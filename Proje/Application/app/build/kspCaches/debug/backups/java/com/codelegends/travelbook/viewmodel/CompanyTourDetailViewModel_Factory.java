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
public final class CompanyTourDetailViewModel_Factory implements Factory<CompanyTourDetailViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private final Provider<CompanyTourRepository> companyTourRepositoryProvider;

  private CompanyTourDetailViewModel_Factory(Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
    this.companyTourRepositoryProvider = companyTourRepositoryProvider;
  }

  @Override
  public CompanyTourDetailViewModel get() {
    return newInstance(sessionManagerProvider.get(), companyTourRepositoryProvider.get());
  }

  public static CompanyTourDetailViewModel_Factory create(
      Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    return new CompanyTourDetailViewModel_Factory(sessionManagerProvider, companyTourRepositoryProvider);
  }

  public static CompanyTourDetailViewModel newInstance(SessionManager sessionManager,
      CompanyTourRepository companyTourRepository) {
    return new CompanyTourDetailViewModel(sessionManager, companyTourRepository);
  }
}
