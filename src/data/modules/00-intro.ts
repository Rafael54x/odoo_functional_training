import type { SyllabusModule } from "../types";
import { odooLab } from "../odoo-lab";

export const introModule: SyllabusModule = {
  slug: "pengenalan",
  number: "00",
  title: "Mulai dari Nol: Mengenal Odoo",
  shortTitle: "Mulai dari Nol",
  icon: "Rocket",
  color: "teal",
  plainSummary:
    "Pahami apa itu Odoo, cara login, dan cara membuka aplikasi — tanpa asumsi Anda sudah pernah pakai ERP.",
  description:
    "Fondasi untuk pemula: istilah dasar, cara navigasi, login ke database latihan, dan memasang modul yang dibutuhkan.",
  apps: ["Discuss", "Settings", "Apps"],
  outcomes: [
    "Tahu bedanya Apps, menu, form, dan list",
    `Bisa login ke database ${odooLab.database} di ${odooLab.url}`,
    "Bisa menginstal modul Contacts, Sales, Purchase, Inventory, Accounting",
    "Paham gambaran besar: beli barang → simpan stok → jual → tagih uang",
  ],
  lessons: [
    {
      slug: "apa-itu-odoo-functional",
      title: "Apa itu Odoo Functional? (untuk pemula)",
      duration: "30 menit",
      summary:
        "Odoo adalah software bisnis (ERP). Functional berarti Anda belajar mengisi data dan menjalankan transaksi harian — bukan menulis kode.",
      beginnerIntro:
        "Kalau Anda baru sekali buka Odoo, mulai di sini. Kita pakai bahasa sederhana dulu. Istilah teknis akan muncul pelan-pelan dan selalu dijelaskan.",
      objectives: [
        "Mengerti Odoo dipakai untuk apa di perusahaan",
        "Mengenal istilah: Apps, menu, form, list, status",
        "Melihat peta besar alur beli → stok → jual → invoice",
      ],
      prerequisites: [
        `Browser terbuka, alamat lab: ${odooLab.url}`,
        "Belum wajib paham akuntansi atau stok",
      ],
      flow: {
        title: "Cerita bisnis sederhana yang akan kita pelajari",
        description:
          "Bayangkan toko kopi: beli biji dari supplier, simpan di gudang, jual ke pelanggan, lalu tagih pembayaran.",
        nodes: [
          { id: "md", label: "Siapkan data\n(kontak, produk)", type: "start" },
          { id: "po", label: "Beli barang\n(Purchase)", type: "process" },
          { id: "inv", label: "Masuk gudang\n(Inventory)", type: "process" },
          { id: "so", label: "Jual barang\n(Sales)", type: "process" },
          { id: "acc", label: "Tagih & bayar\n(Accounting)", type: "end" },
        ],
        edges: [
          { from: "md", to: "po" },
          { from: "po", to: "inv", label: "barang datang" },
          { from: "md", to: "so" },
          { from: "so", to: "inv", label: "barang keluar" },
          { from: "po", to: "acc", label: "tagihan vendor" },
          { from: "so", to: "acc", label: "invoice customer" },
        ],
      },
      steps: [
        {
          id: "konsep-apps",
          title: "Mengenal layar utama Odoo",
          menuPath: "Setelah login → Home / Apps",
          clickPath: ["Login", "Home Apps", "Ikon 9 titik"],
          goal: "Anda bisa menjelaskan bagian-bagian layar utama Odoo sebelum mengisi data apa pun.",
          why: "Kalau tidak kenal tombol dasar, Anda akan sering “hilang” mencari menu di langkah berikutnya.",
          glossary: [
            {
              term: "Apps",
              meaning:
                "Kotak aplikasi (Purchase, Sales, Inventory, dll). Satu app = satu area kerja.",
            },
            {
              term: "List",
              meaning: "Tampilan tabel berisi banyak data (misalnya daftar kontak).",
            },
            {
              term: "Form",
              meaning: "Halaman detail satu data (misalnya satu Purchase Order).",
            },
            {
              term: "Status",
              meaning:
                "Posisi dokumen di alur kerja, misalnya Draft → Confirmed → Done.",
            },
            {
              term: "Chatter",
              meaning:
                "Panel catatan & riwayat di kanan/bawah form — siapa mengubah apa.",
            },
          ],
          actions: [
            "Bayangkan Odoo seperti “kantor digital”: tiap ruangan adalah Apps (Purchase, Sales, Inventory, Accounting).",
            "Di pojok kiri atas biasanya ada ikon kotak 9 titik — itu tombol untuk ganti Apps / kembali ke Home.",
            "Setelah masuk satu Apps, menu di atas (Orders, Products, Reporting, Configuration) adalah loker di dalam ruangan itu.",
            "Tombol New biasanya membuat data baru. Tombol Save (atau ikon disket) menyimpan.",
            "Status di kanan atas form menunjukkan tahap dokumen (Draft, Confirmed, Done, dll).",
            "Di kanan/bawah form sering ada “chatter”: tempat catatan, pesan, dan riwayat perubahan.",
            "Kalau tersesat: klik ikon 9 titik → pilih ulang aplikasinya → ulangi jalur menu di silabus.",
            "Jangan hafalkan semua menu dulu — ikuti clickPath yang tertulis di setiap langkah.",
          ],
          expectToSee:
            "Anda paham: Apps = ruangan, menu = loker, form = satu dokumen, status = tahap proses. Siap login ke lab.",
          tips: [
            "Tulis di kertas: Apps → menu → New → isi → Save → Confirm. Pola ini berulang di semua modul.",
            "Di Enterprise, Home Apps menampilkan grid ikon — sama seperti screenshot di samping.",
          ],
          pitfalls: [
            "Mengklik sembarang menu Configuration sebelum paham transaksi — UI jadi ramai dan membingungkan.",
          ],
          screen: {
            kind: "apps",
            app: "Home",
            menu: "Apps",
            title: "Apps Odoo 19",
            subtitle: `${odooLab.edition} · ${odooLab.url}`,
            note: "Ini contoh home Apps. Modul yang belum diinstal belum muncul di sini.",
            rows: [
              ["Contacts", "Sales", "Purchase"],
              ["Inventory", "Accounting", "Discuss"],
              ["Project", "CRM", "Settings"],
            ],
          },
        },
        {
          id: "login-db",
          title: `Login ke database latihan (${odooLab.database})`,
          menuPath: `Browser → ${odooLab.url} → database ${odooLab.database}`,
          clickPath: ["Browser", odooLab.url, "Pilih DB", "Log in"],
          goal: `Anda berhasil masuk sebagai ${odooLab.user} ke database ${odooLab.database} di ${odooLab.name}.`,
          why: `Semua latihan silabus ini memakai instance ${odooLab.edition} di ${odooLab.hostLabel}, database ${odooLab.database}. Login ke DB lain = data latihan “hilang”.`,
          glossary: [
            {
              term: odooLab.name,
              meaning: `Nama instance latihan Odoo di ${odooLab.hostLabel} (port 8072).`,
            },
            {
              term: "Database",
              meaning:
                "“Buku besar” data Odoo Anda. Satu perusahaan latihan = satu database.",
            },
            {
              term: `${odooLab.user} / ${odooLab.password}`,
              meaning: "Username dan password default untuk database latihan ini.",
            },
          ],
          actions: [
            "Buka browser Chrome/Firefox (disarankan full window, bukan HP).",
            `Di bilah alamat, ketik persis: ${odooLab.url}`,
            "Tekan Enter. Tunggu halaman login Odoo muncul (bukan error koneksi).",
            `Jika muncul pilihan database, pilih: ${odooLab.database}. Jangan pilih database lain.`,
            `Klik field Email / Username, ketik: ${odooLab.user}`,
            `Klik field Password, ketik: ${odooLab.password}`,
            "Klik tombol Log in (biru).",
            "Tunggu 2–5 detik sampai muncul Home Apps (grid ikon aplikasi).",
            "Lihat pojok kanan atas: harus ada avatar/nama Administrator — artinya Anda sudah masuk.",
            `Cek URL browser masih mengarah ke ${odooLab.url} (bukan server lain).`,
          ],
          fillFields: [
            {
              field: "Database",
              value: odooLab.database,
              where: "Layar login / selector DB",
              how: "Pilih",
              required: true,
              note: "Wajib database odoo — bukan database lain di server yang sama",
            },
            {
              field: "Email / Username",
              value: odooLab.user,
              where: "Form login",
              how: "Ketik",
              required: true,
            },
            {
              field: "Password",
              value: odooLab.password,
              where: "Form login",
              how: "Ketik",
              required: true,
            },
          ],
          expectToSee:
            "Halaman login hilang diganti Home Apps. Pojok kanan atas menampilkan user admin. Tidak ada pesan Access Denied / Wrong password.",
          tips: [
            `Bookmark ${odooLab.url} agar cepat dibuka lagi.`,
            "Untuk latihan kelas, jangan ganti password dulu supaya semua peserta sama.",
            `Catat di sticky note: ${odooLab.url} · DB ${odooLab.database} · ${odooLab.user}/${odooLab.password}`,
          ],
          pitfalls: [
            "Login ke database salah → data latihan seolah “hilang”.",
            `Kalau halaman tidak terbuka, pastikan instance ${odooLab.name} di ${odooLab.hostLabel} sedang running (port 8072).`,
            "Capslock / autofill password salah sering bikin gagal login.",
          ],
          screen: {
            kind: "login",
            app: "Login",
            menu: odooLab.url,
            title: "Login Odoo 19 Enterprise",
            subtitle: `Database: ${odooLab.database} · ${odooLab.name}`,
            fields: [
              { label: "Email", value: odooLab.user, required: true },
              { label: "Password", value: odooLab.password, required: true },
              { label: "Database", value: odooLab.database, required: true },
            ],
            buttons: ["Log in"],
            highlight: `${odooLab.user} / ${odooLab.password}`,
            note: `Target lab: ${odooLab.url}`,
          },
        },
      ],
      checklist: [
        "Sudah paham Apps vs menu vs form",
        `Sudah berhasil login ke database ${odooLab.database}`,
        "Siap lanjut instal modul",
      ],
    },
    {
      slug: "instalasi-modul-standar",
      title: "Pasang modul yang akan dipakai",
      duration: "40 menit",
      summary:
        "Modul = fitur. Kita pasang Contacts, Inventory, Purchase, Sales, dan Accounting agar menu transaksi muncul.",
      beginnerIntro:
        "Database baru sering masih “kosong” fiturnya. Seperti mengaktifkan aplikasi di HP sebelum bisa dipakai. Ikuti urutan di bawah agar tidak bingung.",
      objectives: [
        "Menemukan menu Apps",
        "Menginstal modul satu per satu dengan tenang",
        "Memastikan menu Purchase/Inventory/Sales/Accounting sudah muncul",
      ],
      prerequisites: [
        `Sudah login ke ${odooLab.url} sebagai ${odooLab.user}`,
      ],
      steps: [
        {
          id: "update-apps-list",
          title: "Refresh daftar aplikasi (Update Apps List)",
          menuPath: "Apps → Update Apps List",
          clickPath: ["Home", "Apps", "Update Apps List", "Update"],
          goal: "Daftar modul di database sudah terbaru sebelum Anda mencari Contacts/Purchase.",
          why: "Kadang modul ada di server tapi belum muncul di pencarian sampai daftar di-refresh.",
          actions: [
            "Dari Home Apps, klik ikon Apps (atau Applications).",
            "Tunggu list/kanban modul muncul.",
            "Cari tombol atau menu Update Apps List (sering di kanan atas, atau menu ⋮ / dropdown).",
            "Klik Update Apps List.",
            "Di jendela konfirmasi, klik Update.",
            "Tunggu progress selesai — jangan close tab / refresh di tengah proses.",
            "Setelah selesai, Anda kembali ke daftar Apps.",
            "Di filter pencarian Apps, pastikan filter “Apps” aktif (bukan “Extra”).",
          ],
          expectToSee:
            "Wizard Update selesai tanpa error merah. Kotak Search Apps siap dipakai untuk mencari Contacts.",
          tips: [
            "Kalau tidak menemukan Update Apps List: di mode developer (Settings → Activate Developer Mode) menu ini lebih mudah terlihat.",
          ],
          pitfalls: [
            "Menutup tab saat update → daftar modul bisa setengah sinkron; ulangi Update Apps List.",
          ],
          screen: {
            kind: "wizard",
            app: "Apps",
            menu: "Update Apps List",
            title: "Update Apps List",
            subtitle: "Sinkronkan daftar modul",
            buttons: ["Update", "Cancel"],
            fields: [
              { label: "Action", value: "Update Apps List", required: true },
            ],
          },
        },
        {
          id: "install-contacts",
          title: "Install Contacts (buku alamat)",
          menuPath: "Apps → cari Contacts → Install",
          clickPath: ["Apps", "Search: Contacts", "Kartu Contacts", "Install"],
          goal: "Modul Contacts terpasang dan ikonnya muncul di Home.",
          why: "Hampir semua transaksi butuh nama customer/vendor. Contacts adalah tempat menyimpan itu.",
          actions: [
            "Tetap di Apps.",
            "Klik kotak Search di atas.",
            "Ketik: Contacts",
            "Tekan Enter.",
            "Pastikan kartu bertitel Contacts (bukan Contacts Directory lain).",
            "Klik kartu Contacts agar terbuka detail (opsional).",
            "Klik tombol Install / Activate.",
            "Tunggu hingga tombol berubah menjadi Installed / Uninstall.",
            "Klik ikon 9 titik → kembali ke Home Apps.",
            "Pastikan ikon Contacts sudah terlihat di grid.",
          ],
          fillFields: [
            {
              field: "Search Apps",
              value: "Contacts",
              where: "Apps list",
              how: "Ketik",
              required: true,
            },
          ],
          expectToSee:
            "Ikon Contacts ada di Home. Saat dibuka, muncul daftar kontak (boleh masih kosong).",
          tips: [
            "Contacts hampir selalu sudah terpasang di DB Enterprise — kalau sudah Installed, lanjut saja.",
          ],
          screen: {
            kind: "kanban",
            app: "Apps",
            menu: "Apps",
            title: "Contacts",
            subtitle: "Buku alamat customer & vendor",
            buttons: ["Install"],
            status: "Not Installed",
            statusColor: "draft",
            highlight: "Install Contacts lebih dulu",
            fields: [
              { label: "App", value: "Contacts", required: true },
              { label: "Action", value: "Install" },
            ],
          },
        },
        {
          id: "install-purchase-inventory-sales",
          title: "Install Inventory, Purchase, Sales, Accounting",
          menuPath: "Apps → Install masing-masing modul",
          clickPath: [
            "Apps",
            "Inventory → Install",
            "Purchase → Install",
            "Sales → Install",
            "Accounting → Install",
          ],
          goal: "Empat modul transaksi utama siap dipakai.",
          why: "Ini “paket kerja” gudang + pembelian + penjualan + keuangan yang saling terhubung.",
          actions: [
            "Di Apps Search, ketik Inventory → klik Install (kadang tertulis Stock).",
            "Tunggu selesai sampai status Installed.",
            "Kosongkan search, ketik Purchase → Install.",
            "Tunggu selesai.",
            "Ketik Sales → Install → tunggu selesai.",
            "Ketik Accounting → Install (atau Invoicing jika Accounting penuh belum tersedia).",
            "Tunggu selesai — Odoo sering memasang modul pendukung otomatis; itu normal.",
            "Klik ikon 9 titik → Home Apps.",
            "Hitung ikon: Contacts, Inventory, Purchase, Sales, Accounting/Invoicing harus ada.",
            "Jika salah satu hilang, ulangi search + Install untuk modul itu saja.",
          ],
          fillFields: [
            {
              field: "Search → Install #1",
              value: "Inventory",
              where: "Apps",
              how: "Ketik lalu klik Install",
              required: true,
            },
            {
              field: "Search → Install #2",
              value: "Purchase",
              where: "Apps",
              how: "Ketik lalu klik Install",
              required: true,
            },
            {
              field: "Search → Install #3",
              value: "Sales",
              where: "Apps",
              how: "Ketik lalu klik Install",
              required: true,
            },
            {
              field: "Search → Install #4",
              value: "Accounting",
              where: "Apps",
              how: "Ketik lalu klik Install",
              required: true,
              note: "Alternatif: Invoicing jika Accounting belum muncul",
            },
          ],
          expectToSee:
            "Di Home ada minimal: Contacts, Inventory, Purchase, Sales, Accounting/Invoicing — semua bisa diklik tanpa error.",
          tips: [
            "Install satu per satu lebih aman untuk pemula daripada mengklik semuanya sekaligus.",
            "Kalau install lama (>2 menit), cek koneksi ke server lab — jangan spam klik Install.",
          ],
          pitfalls: [
            "Melewatkan Accounting/Invoicing → nanti tidak bisa buat tagihan dari PO/SO.",
            "Menginstal modul acak (CRM, Website, dll) di awal — UI jadi ramai tanpa perlu.",
          ],
          screen: {
            kind: "list",
            app: "Apps",
            menu: "Installed Apps",
            title: "Modul yang harus terpasang",
            columns: ["App", "Untuk apa", "State"],
            rows: [
              ["Contacts", "Customer & vendor", "Installed"],
              ["Inventory", "Stok & gudang", "Installed"],
              ["Purchase", "Pembelian", "Installed"],
              ["Sales", "Penjualan", "Installed"],
              ["Accounting", "Invoice & bayar", "Installed"],
            ],
            buttons: ["Install"],
            fields: [
              { label: "Target apps", value: "Contacts, Inventory, Purchase, Sales, Accounting" },
            ],
          },
        },
        {
          id: "verify-menus",
          title: "Cek cepat: apakah menu sudah hidup?",
          menuPath: "Buka tiap Apps → lihat menu utamanya",
          clickPath: [
            "Home",
            "Contacts",
            "Purchase → Orders → RFQ",
            "Inventory → Overview",
            "Sales → Quotations",
            "Accounting",
          ],
          goal: "Anda yakin setiap modul bisa dibuka sebelum mulai isi data.",
          why: "Lebih baik ketahuan modul belum terpasang sekarang, daripada di tengah transaksi.",
          actions: [
            "Klik ikon 9 titik → Home.",
            "Klik Contacts → harus muncul daftar/kanban kontak (boleh kosong).",
            "Kembali Home → klik Purchase.",
            "Menu Orders → Requests for Quotation → list boleh kosong.",
            "Home → Inventory → Overview → harus ada kartu Receipts / Delivery Orders.",
            "Home → Sales → Orders → Quotations → list boleh kosong.",
            "Home → Accounting (atau Invoicing) → ada dashboard / menu Customers / Vendors.",
            "Jika salah satu gagal: kembali ke Apps, Install ulang modul terkait.",
            "Catat: list kosong = normal di DB baru. Yang penting tidak error.",
          ],
          expectToSee:
            "Semua Apps terbuka tanpa Access Error. Inventory Overview menampilkan kartu operasi (angka 0 TO PROCESS boleh).",
          tips: [
            `Simpan catatan: Lab = ${odooLab.url}, DB = ${odooLab.database}. Semua modul berikutnya memakai ini.`,
          ],
          screen: {
            kind: "dashboard",
            app: "Inventory",
            menu: "Overview",
            title: "Inventory Overview",
            subtitle: "Kartu operasi gudang default",
            rows: [
              ["Receipts", "Barang masuk", "0 TO PROCESS"],
              ["Delivery Orders", "Barang keluar", "0 TO PROCESS"],
              ["Internal Transfers", "Pindah lokasi", "0 TO PROCESS"],
            ],
            note: "Angka 0 itu normal di awal. Nanti terisi setelah ada transaksi.",
            fields: [
              { label: "Lab URL", value: odooLab.url },
              { label: "Database", value: odooLab.database },
            ],
          },
        },
      ],
      checklist: [
        "Contacts terpasang",
        "Inventory, Purchase, Sales, Accounting terpasang",
        "Semua bisa dibuka dari Home Apps",
      ],
    },
  ],
};
