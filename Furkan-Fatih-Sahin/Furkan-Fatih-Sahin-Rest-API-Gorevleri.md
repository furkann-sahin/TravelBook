# Furkan Fatih Şahin'in REST API Metotları (Rehber)

**API Test Videosu:** [POSTMAN TEST VİDEOSU](https://youtu.be/5SBC5iKUXH0)

---

## 1. Rehber Kayıt Olma

**Endpoint:** `POST /api/guides/auth/register`

**Request Body:**
```json
{
  "firstName": "Furkan",
  "lastName": "Şahin",
  "email": "furkan@example.com",
  "password": "Guvenli123!",
  "phone": "+905551234567",
  "biography": "10 yıllık deneyimli tur rehberi",
  "languages": ["Türkçe", "İngilizce"],
  "expertRoutes": ["Kapadokya", "Efes"],
  "experienceYears": 10,
  "instagram": "furkan_rehber",
  "linkedin": "https://linkedin.com/in/furkan"
}
```

**Response:** `201 Created` — Rehber başarıyla oluşturuldu
```json
{
  "status": "success",
  "message": "Furkan başarıyla kayıt oldu",
  "token": "JWT_TOKEN",
  "guideId": "GUIDE_ID"
}
```

**Hata Durumları:**
- `409 Conflict` — Bu e-posta adresi zaten kayıtlı
- `400 Bad Request` — Zorunlu alanlar eksik

---

## 2. Rehber Giriş Yapma

**Endpoint:** `POST /api/guides/auth/login`

**Request Body:**
```json
{
  "email": "furkan@example.com",
  "password": "Guvenli123!"
}
```

**Response:** `200 OK` — Rehber başarıyla giriş yaptı
```json
{
  "status": "success",
  "message": "Furkan başarıyla giriş yaptı",
  "token": "JWT_TOKEN",
  "guideId": "GUIDE_ID"
}
```

**Hata Durumları:**
- `401 Unauthorized` — Geçersiz e-posta veya şifre

---

## 3. Rehber Detay Görüntüleme

**Endpoint:** `GET /api/guides/{guideId}`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si

**Authentication:** Gerekli değil

**Response:** `200 OK` — Rehber bilgileri başarıyla getirildi

**Hata Durumları:**
- `404 Not Found` — Rehber bulunamadı

---

## 4. Rehber Bilgilerini Güncelleme

**Endpoint:** `PUT /api/guides/{guideId}`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si

**Request Body:**
```json
{
  "firstName": "Furkan",
  "lastName": "Şahin",
  "phone": "+905559876543",
  "biography": "12 yıllık deneyimli profesyonel tur rehberi",
  "languages": ["Türkçe", "İngilizce", "Almanca"],
  "expertRoutes": ["Kapadokya", "Efes", "Pamukkale"],
  "experienceYears": 12,
  "instagram": "furkan_rehber",
  "linkedin": "https://linkedin.com/in/furkan"
}
```

**Authentication:** Bearer Token gerekli (Sadece kendi profilini güncelleyebilir)

**Response:** `200 OK` — Rehber bilgileri başarıyla güncellendi

**Hata Durumları:**
- `403 Forbidden` — Sadece kendi profilinizi güncelleyebilirsiniz
- `404 Not Found` — Rehber bulunamadı

---

## 5. Rehber Hesabını Silme

**Endpoint:** `DELETE /api/guides/{guideId}`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si

**Authentication:** Bearer Token gerekli (Sadece kendi hesabını silebilir)

**Response:** `200 OK` — Rehber hesabı başarıyla silindi
```json
{
  "status": "success",
  "message": "Kaydınız başarıyla silinmiştir"
}
```

**Hata Durumları:**
- `403 Forbidden` — Sadece kendi hesabınızı silebilirsiniz
- `404 Not Found` — Rehber bulunamadı

---

## 6. Tur Firmalarını Listeleme

**Endpoint:** `GET /api/guides/companies`

**Authentication:** Gerekli değil

**Response:** `200 OK` — Firma listesi başarıyla getirildi
```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "COMPANY_ID",
      "name": "Firma Adı",
      "email": "firma@example.com",
      "phone": "+905551234567",
      "address": "İstanbul, Türkiye",
      "description": "Firma açıklaması",
      "rating": 4.2,
      "tourCount": 15
    }
  ]
}
```

---

## 7. Tur Firmasına Kayıt Olma

**Endpoint:** `POST /api/guides/{guideId}/companies`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si

**Request Body:**
```json
{
  "companyId": "COMPANY_ID"
}
```

**Authentication:** Bearer Token gerekli (Sadece kendi profiline firma kaydedebilir)

**Response:** `201 Created` — Firmaya başarıyla kayıt olundu
```json
{
  "status": "success",
  "message": "Firmaya başarıyla kayıt oldunuz"
}
```

**Hata Durumları:**
- `400 Bad Request` — Eksik companyId
- `403 Forbidden` — Sadece kendi profilinize firma kaydedebilirsiniz
- `404 Not Found` — Rehber veya firma bulunamadı
- `409 Conflict` — Rehber bu firmaya zaten kayıtlı

---

## 8. Tur Firmasından Kayıt Silme

**Endpoint:** `DELETE /api/guides/{guideId}/companies/{companyId}`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si
- `companyId` (string, required) — Firma ID'si

**Authentication:** Bearer Token gerekli (Sadece kendi profilinden firma çıkarabilir)

**Response:** `200 OK` — Firma kaydı başarıyla silindi
```json
{
  "status": "success",
  "message": "Firma kaydınız başarıyla silindi"
}
```

**Hata Durumları:**
- `403 Forbidden` — Sadece kendi profilinizden firma çıkarabilirsiniz
- `404 Not Found` — Rehber bulunamadı veya firma listede yok

---

## 9. Kayıtlı Olduğu Turları Listeleme

**Endpoint:** `GET /api/guides/{guideId}/tours`

**Path Parameters:**
- `guideId` (string, required) — Rehber ID'si

**Authentication:** Bearer Token gerekli (Sadece kendi turlarını görüntüleyebilir)

**Response:** `200 OK` — Rehberin turları başarıyla getirildi
```json
{
  "status": "success",
  "data": [
    {
      "_id": "TOUR_ID",
      "title": "Kapadokya Turu",
      "description": "3 günlük Kapadokya keşif turu",
      "destination": "Kapadokya",
      "price": 5000
    }
  ]
}
```

**Hata Durumları:**
- `403 Forbidden` — Sadece kendi turlarınızı görüntüleyebilirsiniz
- `404 Not Found` — Rehber bulunamadı
