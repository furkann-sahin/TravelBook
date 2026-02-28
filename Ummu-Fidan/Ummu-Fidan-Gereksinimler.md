1. **KULLANICI GİRİŞ YAPMA**
   - **API Metodu:** POST  `/api/users/auth/login`
   - **Açıklama:** Kullanıcının sisteme e-posta ve şifre bilgileri ile giriş yapmasını sağlar. Doğru bilgiler girildiğinde kullanıcı sisteme başarılı şekilde giriş yapar ve oturum başlatılır. Hatalı bilgiler girildiğinde giriş işlemi başarısız olur ve kullanıcıya hata mesajı gösterilir. Güvenlik için e-posta ve şifre doğrulaması yapılır.

2. **KULLANICI KAYIT OLMA**
   - **API Metodu:** POST `/api/users/auth/register` 
   - **Açıklama:** Yeni kullanıcının sisteme kayıt olmasını sağlar. Kullanıcı ad, soyad, e-posta ve şifre gibi gerekli bilgileri girerek hesap oluşturur. Kayıt işlemi başarılı olduğunda kullanıcı sisteme giriş yapabilir.
    
3. **TUR FİLTRELEME**
   - **API Metodu:** GET  `/api/tours?param=value`
   - **Açıklama:** Sistemde bulunan turların tarih, fiyat veya konum gibi kriterlere göre filtrelenmesini sağlar. Kullanıcı istediği filtre parametrelerini girerek uygun turları listeleyebilir. Filtre uygulanmadığında tüm turlar görüntülenir. Bu özellik kullanıcıların aradıkları tura daha kolay ulaşmasını sağlar.

4. **TÜM TUR REHBERLERİNİN LİSTELENMESİ**
   - **API Metodu:** GET  `/api/guides`
   - **Açıklama:** Sistemde kayıtlı tur rehberlerini listeler. Kullanıcılar bu liste sayesinde rehberler hakkında bilgi alarak tercih yapabilir.
    
5. **TUR SATIN ALMA**
   - **API Metodu:** POST  `/api/tours/{tourID}/purchases`
   - **Açıklama:** Kullanıcının seçtiği bir turu satın almasını sağlar. Satın alma işlemi simülasyon olarak gerçekleştirilir ve sistemde kayıt altına alınır.
    
6. **TUR SATIN ALMA İPTALİ**
   - **API Metodu:** DELETE  `/api/purchases/{purchasesID}`
   - **Açıklama:** Kullanıcının daha önce satın aldığı bir turu iptal etmesini sağlar. İşlem başarılı olduğunda satın alma kaydı sistemden kaldırılır veya iptal durumuna getirilir ve sistem buna göre güncellenir.
   
7. **FAVORİ TUR LİSTELEME**
   - **API Metodu:** GET  `/api/users/{userID}/favorites`
   - **Açıklama:** Kullanıcının favorilerine eklediği turları listeler. Kullanıcı daha önce favori olarak işaretlediği turları bu bölümde görüntüleyebilir. Bu işlem için giriş yapmış olmak gerekir.
    
8. **FAVORİ TUR EKLEME**
   - **API Metodu:** POST  `/api/users/{userID}/favorites`
   - **Açıklama:** Kullanıcının bir turu favori listesine eklemesini sağlar. Eklenmek istenen tur bilgisi sisteme gönderilir ve ilgili kullanıcının favorilerine kaydedilir. Bu sayede kullanıcı daha sonra rahatlıkla bu favoriler arasından seçim yaparak tur satın alabilir.
    
9. **FAVORİ TUR SİLME**
   - **API Metodu:** DELETE  `/api/users/{userID}/favorites/{tourID}`
   - **Açıklama:** Kullanıcının favori listesindeki turu silmesini sağlar. İşlem tamamlandığında ilgili tur kullanıcının favori listesinden kaldırılır ve sistem buna göre güncellenir.