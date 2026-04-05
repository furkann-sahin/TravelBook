# Beyza Keklikoglu'nun REST API Metotlari

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Kullanici Hesap Silme
- **Endpoint:** `DELETE /api/users/{userId}`
- **Path Parameters:**
  - `userId` (string, required) - Kullanici ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Kullanici hesabi basariyla silindi

## 2. Kullanici Sifre Guncelleme
- **Endpoint:** `PUT /api/users/{userId}/password`
- **Path Parameters:**
  - `userId` (string, required) - Kullanici ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "oldPassword": "EskiSifre123!",
    "newPassword": "YeniSifre123!"
  }
  ```
- **Response:** `200 OK` - Sifre basariyla guncellendi
  ```json
  {
    "status": "success",
    "message": "Sifre basariyla guncellendi"
  }
  ```

## 3. Tum Turlarin Listelenmesi
- **Endpoint:** `GET /api/tours?param=value`
- **Query Parameters (opsiyonel):**
  - `title` (string) - Tur adina gore filtreleme
  - `location` (string) - Konuma gore filtreleme
  - `price` (number) - Sabit fiyata gore filtreleme
  - `minPrice` (number) - Minimum fiyat
  - `maxPrice` (number) - Maksimum fiyat
  - `date` (date) - Tarihe gore filtreleme
- **Response:** `200 OK` - Turlar basariyla listelendi
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [
      {
        "id": "665a1f2b3c4d5e6f7a8b9c0d",
        "name": "Kapadokya Turu",
        "location": "Nevsehir",
        "price": 2500,
        "startDate": "2026-06-01T08:00:00Z",
        "endDate": "2026-06-03T18:00:00Z",
        "imageUrl": "/images/tours/kapadokya.jpg",
        "placesToVisit": ["Goreme", "Urgup"],
        "includedItems": ["Konaklama", "Ulasim"],
        "rating": 4.5
      }
    ]
  }
  ```

## 4. Tur Detayi Gosterme
- **Endpoint:** `GET /api/tours/{tourId}`
- **Path Parameters:**
  - `tourId` (string, required) - Tur ID'si
- **Response:** `200 OK` - Tur detayi basariyla getirildi
  ```json
  {
    "status": "success",
    "data": {
      "id": "665a1f2b3c4d5e6f7a8b9c0d",
      "title": "Kapadokya Turu",
      "description": "3 gunluk Kapadokya gezisi",
      "location": "Nevsehir",
      "price": 2500,
      "startDate": "2026-06-01T08:00:00Z",
      "endDate": "2026-06-03T18:00:00Z",
      "placesToVisit": ["Goreme", "Urgup"],
      "includedItems": ["Konaklama", "Ulasim"],
      "images": ["/images/tours/kapadokya.jpg"],
      "rating": 4.2,
      "reviewCount": 12
    }
  }
  ```

## 5. Seyahatlerim (Satin Alinan Turlar)
- **Endpoint:** `GET /api/users/{userId}/purchases?status=past|future`
- **Path Parameters:**
  - `userId` (string, required) - Kullanici ID'si
- **Query Parameters:**
  - `status` (string, opsiyonel) - `past` veya `future`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Satin alinan turlar basariyla listelendi
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [
      {
        "id": "665a1f2b3c4d5e6f7a8b9c111",
        "purchaseDate": "2026-04-05T10:00:00Z",
        "tour": {
          "id": "665a1f2b3c4d5e6f7a8b9c0d",
          "title": "Kapadokya Turu",
          "location": "Nevsehir",
          "price": 2500,
          "startDate": "2026-06-01T08:00:00Z",
          "endDate": "2026-06-03T18:00:00Z",
          "imageUrl": "/images/tours/kapadokya.jpg"
        }
      }
    ]
  }
  ```

## 6. Kullanici Profil Bilgileri
- **Endpoint:** `GET /api/users/{userId}`
- **Path Parameters:**
  - `userId` (string, required) - Kullanici ID'si
- **Response:** `200 OK` - Kullanici bilgileri basariyla getirildi
  ```json
  {
    "status": "success",
    "data": {
      "_id": "665a1f2b3c4d5e6f7a8b9c0d",
      "name": "Beyza Keklikoglu",
      "email": "beyza@example.com",
      "phone": "05551234567",
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z"
    }
  }
  ```

## 7. Yorum Ekleme
- **Endpoint:** `POST /api/tours/{tourId}/reviews`
- **Path Parameters:**
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Harika bir turdu, kesinlikle tavsiye ederim!"
  }
  ```
- **Response:** `201 Created` - Yorum basariyla eklendi
  ```json
  {
    "status": "success",
    "message": "Yorum basariyla eklendi",
    "data": {
      "id": "665a1f2b3c4d5e6f7a8b9c222",
      "tourId": "665a1f2b3c4d5e6f7a8b9c0d",
      "userId": "665a1f2b3c4d5e6f7a8b9c333",
      "userName": "Beyza",
      "comment": "Harika bir turdu, kesinlikle tavsiye ederim!",
      "rating": 5
    }
  }
  ```

## 8. Yorum Guncelleme
- **Endpoint:** `PUT /api/reviews/{reviewId}`
- **Path Parameters:**
  - `reviewId` (string, required) - Yorum ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "rating": 4,
    "comment": "Guncellendi: Cok guzel bir turdu"
  }
  ```
- **Response:** `200 OK` - Yorum basariyla guncellendi
  ```json
  {
    "status": "success",
    "message": "Yorum basariyla guncellendi"
  }
  ```

## 9. Yorum Silme
- **Endpoint:** `DELETE /api/reviews/{reviewId}`
- **Path Parameters:**
  - `reviewId` (string, required) - Yorum ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Yorum basariyla silindi
  ```json
  {
    "status": "success",
    "message": "Yorum basariyla silindi"
  }
  ```
