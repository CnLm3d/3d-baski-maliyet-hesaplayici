# 3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı
**Atölye Sürümü — Filenta PLA & Elegoo Saturn 4 Ultra 16K SLA Destekli**

Bu program; atölyenizdeki **8 adet 3D yazıcı filonuz**, kiralık dükkan giderleriniz, elektrik tüketimi, laptop amortismanı, işçilik ve tasarım (Fusion 360 / Blender) hizmetlerinizi dikkate alarak **.STL** ve **.3MF** dosyalarından otomatik ve hassas maliyet analizi ile müşteri teklif fişi üreten yerel bir web uygulamasıdır.

---

## 📦 Kurulum Dosyası (Setup Wizard .exe)

Uygulama artık tam teşekküllü, çok adımlı, modern bir **Windows Kurulum Sihirbazı (`Setup_3D_Maliyet_Hesaplayici.exe`)** ile sunulmaktadır. Kurulum dosyasını çalıştırdığınızda aşağıdaki aşamalar adım adım karşınıza gelir:

1. **Dil Seçimi ve Karşılama (Language & Welcome):**
   * Türkçe (TR) ve English (EN) dil seçenekleri.
   * Dil tercihi değiştiği anda kurulum sihirbazının tüm metinleri dinamik olarak seçilen dile geçer.
2. **Kurulum Konumu Seçimi (Installation Directory):**
   * Varsayılan olarak `%LOCALAPPDATA%\Programs\3D_Maliyet_Hesaplayici` klasörüne kurulur (yönetici izni gerektirmeden sorunsuz çalışır).
   * Kullanıcı `Gözat...` butonuna tıklayarak istediği herhangi bir özel sürücüyü veya klasörü seçebilir.
   * Disk alanı ve kullanılabilir boş alan göstergesi bulunur.
3. **Firma / Atölye Bilgileri ve Logo Yükleme:**
   * Firma / Atölye Adı, Yetkili Kişi, Telefon, E-posta ve Atölye Adresi.
   * **Logo Yükleme:** PNG, JPG, JPEG, BMP veya SVG formatında firma logonuzu seçebilir ve canlı önizleme kutusunda görebilirsiniz.
   * Seçilen logo, müşteri teklif fişinde (`#tab-quote`) ve PDF çıktılarında sol üstte profesyonel kurumsal logo olarak yer alır.
4. **Makine Parkı Oluşturma (Orca Slicer Cihaz Kataloğu):**
   * Makine parkı başlangıçta **tamamen boş** gelir.
   * Kullanıcı, açılır menüdeki **resmi Orca Slicer cihaz kataloğundan** (Creality Hi Combo 260×260×300 mm, FlashForge AD5X, FlashForge AD5M Pro, Qidi Q1 Pro, Bambu Lab X1C/P1S/A1, Elegoo Saturn 4 Ultra 16K SLA vb.) atölyesinde bulunan cihazları seçip adet belirleyerek `+ Parka Ekle` butonuyla ekler.
   * `+ Adet Artır`, `- Adet Azalt`, `Seçileni Sil` ve `+ Özel Yazıcı...` butonlarıyla parkını dilediği gibi özelleştirebilir.
5. **Atölye Maliyet Temelleri:**
   * Aylık dükkan kirası (TL), sabit faturalar/aidat (TL), elektrik birim fiyatı (TL/kWh), hedef kâr marjı (%) ve saatlik tasarım/işçilik ücretlerini belirleme.
6. **Kısayollar ve Kurulum İlerlemesi:**
   * Masaüstü Kısayolu ve Başlat Menüsü Kısayolu oluşturma seçenekleri (`app.ico` simgesi ile).
   * İlerleme çubuğu eşliğinde gömülü dosyalar açılır, `initial_config.json` oluşturulur.
7. **Kurulum Tamamlandı:**
   * Kurulum bittiğinde "3D Maliyet Hesaplayıcı'yı Şimdi Başlat" seçeneğiyle doğrudan uygulama açılır.

---

## 🚀 Hızlı Başlangıç (Masaüstü EXE Programı)

