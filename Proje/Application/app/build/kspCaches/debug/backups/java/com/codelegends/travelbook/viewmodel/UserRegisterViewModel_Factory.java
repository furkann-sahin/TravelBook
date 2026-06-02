package com.codelegends.travelbook.viewmodel;

import com.codelegends.travelbook.repository.UserRepository;
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
public final class UserRegisterViewModel_Factory implements Factory<UserRegisterViewModel> {
  private final Provider<UserRepository> userRepositoryProvider;

  private UserRegisterViewModel_Factory(Provider<UserRepository> userRepositoryProvider) {
    this.userRepositoryProvider = userRepositoryProvider;
  }

  @Override
  public UserRegisterViewModel get() {
    return newInstance(userRepositoryProvider.get());
  }

  public static UserRegisterViewModel_Factory create(
      Provider<UserRepository> userRepositoryProvider) {
    return new UserRegisterViewModel_Factory(userRepositoryProvider);
  }

  public static UserRegisterViewModel newInstance(UserRepository userRepository) {
    return new UserRegisterViewModel(userRepository);
  }
}
