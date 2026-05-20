package com.codelegends.travelbook.service

import com.codelegends.travelbook.model.ApiListEnvelope
import com.codelegends.travelbook.model.ApiObjectEnvelope
import com.codelegends.travelbook.model.CompanyGuideDto
import com.codelegends.travelbook.model.CompanyImageUploadDto
import com.codelegends.travelbook.model.CompanyProfileDto
import com.codelegends.travelbook.model.CompanyProfileUpdateRequest
import com.codelegends.travelbook.model.CompanyTourDetailDto
import com.codelegends.travelbook.model.CompanyTourDto
import com.codelegends.travelbook.model.UpdateTourRequest
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path

interface CompanyTourApiService {
    @GET("companies/{companyId}/tours")
    suspend fun listCompanyTours(
        @Path("companyId") companyId: String
    ): Response<ApiListEnvelope<CompanyTourDto>>

    @GET("companies/{companyId}/tours/{tourId}")
    suspend fun getCompanyTour(
        @Path("companyId") companyId: String,
        @Path("tourId") tourId: String
    ): Response<ApiObjectEnvelope<CompanyTourDetailDto>>

    @Multipart
    @POST("companies/{companyId}/tours")
    suspend fun createCompanyTour(
        @Path("companyId") companyId: String,
        @Part("name") name: RequestBody,
        @Part("description") description: RequestBody,
        @Part("departureLocation") departureLocation: RequestBody,
        @Part("arrivalLocation") arrivalLocation: RequestBody,
        @Part("places") places: RequestBody,
        @Part("price") price: RequestBody,
        @Part("totalCapacity") totalCapacity: RequestBody,
        @Part("startDate") startDate: RequestBody,
        @Part("endDate") endDate: RequestBody,
        @Part("services") services: RequestBody,
        @Part("guideId") guideId: RequestBody?,
        @Part image: MultipartBody.Part?
    ): Response<ApiObjectEnvelope<CompanyTourDto>>

    @PUT("companies/{companyId}/tours/{tourId}")
    suspend fun updateCompanyTour(
        @Path("companyId") companyId: String,
        @Path("tourId") tourId: String,
        @Body body: UpdateTourRequest
    ): Response<ApiObjectEnvelope<CompanyTourDetailDto>>

    @DELETE("companies/{companyId}/tours/{tourId}")
    suspend fun deleteCompanyTour(
        @Path("companyId") companyId: String,
        @Path("tourId") tourId: String
    ): Response<ApiObjectEnvelope<Any>>

    @GET("companies/{companyId}/guides")
    suspend fun listCompanyGuides(
        @Path("companyId") companyId: String
    ): Response<ApiListEnvelope<CompanyGuideDto>>

    @GET("companies/{companyId}")
    suspend fun getCompanyProfile(
        @Path("companyId") companyId: String
    ): Response<ApiObjectEnvelope<CompanyProfileDto>>

    @PUT("companies/{companyId}")
    suspend fun updateCompanyProfile(
        @Path("companyId") companyId: String,
        @Body body: CompanyProfileUpdateRequest
    ): Response<ApiObjectEnvelope<CompanyProfileDto>>

    @Multipart
    @POST("companies/{companyId}/profile-image")
    suspend fun uploadCompanyProfileImage(
        @Path("companyId") companyId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiObjectEnvelope<CompanyImageUploadDto>>

    @Multipart
    @POST("companies/{companyId}/banner-image")
    suspend fun uploadCompanyBannerImage(
        @Path("companyId") companyId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiObjectEnvelope<CompanyImageUploadDto>>

    @DELETE("companies/{companyId}")
    suspend fun deleteCompanyAccount(
        @Path("companyId") companyId: String
    ): Response<ApiObjectEnvelope<Any>>
}
