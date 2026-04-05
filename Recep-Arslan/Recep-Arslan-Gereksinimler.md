1. **Tur Firması Giriş Yapma**
   - **API Metodu:** `POST /api/companies/auth/login`
   - **Açıklama:** Sisteme kayıtlı tur firmalarının kimlik doğrulaması yaparak giriş yapmasını sağlar. Gönderilen e-posta/kullanıcı adı ve şifre bilgileri doğrulanır. Başarılı girişte JWT veya benzeri bir erişim token'ı döndürülür.

2. **Tur Firması Kayıt Olma**
   - **API Metodu:** `POST /api/companies/auth/register`
   - **Açıklama:** Yeni bir tur firmasının sisteme kayıt olmasını sağlar. Firma bilgileri doğrulanarak veritabanına kaydedilir.

3. **Tur Firması Kayıt Silme**
   - **API Metodu:** `DELETE /api/companies/{companyId}`
   - **Açıklama:** Tur firmasının hesabının sistemden kalıcı olarak silinmesi sağlanır. Bu işlem yalnızca ilgili firma tarafından yapılabilir ve geri alınamaz.

4. **Tur Firması Tur Listeleme**
   - **API Metodu:** `GET /api/companies/{companyId}/tours`
   - **Açıklama:** Tur firmasının kendi turlarını görmesi sağlanır. Bu sayede bu turlar üzerinden kolayca gerekli işlemler yapılabilir.

5. **Tur Ekleme**
   - **API Metodu:** `POST /api/companies/{companyId}/tours`
   - **Açıklama:** Tur firmasının gerekli bilgileri doldurarak kendisine ait yeni bir tur ekleyebilmesi sağlanır.

6. **Tur Güncelleme**
   - **API Metodu:** `PUT /api/companies/{companyId}/tours/{tourId}`
   - **Açıklama:** Her tur firması yalnızca kendi oluşturduğu turları güncelleyebilir. Tur kontenjanı, fiyat, tarih gibi bilgiler değiştirilebilir. Ayrıca firma kendi katılımcılarını da sisteme ekleyebilir.

7. **Tur Firması Tur Detayı Görüntüleme**
   - **API Metodu:** `GET /api/companies/{companyId}/tours/{tourId}`
   - **Açıklama:** Tur firmasının kendisine ait turların detaylarını görüntülemesi sağlanır. Bu sayede firma tur katılımcı listesi, toplam kontenjan, dolu kontenjan ve kalan kontenjan gibi bilgileri görüntüleyebilir.

8. **Tur Silme**
   - **API Metodu:** `DELETE /api/companies/{companyId}/tours/{tourId}`
   - **Açıklama:** Firma kendisine ait olan bir turu sistemden kalıcı olarak silebilir. Eğer turda aktif katılımcılar bulunuyorsa, ilgili satın alımlar sistem tarafından otomatik olarak iptal edilir.

9. **Tur Şirketi Detay Gösterme**
   - **API Metodu:** `GET /api/companies/{companyId}`
   - **Açıklama:** Kullanıcının seçtiği tur firmasına ait profil bilgileri (firma adı, iletişim bilgileri, puanı, yorumları vb.) görüntülemesi sağlanır.

10. **Tur Firması Profil Güncelleme**
    - **API Metodu:** `PUT /api/companies/{companyId}`
    - **Açıklama:** Tur firmasının kendi profil bilgilerini (firma adı, telefon, adres, açıklama, instagram, linkedin) güncellemesini sağlar. Firma yalnızca kendi profilini güncelleyebilir.

11. **Tur Firması Profil Resmi Yükleme**
    - **API Metodu:** `POST /api/companies/{companyId}/profile-image`
    - **Açıklama:** Tur firmasının profil resmini yüklemesini sağlar. Maksimum 5MB boyutunda jpeg, jpg, png veya webp formatında resim yüklenebilir. Firma yalnızca kendi profil resmini yükleyebilir.

12. **Tur Firması Kapak Resmi Yükleme**
    - **API Metodu:** `POST /api/companies/{companyId}/banner-image`
    - **Açıklama:** Tur firmasının kapak (banner) resmini yüklemesini sağlar. Maksimum 5MB boyutunda jpeg, jpg, png veya webp formatında resim yüklenebilir. Firma yalnızca kendi kapak resmini yükleyebilir.

13. **Firma Kayıtlı Rehberlerini Listeleme**
    - **API Metodu:** `GET /api/companies/{companyId}/guides`
    - **Açıklama:** Firmaya kayıtlı olan rehberleri listeler. Bu özellik firma tarafından tur oluşturulurken rehber ataması yapmak için kullanılır. Yalnızca firma sahibi kendi kayıtlı rehberlerini görüntüleyebilir.

14. **Platform İstatistikleri**
    - **API Metodu:** `GET /api/tours/stats`
    - **Açıklama:** Platformdaki toplam kullanıcı sayısı, tur sayısı, firma sayısı ve rehber sayısını döner. Ana sayfada istatistik gösterimi için kullanılır. Public erişime açıktır.