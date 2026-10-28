/**
 * 3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı
 * Gelişmiş Atölye ve Filo Yönetimi Sürümü
 * Filenta PLA & Elegoo Saturn 4 16K SLA Destekli
 */

// ========================================================
// 1. VARSAYILAN ATÖLYE VE YAZICI KONFİGÜRASYONU
// ========================================================
const DEFAULT_CONFIG = {
  // Yazıcı Parkı (Kullanıcının Envanteri)
  printers: [
    {
      id: 'ff_ad5x_1',
      name: 'FlashForge AD5X (#1)',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 180,
      purchasePrice: 16000,
      lifespanHours: 4000,
      wearPerHour: 1.50, // Nozzle + Tabla + Kayış
      status: 'active'
    },
    {
      id: 'ff_ad5x_2',
      name: 'FlashForge AD5X (#2)',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 180,
      purchasePrice: 16000,
      lifespanHours: 4000,
      wearPerHour: 1.50,
      status: 'active'
    },
    {
      id: 'ff_ad5x_3',
      name: 'FlashForge AD5X (#3)',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 180,
      purchasePrice: 16000,
      lifespanHours: 4000,
      wearPerHour: 1.50,
      status: 'active'
    },
    {
      id: 'ff_ad5x_4',
      name: 'FlashForge AD5X (#4)',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 180,
      purchasePrice: 16000,
      lifespanHours: 4000,
      wearPerHour: 1.50,
      status: 'active'
    },
    {
      id: 'ff_ad5m_pro',
      name: 'FlashForge AD5M Pro',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 220,
      purchasePrice: 22000,
      lifespanHours: 4500,
      wearPerHour: 2.20, // HEPA filtre + Nozzle
      status: 'active'
    },
    {
      id: 'qidi_enclosed',
      name: 'Qidi Kapalı Kasa (Q1 / X-Plus)',
      type: 'fdm',
      bedX: 245,
      bedY: 245,
      bedZ: 245,
      powerWatts: 380, // Isıtmalı hazne
      purchasePrice: 28000,
      lifespanHours: 5000,
      wearPerHour: 3.00,
      status: 'active'
    },
    {
      id: 'creality_hi_combo',
      name: 'Creality Hi Combo',
      type: 'fdm',
      bedX: 260,
      bedY: 260,
      bedZ: 300,
      powerWatts: 350,
      purchasePrice: 28000,
      lifespanHours: 5000,
      wearPerHour: 2.80,
      status: 'active'
    },
    {
      id: 'elegoo_saturn4_ultra',
      name: 'Elegoo Saturn 4 Ultra 16k',
      type: 'sla',
      bedX: 218.88,
      bedY: 122.88,
      bedZ: 220,
      powerWatts: 100,
      purchasePrice: 26000,
      lifespanHours: 2500,
      wearPerHour: 3.50, // 16K Mono LCD + ACF/FEP film aşınması
      status: 'active'
    }
  ],

  // Atölye Sabit Giderleri
  workshop: {
    monthlyRent: 15000,       // TL/ay
    monthlyBills: 2500,       // TL/ay (Aidat, sabit faturalar, muhasebe)
    hoursPerPrinterMonthly: 200, // Her yazıcıdan hedeflenen aylık çalışma saati
    electricityKwhPrice: 3.20, // TL/kWh
    laptopPurchasePrice: 35000, // TL (1 adet iş laptopu)
    laptopLifespanMonths: 36,  // 3 yıl faydalı ömür
    laborHourlyRate: 150,     // TL/saat (parça hazırlık/söküm operasyon)
    designHourlyRate: 350,    // TL/saat (Fusion 360 / Blender özel modelleme)
    slaWashCureAddon: 25.0,   // TL / baskı (İPA yıkama, eldiven, filtre sarfiyatı)
    defaultMarginPercent: 50  // % Varsayılan Hedef Kâr Marjı
  },

  // Hammadde Fiyatları (Varsayılanlar)
  materials: {
    filenta_pla: { name: 'Filenta PLA', type: 'fdm', pricePerKg: 450, density: 1.24 },
    filenta_petg: { name: 'Filenta PETG', type: 'fdm', pricePerKg: 480, density: 1.27 },
    filenta_abs: { name: 'Filenta ABS / ASA', type: 'fdm', pricePerKg: 500, density: 1.05 },
    elegoo_standard_resin: { name: 'Elegoo Standart Reçine', type: 'sla', pricePerKg: 850, density: 1.10 },
    elegoo_16k_resin: { name: 'Elegoo 16K Reçine', type: 'sla', pricePerKg: 1200, density: 1.12 }
  },

  // Dinamik Özel Maliyet & Gider Kalemleri (Kullanıcı Tanımlı)
  customCostItems: [
    {
      id: 'cost_shipping',
      name: 'Yurtiçi Kargo / Kurye Gönderimi',
      category: 'service',
      type: 'fixed',
      rate: 110,
      enabled: false,
      defaultEnabled: false
    },
    {
      id: 'cost_packaging',
      name: 'Hassas Kutu & Baloncuklu Ambalaj',
      category: 'material',
      type: 'per_piece',
      rate: 20,
      enabled: true,
      defaultEnabled: true
    },
    {
      id: 'cost_inserts',
      name: 'Pirinç Dişli / Insert Somun Montajı',
      category: 'labor',
      type: 'per_piece',
      rate: 15,
      enabled: false,
      defaultEnabled: false
    },
    {
      id: 'cost_surface_finish',
      name: 'Zımpara, Astar & Yüzey Temizliği',
      category: 'labor',
      type: 'hourly',
      rate: 120,
      enabled: false,
      defaultEnabled: false
    },
    {
      id: 'cost_workshop_consumables',
      name: 'Genel Atölye Sarf & Yağlama Payı',
      category: 'overhead',
      type: 'percentage',
      rate: 5,
      enabled: true,
      defaultEnabled: true
    }
  ],

  // Firma & Atölye Kurumsal Kimliği (Teklif ve Fişler)
  company: {
    name: '3D Baskı ve Prototip Atölyesi',
    contact: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    logo: '' // Base64 data URI
  },

  // Tercihler
  language: 'tr',
  country: 'tr'
};

// ========================================================
// PİYASADAKİ POPÜLER 3D YAZICILAR KATALOĞU (DATA)
// ========================================================
const PRINTER_CATALOG = [
  // Bambu Lab
  { id: 'bambu_x1c', brand: 'bambu', name: 'Bambu Lab X1-Carbon (Combo)', type: 'fdm', bedX: 256, bedY: 256, bedZ: 256, powerWatts: 350, purchasePrice: 48000, lifespanHours: 5000, wearPerHour: 3.50 },
  { id: 'bambu_p1s', brand: 'bambu', name: 'Bambu Lab P1S (Combo)', type: 'fdm', bedX: 256, bedY: 256, bedZ: 256, powerWatts: 350, purchasePrice: 32000, lifespanHours: 4500, wearPerHour: 2.80 },
  { id: 'bambu_a1', brand: 'bambu', name: 'Bambu Lab A1 (Combo)', type: 'fdm', bedX: 256, bedY: 256, bedZ: 256, powerWatts: 250, purchasePrice: 21000, lifespanHours: 4000, wearPerHour: 2.00 },
  { id: 'bambu_a1_mini', brand: 'bambu', name: 'Bambu Lab A1 Mini', type: 'fdm', bedX: 180, bedY: 180, bedZ: 180, powerWatts: 150, purchasePrice: 12500, lifespanHours: 3500, wearPerHour: 1.50 },

  // Creality (Orca Slicer Resmi Profilleri)
  { id: 'creality_hi_combo_cat', brand: 'creality', name: 'Creality Hi / Hi Combo (Orca)', type: 'fdm', bedX: 260, bedY: 260, bedZ: 300, powerWatts: 350, purchasePrice: 28000, lifespanHours: 5000, wearPerHour: 2.80 },
  { id: 'creality_k1_max', brand: 'creality', name: 'Creality K1 Max (AI Kameralı)', type: 'fdm', bedX: 300, bedY: 300, bedZ: 300, powerWatts: 1000, purchasePrice: 34000, lifespanHours: 5000, wearPerHour: 3.20 },
  { id: 'creality_k1c', brand: 'creality', name: 'Creality K1C (Karbon Uyumlu)', type: 'fdm', bedX: 220, bedY: 220, bedZ: 250, powerWatts: 350, purchasePrice: 22500, lifespanHours: 4500, wearPerHour: 2.40 },
  { id: 'creality_ender3_v3', brand: 'creality', name: 'Creality Ender-3 V3 (CoreXZ)', type: 'fdm', bedX: 220, bedY: 220, bedZ: 250, powerWatts: 350, purchasePrice: 14500, lifespanHours: 3500, wearPerHour: 1.80 },
  { id: 'creality_ender3_v3_plus', brand: 'creality', name: 'Creality Ender-3 V3 Plus (Orca)', type: 'fdm', bedX: 300, bedY: 300, bedZ: 330, powerWatts: 350, purchasePrice: 18500, lifespanHours: 4000, wearPerHour: 2.00 },
  { id: 'creality_ender3_v3_se', brand: 'creality', name: 'Creality Ender-3 V3 SE', type: 'fdm', bedX: 220, bedY: 220, bedZ: 250, powerWatts: 350, purchasePrice: 9500, lifespanHours: 3000, wearPerHour: 1.40 },
  { id: 'creality_halot_mage_pro', brand: 'creality', name: 'Creality Halot Mage Pro 8K', type: 'sla', bedX: 228, bedY: 128, bedZ: 230, powerWatts: 150, purchasePrice: 24000, lifespanHours: 2500, wearPerHour: 3.80 },

  // Prusa
  { id: 'prusa_mk4', brand: 'prusa', name: 'Prusa MK4 / MK4S', type: 'fdm', bedX: 250, bedY: 210, bedZ: 220, powerWatts: 200, purchasePrice: 38000, lifespanHours: 6000, wearPerHour: 2.20 },
  { id: 'prusa_xl', brand: 'prusa', name: 'Prusa XL (Toolchanger)', type: 'fdm', bedX: 360, bedY: 360, bedZ: 360, powerWatts: 450, purchasePrice: 98000, lifespanHours: 7000, wearPerHour: 5.50 },
  { id: 'prusa_mini', brand: 'prusa', name: 'Prusa MINI+', type: 'fdm', bedX: 180, bedY: 180, bedZ: 180, powerWatts: 160, purchasePrice: 19500, lifespanHours: 4500, wearPerHour: 1.60 },

  // Flashforge
  { id: 'ff_ad5x_cat', brand: 'flashforge', name: 'FlashForge Adventurer 5X (AD5X)', type: 'fdm', bedX: 220, bedY: 220, bedZ: 220, powerWatts: 200, purchasePrice: 18000, lifespanHours: 4500, wearPerHour: 1.80 },
  { id: 'ff_ad5m', brand: 'flashforge', name: 'FlashForge Adventurer 5M', type: 'fdm', bedX: 220, bedY: 220, bedZ: 220, powerWatts: 200, purchasePrice: 15500, lifespanHours: 4000, wearPerHour: 1.80 },
  { id: 'ff_ad5m_pro_cat', brand: 'flashforge', name: 'FlashForge Adventurer 5M Pro', type: 'fdm', bedX: 220, bedY: 220, bedZ: 220, powerWatts: 220, purchasePrice: 22000, lifespanHours: 4500, wearPerHour: 2.20 },
  { id: 'ff_creator_4', brand: 'flashforge', name: 'FlashForge Creator 4 (Endüstriyel IDEX)', type: 'fdm', bedX: 400, bedY: 350, bedZ: 500, powerWatts: 850, purchasePrice: 92000, lifespanHours: 8000, wearPerHour: 6.50 },

  // Qidi Tech
  { id: 'qidi_q1_pro', brand: 'qidi', name: 'Qidi Q1 Pro (60°C Isıtmalı Hazne)', type: 'fdm', bedX: 250, bedY: 250, bedZ: 250, powerWatts: 380, purchasePrice: 26500, lifespanHours: 5000, wearPerHour: 2.90 },
  { id: 'qidi_x_max_3', brand: 'qidi', name: 'Qidi X-Max 3 (Büyük Hacim)', type: 'fdm', bedX: 325, bedY: 325, bedZ: 315, powerWatts: 450, purchasePrice: 42000, lifespanHours: 5500, wearPerHour: 3.80 },
  { id: 'qidi_x_plus_3', brand: 'qidi', name: 'Qidi X-Plus 3', type: 'fdm', bedX: 280, bedY: 280, bedZ: 270, powerWatts: 400, purchasePrice: 32000, lifespanHours: 5000, wearPerHour: 3.20 },

  // Elegoo
  { id: 'elegoo_neptune_4_pro', brand: 'elegoo', name: 'Elegoo Neptune 4 Pro', type: 'fdm', bedX: 225, bedY: 225, bedZ: 265, powerWatts: 300, purchasePrice: 13500, lifespanHours: 3500, wearPerHour: 1.70 },
  { id: 'elegoo_neptune_4_plus', brand: 'elegoo', name: 'Elegoo Neptune 4 Plus', type: 'fdm', bedX: 320, bedY: 320, bedZ: 385, powerWatts: 400, purchasePrice: 19500, lifespanHours: 4000, wearPerHour: 2.30 },
  { id: 'elegoo_saturn_4_ultra_cat', brand: 'elegoo', name: 'Elegoo Saturn 4 Ultra 16K', type: 'sla', bedX: 218.88, bedY: 122.88, bedZ: 220, powerWatts: 100, purchasePrice: 26000, lifespanHours: 2500, wearPerHour: 3.50 },
  { id: 'elegoo_mars_4_ultra', brand: 'elegoo', name: 'Elegoo Mars 4 Ultra 9K', type: 'sla', bedX: 153.36, bedY: 77.76, bedZ: 165, powerWatts: 72, purchasePrice: 14500, lifespanHours: 2000, wearPerHour: 2.80 },

  // Anycubic
  { id: 'anycubic_kobra_3_combo', brand: 'anycubic', name: 'Anycubic Kobra 3 Combo (Çok Renkli)', type: 'fdm', bedX: 250, bedY: 250, bedZ: 260, powerWatts: 350, purchasePrice: 22000, lifespanHours: 4000, wearPerHour: 2.20 },
  { id: 'anycubic_kobra_2_pro', brand: 'anycubic', name: 'Anycubic Kobra 2 Pro', type: 'fdm', bedX: 220, bedY: 220, bedZ: 250, powerWatts: 260, purchasePrice: 13800, lifespanHours: 3500, wearPerHour: 1.80 },
  { id: 'anycubic_mono_m5s', brand: 'anycubic', name: 'Anycubic Photon Mono M5s (12K SLA)', type: 'sla', bedX: 218.88, bedY: 122.88, bedZ: 200, powerWatts: 100, purchasePrice: 21500, lifespanHours: 2500, wearPerHour: 3.40 }
];

