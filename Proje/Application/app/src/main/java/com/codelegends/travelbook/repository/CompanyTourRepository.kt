package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.CompanyGuideSummary
import com.codelegends.travelbook.model.CompanyProfileSummary
import com.codelegends.travelbook.model.CompanyProfileUpdateRequest
import com.codelegends.travelbook.model.CompanyTourDetail
import com.codelegends.travelbook.model.CompanyTourSummary
import com.codelegends.travelbook.model.CreateTourRequest
import com.codelegends.travelbook.model.UpdateTourRequest

interface CompanyTourRepository {
    suspend fun listTours(companyId: String): ApiResult<List<CompanyTourSummary>>

    suspend fun getTourDetail(companyId: String, tourId: String): ApiResult<CompanyTourDetail>

    suspend fun createTour(
        companyId: String,
        request: CreateTourRequest,
        imageFileName: String?,
        imageMimeType: String?,
        imageBytes: ByteArray?
    ): ApiResult<Unit>

    suspend fun updateTour(
        companyId: String,
        tourId: String,
        body: UpdateTourRequest
    ): ApiResult<CompanyTourDetail>

    suspend fun deleteTour(companyId: String, tourId: String): ApiResult<Unit>

    suspend fun listGuides(companyId: String): ApiResult<List<CompanyGuideSummary>>

    suspend fun getCompanyProfile(companyId: String): ApiResult<CompanyProfileSummary>

    suspend fun updateCompanyProfile(
        companyId: String,
        body: CompanyProfileUpdateRequest
    ): ApiResult<CompanyProfileSummary>

    suspend fun uploadCompanyProfileImage(
        companyId: String,
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ): ApiResult<String>

    suspend fun uploadCompanyBannerImage(
        companyId: String,
        fileName: String,
        mimeType: String,
        bytes: ByteArray
    ): ApiResult<String>

    suspend fun deleteCompanyAccount(companyId: String): ApiResult<Unit>
}
