# Furkan Fatih Şahin'in Web Frontend Görevleri (Rehber)

**Front-end Test Videosu:** [web frontend kontrol](https://youtu.be/_BGcmf8Ip6U)

---

## 1. Rehber Giriş Yapma (Login) Sayfası

**API Endpoint:** `POST /api/guides/auth/login`

**Görev:** Rehber giriş işlemi için web sayfası tasarımı ve implementasyonu

### UI Bileşenleri:
- Responsive giriş formu (MUI Container, Paper ile centered layout)
- Gradient arka plan (linear-gradient: #2D3436 → #636e72)
- Tab bazlı rol seçimi (Kullanıcı / Firma / Rehber) — her tab'da ikon (PersonIcon, BusinessIcon, DirectionsBusIcon)
- E-posta input alanı (type="email", required, label="E-posta")
- Şifre input alanı (type="password", required, label="Şifre") — göz ikonu ile görünürlük toggle (Visibility / VisibilityOff)
- "Giriş Yap" butonu (primary button style)
- Loading durumunda buton metni: "Giriş Yapılıyor…"
- "Hesabınız yok mu? Kayıt Ol" linki (`/register` sayfasına yönlendirme)
- "← Ana Sayfa" linki (`/` sayfasına yönlendirme)
- Hata mesajları için Alert bileşeni

### Form Validasyonu:
- E-posta: HTML5 type="email" validasyonu, required
- Şifre: required alan kontrolü
- Tüm alanlar doldurulmadan form submit edilemez

### Kullanıcı Deneyimi:
- Şifre görünürlük toggle (IconButton ile)
- Giriş işlemi sırasında buton loading state gösterir
- Hata durumunda MUI Alert ile kullanıcı dostu mesaj (401: "Geçersiz e-posta veya şifre")
- Başarılı giriş sonrası otomatik yönlendirme: rehber rolü için `/guide` sayfasına
- Tab değiştiğinde form sıfırlanmaz, her rol için ayrı form state tutulur

### Teknik Detaylar:
- Framework: React 19 + MUI (Material UI) 7
- State management: React useState (roleIdx, email, password, showPassword, error, loading)
- Authentication: useAuth hook ile `login(role, email, password)` fonksiyonu
- Routing: react-router-dom v7, useNavigate ile yönlendirme
- JWT token localStorage'da saklanır
- Responsive tasarım: MUI breakpoint sistemi (xs/sm padding farklılıkları)

---

## 2. Rehber Kayıt Olma (Register) Sayfası

**API Endpoint:** `POST /api/guides/auth/register`

**Görev:** Rehber kayıt işlemi için web sayfası tasarımı ve implementasyonu

### UI Bileşenleri:
- Responsive kayıt formu (MUI Container, Paper ile centered layout)
- Gradient arka plan (login ile aynı tasarım)
- Tab bazlı rol seçimi (Kullanıcı / Firma / Rehber)
- Ad input alanı (text, required, label="Ad")
- Soyad input alanı (text, required, label="Soyad")
- E-posta input alanı (type="email", required, label="E-posta")
- Şifre input alanı (type="password", required, label="Şifre", min 6 karakter)
- Şifre tekrar input alanı (type="password", required, label="Şifre Tekrar") — göz ikonu ile görünürlük toggle
- Telefon input alanı (type="tel", optional, placeholder="+90 555 123 4567")
- Biyografi input alanı (textarea, optional, multiline, 3+ satır)
- Diller input alanı (text, optional, helper text: "Virgülle ayırarak yazın")
- Uzman rotalar input alanı (text, optional, helper text: "Virgülle ayırarak yazın")
- Deneyim yılı input alanı (type="number", optional)
- Sosyal medya bölümü ("İsteğe bağlı" başlıklı):
  - Instagram input alanı (text, optional, placeholder ile)
  - LinkedIn input alanı (text, optional, placeholder ile)
- "Kayıt Ol" butonu (primary button style)
- "Zaten hesabınız var mı? Giriş Yap" linki (`/login` sayfasına)
- "← Ana Sayfa" linki

### Form Validasyonu:
- Ad ve Soyad: required alan kontrolü
- E-posta: HTML5 type="email" validasyonu
- Şifre: minimum 6 karakter uzunluk kontrolü
- Şifre eşleşme kontrolü (password === confirmPassword)
- Telefon: optional, tel formatı

### Veri İşleme:
- `languages`: Virgülle ayrılmış string → array'e dönüştürülür (split, trim, filter)
- `expertRoutes`: Virgülle ayrılmış string → array'e dönüştürülür
- `experienceYears`: String → Number'a dönüştürülür (veya 0)
- `confirmPassword` alanı API'ye gönderilmez

### Kullanıcı Deneyimi:
- Şifre görünürlük toggle
- Loading state: buton metni "Hesap oluşturuluyor…"
- Hata durumunda Alert ile mesaj gösterimi (409: "Bu email zaten kullanılıyor")
- Başarılı kayıt sonrası `/guide` sayfasına otomatik yönlendirme
- Rol bazlı koşullu form render (renderGuideForm fonksiyonu)

### Teknik Detaylar:
- Framework: React 19 + MUI 7
- State management: useState (roleIdx, forms objesi — her rol için ayrı form state, showPassword, error, loading)
- Authentication: useAuth hook ile `register(role, data)` fonksiyonu
- Routing: react-router-dom v7
- Form state yönetimi: her rol için ayrı form objesi (forms[role]) ile state tutulur

---

## 3. Rehber Paneli (Dashboard) Sayfası

**API Endpoint:** Doğrudan API çağrısı yok (yönlendirme sayfası)

**Görev:** Rehber ana panel sayfası — hızlı erişim kartları ile alt sayfalara yönlendirme

### UI Bileşenleri:
- Hoş geldiniz bölümü: "Hoş geldiniz, {user.name}" başlığı
- Alt başlık: "Rehber panelinizden tur firmalarına kayıt olabilir..."
- 4 adet hızlı erişim kartı (CSS Grid: xs: 1fr, sm: 1fr 1fr):
  1. **Tur Firmaları** (BusinessIcon) → `/guide/companies`
     - Açıklama: "Tüm tur firmalarını görüntüleyin ve kayıt olun"
  2. **Profilim** (PersonIcon) → `/guide/profile`
     - Açıklama: "Rehber bilgilerinizi görüntüleyin ve düzenleyin"
  3. **Kayıtlı Tur Firmalarım** (CheckCircleIcon) → `/guide/my-companies`
     - Açıklama: "Kayıt olduğunuz tur firmalarını yönetin"
  4. **Kayıtlı Turlarım** (MapIcon) → `/guide/my-tours`
     - Açıklama: "Şirket tarafından atanılan turlarınızı görüntüleyin"

### Kullanıcı Deneyimi:
- Kartlarda hover efekti: translateY(-2px), box shadow artışı, border renk değişimi
- Her kartta ikon, başlık, açıklama ve "Görüntüle →" linki
- useAuth hook ile kullanıcı bilgisi alınır

### Teknik Detaylar:
- Framework: React 19 + MUI 7
- State: useAuth hook'tan user objesi
- Routing: useNavigate ile card onClick yönlendirme
- Layout: GuideLayout (GuideNavbar + GuideFooter) içinde render edilir

---

## 4. Rehber Profil Görüntüleme ve Düzenleme Sayfası

**API Endpoint:** `GET /api/guides/{guideId}` | `PUT /api/guides/{guideId}` | `DELETE /api/guides/{guideId}` | `POST /api/guides/{guideId}/profile-image`

**Görev:** Rehber profil bilgilerini görüntüleme, düzenleme,güncelleme, profil fotoğrafı yükleme ve hesap silme sayfası

### UI Bileşenleri:

**Profil Başlık Kartı:**
- Banner / kapak fotoğrafı alanı (upload butonu ile değiştirilebilir — AddPhotoAlternateIcon)
- Avatar (profil fotoğrafı — CameraAltIcon ile upload overlay)
- Ad Soyad gösterimi (düzenleme modunda TextField)
- Chip'ler:
  - "Rehber" rozeti (CardTravelIcon)
  - Müsaitlik durumu toggle (FiberManualRecordIcon — yeşil/gri — Switch ile değiştirilebilir)
  - Rating gösterimi (yıldız puanı varsa)
- Düzenle / Kaydet / İptal butonları (EditIcon, SaveIcon, CloseIcon)

**Profil Tamamlama Çubuğu:**
- LinearProgress bileşeni ile yüzde gösterimi
- 10 alan üzerinden hesaplanır (firstName, lastName, email, phone, biography, profileImageUrl, languages, expertRoutes, experienceYears, galleryImages)
- Renk gradyanı: turuncu (eksik) → yeşil (%100)
- Yardımcı metin ile tamamlama ipuçları

**Bilgi Bölümleri:**
1. **Hakkımda** — Biyografi metni (düzenleme modunda multiline TextField, minRows=3)
2. **Uzmanlık Bilgileri** — Diller, uzman rotalar, deneyim yılı (düzenleme modunda TextField'lar)
3. **İletişim Bilgileri** — E-posta (salt okunur), telefon (düzenlenebilir), üyelik tarihi
4. **Sosyal Medya** — Instagram ve LinkedIn (düzenlenebilir, görüntüleme modunda dış link)
5. **İstatistikler** — Toplam tur sayısı, deneyim yılı, üyelik tarihi (StatCard bileşenleri)
6. **Öne Çıkan Kareler (Galeri)** — Grid layout (2-4 kolon), fotoğraf ekleme/silme, JPEG/PNG/WebP desteği

**Hesap Silme Bölümü:**
- Tehlike bölgesi (danger zone) tasarımı
- "Hesabı Sil" butonu (DeleteForeverIcon, danger rengi)
- Modal dialog ile onay (Dialog, DialogTitle, DialogContent, DialogActions)
- Ad soyad yazarak onaylama (deleteConfirmText === fullName kontrolü)
- Uyarı mesajları: "Bu işlem geri alınamaz"

### Form Validasyonu:
- Ad ve Soyad: required
- Telefon: optional
- Diller/Uzman Rotalar: virgülle ayrılmış string → array dönüşümü
- Deneyim yılı: number type
- Profil fotoğrafı: JPEG, PNG, WebP formatları, max 5MB
- Hesap silme: tam ad yazılması zorunlu

### Kullanıcı Deneyimi:
- Loading state: Skeleton bileşenleri ile shimmer efekti
- Düzenleme modu toggle (editing state)
- Kaydetme sırasında CircularProgress gösterimi (saving state)
- Başarılı güncelleme sonrası Snackbar ile bildirim
- Hata durumunda Alert ile mesaj
- Fotoğraf yükleme sırasında uploading state
- Profil fotoğrafı preview: http URL, data URL ve relative path desteği (getImageSrc helper)
- InfoRow, SocialRow, StatCard yardımcı bileşenleri ile düzenli layout
- Responsive tasarım: tüm bölümler mobil uyumlu

### Teknik Detaylar:
- Framework: React 19 + MUI 7
- State management: useState (guide, loading, error, editing, formData, saving, saveError, snackbar, deleteOpen, deleteConfirmText, deleting, deleteError, uploading, bannerUrl, uploadingBanner, available, galleryImages)
- Refs: fileInputRef, bannerInputRef, galleryInputRef (dosya upload için)
- API çağrıları: guideApi.getDetail, guideApi.updateProfile, guideApi.deleteAccount, guideApi.uploadProfileImage
- Routing: useNavigate — silme sonrası "/" sayfasına yönlendirme
- Veri işleme: languages/expertRoutes split → array, experienceYears → Number

---

## 5. Tur Firmaları Listeleme Sayfası

**API Endpoint:** `GET /api/guides/companies` | `POST /api/guides/{guideId}/companies` | `DELETE /api/guides/{guideId}/companies/{companyId}`

**Görev:** Tüm tur firmalarını listeleme, firmaya kayıt olma ve kayıt silme sayfası

### UI Bileşenleri:
- Sayfa başlığı: "Tur Firmaları"
- Geri butonu (ArrowBackIcon → `/guide`)
- Firma kartları (CSS Grid: xs: 1fr, sm: 1fr 1fr, md: 1fr 1fr 1fr):
  - BusinessIcon + firma adı
  - Firma açıklaması (2 satır clamp)
  - Adres (LocationOnIcon, tek satır clamp)
  - Telefon (PhoneIcon)
  - Rating (MUI Rating bileşeni, varsa)
  - Kayıt durumuna göre border rengi: kayıtlı → success.light, kayıtsız → divider
  - Kayıtlıysa: "Kayıtlı" chip (CheckCircleIcon, success) + "Kaydı Sil" butonu
  - Kayıtsızsa: "Kayıt Ol" butonu (full width, secondary renk)
- Boş durum mesajı (firma yoksa)
- Snackbar bildirimleri (başarı/hata)

### Kullanıcı Deneyimi:
- Loading state: Skeleton bileşenleri
- Hata durumunda Alert + retry butonu
- Kayıt ol/sil işlemlerinde anında UI güncelleme (myCompanyIds Set yapısı)
- Kartlarda hover efekti: border renk değişimi, box shadow
- Snackbar ile işlem sonucu bildirimi

### Teknik Detaylar:
- State: companies (array), myCompanyIds (Set), loading, error, snackbar
- API çağrıları: guideApi.listCompanies(), guideApi.listMyCompanies(userId), guideApi.applyToCompany(userId, companyId), guideApi.removeFromCompany(userId, companyId)
- Set veri yapısı ile O(1) kayıt durumu kontrolü

---

## 6. Kayıtlı Tur Firmalarım Sayfası

**API Endpoint:** `GET /api/guides/{guideId}/companies` | `DELETE /api/guides/{guideId}/companies/{companyId}`

**Görev:** Rehberin kayıtlı olduğu firmaları listeleme ve kayıt silme sayfası

### UI Bileşenleri:
- Sayfa başlığı: "Kayıtlı Tur Firmalarım"
- Geri butonu (ArrowBackIcon → `/guide`)
- Firma kartları (CSS Grid: xs: 1fr, sm: 1fr 1fr, md: 1fr 1fr 1fr):
  - BusinessIcon + firma adı
  - Firma açıklaması (2 satır clamp)
  - Telefon (PhoneIcon)
  - Adres (LocationOnIcon)
  - "Kayıtlı" chip (CheckCircleIcon, success renk)
  - "Kaydı Sil" butonu (RemoveCircleOutlineIcon)
- Boş durum mesajı:
  - BusinessIcon
  - "Henüz bir firmaya kayıt olmadınız"
  - "Tur Firmalarına Göz At" linki → `/guide/companies`
- Snackbar bildirimleri

### Kullanıcı Deneyimi:
- Loading state: Skeleton bileşenleri
- Hata durumunda Alert + retry butonu
- Kayıt silme sonrası liste güncellenir
- Boş durum için yönlendirme linki

### Teknik Detaylar:
- State: myCompanies (array), loading, error, snackbar
- API çağrıları: guideApi.listMyCompanies(userId), guideApi.removeFromCompany(userId, companyId)

---

## 7. Kayıtlı Turlarım Sayfası

**API Endpoint:** `GET /api/guides/{guideId}/tours` | `DELETE /api/guides/{guideId}/tours/{tourId}`

**Görev:** Rehberin atanmış turlarını listeleme ve tur kaydı silme sayfası

### UI Bileşenleri:
- Sayfa başlığı: "Kayıtlı Turlarım"
- Geri butonu (ArrowBackIcon → `/guide`)
- Tur kartları (CSS Grid: xs: 1fr, sm: 1fr 1fr, md: 1fr 1fr 1fr):
  - CardMedia: tur görseli veya placeholder (ImageNotSupportedIcon)
  - Tur adı + durum chip'i (bitiş tarihi geçmişse: "Tamamlandı")
  - Konum (LocationOnIcon, tek satır clamp)
  - Tarih aralığı (CalendarMonthIcon, formatlanmış)
  - Rating (MUI Rating bileşeni, varsa)
  - Fiyat (TRY formatında)
  - "Kaydı Sil" butonu (RemoveCircleOutlineIcon)
- Boş durum mesajı:
  - MapIcon
  - "Henüz atanmış turunuz yok"
  - "Kayıtlı olduğunuz firmalar sizi turlarına ekledikçe burada görüntülenecektir."

### Kullanıcı Deneyimi:
- Loading state: Skeleton bileşenleri
- Hata durumunda Alert + retry butonu
- Tamamlanmış turlar: opacity 0.7 ile soluk gösterim
- Tarih ve fiyat formatlaması: `formatDate()` → locale tarih, `formatPrice()` → TRY para birimi

### Teknik Detaylar:
- State: tours (array), loading, error
- API çağrıları: guideApi.listTours(userId), guideApi.removeTour(userId, tourId)
- Helper fonksiyonlar: formatDate (gün ay yıl), formatPrice (₺ formatı)
- Tarih karşılaştırma: endDate < now → "Tamamlandı" durumu

---

## 8. Rehber Navbar Bileşeni

**Görev:** Rehber paneli için responsive navigasyon çubuğu

### UI Bileşenleri:

**Desktop (md ve üzeri):**
- AppBar (fixed position, frosted glass efekti: rgba(255,255,255,0.97), backdropFilter="blur(10px)")
- Brand: DirectionsBusIcon + "TravelBook" + "Rehber Paneli" label chip
- Public linkler: "Ana Sayfa" (`/guide/home`), "Hakkımızda" (`/guide/about`)
- Private linkler: "Panel" (`/guide`), "Profilim" (`/guide/profile`)
- Aktif sayfa göstergesi: alt çizgi animasyonu (width 0→60%), secondary renk, fontWeight 700
- Kullanıcı avatar'ı + dropdown menü:
  - E-posta gösterimi (disabled)
  - "Profilim" linki
  - "Çıkış Yap" butonu

**Mobil (xs):**
- Hamburger menü ikonu (MenuIcon) → Drawer bileşeni
- Drawer içeriği:
  - Brand bilgisi: "TravelBook" + "Rehber Paneli – {user.name}"
  - Navigasyon linkleri (Panel, Profilim)
  - Public linkler (Ana Sayfa, Hakkımızda)
  - Çıkış Yap butonu
- Divider'lar ile bölüm ayrımları

### Teknik Detaylar:
- State: drawerOpen (boolean), anchorEl (Menu anchor)
- MUI bileşenleri: AppBar, Toolbar, Drawer, Menu, MenuItem, Avatar
- Routing: useNavigate, useLocation (aktif sayfa tespiti)
- Auth: useAuth hook'tan user ve logout fonksiyonları

---

## 9. Rehber Footer Bileşeni

**Görev:** Rehber paneli için alt bilgi bileşeni

### UI Bileşenleri:
- Brand bölümü: DirectionsBusIcon + "TravelBook" + açıklama metni
- Rehber Linkleri: "Panel" (`/guide`), "Turlarım" (`/guide/tours`), "Profilim" (`/guide/profile`)
- Genel Linkler: "Ana Sayfa" (`/`), "Hakkımızda" (`/about`)
- GitHub ikonu (GitHubIcon)
- Telif hakkı metni: "© 2025 TravelBook. Tüm hakları saklıdır."
- Grid layout (3 kolon, responsive)
- Divider ile ayırım

---

## 10. Rehber Layout Bileşeni

**Görev:** Rehber sayfaları için ortak layout yapısı

### UI Bileşenleri:
- GuideNavbar (üst navigasyon)
- Outlet (react-router-dom — alt sayfa render alanı)
- GuideFooter (alt bilgi)
- Minimum yükseklik: 100vh (flexbox ile footer her zaman altta)