package com.codelegends.travelbook.hilt;

import android.app.Activity;
import android.app.Service;
import android.view.View;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.SavedStateHandle;
import androidx.lifecycle.ViewModel;
import com.codelegends.travelbook.MainActivity;
import com.codelegends.travelbook.core.network.AuthInterceptor;
import com.codelegends.travelbook.core.network.DefaultAuthTokenProvider;
import com.codelegends.travelbook.core.session.DataStoreSessionManager;
import com.codelegends.travelbook.repository.AuthRepository;
import com.codelegends.travelbook.repository.AuthRepositoryImpl;
import com.codelegends.travelbook.repository.CompanyTourRepository;
import com.codelegends.travelbook.repository.CompanyTourRepositoryImpl;
import com.codelegends.travelbook.repository.GuideRepository;
import com.codelegends.travelbook.repository.GuideRepositoryImpl;
import com.codelegends.travelbook.repository.PublicTourRepository;
import com.codelegends.travelbook.repository.PublicTourRepositoryImpl;
import com.codelegends.travelbook.repository.UserRepository;
import com.codelegends.travelbook.repository.UserRepositoryImpl;
import com.codelegends.travelbook.service.AuthApiService;
import com.codelegends.travelbook.service.CompanyTourApiService;
import com.codelegends.travelbook.service.GuideApiService;
import com.codelegends.travelbook.service.TourApiService;
import com.codelegends.travelbook.service.UserAuthApiService;
import com.codelegends.travelbook.usecase.CompanyLoginUseCase;
import com.codelegends.travelbook.usecase.CompanyRegisterUseCase;
import com.codelegends.travelbook.usecase.GuideLoginUseCase;
import com.codelegends.travelbook.usecase.GuideRegisterUseCase;
import com.codelegends.travelbook.viewmodel.AppEntryViewModel;
import com.codelegends.travelbook.viewmodel.AppEntryViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.AppEntryViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.AppEntryViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel;
import com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyGuidesViewModel;
import com.codelegends.travelbook.viewmodel.CompanyGuidesViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyGuidesViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyGuidesViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyHomeViewModel;
import com.codelegends.travelbook.viewmodel.CompanyHomeViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyHomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyHomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyProfileViewModel;
import com.codelegends.travelbook.viewmodel.CompanyProfileViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyShellViewModel;
import com.codelegends.travelbook.viewmodel.CompanyShellViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel;
import com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyToursViewModel;
import com.codelegends.travelbook.viewmodel.CompanyToursViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CompanyToursViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CompanyToursViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CreateTourViewModel;
import com.codelegends.travelbook.viewmodel.CreateTourViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.CreateTourViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.CreateTourViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel;
import com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel;
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideDashboardViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideMyCompaniesViewModel;
import com.codelegends.travelbook.viewmodel.GuideMyCompaniesViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideMyCompaniesViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideMyCompaniesViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideMyToursViewModel;
import com.codelegends.travelbook.viewmodel.GuideMyToursViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideMyToursViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideMyToursViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideProfileViewModel;
import com.codelegends.travelbook.viewmodel.GuideProfileViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideShellViewModel;
import com.codelegends.travelbook.viewmodel.GuideShellViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.GuideShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.GuideShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.LoginViewModel;
import com.codelegends.travelbook.viewmodel.LoginViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.LoginViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.LoginViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.PublicAboutViewModel;
import com.codelegends.travelbook.viewmodel.PublicAboutViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.PublicAboutViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.PublicAboutViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.PublicHomeViewModel;
import com.codelegends.travelbook.viewmodel.PublicHomeViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.PublicHomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.PublicHomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.RegisterViewModel;
import com.codelegends.travelbook.viewmodel.RegisterViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.RegisterViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.RegisterViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.TourListingViewModel;
import com.codelegends.travelbook.viewmodel.TourListingViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.TourListingViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.TourListingViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserGuideListViewModel;
import com.codelegends.travelbook.viewmodel.UserGuideListViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.UserGuideListViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserGuideListViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserLoginViewModel;
import com.codelegends.travelbook.viewmodel.UserLoginViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.UserLoginViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserLoginViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserRegisterViewModel;
import com.codelegends.travelbook.viewmodel.UserRegisterViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.UserRegisterViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserRegisterViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserShellViewModel;
import com.codelegends.travelbook.viewmodel.UserShellViewModel_HiltModules;
import com.codelegends.travelbook.viewmodel.UserShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.codelegends.travelbook.viewmodel.UserShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import dagger.hilt.android.ActivityRetainedLifecycle;
import dagger.hilt.android.ViewModelLifecycle;
import dagger.hilt.android.internal.builders.ActivityComponentBuilder;
import dagger.hilt.android.internal.builders.ActivityRetainedComponentBuilder;
import dagger.hilt.android.internal.builders.FragmentComponentBuilder;
import dagger.hilt.android.internal.builders.ServiceComponentBuilder;
import dagger.hilt.android.internal.builders.ViewComponentBuilder;
import dagger.hilt.android.internal.builders.ViewModelComponentBuilder;
import dagger.hilt.android.internal.builders.ViewWithFragmentComponentBuilder;
import dagger.hilt.android.internal.lifecycle.DefaultViewModelFactories;
import dagger.hilt.android.internal.lifecycle.DefaultViewModelFactories_InternalFactoryFactory_Factory;
import dagger.hilt.android.internal.managers.ActivityRetainedComponentManager_LifecycleModule_ProvideActivityRetainedLifecycleFactory;
import dagger.hilt.android.internal.managers.SavedStateHandleHolder;
import dagger.hilt.android.internal.modules.ApplicationContextModule;
import dagger.hilt.android.internal.modules.ApplicationContextModule_ProvideContextFactory;
import dagger.internal.DaggerGenerated;
import dagger.internal.DoubleCheck;
import dagger.internal.LazyClassKeyMap;
import dagger.internal.MapBuilder;
import dagger.internal.Preconditions;
import dagger.internal.Provider;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;

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
public final class DaggerTravelBookApplication_HiltComponents_SingletonC {
  private DaggerTravelBookApplication_HiltComponents_SingletonC() {
  }