1. **Masaüstünüzdeki** `3D Baskı Maliyet Hesaplayıcı` kısayoluna veya klasördeki **`3D_Maliyet_Hesaplayici.exe`** dosyasına çift tıklayın.
2. Program bağımsız, pencereli bir masaüstü uygulaması (native desktop app) olarak açılacaktır (adres çubuğu, tarayıcı sekmeleri olmadan temiz bir masaüstü penceresi).
3. Klasördeki **`baslat.bat`** dosyasını da kullanabilirsiniz.
4. **İnternet bağlantısı gerektirmez**, tüm hesaplama motoru, 3D sahneler ve veritabanı yerel olarak çalışır; hiçbir veriniz veya 3D dosyanız bilgisayarınızın dışına çıkmaz.

---

## 🖨️ Orca Slicer Tabanlı Cihaz ve Filament Profilleri

Uygulama, **Orca Slicer** açık kaynak profil kütüphanesindeki gerçekçi teknik verilerle çalışır:
* **Creality Hi / Hi Combo (Orca Slicer)**: **260 × 260 × 300 mm** gerçek tabla ve baskı hacmi, ~350W güç, 500 mm/s azami hız.
* **FlashForge Adventurer 5X (AD5X)**: 220 × 220 × 220 mm, ~200W ortalama güç, FDM.
* **FlashForge AD5M Pro**: 220 × 220 × 220 mm, ~220W güç, kapalı kasa & HEPA filtre aşınma payı.
* **Qidi Q1 Pro**: 250 × 250 × 250 mm, ~380W güç (60°C aktif ısıtmalı hazne enerji maliyeti dahil).
* **Qidi X-Plus 3**: 280 × 280 × 270 mm, ~400W güç.
* **Creality K1C / K1 Max**: 220×220×250 mm ve 300×300×300 mm CoreXY yüksek hız profilleri.
* **Bambu Lab X1-Carbon / P1S / A1**: 256 × 256 × 256 mm, 500 mm/s hız profilleri.
* **Elegoo Saturn 4 Ultra 16K (SLA Reçine)**: 218.88 × 122.88 × 220 mm, 16K Mono LCD ekran & ACF film aşınması + İPA alkol yıkama & kürleme sarfiyat payı.

### 🧪 Orca Slicer Filament Profilleri
Filament ve reçine seçiminde Orca Slicer'ın nozül sıcaklığı, tabla sıcaklığı ve yoğunluk ($g/cm^3$) parametreleri esas alınır:
* **PLA**: Yoğunluk $1.24\ g/cm^3$, Nozzle: 215°C, Tabla: 55°C
* **PETG**: Yoğunluk $1.27\ g/cm^3$, Nozzle: 245°C, Tabla: 75°C
* **ABS / ASA**: Yoğunluk $1.05\ g/cm^3$, Nozzle: 260°C, Tabla: 100°C
* **TPU 95A**: Yoğunluk $1.21\ g/cm^3$, Nozzle: 225°C, Tabla: 45°C
* **PA-CF (Karbon Naylon)**: Yoğunluk $1.20\ g/cm^3$, Nozzle: 280°C, Tabla: 85°C
* **Elegoo 16K Reçine (SLA)**: Yoğunluk $1.12\ g/cm^3$, Katman Süresi: ~1.8s

*(İstediğiniz zaman "Makine Parkı" sekmesinden yeni yazıcı ekleyebilir veya parametreleri güncelleyebilirsiniz.)*

---

## 🧮 Maliyet Hesaplama Formülleri

Program, endüstri standardı gerçekçi atölye maliyet muhasebesi prensiplerine göre çalışır:

### 1. Dükkan Kirası ve Sabit Gider Payı (Adil Dağıtım)
Kira ve sabit faturalar, yazıcılarınızın çalışma saatine göre adilce dağıtılır:
$$\text{Saatlik Kira Yükü} = \frac{\text{Aylık Kira} + \text{Sabit Faturalar}}{\text{Yazıcı Sayısı} \times \text{Yazıcı Başına Hedef Aylık Çalışma Saati}}$$
*Örnek:* 15.000 TL kira + 2.500 TL sabit gider / (8 yazıcı × 200 saat) = **10.94 TL / saat**. 
Böylece 3 saatlik bir baskı yapıldığında, dükkan kirasından o baskıya düşen pay tam olarak 32.82 TL olur.

