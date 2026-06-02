package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.repository.UserRepository;
import com.codelegends.travelbook.usecase.CompanyLoginUseCase;
import com.codelegends.travelbook.usecase.GuideLoginUseCase;
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
public final class LoginViewModel_Factory implements Factory<LoginViewModel> {
  private final Provider<UserRepository> userRepositoryProvider;

  private final Provider<CompanyLoginUseCase> companyLoginUseCaseProvider;

  private final Provider<GuideLoginUseCase> guideLoginUseCaseProvider;

  private LoginViewModel_Factory(Provider<UserRepository> userRepositoryProvider,
      Provider<CompanyLoginUseCase> companyLoginUseCaseProvider,
      Provider<GuideLoginUseCase> guideLoginUseCaseProvider) {
    this.userRepositoryProvider = userRepositoryProvider;
    this.companyLoginUseCaseProvider = companyLoginUseCaseProvider;
    this.guideLoginUseCaseProvider = guideLoginUseCaseProvider;
  }

  @Override
  public LoginViewModel get() {
    return newInstance(userRepositoryProvider.get(), companyLoginUseCaseProvider.get(), guideLoginUseCaseProvider.get());
  }

  public static LoginViewModel_Factory create(Provider<UserRepository> userRepositoryProvider,
      Provider<CompanyLoginUseCase> companyLoginUseCaseProvider,
      Provider<GuideLoginUseCase> guideLoginUseCaseProvider) {
    return new LoginViewModel_Factory(userRepositoryProvider, companyLoginUseCaseProvider, guideLoginUseCaseProvider);
  }

  public static LoginViewModel newInstance(UserRepository userRepository,
      CompanyLoginUseCase companyLoginUseCase, GuideLoginUseCase guideLoginUseCase) {
    return new LoginViewModel(userRepository, companyLoginUseCase, guideLoginUseCase);
  }
}
