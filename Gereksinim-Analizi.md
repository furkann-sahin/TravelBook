# Tüm Gereksinimler 

1. **Kullanıcı Giriş Yapma** (Ümmü Fidan)
    - **API Metodu:** `POST /api/users/auth/login`
    - **Açıklama:** Kullanıcının sisteme e-posta ve şifre bilgileri ile giriş yapmasını sağlar. Doğru bilgiler girildiğinde kullanıcı sisteme başarılı bir şekilde giriş yapar ve oturum başlatılır.Hatalı bilgiler girildiğinde giriş işlemi başarısız olur ve kullanıcıya hata mesajı gösterilir. Güvenlik için e-posta ve şifre doğrulaması yapılır.

2. **Kullanıcı Kayıt Olma** (Ümmü Fidan)
    - **API Metodu:** `POST /api/users/auth/register`
    - **Açıklama:** Yeni kullanıcının sisteme kayıt olmasını sağlar. Kullanıcı ad, soyad, e-posta ve şifre gibi gerekli bilgileri girerek hesap oluşturur. Kayıt işlemi başarılı olduğunda kullanıcı sisteme giriş yapabilir.

3. **Kullanıcı Kayıt Silme** (Beyza Keklikoğlu)
    - **API Metodu:** `DELETE /api/users/{userId}`
    - **Açıklama:** Kimliği doğrulanmış kullanıcının kendi hesabını sistemden silmesini sağlar. İşlem geri alınamaz. Silme işlemi sırasında kullanıcıya ait ilişkili verilerin (yorumlar, satın almalar vb.) sistemden silinmesi sağlanır. Kullanıcı yalnızca kendi hesabını silebilir.

4. **Kullanıcı Profil Bilgileri** (Beyza Keklikoğlu)
    - **API Metodu:**  `GET /api/users/{userId}`
    - **Açıklama:**  Kullanıcının isim, soyisim, cinsiyet ve yaşadığı yer gibi bilgilerin görüntülenmesini sağlar.Sadece giriş yapmış kullanıcılar kendi profil bilgilerini görüntüleyebilir.

5. **Kullanıcı Şifre Güncelleme** (Beyza Keklikoğlu)
    - **API Metodu:** `PUT /api/users/{userId}/password`
    - **Açıklama:** Kullanıcının mevcut şifresini değiştirerek yeni bir şifre belirlemesini sağlar. Kullanıcıdan mevcut şifre ve yeni şifre bilgisi alınır.Sadece giriş yapmış kullanıcılar kendi şifrelerini güncelleyebilir.

6. **Tüm Turların Listelenmesi** (Beyza Keklikoğlu)
    - **API Metodu:** `GET /api/tours?param=value`
    - **Açıklama:** Sistemde mevcut olan tüm turların listelenmesini sağlar. Kullanıcılar tur adı, fiyat, tarih ve konum gibi temel bilgileri görüntüleyebilir. Bu özellik, kullanıcıların mevcut turları keşfetmesine olanak tanır.

7. **Tur Detayı Gösterme** (Beyza Keklikoğlu)
    - **API Metodu:** `GET /api/tours/{tourId}`
    - **Açıklama:**  Seçilen bir turun detaylı bilgilerinin görüntülenmesini sağlar. Kullanıcılar tur açıklaması, gezilecek yerler, fiyat, konum, tarih, görseller ve diğer detayları inceleyebilir. 

8. **Tur Şirketi Detay Gösterme** (Recep Arslan)
    - **API Metodu:** `GET /api/companies/{companyId}`
    - **Açıklama:** Kullanıcının seçtiği tur firmasına ait profil bilgileri (firma adı, iletişim bilgileri, puanı, yorumları vb.) görüntülemesi sağlanır.

9. **Tur Filtreleme** (Ümmü Fidan)
    - **API Metodu:** `GET /api/tours?param=value`
    - **Açıklama:** Sistemde bulunan turların tarih, fiyat veya konum gibi kriterlere göre filtrelenmesini sağlar. Kullanıcı istediği filtre parametrelerini girerek uygun turları listeleyebilir. Filtre uygulanmadığında tüm turlar görüntülenir. Bu özellik kullanıcıların aradıkları tura daha kolay ulaşmasını sağlar.