### 2. Elektrik Tüketim Maliyeti
$$\text{Elektrik} = \left(\frac{\text{Yazıcı Gücü (Watt)}}{1000}\right) \times \text{Baskı Süresi (saat)} \times \text{Elektrik Birim Fiyatı (TL/kWh)}$$

### 3. Makine Aşınma ve Amortisman Payı
$$\text{Yazıcı Amortismanı} = \text{Saatlik Aşınma Bedeli} \times \text{Baskı Süresi}$$
*(Nozzle, PEI tabla, kayış, SLA için 16K LCD ekran ve ACF film ömrünü kapsar.)*

### 4. Laptop & Donanım Amortismanı
Laptop satın alma bedeli 36 aylık faydalı ömre bölünür ve makine çalışma saatine eklenir.

### 5. Hammadde Maliyeti
$$\text{Malzeme} = \left(\frac{\text{Gram}}{1000}\right) \times \text{Kg Fiyatı (TL)}$$
* Varsayılan malzeme: **Filenta PLA (450 TL/kg)**.
* Elegoo 16K Reçine, PETG, ABS/ASA veya özel malzeme fiyatları desteklenir.

### 6. Operasyonel İşçilik & Özel Modelleme (Fusion / Blender)
* **Operasyon**: Dilimleme, baskı başlatma, parçayı tabladan sökme ve destek temizleme (dakika bazlı).
* **3D Tasarım**: Eğer müşteri için Fusion 360 veya Blender'da sıfırdan çizim veya revizyon yapıldıysa tasarım saat ücreti eklenir.
* **SLA Ek Sarfiyat**: Elegoo Saturn 4 için İzopropil Alkol (İPA) yıkama kaybı, UV kürleme ve koruyucu eldiven/filtre için baskı başı sabit pay eklenir.

### 7. Risk Payı (%10) ve Kâr Marjı
* Olası baskı hataları, tabla yapışmama veya elektrik dalgalanması risklerine karşı **%10 Risk / Fire Payı** eklenir.
* Belirlediğiniz **Kâr Marjı (%30 - %100+)** ve opsiyonel **KDV (%20)** eklenerek nihai satış fiyatı hesaplanır.

---

## 📂 STL ve 3MF Dosyası Desteği

* **.STL Dosyaları**: Binary veya ASCII formatındaki STL'leri anında okur, 3D olarak görselleştirir, hacmini ($cm^3$), yüzey alanını ($cm^2$) ve milimetrik boyutlarını (X, Y, Z) hesaplar.
* **.3MF Dosyaları**:
  * **Dilimlenmiş 3MF**: OrcaSlicer, Bambu Studio, PrusaSlicer veya FlashPrint gibi dilimleyicilerden kaydedilen 3MF dosyalarında yer alan **net filament gramajını ve tahmini baskı süresini** doğrudan tespit eder ve kutucuklara otomatik yazar.
  * **Ham CAD 3MF**: Fusion 360 veya Blender'dan export edilen ham 3MF'lerdeki geometrik mesh yapısını çözerek hacim ve boyutları milimetrik hesaplar.
* **Tabla Sığma Kontrolü**: Modelin seçilen yazıcının tablasına sığıp sığmadığını denetler; aşarsa kırmızı uyarı rozeti gösterir.

---

## 🔄 Farklı Cihazlara Ait 3MF Dosyalarını Uyarlama

