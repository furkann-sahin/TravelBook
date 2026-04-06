# Ümmü Fidan'ın REST API Metotları

**API Test Videosu:** https://youtu.be/WPItiD87N9Y

## 1. Kullanıcı Giriş Yapma
- **Endpoint:** `POST /api/users/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
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

## 2. Kullanıcı Kayıt Olma
- **Endpoint:** `POST /api/users/auth/register`
- **Request Body:**
  ```json
  {
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "password": "Sifre123!"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu
  ```json
  {
    "status": "success",
    "message": "Kullanıcı başarıyla kayıt oldu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## 3. Tur Filtreleme
- **Endpoint:** `GET /api/tours`
- **Query Parameters:**
  - `location` (string, optional) - Tur konumu
  - `minPrice` (number, optional) - Minimum fiyat
  - `maxPrice` (number, optional) - Maksimum fiyat
  - `startDate` (string, optional) - Başlangıç tarihi
- **Örnek Kullanım:** `/api/tours?location=Nevşehir&minPrice=1000&maxPrice=3000`
- **Response:** `200 OK` - Turlar başarıyla listelendi
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "1",
        "name": "Kapadokya Turu",
        "location": "Nevşehir",
        "price": 2500,
        "startDate": "2026-06-01"
      }
    ]
  }
  ```

## 4. Tüm Tur Rehberlerini Listeleme
- **Endpoint:** `GET /api/guides`
- **Response:** `200 OK` - Rehberler başarıyla listelendi
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "1",
        "firstName": "Ahmet",
        "lastName": "Yılmaz",
        "languages": ["Türkçe", "İngilizce"],
        "rating": 4.8
      }
    ]
  }
  ```

## 5. Tur Satın Alma
- **Endpoint:** `POST /api/tours/{tourId}/purchases`
- **Path Parameters:**
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Tur satın alma işlemi başarılı
  ```json
  {
    "status": "success",
    "message": "Tur satın alma işlemi başarılı",
    "data": {
      "purchaseId": "12345",
      "tourId": "1",
      "userId": "10",
      "status": "confirmed"
    }
  }
  ```

## 6. Tur Satın Alma İptali
- **Endpoint:** `DELETE /api/purchases/{purchasesId}`
- **Path Parameters:**
  - `purchasesId` (string, required) - Satın alma ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Satın alma işlemi iptal edildi
  ```json
  {
    "status": "success",
    "message": "Satın alma işlemi iptal edildi"
  }
  ```

## 7. Favori Tur Listeleme
- **Endpoint:** `GET /api/users/{userId}/favorites`
- **Path Parameters:**
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Favori turlar başarıyla listelendi
  ```json
  {
    "status": "success",
    "data": [
      {
        "tourId": "1",
        "name": "Kapadokya Turu",
        "location": "Nevşehir",
        "price": 2500
      }
    ]
  }
  ```

## 8. Favori Tur Ekleme
- **Endpoint:** `POST /api/users/{userId}/favorites`
- **Path Parameters:**
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**
  ```json
  {
    "tourId": "1"
  }
  ```
- **Response:** `201 Created` - Tur favorilere eklendi
  ```json
  {
    "status": "success",
    "message": "Tur favorilere eklendi"
  }
  ```

## 9. Favori Tur Silme
- **Endpoint:** `DELETE /api/users/{userId}/favorites/{tourId}`
- **Path Parameters:**
  - `userId` (string, required) - Kullanıcı ID'si
  - `tourId` (string, required) - Tur ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Tur favorilerden kaldırıldı
  ```json
  {
    "status": "success",
    "message": "Tur favorilerden kaldırıldı"
  }
  ```