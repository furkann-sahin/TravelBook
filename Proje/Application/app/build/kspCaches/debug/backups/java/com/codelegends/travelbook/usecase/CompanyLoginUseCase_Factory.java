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
public final class CompanyLoginUseCase_Factory implements Factory<CompanyLoginUseCase> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private CompanyLoginUseCase_Factory(Provider<AuthRepository> authRepositoryProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public CompanyLoginUseCase get() {
    return newInstance(authRepositoryProvider.get());
  }

  public static CompanyLoginUseCase_Factory create(
      Provider<AuthRepository> authRepositoryProvider) {
    return new CompanyLoginUseCase_Factory(authRepositoryProvider);
  }

  public static CompanyLoginUseCase newInstance(AuthRepository authRepository) {
    return new CompanyLoginUseCase(authRepository);
  }
}
