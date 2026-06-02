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
public final class CompanyRegisterUseCase_Factory implements Factory<CompanyRegisterUseCase> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private CompanyRegisterUseCase_Factory(Provider<AuthRepository> authRepositoryProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public CompanyRegisterUseCase get() {
    return newInstance(authRepositoryProvider.get());
  }

  public static CompanyRegisterUseCase_Factory create(
      Provider<AuthRepository> authRepositoryProvider) {
    return new CompanyRegisterUseCase_Factory(authRepositoryProvider);
  }

  public static CompanyRegisterUseCase newInstance(AuthRepository authRepository) {
    return new CompanyRegisterUseCase(authRepository);
  }
}