  public static Builder builder() {
    return new Builder();
  }

  public static final class Builder {
    private ApplicationContextModule applicationContextModule;

    private Builder() {
    }

    public Builder applicationContextModule(ApplicationContextModule applicationContextModule) {
      this.applicationContextModule = Preconditions.checkNotNull(applicationContextModule);
      return this;
    }

    public TravelBookApplication_HiltComponents.SingletonC build() {
      Preconditions.checkBuilderRequirement(applicationContextModule, ApplicationContextModule.class);
      return new SingletonCImpl(applicationContextModule);
    }
  }

  private static final class ActivityRetainedCBuilder implements TravelBookApplication_HiltComponents.ActivityRetainedC.Builder {
    private final SingletonCImpl singletonCImpl;

    private SavedStateHandleHolder savedStateHandleHolder;

    private ActivityRetainedCBuilder(SingletonCImpl singletonCImpl) {
      this.singletonCImpl = singletonCImpl;
    }

    @Override
    public ActivityRetainedCBuilder savedStateHandleHolder(
        SavedStateHandleHolder savedStateHandleHolder) {
      this.savedStateHandleHolder = Preconditions.checkNotNull(savedStateHandleHolder);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ActivityRetainedC build() {
      Preconditions.checkBuilderRequirement(savedStateHandleHolder, SavedStateHandleHolder.class);
      return new ActivityRetainedCImpl(singletonCImpl, savedStateHandleHolder);
    }
  }

  private static final class ActivityCBuilder implements TravelBookApplication_HiltComponents.ActivityC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private Activity activity;

    private ActivityCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
    }

    @Override
    public ActivityCBuilder activity(Activity activity) {
      this.activity = Preconditions.checkNotNull(activity);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ActivityC build() {
      Preconditions.checkBuilderRequirement(activity, Activity.class);
      return new ActivityCImpl(singletonCImpl, activityRetainedCImpl, activity);
    }
  }

  private static final class FragmentCBuilder implements TravelBookApplication_HiltComponents.FragmentC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private Fragment fragment;

