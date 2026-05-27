package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiListEnvelope
import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.CompanyProfileDto
import com.codelegends.travelbook.model.GuideCompanyRegistrationRequest
import com.codelegends.travelbook.model.GuideImageUploadDto
import com.codelegends.travelbook.model.GuideProfileDto
import com.codelegends.travelbook.model.GuideProfileUpdateRequest
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.*

interface GuideApiService {

    @GET("guides/{guideId}")
    suspend fun getGuideDetail(
        @Path("guideId") guideId: String
    ): Response<ApiObjectEnvelope<GuideProfileDto>>

    @PUT("guides/{guideId}")
    suspend fun updateGuideProfile(
        @Path("guideId") guideId: String,
        @Body request: GuideProfileUpdateRequest
    ): Response<ApiObjectEnvelope<GuideProfileDto>>

    @DELETE("guides/{guideId}")
    suspend fun deleteGuide(
        @Path("guideId") guideId: String
    ): Response<ApiObjectEnvelope<Unit>>

    @Multipart
    @POST("guides/{guideId}/profile-image")
    suspend fun uploadProfileImage(
        @Path("guideId") guideId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiObjectEnvelope<GuideImageUploadDto>>

    @Multipart
    @POST("guides/{guideId}/banner-image")
    suspend fun uploadBannerImage(
        @Path("guideId") guideId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiObjectEnvelope<GuideImageUploadDto>>

    @Multipart
    @POST("guides/{guideId}/gallery-images")
    suspend fun uploadGalleryImage(
        @Path("guideId") guideId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiObjectEnvelope<GuideImageUploadDto>>

    @DELETE("guides/{guideId}/gallery-images")
    suspend fun removeGalleryImage(
        @Path("guideId") guideId: String,
        @Query("imageUrl") imageUrl: String
    ): Response<ApiObjectEnvelope<Unit>>

    @GET("guides/companies")
    suspend fun listCompaniesForGuide(): Response<ApiListEnvelope<CompanyProfileDto>>

    @POST("guides/{guideId}/companies")
    suspend fun applyToCompany(
        @Path("guideId") guideId: String,
        @Body request: GuideCompanyRegistrationRequest
    ): Response<ApiObjectEnvelope<Unit>>

    @POST("guides/{guideId}/register/{companyId}")
    suspend fun registerToCompany(
        @Path("guideId") guideId: String,
        @Path("companyId") companyId: String
    ): Response<ApiObjectEnvelope<Unit>>

    @GET("guides/{guideId}/companies")
    suspend fun listMyCompanies(
        @Path("guideId") guideId: String
    ): Response<ApiListEnvelope<CompanyProfileDto>>

    @DELETE("guides/{guideId}/companies/{companyId}")
    suspend fun removeFromCompany(
        @Path("guideId") guideId: String,
        @Path("companyId") companyId: String
    ): Response<ApiObjectEnvelope<Unit>>

    @GET("guides/{guideId}/tours")
    suspend fun listMyTours(
        @Path("guideId") guideId: String
    ): Response<ApiListEnvelope<com.codelegends.travelbook.model.CompanyTourDto>>

    @DELETE("guides/{guideId}/tours/{tourId}")
    suspend fun removeTourRegistration(
        @Path("guideId") guideId: String,
        @Path("tourId") tourId: String
    ): Response<ApiObjectEnvelope<Unit>>
}
