package com.codelegends.travelbook.usecase;

import com.codelegends.travelbook.repository.AuthRepository;
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
public final class GuideLoginUseCase_Factory implements Factory<GuideLoginUseCase> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private GuideLoginUseCase_Factory(Provider<AuthRepository> authRepositoryProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public GuideLoginUseCase get() {
    return newInstance(authRepositoryProvider.get());
  }

  public static GuideLoginUseCase_Factory create(Provider<AuthRepository> authRepositoryProvider) {
    return new GuideLoginUseCase_Factory(authRepositoryProvider);
  }

  public static GuideLoginUseCase newInstance(AuthRepository authRepository) {
    return new GuideLoginUseCase(authRepository);
  }
}
