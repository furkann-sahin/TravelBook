package com.codelegends.travelbook.hilt;

import com.codelegends.travelbook.service.UserAuthApiService;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.Provider;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import retrofit2.Retrofit;

@ScopeMetadata("javax.inject.Singleton")
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
public final class UserAuthModule_Companion_ProvideUserAuthApiServiceFactory implements Factory<UserAuthApiService> {
  private final Provider<Retrofit> retrofitProvider;

  private UserAuthModule_Companion_ProvideUserAuthApiServiceFactory(
      Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public UserAuthApiService get() {
    return provideUserAuthApiService(retrofitProvider.get());
  }

  public static UserAuthModule_Companion_ProvideUserAuthApiServiceFactory create(
      Provider<Retrofit> retrofitProvider) {
    return new UserAuthModule_Companion_ProvideUserAuthApiServiceFactory(retrofitProvider);
  }

  public static UserAuthApiService provideUserAuthApiService(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(UserAuthModule.Companion.provideUserAuthApiService(retrofit));
  }
}