Bambu Lab, Prusa veya başka bir yazıcı için dilimlenmiş bir `.3mf` dosyası yüklediğinizde:
1. **Orijinal Cihaz Otomatik Algılanır:** Örneğin *"Bambu Lab X1-Carbon"* şeklinde algılanarak kullanıcıya gösterilir.
2. **Hedef Cihaz Seçimi:** Atölyenizdeki mevcut cihazlardan biri (FlashForge AD5X, AD5M Pro, Qidi veya Creality) seçilir.
3. **Parametre Uyarlaması:**
   * Tabla boyutları hedef yazıcının ölçülerine göre sınırlandırılır ve merkezlenir.
   * Filenta PLA için ideal sıcaklıklar (Nozzle: 215°C, Tabla: 60°C) otomatik uygulanır.
4. **Uyarlanmış 3MF İndir:** Tek tıkla yeni makinenize hazır `.3mf` paketi olarak bilgisayarınıza indirilir.

---

## 🎨 3D Destek Boyama (Support Painting) & Otomatik Sarkma Analizi

STL ve 3MF modellerinizde desteğe ihtiyaç duyan bölgeleri belirlemek için slicer düzeyinde interaktif boyama araçları eklenmiştir:
* **🟢 Destek Ekle (Enforce):** Fırça ile boyadığınız yüzeyler yeşil renge bürünür ve kesinlikle destek üretilecek bölgeler olarak işaretlenir.
* **🔴 Destek Engelle (Block):** Boyanan yüzeyler kırmızı renge bürünür; vida yuvaları veya ince detaylara destek atılması engellenir.
* **⚡ Otomatik Sarkma Tespiti (>45°):** Tek tıkla modelin havada kalan ve dikey eksenle 45°'den fazla açı yapan tüm sarkma alanları sarı renge boyanır.
* **Fırça Boyutu Ayarı:** 3 mm ile 30 mm arasında fırça çapı ayarlanabilir.
* **Destek Maliyetine Yansıma:**
  * **Ağaç Destek (Tree Support):** Model dolgusunun ~%15'i veya boyalı alan bazlı ek gramaj.
  * **Klasik Izgara (Snug Support):** Model dolgusunun ~%28'i ek filament tüketimi.
  * Destekli parçalarda destek sökme ve yüzey tesviyesi için ek işçilik süresi maliyete otomatik yansıtılır.

---

## 📑 Müşteri Teklifi & Çıktı

* **PDF / Yazdır**: Tek tıkla yazdırılabilir veya PDF olarak kaydedilebilir şık müşteri teklif fişi oluşturur.
* **WhatsApp Kopyala**: Müşteriye WhatsApp veya Telegram üzerinden doğrudan gönderebileceğiniz özet fiyat kartını panoya kopyalar.

---

## 🧭 Yeni Özellikler & Gelişmiş Atölye Yetenekleri

### 1. 📐 Model Yönlendirme & Tablaya Oturtma (Orientation Toolbar)
* **X +90°, Y +90°, Z +90°:** Modeli istediğiniz eksende 90 derece döndürebilirsiniz.
* **Tablaya Oturt (Lay Flat):** Modelin en alt yüzeyini otomatik olarak Z=0 (tabla) zeminine yapıştırır.
* **Merkezle (Center):** Modeli tablanın tam ortasına (X-Y merkezine) alır.
* Döndürme yapıldığında model boyutları ve tabla sığma durumu anında canlı güncellenir.

### 2. 🌈 3MF Renk Gösterimi & 3D Çok Renkli Model Boyama (Multicolor)
* **3MF Renkli Dosya Desteği:** Bambu Studio, OrcaSlicer veya CAD programlarından gelen renkli 3MF dosyalarındaki orijinal renkleri ve paletleri doğrudan 3D sahnede gerçek renkleriyle görüntüler.
* **Fırça ile Model Boyama:** "Çok Renkli Boyama" sekmesine geçerek 6 farklı filament rengi veya özel renk seçiciyle modelinizin yüzeylerini boyayabilirsiniz.
* **Otomatik Renk Tespiti:** Modeldeki farklı renk sayısı sayılır ve 1'den fazla renk olduğunda çok renkli baskı modu otomatik açılır.

### 3. ♻️ Filament Değişim (Tool Change / Swaps) ve Atık (Poop) Maliyeti
* Çok renkli baskılarda kule (purge tower) ve atık (poop) filament fireleri hesaba katılır:
  $$\text{Atık Filament (g)} = \text{Filament Değişimi (Swaps)} \times \text{Swap Başı Atık (0.8g)}$$
