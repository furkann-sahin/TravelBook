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
public final class CompanyGuidesViewModel_Factory implements Factory<CompanyGuidesViewModel> {
  private final Provider<SessionManager> sessionManagerProvider;

  private final Provider<CompanyTourRepository> companyTourRepositoryProvider;

  private CompanyGuidesViewModel_Factory(Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    this.sessionManagerProvider = sessionManagerProvider;
    this.companyTourRepositoryProvider = companyTourRepositoryProvider;
  }

  @Override
  public CompanyGuidesViewModel get() {
    return newInstance(sessionManagerProvider.get(), companyTourRepositoryProvider.get());
  }

  public static CompanyGuidesViewModel_Factory create(
      Provider<SessionManager> sessionManagerProvider,
      Provider<CompanyTourRepository> companyTourRepositoryProvider) {
    return new CompanyGuidesViewModel_Factory(sessionManagerProvider, companyTourRepositoryProvider);
  }

  public static CompanyGuidesViewModel newInstance(SessionManager sessionManager,
      CompanyTourRepository companyTourRepository) {
    return new CompanyGuidesViewModel(sessionManager, companyTourRepository);
  }
}
