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
public final class UserLoginViewModel_Factory implements Factory<UserLoginViewModel> {
  private final Provider<UserRepository> userRepositoryProvider;

  private UserLoginViewModel_Factory(Provider<UserRepository> userRepositoryProvider) {
    this.userRepositoryProvider = userRepositoryProvider;
  }

  @Override
  public UserLoginViewModel get() {
    return newInstance(userRepositoryProvider.get());
  }

  public static UserLoginViewModel_Factory create(Provider<UserRepository> userRepositoryProvider) {
    return new UserLoginViewModel_Factory(userRepositoryProvider);
  }

  public static UserLoginViewModel newInstance(UserRepository userRepository) {
    return new UserLoginViewModel(userRepository);
  }
}