* Her filament değişimindeki ekstra süre (~75 saniye) toplam baskı süresine eklenir; böylece harcanan elektrik, yazıcı aşınması ve dükkan kirası kuruşu kuruşuna doğru hesaplanır.
* Maliyet tablosunda "Çok Renkli Kule/Poop Atığı" satırı olarak şeffaf şekilde gösterilir.

### 4. 🗂️ Dilimlenmiş G-Code (.gcode) Dosyası Desteği
* Dilimleyiciden çıkan `.gcode` dosyasını sürükleyip bırakabilirsiniz.
* G-Code içindeki net filament gramajı, baskı süresi, katman yüksekliği, sıcaklıklar ve takım değişimleri (`T0`, `T1`...) otomatik okunur.
* Modelin takım yolları ve sınır ölçüleri 3D sahnede anında görselleştirilir.

### 5. 🏪 Piyasadaki Hazır 3D Yazıcı Kataloğu (25+ Model)
* "Makine Parkı" sekmesinde yer alan **"Piyasadaki Hazır Yazıcılardan Ekle"** butonuyla:
  * **Bambu Lab:** X1-Carbon, P1S, A1, A1 Mini
  * **Creality:** K1 Max, K1C, Ender-3 V3, Ender-3 V3 SE, Halot Mage Pro 8K (SLA)
  * **Prusa:** MK4/MK4S, XL (Toolchanger), MINI+
  * **Flashforge:** Adventurer 5M, 5M Pro, Creator 4 IDEX
  * **Qidi Tech:** Q1 Pro, X-Max 3, X-Plus 3
  * **Elegoo:** Neptune 4 Pro, Neptune 4 Plus, Saturn 4 Ultra 16K (SLA), Mars 4 Ultra 9K (SLA)
  * **Anycubic:** Kobra 2 Pro, Photon Mono M5s 12K (SLA)
  * Modellerini marka ve FDM/SLA teknolojisine göre filtreleyip tek tıkla filonuza ekleyebilirsiniz.

### 6. 🌐 Ülke Bazlı Filament ve Reçine Markaları Veri Tabanı
* **Türkiye Pazarı (TR):** Filenta PLA/PETG/ABS, Porima PLA/PETG/ABS/TPU, Microzey PLA/Tough/PETG, eSun PLA+/PETG/ePA-CF, Creality Hyper PLA, ABG Filament, Elegoo 16K/Standart Reçine, Anycubic Reçine.
* **Global Pazarı (US/EU):** Bambu Lab PLA/PETG, Polymaker PolyLite/PolyTerra/PA-CF, Prusament PLA/PETG, Sunlu PLA/PETG, Overture PLA/TPU, Siraya Tech Reçine vb.
* Ülke seçildiğinde yerel piyasa fiyatları ve malzeme yoğunlukları otomatik yüklenir.

### 7. 🌍 İki Dilli Destek (Türkçe & English)
* Üst bardaki **TR / EN** butonları veya Ayarlar sekmesindeki açılır menü ile tüm arayüz, uyarılar ve teklif fişi anında iki dilde kullanılabilir.

### 8. ⚡ Canlı & Reaktif Otomatik Hesaplama
* Yazıcı, malzeme, dolgu oranı, kâr marjı, baskı adedi veya renk sayısı değiştirildiği anda tüm maliyet kalemleri ve teklif tutarı milisaniyeler içinde otomatik olarak yeniden hesaplanır.
* Ayarlar sekmesinde varsayılan hedef kâr marjı (%) belirlenebilir ve kaydedilir.

