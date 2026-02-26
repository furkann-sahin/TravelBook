# Tüm Gereksinimler 

1. **Kullanıcı Giriş Yapma** ()
   - **API Metodu:** 
   - **Açıklama:** 

2. **Kullanıcı Kayıt Olma** ()
   - **API Metodu:** 
   - **Açıklama:** 

3. **Kullanıcı Kayıt Silme** ()
   - **API Metodu:** 
   - **Açıklama:** 

4. **Kullanıcı Profil Bilgileri** ()
   - **API Metodu:** 
   - **Açıklama:** 

5. **Kullanıcı Şifre Güncelleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

6. **Tüm Turların Listelenmesi** ()
   - **API Metodu:** 
   - **Açıklama:** 

7. **Tur Detayı Gösterme** ()
   - **API Metodu:** 
   - **Açıklama:** 

8. **Tur Şirketi Detay Gösterme** (Recep Arslan)
   - **API Metodu:** `GET /api/companies/{companyID}`
   - **Açıklama:** Kullanıcının seçtiği tur firmasına ait profil bilgileri (firma adı, iletişim bilgileri, puanı, yorumları vb.) görüntülemesi sağlanır.

9. **Tur Filtreleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

10. **Tüm Tur Rehberin Listelenmesi** ()
   - **API Metodu:** 
   - **Açıklama:** 

11. **Tur Rehberi Detayı Gösterme** ()
   - **API Metodu:** 
   - **Açıklama:** 

12. **Tur Satın Alma** ()
   - **API Metodu:** 
   - **Açıklama:** 

13. **Tur Satın Alma İptali** ()
   - **API Metodu:** 
   - **Açıklama:** 

14. **Güncel Turlarım** ()
   - **API Metodu:** 
   - **Açıklama:** 

15. **Favori Tur Listeleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

16. **Favori Tur Ekleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

17. **Favori Tur Silme** ()
   - **API Metodu:** 
   - **Açıklama:** 

18. **Yorum Ekleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

19. **Yorum Güncelleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

20. **Yorum Silme** ()
   - **API Metodu:** 
   - **Açıklama:** 

21. **Tur Firması Giriş Yapma** (Recep Arslan) 
   - **API Metodu:** `POST /api/companies/auth/login`
   - **Açıklama:** Sisteme kayıtlı tur firmalarının kimlik doğrulaması yaparak giriş yapmasını sağlar.
   Gönderilen e-posta/kullanıcı adı ve şifre bilgileri doğrulanır. Başarılı girişte JWT veya benzeri bir erişim token’ı döndürülür.

22. **Tur Firması Kayıt Olma** (Recep Arslan)
   - **API Metodu:** `POST /api/companies/auth/register`
   - **Açıklama:** Yeni bir tur firmasının sisteme kayıt olmasını sağlar. Firma bilgileri doğrulanarak veritabanına kaydedilir.

23. **Tur Firması Kayıt Silme** (Recep Arslan)
   - **API Metodu:** `DELETE /api/companies/{companyID}`
   - **Açıklama:** Tur firmasının hesabının sistemden kalıcı olarak silinmesi sağlanır. Bu işlem yalnızca ilgili firma tarafından yapılabilir ve geri alınamaz.

24. **Tur Firması Tur Listeleme** (Recep Arslan)
   - **API Metodu:** `GET /api/companies/{companyID}/tours`
   - **Açıklama:** Tur firmasının kendi turlarını görmesi sağlanır. Bu sayede bu turlar üzerinden kolayca gerekli işlemler yapılabilir.

25. **Tur Ekleme** (Recep Arslan)
   - **API Metodu:** `POST /api/companies/{companyID}/tours`
   - **Açıklama:** Tur firmasının gerekli bilgileri doldurarak kendisine ait yeni bir tur ekleyebilmesi sağlanır.

26. **Tur Güncelleme** (Recep Arslan)
   - **API Metodu:** `PUT /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Her tur firması yalnızca kendi oluşturduğu turları güncelleyebilir. Tur kontenjanı, fiyat, tarih gibi bilgiler değiştirilebilir. Ayrıca firma kendi katılımcılarını da sisteme ekleyebilir.

27. **Tur Firması Tur Detayı Görüntüleme** (Recep Arslan)
   - **API Metodu:** `GET /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Tur firmasının kendisine ait turların detaylarını görüntülemesi sağlanır. Bu sayede firma tur katılımcı listesi, toplam kontenjan, dolu kontenjan ve kalan kontenjan gibi bilgileri görüntüleyebilir.

28. **Tur Silme** (Recep Arslan)
   - **API Metodu:** `DELETE /api/companies/{companyID}/tours/{tourID}`
   - **Açıklama:** Firma kendisine ait olan bir turu sistemden kalıcı olarak silebilir. Eğer turda aktif katılımcılar bulunuyorsa, ilgili satın alımlar sistem tarafından otomatik olarak iptal edilir.

29. **Rehber Giriş Yapma** ()
   - **API Metodu:** 
   - **Açıklama:** 

30. **Rehber Kayıt Olma** ()
   - **API Metodu:** 
   - **Açıklama:** 

31. **Rehber Kayıt Silme** ()
   - **API Metodu:** 
   - **Açıklama:** 

32. **Rehber Profil Güncelleme** () 
   - **API Metodu:** 
   - **Açıklama:** 

33. **Rehber Tüm Tur Firmaları Listeleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

34. **Rehber Kayıtlı Tur Firmaları Listeleme** ()
   - **API Metodu:** 
   - **Açıklama:** 

35. **Rehber Tur Kaydetme** ()
   - **API Metodu:** 
   - **Açıklama:** 

36. **Rehber Tur Silme** ()
   - **API Metodu:** 
   - **Açıklama:** 

# Gereksinim Dağılımları()

1. [Furkan Fatih Şahin'in Gereksinimleri](Furkan-Fatih-Sahin/Furkan-Fatih-Sahin-Gereksinimler.md)
2. [Recep Arslan'ın Gereksinimleri](Recep-Arslan/Recep-Arslan-Gereksinimler.md)
3. [Beyza Keklikoğlu'nun Gereksinimleri](Beyza-Keklikoglu/Beyza-Keklikoglu-Gereksinimler.md)
4. [Ümmü Fidan'ın Gereksinimleri](Ummu-Fidan/Ummu-Fidan-Gereksinimler.md)
