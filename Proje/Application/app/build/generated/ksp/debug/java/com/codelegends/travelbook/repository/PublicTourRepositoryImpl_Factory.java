package com.codelegends.travelbook.repository;

import com.codelegends.travelbook.service.TourApiService;
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
public final class PublicTourRepositoryImpl_Factory implements Factory<PublicTourRepositoryImpl> {
  private final Provider<TourApiService> tourApiServiceProvider;

  private PublicTourRepositoryImpl_Factory(Provider<TourApiService> tourApiServiceProvider) {
    this.tourApiServiceProvider = tourApiServiceProvider;
  }

  @Override
  public PublicTourRepositoryImpl get() {
    return newInstance(tourApiServiceProvider.get());
  }

  public static PublicTourRepositoryImpl_Factory create(
      Provider<TourApiService> tourApiServiceProvider) {
    return new PublicTourRepositoryImpl_Factory(tourApiServiceProvider);
  }

  public static PublicTourRepositoryImpl newInstance(TourApiService tourApiService) {
    return new PublicTourRepositoryImpl(tourApiService);
  }
}
