package com.codelegends.travelbook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codelegends.travelbook.core.network.ApiResult
import com.codelegends.travelbook.core.session.SessionManager
import com.codelegends.travelbook.model.CreateReviewRequest
import com.codelegends.travelbook.model.ReviewDto
import com.codelegends.travelbook.model.UpdateReviewRequest
import com.codelegends.travelbook.model.UserTourDetailDto
import com.codelegends.travelbook.repository.FavoriteRepository
import com.codelegends.travelbook.repository.PublicTourRepository
import com.codelegends.travelbook.repository.ReviewRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.firstOrNull
import javax.inject.Inject

data class UserTourDetailUiState(
    val isLoading: Boolean = false,
    val tour: UserTourDetailDto? = null,
    val errorMessage: String? = null,
    val currentUserId: String? = null,
    val isSubmittingReview: Boolean = false,
    val reviewComment: String = "",
    val reviewRating: Int = 5,
    val editingReviewId: String? = null,
    val editComment: String = "",
    val editRating: Int = 5,
    val snackbarMessage: String? = null,
    val isPurchasing: Boolean = false,
    val isPurchased: Boolean = false,
    val purchaseId: String? = null,
    val isFavorite: Boolean = false,
    val isTogglingFavorite: Boolean = false
)

@HiltViewModel
class UserTourDetailViewModel @Inject constructor(
    private val publicTourRepository: PublicTourRepository,
    private val reviewRepository: ReviewRepository,
    private val favoriteRepository: FavoriteRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserTourDetailUiState())
    val uiState: StateFlow<UserTourDetailUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val session = sessionManager.sessionFlow.firstOrNull()
            _uiState.update { it.copy(currentUserId = session?.userId) }
        }
    }

    fun loadTourDetail(tourId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result = publicTourRepository.getTourDetail(tourId)) {
                is ApiResult.Success -> {
                    // Backend'den veri gelmese bile local cache'den kontrol et
                    val isLocallyPurchased = publicTourRepository.isTourPurchased(tourId)
                    val localPurchaseId = publicTourRepository.getPurchaseId(tourId)

                    _uiState.update { 
                        it.copy(
                            isLoading = false, 
                            tour = result.data,
                            isPurchased = (result.data.isPurchased == true) || isLocallyPurchased,
                            purchaseId = result.data.purchaseId ?: localPurchaseId,
                            isPurchasing = false
                        ) 
                    }
                    checkIfFavorite(tourId)
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, errorMessage = result.message) }
                }
            }
        }
    }

    fun onReviewCommentChanged(comment: String) {
        _uiState.update { it.copy(reviewComment = comment) }
    }

    fun onReviewRatingChanged(rating: Int) {
        _uiState.update { it.copy(reviewRating = rating) }
    }

    fun submitReview(tourId: String) {
        val state = _uiState.value
        if (state.reviewComment.isBlank()) {
            _uiState.update { it.copy(snackbarMessage = "Lütfen bir yorum yazın") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmittingReview = true) }
            val request = CreateReviewRequest(comment = state.reviewComment, rating = state.reviewRating)
            when (val result = reviewRepository.createReview(tourId, request)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isSubmittingReview = false,
                            reviewComment = "",
                            reviewRating = 5,
                            snackbarMessage = "Yorumunuz eklendi"
                        )
                    }
                    loadTourDetail(tourId) // Refresh to see the new review and updated stats
                }
                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isSubmittingReview = false,
                            snackbarMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun startEditingReview(review: ReviewDto) {
        _uiState.update {
            it.copy(
                editingReviewId = review.id ?: review.objectId,
                editComment = review.comment.orEmpty(),
                editRating = review.rating ?: 5
            )
        }
    }

    fun cancelEditingReview() {
        _uiState.update { it.copy(editingReviewId = null) }
    }

    fun onEditCommentChanged(comment: String) {
        _uiState.update { it.copy(editComment = comment) }
    }

    fun onEditRatingChanged(rating: Int) {
        _uiState.update { it.copy(editRating = rating) }
    }

    fun updateReview(tourId: String) {
        val state = _uiState.value
        val reviewId = state.editingReviewId ?: return
        if (state.editComment.isBlank()) {
            _uiState.update { it.copy(snackbarMessage = "Yorum boş olamaz") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmittingReview = true) }
            val request = UpdateReviewRequest(comment = state.editComment, rating = state.editRating)
            when (val result = reviewRepository.updateReview(reviewId, request)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isSubmittingReview = false,
                            editingReviewId = null,
                            snackbarMessage = "Yorum güncellendi"
                        )
                    }
                    loadTourDetail(tourId)
                }
                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isSubmittingReview = false,
                            snackbarMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun deleteReview(tourId: String, reviewId: String) {
        viewModelScope.launch {
            when (val result = reviewRepository.deleteReview(reviewId)) {
                is ApiResult.Success -> {
                    _uiState.update { it.copy(snackbarMessage = "Yorum silindi") }
                    loadTourDetail(tourId)
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(snackbarMessage = result.message) }
                }
            }
        }
    }

    fun dismissSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }

    private fun checkIfFavorite(tourId: String) {
        val userId = _uiState.value.currentUserId ?: return
        
        // Önce cache'den kontrol et (Anlık görsel geri bildirim için)
        if (favoriteRepository.isFavorite(tourId)) {
            _uiState.update { it.copy(isFavorite = true) }
        }

        viewModelScope.launch {
            when (val result = favoriteRepository.getFavorites(userId)) {
                is ApiResult.Success -> {
                    val isFav = result.data.any { it.tourId == tourId }
                    _uiState.update { it.copy(isFavorite = isFav) }
                }
                else -> {}
            }
        }
    }

    fun toggleFavorite(tourId: String) {
        val userId = _uiState.value.currentUserId ?: return
        val isFav = _uiState.value.isFavorite
        
        viewModelScope.launch {
            _uiState.update { it.copy(isTogglingFavorite = true) }
            val result = if (isFav) {
                favoriteRepository.removeFavorite(userId, tourId)
            } else {
                when (val res = favoriteRepository.addFavorite(userId, tourId)) {
                    is ApiResult.Success -> ApiResult.Success(Unit)
                    is ApiResult.Error -> ApiResult.Error(res.message, res.code)
                }
            }

            when (result) {
                is ApiResult.Success -> {
                    _uiState.update { 
                        it.copy(
                            isFavorite = !isFav,
                            isTogglingFavorite = false,
                            snackbarMessage = if (isFav) "Favorilerden kaldırıldı" else "Favorilere eklendi"
                        ) 
                    }
                }
                is ApiResult.Error -> {
                    _uiState.update { it.copy(isTogglingFavorite = false, snackbarMessage = result.message) }
                }
            }
        }
    }

    fun purchaseTour(tourId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isPurchasing = true) }
            when (val result = publicTourRepository.purchaseTour(tourId)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isPurchasing = false,
                            isPurchased = true,
                            purchaseId = result.data.purchaseId,
                            snackbarMessage = "Tur satın alma işlemi başarılı"
                        )
                    }
                    loadTourDetail(tourId) // Kapasiteyi güncellemek için tekrar yükle
                }
                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isPurchasing = false,
                            snackbarMessage = result.message
                        )
                    }
                }
            }
        }
    }

    fun cancelPurchase(tourId: String) {
        val purchaseId = _uiState.value.purchaseId ?: return
        viewModelScope.launch {
            _uiState.update { it.copy(isPurchasing = true) } // Reuse purchasing state for loading
            when (val result = publicTourRepository.cancelPurchase(purchaseId)) {
                is ApiResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isPurchasing = false,
                            isPurchased = false,
                            purchaseId = null,
                            snackbarMessage = "Satın alma iptal edildi"
                        )
                    }
                    loadTourDetail(tourId)
                }
                is ApiResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isPurchasing = false,
                            snackbarMessage = result.message
                        )
                    }
                }
            }
        }
    }
}
