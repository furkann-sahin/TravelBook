package com.codelegends.travelbook.repository;

import com.codelegends.travelbook.service.GuideApiService;
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
public final class GuideRepositoryImpl_Factory implements Factory<GuideRepositoryImpl> {
  private final Provider<GuideApiService> guideApiServiceProvider;

  private GuideRepositoryImpl_Factory(Provider<GuideApiService> guideApiServiceProvider) {
    this.guideApiServiceProvider = guideApiServiceProvider;
  }

  @Override
  public GuideRepositoryImpl get() {
    return newInstance(guideApiServiceProvider.get());
  }

  public static GuideRepositoryImpl_Factory create(
      Provider<GuideApiService> guideApiServiceProvider) {
    return new GuideRepositoryImpl_Factory(guideApiServiceProvider);
  }

  public static GuideRepositoryImpl newInstance(GuideApiService guideApiService) {
    return new GuideRepositoryImpl(guideApiService);
  }
}
