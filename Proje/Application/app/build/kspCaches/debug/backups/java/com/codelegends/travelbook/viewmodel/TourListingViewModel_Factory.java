package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.repository.PublicTourRepository;
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
public final class TourListingViewModel_Factory implements Factory<TourListingViewModel> {
  private final Provider<PublicTourRepository> publicTourRepositoryProvider;

  private TourListingViewModel_Factory(
      Provider<PublicTourRepository> publicTourRepositoryProvider) {
    this.publicTourRepositoryProvider = publicTourRepositoryProvider;
  }

  @Override
  public TourListingViewModel get() {
    return newInstance(publicTourRepositoryProvider.get());
  }

  public static TourListingViewModel_Factory create(
      Provider<PublicTourRepository> publicTourRepositoryProvider) {
    return new TourListingViewModel_Factory(publicTourRepositoryProvider);
  }

  public static TourListingViewModel newInstance(PublicTourRepository publicTourRepository) {
    return new TourListingViewModel(publicTourRepository);
  }
}
