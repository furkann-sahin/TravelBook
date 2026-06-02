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
public final class PublicAboutViewModel_Factory implements Factory<PublicAboutViewModel> {
  private final Provider<PublicTourRepository> publicTourRepositoryProvider;

  private PublicAboutViewModel_Factory(
      Provider<PublicTourRepository> publicTourRepositoryProvider) {
    this.publicTourRepositoryProvider = publicTourRepositoryProvider;
  }

  @Override
  public PublicAboutViewModel get() {
    return newInstance(publicTourRepositoryProvider.get());
  }

  public static PublicAboutViewModel_Factory create(
      Provider<PublicTourRepository> publicTourRepositoryProvider) {
    return new PublicAboutViewModel_Factory(publicTourRepositoryProvider);
  }

  public static PublicAboutViewModel newInstance(PublicTourRepository publicTourRepository) {
    return new PublicAboutViewModel(publicTourRepository);
  }
}