10. **Tüm Tur Rehberlerinin Listelenmesi** (Ümmü Fidan)
    - **API Metodu:** `GET /api/guides`
    - **Açıklama:** Sistemde kayıtlı tur rehberlerini listeler. Kullanıcılar bu liste sayesinde rehberler hakkında bilgi alarak tercih yapabilir.

11. **Tur Rehberi Detayı Gösterme** (Furkan Fatih Şahin)
    - **API Metodu:** `GET /api/guides/{guideId}`
    - **Açıklama:** Belirli bir rehberin tüm profesyonel detaylarının (deneyim süresi, aldığı yorumlar, puanı, uzman olduğu rotalar) görüntülenmesini sağlar. Bu sayfa hem rehberin kendi bilgilerini kontrol etmesi hem de tur şirketlerinin uygun rehberi seçerken detaylı inceleme yapması için kullanılır.

12. **Tur Satın Alma** (Ümmü Fidan)
    - **API Metodu:** `POST /api/users/tours/{tourId}/purchases`
    - **Açıklama:** Kullanıcının seçtiği bir turu satın almasını sağlar. Kapasite kontrolü ve mükerrer satın alma kontrolü yapılır. Satın alma işlemi başarılı olduğunda turun dolu kontenjanı otomatik olarak artırılır ve sistemde kayıt altına alınır.

13. **Tur Satın Alma İptali** (Ümmü Fidan)
    - **API Metodu:** `DELETE /api/users/purchases/{purchaseId}`
    - **Açıklama:** Kullanıcının daha önce satın aldığı bir turu iptal etmesini sağlar. İşlem başarılı olduğunda satın alma kaydı sistemden kaldırılır ve turun dolu kontenjanı otomatik olarak azaltılır. Kullanıcı yalnızca kendi satın almasını iptal edebilir.

14. **Seyahatlerim** (Beyza Keklikoğlu)
    - **API Metodu:**  `GET /api/users/{userId}/purchases?status=past|future`
    - **Açıklama:**  Kullanıcının geçmişte satın aldığı ve gelecek tarihli satın aldığı turların listelenmesini sağlar. Kullanıcılar geçmiş veya gelecekte ki bir turun bilgilerini görüntüleyebilir. Sadece giriş yapmış kullanıcılar kendi satın aldığı turlarını görüntüleyebilir.

15. **Favori Tur Listeleme** (Ümmü Fidan)
    - **API Metodu:** `GET /api/users/{userId}/favorites`
    - **Açıklama:** Kullanıcının favorilerine eklediği turları listeler. Kullanıcı daha önce favori olarak işaretlediği turları bu bölümde görüntüleyebilir. Bu işlem için giriş yapmış olmak gerekir.

16. **Favori Tur Ekleme** (Ümmü Fidan)
    - **API Metodu:** `POST  /api/users/{userId}/favorites`
    - **Açıklama:** Kullanıcının bir turu favori listesine eklemesini sağlar. Eklenmek istenen tur bilgisi sisteme gönderilir ve ilgili kullanıcının favorilerine kaydedilir. Bu sayede kullanıcı daha sonra rahatlıkla bu favoriler arasından seçim yaparak tur satın alabilir.

17. **Favori Tur Silme** (Ümmü Fidan)
    - **API Metodu:** `DELETE /api/users/{userId}/favorites/{tourId}`
    - **Açıklama:** Kullanıcının favori listesindeki turu silmesini sağlar. İşlem tamamlandığında ilgili tur kullanıcının favori listesinden kaldırılır ve sistem buna göre güncellenir.

18. **Yorum Ekleme** (Beyza Keklikoğlu)
    - **API Metodu:**  `POST /api/tours/{tourId}/reviews`
    - **Açıklama:**  Kullanıcının bir tur hakkında yorum yapmasını sağlar. Kullanıcı, yorum metni girerek ve puanlayarak tur ile ilgili görüşlerini paylaşabilir. Sadece giriş yapmış kullanıcılar yorum yapabilir.

19. **Yorum Güncelleme** (Beyza Keklikoğlu)
    - **API Metodu:**  `PUT /api/reviews/{reviewId}`
    - **Açıklama:**  Kullanıcının daha önce yaptığı yorumu güncellemesini sağlar. Kullanıcı yalnızca kendi yaptığı yorumları düzenleyebilir. 

