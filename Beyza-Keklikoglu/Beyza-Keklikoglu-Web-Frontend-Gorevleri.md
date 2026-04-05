# Beyza Keklikoğlu'nun Web Frontend Görevleri

**Front-end Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Kullanıcı Hesap Silme (UserProfilePage)
- **API Endpoint:** `DELETE /api/users/{userId}`
- **Görev:** Kullanıcının kendi hesabını güvenli şekilde kalıcı olarak silebilmesi için arayüzün tasarımı ve implementasyonu
- **UI Bileşenleri:**
	- `Hesabı Sil` butonu (outlined, error)
	- Onay Dialog bileşeni
	- Uyarı metni: "Bu işlem geri alınamaz"
	- `İptal` ve `Evet, Sil` aksiyon butonları
	- Loading durumu (buton disable + CircularProgress)
	- Hata ve başarı mesajları için Alert/Snackbar
- **Kullanıcı Deneyimi:**
	- Yanlışlıkla silmeyi önlemek için onay adımı
	- Başarılı silme sonrası oturumu kapatıp giriş/ana sayfaya yönlendirme
- **Teknik Detaylar:**
	- Auth kontrolü: kullanıcı yalnızca kendi hesabını silebilir
	- `userApi.deleteAccount(userId)` çağrısı
	- State: `deleteOpen`, `deleteLoading`, `deleteError`

## 2. Kullanıcı Şifre Güncelleme (UserProfilePage)
- **API Endpoint:** `PUT /api/users/{userId}/password`
- **Görev:** Kullanıcının mevcut şifre doğrulamasıyla yeni şifre belirleyebileceği form yapısının implementasyonu
- **UI Bileşenleri:**
	- Mevcut Şifre input alanı (`type="password"`)
	- Yeni Şifre input alanı (`type="password"`)
	- Yeni Şifre Tekrar input alanı (`type="password"`)
	- Şifre görünürlük toggle (opsiyonel)
	- `Şifreyi Güncelle` butonu
	- Error Alert + Success Snackbar
- **Form Validasyonu:**
	- Tüm alanlar zorunlu
	- Yeni şifre ve tekrar alanı eşleşmeli
	- Minimum şifre uzunluğu kontrolü
- **Teknik Detaylar:**
	- `userApi.updatePassword(userId, { oldPassword, newPassword })`
	- State: `oldPassword`, `newPassword`, `confirmPassword`, `loading`, `error`

## 3. Tüm Turların Listelenmesi (ToursPage)
- **API Endpoint:** `GET /api/tours?param=value`
- **Görev:** Sistemdeki tüm turları filtreli/filtersiz şekilde listeleyen kullanıcı sayfasının tasarımı ve implementasyonu
- **UI Bileşenleri:**
	- Sayfa başlığı (`Turları Keşfet`)
	- Filtre alanları: tur adı, konum, fiyat aralığı, tarih
	- `Ara` ve `Temizle` butonları
	- Tur kartı listesi (görsel, ad, konum, tarih, fiyat)
	- `Tur Detayı` butonu
	- Loading indicator ve Error Alert
- **Kullanıcı Deneyimi:**
	- Filtre verilmezse tüm turlar listelenir
	- Filtre verilirse sonuçlar daraltılır
- **Teknik Detaylar:**
	- `tourApi.getTours(filters)`
	- State: `tours`, `filters`, `loading`, `error`, `hasSearched`

## 4. Tur Detayı Gösterme (TourDetailPage)
- **API Endpoint:** `GET /api/tours/{tourId}`
- **Görev:** Seçilen turun tüm detaylarını kullanıcıya gösterecek detay sayfasının implementasyonu
- **UI Bileşenleri:**
	- Hero görsel alanı + tur başlığı
	- `Tur Açıklaması` bölümü
	- `Gezilecek Yerler` bölümü (liste)
	- `Fiyata Dahil Olanlar` bölümü (liste)
	- Tarih, rota, fiyat ve firma bilgileri
	- Yorumlar alanı
- **Kullanıcı Deneyimi:**
	- Tur kartındaki `Tur Detayı` butonundan `/tours/{tourId}` sayfasına yönlendirme
	- Veri yoksa kullanıcıya bilgilendirici boş durum metni