// ========================================================
// PİYASA HAMMADDE & FİLAMENT KATALOĞU (ÜLKE BAZLI DATA)
// ========================================================
const MATERIAL_CATALOG = {
  tr: [
    { id: 'filenta_pla', name: 'Filenta PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 450 },
    { id: 'filenta_petg', name: 'Filenta PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 245, bedTemp: 75, pricePerKg: 480 },
    { id: 'filenta_abs', name: 'Filenta ABS / ASA', type: 'fdm', family: 'ABS', density: 1.05, nozzleTemp: 260, bedTemp: 100, pricePerKg: 500 },
    { id: 'porima_pla', name: 'Porima Classic PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 490 },
    { id: 'porima_petg', name: 'Porima PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 245, bedTemp: 75, pricePerKg: 510 },
    { id: 'porima_abs', name: 'Porima ABS', type: 'fdm', family: 'ABS', density: 1.05, nozzleTemp: 255, bedTemp: 95, pricePerKg: 530 },
    { id: 'porima_tpu', name: 'Porima TPU 95A (Esnek)', type: 'fdm', family: 'TPU', density: 1.21, nozzleTemp: 225, bedTemp: 45, pricePerKg: 680 },
    { id: 'microzey_pla', name: 'Microzey PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 420 },
    { id: 'microzey_tough', name: 'Microzey Tough PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 220, bedTemp: 55, pricePerKg: 470 },
    { id: 'microzey_petg', name: 'Microzey PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 240, bedTemp: 75, pricePerKg: 450 },
    { id: 'esun_pla_plus', name: 'eSun PLA+ (Pro)', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 60, pricePerKg: 620 },
    { id: 'esun_petg', name: 'eSun PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 245, bedTemp: 75, pricePerKg: 640 },
    { id: 'esun_epa_cf', name: 'eSun ePA-CF (Karbon Takviyeli)', type: 'fdm', family: 'PA-CF', density: 1.20, nozzleTemp: 280, bedTemp: 85, pricePerKg: 1450 },
    { id: 'creality_hyper_pla', name: 'Creality Hyper PLA', type: 'fdm', family: 'PLA', density: 1.25, nozzleTemp: 220, bedTemp: 55, pricePerKg: 580 },
    { id: 'creality_ender_pla', name: 'Creality Ender PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 210, bedTemp: 55, pricePerKg: 460 },
    { id: 'abg_pla', name: 'ABG Filament PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 390 },
    { id: 'elegoo_standard_resin', name: 'Elegoo Standart Reçine (SLA)', type: 'sla', family: 'Resin', density: 1.10, layerSec: 2.2, pricePerKg: 850 },
    { id: 'elegoo_16k_resin', name: 'Elegoo 16K Yüksek Çözünürlük Reçine', type: 'sla', family: 'Resin', density: 1.12, layerSec: 1.8, pricePerKg: 1200 },
    { id: 'elegoo_water_washable', name: 'Elegoo Suyla Yıkanabilir Reçine', type: 'sla', family: 'Resin', density: 1.10, layerSec: 2.5, pricePerKg: 980 },
    { id: 'anycubic_std_resin', name: 'Anycubic Standart UV Reçine', type: 'sla', family: 'Resin', density: 1.10, layerSec: 2.0, pricePerKg: 820 },
    { id: 'custom', name: 'Özel Malzeme...', type: 'custom', family: 'Custom', density: 1.24, pricePerKg: 450 }
  ],
  global: [
    { id: 'bambu_pla_basic', name: 'Bambu Lab PLA Basic', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 220, bedTemp: 55, pricePerKg: 850 },
    { id: 'bambu_pla_matte', name: 'Bambu Lab PLA Matte', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 220, bedTemp: 55, pricePerKg: 890 },
    { id: 'bambu_petg_basic', name: 'Bambu Lab PETG Basic', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 250, bedTemp: 75, pricePerKg: 850 },
    { id: 'polymaker_polylite', name: 'Polymaker PolyLite PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 780 },
    { id: 'polymaker_polyterra', name: 'Polymaker PolyTerra PLA (Matte)', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 55, pricePerKg: 720 },
    { id: 'polymaker_pa_cf', name: 'Polymaker Fiberon PA6-CF', type: 'fdm', family: 'PA-CF', density: 1.20, nozzleTemp: 285, bedTemp: 85, pricePerKg: 1950 },
    { id: 'prusament_pla', name: 'Prusament PLA Premium', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 215, bedTemp: 60, pricePerKg: 990 },
    { id: 'prusament_petg', name: 'Prusament PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 250, bedTemp: 80, pricePerKg: 990 },
    { id: 'sunlu_pla', name: 'Sunlu Standard PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 210, bedTemp: 55, pricePerKg: 580 },
    { id: 'sunlu_petg', name: 'Sunlu PETG', type: 'fdm', family: 'PETG', density: 1.27, nozzleTemp: 245, bedTemp: 75, pricePerKg: 610 },
    { id: 'overture_pla', name: 'Overture High Speed PLA', type: 'fdm', family: 'PLA', density: 1.24, nozzleTemp: 225, bedTemp: 55, pricePerKg: 650 },
    { id: 'overture_tpu', name: 'Overture High Speed TPU', type: 'fdm', family: 'TPU', density: 1.21, nozzleTemp: 225, bedTemp: 45, pricePerKg: 920 },
    { id: 'siraya_tech_fast', name: 'Siraya Tech Fast ABS-Like Resin', type: 'sla', family: 'Resin', density: 1.11, layerSec: 2.2, pricePerKg: 1350 },
    { id: 'siraya_tech_blu', name: 'Siraya Tech Blu Tough Resin', type: 'sla', family: 'Resin', density: 1.12, layerSec: 2.8, pricePerKg: 1950 },
    { id: 'elegoo_8k_resin_gl', name: 'Elegoo 8K/16K Space Grey Resin', type: 'sla', family: 'Resin', density: 1.12, layerSec: 1.8, pricePerKg: 1050 },
    { id: 'custom_gl', name: 'Özel / Custom Material...', type: 'custom', family: 'Custom', density: 1.24, pricePerKg: 800 }
  ]
};

// ========================================================
// ÇOKLU DİL DESTEĞİ (i18n: TR & EN SÖZLÜĞÜ)
// ========================================================
const I18N = {
  tr: {
    appTitle: "3D Baskı Maliyet & Teklif Robotu",
    workshopEdition: "Atölye Sürümü",
    headerDesc: "Filenta PLA & Elegoo Reçine • 8x Yazıcı Filosu • Kira & Amortisman Entegre",
    navCalc: "Maliyet Hesapla",
    navFleet: "Makine Parkı (8 Yazıcı)",
    navWorkshop: "Firma, Atölye & Gider Ayarları",
    navQuote: "Müşteri Teklifi (PDF/Fiş)",
    navReports: "Detaylı Maliyet Raporları & Arşiv (Patron)",
    tabCalc: "Maliyet Hesapla",
    tabFleet: "Makine Parkı",
    tabWorkshop: "Atölye Giderleri & Kira",
    tabQuote: "Müşteri Teklifi (PDF/Fiş)",
    dataSaved: "Veriler Kaydedildi",
    factoryReset: "Fabrika Ayarları",
    loadModelTitle: "Model Yükle (.STL, .3MF, .GCODE)",
    dragDrop: "Sürükle & Bırak",
    chooseFile: "Dosya seçin",
    orDrag: "veya buraya sürükleyin",
    viewerTitle: "3D Görselleştirici & Tabla",
    wireframe: "Kafes",
    recenter: "Ortala",
    orientTitle: "Yönlendirme:",
    snapBed: "Tablaya Oturt",
    centerModel: "Merkezle",
    tabSupport: "Destek Boyama",
    tabColor: "Çok Renkli Boyama",
    paintBrush: "Fırça ile Boya",
    modelColorCount: "Modeldeki Renkler:",
    resetModelColors: "Sıfırla",
    inspect: "İncele",
    addSupport: "Destek Ekle",
    blockSupport: "Engelle",
    eraser: "Silgi",
    diameter: "Çap:",
    autoOverhang: "Oto Sarkma (>45°)",
    clear: "Temizle",
    dimensions: "Ebatlar (X, Y, Z)",
    volume: "Model Hacmi",
    surfaceArea: "Yüzey Alanı",
    resizeTitle: "Model Boyutları & Ölçekleme (Resize)",
    lockAspect: "Orantıyı Koru",
    resetSize: "Orijinal Boyut",
    applySize: "Uygula",
    statDimsLabel: "Ebatlar (X, Y, Z)",
    statVolumeLabel: "Model Hacmi",
    statSurfaceLabel: "Yüzey Alanı",
    infillPercentLabel: "İç Dolgu Oranı (%)",
    wallCountLabel: "Duvar / Kabuk Sayısı",
    calculatedWeightLabel: "Hesaplanan Gramaj",
    layerHeightLabel: "Katman Kalınlığı",
    recalcFromGeometry: "Geometriden Güncelle",
    customCostItemsTitle: "Ek Gider & İşçilik Kalemleri",
    manageCostItems: "+ Kalem Yönet / Ekle",
    costCustomItemsLabel: "Ek Kalemler & İşçilik:",
    customCostItemsMgmtTitle: "Özel Maliyet & Gider Kalemleri Yönetimi",
    customCostItemsMgmtDesc: "İşçilik, kargo, ambalaj, pirinç dişli montajı gibi istediğiniz tüm özel gider kalemlerini ekleyebilir, silebilir ve düzenleyebilirsiniz.",
    addNewCostItem: "Yeni Kalem Ekle",
    reportsTabTitle: "Detaylı İç Maliyet Raporu & Veritabanı Arşivi",
    reportsTabDesc: "Bu ekran yalnızca atölye sahibine özeldir. Elektrik, kira, amortisman, net maliyet ve kâr marjı detayları müşteri teklifinde ASLA görünmez.",
    btnSaveReportToDb: "Mevcut Modeli Arşivle & Kaydet",
    archivedReportsDbTitle: "Arşivlenmiş Maliyet Raporları Veritabanı",
    archivedReportsDbDesc: "Önceden hesaplanıp kaydedilmiş tüm modeller ve finansal analiz geçmişi.",
    btnDetailedReport: "Detaylı Rapor (Patron)",
    btnCustomerQuote: "Müşteri Teklifi (Fiş)",
    colorOrbitHint: "Fırça açıkken Sağ Tık basılı tutarak modeli 3D döndürebilir, tekerlek ile yakınlaşabilirsiniz.",
    viewerPlaceholder: "Model yüklendiğinde 3D etkileşimli önizleme burada belirecektir.",
    viewerControlHint: "Döndürmek için sol/sağ tık • Yakınlaşmak için tekerlek",
    printParams: "Baskı ve Üretim Parametreleri",
    printerSelect: "Baskı Yapılacak Yazıcı",
    materialTitle: "Hammadde & Filament Markası",
    unitCost: "Birim Maliyet:",
    multicolorToggle: "Çok Renkli Baskı (Multicolor)",
    singleColorBadge: "Tek Renk",
    multiColorBadge: "Çok Renkli",
    filamentSwaps: "Filament Değişimi (Swaps):",
    swapWaste: "Swap Başı Fire (Poop):",
    totalWasteTime: "Toplam Atık & Ek Süre:",
    infillPercent: "Dolgu Oranı (%)",
    calcWeight: "Hesaplanan Gramaj",
    solidWeight: "Model Katı Ağırlığı:",
    updateFromGeometry: "Geometriden Güncelle",
    supportConfig: "Destek Yapılandırması (Support)",
    printTime: "Baskı Süresi (Dilimleyici / Tahmini)",
    hours: "Saat",
    minutes: "Dakika",
    totalTime: "Toplam Süre:",
    orderQuantity: "Sipariş Baskı Adedi",
    laborServices: "İşçilik & Tasarım Hizmetleri",
    prepOperation: "Operasyon & Temizleme",
    designHours: "Fusion / Blender Çizim",
    costBreakdown: "Maliyet Dökümü",
    singlePart: "1 Parça",
    rawMaterial: "Hammadde (Filament/Reçine):",
    multicolorWasteCost: "Çok Renkli Kule/Poop Atığı:",
    electricity: "Elektrik Enerjisi:",
    printerWear: "Yazıcı Aşınma & Nozzle/LCD:",
    rentShare: "Dükkan Kirası & Sabit Gider:",
    laptopShare: "Laptop & Ekipman Payı:",
    laborShare: "İşçilik & Operasyon:",
    designShare: "3D Modelleme (Fusion/Blender):",
    riskShare: "Baskı Riski & Fire (%10):",
    netTotal: "Net Üretim Maliyeti",
    targetMargin: "Hedef Kâr Marjı (%)",
    addKdv: "KDV Ekle (%20)",
    recommendedPrice: "Önerilen Satış Fiyatı",
    totalPrice: "Toplam",
    createQuote: "Teklif ve Fiş Oluştur",
    fleetTitle: "Yazıcı Filosu & Teknik Parametreler",
    fleetDesc: "Atölyenizdeki mevcut yazıcıların güç tüketimi, aşınma ve tabla ölçüleri. Piyasada bulunan hazır modellerden hızlıca ekleyebilirsiniz.",
    addFromCatalog: "Piyasadaki Hazır Yazıcılardan Ekle",
    addCustomPrinter: "Özel Yazıcı Ekle",
    catalogTitle: "Piyasadaki Popüler 3D Yazıcı Kataloğu",
    catalogDesc: "Satın almayı planladığınız veya atölyenize yeni kattığınız cihazı tek tıkla envanterinize ekleyin.",
    saveSettings: "Gider Ayarlarını Kaydet"
  },
  en: {
    appTitle: "3D Print Cost & Quote Robot",
    workshopEdition: "Workshop Edition",
    headerDesc: "Filenta PLA & Elegoo Resin • 8x Printer Fleet • Rent & Depreciation Integrated",
    navCalc: "Calculate Cost",
    navFleet: "Printer Fleet (8 Printers)",
    navWorkshop: "Company, Workshop & Cost Settings",
    navQuote: "Customer Quote (PDF/Receipt)",
    navReports: "Detailed Cost Reports & Archive (Owner)",
    tabCalc: "Calculate Cost",
    tabFleet: "Printer Fleet",
    tabWorkshop: "Workshop Overheads & Rent",
    tabQuote: "Customer Quote (PDF/Receipt)",
    dataSaved: "Data Saved",
    factoryReset: "Factory Reset",
    loadModelTitle: "Load Model (.STL, .3MF, .GCODE)",
    dragDrop: "Drag & Drop",
    chooseFile: "Choose file",
    orDrag: "or drag here",
    viewerTitle: "3D Visualizer & Bed",
    wireframe: "Wireframe",
    recenter: "Center",
    orientTitle: "Orientation:",
    snapBed: "Lay Flat",
    centerModel: "Center",
    tabSupport: "Support Paint",
    tabColor: "Multicolor Paint",
    paintBrush: "Brush Paint",
    modelColorCount: "Model Colors:",
    resetModelColors: "Reset",
    inspect: "Inspect",
    addSupport: "Enforce",
    blockSupport: "Block",
    eraser: "Eraser",
    diameter: "Dia:",
    autoOverhang: "Auto Overhang (>45°)",
    clear: "Clear",
    dimensions: "Dimensions (X, Y, Z)",
    volume: "Model Volume",
    surfaceArea: "Surface Area",
    resizeTitle: "Model Dimensions & Resize / Scale",
    lockAspect: "Lock Aspect Ratio",
    resetSize: "Reset Size",
    applySize: "Apply",
    statDimsLabel: "Dimensions (X, Y, Z)",
    statVolumeLabel: "Model Volume",
    statSurfaceLabel: "Surface Area",
    infillPercentLabel: "Infill Density (%)",
    wallCountLabel: "Perimeter Wall Count",
    calculatedWeightLabel: "Calculated Weight",
    layerHeightLabel: "Layer Height",
    recalcFromGeometry: "Recalculate from Geometry",
    customCostItemsTitle: "Additional Cost & Labor Items",
    manageCostItems: "+ Manage / Add Items",
    costCustomItemsLabel: "Custom Items & Labor:",
    customCostItemsMgmtTitle: "Custom Cost & Overhead Items Management",
    customCostItemsMgmtDesc: "Add, edit, or delete custom expense items such as labor, shipping, packaging, brass inserts, etc.",
    addNewCostItem: "Add New Cost Item",
    reportsTabTitle: "Internal Cost Breakdown Report & Database Archive",
    reportsTabDesc: "This view is strictly for the workshop owner. Overheads, rent, electricity, net cost, and margins NEVER appear on customer quotes.",
    btnSaveReportToDb: "Archive & Save Current Model",
    archivedReportsDbTitle: "Archived Cost Reports Database",
    archivedReportsDbDesc: "All previously calculated models and historical financial breakdowns.",
    btnDetailedReport: "Detailed Report (Internal)",
    btnCustomerQuote: "Customer Quote (Receipt)",
    colorOrbitHint: "Hold Right Click to orbit the 3D model while painting, scroll wheel to zoom.",
    viewerPlaceholder: "3D interactive preview will appear here when a model is loaded.",
    viewerControlHint: "Left/Right click to rotate • Wheel to zoom",
    printParams: "Printing & Production Parameters",
    printerSelect: "Target 3D Printer",
    materialTitle: "Raw Material & Brand",
    unitCost: "Unit Cost:",
    multicolorToggle: "Multicolor Printing",
    singleColorBadge: "Single Color",
    multiColorBadge: "Multicolor",
    filamentSwaps: "Filament Swaps (Tool Changes):",
    swapWaste: "Purge Waste per Swap (Poop):",
    totalWasteTime: "Total Waste & Added Time:",
    infillPercent: "Infill Density (%)",
    calcWeight: "Calculated Weight",
    solidWeight: "Solid Model Weight:",
    updateFromGeometry: "Recalculate from Geometry",
    supportConfig: "Support Configuration",
    printTime: "Print Time (Slicer / Estimated)",
    hours: "Hours",
    minutes: "Mins",
    totalTime: "Total Time:",
    orderQuantity: "Order Quantity",
    laborServices: "Labor & Design Services",
    prepOperation: "Operation & Post-processing",
    designHours: "Fusion / Blender 3D Design",
    costBreakdown: "Cost Breakdown",
    singlePart: "1 Piece",
    rawMaterial: "Raw Material (Filament/Resin):",
    multicolorWasteCost: "Multicolor Purge Tower/Waste:",
    electricity: "Electricity Energy:",
    printerWear: "Printer Wear & Nozzle/LCD:",
    rentShare: "Shop Rent & Overheads:",
    laptopShare: "Laptop & Equipment Share:",
    laborShare: "Labor & Post-processing:",
    designShare: "3D CAD Modeling (Fusion/Blender):",
    riskShare: "Print Failure Risk (%10):",
    netTotal: "Net Production Cost",
    targetMargin: "Target Profit Margin (%)",
    addKdv: "Add VAT (%20)",
    recommendedPrice: "Suggested Sales Price",
    totalPrice: "Total",
    createQuote: "Generate Quote & Receipt",
    fleetTitle: "Printer Fleet & Technical Specs",
    fleetDesc: "Power consumption, wear, and bed dimensions of your workshop printers. You can quickly add popular models from the catalog.",
    addFromCatalog: "Add from Market Catalog",
    addCustomPrinter: "Add Custom Printer",
    catalogTitle: "Market 3D Printer Catalog",
    catalogDesc: "Add popular 3D printers available on the market directly to your workshop inventory with one click.",
    saveSettings: "Save Workshop Settings"
  }
};

// ========================================================
// 2. UYGULAMA DURUMU (APP STATE)
// ========================================================
class AppState {
  constructor() {
    this.config = this.loadConfig();
    this.hasLoadedFile = false;
    this.customerInfo = this.loadCustomerInfo();
    this.currentModel = {
      name: '',
      sizeBytes: 0,
      extension: '',
      volumeCm3: 0,
      surfaceAreaCm2: 0,
      dimensions: { x: 0, y: 0, z: 0 },
      originalDimensions: { x: 0, y: 0, z: 0 },
      currentScale: { x: 100, y: 100, z: 100 },
      originalVolume: 0,
      originalSurfaceArea: 0,
      wallCount: 2,
      geometry: null,
      slicerMetadata: null,
      rawZip: null,
      originalPrinterName: '',
      colors: null,
      uniqueColorCount: 1,
      isMulticolor: false
    };
    this.currentToolTab = 'support'; // 'support' veya 'color'
    this.support = {
      type: 'auto_tree',
      toolMode: 'view', // 'view', 'enforce', 'block', 'eraser'
      brushSizeMm: 10,
      paintedAreaCm2: 0,
      overhangAreaCm2: 0,
      supportWeightGrams: 0
    };
    this.colorPaint = {
      active: false,
      currentColorHex: '#6366f1',
      brushSizeMm: 10
    };
    this.calculation = {
      quantity: 1,
      infillPercent: 20,
      weightGrams: 0,
      printTimeHours: 0,
      prepTimeMinutes: 15,
      designTimeHours: 0,
      marginPercent: (this.config.workshop && this.config.workshop.defaultMarginPercent) || 50,
      isKdvIncluded: false,
      multicolor: {
        enabled: false,
        swaps: 0,
        purgePerSwapGrams: 0.8,
        swapTimeSec: 75,
        totalPurgeGrams: 0,
        totalSwapHours: 0
      },
      costs: {}
    };
  }

  loadCustomerInfo() {
    try {
      const saved = localStorage.getItem('3d_cost_customer_info');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {
      name: '',
      phone: '',
      email: '',
      quoteNo: '#TK-' + Math.floor(1000 + Math.random() * 9000),
      validityDays: '7 Gün',
      notes: 'Fiyatlarımıza malzeme, makine süresi ve atölye işçiliği dahildir. Teslimat atölyemizden yapılır.'
    };
  }

  saveCustomerInfo() {
    try {
      localStorage.setItem('3d_cost_customer_info', JSON.stringify(this.customerInfo));
    } catch (e) { }
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('3d_cost_app_config_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Eksik yeni alanları varsayılanlardan tamamla
        parsed.language = parsed.language || 'tr';
        parsed.country = parsed.country || 'tr';
        if (parsed.workshop) {
          parsed.workshop.defaultMarginPercent = parsed.workshop.defaultMarginPercent || 50;
        }
        if (!parsed.company) {
          parsed.company = JSON.parse(JSON.stringify(DEFAULT_CONFIG.company));
        } else {
          parsed.company = Object.assign({}, DEFAULT_CONFIG.company, parsed.company);
        }
        if (!parsed.customCostItems || !Array.isArray(parsed.customCostItems) || parsed.customCostItems.length === 0) {
          parsed.customCostItems = JSON.parse(JSON.stringify(DEFAULT_CONFIG.customCostItems));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Config yüklenemedi, varsayılanlar kullanılıyor:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  saveConfig() {
    try {
      localStorage.setItem('3d_cost_app_config_v2', JSON.stringify(this.config));
      showSaveIndicator();
    } catch (e) {
      console.error('Config kaydedilemedi:', e);
    }
  }

  resetConfig() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.saveConfig();
  }
}

const state = new AppState();

/**
 * Model veya G-code yüklenip yüklenmediğini kontrol eden merkezi fonksiyon
 */
function isModelLoaded() {
  if (!state) return false;
  if (!state.hasLoadedFile) return false;
  return Boolean(
    state.currentModel && 
    (state.currentModel.geometry || 
     state.currentModel.isGCode || 
     state.currentModel.volumeCm3 > 0 || 
     (state.currentModel.sizeBytes > 0 && state.currentModel.name))
  );
}

// ========================================================
// 3. THREE.JS 3D GÖRSELLEŞTİRİCİ
// ========================================================
let scene, camera, renderer, controls, currentMesh, currentGCodeGroup, activeGCodeLayers = [], bedGridHelper, bedBoxHelper;

function initThreeViewer() {
  const container = document.getElementById('viewer-container');
  const canvas = document.getElementById('three-canvas');

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050813);

  // Camera
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(180, 220, 260);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Orbit Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = true;
  controls.maxDistance = 1200;

  // Işıklar
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight1.position.set(200, 400, 250);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.45);
  dirLight2.position.set(-200, -200, -100);
  scene.add(dirLight2);

  // Tabla oluştur
  updatePrinterBedVisual();

  // Resize Listener
  window.addEventListener('resize', onViewerResize);

  // Animasyon döngüsü
  animateThree();
}

function onViewerResize() {
  const container = document.getElementById('viewer-container');
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animateThree() {
  requestAnimationFrame(animateThree);
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function updatePrinterBedVisual() {
  if (bedGridHelper) scene.remove(bedGridHelper);
  if (bedBoxHelper) scene.remove(bedBoxHelper);

  const printer = getSelectedPrinter();
  const sizeX = printer.bedX || 220;
  const sizeY = printer.bedY || 220;
  const maxBed = Math.max(sizeX, sizeY);

  // 10mm ızgaralar
  const divisions = Math.round(maxBed / 10);
  bedGridHelper = new THREE.GridHelper(maxBed, divisions, 0x6366f1, 0x1e293b);
  bedGridHelper.position.y = 0;
  scene.add(bedGridHelper);

  // Tabla sınır çizgisi
  const bedShape = new THREE.BoxGeometry(sizeX, 1, sizeY);
  const bedEdges = new THREE.EdgesGeometry(bedShape);
  bedBoxHelper = new THREE.LineSegments(bedEdges, new THREE.LineBasicMaterial({ color: 0x4f46e5, linewidth: 2 }));
  bedBoxHelper.position.set(0, 0, 0);
  scene.add(bedBoxHelper);
}

// Destek Renk Paleti (RGB 0.0 - 1.0)
const COLOR_DEFAULT = [0.506, 0.549, 0.973];  // İndigo/Mor (Model Yüzeyi)
const COLOR_ENFORCE = [0.063, 0.725, 0.506];  // Zümrüt Yeşili (Zorunlu Destek)
const COLOR_BLOCK   = [0.937, 0.267, 0.267];  // Gül Kırmızısı (Destek Engelle)
const COLOR_OVERHANG= [0.961, 0.620, 0.043];  // Kehribar Sarısı (Otomatik Sarkma >45°)

let isPainting = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function initVertexColors(geometry) {
  const pos = geometry.attributes.position;
  const count = pos.count;
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    colors[i * 3 + 0] = COLOR_DEFAULT[0];
    colors[i * 3 + 1] = COLOR_DEFAULT[1];
    colors[i * 3 + 2] = COLOR_DEFAULT[2];
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// ========================================================
// MODELİ TABLADA YÖNLENDİRME & DÖNDÜRME (ORIENTATION TOOLS)
// ========================================================

function rotateModel(axis, angleDeg) {
  if (!currentMesh || !currentMesh.geometry) return;
  const geometry = currentMesh.geometry;
  const rad = (angleDeg * Math.PI) / 180;

  if (axis === 'x') geometry.rotateX(rad);
  else if (axis === 'y') geometry.rotateY(rad);
  else if (axis === 'z') geometry.rotateZ(rad);

  geometry.computeVertexNormals();
  snapModelToBed();
  // Yönelim değiştiğinde, o anki uzay yönünü temel referans al (true)
  updateModelDimensionsFromGeometry(true);
  
  // Model döndüğünde sarkma alanları ve baskı süresi değişir
  analyzeGeometryOverhangs(geometry);
  state.currentModel.needsTimeRecalc = true;
  checkBedFit();
  calculateCosts();
}

function snapModelToBed() {
  if (!currentMesh || !currentMesh.geometry) return;
  const geometry = currentMesh.geometry;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  // Three.js'te Y yukarı bakar. Alt tabanı tam Y=0 zeminine oturt
  const minY = bbox.min.y;
  geometry.translate(0, -minY, 0);
  currentMesh.position.set(0, 0, 0);

  updateModelDimensionsFromGeometry(false);
  analyzeGeometryOverhangs(geometry);
  checkBedFit();
}

function centerModel() {
  if (!currentMesh || !currentMesh.geometry) return;
  const geometry = currentMesh.geometry;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  const midX = (bbox.min.x + bbox.max.x) / 2;
  const midZ = (bbox.min.z + bbox.max.z) / 2;
  const minY = bbox.min.y;

  // X ve Z'de merkeze, Y'de tabana oturt
  geometry.translate(-midX, -minY, -midZ);
  currentMesh.position.set(0, 0, 0);

  updateModelDimensionsFromGeometry(false);
  // Otomatik sarkma ve alt yüzey analizi
  analyzeGeometryOverhangs(geometry);

  checkBedFit();
}

/**
 * Modelin Geometrisinden Boyutları Çıkarır
 * 3D Baskı Koordinat Eşleştirmesi:
 * Three.js X -> 3D Yazıcı X (Genişlik / Width)
 * Three.js Z -> 3D Yazıcı Y (Derinlik / Depth)
 * Three.js Y -> 3D Yazıcı Z (Yükseklik / Height)
 */
function updateModelDimensionsFromGeometry(isNewOrientation = false) {
  if (!currentMesh || !currentMesh.geometry) return;
  const geometry = currentMesh.geometry;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  const dimX = Math.max(0.1, Math.abs(bbox.max.x - bbox.min.x));
  const dimY = Math.max(0.1, Math.abs(bbox.max.z - bbox.min.z)); // Derinlik (Three.js Z)
  const dimZ = Math.max(0.1, Math.abs(bbox.max.y - bbox.min.y)); // Yükseklik (Three.js Y)

  state.currentModel.dimensions = { x: dimX, y: dimY, z: dimZ };

  // Eğer model ilk defa yükleniyorsa veya yeni bir eksene döndürüldüyse (isNewOrientation),
  // temel yönelim boyutlarını (orientedBaseDimensions) kaydet
  if (!state.currentModel.orientedBaseDimensions || isNewOrientation || !state.currentModel.originalDimensions) {
    state.currentModel.orientedBaseDimensions = { x: dimX, y: dimY, z: dimZ };
    if (!state.currentModel.originalDimensions) {
      state.currentModel.originalDimensions = { x: dimX, y: dimY, z: dimZ };
      state.currentModel.originalVolume = state.currentModel.volumeCm3 || (dimX * dimY * dimZ * 0.001);
      state.currentModel.originalSurfaceArea = state.currentModel.surfaceAreaCm2 || (Math.pow(state.currentModel.originalVolume, 2/3) * 6);
    }
  }

  // UI Ebatlar Yazısı
  const statEl = document.getElementById('stat-dimensions');
  if (statEl) {
    statEl.innerText = `${dimX.toFixed(1)} × ${dimY.toFixed(1)} × ${dimZ.toFixed(1)} mm`;
  }

  // Boyut Giriş Inputlarını Güncelle (eğer kullanıcı o anda bu kutuya odaklanmamışsa)
  const inputX = document.getElementById('input-dim-x');
  const inputY = document.getElementById('input-dim-y');
  const inputZ = document.getElementById('input-dim-z');
  if (inputX && document.activeElement !== inputX) inputX.value = dimX.toFixed(1);
  if (inputY && document.activeElement !== inputY) inputY.value = dimY.toFixed(1);
  if (inputZ && document.activeElement !== inputZ) inputZ.value = dimZ.toFixed(1);

  // Ölçek yüzdesini güncelle
  const pctInput = document.getElementById('input-scale-percent');
  if (pctInput && document.activeElement !== pctInput && state.currentModel.orientedBaseDimensions && state.currentModel.orientedBaseDimensions.x > 0) {
    const pct = Math.round((dimX / state.currentModel.orientedBaseDimensions.x) * 100);
    pctInput.value = pct || 100;
  }
}

/**
 * Modeli Belirtilen X (Genişlik), Y (Derinlik), Z (Yükseklik) Boyutlarına Göre Ölçeklendirir
 */
function applyModelDimensions(targetX, targetY, targetZ, isUniform = true) {
  if (!currentMesh || !currentMesh.geometry) return;
  const geometry = currentMesh.geometry;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;

  const currentX = Math.max(0.1, Math.abs(bbox.max.x - bbox.min.x));
  const currentY_depth = Math.max(0.1, Math.abs(bbox.max.z - bbox.min.z)); // Derinlik (Three.js Z)
  const currentZ_height = Math.max(0.1, Math.abs(bbox.max.y - bbox.min.y)); // Yükseklik (Three.js Y)

  let factorX = targetX / currentX;
  let factorY_depth = targetY / currentY_depth;
  let factorZ_height = targetZ / currentZ_height;

  if (isUniform) {
    // Orantıyı koru durumunda X değişim oranına göre orantılı ölçekle
    factorY_depth = factorX;
    factorZ_height = factorX;
  }

  // 0 veya negatif değerleri engelle
  factorX = Math.max(0.01, factorX);
  factorY_depth = Math.max(0.01, factorY_depth);
  factorZ_height = Math.max(0.01, factorZ_height);

  // Three.js geometrisini ölçeklendir:
  // scale(x, y, z) -> X: factorX, Y: factorZ_height (Yükseklik), Z: factorY_depth (Derinlik)
  geometry.scale(factorX, factorZ_height, factorY_depth);
  geometry.computeVertexNormals();

  // Tabana oturt ve merkezle
  snapModelToBed();

  // Hacim ve yüzey alanını orantılı güncelle
  const volumeMultiplier = factorX * factorY_depth * factorZ_height;
  state.currentModel.volumeCm3 = Math.max(0.01, (state.currentModel.volumeCm3 || 1) * volumeMultiplier);
  
  const surfaceMultiplier = (factorX * factorY_depth + factorY_depth * factorZ_height + factorZ_height * factorX) / 3.0;
  state.currentModel.surfaceAreaCm2 = Math.max(0.01, (state.currentModel.surfaceAreaCm2 || 1) * surfaceMultiplier);

  // İstatistikleri güncelle
  const volEl = document.getElementById('stat-volume');
  if (volEl) volEl.innerText = `${state.currentModel.volumeCm3.toFixed(2)} cm³`;
  const surfEl = document.getElementById('stat-surface');
  if (surfEl) surfEl.innerText = `${state.currentModel.surfaceAreaCm2.toFixed(1)} cm²`;

  // Model yeniden boyutlandırıldığı için süreyi ve sarkmaları yeniden hesapla
  state.currentModel.isResized = true;
  state.currentModel.needsTimeRecalc = true;
  if (currentMesh && currentMesh.geometry) {
    analyzeGeometryOverhangs(currentMesh.geometry);
  }

  // Tablaya sığma, ağırlık ve süre güncelle
  checkBedFit();
  recalculateRealisticWeight();
  calculateCosts();
}

/**
 * Modeli Yüzde Oranına Göre (%50, %100, %150 vb.) Ölçeklendirir
 */
function scaleModelByPercent(targetPercent) {
  if (!currentMesh || !currentMesh.geometry) return;
  const base = state.currentModel.orientedBaseDimensions || state.currentModel.dimensions;
  if (!base || base.x <= 0) return;

  const scale = Math.max(5, targetPercent) / 100.0;
  const targetX = base.x * scale;
  const targetY = base.y * scale;
  const targetZ = base.z * scale;

  applyModelDimensions(targetX, targetY, targetZ, true);

  const pctInput = document.getElementById('input-scale-percent');
  if (pctInput) pctInput.value = targetPercent;
}

/**
 * Modeli Orijinal Boyutuna (%100) Döndürür
 */
function resetModelDimensions() {
  scaleModelByPercent(100);
}

// Hex rengi [r, g, b] float 0.0-1.0 array'e çevirir
function hexToRgbFloat(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [
    ((num >> 16) & 255) / 255.0,
    ((num >> 8) & 255) / 255.0,
    (num & 255) / 255.0
  ];
}

function displayModelIn3D(geometry) {
  if (currentMesh) {
    scene.remove(currentMesh);
    if (currentMesh.geometry) currentMesh.geometry.dispose();
    if (currentMesh.material) currentMesh.material.dispose();
  }

  // Geometriyi merkeze al ve tabana oturt
  geometry.computeBoundingBox();
  const bboxInit = geometry.boundingBox;
  const midX = (bboxInit.min.x + bboxInit.max.x) / 2;
  const midZ = (bboxInit.min.z + bboxInit.max.z) / 2;
  const minY = bboxInit.min.y;
  geometry.translate(-midX, -minY, -midZ);

  // Eğer geometride renk attribute'u yoksa varsayılan mor renkle başlat
  if (!geometry.attributes.color) {
    initVertexColors(geometry);
  }

  // Şık malzeme (Vertex Renkleri Aktif)
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.35,
    metalness: 0.15,
    flatShading: false
  });

  currentMesh = new THREE.Mesh(geometry, material);
  currentMesh.position.set(0, 0, 0); // Tablanın tam üstünde
  scene.add(currentMesh);

  // Kamerayı modele göre ayarla
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  const maxDim = Math.max(
    bbox.max.x - bbox.min.x,
    bbox.max.y - bbox.min.y,
    bbox.max.z - bbox.min.z
  );
  const heightY = bbox.max.y - bbox.min.y;
  
  const distance = Math.max(maxDim * 2.2, 120);
  camera.position.set(distance * 0.75, distance * 0.9, distance * 1.1);
  camera.lookAt(0, heightY / 2, 0);
  controls.target.set(0, heightY / 2, 0);
  controls.update();

  // Arayüzü güncelle
  document.getElementById('viewer-placeholder').classList.add('hidden');
  document.getElementById('three-canvas').classList.remove('hidden');

  // Boyama olaylarını canvas'a bağla
  setupPainterEvents();

  // Renk istatistiklerini kontrol et
  updateMulticolorStatistics();

  // Otomatik sarkma ve alt yüzey analizi
  analyzeGeometryOverhangs(geometry);

  checkBedFit();
}

/**
 * 3D Model Üzerinde Boyama Etkileşimi (Hem Destek Hem Çok Renk)
 * Sağ Tık ile Serbest 3D Döndürme, Sol Tık ile Fırça Boyama
 */
function setupPainterEvents() {
  const canvas = renderer.domElement;

  // Sağ tık tarayıcı menüsünü engelle (serbest 3D döndürme için)
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.onpointerdown = (e) => {
    // Sağ tık (e.button === 2) veya tekerlek (e.button === 1): kesinlikle boyama yapma, OrbitControls döndürsün
    if (e.button === 2 || e.button === 1) {
      isPainting = false;
      return;
    }

    // Sol tık (e.button === 0):
    // İnceleme modundaysa boyama yapma (OrbitControls sol tıkla da döndürsün)
    if (state.currentToolTab === 'support' && state.support.toolMode === 'view') return;
    if (state.currentToolTab === 'color' && !state.colorPaint.active) return;
    if (!currentMesh) return;

    isPainting = true;
    controls.enabled = false;
    paintUnderCursor(e);
  };

  canvas.onpointermove = (e) => {
    if (!isPainting || !currentMesh) return;
    paintUnderCursor(e);
  };

  const stopPainting = () => {
    if (isPainting) {
      isPainting = false;
      controls.enabled = true;
      if (state.currentToolTab === 'support') {
        updateSupportStatistics();
      } else {
        updateMulticolorStatistics();
      }
    }
  };

  canvas.onpointerup = stopPainting;
  canvas.onpointerleave = stopPainting;
}

/**
 * Fırça ve Orbit Kontrollerini Senkronize Eder
 */
function updateBrushOrbitControls() {
  if (!controls) return;
  const isBrushActive = (state.currentToolTab === 'support' && state.support.toolMode !== 'view') ||
                        (state.currentToolTab === 'color' && state.colorPaint.active);

  controls.enabled = true;
  if (isBrushActive) {
    // Fırça aktifken: Sol tık boyar, Sağ tık serbestçe 3D döndürür, Orta tekerlek zoom yapar
    controls.mouseButtons = {
      LEFT: null,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };
  } else {
    // İnceleme modu: Sol tık ve Sağ tık 3D döndürür
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };
  }
}

function paintUnderCursor(e) {
  if (!currentMesh || !renderer) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(currentMesh);

  if (intersects.length > 0) {
    const hitPoint = intersects[0].point;
    // Yerel koordinata çevir
    const localHit = currentMesh.worldToLocal(hitPoint.clone());
    
    if (state.currentToolTab === 'color') {
      applyColorBrushAt(localHit);
    } else {
      applyBrushAt(localHit);
    }
  }
}

function applyBrushAt(localPoint) {
  const geometry = currentMesh.geometry;
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;
  if (!col) return;

  const radius = state.support.brushSizeMm || 10;
  const radiusSq = radius * radius;

  let targetColor = COLOR_ENFORCE;
  if (state.support.toolMode === 'block') targetColor = COLOR_BLOCK;
  if (state.support.toolMode === 'eraser') targetColor = COLOR_DEFAULT;

  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);

    const dx = px - localPoint.x;
    const dy = py - localPoint.y;
    const dz = pz - localPoint.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq <= radiusSq) {
      col.setXYZ(i, targetColor[0], targetColor[1], targetColor[2]);
    }
  }

  col.needsUpdate = true;
}

function applyColorBrushAt(localPoint) {
  const geometry = currentMesh.geometry;
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;
  if (!col) return;

  const radius = state.colorPaint.brushSizeMm || 10;
  const radiusSq = radius * radius;
  const targetRgb = hexToRgbFloat(state.colorPaint.currentColorHex || '#6366f1');

  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);

    const dx = px - localPoint.x;
    const dy = py - localPoint.y;
    const dz = pz - localPoint.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq <= radiusSq) {
      col.setXYZ(i, targetRgb[0], targetRgb[1], targetRgb[2]);
    }
  }

  col.needsUpdate = true;
}

/**
 * Modeldeki Benzersiz Renkleri Sayar ve Çok Renkli Baskı Parametrelerini Otomatik Önerir
 */
function updateMulticolorStatistics() {
  if (!currentMesh || !currentMesh.geometry) return;
  const col = currentMesh.geometry.attributes.color;
  if (!col) return;

  const count = col.count;
  const colorSet = new Set();

  // Örnekleme ile renkleri tara
  const step = Math.max(1, Math.floor(count / 2000));
  for (let i = 0; i < count; i += step) {
    const r = Math.round(col.getX(i) * 10);
    const g = Math.round(col.getY(i) * 10);
    const b = Math.round(col.getZ(i) * 10);
    colorSet.add(`${r}_${g}_${b}`);
  }

  const uniqueColors = Math.max(1, colorSet.size);
  state.currentModel.uniqueColorCount = uniqueColors;

  const countBadge = document.getElementById('model-color-count');
  if (countBadge) {
    countBadge.innerText = `${uniqueColors} ${uniqueColors > 1 ? 'Renk' : 'Renk (Tek)'}`;
  }

  const multiToggle = document.getElementById('calc-multicolor-enabled');
  const detailsCont = document.getElementById('multicolor-details-container');
  const statusBadge = document.getElementById('multicolor-status-badge');

  if (uniqueColors > 1) {
    if (multiToggle && !multiToggle.checked) {
      multiToggle.checked = true;
      if (detailsCont) detailsCont.classList.remove('hidden');
      if (statusBadge) {
        statusBadge.innerText = `${uniqueColors} Renkli`;
        statusBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30';
      }
      // Tahmini swap önerisi: Eğer henüz swap girilmemişse model yüksekliğine göre katman tahmini
      const swapsInput = document.getElementById('calc-color-swaps');
      if (swapsInput && parseInt(swapsInput.value) === 0) {
        const heightMm = (state.currentModel.dimensions && state.currentModel.dimensions.z) || 40;
        const estLayers = Math.round(heightMm / 0.2);
        const estSwaps = Math.min(Math.round(estLayers * (uniqueColors - 1) * 0.4), 250);
        swapsInput.value = Math.max(2, estSwaps);
      }
    }
  }

  calculateCosts();
}

/**
 * Modeli Tek Renke Sıfırla
 */
function resetModelColors() {
  if (!currentMesh || !currentMesh.geometry) return;
  initVertexColors(currentMesh.geometry);
  currentMesh.geometry.attributes.color.needsUpdate = true;
  updateMulticolorStatistics();
}

/**
 * 3D Model Geometrisini Sessizce Tarayarak Gerçek Sarkma (Overhang) Alanını ve Yüksekliğini Tespit Eder
 * Model ilk yüklendiğinde ve yönlendirildiğinde (döndürme, tablaya oturtma) otomatik çalışır.
 */
function analyzeGeometryOverhangs(geometry) {
  if (!geometry || !geometry.attributes.position) {
    state.support.detectedOverhangAreaCm2 = 0;
    state.support.avgOverhangHeightCm = 0;
    return;
  }

  const pos = geometry.attributes.position;
  const indices = geometry.index ? geometry.index.array : null;
  const count = indices ? indices.length / 3 : pos.count / 3;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let totalOverhangAreaMm2 = 0;
  let weightedHeightMm = 0;

  for (let i = 0; i < count; i++) {
    const i1 = indices ? indices[i * 3 + 0] : i * 3 + 0;
    const i2 = indices ? indices[i * 3 + 1] : i * 3 + 1;
    const i3 = indices ? indices[i * 3 + 2] : i * 3 + 2;

    p1.fromBufferAttribute(pos, i1);
    p2.fromBufferAttribute(pos, i2);
    p3.fromBufferAttribute(pos, i3);

    e1.subVectors(p2, p1);
    e2.subVectors(p3, p1);
    normal.crossVectors(e1, e2).normalize();

    // Three.js'te Y yukarı bakar. Aşağı bakan yüzeyler: normal.y < -0.15
    if (normal.y < -0.15) {
      const cosAngle = Math.min(1.0, Math.max(0.0, -normal.y));
      const angleDeg = Math.acos(cosAngle) * (180.0 / Math.PI);

      // 45 dereceden dik sarkan açılar (altı boş yüzeyler)
      if (angleDeg < 45.0) {
        cross.crossVectors(e1, e2);
        const areaMm2 = cross.length() * 0.5;

        // Üçgenin tabladan yüksekliği (Y koordinatı)
        const avgY = Math.max(0, (p1.y + p2.y + p3.y) / 3.0);

        // Eğer yüzey doğrudan tabla tabanına yapışıksa (Y < 0.6mm), destek gerekmez (taban yüzeyidir)
        if (avgY > 0.6) {
          totalOverhangAreaMm2 += areaMm2;
          weightedHeightMm += (avgY * areaMm2);
        }
      }
    }
  }

  const overhangAreaCm2 = totalOverhangAreaMm2 / 100.0;
  const avgHeightCm = totalOverhangAreaMm2 > 0 ? ((weightedHeightMm / totalOverhangAreaMm2) / 10.0) : 0;

  state.support.detectedOverhangAreaCm2 = overhangAreaCm2;
  state.support.avgOverhangHeightCm = avgHeightCm;

  const statAreaEl = document.getElementById('stat-painted-area');
  if (statAreaEl) {
    const displayArea = Math.max(state.support.paintedAreaCm2 || 0, overhangAreaCm2);
    statAreaEl.innerText = `${displayArea.toFixed(1)} cm²`;
  }
}

/**
 * Otomatik Sarkma Analizi (> 45° Havada Kalan Yüzeyleri Sarı Boyar)
 */
function autoDetectOverhangs() {
  if (!currentMesh) {
    alert('Lütfen önce bir 3D model (.STL veya .3MF) yükleyin.');
    return;
  }

  const geometry = currentMesh.geometry;
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;
  const indices = geometry.index ? geometry.index.array : null;
  const count = indices ? indices.length / 3 : pos.count / 3;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let overhangAreaMm2 = 0;
  let weightedHeightMm = 0;

  for (let i = 0; i < count; i++) {
    const i1 = indices ? indices[i * 3 + 0] : i * 3 + 0;
    const i2 = indices ? indices[i * 3 + 1] : i * 3 + 1;
    const i3 = indices ? indices[i * 3 + 2] : i * 3 + 2;

    p1.fromBufferAttribute(pos, i1);
    p2.fromBufferAttribute(pos, i2);
    p3.fromBufferAttribute(pos, i3);

    e1.subVectors(p2, p1);
    e2.subVectors(p3, p1);
    normal.crossVectors(e1, e2).normalize();

    if (normal.y < -0.15) {
      const cosAngle = Math.min(1.0, Math.max(0.0, -normal.y));
      const angleDeg = Math.acos(cosAngle) * (180.0 / Math.PI);

      if (angleDeg < 45.0) {
        const avgY = Math.max(0, (p1.y + p2.y + p3.y) / 3.0);
        if (avgY > 0.6) {
          col.setXYZ(i1, COLOR_OVERHANG[0], COLOR_OVERHANG[1], COLOR_OVERHANG[2]);
          col.setXYZ(i2, COLOR_OVERHANG[0], COLOR_OVERHANG[1], COLOR_OVERHANG[2]);
          col.setXYZ(i3, COLOR_OVERHANG[0], COLOR_OVERHANG[1], COLOR_OVERHANG[2]);

          cross.crossVectors(e1, e2);
          const area = cross.length() * 0.5;
          overhangAreaMm2 += area;
          weightedHeightMm += (avgY * area);
        }
      }
    }
  }

  col.needsUpdate = true;
  state.support.overhangAreaCm2 = overhangAreaMm2 / 100.0;
  state.support.detectedOverhangAreaCm2 = overhangAreaMm2 / 100.0;
  state.support.avgOverhangHeightCm = overhangAreaMm2 > 0 ? ((weightedHeightMm / overhangAreaMm2) / 10.0) : 0;
  updateSupportStatistics();
}

/**
 * Tüm Destek Boyamasını Sıfırlar
 */
function clearSupportPainting() {
  if (!currentMesh) return;
  const col = currentMesh.geometry.attributes.color;
  const count = col.count;

  for (let i = 0; i < count; i++) {
    col.setXYZ(i, COLOR_DEFAULT[0], COLOR_DEFAULT[1], COLOR_DEFAULT[2]);
  }
  col.needsUpdate = true;
  state.support.paintedAreaCm2 = 0;
  state.support.overhangAreaCm2 = 0;
  updateSupportStatistics();
}

/**
 * Destek Yüzey Alanını ve Ek Gramajı Hesaplar
 */
function updateSupportStatistics() {
  if (!currentMesh) return;

  const geometry = currentMesh.geometry;
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;
  const indices = geometry.index ? geometry.index.array : null;
  const count = indices ? indices.length / 3 : pos.count / 3;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let totalSupportAreaMm2 = 0;

  for (let i = 0; i < count; i++) {
    const i1 = indices ? indices[i * 3 + 0] : i * 3 + 0;
    const i2 = indices ? indices[i * 3 + 1] : i * 3 + 1;
    const i3 = indices ? indices[i * 3 + 2] : i * 3 + 2;

    const isEnforce = (Math.abs(col.getX(i1) - COLOR_ENFORCE[0]) < 0.05) ||
                      (Math.abs(col.getX(i1) - COLOR_OVERHANG[0]) < 0.05);

    if (isEnforce) {
      p1.fromBufferAttribute(pos, i1);
      p2.fromBufferAttribute(pos, i2);
      p3.fromBufferAttribute(pos, i3);

      e1.subVectors(p2, p1);
      e2.subVectors(p3, p1);
      cross.crossVectors(e1, e2);
      totalSupportAreaMm2 += cross.length() * 0.5;
    }
  }

  const supportAreaCm2 = totalSupportAreaMm2 / 100.0;
  state.support.paintedAreaCm2 = supportAreaCm2;

  // Ekrana yaz
  const displayArea = Math.max(supportAreaCm2, state.support.detectedOverhangAreaCm2 || 0);
  const statPaintedArea = document.getElementById('stat-painted-area');
  if (statPaintedArea) statPaintedArea.innerText = `${displayArea.toFixed(1)} cm²`;

  // Destek Gramajını ve Maliyeti Yeniden Hesapla
  calculateCosts();
}

function checkBedFit() {
  const badge = document.getElementById('bed-fit-badge');
  if (!state.currentModel.dimensions || !state.currentModel.dimensions.x || isNaN(state.currentModel.dimensions.x) || state.currentModel.dimensions.x <= 0) {
    badge.classList.add('hidden');
    return;
  }

  const p = getSelectedPrinter();
  const d = state.currentModel.dimensions;

  const modelX = d.x;
  const modelY = d.y;
  const modelZ = d.z;

  // Standart yerleşim (X, Y tablası ve Z yükseklik)
  const fitsStandard = (modelX <= p.bedX && modelY <= p.bedY && modelZ <= p.bedZ);
  // Yatayda 90 derece döndürülmüş yerleşim
  const fitsRotated = (modelY <= p.bedX && modelX <= p.bedY && modelZ <= p.bedZ);

  // Genel 3D döndürme (parça yatırılarak da sığıyor mu?)
  const modelDims = [modelX, modelY, modelZ].sort((a, b) => a - b);
  const bedDims = [p.bedX, p.bedY, p.bedZ].sort((a, b) => a - b);
  const fitsAnyOrientation = (modelDims[0] <= p.bedX && modelDims[1] <= p.bedY && modelDims[2] <= p.bedZ) ||
                             (modelDims[0] <= bedDims[0] && modelDims[1] <= bedDims[1] && modelDims[2] <= bedDims[2]);

  badge.classList.remove('hidden');
  if (fitsStandard || fitsRotated) {
    badge.className = 'absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur border badge-fit-ok';
    badge.innerHTML = `✓ ${p.name} Tablasına Sığıyor (${modelX.toFixed(0)}×${modelY.toFixed(0)}×${modelZ.toFixed(0)}mm)`;
    if (currentMesh) currentMesh.material.color.setHex(0xffffff);
  } else if (fitsAnyOrientation) {
    badge.className = 'absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur border badge-fit-ok';
    badge.innerHTML = `✓ ${p.name} Tablasına Sığıyor (Döndürülerek: ${modelX.toFixed(0)}×${modelY.toFixed(0)}×${modelZ.toFixed(0)}mm)`;
    if (currentMesh) currentMesh.material.color.setHex(0xffffff);
  } else {
    badge.className = 'absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur border badge-fit-error';
    badge.innerHTML = `⚠️ DİKKAT: Model ${p.name} tablasını aşıyor! (${modelX.toFixed(0)}×${modelY.toFixed(0)}×${modelZ.toFixed(0)}mm > ${p.bedX}×${p.bedY}×${p.bedZ}mm)`;
    if (currentMesh) currentMesh.material.color.setHex(0xf43f5e);
  }
}

// ========================================================
// 4. DOSYA İŞLEYİCİLER: STL & 3MF AYRIŞTIRMA
// ========================================================

/**
 * STL Dosyasını Ayrıştırır (Binary & ASCII)
 * Tam Hacim (cm³), Yüzey Alanı (cm²) ve Ebatları Hesaplar
 */
function parseSTL(buffer) {
  const loader = new THREE.STLLoader();
  const geometry = loader.parse(buffer);
  geometry.computeVertexNormals();

  const pos = geometry.attributes.position;
  const numTriangles = pos.count / 3;

  let totalVolume = 0;
  let totalSurfaceArea = 0;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  for (let i = 0; i < numTriangles; i++) {
    p1.fromBufferAttribute(pos, i * 3 + 0);
    p2.fromBufferAttribute(pos, i * 3 + 1);
    p3.fromBufferAttribute(pos, i * 3 + 2);

    // İmzalı Dörtyüzlü Hacmi (Signed volume of tetrahedron)
    const v = (
      p1.x * (p2.y * p3.z - p3.y * p2.z) +
      p2.x * (p3.y * p1.z - p1.y * p3.z) +
      p3.x * (p1.y * p2.z - p2.y * p1.z)
    ) / 6.0;
    totalVolume += v;

    // Yüzey alanı
    edge1.subVectors(p2, p1);
    edge2.subVectors(p3, p1);
    cross.crossVectors(edge1, edge2);
    totalSurfaceArea += cross.length() * 0.5;
  }

  // Boyutlar (Bounding Box)
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  const dimX = Math.abs(bbox.max.x - bbox.min.x);
  const dimY = Math.abs(bbox.max.y - bbox.min.y);
  const dimZ = Math.abs(bbox.max.z - bbox.min.z);

  const volumeCm3 = Math.abs(totalVolume) / 1000.0;
  const surfaceAreaCm2 = totalSurfaceArea / 100.0;

  return {
    geometry: geometry,
    volumeCm3: volumeCm3,
    surfaceAreaCm2: surfaceAreaCm2,
    dimensions: { x: dimX, y: dimY, z: dimZ }
  };
}

/**
 * 3MF Dosyasını Ayrıştırır (Zip Archive)
 * Hem Fusion 360 / Blender ham 3MF modellerini hem de Dilimlenmiş 3MF'leri destekler
 */
async function parse3MF(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  let slicerMetadata = {
    detected: false,
    weightGrams: null,
    printTimeSeconds: null
  };

  // 1. Dilimleyici metadata kontrolü ve Orijinal Cihaz Tespiti
  let detectedPrinter = 'Bilinmeyen / Genel 3MF';

  for (const [filename, file] of Object.entries(zip.files)) {
    if (filename.includes('.config') || filename.includes('.json') || filename.endsWith('.gcode')) {
      const content = await file.async('string');
      
      // Orijinal yazıcı modelini tara
      const printerMatch = content.match(/printer_model\s*=\s*"?([^"\r\n;]+)"?/i) ||
                           content.match(/printer_name\s*=\s*"?([^"\r\n;]+)"?/i) ||
                           content.match(/printer_settings_id\s*=\s*"?([^"\r\n;]+)"?/i) ||
                           content.match(/"printer_model"\s*:\s*"([^"]+)"/i);
      if (printerMatch) {
        detectedPrinter = printerMatch[1].trim();
      }

      // Filament gramajını ara (Genişletilmiş Regex)
      const weightMatch = content.match(/filament_used_g[^\d]*([\d\.]+)/i) || 
                          content.match(/filament\s*used\s*\[g\]\s*[:=]\s*([\d\.]+)/i) ||
                          content.match(/total\s*filament\s*used\s*\[g\]\s*[:=]\s*([\d\.]+)/i) ||
                          content.match(/filament_weight[^\d]*([\d\.]+)/i) ||
                          content.match(/tray_weight[^\d]*([\d\.]+)/i) ||
                          content.match(/weight[^\d]*([\d\.]+)\s*g/i);
      if (weightMatch) {
        slicerMetadata.weightGrams = parseFloat(weightMatch[1]);
        slicerMetadata.detected = true;
      }

      // Hacim üzerinden gramaj hesabı (cm3 varsa)
      const volMatch = content.match(/filament\s*used\s*\[cm3\]\s*[:=]\s*([\d\.]+)/i) ||
                       content.match(/filament_used_cm3[^\d]*([\d\.]+)/i);
      if (volMatch && !slicerMetadata.weightGrams) {
        slicerMetadata.weightGrams = parseFloat(volMatch[1]) * 1.24; // PLA yoğunluğu
        slicerMetadata.detected = true;
      }

      // Metre üzerinden gramaj hesabı (m varsa, 1.75mm PLA ~ 2.98g/m)
      const meterMatch = content.match(/filament\s*used\s*\[m\]\s*[:=]\s*([\d\.]+)/i) ||
                         content.match(/filament_used_m[^\d]*([\d\.]+)/i);
      if (meterMatch && !slicerMetadata.weightGrams) {
        slicerMetadata.weightGrams = parseFloat(meterMatch[1]) * 2.98;
        slicerMetadata.detected = true;
      }

      // Süre ara
      const timeMatch = content.match(/estimated[_\s]time[^\d]*(\d+)/i) ||
                        content.match(/time\s*=\s*(\d+)s/i) ||
                        content.match(/estimated\s*printing\s*time[^\d]*(\d+)h\s*(\d+)m/i) ||
                        content.match(/total\s*estimated\s*time\s*:\s*(\d+)h\s*(\d+)m/i);
      if (timeMatch) {
        if (timeMatch[2] !== undefined) {
          slicerMetadata.printTimeSeconds = (parseInt(timeMatch[1]) * 3600) + (parseInt(timeMatch[2]) * 60);
        } else {
          slicerMetadata.printTimeSeconds = parseInt(timeMatch[1]);
        }
        slicerMetadata.detected = true;
      }
    }
  }

  // Duruma kaydet
  state.currentModel.rawZip = zip;
  state.currentModel.originalPrinterName = detectedPrinter;

  // Arayüzdeki 3MF Uyarlama Kartını Aktif Et
  const adapterPanel = document.getElementById('adapter-panel-3mf');
  if (adapterPanel) {
    adapterPanel.classList.remove('hidden');
    document.getElementById('adapter-source-badge').innerText = `Orijinal: ${detectedPrinter}`;
    populateAdapterTargetPrinters();
  }

  // 2. Geometriyi .model dosyalarından çıkar (Tüm olası yolları ve ters/düz slashları destekler)
  const modelFileEntries = [];
  for (const [filename, file] of Object.entries(zip.files)) {
    const normalized = filename.toLowerCase().replace(/\\/g, '/');
    if (normalized.endsWith('.model')) {
      modelFileEntries.push(file);
    }
  }

  if (modelFileEntries.length === 0) {
    throw new Error('3MF arşivi içinde geçerli bir 3D model (.model) dosyası bulunamadı.');
  }

  // Kurşun Geçirmez Vertex ve Triangle Çıkarıcı
  function extractGeometryFromModelXml(xmlText) {
    let unitScale = 1.0;
    const unitMatch = xmlText.match(/\bunit\s*=\s*["']?(\w+)["']?/i);
    if (unitMatch) {
      const u = unitMatch[1].toLowerCase();
      if (u === 'micron') unitScale = 0.001;
      else if (u === 'centimeter') unitScale = 10.0;
      else if (u === 'inch') unitScale = 25.4;
      else if (u === 'meter') unitScale = 1000.0;
    }

    const verts = [];
    const inds = [];
    const colors = [];

    // 3MF Renk Paleti Taraması (<m:color color="#RRGGBB" /> veya <color color="#RRGGBBAA" />)
    const palette = [];
    const colorTagRegex = /<[^:>]*:?color\b[^>]*color\s*=\s*["']?#?([0-9a-fA-F]{6,8})["']?/gi;
    let cMatch;
    while ((cMatch = colorTagRegex.exec(xmlText)) !== null) {
      palette.push(hexToRgbFloat(cMatch[1].substring(0, 6)));
    }

    // Yöntem A: Hızlı ve Namespace-Bağımsız Regex Ayrıştırma (En Güvenilir)
    const vertexTagRegex = /<[^:>]*:?vertex\b([^>]*)\/?>/gi;
    let vMatch;
    while ((vMatch = vertexTagRegex.exec(xmlText)) !== null) {
      const attrStr = vMatch[1];
      const xM = attrStr.match(/\bx\s*=\s*["']?([\d\.\-eE]+)["']?/i);
      const yM = attrStr.match(/\by\s*=\s*["']?([\d\.\-eE]+)["']?/i);
      const zM = attrStr.match(/\bz\s*=\s*["']?([\d\.\-eE]+)["']?/i);
      if (xM && yM && zM) {
        verts.push(
          parseFloat(xM[1]) * unitScale,
          parseFloat(yM[1]) * unitScale,
          parseFloat(zM[1]) * unitScale
        );
      }
    }

    const triangleTagRegex = /<[^:>]*:?triangle\b([^>]*)\/?>/gi;
    let tMatch;
    let hasTriangleColors = false;
    const tempTriColors = [];

    while ((tMatch = triangleTagRegex.exec(xmlText)) !== null) {
      const attrStr = tMatch[1];
      const v1M = attrStr.match(/\bv1\s*=\s*["']?(\d+)["']?/i);
      const v2M = attrStr.match(/\bv2\s*=\s*["']?(\d+)["']?/i);
      const v3M = attrStr.match(/\bv3\s*=\s*["']?(\d+)["']?/i);
      if (v1M && v2M && v3M) {
        inds.push(parseInt(v1M[1]), parseInt(v2M[1]), parseInt(v3M[1]));

        // Renk özniteliğini ara (p1, paint_color veya color)
        let triRgb = null;
        const p1M = attrStr.match(/\bp1\s*=\s*["']?(\d+)["']?/i);
        const paintM = attrStr.match(/\bpaint_color\s*=\s*["']?#?([0-9a-fA-F]{6})["']?/i);
        const colM = attrStr.match(/\bcolor\s*=\s*["']?#?([0-9a-fA-F]{6})["']?/i);

        if (paintM) {
          triRgb = hexToRgbFloat(paintM[1]);
          hasTriangleColors = true;
        } else if (colM) {
          triRgb = hexToRgbFloat(colM[1]);
          hasTriangleColors = true;
        } else if (p1M && palette.length > 0) {
          const pIdx = parseInt(p1M[1]);
          if (palette[pIdx]) {
            triRgb = palette[pIdx];
            hasTriangleColors = true;
          }
        }

        tempTriColors.push(triRgb || COLOR_DEFAULT);
      }
    }

    // Yöntem B: Eğer Regex bulamadıysa DOMParser ile dene
    if (verts.length === 0) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        const vNodes = doc.getElementsByTagNameNS ? 
                       Array.from(doc.getElementsByTagNameNS('*', 'vertex')) : 
                       Array.from(doc.getElementsByTagName('vertex'));
        vNodes.forEach(node => {
          verts.push(
            parseFloat(node.getAttribute('x') || 0) * unitScale,
            parseFloat(node.getAttribute('y') || 0) * unitScale,
            parseFloat(node.getAttribute('z') || 0) * unitScale
          );
        });

        const tNodes = doc.getElementsByTagNameNS ? 
                       Array.from(doc.getElementsByTagNameNS('*', 'triangle')) : 
                       Array.from(doc.getElementsByTagName('triangle'));
        tNodes.forEach(node => {
          inds.push(
            parseInt(node.getAttribute('v1')),
            parseInt(node.getAttribute('v2')),
            parseInt(node.getAttribute('v3'))
          );
        });
      } catch (e) {
        console.warn('DOMParser fallback hatası:', e);
      }
    }

    return { 
      vertices: verts, 
      indices: inds, 
      triColors: tempTriColors, 
      hasColors: hasTriangleColors 
    };
  }

  const allVertices = [];
  const allIndices = [];
  const allTriColors = [];
  let currentVertexOffset = 0;
  let totalHasColors = false;

  for (const modelFile of modelFileEntries) {
    const modelXmlText = await modelFile.async('string');
    const { vertices, indices, triColors, hasColors } = extractGeometryFromModelXml(modelXmlText);
    if (vertices.length > 0) {
      if (hasColors) totalHasColors = true;
      for (let i = 0; i < vertices.length; i++) {
        allVertices.push(vertices[i]);
      }
      for (let i = 0; i < indices.length; i++) {
        allIndices.push(indices[i] + currentVertexOffset);
      }
      for (let i = 0; i < triColors.length; i++) {
        allTriColors.push(triColors[i]);
      }
      currentVertexOffset += (vertices.length / 3);
    }
  }

  if (allVertices.length === 0) {
    throw new Error('3MF dosyası içerisinde geçerli 3D vertex geometrisi bulunamadı.');
  }

  // Three.js BufferGeometry oluştur
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(allVertices, 3));
  if (allIndices.length > 0) {
    geometry.setIndex(allIndices);
  }

  // Renkleri Geometry'ye İşle (Eğer 3MF'de renk varsa)
  const numVertices = allVertices.length / 3;
  const vertexColors = new Float32Array(numVertices * 3);

  // Başlangıçta tüm köşeleri varsayılan renge ata
  for (let i = 0; i < numVertices; i++) {
    vertexColors[i * 3 + 0] = COLOR_DEFAULT[0];
    vertexColors[i * 3 + 1] = COLOR_DEFAULT[1];
    vertexColors[i * 3 + 2] = COLOR_DEFAULT[2];
  }

  // Eğer üçgen renkleri varsa köşelere uygula
  if (totalHasColors && allTriColors.length > 0 && allIndices.length > 0) {
    for (let t = 0; t < allTriColors.length; t++) {
      const rgb = allTriColors[t];
      const i1 = allIndices[t * 3 + 0];
      const i2 = allIndices[t * 3 + 1];
      const i3 = allIndices[t * 3 + 2];

      if (rgb && i1 < numVertices && i2 < numVertices && i3 < numVertices) {
        vertexColors[i1 * 3 + 0] = rgb[0];
        vertexColors[i1 * 3 + 1] = rgb[1];
        vertexColors[i1 * 3 + 2] = rgb[2];

        vertexColors[i2 * 3 + 0] = rgb[0];
        vertexColors[i2 * 3 + 1] = rgb[1];
        vertexColors[i2 * 3 + 2] = rgb[2];

        vertexColors[i3 * 3 + 0] = rgb[0];
        vertexColors[i3 * 3 + 1] = rgb[1];
        vertexColors[i3 * 3 + 2] = rgb[2];
      }
    }
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));
  geometry.computeVertexNormals();

  // Hacim ve Boyut Hesabı
  const pos = geometry.attributes.position;
  let totalVolume = 0;
  let totalSurfaceArea = 0;

  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cr = new THREE.Vector3();

  const numFaces = allIndices.length > 0 ? allIndices.length / 3 : pos.count / 3;

  for (let i = 0; i < numFaces; i++) {
    const idx1 = allIndices.length > 0 ? allIndices[i * 3 + 0] : i * 3 + 0;
    const idx2 = allIndices.length > 0 ? allIndices[i * 3 + 1] : i * 3 + 1;
    const idx3 = allIndices.length > 0 ? allIndices[i * 3 + 2] : i * 3 + 2;

    p1.fromBufferAttribute(pos, idx1);
    p2.fromBufferAttribute(pos, idx2);
    p3.fromBufferAttribute(pos, idx3);

    const v = (
      p1.x * (p2.y * p3.z - p3.y * p2.z) +
      p2.x * (p3.y * p1.z - p1.y * p3.z) +
      p3.x * (p1.y * p2.z - p2.y * p1.z)
    ) / 6.0;
    totalVolume += v;

    e1.subVectors(p2, p1);
    e2.subVectors(p3, p1);
    cr.crossVectors(e1, e2);
    totalSurfaceArea += cr.length() * 0.5;
  }

  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  const dimX = Math.abs(bbox.max.x - bbox.min.x);
  const dimY = Math.abs(bbox.max.y - bbox.min.y);
  const dimZ = Math.abs(bbox.max.z - bbox.min.z);

  const volumeCm3 = Math.abs(totalVolume) / 1000.0;
  const surfaceAreaCm2 = totalSurfaceArea / 100.0;

  return {
    geometry: geometry,
    volumeCm3: isNaN(volumeCm3) ? 0 : volumeCm3,
    surfaceAreaCm2: isNaN(surfaceAreaCm2) ? 0 : surfaceAreaCm2,
    dimensions: { 
      x: isNaN(dimX) ? 0 : dimX, 
      y: isNaN(dimY) ? 0 : dimY, 
      z: isNaN(dimZ) ? 0 : dimZ 
    },
    slicerMetadata: slicerMetadata
  };
}

/**
 * Dilimlenmiş G-Code Dosyasını Ayrıştırır (.gcode)
 * OrcaSlicer, Bambu Studio, PrusaSlicer formatlarını destekler.
 * Takım yollarını (toolpaths) katman katman ayrıştırır ve optimize segmentler üretir.
 */
function parseGCode(gcodeText) {
  let weightGrams = null;
  let printTimeSeconds = null;
  let layerHeight = null;
  let toolChangesCount = 0;
  const toolsUsed = new Set();

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  let currentX = 0, currentY = 0, currentZ = 0;
  let currentE = 0;
  let lastX = 0, lastY = 0, lastZ = 0;
  let lastE = 0;

  // Katman yapıları: her katman için z seviyesi ve çizgi segmentleri
  const layersMap = new Map(); // zKey -> { z, printPoints: [], travelPoints: [] }
  let currentLayerZ = 0;
  let totalSegments = 0;

  const lines = gcodeText.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // Yorum Satırları & OrcaSlicer Metadata Kontrolleri
    if (line.startsWith(';') || line.startsWith('(')) {
      // 1. Filament Ağırlığı (OrcaSlicer & Bambu: ; total filament used [g] = 45.2)
      const weightM = line.match(/total\s*filament\s*used\s*\[g\]\s*[:=]\s*([\d\.]+)/i) ||
                      line.match(/filament\s*used\s*\[g\]\s*[:=]\s*([\d\.]+)/i) ||
                      line.match(/filament_weight\s*[:=]\s*([\d\.]+)/i) ||
                      line.match(/Filament\s*used:\s*([\d\.]+)g/i);
      if (weightM && !weightGrams) {
        weightGrams = parseFloat(weightM[1]);
      }

      // 2. Filament Uzunluğu (m veya mm)
      const lenMm = line.match(/total\s*filament\s*used\s*\[mm\]\s*[:=]\s*([\d\.]+)/i) ||
                    line.match(/filament\s*used\s*\[mm\]\s*[:=]\s*([\d\.]+)/i);
      const lenM = line.match(/total\s*filament\s*used\s*\[m\]\s*[:=]\s*([\d\.]+)/i) ||
                   line.match(/filament\s*used\s*\[m\]\s*[:=]\s*([\d\.]+)/i);
      if (lenMm && !weightGrams) {
        weightGrams = (parseFloat(lenMm[1]) / 1000.0) * 2.98;
      } else if (lenM && !weightGrams) {
        weightGrams = parseFloat(lenM[1]) * 2.98;
      }

      // 3. OrcaSlicer Süre Tespiti: ; estimated printing time (normal mode) = 2h 15m 30s
      const orcaTimeHm = line.match(/estimated\s*printing\s*time[^\d]*(\d+)h\s*(\d+)m(?:\s*(\d+)s)?/i) ||
                         line.match(/total\s*estimated\s*time[^\d]*(\d+)h\s*(\d+)m/i);
      if (orcaTimeHm && !printTimeSeconds) {
        const h = parseInt(orcaTimeHm[1]);
        const m = parseInt(orcaTimeHm[2]);
        const s = orcaTimeHm[3] ? parseInt(orcaTimeHm[3]) : 0;
        printTimeSeconds = (h * 3600) + (m * 60) + s;
      }

      const timeSecM = line.match(/TIME\s*:\s*(\d+)/i) || line.match(/estimated[_\s]time\s*=\s*(\d+)s/i);
      if (timeSecM && !printTimeSeconds) {
        printTimeSeconds = parseInt(timeSecM[1]);
      }

      // 4. Katman Yüksekliği
      const lhM = line.match(/layer_height\s*=\s*([\d\.]+)/i);
      if (lhM && !layerHeight) layerHeight = parseFloat(lhM[1]);

      // 5. Takım Değişimi & Kule Yorumları
      if (line.includes('COLOR_CHANGE') || line.includes('change_filament') || line.includes('TOOL_CHANGE')) {
        toolChangesCount++;
      }
      continue;
    }

    // Takım Seçimi (T0, T1, T2...)
    const toolMatch = line.match(/^T(\d+)/);
    if (toolMatch) {
      toolsUsed.add(parseInt(toolMatch[1]));
      toolChangesCount++;
    }

    // Hareket Komutları (G0: Seyahat, G1: Ekstrüzyon / Doğrusal Baskı)
    if (line.startsWith('G0') || line.startsWith('G1')) {
      const isG0 = line.startsWith('G0');
      const xM = line.match(/X([\d\.\-]+)/i);
      const yM = line.match(/Y([\d\.\-]+)/i);
      const zM = line.match(/Z([\d\.\-]+)/i);
      const eM = line.match(/E([\d\.\-]+)/i);

      let moved = false;
      if (xM) { currentX = parseFloat(xM[1]); moved = true; }
      if (yM) { currentY = parseFloat(yM[1]); moved = true; }
      if (zM) {
        currentZ = parseFloat(zM[1]);
        currentLayerZ = currentZ;
        moved = true;
      }

      let isExtrusion = false;
      if (eM) {
        const eVal = parseFloat(eM[1]);
        if (eVal > currentE) {
          isExtrusion = true;
        }
        currentE = eVal;
      }

      if (moved) {
        // Model koordinat sınırları (sadece ekstrüzyon hareketlerini veya makul koordinatları dikkate al)
        if (isExtrusion || (currentX > 0 && currentY > 0)) {
          if (currentX < minX) minX = currentX;
          if (currentX > maxX) maxX = currentX;
          if (currentY < minY) minY = currentY;
          if (currentY > maxY) maxY = currentY;
          if (currentZ < minZ) minZ = currentZ;
          if (currentZ > maxZ) maxZ = currentZ;
        }

        // Katman listesine ekle
        const zKey = currentLayerZ.toFixed(2);
        if (!layersMap.has(zKey)) {
          layersMap.set(zKey, { z: currentLayerZ, printPoints: [], travelPoints: [] });
        }

        const layerObj = layersMap.get(zKey);
        if (isExtrusion && (lastX !== currentX || lastY !== currentY)) {
          layerObj.printPoints.push(lastX, lastY, lastZ, currentX, currentY, currentZ);
          totalSegments++;
        } else if (isG0 && (lastX !== currentX || lastY !== currentY)) {
          if (layerObj.travelPoints.length < 500) {
            layerObj.travelPoints.push(lastX, lastY, lastZ, currentX, currentY, currentZ);
          }
        }

        lastX = currentX;
        lastY = currentY;
        lastZ = currentZ;
      }
    }
  }

  // Katmanları Z yüksekliğine göre sırala
  const sortedLayers = Array.from(layersMap.values()).sort((a, b) => a.z - b.z);

  // Boyutlar (Yazıcı uzayında: X = Genişlik, Y = Derinlik, Z = Yükseklik)
  const dimX = (minX !== Infinity && maxX !== -Infinity) ? Math.max(1, maxX - minX) : 50;
  const dimY = (minY !== Infinity && maxY !== -Infinity) ? Math.max(1, maxY - minY) : 50;
  const dimZ = (minZ !== Infinity && maxZ !== -Infinity) ? Math.max(0.2, maxZ - minZ) : (sortedLayers.length * (layerHeight || 0.2));

  // Hacim ve yüzey alanı tahmini
  const volumeCm3 = weightGrams ? (weightGrams / 1.24) : ((dimX * dimY * dimZ * 0.22) / 1000.0);
  const surfaceAreaCm2 = (2 * (dimX * dimY + dimX * dimZ + dimY * dimZ)) / 100.0;

  return {
    isGCode: true,
    volumeCm3: Math.max(0.1, volumeCm3),
    surfaceAreaCm2: Math.max(1.0, surfaceAreaCm2),
    dimensions: { x: dimX, y: dimY, z: dimZ },
    bounds: { minX, maxX, minY, maxY, minZ, maxZ },
    layers: sortedLayers,
    totalSegments: totalSegments,
    slicerMetadata: {
      detected: true,
      weightGrams: weightGrams,
      printTimeSeconds: printTimeSeconds,
      toolChanges: Math.max(0, toolChangesCount > 1 ? toolChangesCount - 1 : 0),
      uniqueTools: Math.max(1, toolsUsed.size),
      layerHeight: layerHeight || 0.20
    }
  };
}

/**
 * G-Code Takım Yollarını (Toolpaths) Three.js Sahnesinde Gerçekçi Çizer
 */
function displayGCodeIn3D(gcodeData) {
  // Mevcut mesh veya önceki gcode'u temizle
  if (currentMesh) {
    scene.remove(currentMesh);
    if (currentMesh.geometry) currentMesh.geometry.dispose();
    if (currentMesh.material) currentMesh.material.dispose();
    currentMesh = null;
  }

  if (currentGCodeGroup) {
    scene.remove(currentGCodeGroup);
    currentGCodeGroup.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
    currentGCodeGroup = null;
  }

  activeGCodeLayers = gcodeData.layers || [];
  currentGCodeGroup = new THREE.Group();
  scene.add(currentGCodeGroup);

  const bounds = gcodeData.bounds;
  const centerX = (bounds.minX !== Infinity && bounds.maxX !== -Infinity) ? ((bounds.minX + bounds.maxX) / 2) : 0;
  const centerY = (bounds.minY !== Infinity && bounds.maxY !== -Infinity) ? ((bounds.minY + bounds.maxY) / 2) : 0;
  const baseZ = bounds.minZ !== Infinity ? bounds.minZ : 0;

  // Katman yüksekliğine göre renk paleti fonksiyonu (Termal / Spektrum)
  const totalLayers = Math.max(1, activeGCodeLayers.length);
  const getLayerColor = (layerIndex) => {
    const t = layerIndex / totalLayers;
    // t: 0.0 -> Lacivert/Mavi, 0.35 -> Camgöbeği/Yeşil, 0.7 -> Sarı, 1.0 -> Turuncu/Kırmızı
    const color = new THREE.Color();
    color.setHSL(0.65 - (t * 0.65), 0.9, 0.55);
    return color;
  };

  // Tüm katmanları çiz
  activeGCodeLayers.forEach((layer, idx) => {
    const layerGroup = new THREE.Group();
    layerGroup.name = `layer_${idx}`;

    // Ekstrüzyon çizgileri
    if (layer.printPoints && layer.printPoints.length >= 6) {
      const positions = [];
      const colors = [];
      const lColor = getLayerColor(idx);

      for (let i = 0; i < layer.printPoints.length; i += 6) {
        // Koordinat dönüşümü:
        // G-Code X -> Three.js X (ortalanmış: x - centerX)
        // G-Code Y -> Three.js Z (ortalanmış: y - centerY)
        // G-Code Z -> Three.js Y (tabana oturmuş: z - baseZ)
        const x1 = layer.printPoints[i] - centerX;
        const y1_depth = layer.printPoints[i + 1] - centerY;
        const z1_height = layer.printPoints[i + 2] - baseZ;

        const x2 = layer.printPoints[i + 3] - centerX;
        const y2_depth = layer.printPoints[i + 4] - centerY;
        const z2_height = layer.printPoints[i + 5] - baseZ;

        positions.push(x1, z1_height, y1_depth);
        positions.push(x2, z2_height, y2_depth);

        colors.push(lColor.r, lColor.g, lColor.b);
        colors.push(lColor.r, lColor.g, lColor.b);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.95
      });

      const lineMesh = new THREE.LineSegments(geom, mat);
      lineMesh.name = 'printLines';
      layerGroup.add(lineMesh);
    }

    // Seyahat çizgileri (opsiyonel)
    if (layer.travelPoints && layer.travelPoints.length >= 6) {
      const travPositions = [];
      for (let i = 0; i < layer.travelPoints.length; i += 6) {
        const x1 = layer.travelPoints[i] - centerX;
        const y1_depth = layer.travelPoints[i + 1] - centerY;
        const z1_height = layer.travelPoints[i + 2] - baseZ;

        const x2 = layer.travelPoints[i + 3] - centerX;
        const y2_depth = layer.travelPoints[i + 4] - centerY;
        const z2_height = layer.travelPoints[i + 5] - baseZ;

        travPositions.push(x1, z1_height, y1_depth);
        travPositions.push(x2, z2_height, y2_depth);
      }

      const travGeom = new THREE.BufferGeometry();
      travGeom.setAttribute('position', new THREE.Float32BufferAttribute(travPositions, 3));
      const travMat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.35
      });
      const travMesh = new THREE.LineSegments(travGeom, travMat);
      travMesh.name = 'travelLines';
      travMesh.visible = document.getElementById('gcode-show-travel') ? document.getElementById('gcode-show-travel').checked : false;
      layerGroup.add(travMesh);
    }

    currentGCodeGroup.add(layerGroup);
  });

  // Kamerayı ayarla
  const maxDim = Math.max(gcodeData.dimensions.x, gcodeData.dimensions.y, gcodeData.dimensions.z);
  const distance = Math.max(maxDim * 2.2, 130);
  camera.position.set(distance * 0.75, distance * 0.9, distance * 1.1);
  camera.lookAt(0, gcodeData.dimensions.z / 2, 0);
  controls.target.set(0, gcodeData.dimensions.z / 2, 0);
  controls.update();

  // Arayüzü Göster
  document.getElementById('viewer-placeholder').classList.add('hidden');
  document.getElementById('three-canvas').classList.remove('hidden');

  // G-Code Kontrol Panelini Kur & Göster
  setupGCodeControlPanel(totalLayers, gcodeData);
}

/**
 * G-Code Katman Slider ve Takım Yolu Kontrollerini Bağlar
 */
function setupGCodeControlPanel(totalLayers, gcodeData) {
  const panel = document.getElementById('gcode-control-panel');
  if (!panel) return;
  panel.classList.remove('hidden');

  const scalePanel = document.getElementById('model-scale-panel');
  if (scalePanel) scalePanel.classList.add('hidden'); // G-Code ölçeklenemez

  const slider = document.getElementById('gcode-layer-slider');
  const label = document.getElementById('gcode-current-layer-label');
  const heightLabel = document.getElementById('gcode-layer-height-label');
  const linesCount = document.getElementById('gcode-lines-count');
  const timeEst = document.getElementById('gcode-time-est');
  const weightEst = document.getElementById('gcode-weight-est');

  if (slider) {
    slider.min = 1;
    slider.max = totalLayers;
    slider.value = totalLayers;
  }

  if (label) label.innerText = `${totalLayers} / ${totalLayers}`;
  if (heightLabel) {
    const topZ = activeGCodeLayers.length > 0 ? activeGCodeLayers[activeGCodeLayers.length - 1].z : 0;
    heightLabel.innerText = `Z: ${topZ.toFixed(2)} mm`;
  }
  if (linesCount) linesCount.innerText = (gcodeData.totalSegments || 0).toLocaleString();
  if (timeEst) {
    const mins = Math.round((gcodeData.slicerMetadata.printTimeSeconds || 0) / 60);
    timeEst.innerText = `${mins} dk`;
  }
  if (weightEst) {
    weightEst.innerText = `${(gcodeData.slicerMetadata.weightGrams || 0).toFixed(1)}g`;
  }

  // Slider Olayı
  if (slider) {
    slider.oninput = () => {
      const targetLayer = parseInt(slider.value);
      if (label) label.innerText = `${targetLayer} / ${totalLayers}`;
      if (heightLabel && activeGCodeLayers[targetLayer - 1]) {
        heightLabel.innerText = `Z: ${activeGCodeLayers[targetLayer - 1].z.toFixed(2)} mm`;
      }
      filterGCodeLayers(targetLayer);
    };
  }

  // Seyahat Çizgilerini Aç/Kapat
  const travelCheck = document.getElementById('gcode-show-travel');
  if (travelCheck) {
    travelCheck.onchange = () => {
      if (!currentGCodeGroup) return;
      currentGCodeGroup.traverse(child => {
        if (child.name === 'travelLines') {
          child.visible = travelCheck.checked;
        }
      });
    };
  }
}

/**
 * G-Code Katmanlarını Slider Değerine Göre Filtreler
 */
function filterGCodeLayers(maxLayer) {
  if (!currentGCodeGroup) return;
  currentGCodeGroup.children.forEach((layerGroup, idx) => {
    layerGroup.visible = (idx < maxLayer);
  });
}

// ========================================================
// 5. MALİYET HESAPLAMA MOTORU & DİNAMİK GİDERLER
// ========================================================

function getSelectedPrinter() {
  const select = document.getElementById('calc-printer-select');
  if (!state.config.printers || state.config.printers.length === 0) {
    return {
      id: 'no_printer',
      name: 'Yazıcı Tanımlı Değil',
      type: 'fdm',
      bedX: 220,
      bedY: 220,
      bedZ: 220,
      powerWatts: 200,
      wearPerHour: 2.0
    };
  }
  const printerId = select && select.value ? select.value : state.config.printers[0].id;
  return state.config.printers.find(p => p.id === printerId) || state.config.printers[0];
}

function getSelectedMaterial() {
  const select = document.getElementById('calc-material-select');
  const key = select ? select.value : 'filenta_pla';
  return state.config.materials[key] || state.config.materials.filenta_pla;
}

/**
 * OrcaSlicer Tabanlı Gerçekçi Dilimleyici Simülasyonu ile Gramaj Hesabı
 * OrcaSlicer standart 0.42mm hat genişliği, Gyroid/Cross Hatch dolgu katsayısı,
 * dış kabuk ve iç çekirdek hacmini ayrıştırarak gramajı kuruşu kuruşuna hesaplar.
 */
function calculateRealisticWeight() {
  const volumeCm3 = state.currentModel.volumeCm3 || 0;
  if (volumeCm3 <= 0) {
    return {
      realisticGrams: 0,
      solidGrams: 0,
      shellVolumeCm3: 0,
      coreVolumeCm3: 0,
      infillVolumeCm3: 0
    };
  }

  const material = getSelectedMaterial();
  const density = material.density || 1.24; // g/cm³

  // Duvar / Kabuk sayısı (OrcaSlicer 0.42 mm hat genişliği)
  const wallSelect = document.getElementById('calc-wall-count');
  const wallCount = wallSelect ? parseInt(wallSelect.value) || 2 : (state.currentModel.wallCount || 2);
  const wallThicknessMm = wallCount * 0.42; // örn 2 duvar = 0.84 mm
  const wallThicknessCm = wallThicknessMm / 10.0; // cm cinsinden (0.084 cm)

  // Modelin yüzey alanı (cm²)
  const surfaceAreaCm2 = state.currentModel.surfaceAreaCm2 || (Math.pow(volumeCm3, 2/3) * 6);

  // Dış kabuk hacmi (cm³): Yüzey alanı x kabuk kalınlığı (toplam hacmi aşamaz)
  const shellVolumeCm3 = Math.min(volumeCm3, surfaceAreaCm2 * wallThicknessCm);

  // İç çekirdek hacmi (cm³)
  const coreVolumeCm3 = Math.max(0, volumeCm3 - shellVolumeCm3);

  // Dolgu oranı (%)
  const infillInput = document.getElementById('calc-infill');
  const infillPercent = infillInput ? parseFloat(infillInput.value) || 15 : 15;

  // Dolgu deseni katsayısı (OrcaSlicer Pattern Density Multiplier)
  const patternSelect = document.getElementById('calc-infill-pattern');
  const pattern = patternSelect ? patternSelect.value : 'gyroid';
  let patternFactor = 1.0;
  if (pattern === 'gyroid') patternFactor = 1.0;
  else if (pattern === 'cross_hatch') patternFactor = 0.94; // Orca Cross Hatch %6 daha hafif
  else if (pattern === 'grid') patternFactor = 0.90;
  else if (pattern === 'honeycomb') patternFactor = 1.08;
  else if (pattern === 'adaptive_cubic') patternFactor = 0.85;

  // Dolgulu çekirdek hacmi (cm³)
  const infillVolumeCm3 = coreVolumeCm3 * ((infillPercent / 100.0) * patternFactor);

  // Toplam net baskı hacmi (cm³)
  const totalPrintVolumeCm3 = shellVolumeCm3 + infillVolumeCm3;

  // Gerçekçi Gramaj & Katı Gramaj
  const realisticGrams = totalPrintVolumeCm3 * density;
  const solidGrams = volumeCm3 * density;

  return {
    realisticGrams: Math.max(0.5, realisticGrams),
    solidGrams: Math.max(0.5, solidGrams),
    shellVolumeCm3: shellVolumeCm3,
    coreVolumeCm3: coreVolumeCm3,
    infillVolumeCm3: infillVolumeCm3
  };
}

/**
 * Geometriden ve Parametrelerden Gerçekçi Ağırlığı Yeniden Hesaplar ve UI'a Basar
 */
function recalculateRealisticWeight() {
  if (state.currentModel.volumeCm3 <= 0) return;
  const res = calculateRealisticWeight();
  
  const weightInput = document.getElementById('calc-weight-grams');
  if (weightInput) weightInput.value = res.realisticGrams.toFixed(1);

  const solidEl = document.getElementById('calc-solid-weight');
  if (solidEl) solidEl.innerText = `${res.solidGrams.toFixed(1)}g`;
}

/**
 * Dinamik Özel Maliyet & Gider Kalemleri Yönetim Tablosunu Çizer (#tab-workshop)
 */
function renderCustomCostItemsTable() {
  const tbody = document.getElementById('custom-cost-items-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const items = state.config.customCostItems || [];
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-4 text-center text-slate-500 italic">Henüz özel bir gider kalemi tanımlanmadı. Yeni Kalem Ekle butonunu kullanarak ekleyebilirsiniz.</td></tr>`;
    return;
  }

  const categoryNames = {
    labor: 'İşçilik & Operasyon',
    material: 'Sarf Malzeme & Kutu',
    service: 'Lojistik & Kargo',
    overhead: 'Genel Gider / Pay'
  };

  const typeNames = {
    fixed: 'Sabit (TL / sipariş)',
    per_piece: 'Parça Başı (TL / adet)',
    hourly: 'Süre Bazlı (TL / saat)',
    per_gram: 'Ağırlık Bazlı (TL / gram)',
    percentage: 'Yüzdesel (% Maliyet Payı)'
  };

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/40 transition-colors';
    tr.innerHTML = `
      <td class="py-2.5 px-3 font-medium text-slate-200">${item.name}</td>
      <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">${categoryNames[item.category] || item.category}</span></td>
      <td class="py-2.5 px-3 text-slate-400 font-mono text-[11px]">${typeNames[item.type] || item.type}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold text-cyan-300">${item.rate} ${item.type === 'percentage' ? '%' : 'TL'}</td>
      <td class="py-2.5 px-3 text-center">
        <input type="checkbox" class="rounded bg-slate-800 border-slate-700 text-indigo-600 cursor-pointer" ${item.defaultEnabled ? 'checked' : ''} onchange="toggleCustomItemDefault('${item.id}', this.checked)">
      </td>
      <td class="py-2.5 px-3 text-right space-x-1">
        <button class="btn-xs text-slate-400 hover:text-white" onclick="openCostItemModal('${item.id}')">Düzenle</button>
        <button class="btn-xs text-rose-400 hover:text-rose-300" onclick="deleteCustomCostItem('${item.id}')">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Ana Hesaplama Ekranındaki Dinamik Kalemleri Render Eder (#tab-calculator)
 */
function renderActiveCustomCostItemsInCalc() {
  const container = document.getElementById('active-custom-items-container');
  if (!container) return;
  container.innerHTML = '';

  const items = state.config.customCostItems || [];
  if (items.length === 0) {
    container.innerHTML = `<span class="text-slate-500 italic text-[11px]">Tanımlı ek gider kalemi yok.</span>`;
    return;
  }

  items.forEach(item => {
    const isChecked = (typeof item.enabled === 'boolean') ? item.enabled : item.defaultEnabled;
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors';
    row.innerHTML = `
      <label class="flex items-center gap-2 cursor-pointer flex-1">
        <input type="checkbox" id="custom-item-chk-${item.id}" ${isChecked ? 'checked' : ''} class="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0">
        <span class="text-slate-300 font-medium">${item.name}</span>
      </label>
      <span class="font-mono text-cyan-400 font-semibold text-[11px]">+${item.rate} ${item.type === 'percentage' ? '%' : 'TL'}</span>
    `;
    container.appendChild(row);

    const chk = row.querySelector(`#custom-item-chk-${item.id}`);
    if (chk) {
      chk.addEventListener('change', () => {
        item.enabled = chk.checked;
        calculateCosts();
      });
    }
  });
}

let editingCostItemId = null;

function openCostItemModal(itemId = null) {
  editingCostItemId = itemId;
  const modal = document.getElementById('modal-cost-item');
  if (!modal) return;

  const titleEl = document.getElementById('modal-cost-item-title');
  const nameInput = document.getElementById('input-cost-name');
  const catInput = document.getElementById('input-cost-category');
  const typeInput = document.getElementById('input-cost-type');
  const rateInput = document.getElementById('input-cost-rate');
  const defInput = document.getElementById('input-cost-default');

  if (itemId) {
    const item = state.config.customCostItems.find(i => i.id === itemId);
    if (item) {
      if (titleEl) titleEl.innerText = 'Gider Kalemini Düzenle';
      nameInput.value = item.name;
      catInput.value = item.category;
      typeInput.value = item.type;
      rateInput.value = item.rate;
      defInput.checked = item.defaultEnabled;
    }
  } else {
    if (titleEl) titleEl.innerText = 'Yeni Özel Gider Kalemi Tanımla';
    nameInput.value = '';
    catInput.value = 'labor';
    typeInput.value = 'fixed';
    rateInput.value = '50';
    defInput.checked = true;
  }

  modal.classList.remove('hidden');
}

function closeCostItemModal() {
  const modal = document.getElementById('modal-cost-item');
  if (modal) modal.classList.add('hidden');
  editingCostItemId = null;
}

function saveCostItemFromModal() {
  const name = document.getElementById('input-cost-name').value.trim();
  if (!name) {
    alert('Lütfen bir kalem adı girin (Örn: Yurtiçi Kargo, Özel Kutu)');
    return;
  }

  const category = document.getElementById('input-cost-category').value;
  const type = document.getElementById('input-cost-type').value;
  const rate = parseFloat(document.getElementById('input-cost-rate').value) || 0;
  const defaultEnabled = document.getElementById('input-cost-default').checked;

  if (editingCostItemId) {
    const item = state.config.customCostItems.find(i => i.id === editingCostItemId);
    if (item) {
      item.name = name;
      item.category = category;
      item.type = type;
      item.rate = rate;
      item.defaultEnabled = defaultEnabled;
    }
  } else {
    const newId = 'cost_' + Date.now();
    state.config.customCostItems.push({
      id: newId,
      name: name,
      category: category,
      type: type,
      rate: rate,
      enabled: defaultEnabled,
      defaultEnabled: defaultEnabled
    });
  }

  state.saveConfig();
  renderCustomCostItemsTable();
  renderActiveCustomCostItemsInCalc();
  calculateCosts();
  closeCostItemModal();
}

function deleteCustomCostItem(itemId) {
  if (!confirm('Bu maliyet kalemini silmek istediğinizden emin misiniz?')) return;
  state.config.customCostItems = (state.config.customCostItems || []).filter(i => i.id !== itemId);
  state.saveConfig();
  renderCustomCostItemsTable();
  renderActiveCustomCostItemsInCalc();
  calculateCosts();
}

function toggleCustomItemDefault(itemId, isDefault) {
  const item = (state.config.customCostItems || []).find(i => i.id === itemId);
  if (item) {
    item.defaultEnabled = isDefault;
    state.saveConfig();
  }
}

/**
 * Destek Türüne, Model Geometrisine ve Sarkma Analizine Göre Hassas Destek Gramajını Hesaplar
 */
function calculateAccurateSupportWeight(modelWeightGrams) {
  const supportSelect = document.getElementById('calc-support-type');
  const supportType = supportSelect ? supportSelect.value : 'auto_tree';
  const supportBadge = document.getElementById('support-status-badge');

  // Eğer dilimlenmiş G-Code veya 3MF ise, dosyadaki gramaj zaten desteği içerir
  if (state.currentModel.isGCode || (state.currentModel.slicerMetadata && state.currentModel.slicerMetadata.weightGrams > 0 && !state.currentModel.isResized)) {
    if (supportBadge) {
      supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-mono';
      supportBadge.innerText = 'Dosyaya Dahil (Slicer Çıktısı)';
    }
    return 0;
  }

  if (supportType === 'none') {
    if (supportBadge) {
      supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono';
      supportBadge.innerText = 'Desteksiz (0g)';
    }
    return 0;
  }

  const material = getSelectedMaterial();
  const density = material.density || 1.24;

  const overhangAreaCm2 = state.support.detectedOverhangAreaCm2 || 0;
  const avgHeightCm = state.support.avgOverhangHeightCm || 2.0;
  const paintedAreaCm2 = state.support.paintedAreaCm2 || 0;

  // Elle Boyanmış Destek Modu
  if (supportType === 'painted_only') {
    if (paintedAreaCm2 <= 0.05) {
      if (supportBadge) {
        supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono';
        supportBadge.innerText = 'Boyalı Alan Yok (0g)';
      }
      return 0;
    }

    const modelHeightCm = Math.max(1.0, (state.currentModel.dimensions.z || 30) / 10.0);
    const estVolCm3 = (paintedAreaCm2 * 0.06) + (paintedAreaCm2 * (modelHeightCm * 0.45) * 0.09);
    const weight = Math.max(0.4, estVolCm3 * density);

    if (supportBadge) {
      supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/25 font-mono';
      supportBadge.innerText = `Boyalı Destek (+${weight.toFixed(1)}g)`;
    }
    return weight;
  }

  // Otomatik Destek Modları (Slim Tree, Tree Hybrid, Snug Grid)
  // Eğer parçada havada kalan sarkma yoksa (örneğin düz kutu, vazo vb.):
  if (overhangAreaCm2 < 0.20 && paintedAreaCm2 < 0.10) {
    if (supportBadge) {
      supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono';
      supportBadge.innerText = 'Sarkma Yok / Desteksiz (0g)';
    }
    return 0;
  }

  // Gerçek sarkma varsa destek tipine göre hacim hesapla:
  let supportVolumeCm3 = 0;
  let badgeName = 'Ağaç Destek';

  const effectiveArea = Math.max(overhangAreaCm2, paintedAreaCm2);
  const effectiveHeight = Math.max(1.0, avgHeightCm);

  if (supportType === 'auto_tree') {
    // OrcaSlicer Slim Tree: İnce gövdeli ağaç
    supportVolumeCm3 = (effectiveArea * 0.055) + (effectiveArea * effectiveHeight * 0.07);
    const maxTreeVol = (modelWeightGrams / density) * 0.20;
    supportVolumeCm3 = Math.min(supportVolumeCm3, maxTreeVol);
    badgeName = 'Orca Slim Tree';
  } else if (supportType === 'auto_tree_hybrid') {
    // OrcaSlicer Tree Hybrid: Güçlü hibrit ağaç
    supportVolumeCm3 = (effectiveArea * 0.075) + (effectiveArea * effectiveHeight * 0.10);
    const maxHybridVol = (modelWeightGrams / density) * 0.25;
    supportVolumeCm3 = Math.min(supportVolumeCm3, maxHybridVol);
    badgeName = 'Orca Tree Hybrid';
  } else if (supportType === 'auto_snug') {
    // OrcaSlicer Snug Grid: Klasik katı ızgara
    supportVolumeCm3 = (effectiveArea * 0.09) + (effectiveArea * effectiveHeight * 0.16);
    const maxSnugVol = (modelWeightGrams / density) * 0.35;
    supportVolumeCm3 = Math.min(supportVolumeCm3, maxSnugVol);
    badgeName = 'Orca Snug Grid';
  }

  const calculatedSupportGrams = Math.max(0.4, supportVolumeCm3 * density);

  if (supportBadge) {
    supportBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono';
    supportBadge.innerText = `${badgeName} (+${calculatedSupportGrams.toFixed(1)}g)`;
  }

  return calculatedSupportGrams;
}

/**
 * Yazıcı Teknolojisine (FDM vs SLA), Katman Kalınlığına, Hacme ve Dolguya Göre
 * Gerçekçi Baskı Süresini (Saat ve Dakika) Hassas Hesaplar
 */
function estimateAccuratePrintTime(modelWeightGrams, supportWeightGrams, forceRecalc = false) {
  // Eğer dilimlenmiş G-Code veya 3MF ise ve yeniden boyutlandırılmadıysa, orijinal süreyi kullan
  if (state.currentModel.isGCode || (state.currentModel.slicerMetadata && state.currentModel.slicerMetadata.printTimeSeconds > 0 && !state.currentModel.isResized)) {
    const secs = state.currentModel.slicerMetadata.printTimeSeconds;
    return {
      hours: Math.floor(secs / 3600),
      minutes: Math.round((secs % 3600) / 60),
      totalHours: secs / 3600.0,
      source: 'slicer'
    };
  }

  const printer = getSelectedPrinter();
  const material = getSelectedMaterial();
  const dimZ = Math.max(1.0, state.currentModel.dimensions.z || 20);

  // 1. SLA REÇİNE YAZICI SÜRE HESABI (Elegoo Saturn 4 Ultra 16K)
  if (printer.type === 'sla' || material.type === 'sla') {
    const layerThicknessMm = 0.05; // 50 mikron standart SLA katmanı
    const totalLayers = Math.ceil(dimZ / layerThicknessMm);

    // İlk 5 taban katmanı: katman başı 28s pozlama
    // Normal katmanlar: 2.1s UV pozlama + 3.1s mekanik kalkış/iniş (tilt release) = 5.2s / katman
    const bottomLayersTimeSec = Math.min(5, totalLayers) * 28;
    const normalLayersTimeSec = Math.max(0, totalLayers - 5) * 5.2;
    const totalSecs = bottomLayersTimeSec + normalLayersTimeSec;

    const totalHours = totalSecs / 3600.0;
    return {
      hours: Math.floor(totalHours),
      minutes: Math.round((totalHours % 1) * 60),
      totalHours: totalHours,
      source: 'sla_simulation'
    };
  }

  // 2. FDM YAZICI SÜRE HESABI (Flashforge AD5X, AD5M Pro, Qidi, Creality)
  const layerHeightSelect = document.getElementById('calc-layer-height');
  const layerHeightMm = layerHeightSelect ? parseFloat(layerHeightSelect.value) || 0.20 : 0.20;
  const totalLayers = Math.ceil(dimZ / layerHeightMm);

  // Hacim ayrıştırması
  const weightRes = calculateRealisticWeight();
  const density = material.density || 1.24;

  const shellVolMm3 = (weightRes.shellVolumeCm3 || 0) * 1000.0;
  const infillVolMm3 = (weightRes.infillVolumeCm3 || 0) * 1000.0;
  const supportVolMm3 = (supportWeightGrams / density) * 1000.0;

  // Yazıcı hız profili (CoreXY yüksek hızlı yazıcılar: Flashforge AD5X, Creality Hi Combo, Qidi)
  const isHighSpeedCoreXY = printer.id.includes('ad5') || printer.id.includes('qidi') || printer.id.includes('creality') || (printer.powerWatts >= 220);

  // Akış Hızları (mm³/s)
  const shellFlowRate = isHighSpeedCoreXY ? 11.0 : 7.0;    // Dış kabuk/duvar akış hızı
  const infillFlowRate = isHighSpeedCoreXY ? 20.0 : 12.0;  // İç dolgu akış hızı
  const supportFlowRate = isHighSpeedCoreXY ? 16.0 : 10.0; // Destek akış hızı

  // Eritme Süreleri (saniye)
  const timeShellSec = shellVolMm3 / shellFlowRate;
  const timeInfillSec = infillVolMm3 / infillFlowRate;
  const timeSupportSec = supportVolMm3 / supportFlowRate;

  // Katman başı ivmelenme, kafa yön değişimi ve Z-hop gecikmesi
  const timePerLayerMotionSec = isHighSpeedCoreXY ? 2.2 : 3.5;
  const timeLayerMotionSec = totalLayers * timePerLayerMotionSec;

  // Başlangıç hazırlık payı (Isınma, auto bed leveling, purge hattı, yavaş ilk katman): ~180 saniye
  const warmupSec = 180;

  // Çok renkli takım değişimleri (swaps): Her swap ~75 saniye ekler
  const isMulticolor = document.getElementById('calc-multicolor-enabled') ? document.getElementById('calc-multicolor-enabled').checked : false;
  let swapsTimeSec = 0;
  if (isMulticolor) {
    const swaps = parseInt(document.getElementById('calc-color-swaps').value) || 0;
    swapsTimeSec = swaps * 75;
  }

  const totalSecs = timeShellSec + timeInfillSec + timeSupportSec + timeLayerMotionSec + warmupSec + swapsTimeSec;
  const totalHours = Math.max(0.25, totalSecs / 3600.0);

  return {
    hours: Math.floor(totalHours),
    minutes: Math.round((totalHours % 1) * 60),
    totalHours: totalHours,
    source: 'fdm_orca_simulation'
  };
}

/**
 * Tüm Maliyetleri Detaylı Olarak Hesaplar
 */
function calculateCosts() {
  const printer = getSelectedPrinter();
  const material = getSelectedMaterial();
  const cfg = state.config.workshop;

  // MODEL VEYA G-CODE YÜKLENMEMİŞSE: Tüm maliyetler 0 olarak görünür, teklif fişi gizlenir
  if (!isModelLoaded()) {
    state.calculation.costs = {
      materialCost: 0,
      multicolorWasteCost: 0,
      multicolorWasteGrams: 0,
      electricityCost: 0,
      electricityKwh: 0,
      printerWatts: printer.powerWatts || 200,
      printerWearCost: 0,
      rentShareCost: 0,
      laptopCost: 0,
      laborCost: 0,
      designCost: 0,
      slaAddonCost: 0,
      customItemsTotal: 0,
      customCosts: [],
      riskCost: 0,
      netTotalCost: 0,
      marginPercent: parseFloat(document.getElementById('calc-margin-percent') ? document.getElementById('calc-margin-percent').value : 50) || 50,
      profitAmount: 0,
      unitPriceBeforeKdv: 0,
      kdvAmount: 0,
      finalUnitPrice: 0,
      finalTotalPrice: 0,
      quantity: parseInt(document.getElementById('calc-quantity') ? document.getElementById('calc-quantity').value : 1) || 1,
      totalPrintHours: 0,
      weightGrams: 0,
      supportWeightGrams: 0,
      totalMaterialGrams: 0
    };
    updateCostUI();
    return;
  }

  // 1. Ağırlık / Gramaj & Destek (Support) Hesabı (Gerçekçi Dilimleyici Formülü)
  let weightGrams = parseFloat(document.getElementById('calc-weight-grams').value) || 0;
  if (weightGrams <= 0 && state.currentModel.volumeCm3 > 0) {
    const res = calculateRealisticWeight();
    weightGrams = res.realisticGrams;
    document.getElementById('calc-weight-grams').value = weightGrams.toFixed(1);
    const solidEl = document.getElementById('calc-solid-weight');
    if (solidEl) solidEl.innerText = `${res.solidGrams.toFixed(1)}g`;
    const shellEl = document.getElementById('calc-shell-weight');
    if (shellEl) shellEl.innerText = `${(res.shellVolumeCm3 * (material.density || 1.24)).toFixed(1)}g`;
    const infillEl = document.getElementById('calc-infill-weight');
    if (infillEl) infillEl.innerText = `${(res.infillVolumeCm3 * (material.density || 1.24)).toFixed(1)}g`;
  }

  // Hassas Destek Gramajı Hesabı
  const supportWeightGrams = calculateAccurateSupportWeight(weightGrams);
  state.support.supportWeightGrams = supportWeightGrams;
  const statSupportWeight = document.getElementById('stat-support-weight');
  if (statSupportWeight) {
    statSupportWeight.innerText = `+${supportWeightGrams.toFixed(1)}g`;
  }

  // 2. Baskı Süresi (Saat ve Dakika)
  let inputHours = parseFloat(document.getElementById('calc-time-hours').value) || 0;
  let inputMinutes = parseFloat(document.getElementById('calc-time-minutes').value) || 0;

  // Eğer süre henüz atanmamışsa veya 0 ise ya da zorunlu süre güncellemesi gerekiyorsa:
  if ((inputHours === 0 && inputMinutes === 0 && state.currentModel.volumeCm3 > 0) || state.currentModel.needsTimeRecalc) {
    state.currentModel.needsTimeRecalc = false;
    const est = estimateAccuratePrintTime(weightGrams, supportWeightGrams, true);
    inputHours = est.hours;
    inputMinutes = est.minutes;
    document.getElementById('calc-time-hours').value = est.hours;
    document.getElementById('calc-time-minutes').value = est.minutes;
  }

  const basePrintHours = Math.max(0.1, inputHours + (inputMinutes / 60.0));

  // Çok Renkli Baskı (Multicolor) Fire & Swap Hesabı
  const isMulticolor = document.getElementById('calc-multicolor-enabled') ? document.getElementById('calc-multicolor-enabled').checked : false;
  let multicolorWasteGrams = 0;
  let multicolorExtraHours = 0;
  let multicolorWasteCost = 0;

  if (isMulticolor) {
    const swaps = parseInt(document.getElementById('calc-color-swaps').value) || 0;
    const purgePerSwap = parseFloat(document.getElementById('calc-purge-per-swap').value) || 0.8;
    multicolorWasteGrams = swaps * purgePerSwap;
    multicolorExtraHours = (swaps * 75) / 3600.0;
    multicolorWasteCost = (multicolorWasteGrams / 1000.0) * (material.pricePerKg || 450);

    const purgeInfoEl = document.getElementById('stat-total-purge-info');
    if (purgeInfoEl) {
      purgeInfoEl.innerText = `+${multicolorWasteGrams.toFixed(1)}g atık • +${Math.round(multicolorExtraHours * 60)} dk`;
    }
  }

  // Toplam fiili makine çalışma süresi (Baskı + Renk Değişimleri)
  const totalPrintHours = basePrintHours + multicolorExtraHours;
  const totalHoursEl = document.getElementById('calc-total-hours');
  if (totalHoursEl) {
    const thH = Math.floor(totalPrintHours);
    const thM = Math.round((totalPrintHours % 1) * 60);
    totalHoursEl.innerText = `${thH} sa ${thM} dk (${totalPrintHours.toFixed(2)} saat)`;
  }

  // Toplam Malzeme (Model + Destek + Çok Renk Atığı)
  const netModelMaterialGrams = weightGrams + supportWeightGrams;
  const totalMaterialGrams = netModelMaterialGrams + multicolorWasteGrams;

  // 3. Kalem Kalem Maliyetler
  // A. Hammadde Maliyeti (Filament veya Reçine)
  const materialKgPrice = material.pricePerKg || 450;
  const materialCost = (totalMaterialGrams / 1000.0) * materialKgPrice;

  // B. Elektrik Maliyeti (Yazıcı Gücü × Süre × kWh Fiyatı)
  const printerWatts = printer.powerWatts || 200;
  const electricityKwh = (printerWatts / 1000.0) * totalPrintHours;
  const electricityCost = electricityKwh * cfg.electricityKwhPrice;

  // C. Yazıcı Aşınma & Nozzle / LCD Payı
  const wearPerHour = printer.wearPerHour || (printer.purchasePrice / (printer.lifespanHours || 4000));
  const printerWearCost = wearPerHour * totalPrintHours;

  // D. Dükkan Kirası & Sabit Gider Payı (Saatlik adil makine başına düşen pay)
  const totalPrintersCount = state.config.printers.length || 8;
  const totalFleetMonthlyHours = totalPrintersCount * cfg.hoursPerPrinterMonthly;
  const hourlyRentShare = (cfg.monthlyRent + cfg.monthlyBills) / Math.max(1, totalFleetMonthlyHours);
  const rentShareCost = hourlyRentShare * totalPrintHours;

  // E. Laptop & Çizim Ekipmanı Payı
  const laptopMonthlyDepreciation = cfg.laptopPurchasePrice / (cfg.laptopLifespanMonths || 36);
  const hourlyLaptopShare = laptopMonthlyDepreciation / Math.max(1, totalFleetMonthlyHours);
  const laptopCost = hourlyLaptopShare * totalPrintHours;

  // F. Operasyonel İşçilik (Parça söküm, dilimleme + Destek temizleme payı)
  const prepMinutes = parseFloat(document.getElementById('calc-prep-time').value) || 0;
  const supportLaborBonusMinutes = (supportWeightGrams > 0) ? Math.min(15, Math.max(3, supportWeightGrams * 0.25)) : 0;
  const totalLaborMinutes = prepMinutes + supportLaborBonusMinutes;
  const laborCost = (totalLaborMinutes / 60.0) * cfg.laborHourlyRate;

  // G. Özel Tasarım (Fusion 360 / Blender Modelleme)
  const designHours = parseFloat(document.getElementById('calc-design-hours').value) || 0;
  const designCost = designHours * cfg.designHourlyRate;

  // H. SLA Özel Ek Sarfiyat (Reçine İPA yıkama, UV kürleme, eldiven)
  const isSLA = printer.type === 'sla' || material.type === 'sla';
  const slaAddonCost = isSLA ? (cfg.slaWashCureAddon || 25.0) : 0.0;

  // I. Doğrudan Üretim Alt Toplamı
  let directSubtotal = materialCost + electricityCost + printerWearCost + rentShareCost + laptopCost + laborCost + designCost + slaAddonCost;

  // J. Özel Kalemler & Kullanıcı Tanımlı Giderler (Kargo, Paketleme, Pirinç Somun vb.)
  let customItemsTotal = 0;
  const activeCustomCostsList = [];
  const quantity = parseInt(document.getElementById('calc-quantity').value) || 1;

  if (state.config.customCostItems && Array.isArray(state.config.customCostItems)) {
    state.config.customCostItems.forEach(item => {
      const chk = document.getElementById(`custom-item-chk-${item.id}`);
      const isEnabled = chk ? chk.checked : item.enabled;
      if (isEnabled) {
        let itemAmount = 0;
        let basisText = '';
        if (item.type === 'fixed') {
          itemAmount = parseFloat(item.rate) || 0;
          basisText = 'Sipariş başı sabit';
        } else if (item.type === 'per_piece') {
          itemAmount = (parseFloat(item.rate) || 0) * quantity;
          basisText = `${quantity} adet × ${item.rate} TL`;
        } else if (item.type === 'hourly') {
          itemAmount = (parseFloat(item.rate) || 0) * totalPrintHours;
          basisText = `${totalPrintHours.toFixed(1)} sa × ${item.rate} TL`;
        } else if (item.type === 'per_gram') {
          itemAmount = (parseFloat(item.rate) || 0) * totalMaterialGrams;
          basisText = `${totalMaterialGrams.toFixed(1)}g × ${item.rate} TL`;
        } else if (item.type === 'percentage') {
          itemAmount = (directSubtotal * (parseFloat(item.rate) || 0)) / 100.0;
          basisText = `%${item.rate} maliyet payı`;
        }

        customItemsTotal += itemAmount;
        activeCustomCostsList.push({
          id: item.id,
          name: item.name,
          category: item.category,
          type: item.type,
          rate: item.rate,
          amount: itemAmount,
          basisText: basisText
        });
      }
    });
  }

  directSubtotal += customItemsTotal;

  // K. Baskı Riski & Fire Oranı (%10)
  const riskCost = directSubtotal * 0.10;

  // Net Üretim Maliyeti
  const netTotalCost = directSubtotal + riskCost;

  // 4. Kâr Marjı & Fiyatlandırma
  const marginPercent = parseFloat(document.getElementById('calc-margin-percent').value) || 50;
  const unitPriceBeforeKdv = netTotalCost * (1.0 + (marginPercent / 100.0));

  const isKdv = document.getElementById('calc-kdv-check').checked;
  const kdvAmount = isKdv ? (unitPriceBeforeKdv * 0.20) : 0.0;
  const finalUnitPrice = unitPriceBeforeKdv + kdvAmount;

  // 5. Adet & Toplam Tutar
  const finalTotalPrice = finalUnitPrice * quantity;

  // Durumu Kaydet
  state.calculation.costs = {
    materialCost,
    multicolorWasteCost,
    multicolorWasteGrams,
    electricityCost,
    electricityKwh,
    printerWatts,
    printerWearCost,
    rentShareCost,
    laptopCost,
    laborCost,
    designCost,
    slaAddonCost,
    customItemsTotal,
    customCosts: activeCustomCostsList,
    riskCost,
    netTotalCost,
    marginPercent,
    profitAmount: unitPriceBeforeKdv - netTotalCost,
    unitPriceBeforeKdv,
    kdvAmount,
    finalUnitPrice,
    finalTotalPrice,
    quantity,
    totalPrintHours,
    weightGrams,
    supportWeightGrams,
    totalMaterialGrams
  };

  // UI Güncelle
  updateCostUI();
}

/**
 * Maliyet Rakamlarını Ekrana Basar
 */
function updateCostUI() {
  const c = state.calculation.costs;
  if (!c.netTotalCost && c.netTotalCost !== 0) return;

  document.getElementById('cost-material').innerText = `${c.materialCost.toFixed(2)} TL`;

  // Çok Renkli Atık Satırı
  const multiRow = document.getElementById('cost-multicolor-row');
  const multiWasteEl = document.getElementById('cost-multicolor-waste');
  if (multiRow && multiWasteEl) {
    if (c.multicolorWasteGrams && c.multicolorWasteGrams > 0) {
      multiRow.classList.remove('hidden');
      multiWasteEl.innerText = `${c.multicolorWasteCost.toFixed(2)} TL (+${c.multicolorWasteGrams.toFixed(1)}g)`;
    } else {
      multiRow.classList.add('hidden');
    }
  }

  document.getElementById('cost-electricity').innerText = `${c.electricityCost.toFixed(2)} TL`;
  document.getElementById('cost-printer-wear').innerText = `${c.printerWearCost.toFixed(2)} TL`;
  document.getElementById('cost-rent-share').innerText = `${c.rentShareCost.toFixed(2)} TL`;
  document.getElementById('cost-laptop-share').innerText = `${c.laptopCost.toFixed(2)} TL`;
  document.getElementById('cost-labor').innerText = `${(c.laborCost + c.slaAddonCost).toFixed(2)} TL`;
  document.getElementById('cost-risk').innerText = `${c.riskCost.toFixed(2)} TL`;
  document.getElementById('cost-net-total').innerText = `${c.netTotalCost.toFixed(2)} TL`;

  // Tasarım ücreti satırı
  const designRow = document.getElementById('cost-design-row');
  if (c.designCost > 0) {
    designRow.classList.remove('hidden');
    document.getElementById('cost-design').innerText = `${c.designCost.toFixed(2)} TL`;
  } else {
    designRow.classList.add('hidden');
  }

  // Özel Kalemler & Hizmetler Satırı
  const customRow = document.getElementById('cost-custom-items-row');
  const customTotalEl = document.getElementById('cost-custom-items-total');
  if (customRow && customTotalEl) {
    if (c.customItemsTotal && c.customItemsTotal > 0) {
      customRow.classList.remove('hidden');
      customTotalEl.innerText = `${c.customItemsTotal.toFixed(2)} TL`;
    } else {
      customRow.classList.add('hidden');
    }
  }

  // KDV
  document.getElementById('cost-kdv-amount').innerText = `${c.kdvAmount.toFixed(2)} TL`;

  // Nihai Fiyatlar
  document.getElementById('final-unit-price').innerText = `${c.finalUnitPrice.toFixed(2)} TL`;
  document.getElementById('final-total-price').innerText = `${c.finalTotalPrice.toFixed(2)} TL`;
  document.getElementById('total-qty-label').innerText = c.quantity;

  // SLA Ek Sarfiyat Kutucuğu
  const printer = getSelectedPrinter();
  const slaCard = document.getElementById('sla-addons-card');
  if (printer.type === 'sla') {
    slaCard.classList.remove('hidden');
  } else {
    slaCard.classList.add('hidden');
  }

  // Teklif Sekmesini ve Detaylı Şirket İçi Patron Raporunu Güncelle
  updateQuoteUI();
  renderInternalReportView();
}

/**
 * Mevcut Hesaplamadan Şirket İçi Detaylı Rapor Nesnesi Üretir
 */
function generateCurrentReportObject() {
  const c = state.calculation.costs;
  const p = getSelectedPrinter();
  const m = getSelectedMaterial();
  const d = state.currentModel.dimensions || { x: 0, y: 0, z: 0 };
  const wallSelect = document.getElementById('calc-wall-count');
  const wallCount = wallSelect ? wallSelect.value : 2;

  const reportId = 'REP-' + Date.now().toString(36).toUpperCase();
  const timestamp = new Date();

  return {
    id: reportId,
    timestamp: timestamp.toISOString(),
    displayDate: timestamp.toLocaleString('tr-TR'),
    modelName: state.currentModel.name || 'Model.stl',
    fileType: state.currentModel.extension || 'stl',
    dimensions: { x: d.x, y: d.y, z: d.z },
    volumeCm3: state.currentModel.volumeCm3 || 0,
    surfaceAreaCm2: state.currentModel.surfaceAreaCm2 || 0,
    printerName: p.name,
    printerType: p.type,
    materialName: m.name,
    materialKgPrice: m.pricePerKg,
    infillPercent: parseFloat(document.getElementById('calc-infill').value) || 15,
    wallCount: wallCount,
    layerHeight: document.getElementById('calc-layer-height') ? document.getElementById('calc-layer-height').value : '0.20',
    weightGrams: c.weightGrams || 0,
    supportWeightGrams: c.supportWeightGrams || 0,
    multicolorWasteGrams: c.multicolorWasteGrams || 0,
    totalMaterialGrams: c.totalMaterialGrams || 0,
    printHours: c.totalPrintHours || 0,
    quantity: c.quantity || 1,
    // Finansal Döküm
    materialCost: c.materialCost || 0,
    multicolorWasteCost: c.multicolorWasteCost || 0,
    electricityCost: c.electricityCost || 0,
    electricityKwh: c.electricityKwh || 0,
    printerWearCost: c.printerWearCost || 0,
    rentShareCost: c.rentShareCost || 0,
    laptopCost: c.laptopCost || 0,
    laborCost: c.laborCost || 0,
    designCost: c.designCost || 0,
    slaAddonCost: c.slaAddonCost || 0,
    customItemsTotal: c.customItemsTotal || 0,
    customCosts: c.customCosts || [],
    riskCost: c.riskCost || 0,
    netTotalCost: c.netTotalCost || 0,
    marginPercent: c.marginPercent || 50,
    profitAmount: c.profitAmount || 0,
    unitPriceBeforeKdv: c.unitPriceBeforeKdv || 0,
    kdvAmount: c.kdvAmount || 0,
    finalUnitPrice: c.finalUnitPrice || 0,
    finalTotalPrice: c.finalTotalPrice || 0
  };
}

/**
 * Şirket İçi Gizli Patron Raporunu Render Eder (#tab-reports)
 */
function renderInternalReportView(reportData = null) {
  const r = reportData || generateCurrentReportObject();
  if (!r) return;

  const idBadge = document.getElementById('report-id-badge');
  if (idBadge) idBadge.innerText = `#${r.id}`;

  const titleEl = document.getElementById('report-model-title');
  if (titleEl) titleEl.innerText = `Model: ${r.modelName}`;

  const subEl = document.getElementById('report-subtitle');
  if (subEl) subEl.innerText = `${r.printerName} • ${r.materialName} (${r.materialKgPrice} TL/kg) • ${r.wallCount} Duvar / %${r.infillPercent} Dolgu`;

  // Teknik Kutular
  const dimsEl = document.getElementById('report-dims');
  if (dimsEl) dimsEl.innerText = `${r.dimensions.x.toFixed(1)} × ${r.dimensions.y.toFixed(1)} × ${r.dimensions.z.toFixed(1)} mm`;

  const weightEl = document.getElementById('report-weight-info');
  if (weightEl) weightEl.innerText = `${r.weightGrams.toFixed(1)}g (+${(r.supportWeightGrams + r.multicolorWasteGrams).toFixed(1)}g atık/destek)`;

  const timeEl = document.getElementById('report-time-info');
  if (timeEl) timeEl.innerText = `${r.printHours.toFixed(2)} saat`;

  const infillEl = document.getElementById('report-infill-info');
  if (infillEl) infillEl.innerText = `%${r.infillPercent} Dolgu • ${r.wallCount} Duvar (${r.layerHeight}mm)`;

  // Tablo Kalemleri
  const tbody = document.getElementById('report-cost-breakdown-body');
  if (tbody) {
    tbody.innerHTML = '';
    const net = Math.max(0.01, r.netTotalCost);

    const rows = [
      {
        name: 'Model & Destek Hammaddesi',
        basis: `${(r.weightGrams + r.supportWeightGrams).toFixed(1)}g × ${(r.materialKgPrice / 1000).toFixed(2)} TL/g`,
        rate: `${r.materialKgPrice} TL/kg`,
        amount: r.materialCost - r.multicolorWasteCost
      },
      {
        name: 'Çok Renkli Kule & Swap Poop Atığı',
        basis: `${r.multicolorWasteGrams.toFixed(1)}g renk geçiş atığı`,
        rate: `${r.materialKgPrice} TL/kg`,
        amount: r.multicolorWasteCost,
        hide: r.multicolorWasteGrams <= 0
      },
      {
        name: 'Elektrik Enerjisi Tüketimi',
        basis: `${r.printHours.toFixed(2)} sa × ${(r.electricityKwh / Math.max(0.01, r.printHours) * 1000).toFixed(0)}W (${r.electricityKwh.toFixed(2)} kWh)`,
        rate: `${state.config.workshop.electricityKwhPrice} TL/kWh`,
        amount: r.electricityCost
      },
      {
        name: 'Makine Aşınması & Nozzle/LCD Amortismanı',
        basis: `${r.printHours.toFixed(2)} saat fiili baskı süresi`,
        rate: `${(r.printerWearCost / Math.max(0.01, r.printHours)).toFixed(2)} TL/saat`,
        amount: r.printerWearCost
      },
      {
        name: 'Dükkan Kirası & Sabit Gider Payı',
        basis: `Toplam kira payı (${r.printHours.toFixed(2)} saat / ${state.config.printers.length} yazıcı)`,
        rate: `${(r.rentShareCost / Math.max(0.01, r.printHours)).toFixed(2)} TL/saat`,
        amount: r.rentShareCost
      },
      {
        name: 'Laptop & Donanım Amortisman Payı',
        basis: `36 ay laptop amortismanı (${r.printHours.toFixed(2)} sa)`,
        rate: `${(r.laptopCost / Math.max(0.01, r.printHours)).toFixed(2)} TL/saat`,
        amount: r.laptopCost
      },
      {
        name: 'Operasyonel İşçilik (Söküm, Destek & Temizlik)',
        basis: `Hazırlık, dilimleme ve yüzey operasyonu`,
        rate: `${state.config.workshop.laborHourlyRate} TL/saat`,
        amount: r.laborCost
      },
      {
        name: '3D CAD Tasarım & Modelleme (Fusion/Blender)',
        basis: `Özel parça çizimi / revizyon`,
        rate: `${state.config.workshop.designHourlyRate} TL/saat`,
        amount: r.designCost,
        hide: r.designCost <= 0
      },
      {
        name: 'SLA Özel Kimyasal & Yıkama/Kürleme Payı',
        basis: `İPA yıkama, UV fırın, nitril eldiven`,
        rate: `Sabit / baskı`,
        amount: r.slaAddonCost,
        hide: r.slaAddonCost <= 0
      }
    ];

    // Kullanıcının Özel Eklediği Kalemler
    if (r.customCosts && r.customCosts.length > 0) {
      r.customCosts.forEach(ci => {
        rows.push({
          name: `[Özel Kalem] ${ci.name}`,
          basis: ci.basisText || 'Kullanıcı tanımlı',
          rate: `${ci.rate} ${ci.type === 'percentage' ? '%' : 'TL'}`,
          amount: ci.amount
        });
      });
    }

    // Risk & Fire Payı
    rows.push({
      name: 'Baskı Riski, Hata & Fire Payı (%10)',
      basis: `Tüm doğrudan üretim harcamalarının %10'u`,
      rate: '%10 Fire',
      amount: r.riskCost
    });

    rows.forEach(row => {
      if (row.hide) return;
      const pct = (row.amount / net) * 100;
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/40 transition-colors';
      tr.innerHTML = `
        <td class="py-2 px-3 font-medium text-slate-200">${row.name}</td>
        <td class="py-2 px-3 text-slate-400 font-mono text-[11px]">${row.basis}</td>
        <td class="py-2 px-3 text-right font-mono text-slate-400">${row.rate}</td>
        <td class="py-2 px-3 text-right font-mono font-bold text-slate-200">${row.amount.toFixed(2)} TL</td>
        <td class="py-2 px-3 text-right font-mono text-cyan-400 font-semibold">%${pct.toFixed(1)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Alt Finansal Özet
  const netEl = document.getElementById('report-net-cost');
  if (netEl) netEl.innerText = `${r.netTotalCost.toFixed(2)} TL`;

  const marginEl = document.getElementById('report-margin-rate');
  if (marginEl) marginEl.innerText = `%${r.marginPercent}`;

  const profitEl = document.getElementById('report-profit-amount');
  if (profitEl) profitEl.innerText = `+${r.profitAmount.toFixed(2)} TL`;

  const finalPriceEl = document.getElementById('report-final-price');
  if (finalPriceEl) finalPriceEl.innerText = `${r.finalTotalPrice.toFixed(2)} TL`;
}

/**
 * Mevcut Modeli Veritabanına (localStorage: cost_reports_db) Kaydeder
 */
function saveCurrentReportToDatabase() {
  const report = generateCurrentReportObject();
  const reports = loadReportsFromDatabase();

  reports.unshift(report);
  saveReportsToDatabase(reports);
  renderReportsDatabaseTable();

  // Bildirim ver
  alert(`"${report.modelName}" için detaylı maliyet raporu veritabanına başarıyla arşivlendi!\n\nNet Maliyet: ${report.netTotalCost.toFixed(2)} TL\nTeklif Fiyatı: ${report.finalTotalPrice.toFixed(2)} TL`);
}

function loadReportsFromDatabase() {
  try {
    const raw = localStorage.getItem('cost_reports_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Rapor veritabanı okunamadı:', e);
  }
  return [];
}

function saveReportsToDatabase(reports) {
  try {
    localStorage.setItem('cost_reports_db', JSON.stringify(reports));
  } catch (e) {
    console.error('Raporlar kaydedilemedi:', e);
  }
}

/**
 * Arşivlenmiş Raporlar Tablosunu Render Eder (#archived-reports-table-body)
 */
function renderReportsDatabaseTable(filterTerm = '') {
  const tbody = document.getElementById('archived-reports-table-body');
  const countBadge = document.getElementById('report-count-badge');
  if (!tbody) return;
  tbody.innerHTML = '';

  let reports = loadReportsFromDatabase();

  if (filterTerm) {
    const term = filterTerm.toLowerCase();
    reports = reports.filter(r => 
      (r.modelName && r.modelName.toLowerCase().includes(term)) ||
      (r.printerName && r.printerName.toLowerCase().includes(term)) ||
      (r.materialName && r.materialName.toLowerCase().includes(term))
    );
  }

  if (countBadge) countBadge.innerText = `${reports.length} Kayıt`;

  if (reports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-6 text-center text-slate-500 italic">Arşivde henüz kayıtlı maliyet raporu bulunmuyor. "Mevcut Modeli Arşivle & Kaydet" butonu ile kaydedebilirsiniz.</td></tr>`;
    return;
  }

  reports.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/40 transition-colors';
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-[11px] font-mono text-slate-400">${r.displayDate || '-'}</td>
      <td class="py-2.5 px-3 font-semibold text-slate-200">
        <span class="truncate block max-w-[180px]" title="${r.modelName}">${r.modelName}</span>
      </td>
      <td class="py-2.5 px-3 text-slate-300 text-[11px]">${r.printerName} • ${r.materialName}</td>
      <td class="py-2.5 px-3 text-center font-mono text-slate-400">${r.printHours.toFixed(1)} sa</td>
      <td class="py-2.5 px-3 text-right font-mono text-indigo-300 font-bold">${r.weightGrams.toFixed(1)}g</td>
      <td class="py-2.5 px-3 text-right font-mono text-slate-300">${r.netTotalCost.toFixed(2)} TL</td>
      <td class="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">%${r.marginPercent}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold text-white">${r.finalTotalPrice.toFixed(2)} TL</td>
      <td class="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
        <button class="btn-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white" onclick="viewArchivedReport('${r.id}')">İncele</button>
        <button class="btn-xs text-rose-400 hover:text-rose-300" onclick="deleteArchivedReport('${r.id}')">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewArchivedReport(reportId) {
  const reports = loadReportsFromDatabase();
  const report = reports.find(r => r.id === reportId);
  if (!report) return;

  renderInternalReportView(report);
  const container = document.getElementById('internal-report-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth' });
    container.classList.add('ring-2', 'ring-indigo-500');
    setTimeout(() => container.classList.remove('ring-2', 'ring-indigo-500'), 1500);
  }
}

function deleteArchivedReport(reportId) {
  if (!confirm('Bu kayıtlı maliyet raporunu arşivden silmek istediğinize emin misiniz?')) return;
  let reports = loadReportsFromDatabase();
  reports = reports.filter(r => r.id !== reportId);
  saveReportsToDatabase(reports);
  renderReportsDatabaseTable();
}

function clearReportsDatabase() {
  if (!confirm('Tüm arşivlenmiş maliyet raporlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
  localStorage.removeItem('cost_reports_db');
  renderReportsDatabaseTable();
}

function exportReportsJSON() {
  const reports = loadReportsFromDatabase();
  if (reports.length === 0) {
    alert('Arşivde dışa aktarılacak kayıtlı rapor bulunmuyor.');
    return;
  }
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `3D_Maliyet_Raporlari_Arsiv_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportReportsCSV() {
  const reports = loadReportsFromDatabase();
  if (reports.length === 0) {
    alert('Arşivde dışa aktarılacak kayıtlı rapor bulunmuyor.');
    return;
  }
  const headers = ['Rapor_No', 'Tarih', 'Model_Adi', 'Yazici', 'Malzeme', 'Gramaj_g', 'Baski_Suresi_sa', 'Net_Maliyet_TL', 'Kar_Yuzdesi', 'Nihai_Fiyat_TL'];
  const csvRows = [headers.join(';')];

  reports.forEach(r => {
    csvRows.push([
      r.id,
      r.displayDate,
      `"${(r.modelName || '').replace(/"/g, '""')}"`,
      `"${r.printerName}"`,
      `"${r.materialName}"`,
      r.weightGrams.toFixed(1),
      r.printHours.toFixed(2),
      r.netTotalCost.toFixed(2),
      r.marginPercent,
      r.finalTotalPrice.toFixed(2)
    ].join(';'));
  });

  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `3D_Maliyet_Raporlari_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Müşteri Teklifi ve Fişini Doldurur
 */
function updateQuoteUI() {
  const emptyState = document.getElementById('quote-empty-state');
  const quoteInteractive = document.getElementById('quote-interactive-container');

  // Herhangi bir dosya yüklenmediğinde teklif gizlenir ve boş durum gösterilir
  if (!isModelLoaded()) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (quoteInteractive) quoteInteractive.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (quoteInteractive) quoteInteractive.classList.remove('hidden');

  const c = state.calculation.costs;
  const p = getSelectedPrinter();
  const m = getSelectedMaterial();
  const cust = state.customerInfo || {};

  // Müşteri Bilgileri Girdilerini ve Önizlemeyi Güncelle
  const custNameInput = document.getElementById('quote-input-customer-name');
  if (custNameInput && document.activeElement !== custNameInput) custNameInput.value = cust.name || '';

  const custPhoneInput = document.getElementById('quote-input-customer-phone');
  if (custPhoneInput && document.activeElement !== custPhoneInput) custPhoneInput.value = cust.phone || '';

  const custEmailInput = document.getElementById('quote-input-customer-email');
  if (custEmailInput && document.activeElement !== custEmailInput) custEmailInput.value = cust.email || '';

  const quoteNoInput = document.getElementById('quote-input-number');
  if (quoteNoInput && document.activeElement !== quoteNoInput) quoteNoInput.value = cust.quoteNo || '#TK-8421';

  const validityInput = document.getElementById('quote-input-validity');
  if (validityInput && document.activeElement !== validityInput) validityInput.value = cust.validityDays || '7 Gün';

  const notesInput = document.getElementById('quote-input-notes');
  if (notesInput && document.activeElement !== notesInput) notesInput.value = cust.notes || '';

  // Teklif Fişindeki Müşteri Göstergeleri
  const dispCustName = document.getElementById('quote-display-customer-name');
  if (dispCustName) dispCustName.innerText = cust.name || 'Belirtilmedi';

  const dispCustContact = document.getElementById('quote-display-customer-contact');
  if (dispCustContact) {
    const cp = [];
    if (cust.phone) cp.push(cust.phone);
    if (cust.email) cp.push(cust.email);
    dispCustContact.innerText = cp.length > 0 ? cp.join(' • ') : '-';
  }

  const quoteNoEl = document.getElementById('quote-no');
  if (quoteNoEl) quoteNoEl.innerText = cust.quoteNo || '#TK-8421';

  const dispValidity = document.getElementById('quote-display-validity-text');
  if (dispValidity) dispValidity.innerText = `• Teklif geçerlilik süresi: ${cust.validityDays || '7 Gün'}.`;

  const dispNotes = document.getElementById('quote-display-notes-text');
  if (dispNotes) dispNotes.innerText = `• ${cust.notes || 'Fiyatlarımıza malzeme, makine süresi ve atölye işçiliği dahildir. Teslimat atölyemizden yapılır.'}`;

  const now = new Date();
  document.getElementById('quote-date').innerText = now.toLocaleDateString('tr-TR');
  document.getElementById('quote-model-name').innerText = state.currentModel.name || 'Prototip Model';

  const d = state.currentModel.dimensions || { x: 0, y: 0, z: 0 };
  const quoteDimEl = document.getElementById('quote-dimensions');
  if (quoteDimEl) quoteDimEl.innerText = `${Math.round(d.x)} × ${Math.round(d.y)} × ${Math.round(d.z)} mm`;

  // Firma Kimliği ve Logo Güncellemesi
  const comp = state.config.company || {};
  const quoteLogo = document.getElementById('quote-company-logo');
  const quoteBadge = document.getElementById('quote-company-badge');
  if (quoteLogo && quoteBadge) {
    if (comp.logo && typeof comp.logo === 'string' && comp.logo.startsWith('data:image')) {
      quoteLogo.src = comp.logo;
      quoteLogo.classList.remove('hidden');
      quoteBadge.classList.add('hidden');
    } else {
      quoteLogo.src = '';
      quoteLogo.classList.add('hidden');
      quoteBadge.classList.remove('hidden');
    }
  }

  const quoteCompName = document.getElementById('quote-company-name');
  if (quoteCompName) quoteCompName.innerText = comp.name || '3D Üretim ve Prototip Teklifi';

  const quoteContactLine = document.getElementById('quote-company-contact-line');
  if (quoteContactLine) {
    const parts = [];
    if (comp.phone) parts.push(`Tel: ${comp.phone}`);
    if (comp.email) parts.push(comp.email);
    if (comp.website) parts.push(comp.website);
    quoteContactLine.innerText = parts.join(' • ');
  }

  const quoteFootCompany = document.getElementById('quote-footer-company');
  if (quoteFootCompany) quoteFootCompany.innerText = comp.name || '3D Üretim ve Prototipleme Atölyesi';
  const quoteFootAddr = document.getElementById('quote-footer-address');
  if (quoteFootAddr) quoteFootAddr.innerText = comp.address || '';
  const quoteFootContact = document.getElementById('quote-footer-contact');
  if (quoteFootContact) {
    const cParts = [];
    if (comp.contact) cParts.push(`Yetkili: ${comp.contact}`);
    if (comp.phone) cParts.push(comp.phone);
    if (comp.email) cParts.push(comp.email);
    quoteFootContact.innerText = cParts.join(' | ');
  }
  
  const supportSelect = document.getElementById('calc-support-type');
  const supportType = supportSelect ? supportSelect.value : 'auto_tree';
  let supportLabel = 'Desteksiz';
  if (supportType === 'auto_tree') supportLabel = `Ağaç Destek (+${(state.support.supportWeightGrams || 0).toFixed(1)}g)`;
  else if (supportType === 'auto_snug') supportLabel = `Izgara Destek (+${(state.support.supportWeightGrams || 0).toFixed(1)}g)`;
  else if (supportType === 'painted_only') supportLabel = `Boyalı Destek (+${(state.support.supportWeightGrams || 0).toFixed(1)}g)`;

  document.getElementById('quote-tech-detail').innerText = `${p.name} • ${m.name} • ${supportLabel}`;
  document.getElementById('quote-infill').innerText = `%${document.getElementById('calc-infill').value}`;
  document.getElementById('quote-quantity').innerText = `${c.quantity} Adet`;

  // Tablo Satırları
  document.getElementById('quote-item-time').innerText = `${c.totalPrintHours.toFixed(1)} sa`;
  document.getElementById('quote-item-qty').innerText = c.quantity;
  document.getElementById('quote-item-unit').innerText = `${c.unitPriceBeforeKdv.toFixed(2)} TL`;
  document.getElementById('quote-item-total').innerText = `${(c.unitPriceBeforeKdv * c.quantity).toFixed(2)} TL`;

  // Tasarım Satırı
  const designTr = document.getElementById('quote-design-tr');
  const designHours = parseFloat(document.getElementById('calc-design-hours').value) || 0;
  if (designHours > 0) {
    designTr.classList.remove('hidden');
    document.getElementById('quote-design-hours').innerText = `${designHours.toFixed(1)} sa`;
    document.getElementById('quote-design-unit').innerText = `${state.config.workshop.designHourlyRate.toFixed(2)} TL`;
    document.getElementById('quote-design-total').innerText = `${(designHours * state.config.workshop.designHourlyRate).toFixed(2)} TL`;
  } else {
    designTr.classList.add('hidden');
  }

  const subtotal = c.unitPriceBeforeKdv * c.quantity;
  document.getElementById('quote-subtotal').innerText = `${subtotal.toFixed(2)} TL`;

  const isKdv = document.getElementById('calc-kdv-check').checked;
  const kdvRow = document.getElementById('quote-kdv-row');
  if (isKdv) {
    kdvRow.classList.remove('hidden');
    document.getElementById('quote-kdv').innerText = `${(c.kdvAmount * c.quantity).toFixed(2)} TL`;
  } else {
    kdvRow.classList.add('hidden');
  }

  document.getElementById('quote-grand-total').innerText = `${c.finalTotalPrice.toFixed(2)} TL`;
}

// ========================================================
// 6. UI YÖNETİMİ & EVENT LİSTENER'LAR
// ========================================================

// ========================================================
// 6. UI YÖNETİMİ & EVENT LİSTENER'LAR
// ========================================================

/**
 * Malzeme Seçim Açılır Menüsünü Ülkeye Göre Doldurur
 */
function renderMaterialsSelect(country = 'tr') {
  const select = document.getElementById('calc-material-select');
  if (!select) return;

  const list = MATERIAL_CATALOG[country] || MATERIAL_CATALOG.tr;
  select.innerHTML = '';

  list.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.setAttribute('data-type', item.type);
    opt.setAttribute('data-density', item.density);
    opt.setAttribute('data-price', item.pricePerKg);
    opt.innerText = `${item.name} (${item.type.toUpperCase()} • ${item.pricePerKg} TL/kg)`;
    select.appendChild(opt);
  });

  // State içindeki materials nesnesini de genişlet
  list.forEach(item => {
    state.config.materials[item.id] = item;
  });

  // İlk malzemeyi seç ve UI güncelle
  updateSelectedMaterialInfo();
}

function updateSelectedMaterialInfo() {
  const m = getSelectedMaterial();
  const label = document.getElementById('material-unit-price-label');
  const densityBadge = document.getElementById('material-density-badge');
  if (label) label.innerText = `${m.pricePerKg} TL/kg (${m.name})`;
  if (densityBadge) densityBadge.innerText = `${m.density || 1.24} g/cm³`;

  const orcaBadge = document.getElementById('orca-material-params-badge');
  if (orcaBadge) {
    if (m.type === 'sla') {
      orcaBadge.innerHTML = `<span>Orca SLA: Katman Pozlama ~${m.layerSec || 2.0}s</span><span class="text-indigo-400 font-semibold">${m.family || 'Reçine'} Profili</span>`;
    } else {
      const nTemp = m.nozzleTemp || 215;
      const bTemp = m.bedTemp || 55;
      orcaBadge.innerHTML = `<span>Orca Slicer: Nozzle ${nTemp}°C • Tabla ${bTemp}°C</span><span class="text-indigo-400 font-semibold">${m.family || 'FDM'} Profili</span>`;
    }
  }

  if (state.currentModel.volumeCm3 > 0) {
    const solidWeight = state.currentModel.volumeCm3 * (m.density || 1.24);
    const solidEl = document.getElementById('calc-solid-weight');
    if (solidEl) solidEl.innerText = `${solidWeight.toFixed(1)}g`;
  }
}

/**
 * Piyasadaki Hazır Yazıcılar Kataloğu Modalını Render Eder
 */
function renderCatalogModal() {
  const grid = document.getElementById('catalog-printers-grid');
  if (!grid) return;

  const search = (document.getElementById('catalog-search').value || '').toLowerCase().trim();
  const brandFilter = document.getElementById('catalog-brand-filter').value || 'all';
  const typeFilter = document.getElementById('catalog-type-filter').value || 'all';

  grid.innerHTML = '';

  const filtered = PRINTER_CATALOG.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    const matchesBrand = (brandFilter === 'all') || (p.brand === brandFilter);
    const matchesType = (typeFilter === 'all') || (p.type === typeFilter);
    return matchesSearch && matchesBrand && matchesType;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="p-6 text-center text-xs text-slate-500">Aranan kriterlere uygun yazıcı modeli bulunamadı.</div>`;
    return;
  }

  filtered.forEach(p => {
    const item = document.createElement('div');
    item.className = 'p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors flex items-center justify-between gap-3';
    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg ${p.type === 'sla' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'} flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
          ${p.type}
        </div>
        <div>
          <h4 class="text-xs font-semibold text-white">${p.name}</h4>
          <p class="text-[11px] text-slate-400">Tabla: ${p.bedX}×${p.bedY}×${p.bedZ}mm • ~${p.powerWatts}W • Aşınma: ${p.wearPerHour} TL/sa</p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="text-right text-[11px]">
          <span class="text-slate-400 block text-[10px]">Ortalama Fiyat</span>
          <span class="font-mono font-medium text-slate-200">${p.purchasePrice.toLocaleString('tr-TR')} TL</span>
        </div>
        <button class="btn-primary text-xs py-1.5 px-3 flex items-center gap-1" onclick="addPrinterFromCatalog('${p.id}')">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Filoma Ekle
        </button>
      </div>
    `;
    grid.appendChild(item);
  });
}

window.addPrinterFromCatalog = function(catalogId) {
  const model = PRINTER_CATALOG.find(p => p.id === catalogId);
  if (!model) return;

  // Aynı modelden kaç tane olduğunu say
  const countSame = state.config.printers.filter(p => p.name.includes(model.name)).length;
  const newName = countSame > 0 ? `${model.name} (#${countSame + 1})` : model.name;

  const newPrinter = {
    id: `printer_${Date.now()}`,
    name: newName,
    type: model.type,
    bedX: model.bedX,
    bedY: model.bedY,
    bedZ: model.bedZ,
    powerWatts: model.powerWatts,
    purchasePrice: model.purchasePrice,
    lifespanHours: model.lifespanHours,
    wearPerHour: model.wearPerHour,
    status: 'active'
  };

  state.config.printers.push(newPrinter);
  state.saveConfig();
  renderFleetList();
  renderPrintersSelect();
  calculateCosts();

  // Modalı kapat ve bilgi ver
  const modal = document.getElementById('modal-printer-catalog');
  if (modal) modal.classList.add('hidden');
  alert(`✓ "${newName}" başarıyla atölye filonuza eklendi!`);
};

/**
 * Dil Değiştirici (TR <-> EN i18n)
 */
function setLanguage(lang = 'tr') {
  state.config.language = lang;
  const t = I18N[lang] || I18N.tr;

  // Header butonları durumu
  const btnTr = document.getElementById('lang-btn-tr');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnTr && btnEn) {
    if (lang === 'tr') {
      btnTr.className = 'px-2 py-1 rounded font-bold transition-colors bg-indigo-600 text-white';
      btnEn.className = 'px-2 py-1 rounded font-bold transition-colors text-slate-400 hover:text-white';
    } else {
      btnEn.className = 'px-2 py-1 rounded font-bold transition-colors bg-indigo-600 text-white';
      btnTr.className = 'px-2 py-1 rounded font-bold transition-colors text-slate-400 hover:text-white';
    }
  }

  // Ayarlar sekmesindeki dropdown
  const langSelect = document.getElementById('setting-language-select');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  // data-i18n özniteliğine sahip TÜM elementleri otomatik ve hatasız çevir
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.innerText = t[key];
    }
  });

  // data-i18n-placeholder özniteliğine sahip inputları çevir
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });

  // Geriye dönük uyumluluk için güvenli metin güncelleme
  const setTxt = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.innerText = text;
  };

  setTxt('txt-data-saved', t.dataSaved);
  setTxt('txt-factory-reset', t.factoryReset);
  setTxt('txt-load-model-title', t.loadModelTitle);
  setTxt('txt-drag-drop', t.dragDrop);
  setTxt('txt-choose-file', t.chooseFile);
  setTxt('txt-or-drag', t.orDrag);
  setTxt('txt-viewer-title', t.viewerTitle);
  setTxt('btn-toggle-wireframe', t.wireframe);
  setTxt('btn-reset-camera', t.recenter);
  setTxt('txt-orient-title', t.orientTitle);
  setTxt('txt-snap-bed', t.snapBed);
  setTxt('txt-center-model', t.centerModel);
  setTxt('tab-tool-support', t.tabSupport);
  setTxt('tab-tool-color', t.tabColor);
  setTxt('txt-paint-brush', t.paintBrush);
  setTxt('btn-reset-model-colors', t.resetModelColors);
  setTxt('tool-mode-view', t.inspect);
  setTxt('tool-mode-enforce', t.addSupport);
  setTxt('tool-mode-block', t.blockSupport);
  setTxt('tool-mode-eraser', t.eraser);
  setTxt('btn-clear-paint', t.clear);
  setTxt('txt-material-title', t.materialTitle);
  setTxt('txt-multicolor-toggle', t.multicolorToggle);
  setTxt('txt-fleet-title', t.fleetTitle);
  setTxt('txt-fleet-desc', t.fleetDesc);
  setTxt('txt-add-from-catalog', t.addFromCatalog);
  setTxt('txt-add-custom-printer', t.addCustomPrinter);
  setTxt('txt-catalog-title', t.catalogTitle);
  setTxt('txt-catalog-desc', t.catalogDesc);
  setTxt('btn-save-settings', t.saveSettings);
  setTxt('txt-cost-multicolor-label', t.multicolorWasteCost);

  // Tabloları ve dökümü tazele
  if (typeof renderCustomCostItemsTable === 'function') renderCustomCostItemsTable();
  if (typeof renderActiveCustomCostItemsInCalc === 'function') renderActiveCustomCostItemsInCalc();
  if (typeof renderReportsDatabaseTable === 'function') renderReportsDatabaseTable();
  if (typeof calculateCosts === 'function') calculateCosts();

  state.saveConfig();
}

function renderPrintersSelect() {
  const select = document.getElementById('calc-printer-select');
  if (!select) return;
  select.innerHTML = '';

  if (!state.config.printers || state.config.printers.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.innerText = '-- Lütfen Makine Parkı Sekmesinden Yazıcı Ekleyin --';
    select.appendChild(opt);
    updatePrinterSpecHint();
    return;
  }

  state.config.printers.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = `${p.name} (${p.type.toUpperCase()} - ${p.bedX}×${p.bedY}×${p.bedZ}mm)`;
    select.appendChild(opt);
  });

  updatePrinterSpecHint();
}

function updatePrinterSpecHint() {
  const printer = getSelectedPrinter();
  const hint = document.getElementById('printer-spec-hint');
  if (!hint) return;
  if (printer.id === 'no_printer') {
    hint.innerText = 'Atölyenizde tanımlı yazıcı bulunmuyor. Lütfen "Makine Parkı" sekmesinden cihaz ekleyin.';
    return;
  }
  hint.innerText = `Orca Slicer Profili: ${printer.bedX}×${printer.bedY}×${printer.bedZ}mm • ${printer.type.toUpperCase()} • ~${printer.powerWatts}W • Aşınma: ${printer.wearPerHour} TL/sa`;
}

function renderFleetList() {
  const container = document.getElementById('printers-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (!state.config.printers || state.config.printers.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-slate-900/40 rounded-xl border-2 border-dashed border-slate-800 space-y-2">
        <div class="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl">🖨️</div>
        <p class="text-sm font-semibold text-white">Atölyenizde Henüz Tanımlı Yazıcı Yok</p>
        <p class="text-xs text-slate-400 max-w-md mx-auto">Aşağıdaki Orca Slicer Cihaz Kataloğundan atölyenizdeki makineleri tek tıkla envanterinize ekleyebilir veya özel yazıcı tanımlayabilirsiniz.</p>
      </div>
    `;
    return;
  }

  state.config.printers.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'printer-card';
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl ${p.type === 'sla' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'} flex items-center justify-center font-bold text-xs uppercase">
          ${p.type}
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">${p.name}</h4>
          <p class="text-xs text-slate-400">Tabla: ${p.bedX}×${p.bedY}×${p.bedZ}mm • Güç: ${p.powerWatts}W • Aşınma: ${p.wearPerHour} TL/sa</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="text-right mr-3 text-xs">
          <span class="text-slate-400 block text-[10px]">Cihaz Bedeli</span>
          <span class="font-mono font-medium text-slate-200">${p.purchasePrice.toLocaleString('tr-TR')} TL</span>
        </div>
        <button class="btn-xs hover:text-rose-400" onclick="deletePrinter(${index})" title="Yazıcıyı Sil">Kaldır</button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.deletePrinter = function(index) {
  if (confirm(`Bu yazıcıyı filonuzdan kaldırmak istediğinize emin misiniz?`)) {
    state.config.printers.splice(index, 1);
    state.saveConfig();
    renderFleetList();
    renderPrintersSelect();
    calculateCosts();
  }
};

function renderCompanyLogoPreview(dataUrl) {
  const imgEl = document.getElementById('setting-company-logo-img');
  const phEl = document.getElementById('setting-company-logo-placeholder');
  const removeBtn = document.getElementById('btn-remove-company-logo');
  if (!imgEl || !phEl) return;

  if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image')) {
    imgEl.src = dataUrl;
    imgEl.classList.remove('hidden');
    phEl.classList.add('hidden');
    if (removeBtn) removeBtn.classList.remove('hidden');
  } else {
    imgEl.src = '';
    imgEl.classList.add('hidden');
    phEl.classList.remove('hidden');
    if (removeBtn) removeBtn.classList.add('hidden');
  }
}

function renderWorkshopSettings() {
  const cfg = state.config.workshop || {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  setVal('setting-rent-monthly', cfg.monthlyRent);
  setVal('setting-bills-monthly', cfg.monthlyBills);
  setVal('setting-hours-per-printer', cfg.hoursPerPrinterMonthly);
  setVal('setting-electricity-kwh', cfg.electricityKwhPrice);
  setVal('setting-laptop-cost', cfg.laptopPurchasePrice);
  setVal('setting-labor-hourly', cfg.laborHourlyRate);
  setVal('setting-design-hourly', cfg.designHourlyRate);
  setVal('setting-default-margin', cfg.defaultMarginPercent || 50);
  setVal('setting-language-select', state.config.language || 'tr');
  setVal('setting-country-select', state.config.country || 'tr');

  // Firma Kimliği ve Logo Alanları
  const comp = state.config.company || {};
  setVal('setting-company-name', comp.name || '');
  setVal('setting-company-contact', comp.contact || '');
  setVal('setting-company-phone', comp.phone || '');
  setVal('setting-company-email', comp.email || '');
  setVal('setting-company-website', comp.website || '');
  setVal('setting-company-address', comp.address || '');

  renderCompanyLogoPreview(comp.logo);
  updateWorkshopRentStat();
}

function updateWorkshopRentStat() {
  const cfg = state.config.workshop || {};
  const printerCount = (state.config.printers && state.config.printers.length) || 1;
  const totalFleetHours = printerCount * (cfg.hoursPerPrinterMonthly || 200);
  const hourlyRent = ((cfg.monthlyRent || 0) + (cfg.monthlyBills || 0)) / Math.max(1, totalFleetHours);
  const el = document.getElementById('stat-hourly-rent-share');
  if (el) el.innerText = `${hourlyRent.toFixed(2)} TL/saat`;
}

function showSaveIndicator() {
  const badge = document.getElementById('save-status');
  if (!badge) return;
  badge.classList.remove('opacity-0');
  badge.classList.add('opacity-100');
  setTimeout(() => {
    badge.classList.remove('opacity-100');
    badge.classList.add('opacity-90');
  }, 1200);
}

// Dosya Yükleme Eventleri
function setupFileUpload() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-indigo-500', 'bg-indigo-950/30');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-950/30');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500', 'bg-indigo-950/30');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  const btnRemoveFile = document.getElementById('btn-remove-file');
  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', clearLoadedModel);
  }
}

/**
 * Yüklenen Modeli, 3D Sahneyi ve Hesaplama Formlarını Tamamen Sıfırlar
 */
function clearLoadedModel() {
  // 1. Dosya input ve barı sıfırla
  const fileInput = document.getElementById('file-input');
  if (fileInput) fileInput.value = '';

  const fileInfoBar = document.getElementById('file-info-bar');
  if (fileInfoBar) fileInfoBar.classList.add('hidden');

  const fileName = document.getElementById('file-name');
  if (fileName) fileName.innerText = '';

  const fileSize = document.getElementById('file-size');
  if (fileSize) fileSize.innerText = '0 KB';

  const fileBadge = document.getElementById('file-badge');
  if (fileBadge) fileBadge.innerText = 'STL';

  // 2. Panelleri gizle
  const adapterPanel = document.getElementById('adapter-panel-3mf');
  if (adapterPanel) adapterPanel.classList.add('hidden');

  const bedBadge = document.getElementById('bed-fit-badge');
  if (bedBadge) bedBadge.classList.add('hidden');

  const scalePanel = document.getElementById('model-scale-panel');
  if (scalePanel) scalePanel.classList.add('hidden');

  const gcodePanel = document.getElementById('gcode-control-panel');
  if (gcodePanel) gcodePanel.classList.add('hidden');

  // 3. 3D Sahneyi Temizle
  if (currentMesh) {
    scene.remove(currentMesh);
    if (currentMesh.geometry) currentMesh.geometry.dispose();
    if (currentMesh.material) {
      if (Array.isArray(currentMesh.material)) currentMesh.material.forEach(m => m.dispose());
      else currentMesh.material.dispose();
    }
    currentMesh = null;
  }

  if (currentGCodeGroup) {
    scene.remove(currentGCodeGroup);
    currentGCodeGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
    currentGCodeGroup = null;
  }
  activeGCodeLayers = [];

  const placeholder = document.getElementById('viewer-placeholder');
  if (placeholder) placeholder.classList.remove('hidden');

  const canvas = document.getElementById('three-canvas');
  if (canvas) canvas.classList.add('hidden');

  // 4. Model İstatistikleri ve Boyut Girişleri
  const statDims = document.getElementById('stat-dimensions');
  if (statDims) statDims.innerText = '- × - × - mm';

  const statVol = document.getElementById('stat-volume');
  if (statVol) statVol.innerText = '0.00 cm³';

  const statSurf = document.getElementById('stat-surface');
  if (statSurf) statSurf.innerText = '0.00 cm²';

  const inputX = document.getElementById('input-dim-x');
  const inputY = document.getElementById('input-dim-y');
  const inputZ = document.getElementById('input-dim-z');
  const inputPct = document.getElementById('input-scale-percent');
  if (inputX) inputX.value = '0.0';
  if (inputY) inputY.value = '0.0';
  if (inputZ) inputZ.value = '0.0';
  if (inputPct) inputPct.value = '100';

  // 5. Hesaplama Formları
  const weightInput = document.getElementById('calc-weight-grams');
  if (weightInput) weightInput.value = '0.0';

  const solidWeight = document.getElementById('calc-solid-weight');
  if (solidWeight) solidWeight.innerText = '0.0g';

  const shellWeight = document.getElementById('calc-shell-weight');
  if (shellWeight) shellWeight.innerText = '0.0g';

  const infillWeight = document.getElementById('calc-infill-weight');
  if (infillWeight) infillWeight.innerText = '0.0g';

  const timeH = document.getElementById('calc-time-hours');
  const timeM = document.getElementById('calc-time-minutes');
  if (timeH) timeH.value = '0';
  if (timeM) timeM.value = '0';

  const slicerBadge = document.getElementById('slicer-time-detected');
  if (slicerBadge) slicerBadge.classList.add('hidden');

  const multiEnabled = document.getElementById('calc-multicolor-enabled');
  if (multiEnabled) multiEnabled.checked = false;

  const multiDetails = document.getElementById('multicolor-details-container');
  if (multiDetails) multiDetails.classList.add('hidden');

  const swapsInput = document.getElementById('calc-color-swaps');
  if (swapsInput) swapsInput.value = '0';

  // 6. Destek ve Boyama Alanları
  const paintedArea = document.getElementById('stat-painted-area');
  if (paintedArea) paintedArea.innerText = '0.0 cm²';

  const supportWeight = document.getElementById('stat-support-weight');
  if (supportWeight) supportWeight.innerText = '+0.0g';

  const supportStatus = document.getElementById('support-status-badge');
  if (supportStatus) {
    supportStatus.innerText = 'Desteksiz';
    supportStatus.className = 'text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono';
  }

  // 7. State'i Sıfırla
  state.hasLoadedFile = false;
  state.currentModel = {
    name: '',
    sizeBytes: 0,
    extension: '',
    dimensions: { x: 0, y: 0, z: 0 },
    originalDimensions: null,
    orientedBaseDimensions: null,
    originalVolume: 0,
    originalSurfaceArea: 0,
    volumeCm3: 0,
    surfaceAreaCm2: 0,
    rawZip: null,
    isGCode: false,
    gcodeData: null,
    slicerMetadata: null
  };

  // 8. Maliyet ve Teklifleri Yeniden Hesapla
  calculateCosts();
  if (typeof updateQuoteTab === 'function') updateQuoteTab();
  if (typeof renderInternalReportView === 'function') renderInternalReportView();
}

async function handleFileSelected(file) {
  const name = file.name;
  const ext = name.split('.').pop().toLowerCase();

  if (ext !== 'stl' && ext !== '3mf' && ext !== 'gcode') {
    alert('Lütfen geçerli bir .STL, .3MF veya .GCODE dosyası yükleyin.');
    return;
  }

  // Önce önceki modeli temizle
  clearLoadedModel();

  // Bar güncelle
  document.getElementById('file-info-bar').classList.remove('hidden');
  document.getElementById('file-name').innerText = name;
  document.getElementById('file-size').innerText = `${(file.size / 1024).toFixed(1)} KB`;
  document.getElementById('file-badge').innerText = ext.toUpperCase();

  state.currentModel.name = name;
  state.currentModel.sizeBytes = file.size;
  state.currentModel.extension = ext;
  state.hasLoadedFile = true;

  try {
    let parseResult;
    if (ext === 'stl') {
      const arrayBuffer = await file.arrayBuffer();
      parseResult = parseSTL(arrayBuffer);
    } else if (ext === '3mf') {
      const arrayBuffer = await file.arrayBuffer();
      parseResult = await parse3MF(arrayBuffer);
    } else if (ext === 'gcode') {
      const text = await file.text();
      parseResult = parseGCode(text);
    }

    state.currentModel.volumeCm3 = parseResult.volumeCm3;
    state.currentModel.surfaceAreaCm2 = parseResult.surfaceAreaCm2;
    state.currentModel.dimensions = parseResult.dimensions;
    state.currentModel.geometry = parseResult.geometry;

    // UI Güncelle
    const d = parseResult.dimensions;
    document.getElementById('stat-dimensions').innerText = `${d.x.toFixed(1)} × ${d.y.toFixed(1)} × ${d.z.toFixed(1)} mm`;
    document.getElementById('stat-volume').innerText = `${parseResult.volumeCm3.toFixed(2)} cm³`;
    document.getElementById('stat-surface').innerText = `${parseResult.surfaceAreaCm2.toFixed(1)} cm²`;

    // Katı ağırlık (Solid Weight)
    const material = getSelectedMaterial();
    const solidWeight = parseResult.volumeCm3 * (material.density || 1.24);
    document.getElementById('calc-solid-weight').innerText = `${solidWeight.toFixed(1)}g`;

    // Gramaj ataması (Slicer metadata'sı varsa öncelikli, yoksa dolgu ve hacme göre hesapla)
    const infill = parseFloat(document.getElementById('calc-infill').value) || 20;
    const infillFactor = 0.25 + (0.75 * (infill / 100.0));
    const calculatedGrams = parseResult.volumeCm3 * (material.density || 1.24) * infillFactor;

    const slicerBadge = document.getElementById('slicer-time-detected');

    if (parseResult.slicerMetadata && parseResult.slicerMetadata.weightGrams && parseResult.slicerMetadata.weightGrams > 0) {
      document.getElementById('calc-weight-grams').value = parseResult.slicerMetadata.weightGrams.toFixed(1);
    } else {
      document.getElementById('calc-weight-grams').value = calculatedGrams.toFixed(1);
    }

    if (parseResult.slicerMetadata && parseResult.slicerMetadata.printTimeSeconds && parseResult.slicerMetadata.printTimeSeconds > 0) {
      const secs = parseResult.slicerMetadata.printTimeSeconds;
      document.getElementById('calc-time-hours').value = Math.floor(secs / 3600);
      document.getElementById('calc-time-minutes').value = Math.round((secs % 3600) / 60);
      slicerBadge.classList.remove('hidden');
    } else {
      slicerBadge.classList.add('hidden');
      state.currentModel.needsTimeRecalc = true;
      const initialEst = estimateAccuratePrintTime(calculatedGrams, 0, true);
      document.getElementById('calc-time-hours').value = initialEst.hours;
      document.getElementById('calc-time-minutes').value = initialEst.minutes;
    }

    // Çok Renkli Slicer Verisi (G-Code veya 3MF tool changes)
    if (parseResult.slicerMetadata && parseResult.slicerMetadata.toolChanges && parseResult.slicerMetadata.toolChanges > 0) {
      const multiCheck = document.getElementById('calc-multicolor-enabled');
      const swapsInput = document.getElementById('calc-color-swaps');
      const detailsCont = document.getElementById('multicolor-details-container');
      const statusBadge = document.getElementById('multicolor-status-badge');

      if (multiCheck) multiCheck.checked = true;
      if (swapsInput) swapsInput.value = parseResult.slicerMetadata.toolChanges;
      if (detailsCont) detailsCont.classList.remove('hidden');
      if (statusBadge) {
        statusBadge.innerText = `${parseResult.slicerMetadata.uniqueTools || 2} Renk (${parseResult.slicerMetadata.toolChanges} Swap)`;
        statusBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30';
      }
    }

    // 3D Önizleme göster
    if (ext === 'gcode') {
      state.currentModel.isGCode = true;
      state.currentModel.gcodeData = parseResult;
      displayGCodeIn3D(parseResult);
    } else {
      state.currentModel.isGCode = false;
      displayModelIn3D(parseResult.geometry);
      // STL veya 3MF yüklendiğinde ölçekleme panelini göster
      const scalePanel = document.getElementById('model-scale-panel');
      if (scalePanel) scalePanel.classList.remove('hidden');
      const gcodePanel = document.getElementById('gcode-control-panel');
      if (gcodePanel) gcodePanel.classList.add('hidden');
    }

    // Maliyeti baştan hesapla
    calculateCosts();

  } catch (err) {
    console.error('Model ayrıştırma hatası:', err);
    alert(`Dosya okunurken bir hata oluştu: ${err.message}`);
  }
}

// Sekme Geçişleri
function setupTabs() {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(tabId);
      if (activePane) activePane.classList.add('active');

      // Eğer 3D tabına geçildiyse viewport boyutunu yenile
      if (tabId === 'tab-calculator') {
        setTimeout(onViewerResize, 50);
      }

      // Eğer Raporlar sekmesine geçildiyse patron raporunu ve arşiv tablosunu güncelle
      if (tabId === 'tab-reports') {
        renderInternalReportView();
        renderReportsDatabaseTable();
      }

      // Eğer Atölye sekmesine geçildiyse özel kalemler tablosunu tazele
      if (tabId === 'tab-workshop') {
        renderCustomCostItemsTable();
      }
    });
  });

  // Hızlı Teklif Geçiş Butonu
  const btnGoToQuote = document.getElementById('btn-go-to-quote');
  if (btnGoToQuote) {
    btnGoToQuote.addEventListener('click', () => {
      const quoteBtn = document.querySelector('[data-tab="tab-quote"]');
      if (quoteBtn) quoteBtn.click();
    });
  }

  // Hızlı Detaylı Rapor Geçiş Butonu (Patron)
  const btnGoToReport = document.getElementById('btn-go-to-report');
  if (btnGoToReport) {
    btnGoToReport.addEventListener('click', () => {
      const reportBtn = document.querySelector('[data-tab="tab-reports"]');
      if (reportBtn) reportBtn.click();
    });
  }
}

// Event Bağlantıları
function setupEventListeners() {
  // Hesaplayıcı input değişiklikleri
  const calcInputs = [
    'calc-printer-select',
    'calc-material-select',
    'calc-infill',
    'calc-weight-grams',
    'calc-time-hours',
    'calc-time-minutes',
    'calc-quantity',
    'calc-prep-time',
    'calc-design-hours',
    'calc-margin-percent',
    'calc-kdv-check'
  ];

  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (id === 'calc-printer-select') {
          updatePrinterSpecHint();
          updatePrinterBedVisual();
          state.currentModel.needsTimeRecalc = true;
          if (currentMesh && currentMesh.geometry) {
            analyzeGeometryOverhangs(currentMesh.geometry);
          }
          checkBedFit();
        }
        if (id === 'calc-infill') {
          state.currentModel.needsTimeRecalc = true;
          recalculateRealisticWeight();
        }
        if (id === 'calc-material-select') {
          const m = getSelectedMaterial();
          document.getElementById('material-unit-price-label').innerText = `${m.pricePerKg} TL/kg (${m.name})`;
          // Yeniden katı ağırlık göster
          if (state.currentModel.volumeCm3 > 0) {
            document.getElementById('calc-solid-weight').innerText = `${(state.currentModel.volumeCm3 * m.density).toFixed(1)}g`;
          }
        }
        calculateCosts();
      });
      el.addEventListener('change', () => {
        if (id === 'calc-printer-select' || id === 'calc-infill') {
          state.currentModel.needsTimeRecalc = true;
        }
        calculateCosts();
      });
    }
  });

  // Geometriden gerçekçi dilimleyici ağırlık güncelle butonu
  const btnRecalcWeight = document.getElementById('btn-recalc-weight');
  if (btnRecalcWeight) {
    btnRecalcWeight.addEventListener('click', () => {
      state.currentModel.needsTimeRecalc = true;
      if (currentMesh && currentMesh.geometry) {
        analyzeGeometryOverhangs(currentMesh.geometry);
      }
      recalculateRealisticWeight();
      calculateCosts();
    });
  }

  // Duvar Sayısı ve Katman Kalınlığı Değişikliği (Gerçekçi Gramaj & Zaman)
  const wallSelect = document.getElementById('calc-wall-count');
  if (wallSelect) {
    wallSelect.addEventListener('change', () => {
      state.currentModel.wallCount = parseInt(wallSelect.value) || 2;
      state.currentModel.needsTimeRecalc = true;
      recalculateRealisticWeight();
      calculateCosts();
    });
  }

  const layerHeightSelect = document.getElementById('calc-layer-height');
  if (layerHeightSelect) {
    layerHeightSelect.addEventListener('change', () => {
      state.currentModel.needsTimeRecalc = true;
      calculateCosts();
    });
  }

  const supportSelectEl = document.getElementById('calc-support-type');
  if (supportSelectEl) {
    supportSelectEl.addEventListener('change', () => {
      state.currentModel.needsTimeRecalc = true;
      calculateCosts();
    });
  }

  const infillPatternSelect = document.getElementById('calc-infill-pattern');
  if (infillPatternSelect) {
    infillPatternSelect.addEventListener('change', () => {
      state.currentModel.needsTimeRecalc = true;
      recalculateRealisticWeight();
      calculateCosts();
    });
  }

  // ========================================================
  // MODEL BOYUTLANDIRMA VE ÖLÇEKLEME (RESIZE) EVENTLERİ
  // ========================================================
  const inputDimX = document.getElementById('input-dim-x');
  const inputDimY = document.getElementById('input-dim-y');
  const inputDimZ = document.getElementById('input-dim-z');
  const scaleUniformLock = document.getElementById('scale-uniform-lock');
  const scalePctInput = document.getElementById('input-scale-percent');

  // Canlı Eksen Senkronizasyonu (Orantıyı Koru kilitliyken bir eksen değiştikçe diğerleri canlı değişir)
  if (inputDimX) {
    inputDimX.addEventListener('input', () => {
      const isUniform = scaleUniformLock ? scaleUniformLock.checked : true;
      const targetX = parseFloat(inputDimX.value);
      const currentDims = state.currentModel.dimensions;
      if (!isUniform || isNaN(targetX) || targetX <= 0 || !currentDims || currentDims.x <= 0) return;

      const ratio = targetX / currentDims.x;
      if (inputDimY) inputDimY.value = (currentDims.y * ratio).toFixed(1);
      if (inputDimZ) inputDimZ.value = (currentDims.z * ratio).toFixed(1);

      if (scalePctInput && state.currentModel.orientedBaseDimensions && state.currentModel.orientedBaseDimensions.x > 0) {
        scalePctInput.value = Math.round((targetX / state.currentModel.orientedBaseDimensions.x) * 100);
      }
    });
  }

  if (inputDimY) {
    inputDimY.addEventListener('input', () => {
      const isUniform = scaleUniformLock ? scaleUniformLock.checked : true;
      const targetY = parseFloat(inputDimY.value);
      const currentDims = state.currentModel.dimensions;
      if (!isUniform || isNaN(targetY) || targetY <= 0 || !currentDims || currentDims.y <= 0) return;

      const ratio = targetY / currentDims.y;
      if (inputDimX) inputDimX.value = (currentDims.x * ratio).toFixed(1);
      if (inputDimZ) inputDimZ.value = (currentDims.z * ratio).toFixed(1);

      if (scalePctInput && state.currentModel.orientedBaseDimensions && state.currentModel.orientedBaseDimensions.y > 0) {
        scalePctInput.value = Math.round((targetY / state.currentModel.orientedBaseDimensions.y) * 100);
      }
    });
  }

  if (inputDimZ) {
    inputDimZ.addEventListener('input', () => {
      const isUniform = scaleUniformLock ? scaleUniformLock.checked : true;
      const targetZ = parseFloat(inputDimZ.value);
      const currentDims = state.currentModel.dimensions;
      if (!isUniform || isNaN(targetZ) || targetZ <= 0 || !currentDims || currentDims.z <= 0) return;

      const ratio = targetZ / currentDims.z;
      if (inputDimX) inputDimX.value = (currentDims.x * ratio).toFixed(1);
      if (inputDimY) inputDimY.value = (currentDims.y * ratio).toFixed(1);

      if (scalePctInput && state.currentModel.orientedBaseDimensions && state.currentModel.orientedBaseDimensions.z > 0) {
        scalePctInput.value = Math.round((targetZ / state.currentModel.orientedBaseDimensions.z) * 100);
      }
    });
  }

  if (scalePctInput) {
    scalePctInput.addEventListener('input', () => {
      const pct = parseFloat(scalePctInput.value);
      const base = state.currentModel.orientedBaseDimensions || state.currentModel.dimensions;
      if (isNaN(pct) || pct <= 0 || !base || base.x <= 0) return;

      const scale = pct / 100.0;
      if (inputDimX) inputDimX.value = (base.x * scale).toFixed(1);
      if (inputDimY) inputDimY.value = (base.y * scale).toFixed(1);
      if (inputDimZ) inputDimZ.value = (base.z * scale).toFixed(1);
    });

    scalePctInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        scaleModelByPercent(parseFloat(scalePctInput.value) || 100);
      }
    });
    scalePctInput.addEventListener('change', () => {
      scaleModelByPercent(parseFloat(scalePctInput.value) || 100);
    });
  }

  const btnApplyDims = document.getElementById('btn-apply-dimensions');
  if (btnApplyDims) {
    btnApplyDims.addEventListener('click', () => {
      const tx = parseFloat(inputDimX ? inputDimX.value : 0) || (state.currentModel.dimensions.x || 10);
      const ty = parseFloat(inputDimY ? inputDimY.value : 0) || (state.currentModel.dimensions.y || 10);
      const tz = parseFloat(inputDimZ ? inputDimZ.value : 0) || (state.currentModel.dimensions.z || 10);
      const isUniform = scaleUniformLock ? scaleUniformLock.checked : true;
      applyModelDimensions(tx, ty, tz, isUniform);
    });
  }

  const btnResetDims = document.getElementById('btn-reset-dimensions');
  if (btnResetDims) {
    btnResetDims.addEventListener('click', resetModelDimensions);
  }

  // Input Enter ve Change Tuşları
  [inputDimX, inputDimY, inputDimZ].forEach(inp => {
    if (inp) {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (btnApplyDims) btnApplyDims.click();
        }
      });
      inp.addEventListener('change', () => {
        if (btnApplyDims) btnApplyDims.click();
      });
    }
  });

  // Hızlı Ölçek Butonları (%50, %75, %100, %125, %150, %200)
  document.querySelectorAll('.btn-quick-scale').forEach(btn => {
    btn.addEventListener('click', () => {
      const pct = parseFloat(btn.getAttribute('data-pct')) || 100;
      scaleModelByPercent(pct);
    });
  });

  // 3D Kontrolleri & Model Yönlendirme (Orientation)
  const btnWireframe = document.getElementById('btn-toggle-wireframe');
  if (btnWireframe) {
    btnWireframe.addEventListener('click', () => {
      if (currentMesh) {
        currentMesh.material.wireframe = !currentMesh.material.wireframe;
      }
    });
  }

  const btnResetCam = document.getElementById('btn-reset-camera');
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      if (currentMesh) displayModelIn3D(state.currentModel.geometry);
    });
  }

  // Model Döndürme & Yönlendirme Butonları
  const btnRotX = document.getElementById('btn-rot-x');
  if (btnRotX) btnRotX.addEventListener('click', () => rotateModel('x', 90));

  const btnRotY = document.getElementById('btn-rot-y');
  if (btnRotY) btnRotY.addEventListener('click', () => rotateModel('y', 90));

  const btnRotZ = document.getElementById('btn-rot-z');
  if (btnRotZ) btnRotZ.addEventListener('click', () => rotateModel('z', 90));

  const btnLayFlat = document.getElementById('btn-lay-flat');
  if (btnLayFlat) btnLayFlat.addEventListener('click', snapModelToBed);

  const btnRecenter = document.getElementById('btn-recenter');
  if (btnRecenter) btnRecenter.addEventListener('click', centerModel);

  // Araç Sekmeleri (Destek Boyama vs Çok Renkli Boyama)
  const tabSupport = document.getElementById('tab-tool-support');
  const tabColor = document.getElementById('tab-tool-color');
  const panelSupport = document.getElementById('panel-support-tools');
  const panelColor = document.getElementById('panel-color-tools');
  const toolHint = document.getElementById('active-tool-hint');

  if (tabSupport && tabColor) {
    tabSupport.addEventListener('click', () => {
      state.currentToolTab = 'support';
      tabSupport.className = 'px-2.5 py-1 rounded font-semibold transition-colors bg-indigo-600 text-white';
      tabColor.className = 'px-2.5 py-1 rounded font-semibold transition-colors text-slate-400 hover:text-white flex items-center gap-1';
      if (panelSupport) panelSupport.classList.remove('hidden');
      if (panelColor) panelColor.classList.add('hidden');
      if (toolHint) toolHint.innerText = 'Destek Modu';
      updateBrushOrbitControls();
    });

    tabColor.addEventListener('click', () => {
      state.currentToolTab = 'color';
      tabColor.className = 'px-2.5 py-1 rounded font-semibold transition-colors bg-indigo-600 text-white flex items-center gap-1';
      tabSupport.className = 'px-2.5 py-1 rounded font-semibold transition-colors text-slate-400 hover:text-white';
      if (panelColor) panelColor.classList.remove('hidden');
      if (panelSupport) panelSupport.classList.add('hidden');
      if (toolHint) toolHint.innerText = 'Çok Renkli Boyama';
      updateBrushOrbitControls();
    });
  }

  // Çok Renkli Boyama: İncele / 3D Döndür Modu Butonu
  const btnColorView = document.getElementById('tool-mode-color-view');
  const btnColorPaint = document.getElementById('tool-mode-color-paint');

  if (btnColorView && btnColorPaint) {
    btnColorView.addEventListener('click', () => {
      state.colorPaint.active = false;
      btnColorView.classList.add('active');
      btnColorPaint.classList.remove('active');
      if (toolHint) toolHint.innerText = 'İnceleme & Döndürme Modu';
      updateBrushOrbitControls();
    });

    btnColorPaint.addEventListener('click', () => {
      state.colorPaint.active = true;
      btnColorPaint.classList.add('active');
      btnColorView.classList.remove('active');
      if (toolHint) toolHint.innerText = 'Fırça Aktif (Sağ tıkla çevirin, sol tıkla boyayın)';
      updateBrushOrbitControls();
    });
  }

  // Renk Fırçası Boyut Slider'ı
  const colorBrushSlider = document.getElementById('color-brush-size-slider');
  if (colorBrushSlider) {
    colorBrushSlider.addEventListener('input', (e) => {
      state.colorPaint.brushSizeMm = parseFloat(e.target.value) || 10;
      const lbl = document.getElementById('color-brush-size-label');
      if (lbl) lbl.innerText = `${e.target.value}mm`;
    });
  }

  // Renk Swatch Butonları
  document.querySelectorAll('.color-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.colorPaint.currentColorHex = btn.dataset.color;
      // Otomatik fırçayı aktifleştir
      state.colorPaint.active = true;
      if (btnColorPaint) btnColorPaint.classList.add('active');
      if (controls) controls.enabled = false;
    });
  });

  const customColorPicker = document.getElementById('custom-color-picker');
  if (customColorPicker) {
    customColorPicker.addEventListener('input', (e) => {
      state.colorPaint.currentColorHex = e.target.value;
      state.colorPaint.active = true;
      if (btnColorPaint) btnColorPaint.classList.add('active');
      if (controls) controls.enabled = false;
    });
  }

  const btnResetColors = document.getElementById('btn-reset-model-colors');
  if (btnResetColors) {
    btnResetColors.addEventListener('click', resetModelColors);
  }

  // Çok Renkli Baskı Parametreleri Eventleri
  const multiCheck = document.getElementById('calc-multicolor-enabled');
  const detailsCont = document.getElementById('multicolor-details-container');
  const statusBadge = document.getElementById('multicolor-status-badge');

  if (multiCheck) {
    multiCheck.addEventListener('change', () => {
      if (multiCheck.checked) {
        if (detailsCont) detailsCont.classList.remove('hidden');
        if (statusBadge) {
          statusBadge.innerText = 'Çok Renkli';
          statusBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30';
        }
      } else {
        if (detailsCont) detailsCont.classList.add('hidden');
        if (statusBadge) {
          statusBadge.innerText = 'Tek Renk';
          statusBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono';
        }
      }
      calculateCosts();
    });
  }

  const colorSwapsInput = document.getElementById('calc-color-swaps');
  if (colorSwapsInput) {
    colorSwapsInput.addEventListener('input', calculateCosts);
    colorSwapsInput.addEventListener('change', calculateCosts);
  }

  const purgePerSwapInput = document.getElementById('calc-purge-per-swap');
  if (purgePerSwapInput) {
    purgePerSwapInput.addEventListener('input', calculateCosts);
    purgePerSwapInput.addEventListener('change', calculateCosts);
  }

  // Malzeme Ülke Seçimi Butonları
  const btnMatTr = document.getElementById('mat-country-tr');
  const btnMatGlobal = document.getElementById('mat-country-global');

  if (btnMatTr && btnMatGlobal) {
    btnMatTr.addEventListener('click', () => {
      state.config.country = 'tr';
      btnMatTr.className = 'px-2 py-0.5 rounded font-bold transition-colors bg-indigo-600 text-white';
      btnMatGlobal.className = 'px-2 py-0.5 rounded font-bold transition-colors text-slate-400 hover:text-white';
      renderMaterialsSelect('tr');
      calculateCosts();
    });

    btnMatGlobal.addEventListener('click', () => {
      state.config.country = 'global';
      btnMatGlobal.className = 'px-2 py-0.5 rounded font-bold transition-colors bg-indigo-600 text-white';
      btnMatTr.className = 'px-2 py-0.5 rounded font-bold transition-colors text-slate-400 hover:text-white';
      renderMaterialsSelect('global');
      calculateCosts();
    });
  }

  // Hazır Yazıcı Kataloğu Modalı Eventleri
  const btnOpenCatalog = document.getElementById('btn-open-catalog');
  const modalCatalog = document.getElementById('modal-printer-catalog');
  const btnCloseCatalogModal = document.getElementById('btn-close-catalog-modal');
  const btnCloseCatalogBottom = document.getElementById('btn-close-catalog-bottom');

  if (btnOpenCatalog && modalCatalog) {
    btnOpenCatalog.addEventListener('click', () => {
      modalCatalog.classList.remove('hidden');
      renderCatalogModal();
    });

    const closeModal = () => modalCatalog.classList.add('hidden');
    if (btnCloseCatalogModal) btnCloseCatalogModal.addEventListener('click', closeModal);
    if (btnCloseCatalogBottom) btnCloseCatalogBottom.addEventListener('click', closeModal);

    // Dışına tıklayınca kapat
    modalCatalog.addEventListener('click', (e) => {
      if (e.target === modalCatalog) closeModal();
    });

    // Filtreleme listener'ları
    const searchInput = document.getElementById('catalog-search');
    const brandFilter = document.getElementById('catalog-brand-filter');
    const typeFilter = document.getElementById('catalog-type-filter');

    if (searchInput) searchInput.addEventListener('input', renderCatalogModal);
    if (brandFilter) brandFilter.addEventListener('change', renderCatalogModal);
    if (typeFilter) typeFilter.addEventListener('change', renderCatalogModal);
  }

  // Dil Değiştirici Butonları
  const langBtnTr = document.getElementById('lang-btn-tr');
  const langBtnEn = document.getElementById('lang-btn-en');
  if (langBtnTr) langBtnTr.addEventListener('click', () => setLanguage('tr'));
  if (langBtnEn) langBtnEn.addEventListener('click', () => setLanguage('en'));

  const settingLangSelect = document.getElementById('setting-language-select');
  if (settingLangSelect) {
    settingLangSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  const settingCountrySelect = document.getElementById('setting-country-select');
  if (settingCountrySelect) {
    settingCountrySelect.addEventListener('change', (e) => {
      state.config.country = e.target.value;
      if (e.target.value === 'tr') {
        if (btnMatTr) btnMatTr.click();
      } else {
        if (btnMatGlobal) btnMatGlobal.click();
      }
    });
  }

  // 3MF Cihaz Uyarlayıcı Fonksiyonları
  window.populateAdapterTargetPrinters = function() {
    const select = document.getElementById('adapter-target-printer');
    if (!select) return;
    select.innerHTML = '';

    state.config.printers.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.innerText = `${p.name} (${p.bedX}×${p.bedY}×${p.bedZ}mm • ${p.type.toUpperCase()})`;
      select.appendChild(opt);
    });
  };

  async function exportAdapted3MF() {
    if (!state.currentModel.rawZip) {
      alert('Uyarlanacak aktif bir 3MF dosyası bulunamadı.');
      return;
    }

    const targetSelect = document.getElementById('adapter-target-printer');
    const firstPrinter = (state.config.printers && state.config.printers.length > 0) ? state.config.printers[0] : getSelectedPrinter();
    const targetId = targetSelect && targetSelect.value ? targetSelect.value : (firstPrinter ? firstPrinter.id : '');
    const targetPrinter = (state.config.printers && state.config.printers.find(p => p.id === targetId)) || firstPrinter;

    const applyFilenta = document.getElementById('adapter-apply-filenta').checked;
    const recenterBed = document.getElementById('adapter-recenter-bed').checked;

    try {
      const zip = state.currentModel.rawZip;

      // 1. Yeni uyarlanmış makine ayarları metadata'sı hazırla
      const adaptedConfig = 
        `; Uyarlanmış 3MF Yapılandırması (3D Maliyet & Teklif Robotu)\n` +
        `; Hedef Makine: ${targetPrinter.name}\n` +
        `printer_model = ${targetPrinter.name}\n` +
        `printer_settings_id = ${targetPrinter.name}\n` +
        `bed_custom_shape = 0x0,${targetPrinter.bedX}x0,${targetPrinter.bedX}x${targetPrinter.bedY},0x${targetPrinter.bedY}\n` +
        `printable_area = 0x0,${targetPrinter.bedX}x0,${targetPrinter.bedX}x${targetPrinter.bedY},0x${targetPrinter.bedY}\n` +
        `printable_height = ${targetPrinter.bedZ}\n` +
        (applyFilenta ? 
          `filament_type = PLA\nfilament_vendor = Filenta\nnozzle_temperature = 215\nnozzle_temperature_initial_layer = 220\nbed_temperature = 60\nbed_temperature_initial_layer = 60\n` : '') +
        `adapted_at = ${new Date().toISOString()}\n`;

      // Metadata klasörüne ekle/güncelle
      zip.file('Metadata/adapted_printer.config', adaptedConfig);

      // Varsa model_settings.config ve slice_info.config güncelle
      for (const [filename, file] of Object.entries(zip.files)) {
        if (filename.includes('slice_info.config') || filename.includes('model_settings.config') || filename.includes('project_settings')) {
          let content = await file.async('string');
          content = content.replace(/printer_model\s*=\s*[^\r\n]+/gi, `printer_model = ${targetPrinter.name}`);
          content = content.replace(/printer_settings_id\s*=\s*[^\r\n]+/gi, `printer_settings_id = ${targetPrinter.name}`);
          if (applyFilenta) {
            content = content.replace(/nozzle_temperature\s*=\s*\d+/gi, `nozzle_temperature = 215`);
            content = content.replace(/bed_temperature\s*=\s*\d+/gi, `bed_temperature = 60`);
          }
          zip.file(filename, content);
        }
      }

      // 2. Yeni Blob oluştur ve indir
      const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' });
      const url = URL.createObjectURL(blob);
      const safeModelName = (state.currentModel.name || 'model').replace(/\.3mf$/i, '');
      const safePrinterName = targetPrinter.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const downloadName = `${safeModelName}_uyarlanmis_${safePrinterName}.3mf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`✓ 3MF dosyası başarıyla "${targetPrinter.name}" ve Filenta PLA parametrelerine uyarlandı ve indirildi:\n\n${downloadName}`);

    } catch (err) {
      console.error('3MF uyarlama hatası:', err);
      alert(`3MF dosyası uyarlanırken bir hata oluştu: ${err.message}`);
    }
  }

  // Destek Boyama Araç Çubuğu Buton Durumları
  function setToolMode(mode) {
    state.support.toolMode = mode;
    ['tool-mode-view', 'tool-mode-enforce', 'tool-mode-block', 'tool-mode-eraser'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.classList.remove('active');
    });

    const activeBtn = document.getElementById(`tool-mode-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (controls) {
      controls.enabled = (mode === 'view');
    }
  }

  // Destek Butonları Eventleri
  const toolView = document.getElementById('tool-mode-view');
  if (toolView) toolView.addEventListener('click', () => setToolMode('view'));

  const toolEnforce = document.getElementById('tool-mode-enforce');
  if (toolEnforce) toolEnforce.addEventListener('click', () => setToolMode('enforce'));

  const toolBlock = document.getElementById('tool-mode-block');
  if (toolBlock) toolBlock.addEventListener('click', () => setToolMode('block'));

  const toolEraser = document.getElementById('tool-mode-eraser');
  if (toolEraser) toolEraser.addEventListener('click', () => setToolMode('eraser'));

  const brushSlider = document.getElementById('brush-size-slider');
  if (brushSlider) {
    brushSlider.addEventListener('input', (e) => {
      state.support.brushSizeMm = parseFloat(e.target.value) || 10;
      document.getElementById('brush-size-label').innerText = `${e.target.value}mm`;
    });
  }

  const btnAutoOverhang = document.getElementById('btn-auto-overhang');
  if (btnAutoOverhang) btnAutoOverhang.addEventListener('click', autoDetectOverhangs);

  const btnClearPaint = document.getElementById('btn-clear-paint');
  if (btnClearPaint) btnClearPaint.addEventListener('click', clearSupportPainting);

  // Destek Türü Seçimi
  const supportSelect = document.getElementById('calc-support-type');
  if (supportSelect) {
    supportSelect.addEventListener('change', calculateCosts);
  }

  // 3MF Uyarlama Butonu
  const btnExportAdapted = document.getElementById('btn-export-adapted-3mf');
  if (btnExportAdapted) {
    btnExportAdapted.addEventListener('click', exportAdapted3MF);
  }

  // Atölye Giderleri Kaydet Butonu
  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      state.config.workshop.monthlyRent = parseFloat(document.getElementById('setting-rent-monthly').value) || 0;
      state.config.workshop.monthlyBills = parseFloat(document.getElementById('setting-bills-monthly').value) || 0;
      state.config.workshop.hoursPerPrinterMonthly = parseFloat(document.getElementById('setting-hours-per-printer').value) || 200;
      state.config.workshop.electricityKwhPrice = parseFloat(document.getElementById('setting-electricity-kwh').value) || 3.20;
      state.config.workshop.laptopPurchasePrice = parseFloat(document.getElementById('setting-laptop-cost').value) || 35000;
      state.config.workshop.laborHourlyRate = parseFloat(document.getElementById('setting-labor-hourly').value) || 150;
      state.config.workshop.designHourlyRate = parseFloat(document.getElementById('setting-design-hourly').value) || 350;

      // Kâr marjı, dil ve ülke ayarları
      const defMargin = parseFloat(document.getElementById('setting-default-margin').value) || 50;
      state.config.workshop.defaultMarginPercent = defMargin;
      document.getElementById('calc-margin-percent').value = defMargin;

      const chosenLang = document.getElementById('setting-language-select').value || 'tr';
      state.config.language = chosenLang;

      const chosenCountry = document.getElementById('setting-country-select').value || 'tr';
      state.config.country = chosenCountry;

      // Firma ve Atölye Kimliği Bilgileri
      state.config.company = state.config.company || {};
      state.config.company.name = (document.getElementById('setting-company-name').value || '').trim() || '3D Baskı ve Prototip Atölyesi';
      state.config.company.contact = (document.getElementById('setting-company-contact').value || '').trim();
      state.config.company.phone = (document.getElementById('setting-company-phone').value || '').trim();
      state.config.company.email = (document.getElementById('setting-company-email').value || '').trim();
      state.config.company.website = (document.getElementById('setting-company-website').value || '').trim();
      state.config.company.address = (document.getElementById('setting-company-address').value || '').trim();

      state.saveConfig();
      updateWorkshopRentStat();
      updateQuoteUI();
      setLanguage(chosenLang);
      renderMaterialsSelect(chosenCountry);
      calculateCosts();
      alert('Atölye gider, kâr marjı ve tercih ayarları başarıyla kaydedildi.');
    });
  }

  // Yalnızca Firma Bilgilerini ve Logoyu Kaydet Butonu
  const btnSaveCompanyOnly = document.getElementById('btn-save-company-only');
  if (btnSaveCompanyOnly) {
    btnSaveCompanyOnly.addEventListener('click', () => {
      state.config.company = state.config.company || {};
      state.config.company.name = (document.getElementById('setting-company-name').value || '').trim() || '3D Baskı ve Prototip Atölyesi';
      state.config.company.contact = (document.getElementById('setting-company-contact').value || '').trim();
      state.config.company.phone = (document.getElementById('setting-company-phone').value || '').trim();
      state.config.company.email = (document.getElementById('setting-company-email').value || '').trim();
      state.config.company.website = (document.getElementById('setting-company-website').value || '').trim();
      state.config.company.address = (document.getElementById('setting-company-address').value || '').trim();
      state.saveConfig();
      updateQuoteUI();
      const statEl = document.getElementById('company-save-status');
      if (statEl) {
        statEl.classList.remove('hidden');
        setTimeout(() => statEl.classList.add('hidden'), 3500);
      }
    });
  }

  // Teklif Sekmesinden Firma & Logo Düzenleme Kısayolu
  const btnGotoComp = document.getElementById('btn-goto-company-settings');
  if (btnGotoComp) {
    btnGotoComp.addEventListener('click', () => {
      const tabBtn = document.querySelector('[data-tab="tab-workshop"]');
      if (tabBtn) tabBtn.click();
      setTimeout(() => {
        const titleEl = document.getElementById('txt-company-profile-title');
        if (titleEl) titleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  // Boş Teklif Ekranından Model Yüklemeye Git Butonu
  const btnGotoUpload = document.getElementById('btn-goto-upload');
  if (btnGotoUpload) {
    btnGotoUpload.addEventListener('click', () => {
      const tabBtn = document.querySelector('[data-tab="tab-calculator"]');
      if (tabBtn) tabBtn.click();
      const dropZone = document.getElementById('drop-zone');
      if (dropZone) dropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Müşteri Bilgileri Canlı Form Girişleri
  const bindCustInput = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        state.customerInfo = state.customerInfo || {};
        state.customerInfo[key] = e.target.value;
        state.saveCustomerInfo();
        updateQuoteUI();
      });
    }
  };

  bindCustInput('quote-input-customer-name', 'name');
  bindCustInput('quote-input-customer-phone', 'phone');
  bindCustInput('quote-input-customer-email', 'email');
  bindCustInput('quote-input-number', 'quoteNo');
  bindCustInput('quote-input-validity', 'validityDays');
  bindCustInput('quote-input-notes', 'notes');

  // Firma Logosu Yükleme Event'i
  const logoFileInput = document.getElementById('setting-company-logo-file');
  if (logoFileInput) {
    logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, SVG).');
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        alert('Logo boyutu 3 MB\'tan küçük olmalıdır.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target.result;
        state.config.company = state.config.company || {};
        state.config.company.logo = dataUrl;
        state.saveConfig();
        renderCompanyLogoPreview(dataUrl);
        updateQuoteUI();
      };
      reader.readAsDataURL(file);
    });
  }

  // Firma Logosu Kaldırma Butonu
  const btnRemoveLogo = document.getElementById('btn-remove-company-logo');
  if (btnRemoveLogo) {
    btnRemoveLogo.addEventListener('click', () => {
      if (confirm('Firma logosunu kaldırmak istediğinize emin misiniz?')) {
        state.config.company = state.config.company || {};
        state.config.company.logo = '';
        state.saveConfig();
        renderCompanyLogoPreview('');
        updateQuoteUI();
        if (logoFileInput) logoFileInput.value = '';
      }
    });
  }

  // Fabrika Ayarlarına Sıfırla
  const btnResetDefaults = document.getElementById('btn-reset-defaults');
  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      if (confirm('Tüm yazıcı ve atölye ayarlarını varsayılan ayarlara sıfırlamak istiyor musunuz?')) {
        state.resetConfig();
        renderPrintersSelect();
        renderFleetList();
        renderWorkshopSettings();
        renderMaterialsSelect('tr');
        setLanguage('tr');
        const mInput = document.getElementById('calc-margin-percent');
        if (mInput) mInput.value = 50;
        calculateCosts();
        alert('Tüm ayarlar fabrika ayarlarına döndürüldü.');
      }
    });
  }

  // Yeni Yazıcı Ekle Butonu
  const btnAddPrinter = document.getElementById('btn-add-printer');
  if (btnAddPrinter) {
    btnAddPrinter.addEventListener('click', () => {
      const name = prompt('Yeni Yazıcı Model Adı:', 'FlashForge AD5X (#5)');
      if (!name) return;
      const type = confirm('Bu yazıcı SLA (Reçine) yazıcı mı?\n\n(Tamam = SLA, İptal = FDM)') ? 'sla' : 'fdm';
      const bedX = parseFloat(prompt('Tabla X Genişliği (mm):', type === 'sla' ? '218' : '220')) || 220;
      const bedY = parseFloat(prompt('Tabla Y Derinliği (mm):', type === 'sla' ? '122' : '220')) || 220;
      const bedZ = parseFloat(prompt('Tabla Z Yüksekliği (mm):', '220')) || 220;
      const power = parseFloat(prompt('Ortalama Güç Tüketimi (Watt):', type === 'sla' ? '100' : '200')) || 200;
      const price = parseFloat(prompt('Satın Alma Fiyatı (TL):', '18000')) || 18000;

      const newPrinter = {
        id: `printer_${Date.now()}`,
        name: name,
        type: type,
        bedX: bedX,
        bedY: bedY,
        bedZ: bedZ,
        powerWatts: power,
        purchasePrice: price,
        lifespanHours: type === 'sla' ? 2500 : 4000,
        wearPerHour: type === 'sla' ? 3.5 : 1.8,
        status: 'active'
      };

      state.config.printers.push(newPrinter);
      state.saveConfig();
      renderFleetList();
      renderPrintersSelect();
      calculateCosts();
    });
  }

  // ========================================================
  // ŞİRKET İÇİ DETAYLI MALİYET RAPORLARI & ARŞİV EVENTLERİ
  // ========================================================
  const btnSaveReport = document.getElementById('btn-save-current-report');
  if (btnSaveReport) {
    btnSaveReport.addEventListener('click', saveCurrentReportToDatabase);
  }

  const btnExportJson = document.getElementById('btn-export-reports-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', exportReportsJSON);
  }

  const btnExportCsv = document.getElementById('btn-export-reports-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportReportsCSV);
  }

  const btnClearDb = document.getElementById('btn-clear-reports-db');
  if (btnClearDb) {
    btnClearDb.addEventListener('click', clearReportsDatabase);
  }

  const dbSearchInput = document.getElementById('db-search-input');
  if (dbSearchInput) {
    dbSearchInput.addEventListener('input', (e) => {
      renderReportsDatabaseTable(e.target.value);
    });
  }

  const btnPrintInternal = document.getElementById('btn-print-internal-report');
  if (btnPrintInternal) {
    btnPrintInternal.addEventListener('click', () => {
      window.print();
    });
  }

  // ========================================================
  // ÖZEL MALİYET & GİDER KALEMLERİ YÖNETİMİ EVENTLERİ
  // ========================================================
  const btnOpenAddCost = document.getElementById('btn-open-add-cost-item');
  if (btnOpenAddCost) {
    btnOpenAddCost.addEventListener('click', () => openCostItemModal());
  }

  const btnCloseCostModal = document.getElementById('btn-close-cost-item-modal');
  if (btnCloseCostModal) {
    btnCloseCostModal.addEventListener('click', closeCostItemModal);
  }

  const btnCancelCost = document.getElementById('btn-cancel-cost-item');
  if (btnCancelCost) {
    btnCancelCost.addEventListener('click', closeCostItemModal);
  }

  const btnSaveCost = document.getElementById('btn-save-cost-item');
  if (btnSaveCost) {
    btnSaveCost.addEventListener('click', saveCostItemFromModal);
  }

  const btnQuickManageCosts = document.getElementById('btn-quick-manage-costs');
  if (btnQuickManageCosts) {
    btnQuickManageCosts.addEventListener('click', () => {
      const workshopTab = document.querySelector('[data-tab="tab-workshop"]');
      if (workshopTab) {
        workshopTab.click();
        const tableEl = document.getElementById('custom-cost-items-table-body');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Hesaplama Türü değiştikçe modal birimini güncelle
  const costTypeSelect = document.getElementById('input-cost-type');
  const unitLabel = document.getElementById('input-cost-unit-label');
  if (costTypeSelect && unitLabel) {
    costTypeSelect.addEventListener('change', () => {
      if (costTypeSelect.value === 'percentage') {
        unitLabel.innerText = '%';
      } else if (costTypeSelect.value === 'per_gram') {
        unitLabel.innerText = 'TL/g';
      } else if (costTypeSelect.value === 'hourly') {
        unitLabel.innerText = 'TL/sa';
      } else if (costTypeSelect.value === 'per_piece') {
        unitLabel.innerText = 'TL/adet';
      } else {
        unitLabel.innerText = 'TL';
      }
    });
  }

  // Teklif Yazdırma (PDF)
  const btnPrintQuote = document.getElementById('btn-print-quote');
  if (btnPrintQuote) {
    btnPrintQuote.addEventListener('click', () => {
      window.print();
    });
  }

  // Teklif Metnini Kopyalama (WhatsApp)
  const btnCopyQuote = document.getElementById('btn-copy-quote');
  if (btnCopyQuote) {
    btnCopyQuote.addEventListener('click', () => {
      const c = state.calculation.costs;
      const p = getSelectedPrinter();
      const m = getSelectedMaterial();
      const model = state.currentModel.name || 'Prototip Model';

      const supportSelect = document.getElementById('calc-support-type');
      const supportType = supportSelect ? supportSelect.value : 'auto_tree';
      let supportText = '';
      if (state.support.supportWeightGrams > 0) {
        supportText = `🧱 Destek: ${supportType === 'auto_tree' ? 'Ağaç Destek' : (supportType === 'auto_snug' ? 'Izgara Destek' : 'Özel Destek')} (+${state.support.supportWeightGrams.toFixed(1)}g)\n`;
      }

      const text = `*3D BASKI ÜRETİM TEKLİFİ*\n` +
        `📅 Tarih: ${new Date().toLocaleDateString('tr-TR')}\n` +
        `📦 Model: ${model}\n` +
        `⚙️ Makine: ${p.name}\n` +
        `🧵 Malzeme: ${m.name}\n` +
        supportText +
        `⏱️ Tahmini Süre: ${c.totalPrintHours.toFixed(1)} Saat\n` +
        `🔢 Miktar: ${c.quantity} Adet\n` +
        `----------------------------\n` +
        `💰 Birim Fiyat: ${c.finalUnitPrice.toFixed(2)} TL\n` +
        `💵 TOPLAM TUTAR: ${c.finalTotalPrice.toFixed(2)} TL\n` +
        `----------------------------\n` +
        `*Teklifimiz 7 gün boyunca geçerlidir.`;

      navigator.clipboard.writeText(text).then(() => {
        alert('Teklif metni panoya kopyalandı! WhatsApp veya e-posta ile yapıştırıp gönderebilirsiniz.');
      });
    });
  }
}

// ========================================================
// 7. BAŞLATICI (INITIALIZATION)
// ========================================================
async function checkAndApplyInitialConfig() {
  try {
    const res = await fetch('initial_config.json?v=' + Date.now());
    if (!res.ok) return;
    const initCfg = await res.json();
    if (!initCfg) return;

    const appliedKey = '3d_cost_setup_applied_stamp';
    const lastStamp = localStorage.getItem(appliedKey);
    const thisStamp = initCfg._timestamp || 'v1';

    if (!lastStamp || lastStamp !== thisStamp) {
      console.log('Kurulum sihirbazı yapılandırması bulundu, içe aktarılıyor...', initCfg);

      if (initCfg.company) {
        state.config.company = Object.assign({}, state.config.company || {}, initCfg.company);
      }
      if (initCfg.language) {
        state.config.language = initCfg.language;
      }
      if (initCfg.country) {
        state.config.country = initCfg.country;
      }
      if (initCfg.workshop) {
        state.config.workshop = Object.assign({}, state.config.workshop || {}, initCfg.workshop);
      }
      if (initCfg.printers && Array.isArray(initCfg.printers)) {
        state.config.printers = initCfg.printers;
      }

      state.saveConfig();
      localStorage.setItem(appliedKey, thisStamp);

      // Arayüzü güncelle
      renderPrintersSelect();
      renderFleetList();
      renderWorkshopSettings();
      renderMaterialsSelect(state.config.country || 'tr');
      setLanguage(state.config.language || 'tr');
      const marginInput = document.getElementById('calc-margin-percent');
      if (marginInput && state.config.workshop) {
        marginInput.value = state.config.workshop.defaultMarginPercent || 50;
      }
      calculateCosts();
      updateQuoteUI();
    }
  } catch (e) {
    // initial_config yoksa normal çalışmaya devam et
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`[3D Cost Calc] Başlatma adımı hatası (${name}):`, err);
    }
  };

  safeRun('initThreeViewer', initThreeViewer);
  safeRun('setupTabs', setupTabs);
  safeRun('setupFileUpload', setupFileUpload);
  safeRun('renderPrintersSelect', renderPrintersSelect);
  safeRun('renderFleetList', renderFleetList);
  safeRun('renderWorkshopSettings', renderWorkshopSettings);
  safeRun('renderCustomCostItemsTable', renderCustomCostItemsTable);
  safeRun('renderActiveCustomCostItemsInCalc', renderActiveCustomCostItemsInCalc);
  safeRun('renderReportsDatabaseTable', renderReportsDatabaseTable);
  safeRun('setupEventListeners', setupEventListeners);

  // Ülke, Dil ve Kâr Marjı Başlatıcıları
  safeRun('initialSettings', () => {
    const initialCountry = state.config.country || 'tr';
    const initialLang = state.config.language || 'tr';
    const initialMargin = (state.config.workshop && state.config.workshop.defaultMarginPercent) || 50;

    renderMaterialsSelect(initialCountry);
    setLanguage(initialLang);

    const marginInput = document.getElementById('calc-margin-percent');
    if (marginInput) marginInput.value = initialMargin;
  });

  // İlk maliyet hesabı ve patron raporu
  safeRun('calculateCosts', calculateCosts);
  safeRun('renderInternalReportView', renderInternalReportView);

  // Kurulum sihirbazından gelen ilk yapılandırmayı kontrol et
  safeRun('checkAndApplyInitialConfig', () => {
    checkAndApplyInitialConfig();
  });
});