20. **Yorum Silme** (Beyza Keklikoğlu)
    - **API Metodu:** `DELETE /api/reviews/{reviewId}`
    - **Açıklama:**  Kullanıcının daha önce yaptığı yorumu kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz. Kullanıcı yalnızca kendi yorumlarını silebilir. 

21. **Tur Firması Giriş Yapma** (Recep Arslan) 
    - **API Metodu:** `POST /api/companies/auth/login`
    - **Açıklama:** Sisteme kayıtlı tur firmalarının kimlik doğrulaması yaparak giriş yapmasını sağlar. Gönderilen e-posta/kullanıcı adı ve şifre bilgileri doğrulanır. Başarılı girişte JWT veya benzeri bir erişim token’ı döndürülür.

22. **Tur Firması Kayıt Olma** (Recep Arslan)
    - **API Metodu:** `POST /api/companies/auth/register`
    - **Açıklama:** Yeni bir tur firmasının sisteme kayıt olmasını sağlar. Firma bilgileri doğrulanarak veritabanına kaydedilir.

23. **Tur Firması Kayıt Silme** (Recep Arslan)
    - **API Metodu:** `DELETE /api/companies/{companyId}`
    - **Açıklama:** Tur firmasının hesabının sistemden kalıcı olarak silinmesi sağlanır. Bu işlem yalnızca ilgili firma tarafından yapılabilir ve geri alınamaz.

24. **Tur Firması Tur Listeleme** (Recep Arslan)
    - **API Metodu:** `GET /api/companies/{companyId}/tours`
    - **Açıklama:** Tur firmasının kendi turlarını görmesi sağlanır. Bu sayede bu turlar üzerinden kolayca gerekli işlemler yapılabilir.

25. **Tur Ekleme** (Recep Arslan)
    - **API Metodu:** `POST /api/companies/{companyId}/tours`
    - **Açıklama:** Tur firmasının gerekli bilgileri doldurarak kendisine ait yeni bir tur ekleyebilmesi sağlanır.

26. **Tur Güncelleme** (Recep Arslan)
    - **API Metodu:** `PUT /api/companies/{companyId}/tours/{tourId}`
    - **Açıklama:** Her tur firması yalnızca kendi oluşturduğu turları güncelleyebilir. Tur kontenjanı, fiyat, tarih gibi bilgiler değiştirilebilir. Ayrıca firma kendi katılımcılarını da sisteme ekleyebilir.

27. **Tur Firması Tur Detayı Görüntüleme** (Recep Arslan)
    - **API Metodu:** `GET /api/companies/{companyId}/tours/{tourId}`
    - **Açıklama:** Tur firmasının kendisine ait turların detaylarını görüntülemesi sağlanır. Bu sayede firma tur katılımcı listesi, toplam kontenjan, dolu kontenjan ve kalan kontenjan gibi bilgileri görüntüleyebilir.

28. **Tur Silme** (Recep Arslan)
    - **API Metodu:** `DELETE /api/companies/{companyId}/tours/{tourId}`
    - **Açıklama:** Firma kendisine ait olan bir turu sistemden kalıcı olarak silebilir. Eğer turda aktif katılımcılar bulunuyorsa, ilgili satın alımlar sistem tarafından otomatik olarak iptal edilir.

29. **Rehber Giriş Yapma** (Furkan Fatih Şahin)
    - **API Metodu:**  `POST /api/guides/auth/login`
    - **Açıklama:**  Tur rehberlerinin sisteme kayıtlı e-posta adresleri ve şifreleri ile erişim sağlamasını sağlar. Bu işlem sonucunda rehberin sistemdeki diğer yetkili işlemleri yapabilmesi için bir oturum (token) oluşturulur.

30. **Rehber Kayıt Olma** (Furkan Fatih Şahin)
    - **API Metodu:** `POST /api/guides/auth/register`
    - **Açıklama:** Yeni tur rehberlerinin Travel Book platformuna dahil olmasını sağlar. Kayıt sırasında rehberin adı, soyadı, uzmanlık alanları, bildiği diller ve iletişim bilgileri gibi detaylı veriler toplanır. Veritabanında yeni bir rehber profili oluşturularak rehberin platformda hizmet verebilir hale gelmesi sağlanır.

