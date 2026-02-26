1. **Tur Firması Giriş Yapma**
   - **API Metodu:** `POST /api/companies/auth/login`
   - **Açıklama:** Sisteme kayıtlı tur firmalarının kimlik doğrulaması yaparak giriş yapmasını sağlar.
   Gönderilen e-posta/kullanıcı adı ve şifre bilgileri doğrulanır. Başarılı girişte JWT veya benzeri bir erişim token’ı döndürülür.

2. **Tur Firması Kayıt Olma**
   - **API Metodu:** `POST /api/companies/auth/register`
   - **Açıklama:** Yeni bir tur firmasının sisteme kayıt olmasını sağlar. Firma bilgileri doğrulanarak veritabanına kaydedilir.

3. **Tur Firması Kayıt Silme**
   - **API Metodu:** `DELETE /api/companies/{companyID}`
   - **Açıklama:** Tur firmasının hesabının sistemden kalıcı olarak silinmesi sağlanır. Bu işlem yalnızca ilgili firma tarafından yapılabilir ve geri alınamaz.

4. **Tur Firması Tur Listeleme**
   - **API Metodu:** `GET /api/companies/{companyID}/tours`
   - **Açıklama:** Tur firmasının kendi turlarını görmesi sağlanır. Bu sayede bu turlar üzerinden kolayca gerekli işlemler yapılabilir.

5. **Tur Ekleme**
   - **API Metodu:** `POST /api/companies/{companyID}/tours`
   - **Açıklama:** Tur firmasının gerekli bilgileri doldurarak kendisine ait yeni bir tur ekleyebilmesi sağlanır.

6. **Tur Güncelleme**
   - **API Metodu:** `PUT /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Her tur firması yalnızca kendi oluşturduğu turları güncelleyebilir. Tur kontenjanı, fiyat, tarih gibi bilgiler değiştirilebilir. Ayrıca firma kendi katılımcılarını da sisteme ekleyebilir.

7. **Tur Firması Tur Detayı Görüntüleme**
   - **API Metodu:** `GET /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Tur firmasının kendisine ait turların detaylarını görüntülemesi sağlanır. Bu sayede firma tur katılımcı listesi, toplam kontenjan, dolu kontenjan ve kalan kontenjan gibi bilgileri görüntüleyebilir.

8. **Tur Silme**
   - **API Metodu:** `DELETE /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Firma kendisine ait olan bir turu sistemden kalıcı olarak silebilir. Eğer turda aktif katılımcılar bulunuyorsa, ilgili satın alımlar sistem tarafından otomatik olarak iptal edilir.

9. **Tur Şirketi Detay Gösterme**
   - **API Metodu:** `GET /api/companies/{companyID}`
   - **Açıklama:** Kullanıcının seçtiği tur firmasına ait profil bilgileri (firma adı, iletişim bilgileri, puanı, yorumları vb.) görüntülemesi sağlanır.