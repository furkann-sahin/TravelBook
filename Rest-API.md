# REST API Görev Dağılımı

**REST API Adresi:** [travel-book-eosin.vercel.app](https://travel-book-eosin.vercel.app)

## Furkan Fatih Şahin'in REST API Metotları

### Rehber Kimlik Doğrulama

| #   | Metot  | Endpoint                    | Açıklama                                                  |
| --- | ------ | --------------------------- | --------------------------------------------------------- |
| 1   | `POST` | `/api/guides/auth/login`    | Tur rehberlerinin sisteme giriş yapmasını sağlar.         |
| 2   | `POST` | `/api/guides/auth/register` | Yeni tur rehberlerinin platformaya kayıt olmasını sağlar. |

### Rehber Profil İşlemleri

| #   | Metot    | Endpoint                              | Açıklama                                                                   |
| --- | -------- | ------------------------------------- | -------------------------------------------------------------------------- |
| 3   | `GET`    | `/api/guides/{guideId}`               | Belirli bir rehberin tüm profesyonel detaylarının görüntülenmesini sağlar. |
| 4   | `PUT`    | `/api/guides/{guideId}`               | Tur rehberinin profil bilgilerini güncellemesini sağlar.                   |
| 5   | `DELETE` | `/api/guides/{guideId}`               | Tur rehberinin hesabını sistemden kalıcı olarak silmesini sağlar.          |
| 6   | `POST`   | `/api/guides/{guideId}/profile-image` | Tur rehberinin profil resmini yüklemesini sağlar. (Maks. 5MB)              |

### Rehber Tur İşlemleri

| #   | Metot    | Endpoint                               | Açıklama                                                                          |
| --- | -------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| 7   | `GET`    | `/api/guides/{guideId}/tours`          | Tur rehberinin kayıtlı olduğu turları listelemesini sağlar.                       |
| 8   | `POST`   | `/api/guides/{guideId}/tours`          | Tur rehberinin bir tura rehberlik hizmeti vermek için kendisini atamasını sağlar. |
| 9   | `DELETE` | `/api/guides/{guideId}/tours/{tourId}` | Tur rehberinin kayıt olduğu bir turdan kaydını silmesini sağlar.                  |

### Rehber Firma İşlemleri

| #   | Metot    | Endpoint                                      | Açıklama                                                        |
| --- | -------- | --------------------------------------------- | --------------------------------------------------------------- |
| 10  | `GET`    | `/api/guides/companies`                       | Sistemde kayıtlı tüm tur firmalarının listelenmesini sağlar.    |
| 11  | `GET`    | `/api/guides/{guideId}/companies`             | Rehberin kayıtlı olduğu tur firmalarını görüntülemesini sağlar. |
| 12  | `POST`   | `/api/guides/{guideId}/companies`             | Rehberin belirtilen bir tur firmasına kayıt olmasını sağlar.    |
| 13  | `DELETE` | `/api/guides/{guideId}/companies/{companyId}` | Rehberin kayıtlı olduğu bir firmadan ayrılmasını sağlar.        |

> **Toplam: 13 endpoint**

---

## Recep Arslan'ın REST API Metotları

### Tur Firması Kimlik Doğrulama

| #   | Metot  | Endpoint                       | Açıklama                                               |
| --- | ------ | ------------------------------ | ------------------------------------------------------ |
| 1   | `POST` | `/api/companies/auth/login`    | Tur firmalarının sisteme giriş yapmasını sağlar.       |
| 2   | `POST` | `/api/companies/auth/register` | Yeni bir tur firmasının sisteme kayıt olmasını sağlar. |

### Tur Firması Profil İşlemleri

| #   | Metot    | Endpoint                                   | Açıklama                                                          |
| --- | -------- | ------------------------------------------ | ----------------------------------------------------------------- |
| 3   | `GET`    | `/api/companies/{companyId}`               | Tur firmasına ait profil bilgilerinin görüntülenmesini sağlar.    |
| 4   | `PUT`    | `/api/companies/{companyId}`               | Tur firmasının profil bilgilerini güncellemesini sağlar.          |
| 5   | `DELETE` | `/api/companies/{companyId}`               | Tur firmasının hesabını sistemden kalıcı olarak silmesini sağlar. |
| 6   | `POST`   | `/api/companies/{companyId}/profile-image` | Tur firmasının profil resmini yüklemesini sağlar. (Maks. 5MB)     |
| 7   | `POST`   | `/api/companies/{companyId}/banner-image`  | Tur firmasının kapak resmini yüklemesini sağlar. (Maks. 5MB)      |

### Tur Firması Tur İşlemleri

| #   | Metot    | Endpoint                                    | Açıklama                                                       |
| --- | -------- | ------------------------------------------- | -------------------------------------------------------------- |
| 8   | `GET`    | `/api/companies/{companyId}/tours`          | Tur firmasının kendi turlarını listelemesini sağlar.           |
| 9   | `POST`   | `/api/companies/{companyId}/tours`          | Tur firmasının yeni bir tur eklemesini sağlar.                 |
| 10  | `GET`    | `/api/companies/{companyId}/tours/{tourId}` | Tur firmasının bir turunun detaylarını görüntülemesini sağlar. |
| 11  | `PUT`    | `/api/companies/{companyId}/tours/{tourId}` | Tur firmasının bir turunu güncellemesini sağlar.               |
| 12  | `DELETE` | `/api/companies/{companyId}/tours/{tourId}` | Tur firmasının bir turunu silmesini sağlar.                    |

### Firma Rehber İşlemleri

| #   | Metot | Endpoint                            | Açıklama                             |
| --- | ----- | ----------------------------------- | ------------------------------------ |
| 13  | `GET` | `/api/companies/{companyId}/guides` | Firmaya kayıtlı rehberleri listeler. |

### Platform İstatistikleri

| #   | Metot | Endpoint           | Açıklama                                                            |
| --- | ----- | ------------------ | ------------------------------------------------------------------- |
| 14  | `GET` | `/api/tours/stats` | Platformdaki toplam kullanıcı, tur, firma ve rehber sayısını döner. |

> **Toplam: 14 endpoint**

---

## Beyza Keklikoğlu'nun REST API Metotları

### Kullanıcı Profil İşlemleri

| #   | Metot    | Endpoint                       | Açıklama                                                  |
| --- | -------- | ------------------------------ | --------------------------------------------------------- |
| 1   | `GET`    | `/api/users/{userId}`          | Kullanıcının profil bilgilerinin görüntülenmesini sağlar. |
| 2   | `PUT`    | `/api/users/{userId}`          | Kullanıcının profil bilgilerini güncellemesini sağlar.    |
| 3   | `PUT`    | `/api/users/{userId}/password` | Kullanıcının şifresini güncellemesini sağlar.             |
| 4   | `DELETE` | `/api/users/{userId}`          | Kullanıcının hesabını sistemden silmesini sağlar.         |

### Tur İşlemleri

| #   | Metot | Endpoint              | Açıklama                                                        |
| --- | ----- | --------------------- | --------------------------------------------------------------- |
| 5   | `GET` | `/api/tours`          | Sistemdeki tüm turların listelenmesini sağlar.                  |
| 6   | `GET` | `/api/tours/{tourId}` | Seçilen bir turun detaylı bilgilerinin görüntülenmesini sağlar. |

### Seyahat İşlemleri

| #   | Metot | Endpoint                        | Açıklama                                                      |
| --- | ----- | ------------------------------- | ------------------------------------------------------------- |
| 7   | `GET` | `/api/users/{userId}/purchases` | Kullanıcının geçmiş ve gelecek satın aldığı turları listeler. |

### Yorum İşlemleri

| #   | Metot    | Endpoint                      | Açıklama                                                     |
| --- | -------- | ----------------------------- | ------------------------------------------------------------ |
| 8   | `POST`   | `/api/tours/{tourId}/reviews` | Kullanıcının bir tur hakkında yorum yapmasını sağlar.        |
| 9   | `PUT`    | `/api/reviews/{reviewId}`     | Kullanıcının daha önce yaptığı yorumu güncellemesini sağlar. |
| 10  | `DELETE` | `/api/reviews/{reviewId}`     | Kullanıcının daha önce yaptığı yorumu silmesini sağlar.      |

> **Toplam: 10 endpoint**

---

## Ümmü Fidan'ın REST API Metotları

### Kullanıcı Kimlik Doğrulama

| #   | Metot  | Endpoint                   | Açıklama                                         |
| --- | ------ | -------------------------- | ------------------------------------------------ |
| 1   | `POST` | `/api/users/auth/login`    | Kullanıcının sisteme giriş yapmasını sağlar.     |
| 2   | `POST` | `/api/users/auth/register` | Yeni kullanıcının sisteme kayıt olmasını sağlar. |

### Tur Filtreleme

| #   | Metot | Endpoint                 | Açıklama                                                                      |
| --- | ----- | ------------------------ | ----------------------------------------------------------------------------- |
| 3   | `GET` | `/api/tours?param=value` | Turların tarih, fiyat veya konum gibi kriterlere göre filtrelenmesini sağlar. |

### Tur Rehberleri

| #   | Metot | Endpoint      | Açıklama                                        |
| --- | ----- | ------------- | ----------------------------------------------- |
| 4   | `GET` | `/api/guides` | Sistemde kayıtlı tüm tur rehberlerini listeler. |

### Tur Satın Alma İşlemleri

| #   | Metot    | Endpoint                              | Açıklama                                                  |
| --- | -------- | ------------------------------------- | --------------------------------------------------------- |
| 5   | `POST`   | `/api/users/tours/{tourId}/purchases` | Kullanıcının seçtiği bir turu satın almasını sağlar.      |
| 6   | `DELETE` | `/api/users/purchases/{purchaseId}`   | Kullanıcının satın aldığı bir turu iptal etmesini sağlar. |

### Favori İşlemleri

| #   | Metot    | Endpoint                                 | Açıklama                                                    |
| --- | -------- | ---------------------------------------- | ----------------------------------------------------------- |
| 7   | `GET`    | `/api/users/{userId}/favorites`          | Kullanıcının favorilerine eklediği turları listeler.        |
| 8   | `POST`   | `/api/users/{userId}/favorites`          | Kullanıcının bir turu favori listesine eklemesini sağlar.   |
| 9   | `DELETE` | `/api/users/{userId}/favorites/{tourId}` | Kullanıcının favori listesindeki bir turu silmesini sağlar. |

> **Toplam: 9 endpoint**

---

## Grup Üyelerinin REST API Metotları

1. [Furkan Fatih Şahin'in REST API Metotları](Furkan-Fatih-Sahin/Furkan-Fatih-Sahin-Rest-API-Gorevleri.md)
2. [Recep Arslan'ın REST API Metotları](Recep-Arslan/Recep-Arslan-Rest-API-Gorevleri.md)
3. [Beyza Keklikoğlu'nun REST API Metotları](Beyza-Keklikoglu/Beyza-Keklikoglu-Rest-API-Gorevleri.md)
4. [Ümmü Fidan'ın REST API Metotları](Ummu-Fidan/Ummu-Fidan-Rest-API-Gorevleri.md)
