# Revert Purchase Cancellation Logic

Revert the "Cancel Purchase" functionality while maintaining the fix for the dynamic "Purchase" status update and listing page indicators.

## Proposed Changes

### UI Layer

#### [UserTourDetailScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/UserTourDetailScreen.kt)

- Remove the `showCancelDialog` and its corresponding `AlertDialog`.
- Update `PurchaseActionSection` to only show the "Satın Almayı İptal Et" button as a disabled/informational state or remove it entirely if a purchase is already made. Based on the user's request ("sadece satın alım yapsın"), I will change the UI to show "Satın Alındı" text instead of an active "Cancel" button when `isPurchased` is true.

### ViewModel Layer

#### [UserTourDetailViewModel.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/viewmodel/UserTourDetailViewModel.kt)

- Remove the `cancelPurchase()` function.
- Remove `isCanceling` from `UserTourDetailUiState`.

### Repository Layer

#### [PublicTourRepositoryImpl.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/repository/PublicTourRepositoryImpl.kt)

- I will keep the `purchaseCache` logic because it's necessary for the "status update" part of the original request (ensuring the button reflects the purchased state and the list page shows the badge), but I will remove the logic that removes items from the cache since cancellation is no longer supported.

## Verification Plan

### Manual Verification
1. **Purchase Flow**:
    - Navigate to a tour detail page.
    - Click "Satın Al" and confirm.
    - Verify button changes to a non-clickable "Satın Alındı" or similar state.
    - Verify no "Cancel" option exists.
2. **List Page**:
    - Verify the "Satın Alındı" badge still appears on purchased tours.
