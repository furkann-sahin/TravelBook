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
public final class GuideRegisterUseCase_Factory implements Factory<GuideRegisterUseCase> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private GuideRegisterUseCase_Factory(Provider<AuthRepository> authRepositoryProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public GuideRegisterUseCase get() {
    return newInstance(authRepositoryProvider.get());
  }

  public static GuideRegisterUseCase_Factory create(
      Provider<AuthRepository> authRepositoryProvider) {
    return new GuideRegisterUseCase_Factory(authRepositoryProvider);
  }

  public static GuideRegisterUseCase newInstance(AuthRepository authRepository) {
    return new GuideRegisterUseCase(authRepository);
  }
}
