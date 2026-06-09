package com.codelegends.travelbook.repository

import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.model.*

interface GuideRepository {
    suspend fun getAllGuides(): ApiResult<List<GuideProfileSummary>>
    suspend fun getProfile(guideId: String): ApiResult<GuideProfileSummary>
    suspend fun updateProfile(guideId: String, request: GuideProfileUpdateRequest): ApiResult<GuideProfileSummary>
    suspend fun deleteAccount(guideId: String): ApiResult<Unit>
    suspend fun uploadProfileImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String>
    suspend fun uploadBannerImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String>
    suspend fun uploadGalleryImage(guideId: String, fileName: String, mimeType: String, bytes: ByteArray): ApiResult<String>
    suspend fun removeGalleryImage(guideId: String, imageUrl: String): ApiResult<Unit>

    suspend fun listCompanies(): ApiResult<List<CompanyProfileSummary>>
    suspend fun registerToCompany(guideId: String, companyId: String): ApiResult<Unit>

    suspend fun listMyCompanies(guideId: String): ApiResult<List<CompanyProfileSummary>>
    suspend fun removeFromCompany(guideId: String, companyId: String): ApiResult<Unit>

    suspend fun listMyTours(guideId: String): ApiResult<List<CompanyTourSummary>>
    suspend fun removeTourRegistration(guideId: String, tourId: String): ApiResult<Unit>
}
