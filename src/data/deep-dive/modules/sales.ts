import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;
const company = seed.company;

export const salesDeepDive: DeepDiveModule = {
  slug: "sales",
  name: "Sales — Order to Cash",
  shortTitle: "Sales",
  icon: "BadgeDollarSign",
  category: "Operasional",
  wave: 1,
  availability: "available",
  apps: ["Sales", "Inventory", "Invoicing"],
  overview: {
    function:
      "Modul Sales mengelola siklus Order-to-Cash: dari Quotation, Sales Order, Delivery Order, hingga Customer Invoice. Di Odoo 19 Enterprise, Sales terintegrasi ketat dengan Inventory (reservasi stok) dan Accounting (pengakuan piutang).",
    businessProblem:
      "Tanpa Sales terstruktur, penawaran pelanggan tersebar di chat/email, stok tidak terreservasi, dan invoice dibuat manual sehingga sering selisih qty/harga dibanding yang dikirim.",
    typicalUsers: [
      "Sales Representative",
      "Sales Manager",
      "Warehouse Operator (delivery)",
      "AR Accountant",
    ],
    whenNeeded:
      "Saat perusahaan mulai menjual barang/jasa berulang ke pelanggan, butuh penawaran resmi, komitmen stok, dan jejak dokumen sampai pembayaran.",
    relatedModules: ["Contacts", "Inventory", "Invoicing / Accounting", "Purchase"],
    businessScenario: `${company.name} menjual ${kopi.name} dan ${jasa.name} ke ${customer.name} (retail) serta ${distributor.name} (distributor). Tim sales membuat Quotation, mengonfirmasi SO setelah stok tersedia dari Purchase, mengirim barang dari WH/Stock, lalu menerbitkan invoice dengan Pajak Penjualan 11% dan payment terms 15/30 Days.`,
  },
  prerequisites: {
    modules: ["Contacts", "Inventory", "Invoicing (opsional tapi disarankan)", "Accounting chart aktif"],
    masterData: [
      `Customer: ${customer.name}, ${distributor.name}`,
      `Produk storable: ${kopi.name} (harga jual ${kopi.salesPrice})`,
      `Produk service: ${jasa.name} (harga jual ${jasa.salesPrice})`,
      `Pricelist: ${customer.pricelist}`,
      "Payment Terms: 15 Days, 30 Days",
      "Pajak Penjualan 11%",
    ],
    configuration: [
      "Sales → Settings: Quotation Templates (opsional)",
      "Sales → Settings: Online Signature / Payment (opsional)",
      "Inventory terpasang agar delivery order muncul",
      "Invoicing Policy per produk (Ordered / Delivered quantities)",
    ],
    access: [
      "Sales / User: buat & kirim quotation",
      "Sales / Manager: pricelist, discount, konfigurasi",
      "Inventory / User: validate delivery",
      "Accounting / Invoicing: create & post customer invoice",
    ],
    relationships:
      "Sales Order me-reserve stok di stock.move; Create Invoice membuat account.move (out_invoice); payment mengurangi piutang. Tanpa Contacts & Product, SO tidak bisa diisi dengan benar.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Hapus filter 'Apps' jika perlu → cari 'Sales'",
      "Klik Install pada aplikasi Sales",
      "Tunggu sampai menu Sales muncul di App Switcher",
    ],
    dependencies: [
      "Contacts (otomatis)",
      "Invoicing (biasanya ikut terpasang)",
      "Inventory disarankan agar delivery flow tersedia",
    ],
    afterInstall: [
      "Buka Sales → Configuration → Settings, aktifkan opsi yang dibutuhkan",
      "Pastikan pajak penjualan & pricelist IDR tersedia",
      "Hubungkan produk ke Income Account (via kategori produk / Accounting)",
    ],
    newMenus: [
      "Sales → Orders → Quotations",
      "Sales → Orders → Orders",
      "Sales → Customers",
      "Sales → Products",
      "Sales → Reporting",
      "Sales → Configuration → Settings",
    ],
    newSettings: [
      "Settings → Sales → Quotations & Orders",
      "Settings → Sales → Pricing",
      "Settings → Sales → Invoicing",
      "Settings → Sales → Shipping",
    ],
  },
  configurations: [
    {
      id: "sales-pricelists",
      name: "Pricelists",
      location: "Settings → Sales → Pricing → Pricelists",
      what: "Mengaktifkan daftar harga multi-aturan (diskon, jumlah minimum, tanggal berlaku).",
      whyEnable:
        "Retail dan distributor sering punya harga berbeda; pricelist menjaga konsistensi tanpa ubah harga produk secara manual tiap SO.",
      whenEnable:
        "Ketika ada lebih dari satu segmen pelanggan atau promo berkala (mis. harga distributor vs retail).",
      whenNot:
        "Jika semua pelanggan memakai satu harga tetap dan tidak ada diskon struktural.",
      businessExample: `${customer.name} memakai ${customer.pricelist}; ${distributor.name} bisa mendapat pricelist khusus dengan diskon volume.`,
      impact:
        "Field Pricelist muncul di Quotation/SO; harga line dihitung dari aturan pricelist, bukan hanya Sales Price produk.",
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Halaman Settings Odoo — area konfigurasi aplikasi termasuk Sales",
        whatYouSee: "Daftar section Settings per aplikasi",
        why: "Pricelists diaktifkan dari Settings → Sales",
      },
    },
    {
      id: "sales-discounts",
      name: "Discounts",
      location: "Settings → Sales → Pricing → Discounts",
      what: "Menampilkan kolom Diskon (%) pada baris order.",
      whyEnable:
        "Sales perlu memberi potongan situasional tanpa mengubah master harga produk.",
      whenEnable:
        "Negosiasi harga sering terjadi di lapangan atau ada promo short-term.",
      whenNot:
        "Jika semua potongan harus lewat pricelist resmi agar audit lebih ketat.",
      businessExample: `Sales memberi diskon 5% pada ${kopi.name} untuk order pertama ${customer.name}.`,
      impact:
        "Kolom Disc.% muncul di Order Lines; margin laporan sales terpengaruh.",
    },
    {
      id: "sales-quot-template",
      name: "Quotation Templates",
      location: "Settings → Sales → Quotations & Orders → Quotation Templates",
      what: "Template penawaran dengan line produk, note, dan validity default.",
      whyEnable:
        "Mempercepat pembuatan quotation berulang (paket retail kopi + jasa kirim).",
      whenEnable:
        "Ada paket penjualan standar yang sering diulang tiap minggu.",
      whenNot:
        "Setiap order unik dan jarang berulang — template justru membingungkan.",
      businessExample: `Template "Paket Retail Kopi" berisi ${kopi.name} × 8 + ${jasa.name} × 1.`,
      impact:
        "Field Quotation Template muncul di form Quotation; line terisi otomatis saat dipilih.",
    },
    {
      id: "sales-online-signature",
      name: "Online Signature",
      location: "Settings → Sales → Quotations & Orders → Online Signature",
      what: "Pelanggan menandatangani quotation lewat portal.",
      whyEnable:
        "Mendapat bukti persetujuan tanpa cetak kertas atau email bolak-balik.",
      whenEnable:
        "Pelanggan nyaman pakai portal / email Odoo dan proses closing perlu jejak digital.",
      whenNot:
        "B2B tradisional yang hanya setuju lewat WA/telepon — signature online jarang dipakai.",
      businessExample: `${customer.name} menandatangani Quotation di portal sebelum Confirm SO.`,
      impact:
        "Tombol Send by Email membawa link signature; status bisa jadi Quotation Sent dengan signed flag.",
    },
    {
      id: "sales-lock-confirmed",
      name: "Lock Confirmed Sales",
      location: "Settings → Sales → Quotations & Orders → Lock Confirmed Sales",
      what: "Mengunci SO yang sudah confirmed agar line tidak diubah sembarangan.",
      whyEnable:
        "Mencegah perubahan qty/harga setelah stok direservasi dan gudang mulai pick.",
      whenEnable:
        "Operasi multi-user: sales, warehouse, dan finance sering menyentuh dokumen yang sama.",
      whenNot:
        "Tim kecil yang sering amandemen SO setelah confirm — lock akan menghambat.",
      businessExample: `Setelah SO ke ${customer.name} confirmed, gudang pick berdasarkan qty terkunci.`,
      impact:
        "SO confirmed masuk mode read-only (kecuali unlock oleh Manager); perubahan butuh prosedur khusus.",
    },
    {
      id: "sales-invoicing-policy",
      name: "Invoicing Policy (Ordered vs Delivered)",
      location: "Settings → Sales → Invoicing → Invoicing Policy / per Product → Invoicing Policy",
      what: "Menentukan kapan qty boleh diinvoice: berdasarkan ordered qty atau delivered qty.",
      whyEnable:
        "Menyelaraskan pengakuan piutang dengan kebijakan bisnis (bayar dulu vs bayar setelah terima).",
      whenEnable:
        "Delivered: barang fisik; Ordered: jasa / down payment / barang yang diinvoice sebelum kirim.",
      whenNot:
        "Jangan campur kebijakan tanpa standar — laporan To Invoice jadi sulit dibaca.",
      businessExample: `${kopi.name} memakai Delivered quantities; ${jasa.name} memakai Ordered quantities.`,
      impact:
        "Tombol Create Invoice hanya menginvoice qty sesuai policy; status invoicing SO berubah sesuai delivery.",
    },
    {
      id: "sales-down-payment",
      name: "Down Payments",
      location: "Settings → Sales → Invoicing (Create Invoice wizard mendukung Down Payment)",
      what: "Membuat invoice uang muka (persentase atau fixed) sebelum full delivery.",
      whyEnable:
        "Mengamankan cash flow untuk order besar sebelum barang dikirim penuh.",
      whenEnable:
        "Distributor atau project order yang butuh DP 30–50%.",
      whenNot:
        "Retail kecil dengan payment terms pendek dan nilai order rendah.",
      businessExample: `${distributor.name} order besar: invoice DP 30% sebelum pengiriman penuh.`,
      impact:
        "Wizard Create Invoice menawarkan Down payment (percentage/fixed); sisa diinvoice di akhir.",
    },
  ],
  masterData: [
    {
      id: "md-customer",
      name: "Customer (res.partner)",
      purpose: "Identitas pelanggan yang muncul di Quotation/SO, delivery address, dan invoice address.",
      required: true,
      whyNeeded:
        "Tanpa customer, SO tidak punya pihak lawan transaksi; pajak, terms, dan pricelist tidak terisi otomatis.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama resmi pelanggan",
          why: "Muncul di dokumen legal dan laporan AR",
          example: customer.name,
          impactIfEmpty: "Contact tidak bisa disimpan",
        },
        {
          field: "Address (Street, City, Country)",
          type: "Char / Many2one",
          required: true,
          purpose: "Alamat pengiriman & invoice default",
          why: "Delivery slip dan invoice butuh alamat lengkap",
          example: `${customer.street}, ${customer.city}, ${customer.country}`,
          impactIfEmpty: "Dokumen cetak kosong; pengiriman salah alamat",
        },
        {
          field: "Email / Phone",
          type: "Char",
          required: false,
          purpose: "Kontak operasional & pengiriman quotation",
          why: "Send by Email membutuhkan email valid",
          example: `${customer.email} / ${customer.phone}`,
          impactIfEmpty: "Tidak bisa kirim quotation otomatis",
        },
        {
          field: "Payment Terms",
          type: "Many2one",
          required: false,
          purpose: "Jatuh tempo invoice default",
          why: "AR perlu due date konsisten",
          example: customer.paymentTerms,
          impactIfEmpty: "Terms harus diisi manual tiap SO",
          related: "account.payment.term",
        },
        {
          field: "Pricelist",
          type: "Many2one",
          required: false,
          purpose: "Daftar harga default pelanggan",
          why: "Harga line SO mengikuti aturan segmen",
          example: customer.pricelist,
          impactIfEmpty: "Memakai pricelist perusahaan / harga produk mentah",
          related: "product.pricelist",
        },
        {
          field: "Tags",
          type: "Many2many",
          required: false,
          purpose: "Segmentasi pelanggan",
          why: "Filter reporting & campaign",
          example: customer.tags,
          impactIfEmpty: "Sulit filter retail vs distributor",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "Daftar Contacts — master pelanggan dan vendor",
        whatYouSee: "List view contact dengan nama dan kota",
      },
    },
    {
      id: "md-product-sales",
      name: "Product (product.template / product.product)",
      purpose: "Barang/jasa yang dijual; menentukan tipe, harga, pajak, dan kebijakan invoice.",
      required: true,
      whyNeeded:
        "Line SO mereferensi produk; stok, COGS, dan income account mengikuti setup produk.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama yang tampil di quotation",
          why: "Pelanggan harus mengenali item",
          example: kopi.name,
          impactIfEmpty: "Produk tidak valid",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods storable vs Service",
          why: "Menentukan apakah ada delivery & stock move",
          example: kopi.type,
          impactIfEmpty: "Odoo memakai default; delivery mungkin tidak muncul",
        },
        {
          field: "Sales Price",
          type: "Float / Monetary",
          required: true,
          purpose: "Harga jual dasar",
          why: "Default unit price di SO jika pricelist tidak override",
          example: kopi.salesPrice,
          impactIfEmpty: "Harga 0 — revenue salah",
        },
        {
          field: "Customer Taxes",
          type: "Many2many",
          required: false,
          purpose: "Pajak penjualan default",
          why: "PPN 11% harus konsisten di invoice",
          example: kopi.salesTax,
          impactIfEmpty: "Invoice tanpa PPN — compliance risk",
          related: "account.tax",
        },
        {
          field: "Invoicing Policy",
          type: "Selection",
          required: true,
          purpose: "Ordered / Delivered quantities",
          why: "Mengontrol qty yang boleh diinvoice",
          example: "Delivered quantities (untuk barang)",
          impactIfEmpty: "Default company; bisa mismatch dengan operasi gudang",
        },
        {
          field: "Can be Sold",
          type: "Boolean",
          required: true,
          purpose: "Produk muncul di Sales",
          why: "Filter produk di Order Lines",
          example: "True",
          impactIfEmpty: "Produk tidak bisa dipilih di Quotation",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Daftar Products — master barang dan jasa jual",
      },
    },
    {
      id: "md-pricelist",
      name: "Pricelist (product.pricelist)",
      purpose: "Aturan harga per segmen pelanggan / mata uang.",
      required: false,
      whyNeeded:
        "Menjaga harga retail vs distributor tanpa mengubah Sales Price master tiap kali.",
      fields: [
        {
          field: "Pricelist Name",
          type: "Char",
          required: true,
          purpose: "Identitas daftar harga",
          why: "Dipilih di partner & SO",
          example: customer.pricelist,
          impactIfEmpty: "Tidak bisa disimpan",
        },
        {
          field: "Currency",
          type: "Many2one",
          required: true,
          purpose: "Mata uang harga",
          why: `${company.name} beroperasi dalam ${company.currency}`,
          example: company.currency,
          impactIfEmpty: "Konversi salah / error posting",
          related: "res.currency",
        },
        {
          field: "Price Rules",
          type: "One2many",
          required: false,
          purpose: "Formula harga per produk/kategori",
          why: "Diskon volume, fixed price, formula",
          example: `Fixed price ${kopi.salesPrice} untuk ${kopi.name}`,
          impactIfEmpty: "Pricelist hanya meneruskan Sales Price",
        },
        {
          field: "Company",
          type: "Many2one",
          required: false,
          purpose: "Multi-company isolation",
          why: "Harga hanya untuk entitas yang relevan",
          example: company.name,
          impactIfEmpty: "Shared across companies (bisa diinginkan)",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "products", label: "Products / Inventory" },
      { id: "sales", label: "Sales (Quotation/SO)" },
      { id: "stock", label: "Inventory (Delivery)" },
      { id: "account", label: "Accounting (Invoice/Payment)" },
    ],
    edges: [
      {
        from: "contacts",
        to: "sales",
        why: "Customer (res.partner) wajib di header Quotation/SO",
      },
      {
        from: "products",
        to: "sales",
        why: "Order lines mereferensi product.product + pajak + UoM",
      },
      {
        from: "sales",
        to: "stock",
        why: "Confirm SO membuat stock.picking outgoing & stock.move reservation",
      },
      {
        from: "stock",
        to: "account",
        why: "Delivery qty (delivered policy) membuka qty to invoice di SO",
      },
      {
        from: "sales",
        to: "account",
        why: "Create Invoice menghasilkan account.move out_invoice dari sale.order",
      },
    ],
    summary:
      "Sales bergantung pada master Contacts & Products; setelah Confirm, Inventory menjalankan delivery; Accounting menutup siklus dengan invoice dan payment.",
  },
  forms: [
    {
      id: "form-quotation",
      name: "Quotation (sale.order state=draft/sent)",
      menuPath: "Sales → Orders → Quotations → New",
      fields: [
        {
          field: "Customer",
          required: true,
          purpose: "Pihak pembeli",
          why: "Menarik alamat, terms, pricelist",
          example: customer.name,
        },
        {
          field: "Quotation Date",
          required: true,
          purpose: "Tanggal penawaran",
          why: "Dasar validity & reporting",
          example: "2026-10-16",
        },
        {
          field: "Expiration",
          required: false,
          purpose: "Batas berlaku penawaran",
          why: "Kontrol penawaran kadaluarsa",
          example: "2026-10-23",
        },
        {
          field: "Pricelist",
          required: false,
          purpose: "Aturan harga",
          why: "Konsistensi harga segmen",
          example: customer.pricelist,
        },
        {
          field: "Payment Terms",
          required: false,
          purpose: "Jatuh tempo",
          why: "AR planning",
          example: customer.paymentTerms,
        },
        {
          field: "Order Lines — Product",
          required: true,
          purpose: "Item dijual",
          why: "Inti dokumen penjualan",
          example: kopi.name,
        },
        {
          field: "Order Lines — Quantity",
          required: true,
          purpose: "Jumlah diminta",
          why: "Reservasi & invoice qty",
          example: seed.so.kopiQty,
        },
        {
          field: "Order Lines — Unit Price",
          required: true,
          purpose: "Harga satuan",
          why: "Revenue calculation",
          example: kopi.salesPrice,
        },
        {
          field: "Order Lines — Taxes",
          required: false,
          purpose: "Pajak line",
          why: "PPN compliance",
          example: kopi.salesTax,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Form Quotation Sales — header customer dan order lines",
        whatYouSee: "Form sale.order dalam status Quotation",
        whatToFill: `Customer ${customer.name}, line ${kopi.name} × ${seed.so.kopiQty}`,
      },
    },
    {
      id: "form-sales-order",
      name: "Sales Order (sale.order state=sale)",
      menuPath: "Sales → Orders → Orders",
      fields: [
        {
          field: "Customer",
          required: true,
          purpose: "Pembeli confirmed",
          why: "Tidak berubah ringan setelah lock",
          example: customer.name,
        },
        {
          field: "Order Date",
          required: true,
          purpose: "Tanggal komitmen",
          why: "KPI sales & backlog",
          example: "2026-10-16",
        },
        {
          field: "Delivery Date",
          required: false,
          purpose: "Target kirim",
          why: "Planning warehouse",
          example: "2026-10-18",
        },
        {
          field: "Warehouse",
          required: true,
          purpose: "Sumber stok",
          why: "Picking location",
          example: "WH/Stock",
        },
        {
          field: "Order Lines",
          required: true,
          purpose: "Komitmen qty & harga",
          why: "Dasar delivery & invoice",
          example: `${kopi.name} × ${seed.so.kopiQty}; ${jasa.name} × ${seed.so.jasaQty}`,
        },
        {
          field: "Delivery Status",
          required: false,
          purpose: "Progress pengiriman",
          why: "Operasional follow-up",
          example: "Fully Delivered",
        },
        {
          field: "Invoice Status",
          required: false,
          purpose: "Progress penagihan",
          why: "AR follow-up",
          example: "To Invoice / Fully Invoiced",
        },
        {
          field: "Salesperson",
          required: false,
          purpose: "Pemilik order",
          why: "Komisi & pipeline",
          example: "Administrator / Sales User",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/08-sales-quotations.png",
        caption: "List Quotations / Orders di aplikasi Sales",
      },
    },
  ],
  procedures: [
    {
      id: "proc-create-quotation",
      title: "Membuat Quotation untuk Toko Maju Jaya",
      goal: `Quotation draft berisi ${kopi.name} × ${seed.so.kopiQty} dan ${jasa.name} × ${seed.so.jasaQty}.`,
      preparation: [
        `Pastikan contact ${customer.name} ada`,
        `Pastikan produk ${kopi.name} dan ${jasa.name} Can be Sold`,
        "Login sebagai Sales User / Admin",
      ],
      steps: [
        "Home → Sales → Orders → Quotations → New",
        `Pilih Customer: ${customer.name}`,
        "Isi Quotation Date hari ini; Expiration +7 hari",
        `Pastikan Pricelist = ${customer.pricelist}; Payment Terms = ${customer.paymentTerms}`,
        `Add a product: ${kopi.name}, Qty ${seed.so.kopiQty}, Price ${kopi.salesPrice}, Tax ${kopi.salesTax}`,
        `Add a product: ${jasa.name}, Qty ${seed.so.jasaQty}, Price ${jasa.salesPrice}, Tax ${jasa.salesTax}`,
        "Cek Untaxed Amount, Tax, Total di kanan bawah → Save",
      ],
      expectedResult: "Dokumen tersimpan dengan status Quotation; nomor SO/Q muncul.",
      verification: [
        "Status badge = Quotation",
        "Dua order lines terlihat",
        "Total termasuk PPN 11%",
      ],
      fillFields: [
        { field: "Customer", value: customer.name, where: "Header", how: "Pilih", required: true },
        { field: "Pricelist", value: customer.pricelist, where: "Header", how: "Pilih" },
        { field: "Payment Terms", value: customer.paymentTerms, where: "Header", how: "Pilih" },
        {
          field: "Product (line 1)",
          value: kopi.name,
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity (line 1)",
          value: seed.so.kopiQty,
          where: "Order Lines",
          how: "Ketik",
          required: true,
        },
        {
          field: "Unit Price (line 1)",
          value: kopi.salesPrice,
          where: "Order Lines",
          how: "Ketik/otomatis",
          required: true,
        },
        {
          field: "Product (line 2)",
          value: jasa.name,
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity (line 2)",
          value: seed.so.jasaQty,
          where: "Order Lines",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Form Quotation siap diisi untuk pelanggan retail",
      },
    },
    {
      id: "proc-confirm-deliver",
      title: "Confirm SO dan Validate Delivery",
      goal: "Mengubah Quotation menjadi Sales Order dan menyelesaikan pengiriman barang.",
      preparation: [
        `On Hand ${kopi.name} ≥ ${seed.so.kopiQty} (selesaikan Purchase + Receipt dulu)`,
        "Quotation sudah di-Save",
      ],
      steps: [
        "Buka Quotation → Confirm (atau Send by Email lalu Confirm)",
        "Status menjadi Sales Order; smart button Delivery muncul",
        "Klik Delivery → buka stock.picking outgoing",
        `Pastikan Demand qty ${kopi.name} = ${seed.so.kopiQty}`,
        "Validate → Apply (jika qty sesuai)",
        "Kembali ke SO: Delivery Status = Fully Delivered (untuk goods)",
      ],
      expectedResult: "Stok berkurang; picking Done; SO siap diinvoice sesuai policy.",
      verification: [
        "Inventory → Products: On Hand turun",
        "SO smart button Delivery = 1 Done",
        "Invoice Status = To Invoice (delivered policy)",
      ],
      fillFields: [
        {
          field: "Quantity",
          value: seed.so.kopiQty,
          where: "Delivery Operations",
          how: "Ketik/otomatis",
          required: true,
          note: "Harus ≤ On Hand tersedia",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-delivery-orders.png",
        caption: "Delivery Order outgoing setelah Confirm SO — Validate picking",
      },
    },
    {
      id: "proc-create-invoice",
      title: "Create Customer Invoice dari SO",
      goal: "Menerbitkan invoice pelanggan dari Sales Order yang sudah delivered.",
      preparation: [
        "SO confirmed",
        "Delivery divalidasi jika policy = Delivered quantities",
      ],
      steps: [
        "Buka Sales Order → Create Invoice",
        "Pilih Regular Invoice (atau Down payment jika skenario DP)",
        "Create Draft Invoice → review line & pajak",
        "Confirm invoice (Post)",
        "Opsional: Register Payment jika pelanggan bayar segera",
      ],
      expectedResult: "account.move out_invoice Posted; SO Invoice Status = Fully Invoiced.",
      verification: [
        "Accounting → Customers → Invoices: invoice baru",
        "Partner ledger ${customer.name} bertambah piutang",
        "SO menampilkan smart button Invoices",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "Invoice Header",
          how: "Otomatis dari SO",
          required: true,
        },
        {
          field: "Payment Terms",
          value: customer.paymentTerms,
          where: "Invoice Header",
          how: "Otomatis/pilih",
        },
        {
          field: "Product lines",
          value: `${kopi.name} × ${seed.so.kopiQty}; ${jasa.name} × ${seed.so.jasaQty}`,
          where: "Invoice Lines",
          how: "Otomatis dari SO",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Customer Invoices — hasil Create Invoice dari Sales Order",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-retail-otc",
      title: "Retail Order-to-Cash lengkap",
      whenToUse: `Penjualan rutin ke ${customer.name} dengan stok siap kirim.`,
      flow: [
        "Buat Quotation",
        "Confirm SO",
        "Validate Delivery",
        "Create Invoice",
        "Register Payment",
      ],
      notes: "Ini jalur default latihan Core Flow Sales.",
    },
    {
      id: "sc-quotation-negotiate",
      title: "Negosiasi harga sebelum Confirm",
      whenToUse: "Pelanggan minta diskon atau ubah qty sebelum setuju.",
      flow: [
        "Buat Quotation",
        "Send by Email",
        "Ubah Disc.% atau qty",
        "Update & kirim ulang",
        "Confirm setelah deal",
      ],
    },
    {
      id: "sc-partial-delivery",
      title: "Pengiriman parsial",
      whenToUse: "Stok On Hand kurang dari qty SO.",
      flow: [
        "Confirm SO",
        "Delivery: isi qty tersedia < demand",
        "Validate → backorder",
        "Invoice sebagian (delivered policy)",
        "Terima stok tambahan → selesaikan backorder",
      ],
      notes: "Pastikan Create Backorder dipilih saat Validate.",
    },
    {
      id: "sc-down-payment",
      title: "Invoice uang muka distributor",
      whenToUse: `Order besar ke ${distributor.name} membutuhkan DP sebelum kirim penuh.`,
      flow: [
        "Confirm SO",
        "Create Invoice → Down payment (percentage)",
        "Post & terima payment DP",
        "Deliver sisa barang",
        "Create Invoice sisa (deduction DP)",
      ],
    },
  ],
  integrations: [
    {
      id: "int-sales-inventory",
      withModule: "Inventory",
      relationship: "SO → stock.picking / stock.move",
      whatHappens:
        "Confirm SO membuat outgoing picking; Validate mengurangi quants dan mengupdate delivered qty di sale.order.line.",
    },
    {
      id: "int-sales-accounting",
      withModule: "Accounting / Invoicing",
      relationship: "SO → account.move (out_invoice)",
      whatHappens:
        "Create Invoice menyalin line SO ke journal entry pelanggan; payment merekonsiliasi piutang.",
    },
    {
      id: "int-sales-purchase",
      withModule: "Purchase",
      relationship: "MTO / stok dari PO",
      whatHappens:
        "Jika stok kosong, Purchase dulu (RFQ→Receipt) agar Sales bisa deliver; atau gunakan Make to Order/Buy route.",
    },
    {
      id: "int-sales-contacts",
      withModule: "Contacts",
      relationship: "res.partner sebagai customer",
      whatHappens:
        "Alamat, fiscal position, pricelist, dan payment terms mengalir dari partner ke SO & invoice.",
    },
  ],
  mistakes: [
    {
      id: "m-no-stock",
      problem: "Confirm SO padahal On Hand 0",
      why: "Delivery tidak bisa divalidasi; customer dijanjikan barang kosong",
      detect: "Forecast/Force Available merah; picking Waiting",
      fix: "Buat PO & Receipt dulu, atau batalkan/ubah qty SO",
      prevent: "Cek Forecasted sebelum Confirm; aktifkan warning stok",
    },
    {
      id: "m-wrong-policy",
      problem: "Invoicing policy Ordered untuk barang yang belum dikirim",
      why: "Piutang diakui sebelum delivery — mismatch operasional",
      detect: "Invoice Status To Invoice padahal Delivery belum Done",
      fix: "Ubah policy produk ke Delivered; credit note jika perlu",
      prevent: "Standarkan policy: goods=Delivered, service=Ordered",
    },
    {
      id: "m-manual-invoice",
      problem: "Buat Customer Invoice manual tanpa link ke SO",
      why: "SO tetap To Invoice; double billing risk",
      detect: "Invoice tanpa origin SO; SO masih To Invoice",
      fix: "Cancel/draft ulang; Create Invoice dari SO",
      prevent: "SOP: invoice selalu dari SO kecuali ad-hoc credit",
    },
    {
      id: "m-tax-missing",
      problem: "Line SO tanpa Pajak Penjualan 11%",
      why: "Invoice under-tax; masalah compliance",
      detect: "Tax Amount 0 padahal produk taxable",
      fix: "Tambah tax di line / product; recompute",
      prevent: "Set Customer Taxes di produk & fiscal position",
    },
    {
      id: "m-edit-after-confirm",
      problem: "Ubah harga/qty setelah Confirm tanpa kontrol",
      why: "Picking & accounting tidak selaras",
      detect: "Selisih demand picking vs SO line",
      fix: "Cancel picking/SO dengan prosedur; buat SO baru atau unlock resmi",
      prevent: "Aktifkan Lock Confirmed Sales",
    },
  ],
  troubleshooting: [
    {
      id: "t-cannot-invoice",
      problem: "Tombol Create Invoice tidak muncul / Nothing to invoice",
      causes: [
        "Delivered policy tapi belum validate picking",
        "Sudah fully invoiced",
        "Semua line service dengan qty 0",
      ],
      diagnosis: [
        "Cek Invoice Status di SO",
        "Cek delivered qty vs invoiced qty di line",
        "Cek Invoicing Policy produk",
      ],
      solution: [
        "Validate Delivery",
        "Atau ubah policy jika bisnis Ordered",
        "Buat credit note + reinvoice jika dokumen rusak",
      ],
      prevention: "Checklist: Confirm → Deliver → Invoice sesuai policy",
    },
    {
      id: "t-delivery-blocked",
      problem: "Tidak bisa Validate Delivery (qty available 0)",
      causes: [
        "Stok belum diterima dari Purchase",
        "Lokasi salah (bukan WH/Stock)",
        "Reservasi order lain",
      ],
      diagnosis: [
        "Product → On Hand / Forecasted",
        "Inventory → Reporting → Stock",
        "Cek move line reserved",
      ],
      solution: [
        "Selesaikan Receipt PO",
        "Unreserve SO lain jika prioritas berubah",
        "Internal transfer ke lokasi sumber picking",
      ],
      prevention: "Sales hanya Confirm setelah Forecasted cukup",
    },
    {
      id: "t-price-wrong",
      problem: "Harga di Quotation tidak sesuai harapan",
      causes: [
        "Pricelist salah",
        "Currency mismatch",
        "UoM conversion",
      ],
      diagnosis: [
        "Cek Pricelist di header SO",
        "Cek Sales Price produk",
        "Cek pricelist rules tanggal berlaku",
      ],
      solution: [
        `Set pricelist ${customer.pricelist}`,
        "Update rule atau override Unit Price dengan otorisasi",
      ],
      prevention: "Assign pricelist di contact customer",
    },
    {
      id: "t-email-fail",
      problem: "Send by Email gagal",
      causes: [
        "Email customer kosong",
        "Outgoing mail server belum dikonfigurasi",
        "Template email error",
      ],
      diagnosis: [
        "Cek field Email di contact",
        "Settings → Technical → Email → Mail Servers",
      ],
      solution: [
        `Isi email ${customer.email}`,
        "Konfigurasi SMTP atau tandai Sent manual untuk latihan",
      ],
      prevention: "Validasi email wajib untuk customer aktif",
    },
  ],
  behind: {
    models: [
      "sale.order",
      "sale.order.line",
      "sale.order.template",
      "product.pricelist",
      "stock.picking",
      "stock.move",
      "account.move",
      "account.move.line",
      "res.partner",
    ],
    relations: [
      "sale.order.partner_id → res.partner",
      "sale.order.order_line → sale.order.line",
      "sale.order.line.product_id → product.product",
      "sale.order.picking_ids → stock.picking",
      "sale.order.invoice_ids → account.move",
    ],
    automations: [
      "action_confirm: draft→sale, create procurements/pickings",
      "_create_invoices: generate account.move from lines",
      "stock move _action_done updates qty_delivered",
    ],
    securityNotes: [
      "sales.group_sale_salesman vs sales.group_sale_manager",
      "Harga cost/margin biasanya dibatasi untuk non-manager",
    ],
    note: "Di Odoo 19, sale.order tetap model pusat O2C; state flow quotation→sent→sale→done.",
  },
  reporting: [
    {
      name: "Sales Analysis",
      path: "Sales → Reporting → Sales",
      kpi: "Revenue, qty, margin per produk/customer",
      decision: "Fokus jual produk margin tinggi; evaluasi ${customer.name} vs ${distributor.name}",
    },
    {
      name: "Quotations Analysis",
      path: "Sales → Reporting → Quotations",
      kpi: "Win rate quotation → SO",
      decision: "Perbaiki follow-up penawaran expired",
    },
    {
      name: "Salesperson Performance",
      path: "Sales → Reporting → Sales (group by Salesperson)",
      kpi: "Omzet per salesperson",
      decision: "Alokasi target & coaching",
    },
    {
      name: "Invoices to be Issued",
      path: "Sales → Orders → Orders (filter To Invoice)",
      kpi: "Backlog penagihan",
      decision: "Prioritas Create Invoice untuk cash flow",
    },
  ],
  security: {
    roles: [
      {
        role: "Sales / User (Own Documents)",
        can: [
          "Buat Quotation/SO milik sendiri",
          "Send quotation",
          "Confirm SO sesuai hak",
        ],
        cannot: [
          "Ubah pricelist master",
          "Lihat semua SO rekan (jika own-docs)",
          "Konfigurasi Settings Sales",
        ],
        whyDifferent:
          "Membatasi akses data pelanggan antar sales agar tidak bentrok pipeline.",
      },
      {
        role: "Sales / Manager",
        can: [
          "Semua dokumen sales",
          "Setup pricelist & team",
          "Unlock SO / otorisasi diskon besar",
        ],
        cannot: [
          "Post journal entry akuntansi (kecuali juga Accounting)",
          "Ubah Chart of Accounts",
        ],
        whyDifferent:
          "Manager mengontrol kebijakan harga & oversight, bukan tutup buku.",
      },
    ],
    notes: [
      "Warehouse User dibutuhkan untuk Validate Delivery",
      "Accounting User dibutuhkan untuk Confirm Invoice & Payment",
    ],
  },
  levels: {
    beginner: [
      "Buat Quotation untuk customer seed",
      "Pahami status Quotation vs Sales Order",
      "Confirm SO sederhana dengan stok cukup",
      "Buat invoice Regular dari SO",
    ],
    intermediate: [
      "Atur Invoicing Policy per produk",
      "Partial delivery + backorder",
      "Pakai pricelist & diskon line",
      "Send by Email & portal signature (jika aktif)",
    ],
    advanced: [
      "Down payment & final invoice",
      "Multi-address: ship to vs invoice to",
      "Quotation templates & optional products",
      "Analisis margin & salesperson reporting",
    ],
    expert: [
      "Desain kebijakan Lock Confirmed + change control",
      "Integrasi MTO/Buy route dengan Purchase",
      "Fiscal position & tax mapping lintas tipe pelanggan",
      "Optimasi O2C KPI (cycle time quotation→cash)",
    ],
  },
  exercises: [
    {
      id: "ex-so-basic",
      title: "Quotation retail Kopi + Jasa",
      objective: `Membuat Quotation lengkap untuk ${customer.name}`,
      prerequisites: ["Contacts customer ada", "Produk Can be Sold"],
      task: [
        `Buat Quotation: ${kopi.name} × ${seed.so.kopiQty}, ${jasa.name} × ${seed.so.jasaQty}`,
        "Save dan catat nomor dokumen",
      ],
      expectedResult: "Status Quotation; total termasuk PPN 11%",
      checklist: ["Customer benar", "Harga benar", "Tax terpasang"],
    },
    {
      id: "ex-confirm-deliver",
      title: "Confirm dan kirim",
      objective: "Menyelesaikan delivery goods",
      prerequisites: [`On Hand ${kopi.name} ≥ ${seed.so.kopiQty}`],
      task: ["Confirm SO", "Validate Delivery", "Cek On Hand turun"],
      expectedResult: "Picking Done; qty_delivered terisi",
      checklist: ["Tidak ada backorder tak sengaja", "SO Delivery Status updated"],
    },
    {
      id: "ex-invoice",
      title: "Invoice dari SO",
      objective: "Post customer invoice",
      prerequisites: ["SO delivered sesuai policy"],
      task: ["Create Invoice", "Confirm", "Cek Invoice Status SO"],
      expectedResult: "Fully Invoiced; journal posted",
      checklist: ["Origin menunjuk SO", "Tax 11%", "Partner = customer"],
    },
    {
      id: "ex-partial",
      title: "Partial delivery",
      objective: "Latihan backorder",
      prerequisites: ["SO qty lebih besar dari On Hand parsial"],
      task: [
        "Validate delivery sebagian",
        "Buat backorder",
        "Invoice qty delivered saja",
      ],
      expectedResult: "Dua picking; invoice parsial",
      checklist: ["Backorder linked", "SO masih punya qty to deliver"],
    },
    {
      id: "ex-distributor-dp",
      title: "Down payment distributor",
      objective: `Simulasi DP untuk ${distributor.name}`,
      prerequisites: ["SO confirmed ke distributor"],
      task: [
        "Create Invoice Down payment 30%",
        "Post",
        "Buat final invoice setelah deliver",
      ],
      expectedResult: "DP ter-apply di final invoice",
      checklist: ["Product Down Payment line muncul", "AR berkurang sesuai payment"],
    },
  ],
  coreFlowLinks: [
    { label: "Core Flow Sales", href: "/modul/flow-sales" },
    { label: "Quotation sampai SO", href: "/modul/flow-sales/quotation-to-so" },
    { label: "Delivery & Invoice", href: "/modul/flow-sales/delivery-invoice" },
    { label: "Invoicing & Payment", href: "/modul/flow-invoicing" },
    { label: "E2E Cycle", href: "/modul/flow-end-to-end" },
  ],
};
