import type { SyllabusModule } from "../types";

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
    "Bisa login ke database odoo_functional",
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
          clickPath: ["Login", "Home Apps"],
          goal: "Anda bisa menjelaskan bagian-bagian layar utama Odoo.",
          why: "Kalau tidak kenal tombol dasar, Anda akan sering “hilang” mencari menu.",
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
          ],
          actions: [
            "Bayangkan Odoo seperti “kantor digital”: tiap ruangan adalah Apps (Purchase, Sales, Inventory, Accounting).",
            "Di pojok kiri atas biasanya ada ikon kotak 9 titik — itu tombol untuk ganti Apps.",
            "Setelah masuk satu Apps, menu di atas (Orders, Products, Reporting, Configuration) adalah loker di dalam ruangan itu.",
            "Tombol New biasanya membuat data baru. Tombol Save menyimpan. Status di kanan atas menunjukkan tahap dokumen.",
            "Di kanan/bawah form sering ada “chatter”: tempat catatan, pesan, dan riwayat perubahan.",
          ],
          expectToSee:
            "Anda paham: Apps = ruangan, menu = loker, form = satu dokumen, status = tahap proses.",
          tips: [
            "Jangan hafalkan semua menu dulu. Ikuti jalur yang ditulis di setiap langkah.",
            "Kalau tersesat: klik ikon Apps (9 titik) lalu pilih ulang aplikasinya.",
          ],
          screen: {
            kind: "apps",
            app: "Home",
            menu: "Apps",
            title: "Apps Odoo 19",
            subtitle: "Setiap ikon = satu aplikasi bisnis",
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
          title: "Login ke database latihan",
          menuPath: "Browser → alamat Odoo Anda → pilih database odoo_functional",
          clickPath: ["Browser", "Halaman Login", "Log in"],
          goal: "Anda berhasil masuk sebagai admin ke database odoo_functional.",
          why: "Semua latihan silabus ini memakai satu database kosong bernama odoo_functional agar data rapi dan bisa diulang.",
          glossary: [
            {
              term: "Database",
              meaning:
                "“Buku besar” data Odoo Anda. Satu perusahaan latihan = satu database.",
            },
            {
              term: "admin / admin",
              meaning: "Username dan password default untuk database latihan ini.",
            },
          ],
          actions: [
            "Buka Odoo di browser (contoh lokal: http://localhost:8069).",
            "Jika muncul pilihan database, pilih odoo_functional. Jangan masuk ke database lain.",
            "Isi Email / Username: admin",
            "Isi Password: admin",
            "Klik Log in.",
            "Tunggu sampai muncul Home Apps atau halaman Discuss — berarti Anda sudah masuk.",
          ],
          expectToSee:
            "Anda berada di dalam Odoo (bukan lagi di halaman login). Nama user biasanya Administrator / Mitchell Admin.",
          tips: [
            "Simpan bookmark ke database yang benar agar tidak salah masuk.",
            "Untuk latihan, jangan ganti password dulu supaya semua peserta memakai kredensial yang sama.",
          ],
          pitfalls: [
            "Login ke database salah → data latihan seolah “hilang”.",
          ],
          screen: {
            kind: "login",
            app: "Login",
            menu: "Database Selector",
            title: "Login Odoo",
            subtitle: "Database: odoo_functional",
            fields: [
              { label: "Email", value: "admin", required: true },
              { label: "Password", value: "•••••", required: true },
              { label: "Database", value: "odoo_functional", required: true },
            ],
            buttons: ["Log in"],
            highlight: "Pakai admin / admin",
          },
        },
      ],
      checklist: [
        "Sudah paham Apps vs menu vs form",
        "Sudah berhasil login ke odoo_functional",
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
      steps: [
        {
          id: "update-apps-list",
          title: "Refresh daftar aplikasi (Update Apps List)",
          menuPath: "Apps → Update Apps List",
          clickPath: ["Apps", "Update Apps List", "Update"],
          goal: "Daftar modul di database sudah terbaru.",
          why: "Kadang modul ada di server tapi belum muncul di pencarian sampai daftar di-refresh.",
          actions: [
            "Dari Home, buka Apps (ikon Apps / Applications).",
            "Cari tombol atau menu Update Apps List (kadang di kanan atas / menu ⋮).",
            "Klik Update pada jendela konfirmasi.",
            "Tunggu selesai. Jangan close tab di tengah proses.",
          ],
          expectToSee:
            "Proses selesai tanpa error, dan Anda kembali ke daftar Apps.",
          tips: [
            "Di filter pencarian Apps, pastikan filter “Apps” aktif agar modul utama mudah ditemukan.",
          ],
          screen: {
            kind: "wizard",
            app: "Apps",
            menu: "Update Apps List",
            title: "Update Apps List",
            subtitle: "Sinkronkan daftar modul",
            buttons: ["Update", "Cancel"],
          },
        },
        {
          id: "install-contacts",
          title: "Install Contacts (buku alamat)",
          menuPath: "Apps → cari Contacts → Install",
          clickPath: ["Apps", "Cari: Contacts", "Install"],
          goal: "Modul Contacts terpasang dan ikonnya muncul di Home.",
          why: "Hampir semua transaksi butuh nama customer/vendor. Contacts adalah tempat menyimpan itu.",
          actions: [
            "Di Apps, ketik Contacts pada kotak Search.",
            "Klik kartu Contacts.",
            "Klik Install / Activate.",
            "Tunggu sampai selesai, lalu kembali ke Home Apps.",
            "Pastikan ikon Contacts sudah terlihat.",
          ],
          expectToSee: "Ikon Contacts ada di Home. Saat dibuka, muncul daftar kontak (bisa masih kosong).",
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
            "Install Inventory (kadang tertulis Stock). Ini modul gudang.",
            "Install Purchase. Ini modul pembelian ke vendor.",
            "Install Sales. Ini modul penawaran & order pelanggan.",
            "Install Accounting (atau Invoicing jika itu yang tersedia). Ini modul invoice & pembayaran.",
            "Setelah semua selesai, buka Home Apps dan pastikan keempat ikon muncul.",
          ],
          expectToSee:
            "Di Home ada minimal: Contacts, Inventory, Purchase, Sales, Accounting/Invoicing.",
          tips: [
            "Odoo sering memasang modul pendukung otomatis — itu normal.",
            "Install satu per satu lebih aman untuk pemula daripada mengklik semuanya sekaligus.",
          ],
          pitfalls: [
            "Melewatkan Accounting/Invoicing → nanti tidak bisa buat tagihan dari PO/SO.",
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
          },
        },
        {
          id: "verify-menus",
          title: "Cek cepat: apakah menu sudah hidup?",
          menuPath: "Buka tiap Apps → lihat menu utamanya",
          clickPath: ["Contacts", "Purchase", "Inventory", "Sales", "Accounting"],
          goal: "Anda yakin setiap modul bisa dibuka sebelum mulai isi data.",
          why: "Lebih baik ketahuan modul belum terpasang sekarang, daripada di tengah transaksi.",
          actions: [
            "Buka Contacts → harus muncul daftar kontak.",
            "Buka Purchase → Orders → Requests for Quotation → list boleh kosong.",
            "Buka Inventory → Overview → ada kartu Receipts / Delivery Orders.",
            "Buka Sales → Orders → Quotations → list boleh kosong.",
            "Buka Accounting → ada menu Customers / Vendors atau dashboard.",
          ],
          expectToSee:
            "Semua Apps terbuka tanpa error. List boleh kosong — database memang masih baru.",
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