31. **Rehber Kayıt Silme** (Furkan Fatih Şahin)
    - **API Metodu:** `DELETE/api/guides/{guideId}`
    - **Açıklama:** Tur rehberinin sistemdeki hesabını ve buna bağlı tüm kişisel verilerini kalıcı olarak silmesini sağlar. Kullanıcının "unutulma hakkı" kapsamında sunulan bu özellik, rehberin platformdaki varlığını sonlandırır. Bu işlem geri alınamaz bir işlemdir ve ilgili rehber kimliği  sistemden kaldırılır.

32. **Rehber Profil Güncelleme** (Furkan Fatih Şahin) 
    - **API Metodu:** ` PUT /api/guides/{guideId}`
    - **Açıklama:** Tur rehberinin sistemdeki mevcut profil bilgilerini (biyografi, dil bilgisi, uzmanlık alanları, profil fotoğrafı vb.) güncel tutmasını sağlar. Rehberler deneyim kazandıkça veya iletişim bilgileri değiştikçe bu endpoint üzerinden bilgilerini revize edebilirler. Bu sayede tur şirketleri ve kullanıcılar en güncel verilere ulaşır.
 
33. **Rehber Tüm Tur Firmaları Listeleme** (Furkan Fatih Şahin)
    - **API Metodu:** `GET /api/guides/companies`
    - **Açıklama:** Sistemde kayıtlı olan tüm tur şirketlerinin genel bilgilerinin listelenmesini sağlar. Rehberler, birlikte çalışabilecekleri veya anlaşma yapabilecekleri profesyonel tur firmalarını bu liste üzerinden inceleyebilirler. Bu işlem, rehberler ve şirketler arasındaki iş ağının (networking) kurulmasına yardımcı olur.

34. **Rehber Kayıtlı Tur Firmaları Listeleme** (Furkan Fatih Şahin)
    - **API Metodu:** `GET /api/guides/{guideId}/companies`
    - **Açıklama:** Tur rehberinin sistem üzerinde kayıt olduğu tur firmalarını görüntülemesini sağlar. Bu özellik, rehberin profesyonel iş ağını yönetmesine ve hangi kurumsal yapılarla aktif bir çalışma ilişkisi içinde olduğunu takip etmesine yardımcı olur. Rehber, bu liste aracılığıyla çalıştığı firmaların profillerine ve sundukları tur fırsatlarına hızlı erişim sağlar.

35. **Rehber Tur Kaydetme** (Furkan Fatih Şahin)
    - **API Metodu:** `POST /api/guides/{guideId}/tours`
    - **Açıklama:** Tur rehberinin belirli bir tur şirketi tarafından oluşturulmuş tura rehberlik hizmeti vermek amacıyla kendisini atamasını veya tura dahil olmasını sağlar. Bu işlem sonucunda rehber ile ilgili tur arasında bir bağ kurulur ve rehber o turun resmi görevlisi olarak sisteme işlenir.

36. **Rehber Tur Silme** (Furkan Fatih Şahin)
    - **API Metodu:** `DELETE /api/guides/{guideId}/tours/{tourId}`
    - **Açıklama:**  Tur rehberinin  kayıt olduğu veya görevlendirildiği bir turdan kaydını silmesini sağlar. Rehberin çalışma programında değişiklik olması veya turun iptal edilmesi gibi durumlarda, rehber ile tur arasındaki ilişki bu işlemle sonlandırılır.

37. **Kullanıcı Profil Güncelleme** (Beyza Keklikoğlu)
    - **API Metodu:** `PUT /api/users/{userId}`
    - **Açıklama:** Kullanıcının kendi profil bilgilerini (ad, telefon) güncellemesini sağlar. Güncellenecek en az bir alan gönderilmelidir. Sadece giriş yapmış kullanıcılar kendi profillerini güncelleyebilir.

38. **Tur Firması Profil Güncelleme** (Recep Arslan)
    - **API Metodu:** `PUT /api/companies/{companyId}`
    - **Açıklama:** Tur firmasının kendi profil bilgilerini (firma adı, telefon, adres, açıklama, instagram, linkedin) güncellemesini sağlar. Firma yalnızca kendi profilini güncelleyebilir.

