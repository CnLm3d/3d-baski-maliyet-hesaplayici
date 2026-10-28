using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Text;
using System.Windows.Forms;

namespace CostCalculator3DSetup
{
    // ==========================================
    // MAKİNE MODELİ
    // ==========================================
    public class PrinterItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; } // "fdm" veya "sla"
        public int Count { get; set; }
        public double BedX { get; set; }
        public double BedY { get; set; }
        public double BedZ { get; set; }
        public double PowerWatts { get; set; }
        public double PurchasePrice { get; set; }
        public double LifespanHours { get; set; }
        public double WearPerHour { get; set; }
    }

    // ==========================================
    // ORCA SLICER HAZIR PROFİL MODELİ
    // ==========================================
    public class OrcaPrinterPreset
    {
        public string Id { get; set; }
        public string Brand { get; set; }
        public string DisplayName { get; set; }
        public string Name { get; set; }
        public string Type { get; set; } // "fdm" veya "sla"
        public double BedX { get; set; }
        public double BedY { get; set; }
        public double BedZ { get; set; }
        public double PowerWatts { get; set; }
        public double PurchasePrice { get; set; }
        public double LifespanHours { get; set; }
        public double WearPerHour { get; set; }

        public override string ToString()
        {
            return DisplayName;
        }
    }

    // ==========================================
    // KURULUM SİHİRBAZI ANA PENCERESİ
    // ==========================================
    public class SetupWizardForm : Form
    {
        // Renk Paleti
        private Color cHeaderBg = Color.FromArgb(15, 23, 42);       // Slate 900
        private Color cSidebarBg = Color.FromArgb(30, 41, 59);      // Slate 800
        private Color cSidebarActive = Color.FromArgb(79, 70, 229);  // Indigo 600
        private Color cContentBg = Color.FromArgb(248, 250, 252);   // Slate 50
        private Color cTextDark = Color.FromArgb(15, 23, 42);
        private Color cTextMuted = Color.FromArgb(100, 116, 139);

        // Durum Değişkenleri
        private int currentStep = 0; // 0: Dil/Hoşgeldiniz, 1: Dizin, 2: Firma/Logo, 3: Filo, 4: Atölye Maliyet, 5: Kısayol/Yükle, 6: Bitiş
        private string currentLang = "tr"; // "tr" veya "en"
        private string base64Logo = "";
        private List<PrinterItem> printerFleet = new List<PrinterItem>();
        private List<OrcaPrinterPreset> orcaPresets = new List<OrcaPrinterPreset>();

        // Üst Banner ve Sol Menü
        private Panel pnlHeader;
        private Label lblHeaderTitle;
        private Label lblHeaderSubtitle;
        private Panel pnlSidebar;
        private Label[] lblSteps;

        // Alt Buton Alanı
        private Panel pnlFooter;
        private Button btnBack;
        private Button btnNext;
        private Button btnCancel;

        // İçerik Panelleri (7 Adım)
        private Panel pnlContentContainer;
        private Panel[] stepPanels;

        // --- Adım 0: Dil ve Karşılama ---
        private Button btnLangCardTr;
        private Button btnLangCardEn;
        private Label lblWelcomeTitle;
        private Label lblWelcomeDesc;

        // --- Adım 1: Kurulum Konumu ---
        private TextBox txtInstallPath;
        private Button btnBrowsePath;
        private Label lblPathDesc;
        private Label lblDiskSpace;

        // --- Adım 2: Firma Bilgileri ve Logo ---
        private TextBox txtCompanyName;
        private TextBox txtCompanyContact;
        private TextBox txtCompanyPhone;
        private TextBox txtCompanyEmail;
        private TextBox txtCompanyAddress;
        private PictureBox picLogoPreview;
        private Button btnSelectLogo;
        private Button btnRemoveLogo;
        private Label lblLogoStatus;

        // --- Adım 3: Makine Parkı (Orca Slicer Geniş Kataloğu) ---
        private ComboBox cbBrandFilter;
        private ComboBox cbOrcaCatalog;
        private NumericUpDown numCatalogAddCount;
        private Button btnAddFromCatalog;
        private ListView lvPrinters;
        private Button btnAddCustomPrinter;
        private Button btnRemovePrinter;
        private Button btnIncPrinterCount;
        private Button btnDecPrinterCount;
        private Label lblFleetSummary;

        // --- Adım 4: Atölye Maliyet Temelleri ---
        private NumericUpDown numRent;
        private NumericUpDown numBills;
        private NumericUpDown numElectricity;
        private NumericUpDown numMargin;
        private NumericUpDown numDesignHourly;
        private NumericUpDown numLaborHourly;

        // --- Adım 5: Kısayollar ve İlerleme ---
        private CheckBox chkDesktopShortcut;
        private CheckBox chkStartMenuShortcut;
        private Label lblInstallSummary;
        private ProgressBar progressBar;
        private Label lblInstallStatus;

        // --- Adım 6: Tamamlandı ---
        private Label lblFinishTitle;
        private Label lblFinishDesc;
        private CheckBox chkLaunchNow;

        public SetupWizardForm()
        {
            InitializeOrcaPresets();
            InitializeFleetDefaults();
            InitializeComponentLayout();
            ApplyLanguage(currentLang);
            ShowStep(0);
        }

        // ==========================================
        // MAKİNE PARKI BAŞLANGIÇTA TAMAMEN BOŞ GELİR
        // (KULLANICI LİSTEDEN SEÇECEK)
        // ==========================================
        private void InitializeFleetDefaults()
        {
            printerFleet.Clear();
        }

        public void AddPresetPrinter(string id, int count)
        {
            OrcaPrinterPreset p = orcaPresets.Find(x => x.Id == id);
            if (p != null)
            {
                printerFleet.Add(new PrinterItem
                {
                    Id = p.Id,
                    Name = p.Name,
                    Type = p.Type,
                    Count = count,
                    BedX = p.BedX,
                    BedY = p.BedY,
                    BedZ = p.BedZ,
                    PowerWatts = p.PowerWatts,
                    PurchasePrice = p.PurchasePrice,
                    LifespanHours = p.LifespanHours,
                    WearPerHour = p.WearPerHour
                });
            }
        }

        // ==========================================
        // ORCA SLICER KAPSAMLI CİHAZ PROFİLLERİ LİSTESİ
        // ==========================================
        private void InitializeOrcaPresets()
        {
            orcaPresets.Clear();

            // Creality
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_hi_combo", Brand = "Creality", Name = "Creality Hi / Hi Combo", DisplayName = "Creality Hi / Hi Combo (260 × 260 × 300 mm - 500mm/s)", Type = "fdm", BedX = 260, BedY = 260, BedZ = 300, PowerWatts = 350, PurchasePrice = 28000, LifespanHours = 5000, WearPerHour = 2.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_k1c", Brand = "Creality", Name = "Creality K1C (Karbon Uyumlu)", DisplayName = "Creality K1C (220 × 220 × 250 mm - 600mm/s)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 250, PowerWatts = 350, PurchasePrice = 22500, LifespanHours = 4500, WearPerHour = 2.40 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_k1_max", Brand = "Creality", Name = "Creality K1 Max", DisplayName = "Creality K1 Max (300 × 300 × 300 mm - AI Kameralı)", Type = "fdm", BedX = 300, BedY = 300, BedZ = 300, PowerWatts = 1000, PurchasePrice = 34000, LifespanHours = 5000, WearPerHour = 3.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_k1", Brand = "Creality", Name = "Creality K1 / K1 SE", DisplayName = "Creality K1 / K1 SE (220 × 220 × 250 mm)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 250, PowerWatts = 350, PurchasePrice = 19500, LifespanHours = 4000, WearPerHour = 2.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_ender3_v3", Brand = "Creality", Name = "Creality Ender-3 V3 (CoreXZ)", DisplayName = "Creality Ender-3 V3 CoreXZ (220 × 220 × 250 mm)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 250, PowerWatts = 350, PurchasePrice = 14500, LifespanHours = 3500, WearPerHour = 1.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_ender3_v3_plus", Brand = "Creality", Name = "Creality Ender-3 V3 Plus", DisplayName = "Creality Ender-3 V3 Plus (300 × 300 × 330 mm)", Type = "fdm", BedX = 300, BedY = 300, BedZ = 330, PowerWatts = 350, PurchasePrice = 18500, LifespanHours = 4000, WearPerHour = 2.00 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_ender3_v3_ke", Brand = "Creality", Name = "Creality Ender-3 V3 KE", DisplayName = "Creality Ender-3 V3 KE (220 × 220 × 240 mm - 500mm/s)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 240, PowerWatts = 350, PurchasePrice = 12500, LifespanHours = 3500, WearPerHour = 1.60 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_ender3_v3_se", Brand = "Creality", Name = "Creality Ender-3 V3 SE", DisplayName = "Creality Ender-3 V3 SE (220 × 220 × 250 mm)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 250, PowerWatts = 350, PurchasePrice = 9500, LifespanHours = 3000, WearPerHour = 1.40 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_ender3_s1_pro", Brand = "Creality", Name = "Creality Ender-3 S1 Pro", DisplayName = "Creality Ender-3 S1 Pro (220 × 220 × 270 mm)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 270, PowerWatts = 350, PurchasePrice = 13500, LifespanHours = 3500, WearPerHour = 1.70 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_cr_m4", Brand = "Creality", Name = "Creality CR-M4 (Dev Hacim)", DisplayName = "Creality CR-M4 Dev Tabla (450 × 450 × 470 mm)", Type = "fdm", BedX = 450, BedY = 450, BedZ = 470, PowerWatts = 800, PurchasePrice = 45000, LifespanHours = 5500, WearPerHour = 4.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "creality_halot_mage_pro", Brand = "Creality", Name = "Creality Halot Mage Pro 8K", DisplayName = "Creality Halot Mage Pro (228 × 128 × 230 mm - 8K SLA)", Type = "sla", BedX = 228, BedY = 128, BedZ = 230, PowerWatts = 150, PurchasePrice = 24000, LifespanHours = 2500, WearPerHour = 3.80 });

            // FlashForge
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_ad5x", Brand = "FlashForge", Name = "FlashForge Adventurer 5X (AD5X)", DisplayName = "FlashForge Adventurer 5X (220 × 220 × 220 mm - 600mm/s)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 220, PowerWatts = 200, PurchasePrice = 18000, LifespanHours = 4500, WearPerHour = 1.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_ad5m_pro", Brand = "FlashForge", Name = "FlashForge Adventurer 5M Pro", DisplayName = "FlashForge AD5M Pro (220 × 220 × 220 mm - HEPA Filtre)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 220, PowerWatts = 220, PurchasePrice = 22000, LifespanHours = 4500, WearPerHour = 2.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_ad5m", Brand = "FlashForge", Name = "FlashForge Adventurer 5M", DisplayName = "FlashForge Adventurer 5M (220 × 220 × 220 mm)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 220, PowerWatts = 200, PurchasePrice = 15500, LifespanHours = 4000, WearPerHour = 1.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_ad4_pro", Brand = "FlashForge", Name = "FlashForge Adventurer 4 Pro", DisplayName = "FlashForge Adventurer 4 Pro (220 × 200 × 250 mm)", Type = "fdm", BedX = 220, BedY = 200, BedZ = 250, PowerWatts = 260, PurchasePrice = 24000, LifespanHours = 4500, WearPerHour = 2.40 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_creator_4", Brand = "FlashForge", Name = "FlashForge Creator 4 (Endüstriyel IDEX)", DisplayName = "FlashForge Creator 4 IDEX (400 × 350 × 500 mm)", Type = "fdm", BedX = 400, BedY = 350, BedZ = 500, PowerWatts = 850, PurchasePrice = 92000, LifespanHours = 8000, WearPerHour = 6.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "ff_guider_3_plus", Brand = "FlashForge", Name = "FlashForge Guider 3 Plus", DisplayName = "FlashForge Guider 3 Plus (350 × 350 × 600 mm)", Type = "fdm", BedX = 350, BedY = 350, BedZ = 600, PowerWatts = 650, PurchasePrice = 75000, LifespanHours = 7000, WearPerHour = 5.00 });

            // Bambu Lab
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_x1c", Brand = "Bambu Lab", Name = "Bambu Lab X1-Carbon Combo", DisplayName = "Bambu Lab X1-Carbon Combo (256 × 256 × 256 mm)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 350, PurchasePrice = 48000, LifespanHours = 5000, WearPerHour = 3.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_x1e", Brand = "Bambu Lab", Name = "Bambu Lab X1E (Endüstriyel)", DisplayName = "Bambu Lab X1E Ethernet/Isıtmalı Hazne (256 × 256 × 256 mm)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 500, PurchasePrice = 78000, LifespanHours = 6000, WearPerHour = 4.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_p1s", Brand = "Bambu Lab", Name = "Bambu Lab P1S Combo", DisplayName = "Bambu Lab P1S Combo (256 × 256 × 256 mm - Kapalı Kasa)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 350, PurchasePrice = 32000, LifespanHours = 4500, WearPerHour = 2.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_p1p", Brand = "Bambu Lab", Name = "Bambu Lab P1P", DisplayName = "Bambu Lab P1P (256 × 256 × 256 mm - Açık Kasa)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 300, PurchasePrice = 24000, LifespanHours = 4000, WearPerHour = 2.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_a1", Brand = "Bambu Lab", Name = "Bambu Lab A1 Combo", DisplayName = "Bambu Lab A1 Combo (256 × 256 × 256 mm - AMS Lite)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 250, PurchasePrice = 21000, LifespanHours = 4000, WearPerHour = 2.00 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "bambu_a1_mini", Brand = "Bambu Lab", Name = "Bambu Lab A1 Mini Combo", DisplayName = "Bambu Lab A1 Mini (180 × 180 × 180 mm - AMS Lite)", Type = "fdm", BedX = 180, BedY = 180, BedZ = 180, PowerWatts = 150, PurchasePrice = 12500, LifespanHours = 3500, WearPerHour = 1.50 });

            // Qidi Tech
            orcaPresets.Add(new OrcaPrinterPreset { Id = "qidi_q1_pro", Brand = "Qidi Tech", Name = "Qidi Q1 Pro (60°C Isıtmalı Hazne)", DisplayName = "Qidi Q1 Pro (250 × 250 × 250 mm - 60°C Aktif Hazne)", Type = "fdm", BedX = 250, BedY = 250, BedZ = 250, PowerWatts = 380, PurchasePrice = 26500, LifespanHours = 5000, WearPerHour = 2.90 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "qidi_x_plus_3", Brand = "Qidi Tech", Name = "Qidi X-Plus 3", DisplayName = "Qidi X-Plus 3 (280 × 280 × 270 mm - 65°C Hazne)", Type = "fdm", BedX = 280, BedY = 280, BedZ = 270, PowerWatts = 400, PurchasePrice = 32000, LifespanHours = 5000, WearPerHour = 3.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "qidi_x_max_3", Brand = "Qidi Tech", Name = "Qidi X-Max 3 (Büyük Hacim)", DisplayName = "Qidi X-Max 3 (325 × 325 × 315 mm - 65°C Hazne)", Type = "fdm", BedX = 325, BedY = 325, BedZ = 315, PowerWatts = 450, PurchasePrice = 42000, LifespanHours = 5500, WearPerHour = 3.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "qidi_x_smart_3", Brand = "Qidi Tech", Name = "Qidi X-Smart 3", DisplayName = "Qidi X-Smart 3 (175 × 180 × 170 mm - 500mm/s)", Type = "fdm", BedX = 175, BedY = 180, BedZ = 170, PowerWatts = 200, PurchasePrice = 14500, LifespanHours = 3500, WearPerHour = 1.60 });

            // Elegoo
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_saturn4_ultra", Brand = "Elegoo", Name = "Elegoo Saturn 4 Ultra 16K SLA", DisplayName = "Elegoo Saturn 4 Ultra (218.88 × 122.88 × 220 mm - 16K SLA)", Type = "sla", BedX = 218.88, BedY = 122.88, BedZ = 220, PowerWatts = 100, PurchasePrice = 26000, LifespanHours = 2500, WearPerHour = 3.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_saturn3_ultra", Brand = "Elegoo", Name = "Elegoo Saturn 3 Ultra 12K SLA", DisplayName = "Elegoo Saturn 3 Ultra (218.88 × 122.88 × 250 mm - 12K SLA)", Type = "sla", BedX = 218.88, BedY = 122.88, BedZ = 250, PowerWatts = 100, PurchasePrice = 22000, LifespanHours = 2500, WearPerHour = 3.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_mars5_ultra", Brand = "Elegoo", Name = "Elegoo Mars 5 Ultra 9K SLA", DisplayName = "Elegoo Mars 5 Ultra (153.36 × 77.76 × 165 mm - Tilt Release)", Type = "sla", BedX = 153.36, BedY = 77.76, BedZ = 165, PowerWatts = 72, PurchasePrice = 16500, LifespanHours = 2000, WearPerHour = 2.90 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_mars4_ultra", Brand = "Elegoo", Name = "Elegoo Mars 4 Ultra 9K SLA", DisplayName = "Elegoo Mars 4 Ultra (153.36 × 77.76 × 165 mm - 9K SLA)", Type = "sla", BedX = 153.36, BedY = 77.76, BedZ = 165, PowerWatts = 72, PurchasePrice = 14500, LifespanHours = 2000, WearPerHour = 2.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_jupiter_se", Brand = "Elegoo", Name = "Elegoo Jupiter SE (Dev Reçine)", DisplayName = "Elegoo Jupiter SE (277.85 × 156.26 × 300 mm - 6K SLA)", Type = "sla", BedX = 277.85, BedY = 156.26, BedZ = 300, PowerWatts = 150, PurchasePrice = 42000, LifespanHours = 3000, WearPerHour = 4.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_neptune4_pro", Brand = "Elegoo", Name = "Elegoo Neptune 4 Pro", DisplayName = "Elegoo Neptune 4 Pro (225 × 225 × 265 mm - 500mm/s)", Type = "fdm", BedX = 225, BedY = 225, BedZ = 265, PowerWatts = 300, PurchasePrice = 13500, LifespanHours = 3500, WearPerHour = 1.70 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_neptune4_plus", Brand = "Elegoo", Name = "Elegoo Neptune 4 Plus", DisplayName = "Elegoo Neptune 4 Plus (320 × 320 × 385 mm)", Type = "fdm", BedX = 320, BedY = 320, BedZ = 385, PowerWatts = 400, PurchasePrice = 19500, LifespanHours = 4000, WearPerHour = 2.30 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "elegoo_neptune4_max", Brand = "Elegoo", Name = "Elegoo Neptune 4 Max (Dev Tabla)", DisplayName = "Elegoo Neptune 4 Max (420 × 420 × 480 mm)", Type = "fdm", BedX = 420, BedY = 420, BedZ = 480, PowerWatts = 650, PurchasePrice = 27000, LifespanHours = 4500, WearPerHour = 3.20 });

            // Anycubic
            orcaPresets.Add(new OrcaPrinterPreset { Id = "anycubic_kobra_3_combo", Brand = "Anycubic", Name = "Anycubic Kobra 3 Combo (Çok Renkli)", DisplayName = "Anycubic Kobra 3 Combo (250 × 250 × 260 mm - 600mm/s)", Type = "fdm", BedX = 250, BedY = 250, BedZ = 260, PowerWatts = 350, PurchasePrice = 22000, LifespanHours = 4000, WearPerHour = 2.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "anycubic_kobra_2_pro", Brand = "Anycubic", Name = "Anycubic Kobra 2 Pro", DisplayName = "Anycubic Kobra 2 Pro (220 × 220 × 250 mm - 500mm/s)", Type = "fdm", BedX = 220, BedY = 220, BedZ = 250, PowerWatts = 260, PurchasePrice = 13800, LifespanHours = 3500, WearPerHour = 1.80 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "anycubic_kobra_2_max", Brand = "Anycubic", Name = "Anycubic Kobra 2 Max (Büyük Hacim)", DisplayName = "Anycubic Kobra 2 Max (420 × 420 × 500 mm)", Type = "fdm", BedX = 420, BedY = 420, BedZ = 500, PowerWatts = 600, PurchasePrice = 29000, LifespanHours = 4500, WearPerHour = 3.40 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "anycubic_mono_m5s_pro", Brand = "Anycubic", Name = "Anycubic Photon Mono M5s Pro 14K", DisplayName = "Anycubic Photon Mono M5s Pro (223.78 × 126.38 × 200 mm - 14K SLA)", Type = "sla", BedX = 223.78, BedY = 126.38, BedZ = 200, PowerWatts = 110, PurchasePrice = 24000, LifespanHours = 2500, WearPerHour = 3.60 });

            // Prusa
            orcaPresets.Add(new OrcaPrinterPreset { Id = "prusa_mk4s", Brand = "Prusa", Name = "Prusa MK4S (Yüksek Hızlı)", DisplayName = "Prusa MK4S (250 × 210 × 220 mm - 360° Fan)", Type = "fdm", BedX = 250, BedY = 210, BedZ = 220, PowerWatts = 200, PurchasePrice = 42000, LifespanHours = 6000, WearPerHour = 2.30 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "prusa_mk4", Brand = "Prusa", Name = "Prusa MK4", DisplayName = "Prusa MK4 (250 × 210 × 220 mm)", Type = "fdm", BedX = 250, BedY = 210, BedZ = 220, PowerWatts = 200, PurchasePrice = 38000, LifespanHours = 6000, WearPerHour = 2.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "prusa_xl", Brand = "Prusa", Name = "Prusa XL (Toolchanger)", DisplayName = "Prusa XL Çoklu Kafa (360 × 360 × 360 mm)", Type = "fdm", BedX = 360, BedY = 360, BedZ = 360, PowerWatts = 450, PurchasePrice = 98000, LifespanHours = 7000, WearPerHour = 5.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "prusa_mini", Brand = "Prusa", Name = "Prusa MINI+", DisplayName = "Prusa MINI+ (180 × 180 × 180 mm)", Type = "fdm", BedX = 180, BedY = 180, BedZ = 180, PowerWatts = 160, PurchasePrice = 19500, LifespanHours = 4500, WearPerHour = 1.60 });

            // Voron & Özel
            orcaPresets.Add(new OrcaPrinterPreset { Id = "voron_2_4_350", Brand = "Voron / Diğer", Name = "Voron 2.4 (350mm)", DisplayName = "Voron 2.4 (350 × 350 × 350 mm - Özel CoreXY)", Type = "fdm", BedX = 350, BedY = 350, BedZ = 350, PowerWatts = 500, PurchasePrice = 48000, LifespanHours = 6000, WearPerHour = 3.50 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "voron_2_4_300", Brand = "Voron / Diğer", Name = "Voron 2.4 (300mm)", DisplayName = "Voron 2.4 (300 × 300 × 300 mm)", Type = "fdm", BedX = 300, BedY = 300, BedZ = 300, PowerWatts = 450, PurchasePrice = 42000, LifespanHours = 6000, WearPerHour = 3.20 });
            orcaPresets.Add(new OrcaPrinterPreset { Id = "twotrees_sk1", Brand = "Voron / Diğer", Name = "TwoTrees SK1", DisplayName = "TwoTrees SK1 (256 × 256 × 256 mm - 700mm/s)", Type = "fdm", BedX = 256, BedY = 256, BedZ = 256, PowerWatts = 350, PurchasePrice = 23000, LifespanHours = 4000, WearPerHour = 2.40 });
        }

        // ==========================================
        // ARAYÜZ KONTROLLERİ VE GENİŞLETİLMİŞ DÜZEN
        // (DPI UYUMLU, SCROLL DESTEKLİ, SIKINTISIZ)
        // ==========================================
        private void InitializeComponentLayout()
        {
            this.Text = "3D Baskı Maliyet ve Teklif Robotu - Kurulum Sihirbazı";
            this.Size = new Size(960, 680);
            this.MinimumSize = new Size(920, 640);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = cContentBg;
            this.Font = new Font("Segoe UI", 9.25f, FontStyle.Regular);

            try
            {
                this.Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
            }
            catch { }

            // 1. ÜST HEADER
            pnlHeader = new Panel
            {
                Dock = DockStyle.Top,
                Height = 70,
                BackColor = cHeaderBg
            };

            Label lblBadge = new Label
            {
                Text = "3D",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = Color.White,
                BackColor = cSidebarActive,
                Size = new Size(42, 42),
                Location = new Point(18, 14),
                TextAlign = ContentAlignment.MiddleCenter
            };
            pnlHeader.Controls.Add(lblBadge);

            lblHeaderTitle = new Label
            {
                Text = "3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı",
                Font = new Font("Segoe UI", 12f, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(70, 13),
                AutoSize = true
            };
            pnlHeader.Controls.Add(lblHeaderTitle);

            lblHeaderSubtitle = new Label
            {
                Text = "Orca Slicer Tabanlı Atölye Kurulum ve Profil Yöneticisi v2.6 Pro",
                Font = new Font("Segoe UI", 8.5f, FontStyle.Regular),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(72, 38),
                AutoSize = true
            };
            pnlHeader.Controls.Add(lblHeaderSubtitle);

            // 2. ALT FOOTER BUTONLARI
            pnlFooter = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 62,
                BackColor = Color.FromArgb(241, 245, 249)
            };

            Panel lineTop = new Panel
            {
                Dock = DockStyle.Top,
                Height = 1,
                BackColor = Color.FromArgb(226, 232, 240)
            };
            pnlFooter.Controls.Add(lineTop);

            btnCancel = new Button
            {
                Text = "İptal",
                Size = new Size(100, 36),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System
            };
            btnCancel.Click += (s, e) => { if (ConfirmExit()) this.Close(); };
            pnlFooter.Controls.Add(btnCancel);

            btnNext = new Button
            {
                Text = "İleri >",
                Size = new Size(120, 36),
                BackColor = cSidebarActive,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.System,
                Font = new Font("Segoe UI", 9.25f, FontStyle.Bold)
            };
            btnNext.Click += BtnNext_Click;
            pnlFooter.Controls.Add(btnNext);

            btnBack = new Button
            {
                Text = "< Geri",
                Size = new Size(100, 36),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System,
                Enabled = false
            };
            btnBack.Click += BtnBack_Click;
            pnlFooter.Controls.Add(btnBack);

            pnlFooter.Resize += (s, e) => LayoutFooterButtons();

            // 3. SOL SİDEBAR
            pnlSidebar = new Panel
            {
                Dock = DockStyle.Left,
                Width = 220,
                BackColor = cSidebarBg,
                Padding = new Padding(12, 16, 12, 16)
            };

            string[] stepTitles = new string[]
            {
                "1. Dil & Karşılama",
                "2. Kurulum Konumu",
                "3. Firma & Logo",
                "4. Makine Parkı",
                "5. Atölye Maliyetleri",
                "6. Kurulumu Başlat",
                "7. Tamamlandı"
            };

            lblSteps = new Label[stepTitles.Length];
            for (int i = 0; i < stepTitles.Length; i++)
            {
                lblSteps[i] = new Label
                {
                    Text = stepTitles[i],
                    Font = new Font("Segoe UI", 9f, FontStyle.Regular),
                    ForeColor = Color.FromArgb(148, 163, 184),
                    Location = new Point(14, 20 + (i * 46)),
                    Size = new Size(190, 34),
                    TextAlign = ContentAlignment.MiddleLeft,
                    Padding = new Padding(10, 0, 0, 0)
                };
                pnlSidebar.Controls.Add(lblSteps[i]);
            }

            // 4. İÇERİK KONTEYNERİ (KAYDIRMA DESTEKLİ, ASLA TAŞMAZ)
            pnlContentContainer = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = Color.White,
                AutoScroll = true,
                Padding = new Padding(24, 20, 24, 20)
            };

            // DOCK SIRALAMASI: (WinForms ters sırada işler)
            // 1. Önce pnlContentContainer (Fill) eklenir ki en son dock edilip kalan alanı doldursun
            // 2. pnlSidebar (Left) eklenir
            // 3. pnlFooter (Bottom) eklenir
            // 4. pnlHeader (Top) eklenir ki en başta tam genişlikle tavana yapışsın
            this.Controls.Add(pnlContentContainer);
            this.Controls.Add(pnlSidebar);
            this.Controls.Add(pnlFooter);
            this.Controls.Add(pnlHeader);

            // 7 ADET ADIM PANELİ OLUŞTUR
            stepPanels = new Panel[7];
            for (int i = 0; i < 7; i++)
            {
                stepPanels[i] = new Panel
                {
                    Dock = DockStyle.Fill,
                    Visible = false,
                    BackColor = Color.White,
                    AutoScroll = true
                };
                pnlContentContainer.Controls.Add(stepPanels[i]);
            }

            BuildStep0_LanguageWelcome();
            BuildStep1_InstallPath();
            BuildStep2_CompanyProfile();
            BuildStep3_PrinterFleet();
            BuildStep4_WorkshopCosts();
            BuildStep5_InstallProgress();
            BuildStep6_Finished();

            LayoutFooterButtons();
        }

        private void LayoutFooterButtons()
        {
            if (pnlFooter == null || btnCancel == null || btnNext == null || btnBack == null) return;
            int margin = 20;
            int gap = 12;
            int w = pnlFooter.ClientSize.Width;
            if (w <= 0) w = this.ClientSize.Width > 0 ? this.ClientSize.Width : 944;
            btnCancel.Location = new Point(w - btnCancel.Width - margin, 13);
            btnNext.Location = new Point(btnCancel.Left - btnNext.Width - gap, 13);
            btnBack.Location = new Point(btnNext.Left - btnBack.Width - gap, 13);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            LayoutFooterButtons();
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            LayoutFooterButtons();
        }

        // ==========================================
        // ADIM 0: DİL & HOŞ GELDİNİZ (KART BUTONLAR - ASLA KAYBOLMAZ)
        // ==========================================
        private void BuildStep0_LanguageWelcome()
        {
            Panel p = stepPanels[0];

            lblWelcomeTitle = new Label
            {
                Text = "3D Baskı Maliyet ve Teklif Robotuna Hoş Geldiniz",
                Font = new Font("Segoe UI", 14f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblWelcomeTitle);

            lblWelcomeDesc = new Label
            {
                Text = "Bu sihirbaz, 3D baskı atölyeniz için profesyonel maliyet hesaplama, kâr optimizasyonu,\nfilo yönetimi ve kurumsal müşteri teklifi fiş sistemini bilgisayarınıza kuracaktır.\n\nLütfen kuruluma başlamadan önce tercih ettiğiniz dili kartlara tıklayarak seçiniz:",
                Font = new Font("Segoe UI", 9.5f),
                ForeColor = cTextMuted,
                Location = new Point(12, 45),
                Size = new Size(650, 75)
            };
            p.Controls.Add(lblWelcomeDesc);

            // TÜRKÇE DİL KARTI (Görsel ve Büyük)
            btnLangCardTr = new Button
            {
                Text = "🇹🇷  TÜRKÇE (TR)\n\n• Türkiye Pazarı Malzeme Kataloğu (Porima, Filenta, Microzey)\n• Türk Lirası (TL) Tabanlı Maliyet ve KDV Hesaplama\n• Türkçe Müşteri Teklif Fişi & Raporlar",
                Location = new Point(15, 135),
                Size = new Size(310, 120),
                Font = new Font("Segoe UI", 9.25f, FontStyle.Bold),
                TextAlign = ContentAlignment.TopLeft,
                Padding = new Padding(12),
                Cursor = Cursors.Hand,
                FlatStyle = FlatStyle.Flat
            };
            btnLangCardTr.Click += (s, e) => { SetSelectedLanguage("tr"); };
            p.Controls.Add(btnLangCardTr);

            // İNGİLİZCE DİL KARTI
            btnLangCardEn = new Button
            {
                Text = "🇬🇧  ENGLISH (EN)\n\n• Global Filament Catalog (Bambu, Polymaker, Prusament)\n• Multi-Currency Costing & Flexible Margin Engine\n• International Customer Quote Receipts & Exports",
                Location = new Point(340, 135),
                Size = new Size(310, 120),
                Font = new Font("Segoe UI", 9.25f, FontStyle.Bold),
                TextAlign = ContentAlignment.TopLeft,
                Padding = new Padding(12),
                Cursor = Cursors.Hand,
                FlatStyle = FlatStyle.Flat
            };
            btnLangCardEn.Click += (s, e) => { SetSelectedLanguage("en"); };
            p.Controls.Add(btnLangCardEn);

            Label lblFeatureBox = new Label
            {
                Text = "✓ Orca Slicer Resmi Cihaz Kataloğu (Creality, Bambu, FlashForge, Qidi, Elegoo, Prusa)\n✓ Nozzle Sıcaklığı, Tabla Isısı ve Filament Yoğunluğu (g/cm³) Otomatik Algılama\n✓ 3MF / STL / G-Code 3D Tabla Görselleştirici & Otomatik Dilimleme Analizi\n✓ Kurumsal Müşteri Teklifi Fişi (Logo Destekli) ve Patron Maliyet Arşivi",
                Font = new Font("Segoe UI", 9f),
                ForeColor = Color.FromArgb(51, 65, 85),
                BackColor = Color.FromArgb(241, 245, 249),
                Location = new Point(15, 275),
                Size = new Size(635, 100),
                Padding = new Padding(14, 12, 14, 12)
            };
            p.Controls.Add(lblFeatureBox);

            UpdateLanguageCardStyles();
        }

        private void SetSelectedLanguage(string lang)
        {
            currentLang = lang;
            UpdateLanguageCardStyles();
            ApplyLanguage(lang);
        }

        private void UpdateLanguageCardStyles()
        {
            if (currentLang == "tr")
            {
                btnLangCardTr.BackColor = Color.FromArgb(238, 242, 255);
                btnLangCardTr.ForeColor = cSidebarActive;
                btnLangCardTr.FlatAppearance.BorderColor = cSidebarActive;
                btnLangCardTr.FlatAppearance.BorderSize = 2;

                btnLangCardEn.BackColor = Color.White;
                btnLangCardEn.ForeColor = cTextDark;
                btnLangCardEn.FlatAppearance.BorderColor = Color.FromArgb(203, 213, 225);
                btnLangCardEn.FlatAppearance.BorderSize = 1;
            }
            else
            {
                btnLangCardEn.BackColor = Color.FromArgb(238, 242, 255);
                btnLangCardEn.ForeColor = cSidebarActive;
                btnLangCardEn.FlatAppearance.BorderColor = cSidebarActive;
                btnLangCardEn.FlatAppearance.BorderSize = 2;

                btnLangCardTr.BackColor = Color.White;
                btnLangCardTr.ForeColor = cTextDark;
                btnLangCardTr.FlatAppearance.BorderColor = Color.FromArgb(203, 213, 225);
                btnLangCardTr.FlatAppearance.BorderSize = 1;
            }
        }

        // ==========================================
        // ADIM 1: KURULUM KONUMU
        // ==========================================
        private void BuildStep1_InstallPath()
        {
            Panel p = stepPanels[1];

            Label lblTitle = new Label
            {
                Text = "Kurulum Hedef Klasörünü Seçin",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblTitle);

            lblPathDesc = new Label
            {
                Text = "Uygulama dosyaları aşağıdaki dizine kurulacaktır. Farklı bir klasöre kurmak için\n'Gözat...' butonuna tıklayabilirsiniz.",
                Font = new Font("Segoe UI", 9.5f),
                ForeColor = cTextMuted,
                Location = new Point(12, 45),
                Size = new Size(640, 45)
            };
            p.Controls.Add(lblPathDesc);

            string defaultPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs\\3D_Maliyet_Hesaplayici");
            txtInstallPath = new TextBox
            {
                Text = defaultPath,
                Font = new Font("Segoe UI", 10f),
                Location = new Point(14, 105),
                Size = new Size(510, 28)
            };
            txtInstallPath.TextChanged += (s, e) => UpdateDiskSpaceInfo();
            p.Controls.Add(txtInstallPath);

            btnBrowsePath = new Button
            {
                Text = "Gözat...",
                Font = new Font("Segoe UI", 9f),
                Location = new Point(532, 104),
                Size = new Size(110, 31),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System
            };
            btnBrowsePath.Click += (s, e) =>
            {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    fbd.SelectedPath = txtInstallPath.Text;
                    fbd.Description = "Lütfen kurulumun yapılacağı hedef klasörü seçiniz:";
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        txtInstallPath.Text = fbd.SelectedPath;
                    }
                }
            };
            p.Controls.Add(btnBrowsePath);

            lblDiskSpace = new Label
            {
                Text = "Gerekli Alan: ~25 MB  |  Kullanılabilir Boş Alan: Hesaplanıyor...",
                Font = new Font("Segoe UI", 9f, FontStyle.Bold),
                ForeColor = Color.FromArgb(71, 85, 105),
                Location = new Point(14, 150),
                AutoSize = true
            };
            p.Controls.Add(lblDiskSpace);

            UpdateDiskSpaceInfo();
        }

        private void UpdateDiskSpaceInfo()
        {
            try
            {
                string root = Path.GetPathRoot(txtInstallPath.Text);
                if (!string.IsNullOrEmpty(root) && Directory.Exists(root))
                {
                    DriveInfo d = new DriveInfo(root);
                    double freeGb = Math.Round((double)d.AvailableFreeSpace / (1024 * 1024 * 1024), 2);
                    lblDiskSpace.Text = string.Format(currentLang == "tr" ? "Gerekli Alan: ~25 MB  |  Sürücü Boş Alanı: {0} GB ({1})" : "Required Space: ~25 MB  |  Free Disk Space: {0} GB ({1})", freeGb, root);
                    return;
                }
            }
            catch { }
            lblDiskSpace.Text = currentLang == "tr" ? "Gerekli Alan: ~25 MB" : "Required Space: ~25 MB";
        }

        // ==========================================
        // ADIM 2: FİRMA BİLGİLERİ VE LOGO
        // ==========================================
        private void BuildStep2_CompanyProfile()
        {
            Panel p = stepPanels[2];

            Label lblTitle = new Label
            {
                Text = "Firma / Atölye Bilgileri ve Logo Yükleme",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblTitle);

            Label lblDesc = new Label
            {
                Text = "Müşterilerinize ileteceğiniz teklif fişinde ve PDF çıktılarında görünecek kurumsal bilgileriniz:",
                Font = new Font("Segoe UI", 9f),
                ForeColor = cTextMuted,
                Location = new Point(12, 40),
                Size = new Size(640, 24)
            };
            p.Controls.Add(lblDesc);

            // Sol Kısım: Logo Kutusu
            GroupBox gbLogo = new GroupBox
            {
                Text = " Firma Logosu ",
                Font = new Font("Segoe UI", 8.5f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(14, 75),
                Size = new Size(170, 240)
            };
            p.Controls.Add(gbLogo);

            picLogoPreview = new PictureBox
            {
                Location = new Point(15, 25),
                Size = new Size(138, 100),
                BorderStyle = BorderStyle.FixedSingle,
                SizeMode = PictureBoxSizeMode.Zoom,
                BackColor = Color.FromArgb(248, 250, 252)
            };
            gbLogo.Controls.Add(picLogoPreview);

            btnSelectLogo = new Button
            {
                Text = "Logo Seç...",
                Location = new Point(15, 135),
                Size = new Size(138, 30),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System
            };
            btnSelectLogo.Click += BtnSelectLogo_Click;
            gbLogo.Controls.Add(btnSelectLogo);

            btnRemoveLogo = new Button
            {
                Text = "Logoyu Kaldır",
                Location = new Point(15, 170),
                Size = new Size(138, 28),
                BackColor = Color.White,
                FlatStyle = FlatStyle.System,
                Enabled = false
            };
            btnRemoveLogo.Click += (s, e) =>
            {
                base64Logo = "";
                picLogoPreview.Image = null;
                btnRemoveLogo.Enabled = false;
                lblLogoStatus.Text = currentLang == "tr" ? "Logo seçilmedi" : "No logo selected";
            };
            gbLogo.Controls.Add(btnRemoveLogo);

            lblLogoStatus = new Label
            {
                Text = "Logo seçilmedi",
                Font = new Font("Segoe UI", 8f),
                ForeColor = cTextMuted,
                Location = new Point(10, 206),
                Size = new Size(150, 22),
                TextAlign = ContentAlignment.MiddleCenter
            };
            gbLogo.Controls.Add(lblLogoStatus);

            // Sağ Kısım: Firma Bilgileri Formu
            int rightX = 205;
            int startY = 80;
            int spacing = 50;

            // Firma Adı
            Label lblCName = new Label { Text = "Firma / Atölye Adı (Ticari Ünvan):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(rightX, startY), AutoSize = true };
            p.Controls.Add(lblCName);
            txtCompanyName = new TextBox { Text = "Nova 3D Tasarım & İmalat Atölyesi", Location = new Point(rightX, startY + 20), Size = new Size(430, 26) };
            p.Controls.Add(txtCompanyName);

            // Yetkili Kişi
            Label lblCContact = new Label { Text = "Yetkili Kişi Adı:", Font = new Font("Segoe UI", 8.5f), Location = new Point(rightX, startY + spacing), AutoSize = true };
            p.Controls.Add(lblCContact);
            txtCompanyContact = new TextBox { Text = "", Location = new Point(rightX, startY + spacing + 20), Size = new Size(210, 26) };
            p.Controls.Add(txtCompanyContact);

            // Telefon
            Label lblCPhone = new Label { Text = "Telefon Numarası:", Font = new Font("Segoe UI", 8.5f), Location = new Point(rightX + 225, startY + spacing), AutoSize = true };
            p.Controls.Add(lblCPhone);
            txtCompanyPhone = new TextBox { Text = "", Location = new Point(rightX + 225, startY + spacing + 20), Size = new Size(205, 26) };
            p.Controls.Add(txtCompanyPhone);

            // E-posta
            Label lblCEmail = new Label { Text = "E-posta Adresi:", Font = new Font("Segoe UI", 8.5f), Location = new Point(rightX, startY + (spacing * 2)), AutoSize = true };
            p.Controls.Add(lblCEmail);
            txtCompanyEmail = new TextBox { Text = "", Location = new Point(rightX, startY + (spacing * 2) + 20), Size = new Size(430, 26) };
            p.Controls.Add(txtCompanyEmail);

            // Adres
            Label lblCAddr = new Label { Text = "Atölye / Teslimat Adresi:", Font = new Font("Segoe UI", 8.5f), Location = new Point(rightX, startY + (spacing * 3)), AutoSize = true };
            p.Controls.Add(lblCAddr);
            txtCompanyAddress = new TextBox { Text = "", Multiline = true, Location = new Point(rightX, startY + (spacing * 3) + 20), Size = new Size(430, 48) };
            p.Controls.Add(txtCompanyAddress);
        }

        private void BtnSelectLogo_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Filter = "Resim Dosyaları (*.png;*.jpg;*.jpeg;*.bmp;*.gif;*.svg)|*.png;*.jpg;*.jpeg;*.bmp;*.gif;*.svg";
                ofd.Title = currentLang == "tr" ? "Firma Logosunu Seçin" : "Select Company Logo";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        byte[] fileBytes = File.ReadAllBytes(ofd.FileName);
                        string ext = Path.GetExtension(ofd.FileName).ToLowerInvariant();
                        string mime = "image/png";
                        if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
                        else if (ext == ".svg") mime = "image/svg+xml";
                        else if (ext == ".gif") mime = "image/gif";
                        else if (ext == ".bmp") mime = "image/bmp";

                        string base64Data = Convert.ToBase64String(fileBytes);
                        base64Logo = string.Format("data:{0};base64,{1}", mime, base64Data);

                        if (ext != ".svg")
                        {
                            using (MemoryStream ms = new MemoryStream(fileBytes))
                            {
                                picLogoPreview.Image = Image.FromStream(ms);
                            }
                        }
                        else
                        {
                            picLogoPreview.Image = null;
                        }

                        btnRemoveLogo.Enabled = true;
                        lblLogoStatus.Text = Path.GetFileName(ofd.FileName);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Logo yüklenirken hata oluştu: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        // ==========================================
        // ADIM 3: MAKİNE PARKI (ORCA SLICER GENİŞ KATALOĞU)
        // ==========================================
        private void BuildStep3_PrinterFleet()
        {
            Panel p = stepPanels[3];

            Label lblTitle = new Label
            {
                Text = "Atölye Makine Parkı ve Orca Slicer Cihaz Kataloğu",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblTitle);

            Label lblDesc = new Label
            {
                Text = "Makine parkınız başlangıçta boştur. Lütfen Orca Slicer profil kataloğundan atölyenizdeki\nyazıcıları seçip adet belirleyerek parka ekleyiniz:",
                Font = new Font("Segoe UI", 9f),
                ForeColor = cTextMuted,
                Location = new Point(12, 38),
                Size = new Size(640, 32)
            };
            p.Controls.Add(lblDesc);

            // Katalog Seçim Paneli (Marka Filtresi + Cihaz + Adet)
            GroupBox gbCatalog = new GroupBox
            {
                Text = " Orca Slicer Cihaz Kataloğundan Seçip Parka Ekleyin ",
                Font = new Font("Segoe UI", 8.5f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(14, 75),
                Size = new Size(635, 78)
            };
            p.Controls.Add(gbCatalog);

            Label lBrand = new Label { Text = "Marka:", Location = new Point(12, 22), AutoSize = true, Font = new Font("Segoe UI", 8f) };
            gbCatalog.Controls.Add(lBrand);

            cbBrandFilter = new ComboBox
            {
                Location = new Point(12, 40),
                Size = new Size(115, 26),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 8.5f)
            };
            cbBrandFilter.Items.AddRange(new object[] { "Tümü", "Creality", "FlashForge", "Bambu Lab", "Qidi Tech", "Elegoo", "Anycubic", "Prusa", "Voron / Diğer" });
            cbBrandFilter.SelectedIndex = 0;
            cbBrandFilter.SelectedIndexChanged += (s, e) => PopulateOrcaCatalogDropdown();
            gbCatalog.Controls.Add(cbBrandFilter);

            Label lDev = new Label { Text = "Cihaz Modeli (Orca Slicer Profili):", Location = new Point(135, 22), AutoSize = true, Font = new Font("Segoe UI", 8f) };
            gbCatalog.Controls.Add(lDev);

            cbOrcaCatalog = new ComboBox
            {
                Location = new Point(135, 40),
                Size = new Size(330, 26),
                DropDownStyle = ComboBoxStyle.DropDownList,
                Font = new Font("Segoe UI", 8.5f)
            };
            gbCatalog.Controls.Add(cbOrcaCatalog);

            Label lQty = new Label { Text = "Adet:", Location = new Point(473, 22), AutoSize = true, Font = new Font("Segoe UI", 8f) };
            gbCatalog.Controls.Add(lQty);

            numCatalogAddCount = new NumericUpDown
            {
                Location = new Point(473, 40),
                Size = new Size(50, 24),
                Minimum = 1,
                Maximum = 50,
                Value = 1,
                Font = new Font("Segoe UI", 8.5f)
            };
            gbCatalog.Controls.Add(numCatalogAddCount);

            btnAddFromCatalog = new Button
            {
                Text = "+ Parka Ekle",
                Location = new Point(530, 37),
                Size = new Size(95, 30),
                BackColor = cSidebarActive,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.System,
                Font = new Font("Segoe UI", 8.5f, FontStyle.Bold)
            };
            btnAddFromCatalog.Click += (s, e) =>
            {
                OrcaPrinterPreset sel = cbOrcaCatalog.SelectedItem as OrcaPrinterPreset;
                if (sel != null)
                {
                    int addCount = (int)numCatalogAddCount.Value;
                    var existing = printerFleet.Find(pf => pf.Id == sel.Id);
                    if (existing != null)
                    {
                        existing.Count += addCount;
                    }
                    else
                    {
                        printerFleet.Add(new PrinterItem
                        {
                            Id = sel.Id,
                            Name = sel.Name,
                            Type = sel.Type,
                            Count = addCount,
                            BedX = sel.BedX,
                            BedY = sel.BedY,
                            BedZ = sel.BedZ,
                            PowerWatts = sel.PowerWatts,
                            PurchasePrice = sel.PurchasePrice,
                            LifespanHours = sel.LifespanHours,
                            WearPerHour = sel.WearPerHour
                        });
                    }
                    RefreshPrinterListView();
                }
            };
            gbCatalog.Controls.Add(btnAddFromCatalog);

            // Mevcut Park Listesi
            lvPrinters = new ListView
            {
                Location = new Point(14, 165),
                Size = new Size(505, 175),
                View = View.Details,
                FullRowSelect = true,
                GridLines = true,
                MultiSelect = false
            };
            lvPrinters.Columns.Add("Model Adı", 250);
            lvPrinters.Columns.Add("Tür", 55);
            lvPrinters.Columns.Add("Adet", 45);
            lvPrinters.Columns.Add("Tabla X×Y×Z (mm)", 125);
            p.Controls.Add(lvPrinters);

            // Sağ İşlem Butonları
            int btnX = 528;
            btnIncPrinterCount = new Button { Text = "+ Adet Artır", Location = new Point(btnX, 165), Size = new Size(120, 30), BackColor = Color.White, FlatStyle = FlatStyle.System };
            btnIncPrinterCount.Click += (s, e) => ModifySelectedPrinterCount(1);
            p.Controls.Add(btnIncPrinterCount);

            btnDecPrinterCount = new Button { Text = "- Adet Azalt", Location = new Point(btnX, 200), Size = new Size(120, 30), BackColor = Color.White, FlatStyle = FlatStyle.System };
            btnDecPrinterCount.Click += (s, e) => ModifySelectedPrinterCount(-1);
            p.Controls.Add(btnDecPrinterCount);

            btnRemovePrinter = new Button { Text = "Seçileni Sil", Location = new Point(btnX, 235), Size = new Size(120, 30), BackColor = Color.White, FlatStyle = FlatStyle.System };
            btnRemovePrinter.Click += (s, e) =>
            {
                if (lvPrinters.SelectedIndices.Count > 0)
                {
                    int idx = lvPrinters.SelectedIndices[0];
                    printerFleet.RemoveAt(idx);
                    RefreshPrinterListView();
                }
            };
            p.Controls.Add(btnRemovePrinter);

            btnAddCustomPrinter = new Button { Text = "+ Özel Yazıcı...", Location = new Point(btnX, 280), Size = new Size(120, 34), BackColor = Color.White, FlatStyle = FlatStyle.System };
            btnAddCustomPrinter.Click += BtnAddCustomPrinter_Click;
            p.Controls.Add(btnAddCustomPrinter);

            lblFleetSummary = new Label
            {
                Text = "Makine Parkı Boş (Lütfen yukarıdaki menüden atölyenizdeki yazıcıları ekleyiniz)",
                Font = new Font("Segoe UI", 9.25f, FontStyle.Bold),
                ForeColor = Color.FromArgb(225, 29, 72),
                Location = new Point(14, 350),
                AutoSize = true
            };
            p.Controls.Add(lblFleetSummary);

            PopulateOrcaCatalogDropdown();
            RefreshPrinterListView();
        }

        private void PopulateOrcaCatalogDropdown()
        {
            if (cbOrcaCatalog == null) return;
            cbOrcaCatalog.Items.Clear();

            string filter = cbBrandFilter != null ? cbBrandFilter.SelectedItem as string : "Tümü";
            if (string.IsNullOrEmpty(filter)) filter = "Tümü";

            foreach (var preset in orcaPresets)
            {
                if (filter == "Tümü" || preset.Brand == filter)
                {
                    cbOrcaCatalog.Items.Add(preset);
                }
            }

            if (cbOrcaCatalog.Items.Count > 0) cbOrcaCatalog.SelectedIndex = 0;
        }

        private void RefreshPrinterListView()
        {
            if (lvPrinters == null) return;
            lvPrinters.Items.Clear();
            int totalCount = 0;
            int fdmCount = 0;
            int slaCount = 0;

            foreach (var p in printerFleet)
            {
                ListViewItem item = new ListViewItem(p.Name);
                item.SubItems.Add(p.Type.ToUpperInvariant());
                item.SubItems.Add(p.Count.ToString());
                item.SubItems.Add(string.Format("{0}×{1}×{2}", (int)p.BedX, (int)p.BedY, (int)p.BedZ));
                lvPrinters.Items.Add(item);

                totalCount += p.Count;
                if (p.Type.ToLowerInvariant() == "sla") slaCount += p.Count;
                else fdmCount += p.Count;
            }

            if (totalCount == 0)
            {
                lblFleetSummary.ForeColor = Color.FromArgb(225, 29, 72);
                lblFleetSummary.Text = currentLang == "tr" ? 
                    "Makine Parkı Boş (Lütfen yukarıdaki menüden atölyenizdeki yazıcıları ekleyiniz)" : 
                    "Fleet is Empty (Please add printers from the catalog above)";
            }
            else
            {
                lblFleetSummary.ForeColor = cSidebarActive;
                lblFleetSummary.Text = string.Format(currentLang == "tr" ? 
                    "Toplam Yazıcı: {0} Adet (FDM: {1}, SLA: {2})" : 
                    "Total Fleet: {0} Printers (FDM: {1}, SLA: {2})", totalCount, fdmCount, slaCount);
            }
        }

        private void ModifySelectedPrinterCount(int delta)
        {
            if (lvPrinters.SelectedIndices.Count > 0)
            {
                int idx = lvPrinters.SelectedIndices[0];
                printerFleet[idx].Count = Math.Max(1, printerFleet[idx].Count + delta);
                RefreshPrinterListView();
                lvPrinters.Items[idx].Selected = true;
            }
        }

        private void BtnAddCustomPrinter_Click(object sender, EventArgs e)
        {
            using (Form addForm = new Form())
            {
                addForm.Text = currentLang == "tr" ? "Yeni Özel Yazıcı Ekle" : "Add Custom Printer";
                addForm.Size = new Size(380, 330);
                addForm.StartPosition = FormStartPosition.CenterParent;
                addForm.FormBorderStyle = FormBorderStyle.FixedDialog;
                addForm.MaximizeBox = false;
                addForm.MinimizeBox = false;

                Label l1 = new Label { Text = "Model Adı:", Location = new Point(20, 20), AutoSize = true };
                TextBox tName = new TextBox { Text = "Özel FDM Yazıcı (#1)", Location = new Point(20, 40), Width = 320 };
                
                Label l2 = new Label { Text = "Baskı Teknolojisi:", Location = new Point(20, 75), AutoSize = true };
                ComboBox cbType = new ComboBox { Location = new Point(20, 95), Width = 150, DropDownStyle = ComboBoxStyle.DropDownList };
                cbType.Items.Add("FDM (Filament)");
                cbType.Items.Add("SLA (Reçine)");
                cbType.SelectedIndex = 0;

                Label l3 = new Label { Text = "Adet:", Location = new Point(190, 75), AutoSize = true };
                NumericUpDown numCount = new NumericUpDown { Location = new Point(190, 95), Width = 150, Minimum = 1, Maximum = 50, Value = 1 };

                Label l4 = new Label { Text = "Tabla Boyutları (X × Y × Z mm):", Location = new Point(20, 130), AutoSize = true };
                NumericUpDown nX = new NumericUpDown { Location = new Point(20, 150), Width = 95, Maximum = 1000, Value = 260 };
                NumericUpDown nY = new NumericUpDown { Location = new Point(130, 150), Width = 95, Maximum = 1000, Value = 260 };
                NumericUpDown nZ = new NumericUpDown { Location = new Point(245, 150), Width = 95, Maximum = 1000, Value = 300 };

                Button btnOk = new Button { Text = "Ekle", DialogResult = DialogResult.OK, Location = new Point(145, 230), Size = new Size(95, 32), BackColor = cSidebarActive, ForeColor = Color.White, FlatStyle = FlatStyle.System };
                Button btnCn = new Button { Text = "İptal", DialogResult = DialogResult.Cancel, Location = new Point(245, 230), Size = new Size(95, 32), FlatStyle = FlatStyle.System };

                addForm.Controls.AddRange(new Control[] { l1, tName, l2, cbType, l3, numCount, l4, nX, nY, nZ, btnOk, btnCn });
                addForm.AcceptButton = btnOk;
                addForm.CancelButton = btnCn;

                if (addForm.ShowDialog(this) == DialogResult.OK && !string.IsNullOrEmpty(tName.Text.Trim()))
                {
                    string pType = cbType.SelectedIndex == 1 ? "sla" : "fdm";
                    printerFleet.Add(new PrinterItem
                    {
                        Id = "printer_" + DateTime.Now.Ticks,
                        Name = tName.Text.Trim(),
                        Type = pType,
                        Count = (int)numCount.Value,
                        BedX = (double)nX.Value,
                        BedY = (double)nY.Value,
                        BedZ = (double)nZ.Value,
                        PowerWatts = pType == "sla" ? 100 : 350,
                        PurchasePrice = 25000,
                        LifespanHours = pType == "sla" ? 2500 : 5000,
                        WearPerHour = pType == "sla" ? 3.5 : 2.5
                    });
                    RefreshPrinterListView();
                }
            }
        }

        // ==========================================
        // ADIM 4: ATÖLYE MALİYET TEMELLERİ
        // ==========================================
        private void BuildStep4_WorkshopCosts()
        {
            Panel p = stepPanels[4];

            Label lblTitle = new Label
            {
                Text = "Atölye Sabit Giderleri ve Fiyatlandırma Temelleri",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblTitle);

            Label lblDesc = new Label
            {
                Text = "Kira ve genel giderleriniz, makine parkınızın aylık kapasitesine oranlanarak hesaplanır:\n(Bu değerleri kurulum sonrasında da ayarlar sekmesinden dilediğiniz gibi güncelleyebilirsiniz)",
                Font = new Font("Segoe UI", 9f),
                ForeColor = cTextMuted,
                Location = new Point(12, 38),
                Size = new Size(640, 36)
            };
            p.Controls.Add(lblDesc);

            int startY = 85;
            int col1X = 20;
            int col2X = 330;
            int rowSpacing = 70;

            // 1. Aylık Dükkan Kirası
            Label lRent = new Label { Text = "Aylık Atölye / Dükkan Kirası (TL):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col1X, startY), AutoSize = true };
            numRent = new NumericUpDown { Location = new Point(col1X, startY + 22), Size = new Size(270, 26), Maximum = 500000, Increment = 500, Value = 15000 };
            p.Controls.AddRange(new Control[] { lRent, numRent });

            // 2. Sabit Faturalar & Aidat
            Label lBills = new Label { Text = "Sabit Faturalar & Aidat / Muhasebe (TL):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col2X, startY), AutoSize = true };
            numBills = new NumericUpDown { Location = new Point(col2X, startY + 22), Size = new Size(270, 26), Maximum = 100000, Increment = 250, Value = 2500 };
            p.Controls.AddRange(new Control[] { lBills, numBills });

            // 3. Elektrik Birim Fiyatı
            Label lElec = new Label { Text = "Elektrik Birim Fiyatı (TL / kWh):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col1X, startY + rowSpacing), AutoSize = true };
            numElectricity = new NumericUpDown { Location = new Point(col1X, startY + rowSpacing + 22), Size = new Size(270, 26), DecimalPlaces = 2, Increment = 0.20m, Maximum = 50, Value = 3.20m };
            p.Controls.AddRange(new Control[] { lElec, numElectricity });

            // 4. Hedef Kâr Marjı
            Label lMargin = new Label { Text = "Varsayılan Hedef Kâr Marjı (%):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col2X, startY + rowSpacing), AutoSize = true };
            numMargin = new NumericUpDown { Location = new Point(col2X, startY + rowSpacing + 22), Size = new Size(270, 26), Maximum = 500, Increment = 5, Value = 50 };
            p.Controls.AddRange(new Control[] { lMargin, numMargin });

            // 5. 3D Tasarım Saat Ücreti
            Label lDesign = new Label { Text = "3D CAD / Tasarım Saat Ücreti (TL):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col1X, startY + (rowSpacing * 2)), AutoSize = true };
            numDesignHourly = new NumericUpDown { Location = new Point(col1X, startY + (rowSpacing * 2) + 22), Size = new Size(270, 26), Maximum = 5000, Increment = 25, Value = 350 };
            p.Controls.AddRange(new Control[] { lDesign, numDesignHourly });

            // 6. Operatör İşçilik Saat Ücreti
            Label lLabor = new Label { Text = "Operatör & Parça Hazırlık Saat Ücreti (TL):", Font = new Font("Segoe UI", 8.5f, FontStyle.Bold), Location = new Point(col2X, startY + (rowSpacing * 2)), AutoSize = true };
            numLaborHourly = new NumericUpDown { Location = new Point(col2X, startY + (rowSpacing * 2) + 22), Size = new Size(270, 26), Maximum = 5000, Increment = 25, Value = 150 };
            p.Controls.AddRange(new Control[] { lLabor, numLaborHourly });
        }

        // ==========================================
        // ADIM 5: KISAYOLLAR & KURULUM İLERLEMESİ
        // ==========================================
        private void BuildStep5_InstallProgress()
        {
            Panel p = stepPanels[5];

            Label lblTitle = new Label
            {
                Text = "Kurulum Özeti ve Kısayol Tercihleri",
                Font = new Font("Segoe UI", 13f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(10, 10),
                AutoSize = true
            };
            p.Controls.Add(lblTitle);

            lblInstallSummary = new Label
            {
                Text = "Aşağıdaki özet bilgileri onayladıktan sonra 'Kurulumu Başlat' butonuna tıklayınız:",
                Font = new Font("Segoe UI", 9f),
                ForeColor = cTextMuted,
                Location = new Point(12, 38),
                Size = new Size(640, 95)
            };
            p.Controls.Add(lblInstallSummary);

            chkDesktopShortcut = new CheckBox
            {
                Text = "Masaüstüne Kısayol Oluştur",
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                ForeColor = cTextDark,
                Checked = true,
                Location = new Point(15, 140),
                AutoSize = true
            };
            p.Controls.Add(chkDesktopShortcut);

            chkStartMenuShortcut = new CheckBox
            {
                Text = "Başlat Menüsüne Kısayol Oluştur",
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                ForeColor = cTextDark,
                Checked = true,
                Location = new Point(15, 170),
                AutoSize = true
            };
            p.Controls.Add(chkStartMenuShortcut);

            progressBar = new ProgressBar
            {
                Location = new Point(15, 225),
                Size = new Size(615, 26),
                Style = ProgressBarStyle.Continuous,
                Visible = false
            };
            p.Controls.Add(progressBar);

            lblInstallStatus = new Label
            {
                Text = "Hazır",
                Font = new Font("Segoe UI", 9f),
                ForeColor = cTextMuted,
                Location = new Point(15, 258),
                Size = new Size(615, 30),
                Visible = false
            };
            p.Controls.Add(lblInstallStatus);
        }

        private void UpdateInstallSummaryText()
        {
            int totalPrinters = 0;
            foreach (var p in printerFleet) totalPrinters += p.Count;

            lblInstallSummary.Text = string.Format(
                currentLang == "tr" ?
                "• Hedef Dizin: {0}\n• Firma Adı: {1}\n• Makine Parkı: {2} Adet Yazıcı Tanımlı\n• Aylık Kira: {3:N0} TL | Elektrik: {4:N2} TL/kWh | Kâr Marjı: %{5}\n• Arayüz Dili: {6}" :
                "• Target Directory: {0}\n• Company Name: {1}\n• Fleet Capacity: {2} Printers Configured\n• Monthly Rent: {3:N0} TL | Power: {4:N2} TL/kWh | Margin: {5}%\n• Language: {6}",
                txtInstallPath.Text,
                string.IsNullOrEmpty(txtCompanyName.Text.Trim()) ? "-" : txtCompanyName.Text.Trim(),
                totalPrinters,
                numRent.Value,
                numElectricity.Value,
                numMargin.Value,
                currentLang == "tr" ? "Türkçe (TR)" : "English (EN)"
            );
        }

        // ==========================================
        // ADIM 6: TAMAMLANDI
        // ==========================================
        private void BuildStep6_Finished()
        {
            Panel p = stepPanels[6];

            Label lblBadge = new Label
            {
                Text = "✓",
                Font = new Font("Segoe UI", 26f, FontStyle.Bold),
                ForeColor = Color.White,
                BackColor = Color.FromArgb(16, 185, 129), // Emerald
                Size = new Size(64, 64),
                Location = new Point(15, 25),
                TextAlign = ContentAlignment.MiddleCenter
            };
            p.Controls.Add(lblBadge);

            lblFinishTitle = new Label
            {
                Text = "Tebrikler! Kurulum Başarıyla Tamamlandı",
                Font = new Font("Segoe UI", 15f, FontStyle.Bold),
                ForeColor = cTextDark,
                Location = new Point(90, 25),
                AutoSize = true
            };
            p.Controls.Add(lblFinishTitle);

            lblFinishDesc = new Label
            {
                Text = "3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı bilgisayarınıza başarıyla kuruldu.\nFirma profiliniz, makine parkınız ve atölye maliyetleriniz sisteme aktarıldı.\n\nUygulamayı hemen başlatmak için aşağıdaki kutucuğu işaretli bırakabilirsiniz.",
                Font = new Font("Segoe UI", 9.5f),
                ForeColor = cTextMuted,
                Location = new Point(92, 65),
                Size = new Size(540, 85)
            };
            p.Controls.Add(lblFinishDesc);

            chkLaunchNow = new CheckBox
            {
                Text = "3D Maliyet ve Teklif Hesaplayıcı'yı Şimdi Başlat",
                Font = new Font("Segoe UI", 10.5f, FontStyle.Bold),
                ForeColor = cSidebarActive,
                Checked = true,
                Location = new Point(95, 165),
                AutoSize = true
            };
            p.Controls.Add(chkLaunchNow);
        }

        // ==========================================
        // ADIM YÖNETİMİ & GEÇİŞLER
        // ==========================================
        private void ShowStep(int stepIndex)
        {
            currentStep = stepIndex;

            for (int i = 0; i < stepPanels.Length; i++)
            {
                stepPanels[i].Visible = (i == stepIndex);
                if (i == stepIndex)
                {
                    lblSteps[i].ForeColor = Color.White;
                    lblSteps[i].Font = new Font("Segoe UI", 9.25f, FontStyle.Bold);
                    lblSteps[i].BackColor = cSidebarActive;
                }
                else
                {
                    lblSteps[i].ForeColor = Color.FromArgb(148, 163, 184);
                    lblSteps[i].Font = new Font("Segoe UI", 9f, FontStyle.Regular);
                    lblSteps[i].BackColor = Color.Transparent;
                }
            }

            btnBack.Enabled = (stepIndex > 0 && stepIndex < 6);

            if (stepIndex == 5)
            {
                btnNext.Text = currentLang == "tr" ? "Kurulumu Başlat" : "Install Now";
                UpdateInstallSummaryText();
            }
            else if (stepIndex == 6)
            {
                btnNext.Text = currentLang == "tr" ? "Bitir" : "Finish";
                btnCancel.Visible = false;
                btnBack.Visible = false;
            }
            else
            {
                btnNext.Text = currentLang == "tr" ? "İleri >" : "Next >";
            }
        }

        private void BtnNext_Click(object sender, EventArgs e)
        {
            if (currentStep == 1) // Konum Kontrolü
            {
                string target = txtInstallPath.Text.Trim();
                if (string.IsNullOrEmpty(target))
                {
                    MessageBox.Show(currentLang == "tr" ? "Lütfen geçerli bir kurulum dizini belirtin!" : "Please specify a valid installation directory!", "Uyarı", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
            }
            else if (currentStep == 3) // Makine Parkı Kontrolü (Boş Geçilemez)
            {
                if (printerFleet.Count == 0)
                {
                    MessageBox.Show(currentLang == "tr" ?
                        "Makine parkınız henüz boştur!\n\nLütfen atölyenizde bulunan cihazları yukarıdaki Orca Slicer kataloğundan seçip '+ Parka Ekle' butonuna basınız." :
                        "Your printer fleet is currently empty!\n\nPlease select your workshop printers from the Orca Slicer catalog above and click '+ Add to Fleet'.",
                        currentLang == "tr" ? "Yazıcı Eklenmedi" : "No Printers Added",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
            }
            else if (currentStep == 5) // Kurulumu Başlat
            {
                RunInstallationProcess();
                return;
            }
            else if (currentStep == 6) // Bitiş
            {
                if (chkLaunchNow.Checked)
                {
                    string exePath = Path.Combine(txtInstallPath.Text.Trim(), "3D_Maliyet_Hesaplayici.exe");
                    if (File.Exists(exePath))
                    {
                        try
                        {
                            Process.Start(new ProcessStartInfo
                            {
                                FileName = exePath,
                                WorkingDirectory = txtInstallPath.Text.Trim()
                            });
                        }
                        catch { }
                    }
                }
                this.Close();
                return;
            }

            if (currentStep < 6)
            {
                ShowStep(currentStep + 1);
            }
        }

        private void BtnBack_Click(object sender, EventArgs e)
        {
            if (currentStep > 0)
            {
                ShowStep(currentStep - 1);
            }
        }

        private bool ConfirmExit()
        {
            if (currentStep >= 6) return true;
            string msg = currentLang == "tr" ? "Kurulum sihirbazından çıkmak istediğinize emin misiniz?" : "Are you sure you want to exit the setup wizard?";
            return MessageBox.Show(msg, "Çıkış", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes;
        }

        // ==========================================
        // GERÇEK KURULUM İŞLEMİ (EXTRACT & CONFIG)
        // ==========================================
        private void RunInstallationProcess()
        {
            btnNext.Enabled = false;
            btnBack.Enabled = false;
            btnCancel.Enabled = false;
            progressBar.Visible = true;
            lblInstallStatus.Visible = true;
            progressBar.Value = 10;
            lblInstallStatus.Text = currentLang == "tr" ? "Klasörler hazırlanıyor..." : "Preparing directories...";
            Application.DoEvents();

            string targetDir = txtInstallPath.Text.Trim();

            try
            {
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }

                progressBar.Value = 25;
                lblInstallStatus.Text = currentLang == "tr" ? "Uygulama dosyaları ayıklanıyor..." : "Extracting application files...";
                Application.DoEvents();

                // Gömülü payload.zip'i çıkar
                ExtractEmbeddedPayload(targetDir);

                progressBar.Value = 60;
                lblInstallStatus.Text = currentLang == "tr" ? "Atölye ve firma yapılandırması oluşturuluyor..." : "Creating workshop and company configuration...";
                Application.DoEvents();

                // initial_config.json dosyasını yaz
                WriteInitialConfigFile(targetDir);

                progressBar.Value = 85;
                lblInstallStatus.Text = currentLang == "tr" ? "Masaüstü ve Başlat Menüsü kısayolları ekleniyor..." : "Creating desktop and start menu shortcuts...";
                Application.DoEvents();

                // Kısayolları oluştur
                string mainExe = Path.Combine(targetDir, "3D_Maliyet_Hesaplayici.exe");
                string appIco = Path.Combine(targetDir, "app.ico");

                if (chkDesktopShortcut.Checked)
                {
                    string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string lnk = Path.Combine(desktop, currentLang == "tr" ? "3D Baski Maliyet Hesaplayici.lnk" : "3D Print Cost Calculator.lnk");
                    CreateWindowsShortcut(lnk, mainExe, targetDir, appIco, "3D Baskı Maliyet ve Teklif Robotu");
                }

                if (chkStartMenuShortcut.Checked)
                {
                    string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "3D Maliyet Hesaplayici");
                    if (!Directory.Exists(startMenu)) Directory.CreateDirectory(startMenu);
                    string lnk = Path.Combine(startMenu, currentLang == "tr" ? "3D Baski Maliyet Hesaplayici.lnk" : "3D Print Cost Calculator.lnk");
                    CreateWindowsShortcut(lnk, mainExe, targetDir, appIco, "3D Baskı Maliyet ve Teklif Robotu");
                }

                progressBar.Value = 100;
                lblInstallStatus.Text = currentLang == "tr" ? "Kurulum tamamlandı!" : "Installation complete!";
                Application.DoEvents();

                System.Threading.Thread.Sleep(500);
                btnNext.Enabled = true;
                ShowStep(6);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Kurulum sırasında hata oluştu: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnNext.Enabled = true;
                btnBack.Enabled = true;
                btnCancel.Enabled = true;
            }
        }

        // Gömülü zip arşivini hedef klasöre açma
        public void ExtractEmbeddedPayload(string targetDir)
        {
            Assembly asm = Assembly.GetExecutingAssembly();
            string resourceName = null;
            foreach (string name in asm.GetManifestResourceNames())
            {
                if (name.EndsWith("payload.zip", StringComparison.OrdinalIgnoreCase))
                {
                    resourceName = name;
                    break;
                }
            }

            if (string.IsNullOrEmpty(resourceName))
            {
                string localZip = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "payload.zip");
                if (File.Exists(localZip))
                {
                    ZipFile.ExtractToDirectory(localZip, targetDir);
                    return;
                }
                throw new FileNotFoundException("Gömülü kaynak 'payload.zip' bulunamadı!");
            }

            using (Stream s = asm.GetManifestResourceStream(resourceName))
            {
                using (ZipArchive archive = new ZipArchive(s, ZipArchiveMode.Read))
                {
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        string completeFileName = Path.Combine(targetDir, entry.FullName);
                        string directory = Path.GetDirectoryName(completeFileName);
                        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                        {
                            Directory.CreateDirectory(directory);
                        }
                        if (!string.IsNullOrEmpty(entry.Name))
                        {
                            entry.ExtractToFile(completeFileName, true);
                        }
                    }
                }
            }
        }

        // initial_config.json dosyasını üretme
        public void WriteInitialConfigFile(string targetDir)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("{");
            sb.AppendLine("  \"_timestamp\": \"" + DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ") + "\",");
            sb.AppendLine("  \"language\": \"" + currentLang + "\",");
            sb.AppendLine("  \"country\": \"tr\",");

            // Firma Bilgileri
            sb.AppendLine("  \"company\": {");
            sb.AppendLine("    \"name\": " + EscapeJson(txtCompanyName.Text.Trim()) + ",");
            sb.AppendLine("    \"contact\": " + EscapeJson(txtCompanyContact.Text.Trim()) + ",");
            sb.AppendLine("    \"phone\": " + EscapeJson(txtCompanyPhone.Text.Trim()) + ",");
            sb.AppendLine("    \"email\": " + EscapeJson(txtCompanyEmail.Text.Trim()) + ",");
            sb.AppendLine("    \"address\": " + EscapeJson(txtCompanyAddress.Text.Trim()) + ",");
            sb.AppendLine("    \"logo\": " + EscapeJson(base64Logo));
            sb.AppendLine("  },");

            // Atölye Maliyetleri
            sb.AppendLine("  \"workshop\": {");
            sb.AppendLine("    \"monthlyRent\": " + numRent.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
            sb.AppendLine("    \"monthlyBills\": " + numBills.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
            sb.AppendLine("    \"hoursPerPrinterMonthly\": 200,");
            sb.AppendLine("    \"electricityKwhPrice\": " + numElectricity.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
            sb.AppendLine("    \"laptopPurchasePrice\": 35000,");
            sb.AppendLine("    \"laborHourlyRate\": " + numLaborHourly.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
            sb.AppendLine("    \"designHourlyRate\": " + numDesignHourly.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
            sb.AppendLine("    \"slaWashCureAddon\": 25.0,");
            sb.AppendLine("    \"defaultMarginPercent\": " + numMargin.Value.ToString(System.Globalization.CultureInfo.InvariantCulture));
            sb.AppendLine("  },");

            // Makine Parkı
            sb.AppendLine("  \"printers\": [");
            List<string> printerJsonList = new List<string>();
            int pIndex = 1;

            foreach (var item in printerFleet)
            {
                for (int count = 1; count <= item.Count; count++)
                {
                    string uniqueId = string.Format("{0}_{1}", item.Id, pIndex++);
                    string pName = item.Count > 1 ? string.Format("{0} (#{1})", item.Name, count) : item.Name;
                    
                    StringBuilder psb = new StringBuilder();
                    psb.AppendLine("    {");
                    psb.AppendLine("      \"id\": " + EscapeJson(uniqueId) + ",");
                    psb.AppendLine("      \"name\": " + EscapeJson(pName) + ",");
                    psb.AppendLine("      \"type\": " + EscapeJson(item.Type) + ",");
                    psb.AppendLine("      \"bedX\": " + item.BedX.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"bedY\": " + item.BedY.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"bedZ\": " + item.BedZ.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"powerWatts\": " + item.PowerWatts.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"purchasePrice\": " + item.PurchasePrice.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"lifespanHours\": " + item.LifespanHours.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"wearPerHour\": " + item.WearPerHour.ToString(System.Globalization.CultureInfo.InvariantCulture) + ",");
                    psb.AppendLine("      \"status\": \"active\"");
                    psb.Append("    }");
                    printerJsonList.Add(psb.ToString());
                }
            }

            sb.AppendLine(string.Join(",\n", printerJsonList.ToArray()));
            sb.AppendLine("  ]");
            sb.AppendLine("}");

            string configPath = Path.Combine(targetDir, "initial_config.json");
            File.WriteAllText(configPath, sb.ToString(), Encoding.UTF8);
        }

        private static string EscapeJson(string s)
        {
            if (s == null) return "\"\"";
            StringBuilder b = new StringBuilder();
            b.Append('"');
            foreach (char c in s)
            {
                switch (c)
                {
                    case '"': b.Append("\\\""); break;
                    case '\\': b.Append("\\\\"); break;
                    case '\b': b.Append("\\b"); break;
                    case '\f': b.Append("\\f"); break;
                    case '\n': b.Append("\\n"); break;
                    case '\r': b.Append("\\r"); break;
                    case '\t': b.Append("\\t"); break;
                    default:
                        if (c < ' ') b.AppendFormat("\\u{0:x4}", (int)c);
                        else b.Append(c);
                        break;
                }
            }
            b.Append('"');
            return b.ToString();
        }

        // Windows .lnk Kısayolu Oluşturma
        private void CreateWindowsShortcut(string shortcutPath, string targetPath, string workingDir, string iconPath, string desc)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    object shell = Activator.CreateInstance(shellType);
                    object shortcut = shellType.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { shortcutPath });
                    Type scType = shortcut.GetType();

                    scType.InvokeMember("TargetPath", BindingFlags.SetProperty, null, shortcut, new object[] { targetPath });
                    scType.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, shortcut, new object[] { workingDir });
                    scType.InvokeMember("Description", BindingFlags.SetProperty, null, shortcut, new object[] { desc });
                    if (File.Exists(iconPath))
                    {
                        scType.InvokeMember("IconLocation", BindingFlags.SetProperty, null, shortcut, new object[] { iconPath + ",0" });
                    }
                    scType.InvokeMember("Save", BindingFlags.InvokeMethod, null, shortcut, null);
                    return;
                }
            }
            catch { }

            // Fallback: InternetShortcut .url
            try
            {
                string urlPath = Path.ChangeExtension(shortcutPath, ".url");
                using (StreamWriter sw = new StreamWriter(urlPath, false, Encoding.UTF8))
                {
                    sw.WriteLine("[InternetShortcut]");
                    sw.WriteLine("URL=file:///" + targetPath.Replace('\\', '/'));
                    if (File.Exists(iconPath))
                    {
                        sw.WriteLine("IconFile=" + iconPath);
                        sw.WriteLine("IconIndex=0");
                    }
                }
            }
            catch { }
        }

        // ==========================================
        // DİL DEĞİŞİMİ (TR / EN)
        // ==========================================
        private void ApplyLanguage(string lang)
        {
            currentLang = lang;
            bool isTr = (lang == "tr");

            this.Text = isTr ? "3D Baskı Maliyet ve Teklif Robotu - Kurulum Sihirbazı" : "3D Print Cost & Quote Calculator - Setup Wizard";
            lblHeaderTitle.Text = isTr ? "3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı" : "3D Print Professional Cost & Quote Calculator";
            lblHeaderSubtitle.Text = isTr ? "Orca Slicer Tabanlı Atölye Kurulum ve Profil Yöneticisi v2.6 Pro" : "Orca Slicer Based Workshop Setup & Profile Manager v2.6 Pro";

            btnBack.Text = isTr ? "< Geri" : "< Back";
            btnCancel.Text = isTr ? "İptal" : "Cancel";

            lblSteps[0].Text = isTr ? "1. Dil & Karşılama" : "1. Language & Welcome";
            lblSteps[1].Text = isTr ? "2. Kurulum Konumu" : "2. Install Directory";
            lblSteps[2].Text = isTr ? "3. Firma & Logo" : "3. Company & Logo";
            lblSteps[3].Text = isTr ? "4. Makine Parkı" : "4. Printer Fleet";
            lblSteps[4].Text = isTr ? "5. Atölye Maliyetleri" : "5. Workshop Costs";
            lblSteps[5].Text = isTr ? "6. Kurulumu Başlat" : "6. Start Install";
            lblSteps[6].Text = isTr ? "7. Tamamlandı" : "7. Finish";

            if (btnAddFromCatalog != null) btnAddFromCatalog.Text = isTr ? "+ Parka Ekle" : "+ Add to Fleet";
            if (btnAddCustomPrinter != null) btnAddCustomPrinter.Text = isTr ? "+ Özel Yazıcı..." : "+ Custom Printer...";
            if (btnIncPrinterCount != null) btnIncPrinterCount.Text = isTr ? "+ Adet Artır" : "+ Increase Qty";
            if (btnDecPrinterCount != null) btnDecPrinterCount.Text = isTr ? "- Adet Azalt" : "- Decrease Qty";
            if (btnRemovePrinter != null) btnRemovePrinter.Text = isTr ? "Seçileni Sil" : "Delete Selected";

            // Buton metni güncelle
            if (currentStep == 5) btnNext.Text = isTr ? "Kurulumu Başlat" : "Install Now";
            else if (currentStep == 6) btnNext.Text = isTr ? "Bitir" : "Finish";
            else btnNext.Text = isTr ? "İleri >" : "Next >";

            // Karşılama
            lblWelcomeTitle.Text = isTr ? "3D Baskı Maliyet ve Teklif Robotuna Hoş Geldiniz" : "Welcome to 3D Print Cost & Quote Calculator";
            lblWelcomeDesc.Text = isTr ?
                "Bu sihirbaz, 3D baskı atölyeniz için profesyonel maliyet hesaplama, kâr optimizasyonu,\nfilo yönetimi ve kurumsal müşteri teklifi fiş sistemini bilgisayarınıza kuracaktır.\n\nLütfen kuruluma başlamadan önce tercih ettiğiniz dili kartlara tıklayarak seçiniz:" :
                "This setup wizard will install the professional cost calculation, profit optimization,\nfleet management, and corporate customer quote receipt system for your 3D workshop.\n\nPlease select your preferred language by clicking on the cards below:";

            chkDesktopShortcut.Text = isTr ? "Masaüstüne Kısayol Oluştur" : "Create Desktop Shortcut";
            chkStartMenuShortcut.Text = isTr ? "Başlat Menüsüne Kısayol Oluştur" : "Create Start Menu Shortcut";
            chkLaunchNow.Text = isTr ? "3D Maliyet ve Teklif Hesaplayıcı'yı Şimdi Başlat" : "Launch 3D Cost & Quote Calculator Now";

            lblFinishTitle.Text = isTr ? "Tebrikler! Kurulum Başarıyla Tamamlandı" : "Congratulations! Setup Completed Successfully";
            lblFinishDesc.Text = isTr ?
                "3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı bilgisayarınıza başarıyla kuruldu.\nFirma profiliniz, makine parkınız ve atölye maliyetleriniz sisteme aktarıldı.\n\nUygulamayı hemen başlatmak için aşağıdaki kutucuğu işaretli bırakabilirsiniz." :
                "3D Print Professional Cost & Quote Calculator has been successfully installed.\nYour company profile, printer fleet, and workshop costs were configured.\n\nYou can keep the checkbox checked below to launch the application now.";

            RefreshPrinterListView();
            UpdateDiskSpaceInfo();
        }
    }

    // ==========================================
    // PROGRAM GİRİŞ NOKTASI
    // ==========================================
    static class Program
    {
        [STAThread]
        static int Main(string[] args)
        {
            if (args != null && args.Length >= 2 && args[0].ToLowerInvariant() == "--silent-test")
            {
                string targetDir = args[1];
                try
                {
                    if (!Directory.Exists(targetDir)) Directory.CreateDirectory(targetDir);
                    SetupWizardForm form = new SetupWizardForm();
                    form.AddPresetPrinter("creality_hi_combo", 1);
                    form.ExtractEmbeddedPayload(targetDir);
                    form.WriteInitialConfigFile(targetDir);
                    File.WriteAllText(Path.Combine(targetDir, "setup_test_success.txt"), "OK: " + DateTime.Now.ToString("s"));
                    return 0;
                }
                catch (Exception ex)
                {
                    File.WriteAllText(Path.Combine(targetDir, "setup_test_error.txt"), ex.ToString());
                    return 1;
                }
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SetupWizardForm());
            return 0;
        }
    }
}
