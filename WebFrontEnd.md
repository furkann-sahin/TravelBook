# Web Front-End Görev Dağılımı

**Web Frontend Adresi:** [travel-book-8ssh.vercel.app](https://travel-book-8ssh.vercel.app)

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Beyza Keklikoğlu'nun Web Frontend Görevleri](Beyza-Keklikoglu/Beyza-Keklikoglu-Web-Frontend-Gorevleri.md)
2. [Furkan Fatih Şahin'in Web Frontend Görevleri](Furkan-Fatih-Sahin/Furkan-Fatih-Sahin-Web-FrontEnd-Gorevleri.md)
3. [Recep Arslan'ın Web Frontend Görevleri](Recep-Arslan/Recep-Arslan-Web-Frontend-Gorevleri.md)
4. [Ümmü Fidan'ın Web Frontend Görevleri](Ummu-Fidan/Ummu-Fidan-Web-Frontend-Gorevleri.md)

---

## Furkan Fatih Şahin'in Web Front-End Sayfaları

### Rehber Panel Sayfaları

| #   | Sayfa                  | Route                 | Açıklama                                                                                     |
| --- | ---------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| 1   | `GuideDashboardPage`   | `/guide`              | Rehber kontrol paneli — hızlı erişim butonları (firmalar, profil, kayıtlı firmalar, turlar). |
| 2   | `GuideCompaniesPage`   | `/guide/companies`    | Sistemdeki tüm tur firmalarını listeleme ve firmaya kayıt olma işlemleri.                    |
| 3   | `GuideToursPage`       | `/guide/tours`        | Kayıtlı firmaların turlarını listeleme ve tura kayıt olma işlemleri.                         |
| 4   | `GuideMyCompaniesPage` | `/guide/my-companies` | Rehberin kayıtlı olduğu firmaların listesi ve firmadan ayrılma işlemi.                       |
| 5   | `GuideMyToursPage`     | `/guide/my-tours`     | Rehberin kayıtlı olduğu turların listesi ve turdan ayrılma işlemi.                           |
| 6   | `GuideProfilePage`     | `/guide/profile`      | Rehber profil görüntüleme/güncelleme, profil resmi yükleme ve hesap silme.                   |

### Rehber Panel Bileşenleri

| #   | Bileşen       | Açıklama                                                |
| --- | ------------- | ------------------------------------------------------- |
| 7   | `GuideNavbar` | Rehber paneli üst navigasyon çubuğu.                    |
| 8   | `GuideFooter` | Rehber paneli alt bilgi bileşeni.                       |
| 9   | `GuideLayout` | Rehber paneli sayfa düzeni (GuideNavbar + GuideFooter). |

### Ortak Sayfa Sekmeleri

| #   | Sayfa                           | Route       | Açıklama                                 |
| --- | ------------------------------- | ----------- | ---------------------------------------- |
| 10  | `LoginPage` (Rehber sekmesi)    | `/login`    | Giriş sayfasındaki rehber giriş sekmesi. |
| 11  | `RegisterPage` (Rehber sekmesi) | `/register` | Kayıt sayfasındaki rehber kayıt sekmesi. |

> **Toplam: 6 sayfa + 2 ortak sekme + 3 bileşen**

---

## Recep Arslan'ın Web Front-End Sayfaları

### Firma Panel Sayfaları

| #   | Sayfa                    | Route                      | Açıklama                                                                                            |
| --- | ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | `CompanyDashboardPage`   | `/company`                 | Firma kontrol paneli — tur sayısı, ortalama puan, yorum sayısı, rehber sayısı istatistikleri.       |
| 2   | `CompanyToursPage`       | `/company/tours`           | Firmaya ait turların listelenmesi.                                                                  |
| 3   | `CreateTourPage`         | `/company/tours/create`    | Yeni tur oluşturma formu (ad, açıklama, fiyat, tarih, kontenjan, konum, görseller, rehber ataması). |
| 4   | `CompanyTourDetailPage`  | `/company/tours/:tourId`   | Tur detayı görüntüleme, güncelleme, silme ve katılımcı listesi.                                     |
| 5   | `CompanyGuidesPage`      | `/company/guides`          | Firmaya kayıtlı rehberlerin listesi.                                                                |
| 6   | `CompanyGuideDetailPage` | `/company/guides/:guideId` | Rehber detay profili (firma perspektifinden).                                                       |
| 7   | `CompanyProfilePage`     | `/company/profile`         | Firma profil görüntüleme/güncelleme, profil resmi, kapak resmi yükleme ve hesap silme.              |

### Firma Panel Bileşenleri

| #   | Bileşen         | Açıklama                                                   |
| --- | --------------- | ---------------------------------------------------------- |
| 8   | `CompanyNavbar` | Firma paneli üst navigasyon çubuğu.                        |
| 9   | `CompanyFooter` | Firma paneli alt bilgi bileşeni.                           |
| 10  | `CompanyLayout` | Firma paneli sayfa düzeni (CompanyNavbar + CompanyFooter). |

### Genel Sayfalar

| #   | Sayfa                         | Route | Açıklama                                                                  |
| --- | ----------------------------- | ----- | ------------------------------------------------------------------------- |
| 11  | `HomePage` (istatistik kısmı) | `/`   | Ana sayfadaki platform istatistikleri (toplam tur, firma, rehber sayısı). |

### Ortak Sayfa Sekmeleri

| #   | Sayfa                          | Route       | Açıklama                                |
| --- | ------------------------------ | ----------- | --------------------------------------- |
| 12  | `LoginPage` (Firma sekmesi)    | `/login`    | Giriş sayfasındaki firma giriş sekmesi. |
| 13  | `RegisterPage` (Firma sekmesi) | `/register` | Kayıt sayfasındaki firma kayıt sekmesi. |

> **Toplam: 7 sayfa + 1 genel sayfa kısmı + 2 ortak sekme + 3 bileşen**

---

## Beyza Keklikoğlu'nun Web Front-End Sayfaları

### Kullanıcı Profil Sayfaları

| #   | Sayfa             | Route           | Açıklama                                                                          |
| --- | ----------------- | --------------- | --------------------------------------------------------------------------------- |
| 1   | `UserProfilePage` | `/user/profile` | Kullanıcı profil görüntüleme, profil güncelleme, şifre değiştirme ve hesap silme. |

### Tur Sayfaları

| #   | Sayfa                         | Route                 | Açıklama                                                   |
| --- | ----------------------------- | --------------------- | ---------------------------------------------------------- |
| 2   | `ToursPage` (listeleme kısmı) | `/user/tours`         | Sistemdeki tüm turların listelenmesi.                      |
| 3   | `TourDetailPage`              | `/user/tours/:tourId` | Tur detayı görüntüleme, yorum ekleme, güncelleme ve silme. |

### Seyahat Sayfaları

| #   | Sayfa               | Route                      | Açıklama                                                           |
| --- | ------------------- | -------------------------- | ------------------------------------------------------------------ |
| 4   | `UserPurchasesPage` | `/users/:userId/purchases` | Kullanıcının geçmiş ve gelecek satın aldığı turların listelenmesi. |

> **Toplam: 4 sayfa**

---

## Ümmü Fidan'ın Web Front-End Sayfaları

### Kimlik Doğrulama Sayfaları

| #   | Sayfa                              | Route       | Açıklama                                              |
| --- | ---------------------------------- | ----------- | ----------------------------------------------------- |
| 1   | `LoginPage` (Kullanıcı sekmesi)    | `/login`    | 3 sekmeli giriş sayfası (Kullanıcı / Firma / Rehber). |
| 2   | `RegisterPage` (Kullanıcı sekmesi) | `/register` | 3 sekmeli kayıt sayfası (Kullanıcı / Firma / Rehber). |

### Tur Sayfaları

| #   | Sayfa                                       | Route         | Açıklama                                                            |
| --- | ------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| 3   | `ToursPage` (filtreleme + satın alma kısmı) | `/user/tours` | Tur filtreleme (konum, tarih, fiyat) ve satın alma/iptal işlemleri. |

### Rehber Sayfaları

| #   | Sayfa       | Route     | Açıklama                                                        |
| --- | ----------- | --------- | --------------------------------------------------------------- |
| 4   | `GuideList` | `/guides` | Tüm tur rehberlerinin listesi (ad, email, uzmanlık, dil, puan). |

### Favori Sayfaları

| #   | Sayfa           | Route             | Açıklama                                                   |
| --- | --------------- | ----------------- | ---------------------------------------------------------- |
| 5   | `FavoritesList` | `/user/favorites` | Favori turlar listesi, favoriye ekleme ve favoriden silme. |

> **Toplam: 5 sayfa**

---

## Ortak Sayfalar ve Bileşenler

### Genel Sayfalar

| #   | Sayfa          | Route    | Açıklama                                                                             |
| --- | -------------- | -------- | ------------------------------------------------------------------------------------ |
| 1   | `HomePage`     | `/`      | Ana sayfa — hero bölümü, rol tanıtımı, popüler turlar, istatistikler, nasıl çalışır. |
| 2   | `AboutPage`    | `/about` | Hakkımızda — ekip tanıtımı, platform özellikleri, istatistikler.                     |
| 3   | `NotFoundPage` | `*`      | 404 bulunamadı sayfası.                                                              |

### Ortak Bileşenler

| #   | Bileşen      | Açıklama                                                                                        |
| --- | ------------ | ----------------------------------------------------------------------------------------------- |
| 4   | `Navbar`     | Responsive ana navigasyon çubuğu — scroll efekti, rol bazlı menü.                               |
| 5   | `Footer`     | Ana alt bilgi bileşeni — rol bazlı linkler.                                                     |
| 6   | `TourCard`   | Yeniden kullanılabilir tur kartı — görsel, fiyat, tarih, puan, satın al/iptal/favori butonları. |
| 7   | `MainLayout` | Ana sayfa düzeni (Navbar + Footer).                                                             |
