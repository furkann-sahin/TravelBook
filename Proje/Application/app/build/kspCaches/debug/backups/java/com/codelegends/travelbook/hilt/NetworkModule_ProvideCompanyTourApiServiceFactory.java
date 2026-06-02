package com.codelegends.travelbook.hilt;

import com.codelegends.travelbook.service.CompanyTourApiService;
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
public final class NetworkModule_ProvideCompanyTourApiServiceFactory implements Factory<CompanyTourApiService> {
  private final Provider<Retrofit> retrofitProvider;

  private NetworkModule_ProvideCompanyTourApiServiceFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public CompanyTourApiService get() {
    return provideCompanyTourApiService(retrofitProvider.get());
  }

  public static NetworkModule_ProvideCompanyTourApiServiceFactory create(
      Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideCompanyTourApiServiceFactory(retrofitProvider);
  }

  public static CompanyTourApiService provideCompanyTourApiService(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideCompanyTourApiService(retrofit));
  }
}