39. **Tur Firması Profil Resmi Yükleme** (Recep Arslan)
    - **API Metodu:** `POST /api/companies/{companyId}/profile-image`
    - **Açıklama:** Tur firmasının profil resmini yüklemesini sağlar. Maksimum 5MB boyutunda jpeg, jpg, png veya webp formatında resim yüklenebilir. Firma yalnızca kendi profil resmini yükleyebilir.

40. **Tur Firması Kapak Resmi Yükleme** (Recep Arslan)
    - **API Metodu:** `POST /api/companies/{companyId}/banner-image`
    - **Açıklama:** Tur firmasının kapak (banner) resmini yüklemesini sağlar. Maksimum 5MB boyutunda jpeg, jpg, png veya webp formatında resim yüklenebilir. Firma yalnızca kendi kapak resmini yükleyebilir.

41. **Firma Kayıtlı Rehberlerini Listeleme** (Recep Arslan)
    - **API Metodu:** `GET /api/companies/{companyId}/guides`
    - **Açıklama:** Firmaya kayıtlı olan rehberleri listeler. Bu özellik firma tarafından tur oluşturulurken rehber ataması yapmak için kullanılır. Yalnızca firma sahibi kendi kayıtlı rehberlerini görüntüleyebilir.

42. **Rehber Profil Resmi Yükleme** (Furkan Fatih Şahin)
    - **API Metodu:** `POST /api/guides/{guideId}/profile-image`
    - **Açıklama:** Tur rehberinin profil resmini yüklemesini sağlar. Maksimum 5MB boyutunda jpeg, jpg, png veya webp formatında resim yüklenebilir. Rehber yalnızca kendi profil resmini yükleyebilir.

43. **Rehber Turlarını Listeleme** (Furkan Fatih Şahin)
    - **API Metodu:** `GET /api/guides/{guideId}/tours`
    - **Açıklama:** Tur rehberinin kayıtlı olduğu turları listelemesini sağlar. Rehber yalnızca kendi turlarını görüntüleyebilir. Bu özellik rehberin aktif ve gelecek tur görevlerini takip etmesine yardımcı olur.

44. **Rehber Firmaya Kayıt Olma** (Furkan Fatih Şahin)
    - **API Metodu:** `POST /api/guides/{guideId}/companies`
    - **Açıklama:** Tur rehberinin belirtilen bir tur firmasına kayıt olmasını sağlar. Kayıt işlemi hem rehberin hem de firmanın kayıtlı listelerinde güncellenir. Rehber firmaya kayıt olduktan sonra o firmaya ait turlara atanabilir hale gelir. Zaten kayıtlı olunan firmaya tekrar kayıt yapılamaz.

45. **Rehber Firmadan Ayrılma** (Furkan Fatih Şahin)
    - **API Metodu:** `DELETE /api/guides/{guideId}/companies/{companyId}`
    - **Açıklama:** Tur rehberinin kayıtlı olduğu bir firmadan ayrılmasını sağlar. Ayrılma işlemi hem rehberin hem de firmanın kayıtlı listelerinden güncellenir. Rehber yalnızca kendi firma kayıtlarını yönetebilir.

46. **Platform İstatistikleri** (Recep Arslan)
    - **API Metodu:** `GET /api/tours/stats`
    - **Açıklama:** Platformdaki toplam kullanıcı sayısı, tur sayısı, firma sayısı ve rehber sayısını döner. Ana sayfada istatistik gösterimi için kullanılır. Public erişime açıktır.

# Gereksinim Dağılımları

1. [Furkan Fatih Şahin'in Gereksinimleri](Furkan-Fatih-Sahin/Furkan-Fatih-Sahin-Gereksinimler.md)
2. [Recep Arslan'ın Gereksinimleri](Recep-Arslan/Recep-Arslan-Gereksinimler.md)
3. [Beyza Keklikoğlu'nun Gereksinimleri](Beyza-Keklikoglu/Beyza-Keklikoglu-Gereksinimler.md)
4. [Ümmü Fidan'ın Gereksinimleri](Ummu-Fidan/Ummu-Fidan-Gereksinimler.md)