### 9. 📐 Model Boyutlandırma & İnteraktif Ölçekleme (Resize / Scale)
* **Canlı Ölçü Takibi:** Yüklenen modelin gerçek milimetrik boyutları (Genişlik X, Derinlik Y, Yükseklik Z mm) 3D görselleştiricinin hemen altında anlık olarak gösterilir.
* **Orantılı (Uniform) & Bağımsız Boyutlandırma:** İster milimetre cinsinden doğrudan yeni ölçü girin, ister yüzde (%) ölçekleme yapın. "Orantıyı Koru" kilidi ile parça geometrisi bozulmadan otomatik ölçeklenir veya her eksen bağımsız boyutlandırılabilir.
* **Hızlı Ölçek Butonları:** Tek tıkla %50, %75, %100, %125, %150 veya %200 ebatlarına geçiş yapılabilir.
* **Canlı Hacim ve Tabla Güncellemesi:** Model boyutu değiştiğinde 3D mesh anında yeniden ölçeklenir, model hacmi, yüzey alanı, filament gramajı ve tabla sınır aşım durumu milisaniyeler içinde güncellenir.

### 10. 🎯 Gerçekçi Slicer Filament Gramajı Simülasyonu (Kabuk & Duvar Modeli)
* **Kabuk & Duvar Katılaşması:** Basit ham hacim çarpımı yerine, gerçek dilimleyicilerin (Bambu Studio, OrcaSlicer, PrusaSlicer) çalışma mantığı entegre edilmiştir.
* **Kabuk Hacmi Formülü:** Dış perimetre sayısı ($W$), standart nozzle izi ($0.4\text{ mm}$) ve modelin toplam yüzey alanı ($A$) kullanılarak parçanın dış katı kabuğu hesaplanır:
  $$V_{\text{kabuk}} = A \times (W \times 0.04\text{ cm})$$
* **İç Çekirdek Dolgusu:** Kalan iç çekirdek hacmi, kullanıcının seçtiği doluluk oranı (%) ile çarpılarak toplanır:
  $$V_{\text{toplam}} = V_{\text{kabuk}} + ((V_{\text{mesh}} - V_{\text{kabuk}}) \times \text{Dolgu Oranı})$$
* Böylece kutu, heykel veya içi boşluklu parçalarda filament ağırlığı gerçek dilimleyici çıktısıyla birebir tutarlı sonuç verir.

### 11. 💰 Özelleştirilebilir Ek Gider & Maliyet Kalemleri (Kargo, İşçilik, Montaj)
* **Tam Esneklik:** "Atölye Giderleri" sekmesinde yer alan "Özel Maliyet & Gider Kalemleri" tablosu üzerinden atölyenize özel tüm ek masrafları tanımlayabilir, düzenleyebilir veya silebilirsiniz.
* **5 Farklı Hesaplama Türü:**
  * **Sabit Fiyat (TL):** Her siparişe sabit eklenen tutar (Örn: Sabit Kargo Ücreti).
  * **Parça Başı (TL/Adet):** Üretilen parça adediyle çarpılan masraf (Örn: Kutu & Ambalajlama, Pirinç Somun / Heat-set Insert montajı).
  * **Saatlik Ücret (TL/Saat):** Baskı süresiyle orantılı eklenen operasyon maliyeti.
  * **Gram Başı (TL/Gram):** Malzeme ağırlığına bağlı ek sarfiyat.
  * **Yüzde Oranı (%):** Net taban maliyete eklenen ek oran payı (Örn: %5 genel sarfiyat / risk payı).
* **Hesaplama Ekranında Anlık Açma/Kapama:** Her sipariş için geçerli olan kalemleri ana hesaplama ekranında kutucuklarla tek tıkla aktif edebilir veya birim adet/değerlerini değiştirebilirsiniz.

### 12. 🔒 Patrona Özel Detaylı İç Maliyet Raporu & Veritabanı Arşivi
* **Çift Katmanlı Güvenlik & Gizlilik:** Müşteriye sunulan teklif dökümünde elektrik, amortisman, kira payı ve kâr marjı **kesinlikle gizlidir**; müşteri yalnızca şeffaf hizmet ve nihai satış tutarını görür.
* **Patron Raporu Sekmesi (`Maliyet Raporları & Arşiv`):** Yalnızca işletme sahibine özel olarak; harcanan kWh elektrik, yazıcı amortismanı, kira yükü, işçilik, hammadde maliyeti, vergi öncesi net kâr ve kâr marjı detaylı finansal matris olarak sunulur.
* **Yerel Veritabanı Arşivi (`localStorage`):** Hazırlanan her analizi tek tıkla "Arşive Kaydet" butonu ile saklayabilir; geçmiş siparişleri tarih, parça adı, makine, filament ve kâr tutarıyla filtreleyebilir, arşivden geri çağırabilir veya JSON / CSV formatında Excel'e aktarabilirsiniz.

