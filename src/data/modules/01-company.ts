import type { SyllabusModule } from "../types";

export const companyModule: SyllabusModule = {
  slug: "setup-perusahaan",
  number: "01",
  title: "Setup Perusahaan & Konfigurasi Dasar",
  shortTitle: "Perusahaan",
  icon: "Building2",
  color: "amber",
  plainSummary:
    "Isi identitas perusahaan latihan Anda (nama, alamat, mata uang) supaya dokumen PO/Invoice terlihat rapi.",
  description:
    "Melengkapi data perusahaan, mata uang, bahasa, timezone, fiscal localization, dan settings awal tiap app sebelum master data transaksi.",
  apps: ["Settings", "Contacts", "Invoicing"],
  outcomes: [
    "Melengkapi profil perusahaan (alamat, NPWP/VAT, logo)",
    "Memilih fiscal localization / chart template yang tepat",
    "Mengatur currency, language, dan timezone",
    "Mengaktifkan fitur settings yang dibutuhkan silabus",
  ],
  lessons: [
    {
      slug: "profil-perusahaan",
      title: "Profil Perusahaan (Company)",
      duration: "35 menit",
      summary:
        "Company = “identitas toko/perusahaan” di Odoo. Nama & alamat di sini ikut tercetak di PO, SO, dan Invoice.",
      beginnerIntro:
        "Anggap ini seperti mengisi profil toko di marketplace. Belum perlu paham akuntansi — cukup isi nama, alamat, dan kontak yang benar.",
      objectives: [
        "Membuka data perusahaan default",
        "Mengisi nama & alamat lengkap",
        "Menyimpan logo (opsional tapi bagus untuk latihan cetak)",
      ],
      steps: [
        {
          id: "buka-company",
          title: "Buka form Company",
          menuPath: "Settings → Companies → Update Info",
          clickPath: ["Settings", "Companies / Update Info"],
          goal: "Form perusahaan terbuka dan siap diedit.",
          why: "Tanpa membuka form ini, Anda tidak bisa mengganti nama/alamat yang muncul di dokumen.",
          actions: [
            "Dari Home Apps, klik Settings (ikon gerigi).",
            "Cari bagian Companies. Klik nama company atau tombol Update Info.",
            "Alternatif: di Settings, buka Users & Companies → Companies → klik baris company.",
            "Pastikan Anda melihat form dengan field Company Name dan Address.",
          ],
          expectToSee: "Form company terbuka (bukan hanya halaman Settings umum).",
          screen: {
            kind: "settings",
            app: "Settings",
            menu: "General Settings",
            title: "Settings",
            subtitle: "Companies",
            fields: [
              { label: "Company Name", value: "My Company (San Francisco)", required: true },
              { label: "Action", value: "Update Info / Edit" },
            ],
            buttons: ["Save", "Discard"],
            highlight: "Klik company untuk mengedit profil lengkap",
          },
        },
        {
          id: "isi-identitas",
          title: "Isi identitas & alamat",
          menuPath: "Company form → tab General Information",
          goal: "Data legal & alamat pengiriman/tagihan company lengkap.",
          why: "Alamat company muncul di PDF PO/SO/Invoice; kosong = dokumen tidak profesional & sering ditolak vendor.",
          actions: [
            "Ubah Company Name menjadi misalnya: PT Nusantara Functional Demo.",
            "Isi Street, City, State, ZIP, Country (Indonesia).",
            "Isi Phone, Email, Website.",
            "Isi Tax ID / VAT sesuai simulasi (contoh: 10.0.0.1-000.000).",
            "Upload Company Logo (PNG transparan lebih baik).",
            "Save.",
          ],
          tips: [
            "Untuk latihan ID, set Country = Indonesia agar format alamat & pajak lebih relevan.",
            "Currency company biasanya IDR setelah localization; bisa juga biarkan USD dulu lalu ganti.",
          ],
          screen: {
            kind: "form",
            app: "Settings",
            menu: "Companies",
            title: "PT Nusantara Functional Demo",
            breadcrumb: ["Settings", "Companies", "PT Nusantara Functional Demo"],
            tabs: ["General Information", "Branches"],
            activeTab: "General Information",
            fields: [
              { label: "Company Name", value: "PT Nusantara Functional Demo", required: true },
              { label: "Address", value: "Jl. Sudirman No. 1, Jakarta", required: true },
              { label: "Country", value: "Indonesia", required: true },
              { label: "Tax ID", value: "10.0.0.1-000.000" },
              { label: "Currency", value: "IDR" },
              { label: "Phone", value: "+62 21 0000 0000" },
              { label: "Email", value: "finance@nusantara-demo.test" },
            ],
            buttons: ["Save", "Discard"],
            chatter: ["Company created", "Logo updated"],
          },
        },
      ],
      checklist: [
        "Nama & alamat company sudah diisi",
        "Logo terpasang",
        "Tax ID terisi (simulasi)",
      ],
    },
    {
      slug: "localization-currency",
      title: "Fiscal Localization, Currency & Bahasa",
      duration: "40 menit",
      summary:
        "Pilih “paket negara” (pajak & akun), aktifkan mata uang, dan set zona waktu agar tanggal transaksi tidak geser.",
      beginnerIntro:
        "Bagian ini sedikit lebih “setting”. Kerjakan pelan. Intinya: negara/pajak dulu, baru isi transaksi — supaya tidak berantakan belakangan.",
      objectives: [
        "Memilih/memasang localization package",
        "Memastikan currency company benar",
        "Set bahasa & timezone user admin",
      ],
      flow: {
        title: "Urutan setup company yang aman",
        description: "Localization dulu, baru master data accounting & produk.",
        nodes: [
          { id: "co", label: "Edit Company", type: "start" },
          { id: "loc", label: "Fiscal Localization", type: "process" },
          { id: "cur", label: "Currency & Rates", type: "process" },
          { id: "feat", label: "Aktifkan Settings\nfitur modul", type: "process" },
          { id: "md", label: "Master Data", type: "end" },
        ],
        edges: [
          { from: "co", to: "loc" },
          { from: "loc", to: "cur" },
          { from: "cur", to: "feat" },
          { from: "feat", to: "md" },
        ],
      },
      steps: [
        {
          id: "fiscal-pack",
          title: "Set Fiscal Localization",
          menuPath: "Accounting/Invoicing → Configuration → Settings → Fiscal Localization",
          goal: "Memasang paket chart of accounts & pajak negara.",
          why: "Mengganti localization belakangan di DB yang sudah ada transaksi sangat berisiko.",
          actions: [
            "Buka Invoicing/Accounting → Configuration → Settings.",
            "Di Fiscal Localization, pilih Package (mis. Indonesia) jika tersedia di edisi Anda.",
            "Save — Odoo akan meng-generate CoA, taxes, dan journals dasar.",
            "Jika hanya Invoicing ringan tanpa pack negara, lanjut dengan CoA generic lalu sesuaikan manual.",
          ],
          pitfalls: [
            "Mengisi transaksi dulu baru ganti localization → inkonsistensi akun.",
          ],
          screen: {
            kind: "settings",
            app: "Invoicing",
            menu: "Configuration / Settings",
            title: "Accounting Settings",
            fields: [
              { label: "Fiscal Localization Package", value: "Indonesia", required: true },
              { label: "Cash Basis", value: "Off (default Accrual)" },
              { label: "Analytic Accounting", value: "Opsional — aktifkan jika perlu" },
            ],
            buttons: ["Save"],
            highlight: "Lakukan sebelum input transaksi",
          },
        },
        {
          id: "currency-lang",
          title: "Currency, Language, Timezone",
          menuPath: "Settings → Languages / Currencies; User menu → Preferences",
          goal: "IDR aktif, bahasa UI sesuai preferensi, timezone Asia/Jakarta.",
          why: "Timezone salah = tanggal accounting & inventory shifting.",
          actions: [
            "Settings → Currencies: aktifkan IDR (Active).",
            "Pastikan company currency = IDR (atau currency latihan Anda).",
            "Settings → Translations → Languages: aktifkan Indonesian (ID) jika ingin UI Bahasa Indonesia.",
            "Klik foto user (kanan atas) → Preferences → Timezone = Asia/Jakarta → Language sesuai → Save.",
          ],
          screen: {
            kind: "form",
            app: "Settings",
            menu: "Preferences",
            title: "Administrator Preferences",
            fields: [
              { label: "Language", value: "Indonesian / English", required: true },
              { label: "Timezone", value: "Asia/Jakarta", required: true },
              { label: "Notification", value: "Handle by Emails / Odoo" },
            ],
            buttons: ["Save"],
          },
        },
        {
          id: "feature-flags",
          title: "Aktifkan fitur settings per modul",
          menuPath: "Tiap App → Configuration → Settings",
          goal: "Menyalakan opsi yang dipakai di silabus tanpa mengaktifkan semua fitur sekaligus.",
          why: "Terlalu banyak fitur = UI ramai. Aktifkan bertahap sesuai lesson.",
          actions: [
            "Purchase Settings: aktifkan “Purchase Agreements” hanya jika perlu; pastikan 3-way matching dipahami (PO–Receipt–Bill).",
            "Inventory Settings: Units of Measure = ON; Storage Locations = ON (untuk belajar lokasi); Multi-Step Routes = ON bertahap.",
            "Sales Settings: Product Variants opsional; Online Signature opsional; Lock Confirmed Sales = ON untuk disiplin.",
            "Invoicing Settings: Payment Terms, Default Incoterm opsional; Cash Rounding jika perlu.",
            "Save setiap halaman settings.",
          ],
          tips: [
            "Catat fitur yang Anda aktifkan di notes pribadi agar reproducible.",
          ],
          screen: {
            kind: "settings",
            app: "Inventory",
            menu: "Configuration / Settings",
            title: "Inventory Settings",
            fields: [
              { label: "Units of Measure", value: "✓ Enabled", required: true },
              { label: "Storage Locations", value: "✓ Enabled" },
              { label: "Multi-Step Routes", value: "✓ Enabled (untuk advanced)" },
              { label: "Product Packagings", value: "Opsional" },
            ],
            buttons: ["Save"],
            note: "Setelah Save, refresh menu — item Configuration baru bisa muncul.",
          },
        },
      ],
      checklist: [
        "Localization / CoA dasar siap",
        "Currency & timezone benar",
        "UoM & Storage Locations aktif",
      ],
    },
  ],
};
