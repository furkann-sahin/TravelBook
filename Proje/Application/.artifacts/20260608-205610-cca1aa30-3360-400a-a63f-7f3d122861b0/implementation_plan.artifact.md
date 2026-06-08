# Favorites Feature Implementation Plan

Implement a comprehensive "Favorites" system for the User Panel, allowing users to save, view, and manage their favorite tours.

## Proposed Changes

### Core Models & Service

#### [NEW] [FavoriteDto.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/model/FavoriteDto.kt)
- Define data structures for Favorite API responses.

#### [TourApiService.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/service/TourApiService.kt)
- Add GET, POST, and DELETE endpoints for favorites.

---

### Repository Layer

#### [NEW] [FavoriteRepository.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/repository/FavoriteRepository.kt) & [FavoriteRepositoryImpl.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/repository/FavoriteRepositoryImpl.kt)
- Implement functions to fetch, add, and remove favorite tours.
- Integrate with `TourApiService`.

#### [BindingModule.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/hilt/BindingModule.kt)
- Bind the new `FavoriteRepository`.

---

### ViewModel Layer

#### [NEW] [FavoriteViewModel.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/viewmodel/FavoriteViewModel.kt)
- Manage state for the "My Favorites" screen.
- Handle favorite toggle logic.

#### [TourListingViewModel.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/viewmodel/TourListingViewModel.kt)
- Update `TourListingUiState` to include favorite IDs.
- Add logic to toggle favorites from the list.

#### [UserTourDetailViewModel.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/viewmodel/UserTourDetailViewModel.kt)
- Update `UserTourDetailUiState` to include `isFavorite`.
- Add logic to toggle favorite status from the detail page.

---

### UI Layer

#### [NEW] [UserFavoritesScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/UserFavoritesScreen.kt)
- Create a screen to list all favorite tours.
- Handle empty state and loading/error states.

#### [TourListingScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/TourListingScreen.kt)
- Add a heart icon to `TourItem`.
- Connect the heart icon click to the favorite toggle logic.

#### [UserTourDetailScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/UserTourDetailScreen.kt)
- Add a heart icon and text button to the detail view.
- Connect to the favorite toggle logic.

#### [UserHomeScreen.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/screens/UserHomeScreen.kt)
- Connect the "Favorilerim" card to the new screen.

#### [AppNavGraph.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/navigation/AppNavGraph.kt)
- Add the route for the Favorites screen.

#### [AppRoute.kt](file:///C:/Users/ummu/OneDrive/Documents/TravelBook/Proje/Application/app/src/main/java/com/codelegends/travelbook/ui/navigation/AppRoute.kt)
- Define `UserFavorites` route.

## Verification Plan

### Manual Verification
1. **Adding to Favorites**:
    - Open the tour listing or a tour detail page.
    - Click the empty heart icon.
    - Verify it turns red and shows a success message.
2. **Viewing Favorites**:
    - Navigate to the "Favorilerim" screen from the Home screen.
    - Verify the added tour appears in the list.
3. **Removing from Favorites**:
    - Click the red heart icon on any of the three screens (List, Detail, or Favorites).
    - Verify it reverts to an empty heart and the tour is removed from the Favorites screen.
4. **Persistence**:
    - Add a tour to favorites.
    - Restart the application and log in.
    - Verify the favorite status is preserved across app restarts.
5. **Empty State**:
    - Clear all favorites.
    - Verify the "Henüz favorilere eklenmiş tur bulunmuyor." message is shown.