### 13. 🖌️ Boyama Esnasında Sağ Tık Serbest 3D Döndürme & İnceleme Modu
* **Kilitlenmeyen Kamera Denetimi:** Çok Renkli Boyama veya Destek Boyama açıkken fırça modu kamera dönüşünü engellemez.
* **Sağ Tık ile Orbit:** Fırça aktifken farenin **Sağ Tıkına** basılı tutarak modeli 3D uzayda 360° serbestçe döndürebilir, tekerlekle yakınlaştırıp uzaklaştırabilir (Zoom), fırçayla boyama yapmak içinse **Sol Tık** kullanabilirsiniz.
* **"İncele / 3D Döndür" Modu:** Tek tıkla sol tıkı da serbest kamera döndürme moduna alarak modelin arka, alt ve gizli açılarını rahatça inceleyebilirsiniz.
* **Yönlendirme Butonları:** Boyama ve destek sekmelerinde yer alan X+90, Y+90, Z+90, Tablaya Oturt ve Merkezle araçları boyama esnasında da tam erişilebilirdir.

### 14. 🧹 Modeli Kaldırma (Çarpı Butonu) & Kusursuz Sayfa Sıfırlama
* **Temiz Başlangıç:** Model dosya çubuğundaki **X (Kaldır)** butonuna basıldığında; 3D sahne, mesh veya G-Code çizgileri, ebatlar, hacim, gramaj, süre, ek giderler, patron raporu ve müşteri teklif dökümü anında tertemiz sıfırlanır.
* Dosya input'u sıfırlanarak aynı dosyanın tekrar seçilebilmesi sağlanır.

### 15. 📐 O Anki Yönelim Uzayına (Oriented Space) Göre Boyutlandırma & Canlı Eksen Senkronizasyonu
* **Döndürülmüş Konumu Esas Alma:** Model ister X, Y, Z ekseninde 90° çevrilsin, ister "Tablaya Oturt" (Lay Flat) yapılsın; boyutlandırma ve sınırlayıcı kutu (Bounding Box) daima modelin tabladaki o anki güncel uzay pozisyonuna göre hesaplanır.
* **Canlı Eksen Senkronizasyonu (`oninput`):** "Orantıyı Koru" kilidi açıkken X kutusuna yeni bir değer yazdığınız anda, Y ve Z kutuları ile Yüzde (%) kutusu da beklemeden anlık olarak orantılı değişir. Eksenler arası oran hiçbir zaman bozulmaz.

### 16. 🌈 Profesyonel G-Code Takım Yolu (Toolpaths) Görselleştiricisi & Katman Slider'ı
* **Gerçek Takım Yolları:** G-Code dosyaları poligon üçgenler yerine gerçek dilimleyici mimarisinde optimize `THREE.LineSegments` çizgileriyle çizilir.
* **Katman Yüksekliği Termal Renk Gradyanı:** Z seviyesine göre lacivertten camgöbeği, yeşil, sarı ve kırmızıya uzanan zengin bir katman renk paleti uygulanır.
* **İnteraktif Katman Simülatörü:** Sayfanın altına eklenen G-Code Katman Slider'ı ile model 1. katmandan son katmana kadar kaydırılarak katman katman incelenebilir. Seyahat hareketleri (Travel moves) tek tıkla açılıp kapatılabilir.

