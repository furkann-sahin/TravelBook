package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.repository.UserRepository;
import com.codelegends.travelbook.usecase.CompanyRegisterUseCase;
import com.codelegends.travelbook.usecase.GuideRegisterUseCase;
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
public final class RegisterViewModel_Factory implements Factory<RegisterViewModel> {
  private final Provider<UserRepository> userRepositoryProvider;

  private final Provider<CompanyRegisterUseCase> companyRegisterUseCaseProvider;

  private final Provider<GuideRegisterUseCase> guideRegisterUseCaseProvider;

  private RegisterViewModel_Factory(Provider<UserRepository> userRepositoryProvider,
      Provider<CompanyRegisterUseCase> companyRegisterUseCaseProvider,
      Provider<GuideRegisterUseCase> guideRegisterUseCaseProvider) {
    this.userRepositoryProvider = userRepositoryProvider;
    this.companyRegisterUseCaseProvider = companyRegisterUseCaseProvider;
    this.guideRegisterUseCaseProvider = guideRegisterUseCaseProvider;
  }

  @Override
  public RegisterViewModel get() {
    return newInstance(userRepositoryProvider.get(), companyRegisterUseCaseProvider.get(), guideRegisterUseCaseProvider.get());
  }

  public static RegisterViewModel_Factory create(Provider<UserRepository> userRepositoryProvider,
      Provider<CompanyRegisterUseCase> companyRegisterUseCaseProvider,
      Provider<GuideRegisterUseCase> guideRegisterUseCaseProvider) {
    return new RegisterViewModel_Factory(userRepositoryProvider, companyRegisterUseCaseProvider, guideRegisterUseCaseProvider);
  }

  public static RegisterViewModel newInstance(UserRepository userRepository,
      CompanyRegisterUseCase companyRegisterUseCase, GuideRegisterUseCase guideRegisterUseCase) {
    return new RegisterViewModel(userRepository, companyRegisterUseCase, guideRegisterUseCase);
  }
}
