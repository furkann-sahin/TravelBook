1. **Rehber Giriş Yapma**
   - **API Metodu:** `POST /api/guides/auth/login`
   - **Açıklama:** Tur rehberlerinin sisteme kayıtlı e-posta adresleri ve şifreleri ile erişim sağlamasını sağlar. Bu işlem sonucunda rehberin sistemdeki diğer yetkili işlemleri yapabilmesi için bir oturum (token) oluşturulur.

2. **Rehber Kayıt Olma**
   - **API Metodu:** `POST /api/guides/auth/register`
   - **Açıklama:** Yeni tur rehberlerinin Travel Book platformuna dahil olmasını sağlar. Kayıt sırasında rehberin adı, soyadı, uzmanlık alanları, bildiği diller ve iletişim bilgileri gibi detaylı veriler toplanır. Veritabanında yeni bir rehber profili oluşturularak rehberin platformda hizmet verebilir hale gelmesi sağlanır.

3. **Rehber Kayıt Silme**
   - **API Metodu:** `DELETE/api/guides/{guideID}`
   - **Açıklama:** Tur rehberinin sistemdeki hesabını ve buna bağlı tüm kişisel verilerini kalıcı olarak silmesini sağlar. Kullanıcının "unutulma hakkı" kapsamında sunulan bu özellik, rehberin platformdaki varlığını sonlandırır. Bu işlem geri alınamaz bir işlemdir ve ilgili rehber kimliği  sistemden kaldırılır.

4. **Rehber Profil Güncelleme**
   - **API Metodu:** ` PUT /api/guides/{guideID}`
   - **Açıklama:** Tur rehberinin sistemdeki mevcut profil bilgilerini (biyografi, dil bilgisi, uzmanlık alanları, profil fotoğrafı vb.) güncel tutmasını sağlar. Rehberler deneyim kazandıkça veya iletişim bilgileri değiştikçe bu endpoint üzerinden bilgilerini revize edebilirler. Bu sayede tur şirketleri ve kullanıcılar en güncel verilere ulaşır.

5. **Rehber Tüm Tur Firmaları Listeleme**
   - **API Metodu:** `GET /api/companies`
   - **Açıklama:** Sistemde kayıtlı olan tüm tur şirketlerinin genel bilgilerinin listelenmesini sağlar. Rehberler, birlikte çalışabilecekleri veya anlaşma yapabilecekleri profesyonel tur firmalarını bu liste üzerinden inceleyebilirler. Bu işlem, rehberler ve şirketler arasındaki iş ağının (networking) kurulmasına yardımcı olur.

6. **Rehber Kayıtlı Tur Firmaları Listeleme**
   - **API Metodu:** `GET /api/guides/{guideID}/tours`
   - **Açıklama:** Tur rehberinin sistem üzerinde daha önce iş birliği yaptığı, rehberlik hizmeti için anlaşıp favorilerine ekleyerek takibe aldığı tur firmalarını görüntülemesini sağlar. Bu özellik, rehberin profesyonel iş ağını yönetmesine ve hangi kurumsal yapılarla aktif bir çalışma ilişkisi içinde olduğunu takip etmesine yardımcı olur. Rehber, bu liste aracılığıyla çalıştığı firmaların profillerine ve sundukları tur fırsatlarına hızlı erişim sağlar.

7. **Rehber Tur Kaydetme** (Tura Katılım/Ekleme)
   - **API Metodu:** `POST /api/guides/{guideID}/tours`
   - **Açıklama:** Tur rehberinin belirli bir tur şirketi tarafından oluşturulmuş tura rehberlik hizmeti vermek amacıyla kendisini atamasını veya tura dahil olmasını sağlar. Bu işlem sonucunda rehber ile ilgili tur arasında bir bağ kurulur ve rehber o turun resmi görevlisi olarak sisteme işlenir.

8. **Rehber Tur Silme (Tur Bağlantısını Kaldırma)**
   - **API Metodu:** `DELETE /api/guides/{guideID}/tours/{tourID}`
   - **Açıklama:** Tur rehberinin  kayıt olduğu veya görevlendirildiği bir turdan kaydını silmesini sağlar. Rehberin çalışma programında değişiklik olması veya turun iptal edilmesi gibi durumlarda, rehber ile tur arasındaki ilişki bu işlemle sonlandırılır.

9. **Tur Rehberi Detayı Gösterme**
   - **API Metodu:** `GET /api/guides/{guideID}`
   - **Açıklama:** Belirli bir rehberin tüm profesyonel detaylarının (deneyim süresi, aldığı yorumlar, puanı, uzman olduğu rotalar) görüntülenmesini sağlar. Bu sayfa hem rehberin kendi bilgilerini kontrol etmesi hem de tur şirketlerinin uygun rehberi seçerken detaylı inceleme yapması için kullanılır.