### 17. 🦈 OrcaSlicer v2.x Tabanlı Dilimleme Motoru ve 3MF Entegrasyonu
* **OrcaSlicer Parametreleri:**
  * **Hat Genişliği (Line Width):** OrcaSlicer standardı olan 0.42 mm hat kalınlığı.
  * **Özel Dolgu Desenleri:** Gyroid (titreşimsiz Orca varsayılanı), Cross Hatch (Orca'nın yeni yüksek hızlı deseni), Grid, Honeycomb ve Adaptive Cubic.
  * **Destek Modelleri:** OrcaSlicer Slim Tree (ince dallı kolay sökülen ağaç destek - %14 ek), OrcaSlicer Tree Hybrid (büyük yapılar için - %20 ek) ve Snug Grid.
* **OrcaSlicer Metadata Desteği:** Dilimlenmiş G-Code ve 3MF dosyalarındaki OrcaSlicer etiketleri (süre, filament gramı, katman yüksekliği, kule atığı) otomatik algılanır.
* **OrcaSlicer 3MF Dışa Aktarma:** Farklı yazıcılara ait 3MF dosyaları atölyenizdeki makinelere ve Filenta PLA ayarlarına OrcaSlicer profil standardında uyarlanıp indirilir.

### 18. ⏱️ Hassas Baskı Süresi Simülasyonu (FDM OrcaSlicer & SLA Reçine)
* **Yazıcı Teknolojisine Özel Ayrım:**
  * **SLA Reçine (Elegoo Saturn 4 Ultra 16K):** Süre hacimden bağımsız olarak $Z$ dikey yüksekliği ve katman sayısına göre hesaplanır. Katman başına UV pozlama süresi (2.1s) + mekanik tilt bırakma süresi (3.1s) ve dip katmanlar (5 katman × 28s) ile cihaz ekranında görünen süreyle birebir örtüşür.
  * **FDM Yazıcılar (Flashforge AD5X, AD5M Pro, Qidi, Creality):** Dış kabuk perimetre akış hızı ($9.5\text{ mm}^3/\text{s}$), iç dolgu akış hızı ($19\text{ mm}^3/\text{s}$), destek ekstrüzyonu, katman başı kafa ivmelenme süresi ($2.2\text{s}$), tabla ısınma/hazırlık süresi ($180\text{s}$) ve çok renkli filament değişim süreleri ($75\text{s/swap}$) toplanarak tam gerçekçi baskı süresi üretilir.
* **Tam Reaktif Güncelleme:** Model boyutu (X, Y, Z veya %), dolgu oranı, duvar sayısı, katman kalınlığı veya yazıcı türü değiştirildiği anda baskı süresi milisaniyeler içinde canlı olarak yeniden hesaplanır ve elektrik, amortisman, kira ve işçilik maliyetlerine kuruşu kuruşuna doğru yansır.

### 19. 🌳 Akıllı Geometrik Destek Analizi & Gramajı (Zero False-Positive)
* **Otomatik Sessiz Yüzey Analizi:** Model sahneye yüklendiğinde veya döndürüldüğünde tüm üçgen normalleri taranır; havada kalan ve dikey eksenle $45^\circ$'den fazla açı yapan gerçek sarkmaların toplam alanı ($A_{\text{overhang}}$) ve bunların taban mesafeleri ($Z_{\text{avg}}$) tespit edilir.
* **Sarkmasız Parçalarda Sıfır Hata (0g Destek):** Kutu, vazo veya altı düz parçalarda gereksiz yere destek gramajı ve haksız destek temizleme işçiliği eklenmesi engellendi; sarkma yoksa destek otomatik olarak **"Sarkma Yok / Desteksiz (0g)"** olarak belirlenir.
* **Sarkma Varsa Gerçekçi Ağaç & Izgara Destek Hesabı:** OrcaSlicer Slim Tree ve Snug Grid formülleriyle sarkan yüzeyin tabladan yüksekliği hesaba katılarak hassas destek gramajı hesaplanır.
* **Dilimlenmiş Dosyalarda Çift Sayma Koruması:** G-Code veya 3MF dosyası zaten destek dahil net ağırlık içeriyorsa destek gramajı ekstradan eklenmez; *"Dosyaya Dahil (0g Ek)"* olarak etiketlenir.
