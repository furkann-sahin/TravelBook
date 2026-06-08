# Implementation Plan - Dynamic Purchase/Cancel Toggle (Android)

The goal is to fix the issue where the "Purchase" button remains visible and active even after a tour has been purchased. We will implement a dynamic toggle that switches between "Purchase" and "Cancel Purchase" based on the user's purchase status for a specific tour. This will be applied to the tour detail screen, and we'll ensure the listing reflects the purchase state if possible (although the current listing model doesn't support it directly without a backend change or a local cache).

## User Review Required

- **Listing Sync**: Since the backend `tours` endpoint (used in listing) does not return `isPurchased` or `purchaseId` in the `PublicTourDto` or `FeaturedTourSummary`, the listing screen will only reflect the updated state if we re-fetch after a purchase or use a shared state. I will focus on the **Tour Detail Screen** as the primary place for this toggle, as requested.
- **Button Styling**: I will use `MaterialTheme.colorScheme.error` for the "Cancel Purchase" button and the standard primary color for "Purchase".

## Proposed Changes

### [Core/Model] PublicTourModels

Ensure `FeaturedTourSummary` includes purchase information so the listing screen *could* eventually support it if the backend or repository is updated.

#### [PublicTourModels.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/model/PublicTourModels.kt)

- Update `FeaturedTourSummary` to include `isPurchased: Boolean = false` and `purchaseId: String? = null`.
- (Already exists) `UserTourDetailDto` has `isPurchased` and `purchaseId`.

---

### [UI/ViewModel] UserTourDetailViewModel

Enhance the ViewModel to manage the purchase/cancel state more robustly and handle background updates.

#### [UserTourDetailViewModel.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/viewmodel/UserTourDetailViewModel.kt)

- (Already implemented) The ViewModel already has `purchaseTour` and `cancelPurchase` methods that update `isPurchased` and `purchaseId`.
- I will ensure `loadTourDetail` correctly synchronizes these flags from the repository response.

---

### [UI/Screens] UserTourDetailScreen

Update the UI to dynamically show the correct button and handle the toggle logic.

#### [UserTourDetailScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/UserTourDetailScreen.kt)

- Modify `PurchaseActionSection` to use the `isPurchased` state from `uiState`.
- Update the button text to "Satın Almayı İptal Et" when `isPurchased` is true.
- Use `ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)` for the cancel button.
- Ensure the loading state (`isPurchasing` / `isCanceling`) is correctly reflected in the button (showing a `CircularProgressIndicator`).

---

### [Repository] PublicTourRepository & Impl

Ensure the repository correctly maps the purchase status if it becomes available in the list view.

#### [PublicTourRepositoryImpl.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/repository/PublicTourRepositoryImpl.kt)

- Update `mapTour` to include `isPurchased` and `purchaseId` from `PublicTourDto` if they exist (adding them to `PublicTourDto` if they are missing from the Serialized fields).

## Verification Plan

### Automated Tests
- Not applicable for this UI task.

### Manual Verification
1. **Login** to the Android app as a user.
2. **Navigate to Tour Detail**: Select a tour from the listing.
3. **Purchase**:
   - Tap "Satın Al".
   - Confirm in the dialog.
   - Verify the button changes to "Satın Almayı İptal Et" (red) and a success snackbar appears.
4. **Cancel**:
   - Tap "Satın Almayı İptal Et".
   - Confirm in the dialog.
   - Verify the button changes back to "Satın Al" (primary) and a success snackbar appears.
5. **Persistence**:
   - Purchase a tour.
   - Go back to the listing and re-enter the detail screen.
   - Verify the "Satın Almayı İptal Et" button is still shown.
