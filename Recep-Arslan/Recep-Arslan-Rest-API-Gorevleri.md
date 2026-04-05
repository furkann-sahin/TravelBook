# Recep Arslan'ın REST API Metotları

**API Test Videosu:** [https://youtu.be/k0UZrfX1HDE](https://youtu.be/k0UZrfX1HDE)

## 1. Tur Firması Kayıt Olma
- **Endpoint:** `POST /api/companies/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Gezgin Turizm",
    "email": "info@gezgin.com",
    "password": "Sifre123!",
    "phone": "02121234567",
    "address": "İstanbul, Kadıköy",
    "description": "Türkiye'nin en köklü tur firması"
  }
  ```
- **Response:** `201 Created` - Firma başarıyla oluşturuldu
  ```json
  {
    "status": "success",
    "message": "Gezgin Turizm başarıyla kayıt oldu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## 2. Tur Firması Giriş Yapma
- **Endpoint:** `POST /api/companies/auth/login`
- **Request Body:**
  ```json
  {
    "email": "info@gezgin.com",
    "password": "Sifre123!"
  }
  ```
- **Response:** `200 OK` - Giriş başarılı
  ```json
  {
    "status": "success",
    "message": "Giriş başarılı",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## 3. Tur Firması Detay Gösterme
- **Endpoint:** `GET /api/companies/{companyId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Response:** `200 OK` - Firma bilgileri başarıyla getirildi
  ```json
  {
    "status": "success",
    "data": {
      "_id": "665a1f2b3c4d5e6f7a8b9c0d",
      "name": "Gezgin Turizm",
      "email": "info@gezgin.com",
      "phone": "02121234567",
      "address": "İstanbul, Kadıköy",
      "description": "Türkiye'nin en köklü tur firması",
      "rating": 4.5,
      "tourCount": 12,
      "profileImageUrl": "/uploads/companies/profile123.jpg",
      "bannerImageUrl": "/uploads/companies/banner123.jpg",
      "instagram": "gezginturizm",
      "linkedin": "gezgin-turizm",
      "registeredGuides": ["665a1f2b3c4d5e6f7a8b9c0e"],
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-03-20T14:00:00Z"
    }
  }
  ```

## 4. Tur Firması Profil Güncelleme
- **Endpoint:** `PUT /api/companies/{companyId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "name": "Yeni Firma Adı",
    "phone": "02129876543",
    "address": "İstanbul, Beşiktaş",
    "description": "Güncellenmiş açıklama",
    "instagram": "gezginturizm",
    "linkedin": "gezgin-turizm"
  }
  ```
- **Response:** `200 OK` - Firma profili başarıyla güncellendi

## 5. Tur Firması Hesap Silme
- **Endpoint:** `DELETE /api/companies/{companyId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Firma hesabı başarıyla silindi
  ```json
  {
    "status": "success",
    "message": "Firma hesabı başarıyla silindi"
  }
  ```

## 6. Tur Firması Profil Resmi Yükleme
- **Endpoint:** `POST /api/companies/{companyId}/profile-image`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:** `multipart/form-data`
  - `image` (file, required) - Profil resmi (jpeg/jpg/png/webp, maks. 5MB)
- **Response:** `200 OK` - Profil resmi başarıyla yüklendi
  ```json
  {
    "status": "success",
    "data": {
      "profileImageUrl": "/uploads/companies/profile123.jpg"
    }
  }
  ```

## 7. Tur Firması Kapak Resmi Yükleme
- **Endpoint:** `POST /api/companies/{companyId}/banner-image`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:** `multipart/form-data`
  - `image` (file, required) - Kapak resmi (jpeg/jpg/png/webp, maks. 5MB)
- **Response:** `200 OK` - Kapak resmi başarıyla yüklendi
  ```json
  {
    "status": "success",
    "data": {
      "bannerImageUrl": "/uploads/companies/banner123.jpg"
    }
  }
  ```

## 8. Tur Firması Tur Listeleme
- **Endpoint:** `GET /api/companies/{companyId}/tours`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Firma turları başarıyla listelendi
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "665a1f2b3c4d5e6f7a8b9c0d",
        "name": "Kapadokya Turu",
        "location": "Nevşehir",
        "price": 2500,
        "startDate": "2026-06-01T08:00:00Z",
        "endDate": "2026-06-03T18:00:00Z",
        "imageUrl": "/images/tours/kapadokya.jpg",
        "services": ["Konaklama", "Ulaşım"],
        "companyName": "Gezgin Turizm",
        "rating": 4.5
      }
    ]
  }
  ```

## 9. Tur Ekleme
- **Endpoint:** `POST /api/companies/{companyId}/tours`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:** `multipart/form-data`
  ```json
  {
    "name": "Kapadokya Turu",
    "description": "3 günlük Kapadokya gezisi",
    "location": "Nevşehir",
    "price": 2500,
    "startDate": "2026-06-01T08:00:00Z",
    "endDate": "2026-06-03T18:00:00Z",
    "totalCapacity": 30,
    "places": ["Göreme", "Ürgüp", "Derinkuyu"],
    "departureLocation": "İstanbul",
    "arrivalLocation": "Nevşehir",
    "services": ["Konaklama", "Ulaşım", "Yemek"],
    "guideId": "665a1f2b3c4d5e6f7a8b9c0d",
    "image": "(dosya)"
  }
  ```
- **Response:** `201 Created` - Tur başarıyla oluşturuldu
  ```json
  {
    "status": "success",
    "message": "Tur başarıyla oluşturuldu",
    "data": {
      "id": "665a1f2b3c4d5e6f7a8b9c0d",
      "name": "Kapadokya Turu",
      "description": "3 günlük Kapadokya gezisi",
      "location": "Nevşehir",
      "price": 2500,
      "startDate": "2026-06-01T08:00:00Z",
      "endDate": "2026-06-03T18:00:00Z",
      "totalCapacity": 30,
      "filledCapacity": 0,
      "places": ["Göreme", "Ürgüp", "Derinkuyu"],
      "departureLocation": "İstanbul",
      "arrivalLocation": "Nevşehir",
      "services": ["Konaklama", "Ulaşım", "Yemek"],
      "companyId": "665a1f2b3c4d5e6f7a8b9c0e",
      "guideId": "665a1f2b3c4d5e6f7a8b9c0d",
      "rating": 0,
      "reviewCount": 0,
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z"
    }
  }
  ```

## 10. Tur Firması Tur Detayı Görüntüleme
- **Endpoint:** `GET /api/companies/{companyId}/tours/{tourId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Tur detayı başarıyla getirildi
  ```json
  {
    "status": "success",
    "data": {
      "id": "665a1f2b3c4d5e6f7a8b9c0d",
      "name": "Kapadokya Turu",
      "description": "3 günlük Kapadokya gezisi",
      "location": "Nevşehir",
      "price": 2500,
      "startDate": "2026-06-01T08:00:00Z",
      "endDate": "2026-06-03T18:00:00Z",
      "totalCapacity": 30,
      "filledCapacity": 5,
      "places": ["Göreme", "Ürgüp"],
      "departureLocation": "İstanbul",
      "arrivalLocation": "Nevşehir",
      "images": ["/images/tours/kapadokya.jpg"],
      "services": ["Konaklama", "Ulaşım"],
      "companyId": "665a1f2b3c4d5e6f7a8b9c0e",
      "companyName": "Gezgin Turizm",
      "guideId": "665a1f2b3c4d5e6f7a8b9c0f",
      "guide": {
        "id": "665a1f2b3c4d5e6f7a8b9c0f",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "email": "ahmet@example.com",
        "phone": "05551234567"
      },
      "rating": 4.2,
      "reviewCount": 12
    }
  }
  ```

## 11. Tur Güncelleme
- **Endpoint:** `PUT /api/companies/{companyId}/tours/{tourId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "name": "Kapadokya Turu v2",
    "price": 3000,
    "totalCapacity": 40,
    "places": ["Göreme", "Ürgüp", "Avanos"]
  }
  ```
- **Response:** `200 OK` - Tur başarıyla güncellendi

## 12. Tur Silme
- **Endpoint:** `DELETE /api/companies/{companyId}/tours/{tourId}`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Tur başarıyla silindi
  ```json
  {
    "status": "success",
    "message": "Tur başarıyla silindi"
  }
  ```

## 13. Firma Kayıtlı Rehberlerini Listeleme
- **Endpoint:** `GET /api/companies/{companyId}/guides`
- **Path Parameters:**
  - `companyId` (string, required) - Firma ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kayıtlı rehberler başarıyla listelendi
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "665a1f2b3c4d5e6f7a8b9c0d",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "email": "ahmet@example.com",
        "phone": "05551234567",
        "languages": ["Türkçe", "İngilizce"],
        "expertRoutes": ["Kapadokya", "Efes"],
        "rating": 4.8
      }
    ]
  }
  ```

## 14. Platform İstatistikleri
- **Endpoint:** `GET /api/tours/stats`
- **Response:** `200 OK` - Platform istatistikleri başarıyla getirildi
  ```json
  {
    "status": "success",
    "data": {
      "userCount": 150,
      "tourCount": 45,
      "companyCount": 12,
      "guideCount": 25
    }
  }
  ```
