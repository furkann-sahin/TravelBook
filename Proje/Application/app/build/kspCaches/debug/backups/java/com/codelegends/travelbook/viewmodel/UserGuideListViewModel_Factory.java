package com.codelegends.travelbook.viewmodel;

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
public final class UserGuideListViewModel_Factory implements Factory<UserGuideListViewModel> {
  private final Provider<GuideRepository> guideRepositoryProvider;

  private UserGuideListViewModel_Factory(Provider<GuideRepository> guideRepositoryProvider) {
    this.guideRepositoryProvider = guideRepositoryProvider;
  }

  @Override
  public UserGuideListViewModel get() {
    return newInstance(guideRepositoryProvider.get());
  }

  public static UserGuideListViewModel_Factory create(
      Provider<GuideRepository> guideRepositoryProvider) {
    return new UserGuideListViewModel_Factory(guideRepositoryProvider);
  }

  public static UserGuideListViewModel newInstance(GuideRepository guideRepository) {
    return new UserGuideListViewModel(guideRepository);
  }
}
