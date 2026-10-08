import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const company = seed.company;
const vendor = seed.vendors.bahan;
const vendorKemasan = seed.vendors.kemasan;
const kopi = seed.products.kopi;
const teh = seed.products.teh;
const dus = seed.products.dus;
const po = seed.po;

/**
 * Deep Dive — Quality
 * Control Points, Quality Checks, Alerts, Teams; gate pada Receipt & MO.
 * Odoo 19 Enterprise: quality.point → quality.check → Pass/Fail/Measure + Quality Alert.
 */
export const qualityDeepDive: DeepDiveModule = {
  slug: "quality",
  name: "Quality — Control Points & Checks",
  shortTitle: "Quality",
  icon: "BadgeCheck",
  category: "quality-ops",
  wave: 3,
  availability: "available",
  apps: ["Quality", "Inventory", "Manufacturing", "Purchase"],
  overview: {
    function:
      "Modul Quality mendefinisikan Control Points (kapan & apa yang dicek) lalu mengeksekusi Quality Checks pada receipt, transfer internal, delivery, atau manufacturing order. Di Odoo 19 Enterprise, model quality.point memicu quality.check yang harus diisi Pass/Fail atau nilai Measure sebelum operasi stok/produksi dilanjutkan; Fail dapat menghasilkan Quality Alert untuk investigasi CAPA sederhana.",
    businessProblem:
      "Tanpa QC terstruktur, barang cacat masuk gudang atau produksi, recall sulit ditelusuri ke lot/vendor, dan performa pemasok/proses buruk tidak terukur. Operator mengandalkan ingatan, bukan gate sistem.",
    typicalUsers: [
      "Quality Inspector / QC Analyst",
      "Warehouse Operator (goods receipt)",
      "Production Supervisor (in-process / FG)",
      "Purchase / Procurement (vendor score dari Fail)",
      "Quality Manager (control points & CAPA)",
    ],
    whenNeeded:
      "Produk pangan, kemasan, atau komponen kritis membutuhkan inspeksi masuk (incoming), in-process pada MO, atau final check sebelum delivery — terutama saat regulasi, klaim pelanggan, atau vendor baru.",
    relatedModules: [
      "Inventory",
      "Manufacturing",
      "Purchase",
      "Barcode",
      "Maintenance (opsional CAPA mesin)",
      "PLM (opsional revisi spesifikasi)",
    ],
    businessScenario: `${company.name} menerima receipt ${kopi.name} qty ${po.kopiQty} dari ${vendor.name}. Control Point "Visual & Aroma Incoming Kopi" memicu Quality Check pada picking Receipts. Inspector Pass/Fail; Fail membuat Quality Alert, memblokir validate penuh, lalu Return/Scrap dan evaluasi vendor. Paralel, Control Point pada Manufacturing Order memastikan ${dus.name} dan proses packing memenuhi standar sebelum FG tersedia.`,
  },
  prerequisites: {
    modules: [
      "Quality app terpasang (Enterprise)",
      "Inventory (receipts / transfers sebagai trigger utama)",
      "Purchase (PO → Receipt untuk incoming QC)",
      "Manufacturing (opsional — in-process / final QC pada MO)",
      "Barcode (opsional — eksekusi check di lantai gudang)",
    ],
    masterData: [
      `Produk storable: ${kopi.name}, ${teh.name}, ${dus.name}`,
      `Vendor: ${vendor.name}, ${vendorKemasan.name}`,
      "Quality Teams (quality.alert.team / Quality Team)",
      "Control Points (quality.point) — products + operations + type",
      "Operation types: Receipts (WH/IN), Delivery, Manufacturing",
      "Lot/Serial jika produk tracking lot (disarankan untuk pangan)",
      "Warehouse & picking types sudah aktif di Inventory",
    ],
    configuration: [
      "Quality → Configuration → Settings (workspace, quality control options)",
      "Settings → Quality — opsi terkait Inventory/MRP",
      "Quality → Quality Control → Control Points",
      "Quality → Configuration → Quality Teams",
      "Inventory → Configuration → Operations Types (pastikan Receipts tersedia)",
      "Manufacturing → Operations / Work Centers jika QC in-process di WO",
    ],
    access: [
      "Quality / User: eksekusi Quality Checks, buat/isi Quality Alerts",
      "Quality / Manager: Control Points, Teams, Settings, reporting penuh",
      "Inventory User: validate picking setelah check Pass (atau sesuai policy blok)",
      "Manufacturing User: lanjutkan MO/WO setelah check terkait selesai",
    ],
    relationships:
      "quality.point menargetkan product/product category + operation type (atau manufacturing operation). Saat stock.picking / mrp.production cocok domain point, sistem membuat quality.check. Pass mengizinkan lanjut validate; Fail dapat membuka wizard Quality Alert (quality.alert) dan menahan stok sampai keputusan Return/Scrap/Use-as-is. Checked By & date menjadi jejak audit.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Quality' atau 'Quality Control'",
      "Klik Install pada aplikasi Quality (Enterprise)",
      "Pastikan menu Quality muncul di App Switcher",
      "Buka Quality → Overview untuk verifikasi dashboard team",
    ],
    dependencies: [
      "Inventory (stock) — wajib untuk trigger picking",
      "Mail / Discuss — chatter pada check & alert",
      "Manufacturing (mrp) — jika ingin QC pada MO/WO",
      "Purchase — alur PO → Receipt yang paling umum untuk latihan incoming",
    ],
    afterInstall: [
      "Buka Quality → Configuration → Settings; review opsi Quality Control",
      "Buat/pastikan Quality Team (mis. Main Quality Team) dan assign inspector",
      `Buat Control Point incoming untuk ${kopi.name} pada Operations = Receipts`,
      "Uji end-to-end: PO → Receipt → Quality Check muncul → Pass/Fail",
      "Opsional: Control Point pada Manufacturing untuk FG/packing",
    ],
    newMenus: [
      "Quality → Overview",
      "Quality → Quality Control → Quality Checks",
      "Quality → Quality Control → Control Points",
      "Quality → Quality Control → Quality Alerts",
      "Quality → Reporting (Checks / Alerts analysis)",
      "Quality → Configuration → Settings",
      "Quality → Configuration → Quality Teams",
    ],
    newSettings: [
      "Settings → Quality — Quality Control / Workspace",
      "Settings terkait Inventory Quality (blok validate saat check pending — sesuai opsi lab)",
      "Quality Team default & assignment",
    ],
  },
  configurations: [
    {
      id: "qc-control-points",
      name: "Control Points (quality.point)",
      location: "Quality → Quality Control → Control Points",
      what: "Aturan kapan Quality Check dibuat: produk/kategori, operasi (Receipts/MO/dll.), tipe kontrol (Pass-Fail, Measure, Instructions), frekuensi, dan team owner.",
      whyEnable:
        "Standarisasi inspeksi tanpa mengandalkan ingatan operator; setiap receipt ${kopi.name} mendapat check yang sama.",
      whenEnable:
        "Ada SKU atau operasi yang wajib dicek (bahan baku pangan, kemasan kritis, FG sebelum kirim).",
      whenNot:
        "SKU non-kritis tanpa regulasi — jangan over-check semua produk; bottleneck gudang.",
      businessExample: `Point "Visual & Aroma Incoming — ${kopi.name}" pada Receipts WH/IN; Products = ${kopi.name}; Type = Pass - Fail.`,
      impact:
        "Saat picking receipt cocok, quality.check otomatis muncul; validate dapat menunggu Pass.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-points.png",
        caption: "Control Points — daftar quality.point aktif",
        whatYouSee: "Reference, Title, Products, Operations, Type, Team",
        why: "Point adalah fondasi generate check otomatis",
        expectedResult: "List menampilkan point incoming kopi setelah Save",
      },
    },
    {
      id: "qc-control-type",
      name: "Control Type (Pass-Fail / Measure / Instructions)",
      location: "Control Point → Type (form quality.point)",
      what: "Jenis kontrol: qualitative Pass/Fail, pengukuran numerik (Measure) dengan toleransi, atau Instructions (panduan tanpa nilai).",
      whyEnable:
        "Metode inspeksi harus cocok karakteristik produk — visual kemasan beda dengan kadar air/berat net.",
      whenEnable:
        "Visual/organoleptik → Pass-Fail; berat, suhu, kadar → Measure; SOP baca-saja → Instructions.",
      whenNot:
        "Jangan pilih Measure jika tidak ada alat ukur terkalibrasi di lantai gudang.",
      businessExample: `Pass-Fail untuk aroma ${kopi.name}; Measure "Berat net ≥ 1000g" untuk karung sampel; Instructions untuk checklist segel ${dus.name}.`,
      impact:
        "Form Quality Check menampilkan tombol Pass/Fail atau field input nilai + status dalam/luar toleransi.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form Control Point — pilih Type dan parameter kontrol",
        whatYouSee: "Title, Products, Operations, Type, Team, Instructions",
        whatToFill: `Title Visual Incoming, Products ${kopi.name}, Type Pass - Fail`,
        why: "Type menentukan UI eksekusi check di lapangan",
      },
    },
    {
      id: "qc-quality-team",
      name: "Quality Teams",
      location: "Quality → Configuration → Quality Teams",
      what: "Tim inspector yang menerima antrian check, alert, dan tampil di Overview.",
      whyEnable:
        "Ownership inspeksi jelas; Overview & notifikasi tidak bercampur antar pabrik/gudang.",
      whenEnable:
        "Lebih dari satu inspector, atau pisah team Incoming vs Production QC.",
      whenNot:
        "Satu orang QC tunggal — cukup default Main Quality Team.",
      businessExample: `"QC Incoming Bandung" untuk receipt ${vendor.name}; "QC Produksi" untuk check pada MO packing ${dus.name}.`,
      impact:
        "Field Team di point/check/alert; Overview menampilkan KPI per team.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Quality Overview — Main Quality Team & antrian check",
        whatYouSee: "Dashboard Quality: checks in progress, alerts, team",
        why: "Team mengikat ownership inspeksi harian",
      },
    },
    {
      id: "qc-alerts",
      name: "Quality Alerts",
      location: "Quality → Quality Control → Quality Alerts",
      what: "Record isu kualitas (dari Fail check atau temuan ad-hoc) untuk investigasi, root cause, dan corrective action sederhana.",
      whyEnable:
        "Fail check tanpa alert = tidak ada CAPA; pola cacat vendor/proses hilang dari statistik.",
      whenEnable:
        "Setiap Fail material, temuan berulang, atau near-miss yang perlu tindak lanjut.",
      whenNot:
        "Jangan spam alert untuk catatan minor tanpa proses — turunkan noise dengan SOP Fail→Alert.",
      businessExample: `Alert "Aroma off / lembab" pada lot receipt ${kopi.name} dari ${vendor.name}; assign QC Manager; keputusan Return.`,
      impact:
        "Tracking tahap alert, assignee, produk/lot; reporting frekuensi isu per vendor/produk.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks — status Pass/Fail sebagai sumber alert",
        whatYouSee: "List check: reference, product, status, checked by",
        why: "Fail check adalah pintu masuk Quality Alert",
      },
    },
    {
      id: "qc-operation-triggers",
      name: "Operation Triggers (Receipts / Transfers / MO)",
      location: "Control Point → Operations (Many2many operation types / manufacturing ops)",
      what: "Mengaitkan point ke momen proses: Receipts, Internal Transfers, Delivery Orders, atau operasi Manufacturing.",
      whyEnable:
        "Check muncul tepat saat barang bergerak atau WO dikerjakan — bukan setelah stok sudah tercampur.",
      whenEnable:
        "Incoming materials kritis, FG sebelum delivery, atau in-process gate di work center.",
      whenNot:
        "Jangan centang semua operations 'untuk amannya' — check tidak relevan akan diabaikan operator.",
      businessExample: `Receipts untuk ${kopi.name} dari ${vendor.name}; Manufacturing operation "Packing" untuk cek ${dus.name} + segel.`,
      impact:
        "Validate picking / progress MO menunggu check selesai sesuai konfigurasi quality control.",
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Inventory Receipts — titik umum QC incoming setelah PO",
        whatYouSee: "Daftar/form receipt Inventory (WH/IN)",
        why: "Receipt adalah trigger paling umum untuk Control Point bahan baku",
        expectedResult: "Smart button Quality / check muncul saat produk match point",
      },
    },
    {
      id: "qc-settings-workspace",
      name: "Quality Settings & Workspace",
      location: "Settings → Quality / Quality → Configuration → Settings",
      what: "Opsi global Quality Control: workspace tablet/kiosk, integrasi dengan Inventory/MRP, dan preferensi frekuensi/control.",
      whyEnable:
        "Menyelaraskan perilaku QC di seluruh gudang/produksi sebelum Point dibuat massal.",
      whenEnable:
        "Setelah install Quality; sebelum go-live receipt dengan gate QC.",
      whenNot:
        "Jangan mengubah settings produksi di tengah shift tanpa komunikasi ke WH/QC.",
      businessExample: `${company.name} mengaktifkan Quality di Settings lalu menyusun point incoming untuk PO ${vendor.name}.`,
      impact:
        "Menu & perilaku check/alert tersedia konsisten; Overview siap dipakai inspector.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-quality.png",
        caption: "Settings Quality — opsi Quality Control Odoo 19 Enterprise",
        whatYouSee: "Halaman Settings aplikasi Quality",
        why: "Settings dikonfirmasi sebelum membuat Control Points latihan",
      },
    },
    {
      id: "qc-frequency-sampling",
      name: "Control Frequency / Sampling",
      location: "Control Point → Frequency (All operations / Randomly / Periodically — sesuai opsi versi)",
      what: "Menentukan apakah setiap operasi dicentang, sampling acak, atau periodik.",
      whyEnable:
        "Volume receipt tinggi tidak selalu butuh 100% check; sampling menjaga throughput tanpa hilang kontrol.",
      whenEnable:
        "SKU volume tinggi dengan risiko sedang; historis vendor bagus.",
      whenNot:
        "Bahan baku kritis/regulasi pangan baru dari vendor baru — pakai All operations dulu.",
      businessExample: `${teh.name} dari vendor lama: sampling periodik; ${kopi.name} dari ${vendor.name}: All receipts sampai 3 lot Pass berturut-turut.`,
      impact:
        "Jumlah quality.check yang ter-generate mengikuti frekuensi; reporting coverage tetap terbaca.",
    },
  ],
  masterData: [
    {
      id: "md-qc-point",
      name: "Control Point (quality.point)",
      purpose:
        "Definisi aturan kontrol: apa yang dicek, pada produk mana, pada operasi kapan, dengan tipe kontrol apa.",
      required: true,
      whyNeeded:
        "Tanpa Control Point aktif yang domain-nya cocok, Quality Check tidak ter-generate otomatis saat receipt/MO.",
      fields: [
        {
          field: "Title",
          type: "Char",
          required: true,
          purpose: "Nama kontrol yang dibaca inspector",
          why: "Identitas di list check & overview",
          example: `Visual & Aroma Incoming — ${kopi.name}`,
          impactIfEmpty: "Point tidak bisa disimpan",
        },
        {
          field: "Products",
          type: "Many2many",
          required: false,
          purpose: "SKU yang memicu point",
          why: "Membatasi scope agar tidak semua receipt dicek",
          example: kopi.name,
          impactIfEmpty: "Terlalu luas jika hanya Operations terisi — hampir semua picking kena",
          related: "product.product",
        },
        {
          field: "Product Categories",
          type: "Many2many",
          required: false,
          purpose: "Cakupan per kategori (mis. Bahan Minuman)",
          why: "Satu point untuk banyak SKU sejenis",
          example: kopi.category,
          impactIfEmpty: "Harus andalkan Products per-SKU",
          related: "product.category",
        },
        {
          field: "Operations",
          type: "Many2many",
          required: true,
          purpose: "Picking type / operasi pemicu",
          why: "Menentukan kapan check dibuat",
          example: "Receipts",
          impactIfEmpty: "Point tidak pernah trigger",
          related: "stock.picking.type",
        },
        {
          field: "Type",
          type: "Selection",
          required: true,
          purpose: "Pass-Fail / Measure / Instructions",
          why: "UI dan validasi hasil check",
          example: "Pass - Fail",
          impactIfEmpty: "Point invalid",
        },
        {
          field: "Team",
          type: "Many2one",
          required: false,
          purpose: "Quality Team owner",
          why: "Assignment & overview",
          example: "Main Quality Team",
          impactIfEmpty: "Check tanpa owner team jelas",
          related: "quality.alert.team",
        },
        {
          field: "Instructions",
          type: "Html / Text",
          required: false,
          purpose: "Panduan inspeksi di lapangan",
          why: "Standar organoleptik/visual tidak ambigu",
          example: "Cek kemasan utuh, aroma khas arabika, tidak lembab/berjamur",
          impactIfEmpty: "Inspector menilai subjektif tanpa acuan",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form New Control Point — field inti quality.point",
        whatYouSee: "Form create Control Point",
        whatToFill: `Title, Products ${kopi.name}, Operations Receipts, Type Pass-Fail`,
        why: "Master point harus lengkap sebelum uji receipt",
      },
    },
    {
      id: "md-qc-check",
      name: "Quality Check (quality.check)",
      purpose:
        "Eksekusi inspeksi aktual per dokumen (picking line / MO): hasil Pass/Fail atau nilai Measure, inspector, dan waktu.",
      required: true,
      whyNeeded:
        "Bukti audit per receipt/lot; gate operasional sebelum stok available atau WO lanjut.",
      fields: [
        {
          field: "Reference / Title",
          type: "Char",
          required: true,
          purpose: "Dari Control Point",
          why: "Konteks inspeksi",
          example: "Visual & Aroma Incoming",
          impactIfEmpty: "Check sulit dikenali di list",
        },
        {
          field: "Product",
          type: "Many2one",
          required: false,
          purpose: "SKU yang diinspeksi",
          why: "Trace ke master produk & reporting",
          example: kopi.name,
          impactIfEmpty: "Jejak produk lemah di analytics",
          related: "product.product",
        },
        {
          field: "Control Date / Checked On",
          type: "Datetime",
          required: false,
          purpose: "Waktu inspeksi",
          why: "Audit & SLA internal QC",
          example: "2026-10-08 09:15",
          impactIfEmpty: "Timeline CAPA tidak akurat",
        },
        {
          field: "Status / Quality Check",
          type: "Selection",
          required: true,
          purpose: "None / Pass / Fail (atau measure result)",
          why: "Gate stok & trigger alert",
          example: "Pass",
          impactIfEmpty: "Status none — proses dapat terblokir",
        },
        {
          field: "Checked By",
          type: "Many2one",
          required: false,
          purpose: "User inspector",
          why: "Akuntabilitas",
          example: "Mitchell Admin",
          impactIfEmpty: "Accountability lemah saat audit",
          related: "res.users",
        },
        {
          field: "Lot/Serial",
          type: "Many2one",
          required: false,
          purpose: "Lot yang dicek",
          why: "Recall & vendor claim per lot",
          example: "LOT-KOPI-001",
          impactIfEmpty: "Gagal telusur lot cacat",
          related: "stock.lot",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks — reference, product, status, checked by",
        whatYouSee: "List quality.check dengan kolom status",
        why: "Ini unit kerja harian inspector",
      },
    },
    {
      id: "md-qc-team",
      name: "Quality Team (quality.alert.team)",
      purpose: "Organisasi inspector, antrian overview, dan ownership alert.",
      required: true,
      whyNeeded:
        "Overview, assignment alert, dan filter operasional membutuhkan team sebagai wadah.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama tim QC",
          why: "Label di Overview & form",
          example: "Main Quality Team",
          impactIfEmpty: "Team tidak tersimpan",
        },
        {
          field: "Members / Alias",
          type: "Many2many / Char",
          required: false,
          purpose: "Inspector & saluran notifikasi",
          why: "Siapa yang dikabari saat check/alert baru",
          example: "QC Inspector A, QC Manager",
          impactIfEmpty: "Alert tanpa audience jelas",
          related: "res.users",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Overview menampilkan Quality Team aktif",
        whatYouSee: "Kartu/statistik Main Quality Team",
      },
    },
    {
      id: "md-qc-alert",
      name: "Quality Alert (quality.alert)",
      purpose:
        "Dokumen isu kualitas: deskripsi temuan, tahap investigasi, produk/lot, partner terkait, corrective action.",
      required: false,
      whyNeeded:
        "Mengubah Fail episodik menjadi tindakan terukur (return vendor, scrap, ubah proses).",
      fields: [
        {
          field: "Title",
          type: "Char",
          required: true,
          purpose: "Ringkas isu",
          why: "Identitas di kanban alert",
          example: `Aroma off — ${kopi.name} — ${vendor.name}`,
          impactIfEmpty: "Alert tidak tersimpan",
        },
        {
          field: "Product",
          type: "Many2one",
          required: false,
          purpose: "SKU bermasalah",
          why: "Agregasi isu per produk",
          example: kopi.name,
          impactIfEmpty: "Sulit analisis Pareto produk",
          related: "product.product",
        },
        {
          field: "Partner / Vendor",
          type: "Many2one",
          required: false,
          purpose: "Pemasok terkait",
          why: "Vendor score & claim",
          example: vendor.name,
          impactIfEmpty: "Tidak bisa ranking vendor buruk",
          related: "res.partner",
        },
        {
          field: "Stage",
          type: "Many2one",
          required: false,
          purpose: "New → Confirmed → Corrective → Done",
          why: "Alur CAPA sederhana",
          example: "New",
          impactIfEmpty: "Alert menggantung tanpa status",
        },
        {
          field: "Root Cause / Description",
          type: "Html / Text",
          required: false,
          purpose: "Analisis penyebab",
          why: "Agar corrective action tepat",
          example: "Karung bocor saat transit; kelembaban tinggi",
          impactIfEmpty: "Hanya gejala, bukan solusi",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Jalur dari Fail check menuju Quality Alert",
        whatYouSee: "Check Fail sebagai pemicu alert",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "product", label: "Product / Category" },
      { id: "point", label: "Control Point" },
      { id: "team", label: "Quality Team" },
      { id: "po", label: "Purchase Order" },
      { id: "picking", label: "Receipt / Transfer" },
      { id: "mo", label: "Manufacturing Order" },
      { id: "check", label: "Quality Check" },
      { id: "alert", label: "Quality Alert" },
      { id: "stock", label: "Stock Decision (Validate / Return / Scrap)" },
    ],
    edges: [
      {
        from: "product",
        to: "point",
        why: "Point memfilter Products/Categories yang wajib dicek",
      },
      {
        from: "team",
        to: "point",
        why: "Team menjadi owner point, check, dan alert",
      },
      {
        from: "po",
        to: "picking",
        why: `PO ke ${vendor.name} menghasilkan Receipt untuk ${kopi.name}`,
      },
      {
        from: "point",
        to: "check",
        why: "Domain point cocok → sistem create quality.check",
      },
      {
        from: "picking",
        to: "check",
        why: "Operasi Receipt/Transfer memicu point terkait",
      },
      {
        from: "mo",
        to: "check",
        why: "MO/WO cocok operation Manufacturing → check in-process/final",
      },
      {
        from: "check",
        to: "alert",
        why: "Fail (atau temuan) dapat membuat Quality Alert",
      },
      {
        from: "check",
        to: "stock",
        why: "Pass izinkan validate; Fail arahkan Return/Scrap/hold",
      },
    ],
    summary:
      "Product + Control Point + Quality Team membentuk aturan. PO/Receipt atau MO memicu Quality Check. Pass membuka jalan stok/produksi; Fail → Alert + keputusan stok (return/scrap). Jejak Checked By mendukung audit dan evaluasi vendor.",
  },
  forms: [
    {
      id: "form-point",
      name: "Control Point (quality.point)",
      menuPath: "Quality → Quality Control → Control Points → New",
      fields: [
        {
          field: "Title",
          required: true,
          purpose: "Nama kontrol",
          why: "Dibaca inspector di antrian check",
          example: `Visual & Aroma Incoming — ${kopi.name}`,
        },
        {
          field: "Products",
          required: false,
          purpose: "SKU target",
          why: "Scope sempit = antrian sehat",
          example: kopi.name,
        },
        {
          field: "Operations",
          required: true,
          purpose: "Trigger operasi",
          why: "Tanpa ini check tidak pernah muncul",
          example: "Receipts",
        },
        {
          field: "Type",
          required: true,
          purpose: "Metode kontrol",
          why: "UI Pass/Fail vs Measure",
          example: "Pass - Fail",
        },
        {
          field: "Team",
          required: false,
          purpose: "Owner tim",
          why: "Overview & notifikasi",
          example: "Main Quality Team",
        },
        {
          field: "Instructions",
          required: false,
          purpose: "SOP singkat di form check",
          why: "Kurangi subjektivitas",
          example: "Tolak jika aroma apek/lembab atau karung sobek",
        },
        {
          field: "Frequency",
          required: false,
          purpose: "All / sampling",
          why: "Seimbangkan risiko vs throughput",
          example: "All",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form Control Point baru di Quality Odoo 19",
        whatYouSee: "Header point: title, products, operations, type",
        whatToFill: `Title Visual Incoming, Product ${kopi.name}, Operations Receipts`,
        why: "Form ini fondasi seluruh gate QC incoming",
      },
    },
    {
      id: "form-check",
      name: "Quality Check (quality.check)",
      menuPath: "Quality → Quality Control → Quality Checks",
      fields: [
        {
          field: "Product",
          required: false,
          purpose: "SKU inspeksi",
          why: "Trace & filter",
          example: kopi.name,
        },
        {
          field: "Picking / Production",
          required: false,
          purpose: "Dokumen sumber",
          why: "Link ke receipt atau MO",
          example: "WH/IN/00042",
        },
        {
          field: "Status (Pass / Fail)",
          required: true,
          purpose: "Hasil inspeksi",
          why: "Gate stok & alert",
          example: "Pass",
        },
        {
          field: "Measure value",
          required: false,
          purpose: "Nilai ukur (jika Type Measure)",
          why: "Bandingkan ke toleransi point",
          example: "1005",
        },
        {
          field: "Checked By",
          required: false,
          purpose: "Inspector",
          why: "Audit trail",
          example: "Mitchell Admin",
        },
        {
          field: "Notes",
          required: false,
          purpose: "Catatan lapangan",
          why: "Konteks Fail/Pass bersyarat",
          example: "Karung utuh, aroma normal",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "List / form Quality Checks setelah receipt",
        whatYouSee: "Baris check dengan status dan checked by",
        whatToFill: "Pass atau Fail + catatan; pastikan Checked By terisi",
      },
    },
    {
      id: "form-alert",
      name: "Quality Alert (quality.alert)",
      menuPath: "Quality → Quality Control → Quality Alerts → New",
      fields: [
        {
          field: "Title",
          required: true,
          purpose: "Judul isu",
          why: "Identitas CAPA",
          example: `Kemasan bocor — ${kopi.name}`,
        },
        {
          field: "Product",
          required: false,
          purpose: "SKU",
          why: "Pareto cacat",
          example: kopi.name,
        },
        {
          field: "Vendor / Partner",
          required: false,
          purpose: "Pemasok",
          why: "Klaim & scorecard",
          example: vendor.name,
        },
        {
          field: "Team",
          required: false,
          purpose: "Tim penanganan",
          why: "Owner investigasi",
          example: "Main Quality Team",
        },
        {
          field: "Description / Root Cause",
          required: false,
          purpose: "Detail temuan",
          why: "Dasar corrective action",
          example: "Jahitan karung lepas; aroma apek pada 3 sampel",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Quality app — jalur ke Alerts dari Overview",
        whatYouSee: "Overview Quality dengan indikator alerts",
      },
    },
  ],
  procedures: [
    {
      id: "proc-qc-point-incoming",
      title: `Buat Control Point incoming untuk ${kopi.name}`,
      goal: `Setiap receipt ${kopi.name} wajib punya Quality Check Pass-Fail sebelum stok dianggap layak pakai.`,
      preparation: [
        "Aplikasi Quality terpasang",
        `Produk ${kopi.name} sudah ada (storable)`,
        "Quality Team tersedia (Main Quality Team)",
        "Operation type Receipts aktif di Inventory",
      ],
      steps: [
        "Quality → Quality Control → Control Points → New",
        `Isi Title: Visual & Aroma Incoming — ${kopi.name}`,
        `Pilih Products: ${kopi.name}`,
        "Pilih Operations: Receipts (WH/IN)",
        "Set Type: Pass - Fail",
        "Pilih Team: Main Quality Team",
        "Isi Instructions: cek karung, aroma, kelembaban, bebas kontaminan",
        "Frequency: All (untuk latihan)",
        "Save — pastikan point aktif (tidak di-archive)",
      ],
      expectedResult:
        "quality.point tersimpan dan tampil di list Control Points; siap memicu check pada receipt berikutnya.",
      verification: [
        "Point muncul di Quality → Control Points",
        "Products & Operations terisi benar",
        "Type = Pass - Fail",
        "Team terisi",
      ],
      fillFields: [
        {
          field: "Title",
          value: `Visual & Aroma Incoming — ${kopi.name}`,
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Products",
          value: kopi.name,
          where: "Header / Products",
          how: "Pilih",
          required: true,
        },
        {
          field: "Operations",
          value: "Receipts",
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Type",
          value: "Pass - Fail",
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Team",
          value: "Main Quality Team",
          where: "Header",
          how: "Pilih",
        },
        {
          field: "Instructions",
          value: "Karung utuh; aroma khas arabika; tolak jika lembab/apek",
          where: "Notes / Instructions",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form New Control Point — incoming kopi",
        whatYouSee: "Form quality.point siap diisi",
        expectedResult: "Point tersimpan tanpa error",
      },
    },
    {
      id: "proc-qc-receive-pass",
      title: `Eksekusi Quality Check pada receipt ${kopi.name}`,
      goal: "Pass inspeksi incoming lalu validate receipt agar qty masuk stok available.",
      preparation: [
        "Control Point incoming aktif untuk produk & Receipts",
        `PO ke ${vendor.name} qty ${po.kopiQty} ${kopi.name} sudah Confirm`,
        "Receipt (WH/IN) Ready / Waiting dengan baris produk match",
        "Login sebagai Quality User atau user yang punya hak Pass",
      ],
      steps: [
        "Inventory → Operations → Receipts — buka receipt terkait PO",
        "Pastikan qty done / lot terisi sesuai kebijakan gudang",
        "Buka smart button Quality Checks (atau menu Quality → Quality Checks filter picking)",
        'Buka check "Visual & Aroma Incoming"',
        "Ikuti Instructions; jika baik → klik Pass",
        "Pastikan Checked By & Control Date terisi",
        "Kembali ke Receipt → Validate",
        "Konfirmasi stok ${kopi.name} bertambah di Inventory",
      ],
      expectedResult:
        "quality.check berstatus Pass; picking Validated; stok available bertambah; tidak ada alert wajib.",
      verification: [
        "Status check = Pass (bukan none)",
        "Checked By terisi",
        "Receipt state = Done",
        `On-hand ${kopi.name} naik sesuai qty receipt`,
      ],
      fillFields: [
        {
          field: "Quality Check Status",
          value: "Pass",
          where: "Form Quality Check",
          how: "Klik tombol Pass",
          required: true,
        },
        {
          field: "Checked By",
          value: "Mitchell Admin",
          where: "Form check",
          how: "Otomatis / pilih",
          required: true,
        },
        {
          field: "Notes",
          value: `Receipt ${po.kopiQty} unit — visual & aroma OK`,
          where: "Notes",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Receipt Inventory — titik eksekusi QC sebelum Validate",
        whatYouSee: "Form/list receipt WH/IN",
        why: "Check harus selesai sebelum/saat validate sesuai policy",
      },
    },
    {
      id: "proc-qc-fail-alert",
      title: "Fail check, buat Quality Alert, putuskan Return/Scrap",
      goal: "Barang cacat tidak masuk stok bebas pakai; isu tercatat untuk CAPA & vendor claim.",
      preparation: [
        "Ada Quality Check pending pada receipt",
        "SOP Fail → Alert sudah disepakati",
        `Kontak ${vendor.name} siap untuk klaim (latihan)`,
      ],
      steps: [
        "Buka Quality Check terkait receipt",
        "Klik Fail — isi alasan di notes (aroma off, karung sobek, dll.)",
        "Buat / lanjutkan wizard Quality Alert",
        `Isi Title, Product ${kopi.name}, Partner ${vendor.name}, Team`,
        "Assign investigator; isi deskripsi temuan & bukti (foto di chatter jika ada)",
        "Di Inventory: jangan Validate sebagai available — proses Return ke vendor atau Scrap sesuai keputusan",
        "Update stage Alert sampai Corrective/Done setelah tindakan selesai",
        "Catat di Purchase: evaluasi performa ${vendor.name}",
      ],
      expectedResult:
        "Check = Fail; quality.alert tercatat; stok tidak 'lolos diam-diam'; jejak CAPA lengkap.",
      verification: [
        "Status check Fail",
        "Alert muncul di Quality → Quality Alerts",
        "Partner/Vendor terisi",
        "Receipt tidak menambah available tanpa keputusan eksplisit",
      ],
      fillFields: [
        {
          field: "Quality Check Status",
          value: "Fail",
          where: "Form Quality Check",
          how: "Klik Fail",
          required: true,
        },
        {
          field: "Fail notes",
          value: "Aroma apek; 2 karung jahitan lepas",
          where: "Notes check",
          how: "Ketik",
          required: true,
        },
        {
          field: "Alert Title",
          value: `Aroma off — ${kopi.name} — ${vendor.name}`,
          where: "Quality Alert form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Partner",
          value: vendor.name,
          where: "Alert",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks — Fail sebagai awal alert & hold stok",
        whatYouSee: "List check dengan status Fail",
        expectedResult: "Alert dapat dibuat dari konteks Fail",
      },
    },
    {
      id: "proc-qc-mrp-inprocess",
      title: "QC in-process / final pada Manufacturing Order",
      goal: "Gate kualitas di produksi (packing) sebelum FG selesai dan tersedia dijual.",
      preparation: [
        "Manufacturing terpasang; BoM untuk produk jadi memakai komponen relevan",
        `Control Point dengan Operations Manufacturing (atau work order op) untuk cek ${dus.name} / packing`,
        "MO siap diproduksi (components available)",
      ],
      steps: [
        "Manufacturing → Operations → Manufacturing Orders — buka MO latihan",
        "Start / progress WO sampai operasi yang punya Quality Point",
        "Buka Quality Checks terkait MO",
        "Eksekusi Pass-Fail (segel, label, kondisi ${dus.name})",
        "Jika Pass → lanjutkan/mark done operasi & Produce MO",
        "Jika Fail → Alert + hold FG; perbaiki proses atau scrap",
        "Verifikasi Overview Quality: check MO tidak menumpuk",
      ],
      expectedResult:
        "Check terkait MO selesai; FG hanya Done setelah Pass (atau keputusan eksplisit pada Fail).",
      verification: [
        "quality.check terhubung production",
        "Status Pass/Fail terisi",
        "MO state sesuai (Done hanya jika gate terpenuhi)",
      ],
      fillFields: [
        {
          field: "Control Point Operation",
          value: "Manufacturing / Packing",
          where: "quality.point Operations",
          how: "Pilih",
          required: true,
          note: "Siapkan point sebelum start MO",
        },
        {
          field: "Quality Check Status",
          value: "Pass",
          where: "Check pada MO",
          how: "Klik Pass",
          required: true,
        },
        {
          field: "Notes",
          value: `Packing ${dus.name} rapi; label lengkap`,
          where: "Check notes",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp.png",
        caption: "Manufacturing — konteks MO untuk QC in-process/final",
        whatYouSee: "App/list Manufacturing Orders",
        why: "MO adalah trigger kedua setelah Receipts untuk Quality",
      },
    },
    {
      id: "proc-qc-overview-monitor",
      title: "Monitor Overview & bersihkan antrian check",
      goal: "Tidak ada check pending tanpa owner; alert kritis ditindak hari yang sama.",
      preparation: [
        "Beberapa Quality Checks & Alerts sudah ada (Pass/Fail/pending)",
        "Login Quality Manager atau Team Leader",
      ],
      steps: [
        "Quality → Overview",
        "Review KPI: Checks In Progress, Alerts, Pass rate (jika tampil)",
        "Drill ke checks pending → assign / selesaikan",
        "Buka Quality Alerts stage New → set priority & assignee",
        "Quality → Reporting: filter minggu ini per produk/vendor",
        "Escalasi Fail berulang ${vendor.name} ke Purchase",
      ],
      expectedResult:
        "Antrian in-progress turun; alert punya owner; Purchase sadar pola Fail vendor.",
      verification: [
        "Angka Overview masuk akal vs list Checks",
        "Tidak ada check none berumur > SLA internal",
        "Alert New berkurang setelah triage",
      ],
      fillFields: [
        {
          field: "Filter Team",
          value: "Main Quality Team",
          where: "Overview / search",
          how: "Pilih",
        },
        {
          field: "Alert Assignee",
          value: "QC Manager",
          where: "Quality Alert",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Quality Overview — monitoring harian team QC",
        whatYouSee: "Dashboard checks in progress & alerts",
        why: "Overview adalah pusat kendali Quality Manager",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-qc-incoming-pass",
      title: "Incoming Pass — stok langsung available",
      whenToUse: `Barang dari ${vendor.name} memenuhi standar visual/aroma.`,
      flow: [
        `PO ${kopi.name} qty ${po.kopiQty} Confirm`,
        "Receipt Ready",
        "Quality Check otomatis dari Control Point",
        "Inspector Pass + catatan",
        "Validate Receipt",
        "Stok available; Purchase boleh lanjut invoice",
      ],
      notes: "Jalur bahagia latihan Quality + Inventory.",
    },
    {
      id: "sc-qc-incoming-fail-return",
      title: "Incoming Fail + Alert + Return vendor",
      whenToUse: "Cacat terlihat saat goods receipt; barang tidak boleh pakai.",
      flow: [
        "Receipt + Quality Check",
        "Fail + notes bukti",
        "Quality Alert assign ke QC Manager",
        "Return picking ke ${vendor.name}",
        "Claim / debit note di Purchase",
        "Tutup Alert setelah vendor acknowledge",
      ],
      notes: "Latih segregasi: Fail tanpa Return = risiko stok cacat tetap masuk.",
    },
    {
      id: "sc-qc-mrp-gate",
      title: "In-process QC pada MO packing",
      whenToUse: "FG atau packing kritis sebelum Done.",
      flow: [
        `Control Point Manufacturing untuk ${dus.name} / packing`,
        "Start MO",
        "Check di operasi terkait",
        "Pass → Produce/Done",
        "Fail → hold FG + Alert proses",
      ],
    },
    {
      id: "sc-qc-measure-weight",
      title: "Measure — toleransi berat net",
      whenToUse: "Perlu bukti numerik, bukan hanya visual.",
      flow: [
        "Control Point Type Measure (berat net)",
        "Receipt / sampling",
        "Input nilai aktual",
        "Dalam toleransi → Pass otomatis/logis",
        "Di luar toleransi → Fail + Alert",
      ],
      notes: "Siapkan alat ukur; jangan pakai Measure tanpa kalibrasi.",
    },
    {
      id: "sc-qc-vendor-score",
      title: "Pola Fail → evaluasi vendor",
      whenToUse: "Fail berulang pada pemasok yang sama.",
      flow: [
        `Agregasi Fail ${kopi.name} × ${vendor.name}`,
        "Reporting Quality Alerts",
        "Meeting Purchase + QC",
        "Tindakan: warning, ganti lot, atau nonaktifkan vendor sementara",
        "Pertimbangkan sampling lebih ketat (Frequency All)",
      ],
    },
  ],
  integrations: [
    {
      id: "int-qc-inventory",
      withModule: "Inventory",
      relationship: "quality.check pada stock.picking",
      whatHappens:
        "Control Point Operations = Receipts/Transfers/Delivery membuat check pada picking. Validate dapat menunggu Pass; Fail mendorong Return/Scrap/quarantine sesuai SOP gudang.",
    },
    {
      id: "int-qc-manufacturing",
      withModule: "Manufacturing",
      relationship: "check pada mrp.production / workorder",
      whatHappens:
        "Point pada operasi Manufacturing menahan progres WO/MO sampai check selesai. FG berkualitas buruk tidak Done tanpa keputusan eksplisit.",
    },
    {
      id: "int-qc-purchase",
      withModule: "Purchase",
      relationship: "vendor receipts & scorecard",
      whatHappens: `PO ke ${vendor.name} → Receipt → QC. Fail/Alert menjadi input evaluasi pemasok, claim, dan keputusan reorder.`,
    },
    {
      id: "int-qc-barcode",
      withModule: "Barcode",
      relationship: "eksekusi check di lantai",
      whatHappens:
        "Operator gudang menyelesaikan Quality Check dari antarmuka Barcode saat receive, mengurangi bolak-balik ke backend desktop.",
    },
    {
      id: "int-qc-maintenance",
      withModule: "Maintenance (opsional)",
      relationship: "akar masalah mesin/proses",
      whatHappens:
        "Alert produksi berulang dapat memicu permintaan maintenance pada work center yang menyebabkan cacat packing/segel.",
    },
  ],
  mistakes: [
    {
      id: "m-qc-too-broad",
      problem: "Control Point tanpa filter Products/Categories",
      why: "Semua receipt kena check → bottleneck WH; inspector skip diam-diam",
      detect: "Antrian Quality Checks membengkak; banyak check untuk SKU non-kritis",
      fix: `Batasi Products ke ${kopi.name}/${teh.name} atau kategori Bahan Minuman`,
      prevent: "Desain point sempit; review coverage tiap kuartal",
    },
    {
      id: "m-qc-skip-validate",
      problem: "Validate receipt meski check masih none",
      why: "Barang cacat masuk available; jejak QC bohong",
      detect: "Picking Done + check status kosong/none pada tanggal sama",
      fix: "Aktifkan blokir validate / selesaikan check retroaktif + audit",
      prevent: "Training WH + policy sistem: no Pass, no Validate",
    },
    {
      id: "m-qc-fail-no-alert",
      problem: "Fail tanpa Quality Alert / tanpa Return",
      why: "Tidak ada CAPA; stok cacat bisa tetap terpakai",
      detect: "Fail count naik di reporting, alert 0; on-hand tidak turun",
      fix: "Buat alert, assign owner, eksekusi Return/Scrap",
      prevent: "SOP wajib Fail → Alert → keputusan stok dalam 24 jam",
    },
    {
      id: "m-qc-wrong-operation",
      problem: "Operations di point salah (mis. Delivery padahal ingin Receipts)",
      why: "Check tidak pernah muncul; tim kira Quality 'rusak'",
      detect: "Point aktif tapi quality.check = 0 setelah banyak receipt",
      fix: "Edit point → pilih operation type yang benar; uji ulang 1 receipt",
      prevent: "Checklist uji end-to-end wajib setelah create point",
    },
    {
      id: "m-qc-measure-no-tool",
      problem: "Type Measure tanpa alat ukur / toleransi jelas",
      why: "Nilai diisi asal; keputusan Pass/Fail tidak valid",
      detect: "Nilai measure identik terus atau kosong diganti Pass manual",
      fix: "Ubah ke Pass-Fail sementara atau sediakan alat + spek toleransi",
      prevent: "Jangan pilih Measure sebelum metrology siap",
    },
    {
      id: "m-qc-no-lot",
      problem: "Produk pangan tanpa lot tracking saat QC Fail",
      why: "Recall dan claim vendor tidak bisa menunjuk batch",
      detect: "Alert Fail tanpa lot; inventory valuation campur",
      fix: "Aktifkan tracking lot pada ${kopi.name}; terapkan ke receipt berikutnya",
      prevent: "SKU QC-kritis = always lot/serial sebelum go-live Quality",
    },
  ],
  troubleshooting: [
    {
      id: "t-qc-no-check",
      problem: "Quality Check tidak terbuat saat receipt/MO",
      causes: [
        "Products di point tidak match baris picking",
        "Operations beda picking type (Receipts vs Internal)",
        "Point di-archive / inactive",
        "Frequency sampling melewatkan operasi ini",
        "Quality app tidak terpasang di company DB",
      ],
      diagnosis: [
        "Buka Control Point — cek Products, Categories, Operations, active",
        "Bandingkan picking type receipt dengan Operations point",
        "Cek apakah produk di move line = ${kopi.name}",
        "Uji dengan Frequency All pada 1 receipt laboratorium",
      ],
      solution: [
        "Sesuaikan Products/Operations",
        "Unarchive point",
        "Buat check manual hanya untuk darurat; perbaiki point untuk jangka panjang",
        "Ulangi receipt draft baru setelah koreksi",
      ],
      prevention:
        "Setiap Control Point baru wajib punya skenario uji: 1 PO → 1 Receipt → check muncul",
    },
    {
      id: "t-qc-block-validate",
      problem: "Tidak bisa Validate picking karena Quality",
      causes: [
        "Check masih pending (none)",
        "Fail belum ada keputusan stok",
        "User WH tidak boleh override",
      ],
      diagnosis: [
        "Smart button Quality pada picking — status apa?",
        "Buka quality.check terkait — Pass/Fail/none",
        "Cek group user: Inventory vs Quality",
      ],
      solution: [
        "Selesaikan Pass/Fail dengan inspector",
        "Jika Fail: Return/Scrap sesuai SOP lalu lanjut dokumen terkait",
        "Manager Quality meninjau override hanya jika kebijakan perusahaan mengizinkan",
      ],
      prevention:
        "Jadwalkan inspector standby pada window goods receipt; jangan biarkan WH validate tanpa QC",
    },
    {
      id: "t-qc-access-pass",
      problem: "User tidak bisa Pass/Fail Quality Check",
      causes: [
        "Bukan Quality User / Manager",
        "Record rule team membatasi",
        "Check sudah di-lock setelah Done picking",
      ],
      diagnosis: [
        "Settings → Users → Access Rights: Quality",
        "Coba login user Quality known-good",
        "Lihat apakah check read-only",
      ],
      solution: [
        "Tambah group Quality User pada operator yang bertugas",
        "Sesuaikan team membership",
        "Untuk koreksi historis: Manager + prosedur audit",
      ],
      prevention: "Role matrix jelas: siapa WH validate vs siapa QC Pass",
    },
    {
      id: "t-qc-alert-stuck",
      problem: "Quality Alert menumpuk di stage New",
      causes: [
        "Tidak ada assignee",
        "Tidak ada meeting triage",
        "Fail dianggap selesai hanya di check",
      ],
      diagnosis: [
        "Overview → Alerts count",
        "Filter alert tanpa user_id / assignee",
        "Cek umur alert > N hari",
      ],
      solution: [
        "Daily triage 15 menit: assign + stage",
        "Tutup alert dengan corrective action tertulis",
        "Eskalasi Fail vendor ke Purchase",
      ],
      prevention: "KPI: alert New tidak lebih dari X di akhir hari",
    },
    {
      id: "t-qc-wrong-company",
      problem: "Point ada di satu company, receipt di company lain (multi-company)",
      causes: [
        "quality.point.company_id tidak match",
        "Produk/operation beda company",
      ],
      diagnosis: [
        "Cek company di point, picking, product",
        "Switch company di switcher Odoo",
      ],
      solution: [
        "Duplikasi / set company point yang benar",
        "Samakan master produk antar company jika memang shared",
      ],
      prevention: "Saat setup multi-company, matrix point per company didokumentasikan",
    },
  ],
  behind: {
    models: [
      "quality.point",
      "quality.check",
      "quality.alert",
      "quality.alert.team",
      "stock.picking",
      "stock.move",
      "mrp.production",
      "product.product",
      "stock.lot",
    ],
    relations: [
      "quality.check.point_id → quality.point",
      "quality.check.picking_id → stock.picking (incoming/outgoing/internal)",
      "quality.check.production_id → mrp.production",
      "quality.check.product_id → product.product",
      "quality.check.lot_id → stock.lot",
      "quality.alert dari Fail check / manual; team_id → quality.alert.team",
      "point.picking_type_ids / operation links menentukan trigger",
    ],
    automations: [
      "On picking/MO match domain point → create quality.check",
      "Pass/Fail buttons update quality.state & timestamp / user",
      "Fail → optional wizard create quality.alert",
      "Quality controls on picking dapat mencegah validate jika checks unfinished",
      "Overview aggregates open checks & alerts per team",
    ],
    securityNotes: [
      "quality.group_quality_user — eksekusi checks & alerts operasional",
      "quality.group_quality_manager — control points, teams, settings, full reporting",
      "Pisahkan hak validate stock.picking dari hak Pass QC untuk segregasi tugas",
      "Portal customer biasanya tidak mengakses Quality internal (beda dari Helpdesk)",
    ],
    note: "Enterprise Quality terintegrasi kuat ke Inventory & MRP operations. Desain Control Point yang sempit + SOP Fail→Alert adalah kunci adopsi; over-check membuat modul diabaikan operator.",
  },
  reporting: [
    {
      name: "Quality Checks Analysis",
      path: "Quality → Reporting → Quality Checks",
      kpi: "Pass rate %, volume check, lead time inspeksi",
      decision:
        "Perbaiki proses vendor/produksi jika Pass rate turun; tambah kapasitas inspector jika WIP check tinggi",
    },
    {
      name: "Quality Overview",
      path: "Quality → Overview",
      kpi: "Checks in progress, alerts open, beban per team",
      decision: "Alokasi inspector harian; eskalasi alert menua",
    },
    {
      name: "Quality Alerts",
      path: "Quality → Quality Alerts / Reporting Alerts",
      kpi: "Jumlah alert per produk/vendor/root cause",
      decision: `Pareto: fokus CAPA pada ${kopi.name} × ${vendor.name} jika dominan`,
    },
    {
      name: "Control Points coverage",
      path: "Quality → Control Points (list + filter active)",
      kpi: "SKU kritis punya point? Operations cover Receipts & MO?",
      decision: "Tambah point untuk gap; archive point yang tidak pernah trigger",
    },
    {
      name: "Vendor quality linkage",
      path: "Purchase reporting + Quality Alerts filter Partner",
      kpi: "Fail rate per vendor pada periode",
      decision: "Warning, audit vendor, atau ganti sumber bahan",
    },
  ],
  security: {
    roles: [
      {
        role: "Quality User",
        can: [
          "Melihat & mengeksekusi Quality Checks (Pass/Fail/Measure)",
          "Membuat dan mengisi Quality Alerts",
          "Menambah catatan/chatter pada check",
        ],
        cannot: [
          "Mengubah massal Control Points (jika dibatasi ke Manager)",
          "Mengubah Settings Quality global",
          "Posting Accounting / approve PO di luar hak lain",
        ],
        whyDifferent:
          "Inspector fokus eksekusi lapangan; desain sistem QC di tangan Manager.",
      },
      {
        role: "Quality Manager",
        can: [
          "CRUD Control Points & Quality Teams",
          "Settings Quality",
          "Reporting penuh & penutupan alert strategis",
          "Override / koreksi sesuai SOP perusahaan",
        ],
        cannot: [
          "Menggantikan peran Accountant",
          "Menghapus jejak audit secara diam-diam tanpa prosedur",
        ],
        whyDifferent:
          "Bertanggung jawab desain gate QC dan CAPA, bukan transaksi keuangan.",
      },
      {
        role: "Inventory / Warehouse User",
        can: [
          "Membuat & validate picking setelah syarat QC terpenuhi",
          "Melihat smart button Quality pada receipt",
        ],
        cannot: [
          "Pass/Fail check jika tidak punya group Quality",
          "Mengubah Control Points",
        ],
        whyDifferent:
          "Segregasi: WH menggerakkan barang; QC memutus layak/tidak.",
      },
      {
        role: "Manufacturing User",
        can: [
          "Menjalankan MO/WO",
          "Melihat check terkait produksi",
        ],
        cannot: [
          "Menutup mata terhadap Fail dan memaksa Done tanpa hak",
        ],
        whyDifferent:
          "Produksi butuh gate kualitas agar FG tidak lolos cacat.",
      },
    ],
    notes: [
      "Pisahkan user WH validate vs QC Pass bila audit internal menuntut segregasi",
      "Jangan bagikan akun Manager untuk operator lantai",
      "Lot tracking + Checked By memperkuat bukti saat dispute vendor",
      "Multi-company: pastikan point dan user company-nya selaras",
    ],
  },
  levels: {
    beginner: [
      "Buka Quality → Overview dan kenali angka Checks / Alerts",
      "Buka Quality Checks; praktik Pass pada check latihan",
      "Baca Instructions pada Control Point incoming",
      "Lihat smart button Quality di Inventory Receipt",
    ],
    intermediate: [
      `Buat Control Point Receipts untuk ${kopi.name}`,
      "Jalankan PO → Receipt → Pass → Validate end-to-end",
      "Simulasi Fail + buat Quality Alert + Return",
      "Assign Quality Team dan filter Overview per team",
    ],
    advanced: [
      "Control Point Type Measure dengan toleransi",
      "QC in-process pada Manufacturing Order",
      "Frequency sampling untuk SKU volume tinggi",
      "Gabungkan Fail rate ke evaluasi vendor di Purchase",
      "Barcode + Quality di goods receipt",
    ],
    expert: [
      "Matriks Control Point per kategori produk × operation × pabrik",
      "CAPA bulanan dari Quality Alerts + root cause taxonomy",
      "Integrasi Quality dengan PLM/spec change saat Fail desain",
      "KPI Pass rate & alert aging di dashboard manajemen",
      "Segregasi hak & prosedur override terdokumentasi untuk audit eksternal",
    ],
  },
  exercises: [
    {
      id: "ex-qc-point-kopi",
      title: `Control Point incoming ${kopi.name}`,
      objective: "Point aktif memicu check pada Receipts untuk SKU kopi.",
      prerequisites: [
        "Quality installed",
        `Produk ${kopi.name} ada`,
        "Quality Team ada",
      ],
      task: [
        "Control Points → New",
        `Products = ${kopi.name}`,
        "Operations = Receipts",
        "Type = Pass - Fail; Save",
        "Tunjukkan point di list",
      ],
      expectedResult: "Point terlihat di Control Points dengan operation Receipts.",
      checklist: [
        "Title jelas (mengandung Incoming + nama produk)",
        "Products tidak kosong",
        "Operations = Receipts",
        "Tidak ter-archive",
      ],
    },
    {
      id: "ex-qc-pass-receipt",
      title: "Pass check lalu Validate receipt",
      objective: "Menyelesaikan inspeksi incoming sampai stok bertambah.",
      prerequisites: [
        "Control Point incoming aktif",
        `PO/receipt ${kopi.name} dari ${vendor.name}`,
      ],
      task: [
        "Buka receipt terkait",
        "Buka Quality Check",
        "Pass + isi catatan",
        "Validate receipt",
        "Cek on-hand",
      ],
      expectedResult: "Check Pass; receipt Done; stok naik.",
      checklist: [
        "Checked By terisi",
        "Status bukan none",
        "Qty on-hand sesuai",
      ],
    },
    {
      id: "ex-qc-fail-alert",
      title: "Simulasi Fail + Alert + keputusan stok",
      objective: "Latihan CAPA singkat saat barang cacat.",
      prerequisites: [
        "Check pending atau buat receipt baru untuk Fail",
        "Akses Quality Alerts",
      ],
      task: [
        "Fail check dengan alasan tertulis",
        `Buat Alert product ${kopi.name} partner ${vendor.name}`,
        "Assign investigator",
        "Return atau Scrap sesuai instruktur",
        "Tutup/stage alert",
      ],
      expectedResult: "Alert tercatat; stok tidak lolos tanpa keputusan.",
      checklist: [
        "Alasan Fail di notes",
        "Alert punya product + partner",
        "Ada tindakan stok (return/scrap)",
      ],
    },
    {
      id: "ex-qc-mrp-or-measure",
      title: "QC Manufacturing atau Measure (pilih jalur lab)",
      objective: "Memperdalam tipe kontrol di luar Pass-Fail incoming sederhana.",
      prerequisites: [
        "Jalur A: Manufacturing + BoM siap",
        "Jalur B: alat ukur + spek toleransi untuk Measure",
      ],
      task: [
        "Jalur A: buat point Manufacturing; jalankan MO; Pass check packing",
        "ATAU Jalur B: ubah/buat point Measure; input nilai; amati Pass/Fail toleransi",
        "Dokumentasikan screenshot hasil check",
      ],
      expectedResult: "Check non-incoming selesai dengan jejak Type yang benar.",
      checklist: [
        "Point Type sesuai jalur",
        "Dokumen sumber (MO atau receipt) terhubung",
        "Hasil tercatat di Quality Checks",
      ],
    },
    {
      id: "ex-qc-overview-report",
      title: "Triage Overview + baca reporting Pass rate",
      objective: "Quality Manager memantau beban dan memutus prioritas CAPA.",
      prerequisites: [
        "Minimal beberapa checks & ≥1 alert di database latihan",
      ],
      task: [
        "Buka Quality → Overview; catat angka in progress",
        "Selesaikan 1 check pending",
        "Assign 1 alert",
        "Buka Reporting Checks — filter produk ${kopi.name}",
        "Tulis rekomendasi singkat ke Purchase jika ada Fail",
      ],
      expectedResult: "Antrian berkurang; ada catatan keputusan berbasis data.",
      checklist: [
        "Overview dibaca sebelum list acak",
        "Minimal 1 check diselesaikan dalam sesi",
        "Ada kesimpulan Pass rate / Fail vendor",
      ],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Inventory", href: "/materi/inventory" },
    { label: "Deep Dive Manufacturing", href: "/materi/manufacturing" },
    { label: "Deep Dive Purchase", href: "/materi/purchase" },
    {
      label: "Core Flow: Purchase → Receive & Bill",
      href: "/modul/flow-purchase/receive-and-bill",
    },
  ],
};
