package com.codelegends.travelbook.repository;

import com.codelegends.travelbook.service.CompanyTourApiService;
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
public final class CompanyTourRepositoryImpl_Factory implements Factory<CompanyTourRepositoryImpl> {
  private final Provider<CompanyTourApiService> companyTourApiServiceProvider;

  private CompanyTourRepositoryImpl_Factory(
      Provider<CompanyTourApiService> companyTourApiServiceProvider) {
    this.companyTourApiServiceProvider = companyTourApiServiceProvider;
  }

  @Override
  public CompanyTourRepositoryImpl get() {
    return newInstance(companyTourApiServiceProvider.get());
  }

  public static CompanyTourRepositoryImpl_Factory create(
      Provider<CompanyTourApiService> companyTourApiServiceProvider) {
    return new CompanyTourRepositoryImpl_Factory(companyTourApiServiceProvider);
  }

  public static CompanyTourRepositoryImpl newInstance(CompanyTourApiService companyTourApiService) {
    return new CompanyTourRepositoryImpl(companyTourApiService);
  }
}
