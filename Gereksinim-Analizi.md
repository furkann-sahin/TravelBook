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

11. **Tur Rehberi Detayı Gösterme** (Furkan Fatih Şahin)
   - **API Metodu:** `GET /api/guides/{guideID}`
   - **Açıklama:** Belirli bir rehberin tüm profesyonel detaylarının (deneyim süresi, aldığı yorumlar, puanı, uzman olduğu rotalar) görüntülenmesini sağlar. Bu sayfa hem rehberin kendi bilgilerini kontrol etmesi hem de tur şirketlerinin uygun rehberi seçerken detaylı inceleme yapması için kullanılır.

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

29. **Rehber Giriş Yapma** (Furkan Fatih Şahin)
   - **API Metodu:**  `POST /api/guides/auth/login`
   - **Açıklama:**  Tur rehberlerinin sisteme kayıtlı e-posta adresleri ve şifreleri ile erişim sağlamasını sağlar. Bu işlem sonucunda rehberin sistemdeki diğer yetkili işlemleri yapabilmesi için bir oturum (token) oluşturulur.

30. **Rehber Kayıt Olma** (Furkan Fatih Şahin)
   - **API Metodu:** `POST /api/guides/auth/register`

   - **Açıklama:** Yeni tur rehberlerinin Travel Book platformuna dahil olmasını sağlar. Kayıt sırasında rehberin adı, soyadı, uzmanlık alanları, bildiği diller ve iletişim bilgileri gibi detaylı veriler toplanır. Veritabanında yeni bir rehber profili oluşturularak rehberin platformda hizmet verebilir hale gelmesi sağlanır.


31. **Rehber Kayıt Silme** (Furkan Fatih Şahin)
   - **API Metodu:** `DELETE/api/guides/{guideID}`

   - **Açıklama:** Tur rehberinin sistemdeki hesabını ve buna bağlı tüm kişisel verilerini kalıcı olarak silmesini sağlar. Kullanıcının "unutulma hakkı" kapsamında sunulan bu özellik, rehberin platformdaki varlığını sonlandırır. Bu işlem geri alınamaz bir işlemdir ve ilgili rehber kimliği  sistemden kaldırılır.

32. **Rehber Profil Güncelleme** (Furkan Fatih Şahin) 
   - **API Metodu:** ` PUT /api/guides/{guideID}`

   - **Açıklama:**Tur rehberinin sistemdeki mevcut profil bilgilerini (biyografi, dil bilgisi, uzmanlık alanları, profil fotoğrafı vb.) güncel tutmasını sağlar. Rehberler deneyim kazandıkça veya iletişim bilgileri değiştikçe bu endpoint üzerinden bilgilerini revize edebilirler. Bu sayede tur şirketleri ve kullanıcılar en güncel verilere ulaşır.
 

33. **Rehber Tüm Tur Firmaları Listeleme** (Furkan Fatih Şahin)
   - **API Metodu:** `GET /api/companies`
   - **Açıklama:** Sistemde kayıtlı olan tüm tur şirketlerinin genel bilgilerinin listelenmesini sağlar. Rehberler, birlikte çalışabilecekleri veya anlaşma yapabilecekleri profesyonel tur firmalarını bu liste üzerinden inceleyebilirler. Bu işlem, rehberler ve şirketler arasındaki iş ağının (networking) kurulmasına yardımcı olur.


34. **Rehber Kayıtlı Tur Firmaları Listeleme** (Furkan Fatih Şahin)
   - **API Metodu:** `GET /api/guides/{guideID}/tours`
   - **Açıklama:**  Tur rehberinin sistem üzerinde daha önce iş birliği yaptığı, rehberlik hizmeti için anlaşıp favorilerine ekleyerek takibe aldığı tur firmalarını görüntülemesini sağlar. Bu özellik, rehberin profesyonel iş ağını yönetmesine ve hangi kurumsal yapılarla aktif bir çalışma ilişkisi içinde olduğunu takip etmesine yardımcı olur. Rehber, bu liste aracılığıyla çalıştığı firmaların profillerine ve sundukları tur fırsatlarına hızlı erişim sağlar.

35. **Rehber Tur Kaydetme** (Furkan Fatih Şahin)
   - **API Metodu:** `POST /api/guides/{guideID}/tours`

   - **Açıklama:** Tur rehberinin belirli bir tur şirketi tarafından oluşturulmuş tura rehberlik hizmeti vermek amacıyla kendisini atamasını veya tura dahil olmasını sağlar. Bu işlem sonucunda rehber ile ilgili tur arasında bir bağ kurulur ve rehber o turun resmi görevlisi olarak sisteme işlenir.

36. **Rehber Tur Silme** (Furkan Fatih Şahin)
   - **API Metodu:** `DELETE /api/guides/{guideID}/tours/{tourID}`

   - **Açıklama:**  Tur rehberinin  kayıt olduğu veya görevlendirildiği bir turdan kaydını silmesini sağlar. Rehberin çalışma programında değişiklik olması veya turun iptal edilmesi gibi durumlarda, rehber ile tur arasındaki ilişki bu işlemle sonlandırılır.

# Gereksinim Dağılımları()

1. [Furkan Fatih Şahin'in Gereksinimleri](Furkan-Fatih-Sahin/Furkan-Fatih-Sahin-Gereksinimler.md)
2. [Recep Arslan'ın Gereksinimleri](Recep-Arslan/Recep-Arslan-Gereksinimler.md)
3. [Beyza Keklikoğlu'nun Gereksinimleri](Beyza-Keklikoglu/Beyza-Keklikoglu-Gereksinimler.md)
4. [Ümmü Fidan'ın Gereksinimleri](Ummu-Fidan/Ummu-Fidan-Gereksinimler.md)