- **Teknik Detaylar:**
	- `tourApi.getTourDetail(tourId)`
	- State: `tour`, `reviews`, `loading`, `error`

## 5. Seyahatlerim (UserPurchasesPage)
- **API Endpoint:** `GET /api/users/{userId}/purchases?status=past|future`
- **Görev:** Kullanıcının geçmiş ve gelecek satın aldığı turları sekmeli yapıda görüntüleme
- **UI Bileşenleri:**
	- Sayfa başlığı (`Seyahatlerim`)
	- Sekme/Toggle: `Geçmiş` ve `Gelecek`
	- Satın alınan tur kartları
	- Boş durum metni
	- `Tur Detayı` butonu
- **Kullanıcı Deneyimi:**
	- Yalnızca giriş yapmış kullanıcı kendi seyahatlerini görür
	- Seçilen sekmeye göre hızlı filtreleme
- **Teknik Detaylar:**
	- `userApi.getPurchases(userId, status)`
	- State: `status`, `purchases`, `loading`, `error`

## 6. Kullanıcı Profil Bilgileri (UserProfilePage)
- **API Endpoint:** `GET /api/users/{userId}`
- **Görev:** Kullanıcının profil bilgilerini görüntüleyen profil ekranının implementasyonu
- **UI Bileşenleri:**
	- Profil kartı
	- Bilgi alanları: ad, email, telefon vb.
	- `Profili Düzenle` butonu (varsa)
	- `Seyahatlerim` butonu
- **Kullanıcı Deneyimi:**
	- Yetkisiz erişimde login yönlendirmesi
	- Profil bilgilerine hızlı erişim
- **Teknik Detaylar:**
	- `userApi.getProfile(userId)`
	- State: `profile`, `loading`, `error`, `editing`

## 7. Yorum Ekleme (TourDetailPage)
- **API Endpoint:** `POST /api/tours/{tourId}/reviews`
- **Görev:** Kullanıcının tur detay sayfasından yorum ve puan ekleyebilmesi
- **UI Bileşenleri:**
	- Rating bileşeni
	- Yorum metin alanı (multiline)
	- `Yorum Yap` butonu
	- Error/Success Alert
- **Form Validasyonu:**
	- Puan zorunlu (`1-5`)
	- Yorum metni boş olamaz
- **Teknik Detaylar:**
	- `reviewApi.createReview(tourId, data)`
	- State: `reviewForm`, `reviewLoading`, `reviewError`, `reviewSuccess`

## 8. Yorum Güncelleme (TourDetailPage)
- **API Endpoint:** `PUT /api/reviews/{reviewId}`
- **Görev:** Kullanıcının kendi yorumunu düzenleyebilmesini sağlayan akışın implementasyonu
- **UI Bileşenleri:**
	- `Düzenle` ikon butonu
	- Düzenleme modunda yorum formu
	- `Güncelle` ve `İptal` butonları
- **Kullanıcı Deneyimi:**
	- Sadece kullanıcının kendi yorumunda düzenleme aksiyonu görünür
	- Güncelleme sonrası liste anında yenilenir
- **Teknik Detaylar:**
	- `reviewApi.updateReview(reviewId, data)`
	- State: `editingReviewId`, `reviewForm`, `reviewLoading`

## 9. Yorum Silme (TourDetailPage)
- **API Endpoint:** `DELETE /api/reviews/{reviewId}`
- **Görev:** Kullanıcının kendi yorumunu kalıcı olarak silebilmesi için silme akışının implementasyonu
- **UI Bileşenleri:**
	- `Sil` ikon butonu
	- Silme onay penceresi (confirm)
	- Sonuç bildirimi (Alert/Snackbar)
- **Kullanıcı Deneyimi:**
	- Yalnızca kendi yorumlarında silme aksiyonu
	- Başarılı silmede yorumun listeden anında kaldırılması
- **Teknik Detaylar:**
	- `reviewApi.deleteReview(reviewId)`
	- State: `reviewLoading`, `reviewSuccess`, `reviewError`