    private FragmentCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
    }

    @Override
    public FragmentCBuilder fragment(Fragment fragment) {
      this.fragment = Preconditions.checkNotNull(fragment);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.FragmentC build() {
      Preconditions.checkBuilderRequirement(fragment, Fragment.class);
      return new FragmentCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, fragment);
    }
  }

  private static final class ViewWithFragmentCBuilder implements TravelBookApplication_HiltComponents.ViewWithFragmentC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl;

    private View view;

    private ViewWithFragmentCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl,
        FragmentCImpl fragmentCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
      this.fragmentCImpl = fragmentCImpl;
    }

    @Override
    public ViewWithFragmentCBuilder view(View view) {
      this.view = Preconditions.checkNotNull(view);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ViewWithFragmentC build() {
      Preconditions.checkBuilderRequirement(view, View.class);
      return new ViewWithFragmentCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, fragmentCImpl, view);
    }
  }

  private static final class ViewCBuilder implements TravelBookApplication_HiltComponents.ViewC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private View view;

    private ViewCBuilder(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        ActivityCImpl activityCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
    }

    @Override
    public ViewCBuilder view(View view) {
      this.view = Preconditions.checkNotNull(view);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ViewC build() {
      Preconditions.checkBuilderRequirement(view, View.class);
      return new ViewCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, view);
    }
  }

  private static final class ViewModelCBuilder implements TravelBookApplication_HiltComponents.ViewModelC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private SavedStateHandle savedStateHandle;

    private ViewModelLifecycle viewModelLifecycle;

    private ViewModelCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
    }

    @Override
    public ViewModelCBuilder savedStateHandle(SavedStateHandle handle) {
      this.savedStateHandle = Preconditions.checkNotNull(handle);
      return this;
    }

    @Override
    public ViewModelCBuilder viewModelLifecycle(ViewModelLifecycle viewModelLifecycle) {
      this.viewModelLifecycle = Preconditions.checkNotNull(viewModelLifecycle);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ViewModelC build() {
      Preconditions.checkBuilderRequirement(savedStateHandle, SavedStateHandle.class);
      Preconditions.checkBuilderRequirement(viewModelLifecycle, ViewModelLifecycle.class);
      return new ViewModelCImpl(singletonCImpl, activityRetainedCImpl, savedStateHandle, viewModelLifecycle);
    }
  }

  private static final class ServiceCBuilder implements TravelBookApplication_HiltComponents.ServiceC.Builder {
    private final SingletonCImpl singletonCImpl;

    private Service service;

    private ServiceCBuilder(SingletonCImpl singletonCImpl) {
      this.singletonCImpl = singletonCImpl;
    }

    @Override
    public ServiceCBuilder service(Service service) {
      this.service = Preconditions.checkNotNull(service);
      return this;
    }

    @Override
    public TravelBookApplication_HiltComponents.ServiceC build() {
      Preconditions.checkBuilderRequirement(service, Service.class);
      return new ServiceCImpl(singletonCImpl, service);
    }
  }

  private static final class ViewWithFragmentCImpl extends TravelBookApplication_HiltComponents.ViewWithFragmentC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl;

    private final ViewWithFragmentCImpl viewWithFragmentCImpl = this;

    ViewWithFragmentCImpl(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl,
        FragmentCImpl fragmentCImpl, View viewParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
      this.fragmentCImpl = fragmentCImpl;


    }
  }

  private static final class FragmentCImpl extends TravelBookApplication_HiltComponents.FragmentC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl = this;

    FragmentCImpl(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        ActivityCImpl activityCImpl, Fragment fragmentParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;


    }

    @Override
    public DefaultViewModelFactories.InternalFactoryFactory getHiltInternalFactoryFactory() {
      return activityCImpl.getHiltInternalFactoryFactory();
    }

    @Override
    public ViewWithFragmentComponentBuilder viewWithFragmentComponentBuilder() {
      return new ViewWithFragmentCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl, fragmentCImpl);
    }
  }

  private static final class ViewCImpl extends TravelBookApplication_HiltComponents.ViewC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final ViewCImpl viewCImpl = this;

    ViewCImpl(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        ActivityCImpl activityCImpl, View viewParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;


    }
  }

  private static final class ActivityCImpl extends TravelBookApplication_HiltComponents.ActivityC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl = this;

    ActivityCImpl(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        Activity activityParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;


    }

    Map keySetMapOfClassOfAndBooleanBuilder() {
      MapBuilder mapBuilder = MapBuilder.<String, Boolean>newMapBuilder(24);
      mapBuilder.put(AppEntryViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, AppEntryViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyDashboardViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyDashboardViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyGuidesViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyGuidesViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyHomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyHomeViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyProfileViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyShellViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyTourDetailViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyTourDetailViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CompanyToursViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CompanyToursViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(CreateTourViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, CreateTourViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideCompaniesViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideCompaniesViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideDashboardViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideDashboardViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideMyCompaniesViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideMyCompaniesViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideMyToursViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideMyToursViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideProfileViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(GuideShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, GuideShellViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(LoginViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, LoginViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(PublicAboutViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, PublicAboutViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(PublicHomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, PublicHomeViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(RegisterViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, RegisterViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(TourListingViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, TourListingViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(UserGuideListViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, UserGuideListViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(UserLoginViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, UserLoginViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(UserRegisterViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, UserRegisterViewModel_HiltModules.KeyModule.provide());
      mapBuilder.put(UserShellViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, UserShellViewModel_HiltModules.KeyModule.provide());
      return mapBuilder.build();
    }

    @Override
    public void injectMainActivity(MainActivity arg0) {
    }

    @Override
    public DefaultViewModelFactories.InternalFactoryFactory getHiltInternalFactoryFactory() {
      return DefaultViewModelFactories_InternalFactoryFactory_Factory.newInstance(getViewModelKeys(), new ViewModelCBuilder(singletonCImpl, activityRetainedCImpl));
    }

    @Override
    public Map<Class<?>, Boolean> getViewModelKeys() {
      return LazyClassKeyMap.<Boolean>of(keySetMapOfClassOfAndBooleanBuilder());
    }

    @Override
    public ViewModelComponentBuilder getViewModelComponentBuilder() {
      return new ViewModelCBuilder(singletonCImpl, activityRetainedCImpl);
    }

    @Override
    public FragmentComponentBuilder fragmentComponentBuilder() {
      return new FragmentCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl);
    }

    @Override
    public ViewComponentBuilder viewComponentBuilder() {
      return new ViewCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl);
    }
  }

  private static final class ViewModelCImpl extends TravelBookApplication_HiltComponents.ViewModelC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ViewModelCImpl viewModelCImpl = this;

    Provider<AppEntryViewModel> appEntryViewModelProvider;

    Provider<CompanyDashboardViewModel> companyDashboardViewModelProvider;

    Provider<CompanyGuidesViewModel> companyGuidesViewModelProvider;

    Provider<CompanyHomeViewModel> companyHomeViewModelProvider;

    Provider<CompanyProfileViewModel> companyProfileViewModelProvider;

    Provider<CompanyShellViewModel> companyShellViewModelProvider;

    Provider<CompanyTourDetailViewModel> companyTourDetailViewModelProvider;

    Provider<CompanyToursViewModel> companyToursViewModelProvider;

    Provider<CreateTourViewModel> createTourViewModelProvider;

    Provider<GuideCompaniesViewModel> guideCompaniesViewModelProvider;

    Provider<GuideDashboardViewModel> guideDashboardViewModelProvider;

    Provider<GuideMyCompaniesViewModel> guideMyCompaniesViewModelProvider;

    Provider<GuideMyToursViewModel> guideMyToursViewModelProvider;

    Provider<GuideProfileViewModel> guideProfileViewModelProvider;

    Provider<GuideShellViewModel> guideShellViewModelProvider;

    Provider<LoginViewModel> loginViewModelProvider;

    Provider<PublicAboutViewModel> publicAboutViewModelProvider;

    Provider<PublicHomeViewModel> publicHomeViewModelProvider;

    Provider<RegisterViewModel> registerViewModelProvider;

    Provider<TourListingViewModel> tourListingViewModelProvider;

    Provider<UserGuideListViewModel> userGuideListViewModelProvider;

    Provider<UserLoginViewModel> userLoginViewModelProvider;

    Provider<UserRegisterViewModel> userRegisterViewModelProvider;

    Provider<UserShellViewModel> userShellViewModelProvider;

    ViewModelCImpl(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        SavedStateHandle savedStateHandleParam, ViewModelLifecycle viewModelLifecycleParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;

      initialize(savedStateHandleParam, viewModelLifecycleParam);

    }

    CompanyLoginUseCase companyLoginUseCase() {
      return new CompanyLoginUseCase(singletonCImpl.bindAuthRepositoryProvider.get());
    }

    GuideLoginUseCase guideLoginUseCase() {
      return new GuideLoginUseCase(singletonCImpl.bindAuthRepositoryProvider.get());
    }

    CompanyRegisterUseCase companyRegisterUseCase() {
      return new CompanyRegisterUseCase(singletonCImpl.bindAuthRepositoryProvider.get());
    }

    GuideRegisterUseCase guideRegisterUseCase() {
      return new GuideRegisterUseCase(singletonCImpl.bindAuthRepositoryProvider.get());
    }

    Map hiltViewModelMapMapOfClassOfAndProviderOfViewModelBuilder() {
      MapBuilder mapBuilder = MapBuilder.<String, javax.inject.Provider<ViewModel>>newMapBuilder(24);
      mapBuilder.put(AppEntryViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (appEntryViewModelProvider)));
      mapBuilder.put(CompanyDashboardViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyDashboardViewModelProvider)));
      mapBuilder.put(CompanyGuidesViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyGuidesViewModelProvider)));
      mapBuilder.put(CompanyHomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyHomeViewModelProvider)));
      mapBuilder.put(CompanyProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyProfileViewModelProvider)));
      mapBuilder.put(CompanyShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyShellViewModelProvider)));
      mapBuilder.put(CompanyTourDetailViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyTourDetailViewModelProvider)));
      mapBuilder.put(CompanyToursViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (companyToursViewModelProvider)));
      mapBuilder.put(CreateTourViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (createTourViewModelProvider)));
      mapBuilder.put(GuideCompaniesViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideCompaniesViewModelProvider)));
      mapBuilder.put(GuideDashboardViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideDashboardViewModelProvider)));
      mapBuilder.put(GuideMyCompaniesViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideMyCompaniesViewModelProvider)));
      mapBuilder.put(GuideMyToursViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideMyToursViewModelProvider)));
      mapBuilder.put(GuideProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideProfileViewModelProvider)));
      mapBuilder.put(GuideShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (guideShellViewModelProvider)));
      mapBuilder.put(LoginViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (loginViewModelProvider)));
      mapBuilder.put(PublicAboutViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (publicAboutViewModelProvider)));
      mapBuilder.put(PublicHomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (publicHomeViewModelProvider)));
      mapBuilder.put(RegisterViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (registerViewModelProvider)));
      mapBuilder.put(TourListingViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (tourListingViewModelProvider)));
      mapBuilder.put(UserGuideListViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (userGuideListViewModelProvider)));
      mapBuilder.put(UserLoginViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (userLoginViewModelProvider)));
      mapBuilder.put(UserRegisterViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (userRegisterViewModelProvider)));
      mapBuilder.put(UserShellViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) (userShellViewModelProvider)));
      return mapBuilder.build();
    }

    @SuppressWarnings("unchecked")
    private void initialize(final SavedStateHandle savedStateHandleParam,
        final ViewModelLifecycle viewModelLifecycleParam) {
      this.appEntryViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 0);
      this.companyDashboardViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 1);
      this.companyGuidesViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 2);
      this.companyHomeViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 3);
      this.companyProfileViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 4);
      this.companyShellViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 5);
      this.companyTourDetailViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 6);
      this.companyToursViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 7);
      this.createTourViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 8);
      this.guideCompaniesViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 9);
      this.guideDashboardViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 10);
      this.guideMyCompaniesViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 11);
      this.guideMyToursViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 12);
      this.guideProfileViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 13);
      this.guideShellViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 14);
      this.loginViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 15);
      this.publicAboutViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 16);
      this.publicHomeViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 17);
      this.registerViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 18);
      this.tourListingViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 19);
      this.userGuideListViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 20);
      this.userLoginViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 21);
      this.userRegisterViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 22);
      this.userShellViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 23);
    }

    @Override
    public Map<Class<?>, javax.inject.Provider<ViewModel>> getHiltViewModelMap() {
      return LazyClassKeyMap.<javax.inject.Provider<ViewModel>>of(hiltViewModelMapMapOfClassOfAndProviderOfViewModelBuilder());
    }

    @Override
    public Map<Class<?>, Object> getHiltViewModelAssistedMap() {
      return Collections.<Class<?>, Object>emptyMap();
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final ActivityRetainedCImpl activityRetainedCImpl;

      private final ViewModelCImpl viewModelCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
          ViewModelCImpl viewModelCImpl, int id) {
        this.singletonCImpl = singletonCImpl;
        this.activityRetainedCImpl = activityRetainedCImpl;
        this.viewModelCImpl = viewModelCImpl;
        this.id = id;
      }

      @Override
      @SuppressWarnings("unchecked")
      public T get() {
        switch (id) {
          case 0: // com.codelegends.travelbook.viewmodel.AppEntryViewModel
          return (T) new AppEntryViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 1: // com.codelegends.travelbook.viewmodel.CompanyDashboardViewModel
          return (T) new CompanyDashboardViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 2: // com.codelegends.travelbook.viewmodel.CompanyGuidesViewModel
          return (T) new CompanyGuidesViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 3: // com.codelegends.travelbook.viewmodel.CompanyHomeViewModel
          return (T) new CompanyHomeViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 4: // com.codelegends.travelbook.viewmodel.CompanyProfileViewModel
          return (T) new CompanyProfileViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 5: // com.codelegends.travelbook.viewmodel.CompanyShellViewModel
          return (T) new CompanyShellViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 6: // com.codelegends.travelbook.viewmodel.CompanyTourDetailViewModel
          return (T) new CompanyTourDetailViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 7: // com.codelegends.travelbook.viewmodel.CompanyToursViewModel
          return (T) new CompanyToursViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 8: // com.codelegends.travelbook.viewmodel.CreateTourViewModel
          return (T) new CreateTourViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindCompanyTourRepositoryProvider.get());

          case 9: // com.codelegends.travelbook.viewmodel.GuideCompaniesViewModel
          return (T) new GuideCompaniesViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindGuideRepositoryProvider.get());

          case 10: // com.codelegends.travelbook.viewmodel.GuideDashboardViewModel
          return (T) new GuideDashboardViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 11: // com.codelegends.travelbook.viewmodel.GuideMyCompaniesViewModel
          return (T) new GuideMyCompaniesViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindGuideRepositoryProvider.get());

          case 12: // com.codelegends.travelbook.viewmodel.GuideMyToursViewModel
          return (T) new GuideMyToursViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindGuideRepositoryProvider.get());

          case 13: // com.codelegends.travelbook.viewmodel.GuideProfileViewModel
          return (T) new GuideProfileViewModel(singletonCImpl.dataStoreSessionManagerProvider.get(), singletonCImpl.bindGuideRepositoryProvider.get());

          case 14: // com.codelegends.travelbook.viewmodel.GuideShellViewModel
          return (T) new GuideShellViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 15: // com.codelegends.travelbook.viewmodel.LoginViewModel
          return (T) new LoginViewModel(singletonCImpl.bindUserRepositoryProvider.get(), viewModelCImpl.companyLoginUseCase(), viewModelCImpl.guideLoginUseCase());

          case 16: // com.codelegends.travelbook.viewmodel.PublicAboutViewModel
          return (T) new PublicAboutViewModel(singletonCImpl.bindPublicTourRepositoryProvider.get());

          case 17: // com.codelegends.travelbook.viewmodel.PublicHomeViewModel
          return (T) new PublicHomeViewModel(singletonCImpl.bindPublicTourRepositoryProvider.get());

          case 18: // com.codelegends.travelbook.viewmodel.RegisterViewModel
          return (T) new RegisterViewModel(singletonCImpl.bindUserRepositoryProvider.get(), viewModelCImpl.companyRegisterUseCase(), viewModelCImpl.guideRegisterUseCase());

          case 19: // com.codelegends.travelbook.viewmodel.TourListingViewModel
          return (T) new TourListingViewModel(singletonCImpl.bindPublicTourRepositoryProvider.get());

          case 20: // com.codelegends.travelbook.viewmodel.UserGuideListViewModel
          return (T) new UserGuideListViewModel(singletonCImpl.bindGuideRepositoryProvider.get());

          case 21: // com.codelegends.travelbook.viewmodel.UserLoginViewModel
          return (T) new UserLoginViewModel(singletonCImpl.bindUserRepositoryProvider.get());

          case 22: // com.codelegends.travelbook.viewmodel.UserRegisterViewModel
          return (T) new UserRegisterViewModel(singletonCImpl.bindUserRepositoryProvider.get());

          case 23: // com.codelegends.travelbook.viewmodel.UserShellViewModel
          return (T) new UserShellViewModel(singletonCImpl.dataStoreSessionManagerProvider.get());

          default: throw new AssertionError(id);
        }
      }
    }
  }

  private static final class ActivityRetainedCImpl extends TravelBookApplication_HiltComponents.ActivityRetainedC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl = this;

    Provider<ActivityRetainedLifecycle> provideActivityRetainedLifecycleProvider;

    ActivityRetainedCImpl(SingletonCImpl singletonCImpl,
        SavedStateHandleHolder savedStateHandleHolderParam) {
      this.singletonCImpl = singletonCImpl;

      initialize(savedStateHandleHolderParam);

    }

    @SuppressWarnings("unchecked")
    private void initialize(final SavedStateHandleHolder savedStateHandleHolderParam) {
      this.provideActivityRetainedLifecycleProvider = DoubleCheck.provider(new SwitchingProvider<ActivityRetainedLifecycle>(singletonCImpl, activityRetainedCImpl, 0));
    }

    @Override
    public ActivityComponentBuilder activityComponentBuilder() {
      return new ActivityCBuilder(singletonCImpl, activityRetainedCImpl);
    }

    @Override
    public ActivityRetainedLifecycle getActivityRetainedLifecycle() {
      return provideActivityRetainedLifecycleProvider.get();
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final ActivityRetainedCImpl activityRetainedCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
          int id) {
        this.singletonCImpl = singletonCImpl;
        this.activityRetainedCImpl = activityRetainedCImpl;
        this.id = id;
      }

      @Override
      @SuppressWarnings("unchecked")
      public T get() {
        switch (id) {
          case 0: // dagger.hilt.android.ActivityRetainedLifecycle
          return (T) ActivityRetainedComponentManager_LifecycleModule_ProvideActivityRetainedLifecycleFactory.provideActivityRetainedLifecycle();

          default: throw new AssertionError(id);
        }
      }
    }
  }

  private static final class ServiceCImpl extends TravelBookApplication_HiltComponents.ServiceC {
    private final SingletonCImpl singletonCImpl;

    private final ServiceCImpl serviceCImpl = this;

    ServiceCImpl(SingletonCImpl singletonCImpl, Service serviceParam) {
      this.singletonCImpl = singletonCImpl;


    }
  }

  private static final class SingletonCImpl extends TravelBookApplication_HiltComponents.SingletonC {
    private final ApplicationContextModule applicationContextModule;

    private final SingletonCImpl singletonCImpl = this;

    Provider<DataStoreSessionManager> dataStoreSessionManagerProvider;

    Provider<DefaultAuthTokenProvider> defaultAuthTokenProvider;

    Provider<HttpLoggingInterceptor> provideHttpLoggingInterceptorProvider;

    Provider<OkHttpClient> provideOkHttpClientProvider;

    Provider<Retrofit> provideRetrofitProvider;

    Provider<CompanyTourApiService> provideCompanyTourApiServiceProvider;

    Provider<CompanyTourRepositoryImpl> companyTourRepositoryImplProvider;

    Provider<CompanyTourRepository> bindCompanyTourRepositoryProvider;

    Provider<GuideApiService> provideGuideApiServiceProvider;

    Provider<GuideRepositoryImpl> guideRepositoryImplProvider;

    Provider<GuideRepository> bindGuideRepositoryProvider;

    Provider<UserAuthApiService> provideUserAuthApiServiceProvider;

    Provider<UserRepositoryImpl> userRepositoryImplProvider;

    Provider<UserRepository> bindUserRepositoryProvider;

    Provider<AuthApiService> provideAuthApiServiceProvider;

    Provider<AuthRepositoryImpl> authRepositoryImplProvider;

    Provider<AuthRepository> bindAuthRepositoryProvider;

    Provider<TourApiService> provideTourApiServiceProvider;

    Provider<PublicTourRepositoryImpl> publicTourRepositoryImplProvider;

    Provider<PublicTourRepository> bindPublicTourRepositoryProvider;

    SingletonCImpl(ApplicationContextModule applicationContextModuleParam) {
      this.applicationContextModule = applicationContextModuleParam;
      initialize(applicationContextModuleParam);

    }

    AuthInterceptor authInterceptor() {
      return new AuthInterceptor(defaultAuthTokenProvider.get());
    }

    @SuppressWarnings("unchecked")
    private void initialize(final ApplicationContextModule applicationContextModuleParam) {
      this.dataStoreSessionManagerProvider = DoubleCheck.provider(new SwitchingProvider<DataStoreSessionManager>(singletonCImpl, 0));
      this.defaultAuthTokenProvider = DoubleCheck.provider(new SwitchingProvider<DefaultAuthTokenProvider>(singletonCImpl, 5));
      this.provideHttpLoggingInterceptorProvider = DoubleCheck.provider(new SwitchingProvider<HttpLoggingInterceptor>(singletonCImpl, 6));
      this.provideOkHttpClientProvider = DoubleCheck.provider(new SwitchingProvider<OkHttpClient>(singletonCImpl, 4));
      this.provideRetrofitProvider = DoubleCheck.provider(new SwitchingProvider<Retrofit>(singletonCImpl, 3));
      this.provideCompanyTourApiServiceProvider = DoubleCheck.provider(new SwitchingProvider<CompanyTourApiService>(singletonCImpl, 2));
      this.companyTourRepositoryImplProvider = new SwitchingProvider<>(singletonCImpl, 1);
      this.bindCompanyTourRepositoryProvider = DoubleCheck.provider((Provider) (companyTourRepositoryImplProvider));
      this.provideGuideApiServiceProvider = DoubleCheck.provider(new SwitchingProvider<GuideApiService>(singletonCImpl, 8));
      this.guideRepositoryImplProvider = new SwitchingProvider<>(singletonCImpl, 7);
      this.bindGuideRepositoryProvider = DoubleCheck.provider((Provider) (guideRepositoryImplProvider));
      this.provideUserAuthApiServiceProvider = DoubleCheck.provider(new SwitchingProvider<UserAuthApiService>(singletonCImpl, 10));
      this.userRepositoryImplProvider = new SwitchingProvider<>(singletonCImpl, 9);
      this.bindUserRepositoryProvider = DoubleCheck.provider((Provider) (userRepositoryImplProvider));
      this.provideAuthApiServiceProvider = DoubleCheck.provider(new SwitchingProvider<AuthApiService>(singletonCImpl, 12));
      this.authRepositoryImplProvider = new SwitchingProvider<>(singletonCImpl, 11);
      this.bindAuthRepositoryProvider = DoubleCheck.provider((Provider) (authRepositoryImplProvider));
      this.provideTourApiServiceProvider = DoubleCheck.provider(new SwitchingProvider<TourApiService>(singletonCImpl, 14));
      this.publicTourRepositoryImplProvider = new SwitchingProvider<>(singletonCImpl, 13);
      this.bindPublicTourRepositoryProvider = DoubleCheck.provider((Provider) (publicTourRepositoryImplProvider));
    }

    @Override
    public void injectTravelBookApplication(TravelBookApplication travelBookApplication) {
    }

    @Override
    public Set<Boolean> getDisableFragmentGetContextFix() {
      return Collections.<Boolean>emptySet();
    }

    @Override
    public ActivityRetainedComponentBuilder retainedComponentBuilder() {
      return new ActivityRetainedCBuilder(singletonCImpl);
    }

    @Override
    public ServiceComponentBuilder serviceComponentBuilder() {
      return new ServiceCBuilder(singletonCImpl);
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, int id) {
        this.singletonCImpl = singletonCImpl;
        this.id = id;
      }

      @Override
      @SuppressWarnings("unchecked")
      public T get() {
        switch (id) {
          case 0: // com.codelegends.travelbook.core.session.DataStoreSessionManager
          return (T) new DataStoreSessionManager(ApplicationContextModule_ProvideContextFactory.provideContext(singletonCImpl.applicationContextModule));

          case 1: // com.codelegends.travelbook.repository.CompanyTourRepositoryImpl
          return (T) new CompanyTourRepositoryImpl(singletonCImpl.provideCompanyTourApiServiceProvider.get());

          case 2: // com.codelegends.travelbook.service.CompanyTourApiService
          return (T) NetworkModule_ProvideCompanyTourApiServiceFactory.provideCompanyTourApiService(singletonCImpl.provideRetrofitProvider.get());

          case 3: // retrofit2.Retrofit
          return (T) NetworkModule_ProvideRetrofitFactory.provideRetrofit(singletonCImpl.provideOkHttpClientProvider.get());

          case 4: // okhttp3.OkHttpClient
          return (T) NetworkModule_ProvideOkHttpClientFactory.provideOkHttpClient(singletonCImpl.authInterceptor(), singletonCImpl.provideHttpLoggingInterceptorProvider.get());

          case 5: // com.codelegends.travelbook.core.network.DefaultAuthTokenProvider
          return (T) new DefaultAuthTokenProvider(singletonCImpl.dataStoreSessionManagerProvider.get());

          case 6: // okhttp3.logging.HttpLoggingInterceptor
          return (T) NetworkModule_ProvideHttpLoggingInterceptorFactory.provideHttpLoggingInterceptor();

          case 7: // com.codelegends.travelbook.repository.GuideRepositoryImpl
          return (T) new GuideRepositoryImpl(singletonCImpl.provideGuideApiServiceProvider.get());

          case 8: // com.codelegends.travelbook.service.GuideApiService
          return (T) NetworkModule_ProvideGuideApiServiceFactory.provideGuideApiService(singletonCImpl.provideRetrofitProvider.get());

          case 9: // com.codelegends.travelbook.repository.UserRepositoryImpl
          return (T) new UserRepositoryImpl(singletonCImpl.provideUserAuthApiServiceProvider.get(), singletonCImpl.dataStoreSessionManagerProvider.get());

          case 10: // com.codelegends.travelbook.service.UserAuthApiService
          return (T) UserAuthModule_Companion_ProvideUserAuthApiServiceFactory.provideUserAuthApiService(singletonCImpl.provideRetrofitProvider.get());

          case 11: // com.codelegends.travelbook.repository.AuthRepositoryImpl
          return (T) new AuthRepositoryImpl(singletonCImpl.provideAuthApiServiceProvider.get(), singletonCImpl.dataStoreSessionManagerProvider.get());

          case 12: // com.codelegends.travelbook.service.AuthApiService
          return (T) NetworkModule_ProvideAuthApiServiceFactory.provideAuthApiService(singletonCImpl.provideRetrofitProvider.get());

          case 13: // com.codelegends.travelbook.repository.PublicTourRepositoryImpl
          return (T) new PublicTourRepositoryImpl(singletonCImpl.provideTourApiServiceProvider.get());

          case 14: // com.codelegends.travelbook.service.TourApiService
          return (T) NetworkModule_ProvideTourApiServiceFactory.provideTourApiService(singletonCImpl.provideRetrofitProvider.get());

          default: throw new AssertionError(id);
        }
      }
    }
  }
}
