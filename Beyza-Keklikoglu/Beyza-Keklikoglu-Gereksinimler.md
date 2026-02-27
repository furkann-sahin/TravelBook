1. **Kullanıcı Kayıt Silme**
   - **API Metodu:** `DELETE /api/users/{userID}`
   - **Açıklama:** Kimliği doğrulanmış kullanıcının kendi hesabını sistemden silmesini sağlar. İşlem geri alınamaz. Silme işlemi sırasında kullanıcıya ait ilişkili verilerin (yorumlar, satın almalar vb.) sistemden silinmesi sağlanır. Kullanıcı yalnızca kendi hesabını silebilir.

2. **Kullanıcı Şifre Güncelleme**
   - **API Metodu:** `PUT /api/users/{userID}/password`
   - **Açıklama:** Kullanıcının mevcut şifresini değiştirerek yeni bir şifre belirlemesini sağlar. Kullanıcıdan mevcut şifre ve yeni şifre bilgisi alınır.Sadece giriş yapmış kullanıcılar kendi şifrelerini güncelleyebilir.

3. **Tüm Turların Listelenmesi**
   - **API Metodu:** `GET /api/tours?param=?`
   - **Açıklama:** Sistemde mevcut olan tüm turların listelenmesini sağlar. Kullanıcılar tur adı, fiyat, tarih ve konum gibi temel bilgileri görüntüleyebilir. Bu özellik, kullanıcıların mevcut turları keşfetmesine olanak tanır.

4. **Tur Detayı Gösterme**
   - **API Metodu:** `GET /api/tours/{tourID}`
   - **Açıklama:**  Seçilen bir turun detaylı bilgilerinin görüntülenmesini sağlar. Kullanıcılar tur açıklaması, gezilecek yerler, fiyat, konum, tarih, görseller ve diğer detayları inceleyebilir.

5. **Seyahatlerim**
   - **API Metodu:**  `GET /api/users/{userID}/purchases?status=past|future`
   - **Açıklama:**  Kullanıcının geçmişte satın aldığı ve gelecek tarihli satın aldığı turların listelenmesini sağlar. Kullanıcılar geçmiş veya gelecekte ki bir turun bilgilerini görüntüleyebilir. Sadece giriş yapmış kullanıcılar kendi satın aldığı turlarını görüntüleyebilir.

6. **Kullanıcı Profil Bilgileri**
   - **API Metodu:**  `GET /api/users/{userID}`
   - **Açıklama:**  Kullanıcının isim, soyisim, cinsiyet ve yaşadığı yer gibi bilgilerin görüntülenmesini sağlar.Sadece giriş yapmış kullanıcılar kendi profil bilgilerini görüntüleyebilir.

7. **Yorum Ekleme**
   - **API Metodu:**  `POST /api/tours/{tourID}/reviews`
   - **Açıklama:**  Kullanıcının bir tur hakkında yorum yapmasını sağlar. Kullanıcı, yorum metni girerek ve puanlayarak tur ile ilgili görüşlerini paylaşabilir. Sadece giriş yapmış kullanıcılar yorum yapabilir.

8. **Yorum Güncelleme**
   - **API Metodu:**  `PUT /api/reviews/{reviewID}`
   - **Açıklama:**  Kullanıcının daha önce yaptığı yorumu güncellemesini sağlar. Kullanıcı yalnızca kendi yaptığı yorumları düzenleyebilir. 

9. **Yorum Silme**
   - **API Metodu:** `DELETE /api/reviews/{reviewID}`
   - **Açıklama:**  Kullanıcının daha önce yaptığı yorumu kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz. Kullanıcı yalnızca kendi yorumlarını silebilir.