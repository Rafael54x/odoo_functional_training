import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const vendor = seed.vendors.bahan;
const vendorKemasan = seed.vendors.kemasan;
const kopi = seed.products.kopi;
const teh = seed.products.teh;
const dus = seed.products.dus;
const company = seed.company;

export const purchaseDeepDive: DeepDiveModule = {
  slug: "purchase",
  name: "Purchase — Procure to Pay",
  shortTitle: "Purchase",
  icon: "ShoppingCart",
  category: "Operasional",
  wave: 1,
  availability: "available",
  apps: ["Purchase", "Inventory", "Invoicing"],
  overview: {
    function:
      "Modul Purchase mengelola siklus Procure-to-Pay: Request for Quotation (RFQ), Purchase Order (PO), Receipt barang, hingga Vendor Bill. Di Odoo 19 Enterprise, Purchase terhubung ke Inventory (incoming picking) dan Accounting (hutang usaha).",
    businessProblem:
      "Tanpa Purchase formal, pemesanan ke supplier tidak terdokumentasi, receipt tidak tercatat, dan tagihan vendor sulit dicocokkan dengan barang yang benar-benar diterima.",
    typicalUsers: [
      "Purchasing Officer",
      "Purchase Manager",
      "Warehouse Receiver",
      "AP Accountant",
    ],
    whenNeeded:
      "Ketika perusahaan membeli barang storable/jasa dari vendor secara berulang dan butuh jejak RFQ→PO→Receipt→Bill.",
    relatedModules: ["Contacts", "Inventory", "Accounting / Invoicing", "Sales"],
    businessScenario: `${company.name} membeli bahan baku dari ${vendor.name}: ${kopi.name} × ${seed.po.kopiQty} (harga beli ${kopi.purchasePrice}) dan ${teh.name} × ${seed.po.tehQty} (harga beli ${teh.purchasePrice}). Setelah PO dikonfirmasi, gudang menerima di WH/Stock, lalu Accounting memproses Vendor Bill dengan Pajak Pembelian 11% dan payment terms ${vendor.paymentTerms}. Kemasan dibeli dari ${vendorKemasan.name} saat dibutuhkan.`,
  },
  prerequisites: {
    modules: ["Contacts", "Inventory", "Invoicing / Accounting"],
    masterData: [
      `Vendor: ${vendor.name}, ${vendorKemasan.name}`,
      `Produk: ${kopi.name}, ${teh.name}, ${dus.name} (Can be Purchased)`,
      "Pajak Pembelian 11%",
      `Payment Terms: ${vendor.paymentTerms}, ${vendorKemasan.paymentTerms}`,
      "Warehouse & lokasi WH/Stock",
    ],
    configuration: [
      "Purchase → Settings: Unit of Measure (jika multi-UoM)",
      "Purchase → Settings: Purchase Agreements (opsional)",
      "3-way matching (PO–Receipt–Bill) sesuai kebijakan",
      "Product: route Buy aktif untuk restock",
    ],
    access: [
      "Purchase / User: buat RFQ & PO",
      "Purchase / Manager: approval, settings",
      "Inventory / User: validate receipt",
      "Accounting / Billing: create & post vendor bill",
    ],
    relationships:
      "PO confirmed membuat stock.picking incoming; Validate Receipt menambah quants; Create Bill membuat account.move in_invoice. Vendor harus res.partner dengan supplier flag.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Purchase'",
      "Klik Install pada aplikasi Purchase",
      "Pastikan menu Purchase muncul di App Switcher",
    ],
    dependencies: [
      "Contacts",
      "Inventory (untuk receipt)",
      "Invoicing (untuk vendor bills)",
    ],
    afterInstall: [
      "Purchase → Configuration → Settings: aktifkan opsi yang relevan",
      "Pastikan produk Can be Purchased = True",
      "Hubungkan kategori produk ke Expense/Stock Interim accounts",
    ],
    newMenus: [
      "Purchase → Orders → Requests for Quotation",
      "Purchase → Orders → Purchase Orders",
      "Purchase → Vendors",
      "Purchase → Products",
      "Purchase → Reporting",
      "Purchase → Configuration → Settings",
    ],
    newSettings: [
      "Settings → Purchase → Orders",
      "Settings → Purchase → Invoicing",
      "Settings → Purchase → Products",
    ],
  },
  configurations: [
    {
      id: "pur-order-approval",
      name: "Purchase Order Approval",
      location: "Settings → Purchase → Orders → Purchase Order Approval",
      what: "Meajibkan persetujuan manajer jika total PO melebihi ambang.",
      whyEnable:
        "Mengontrol belanja dan mencegah PO besar tanpa otorisasi.",
      whenEnable:
        "Organisasi dengan hierarki purchasing dan budget control.",
      whenNot:
        "Tim kecil di database demo di mana Admin selalu yang membuat PO.",
      businessExample: `PO ke ${vendor.name} di atas Rp 5.000.000 butuh Approve sebelum Confirm.`,
      impact:
        "Tombol Confirm diganti Approve; status Waiting Approval muncul.",
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Settings — aktifkan opsi Purchase Order Approval",
      },
    },
    {
      id: "pur-3way",
      name: "3-Way Matching (Bill Control)",
      location: "Settings → Purchase → Invoicing → Bill Control / Product → Control Policy",
      what: "Vendor bill dikontrol berdasarkan ordered qty atau received qty.",
      whyEnable:
        "Mencegah bayar barang yang belum diterima (received quantities).",
      whenEnable:
        "Barang fisik: selalu Received quantities. Jasa: Ordered quantities.",
      whenNot:
        "Jangan pakai Ordered untuk barang storable jika receipt sering terlambat.",
      businessExample: `${kopi.name} = Received quantities; jasa angkut vendor = Ordered.`,
      impact:
        "Create Bill hanya mengambil qty sesuai policy; menghindari overbilling.",
    },
    {
      id: "pur-warnings",
      name: "Warnings on Purchase Products / Vendors",
      location: "Settings → Purchase → Orders → Warnings",
      what: "Peringatan saat memilih produk/vendor tertentu di RFQ.",
      whyEnable:
        "Mengingatkan purchaser tentang MOQ, lead time, atau vendor bermasalah.",
      whenEnable:
        "Ada vendor dengan syarat khusus atau produk restricted.",
      whenNot:
        "Master data masih kotor — warning akan terlalu sering dan diabaikan.",
      businessExample: `Warning pada ${vendor.name}: "Lead time 5 hari — jangan janjikan receipt H+1".`,
      impact:
        "Popup warning saat pilih partner/product di purchase.order.",
    },
    {
      id: "pur-agreements",
      name: "Purchase Agreements",
      location: "Settings → Purchase → Orders → Purchase Agreements",
      what: "Blanket Order / Tender untuk perjanjian jangka panjang.",
      whyEnable:
        "Mengikat harga kontrak volume dengan supplier strategis.",
      whenEnable:
        "Kontrak tahunan bahan baku dengan harga fixed/tiered.",
      whenNot:
        "Pembelian spot sekali jalan — RFQ biasa cukup.",
      businessExample: `Blanket order ${kopi.name} 12 bulan dengan ${vendor.name}.`,
      impact:
        "Menu Purchase Agreements muncul; RFQ bisa digenerate dari agreement.",
    },
    {
      id: "pur-uom",
      name: "Units of Measure",
      location: "Settings → Purchase → Products → Units of Measure",
      what: "Mengizinkan UoM beli berbeda dari UoM stok (mis. dus vs unit).",
      whyEnable:
        "Vendor menjual dalam kemasan berbeda dari satuan inventory internal.",
      whenEnable:
        "Packaging conversion diperlukan (box of 12, kg, dll).",
      whenNot:
        "Semua transaksi dalam Units yang sama — kompleksitas sia-sia.",
      businessExample: `${dus.name} dibeli per pack; stok dicatat per unit setelah konversi.`,
      impact:
        "Field UoM & Purchase UoM aktif di produk dan line PO.",
    },
    {
      id: "pur-dropship",
      name: "Dropshipping",
      location: "Settings → Purchase → Logistics → Dropshipping",
      what: "Vendor mengirim langsung ke customer tanpa lewat gudang sendiri.",
      whyEnable:
        "Mengurangi handling stock untuk order yang diarahkan ke supplier.",
      whenEnable:
        "Model jual barang yang tidak disimpan di WH sendiri.",
      whenNot:
        `${company.name} demo fokus stok sendiri — dropship bisa membingungkan pemula.`,
      businessExample:
        "SO customer memicu PO dropship; receipt/delivery khusus route Dropship.",
      impact:
        "Route Dropship tersedia; PO terkait SO tanpa stok di WH/Stock.",
    },
    {
      id: "pur-lock-confirmed",
      name: "Lock Confirmed Orders",
      location: "Settings → Purchase → Orders → Lock Confirmed Orders",
      what: "Mengunci PO confirmed agar line tidak diubah bebas.",
      whyEnable:
        "Menjaga keselarasan receipt & bill dengan komitmen ke vendor.",
      whenEnable:
        "Multi-user purchasing dengan risiko edit setelah Confirm.",
      whenNot:
        "Frekuensi amandemen PO tinggi tanpa proses unlock formal.",
      businessExample: `Setelah PO ${vendor.name} confirmed, qty ${seed.po.kopiQty} terkunci untuk receipt.`,
      impact:
        "PO read-only setelah Confirm kecuali di-unlock Manager.",
    },
  ],
  masterData: [
    {
      id: "md-vendor",
      name: "Vendor (res.partner)",
      purpose: "Supplier yang menerima PO dan menerbitkan vendor bill.",
      required: true,
      whyNeeded:
        "Header RFQ/PO membutuhkan vendor; payment terms & alamat belanja mengikuti partner.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama legal vendor",
          why: "Tercetak di PO dan bill",
          example: vendor.name,
          impactIfEmpty: "Contact tidak tersimpan",
        },
        {
          field: "Address",
          type: "Char / Many2one",
          required: true,
          purpose: "Alamat order & korespondensi",
          why: "Dokumen pengiriman PO",
          example: `${vendor.street}, ${vendor.city}, ${vendor.country}`,
          impactIfEmpty: "PO cetak tanpa alamat lengkap",
        },
        {
          field: "Email / Phone",
          type: "Char",
          required: false,
          purpose: "Kirim RFQ/PO",
          why: "Send by Email ke purchasing vendor",
          example: `${vendor.email} / ${vendor.phone}`,
          impactIfEmpty: "Tidak bisa email PO otomatis",
        },
        {
          field: "VAT / Tax ID",
          type: "Char",
          required: false,
          purpose: "NPWP vendor",
          why: "Compliance & e-faktur konteks lokal",
          example: vendor.taxId,
          impactIfEmpty: "Laporan pajak vendor kurang identitas",
        },
        {
          field: "Payment Terms",
          type: "Many2one",
          required: false,
          purpose: "Jatuh tempo hutang",
          why: "AP cash planning",
          example: vendor.paymentTerms,
          impactIfEmpty: "Terms diisi manual tiap PO",
          related: "account.payment.term",
        },
        {
          field: "Tags",
          type: "Many2many",
          required: false,
          purpose: "Klasifikasi vendor",
          why: "Filter Bahan Baku vs Packaging",
          example: vendor.tags,
          impactIfEmpty: "Sulit segmentasi supplier",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/03-contacts-form-new.png",
        caption: "Form Contact baru — setup vendor",
      },
    },
    {
      id: "md-product-purchase",
      name: "Product Purchasable",
      purpose: "Barang yang bisa dibeli; harga beli, pajak beli, dan control policy.",
      required: true,
      whyNeeded:
        "Line PO mereferensi produk; receipt & valuation bergantung tipe Goods.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama item beli",
          why: "Harus sama dengan yang dikenal gudang",
          example: kopi.name,
          impactIfEmpty: "Produk invalid",
        },
        {
          field: "Can be Purchased",
          type: "Boolean",
          required: true,
          purpose: "Muncul di Purchase",
          why: "Filter product di RFQ lines",
          example: "True",
          impactIfEmpty: "Tidak bisa dipilih di PO",
        },
        {
          field: "Cost / Purchase Price",
          type: "Float / Monetary",
          required: true,
          purpose: "Harga beli default",
          why: "Default unit price RFQ",
          example: kopi.purchasePrice,
          impactIfEmpty: "Harga 0 — bill salah",
        },
        {
          field: "Vendor Taxes",
          type: "Many2many",
          required: false,
          purpose: "Pajak pembelian",
          why: "PPN masukan 11%",
          example: kopi.purchaseTax,
          impactIfEmpty: "Bill tanpa PPN — tax credit hilang",
          related: "account.tax",
        },
        {
          field: "Control Policy",
          type: "Selection",
          required: true,
          purpose: "On ordered / received quantities",
          why: "3-way matching",
          example: "On received quantities",
          impactIfEmpty: "Default company; risiko bill sebelum receipt",
        },
        {
          field: "Vendor (seller_ids)",
          type: "One2many",
          required: false,
          purpose: "Vendor pricelist per produk",
          why: "Lead time & harga spesifik supplier",
          example: `${vendor.name} — price ${kopi.purchasePrice}`,
          impactIfEmpty: "Harga hanya dari Cost field",
          related: "product.supplierinfo",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products list — pastikan Can be Purchased aktif",
      },
    },
    {
      id: "md-supplierinfo",
      name: "Vendor Pricelist (product.supplierinfo)",
      purpose: "Harga, lead time, dan minimal qty per pasangan produk–vendor.",
      required: false,
      whyNeeded:
        "Mempercepat RFQ otomatis dan replenishment dengan harga vendor yang benar.",
      fields: [
        {
          field: "Vendor",
          type: "Many2one",
          required: true,
          purpose: "Supplier untuk produk ini",
          why: "Replenishment tahu ke siapa beli",
          example: vendor.name,
          impactIfEmpty: "Rule tidak valid",
          related: "res.partner",
        },
        {
          field: "Price",
          type: "Float",
          required: true,
          purpose: "Harga beli dari vendor",
          why: "Auto-fill di RFQ",
          example: kopi.purchasePrice,
          impactIfEmpty: "Harga 0 di RFQ",
        },
        {
          field: "Delivery Lead Time",
          type: "Integer",
          required: false,
          purpose: "Hari sampai barang tiba",
          why: "Expected Arrival di PO",
          example: "5",
          impactIfEmpty: "Scheduled date kurang akurat",
        },
        {
          field: "Quantity (min)",
          type: "Float",
          required: false,
          purpose: "MOQ",
          why: "Cegah order di bawah minimum vendor",
          example: "10",
          impactIfEmpty: "Bisa order qty terlalu kecil",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts (Vendor)" },
      { id: "products", label: "Products" },
      { id: "purchase", label: "Purchase (RFQ/PO)" },
      { id: "stock", label: "Inventory (Receipt)" },
      { id: "account", label: "Accounting (Vendor Bill)" },
    ],
    edges: [
      {
        from: "contacts",
        to: "purchase",
        why: "Vendor partner_id wajib di purchase.order",
      },
      {
        from: "products",
        to: "purchase",
        why: "Order lines butuh product.product yang Can be Purchased",
      },
      {
        from: "purchase",
        to: "stock",
        why: "Confirm PO membuat stock.picking type incoming",
      },
      {
        from: "stock",
        to: "account",
        why: "Received qty membuka qty to bill pada control policy received",
      },
      {
        from: "purchase",
        to: "account",
        why: "Create Bill menghasilkan account.move in_invoice",
      },
    ],
    summary:
      "Purchase berdiri di atas Contacts & Products; Confirm mengalirkan barang ke Inventory; Bill menutup hutang di Accounting. Stok hasil Purchase menjadi prasyarat Sales delivery.",
  },
  forms: [
    {
      id: "form-rfq",
      name: "Request for Quotation (purchase.order state=draft/sent)",
      menuPath: "Purchase → Orders → Requests for Quotation → New",
      fields: [
        {
          field: "Vendor",
          required: true,
          purpose: "Supplier tujuan RFQ",
          why: "Menentukan terms & alamat",
          example: vendor.name,
        },
        {
          field: "Vendor Reference",
          required: false,
          purpose: "Nomor penawaran vendor",
          why: "Matching saat bill datang",
          example: "SQ-SM-2026-001",
        },
        {
          field: "Order Deadline",
          required: false,
          purpose: "Batas konfirmasi ke vendor",
          why: "Follow-up purchasing",
          example: "2026-10-14",
        },
        {
          field: "Expected Arrival",
          required: false,
          purpose: "Perkiraan barang tiba",
          why: "Planning gudang & sales",
          example: "2026-10-20",
        },
        {
          field: "Products — Product",
          required: true,
          purpose: "Item dibeli",
          why: "Inti RFQ",
          example: kopi.name,
        },
        {
          field: "Products — Quantity",
          required: true,
          purpose: "Qty diminta",
          why: "Receipt & bill qty",
          example: seed.po.kopiQty,
        },
        {
          field: "Products — Unit Price",
          required: true,
          purpose: "Harga beli",
          why: "Total PO & AP",
          example: kopi.purchasePrice,
        },
        {
          field: "Products — Taxes",
          required: false,
          purpose: "Pajak beli",
          why: "PPN masukan",
          example: kopi.purchaseTax,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
        caption: "Form RFQ Purchase — vendor dan product lines",
        whatToFill: `Vendor ${vendor.name}; ${kopi.name} × ${seed.po.kopiQty}`,
      },
    },
    {
      id: "form-po",
      name: "Purchase Order (purchase.order state=purchase)",
      menuPath: "Purchase → Orders → Purchase Orders",
      fields: [
        {
          field: "Vendor",
          required: true,
          purpose: "Supplier confirmed",
          why: "Kontrak pembelian",
          example: vendor.name,
        },
        {
          field: "Confirmation Date",
          required: true,
          purpose: "Tanggal PO confirmed",
          why: "KPI lead time",
          example: "2026-10-15",
        },
        {
          field: "Deliver To",
          required: true,
          purpose: "Warehouse tujuan",
          why: "Picking location incoming",
          example: "WH/Stock",
        },
        {
          field: "Order Lines",
          required: true,
          purpose: "Komitmen beli",
          why: "Dasar receipt & bill",
          example: `${kopi.name} × ${seed.po.kopiQty}; ${teh.name} × ${seed.po.tehQty}`,
        },
        {
          field: "Receipt Status",
          required: false,
          purpose: "Progress penerimaan",
          why: "Ops follow-up",
          example: "Fully Received",
        },
        {
          field: "Billing Status",
          required: false,
          purpose: "Progress tagihan",
          why: "AP follow-up",
          example: "Waiting Bills / Fully Billed",
        },
        {
          field: "Buyer",
          required: false,
          purpose: "Purchaser bertanggung jawab",
          why: "Reporting & approval",
          example: "Purchase User",
        },
        {
          field: "Payment Terms",
          required: false,
          purpose: "Terms hutang",
          why: "Due date bill",
          example: vendor.paymentTerms,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/04-purchase-rfq-list.png",
        caption: "List RFQ / Purchase Orders",
      },
    },
  ],
  procedures: [
    {
      id: "proc-create-rfq",
      title: "Membuat RFQ ke PT Sumber Bahan Makmur",
      goal: `RFQ draft: ${kopi.name} × ${seed.po.kopiQty} dan ${teh.name} × ${seed.po.tehQty}.`,
      preparation: [
        `Vendor ${vendor.name} tersedia`,
        `Produk ${kopi.name} & ${teh.name} Can be Purchased`,
        "Login Purchase User / Admin",
      ],
      steps: [
        "Home → Purchase → Orders → Requests for Quotation → New",
        `Vendor: ${vendor.name}`,
        `Payment Terms: ${vendor.paymentTerms}`,
        `Add product: ${kopi.name}, Qty ${seed.po.kopiQty}, Price ${kopi.purchasePrice}, Tax ${kopi.purchaseTax}`,
        `Add product: ${teh.name}, Qty ${seed.po.tehQty}, Price ${teh.purchasePrice}, Tax ${teh.purchaseTax}`,
        "Isi Expected Arrival (mis. +5 hari) → Save",
      ],
      expectedResult: "RFQ tersimpan status RFQ; total + PPN terlihat.",
      verification: [
        "Status = RFQ",
        "Dua lines produk",
        "Deliver To mengarah ke WH",
      ],
      fillFields: [
        { field: "Vendor", value: vendor.name, where: "Header", how: "Pilih", required: true },
        { field: "Payment Terms", value: vendor.paymentTerms, where: "Header", how: "Pilih" },
        {
          field: "Product (line 1)",
          value: kopi.name,
          where: "Products",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity (line 1)",
          value: seed.po.kopiQty,
          where: "Products",
          how: "Ketik",
          required: true,
        },
        {
          field: "Unit Price (line 1)",
          value: kopi.purchasePrice,
          where: "Products",
          how: "Ketik/otomatis",
          required: true,
        },
        {
          field: "Product (line 2)",
          value: teh.name,
          where: "Products",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity (line 2)",
          value: seed.po.tehQty,
          where: "Products",
          how: "Ketik",
          required: true,
        },
        {
          field: "Unit Price (line 2)",
          value: teh.purchasePrice,
          where: "Products",
          how: "Ketik/otomatis",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
        caption: "Form RFQ diisi untuk vendor bahan baku",
      },
    },
    {
      id: "proc-confirm-receive",
      title: "Confirm PO dan Validate Receipt",
      goal: "Mengubah RFQ menjadi PO dan menerima barang ke WH/Stock.",
      preparation: ["RFQ sudah akurat harga & qty", "Lokasi receipt siap"],
      steps: [
        "Buka RFQ → Confirm Order",
        "Status = Purchase Order; smart button Receipt muncul",
        "Klik Receipt → buka incoming picking",
        `Pastikan qty ${kopi.name} = ${seed.po.kopiQty}, ${teh.name} = ${seed.po.tehQty}`,
        "Validate → Apply",
        "Kembali ke PO: Receipt Status = Fully Received",
      ],
      expectedResult: "On Hand bertambah; picking Done; siap Create Bill.",
      verification: [
        `Inventory: On Hand ${kopi.name} naik ${seed.po.kopiQty}`,
        "PO Receipt = Fully Received",
        "Billing Status = Waiting Bills (received policy)",
      ],
      fillFields: [
        {
          field: "Quantity Done — Kopi",
          value: seed.po.kopiQty,
          where: "Receipt Operations",
          how: "Ketik/otomatis",
          required: true,
        },
        {
          field: "Quantity Done — Teh",
          value: seed.po.tehQty,
          where: "Receipt Operations",
          how: "Ketik/otomatis",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Receipts Inventory — validate penerimaan dari PO",
      },
    },
    {
      id: "proc-vendor-bill",
      title: "Create Vendor Bill dari PO",
      goal: "Membuat dan memposting tagihan vendor sesuai barang diterima.",
      preparation: [
        "PO confirmed",
        "Receipt divalidasi jika control policy = received",
      ],
      steps: [
        "Buka PO → Create Bill",
        "Review line, pajak, dan Bill Reference",
        "Isi Bill Date & Accounting Date",
        "Confirm (Post)",
        "Opsional: Register Payment sesuai jatuh tempo",
      ],
      expectedResult: "account.move in_invoice Posted; PO Fully Billed.",
      verification: [
        "Accounting → Vendors → Bills: bill baru",
        `Hutanga ${vendor.name} bertambah`,
        "PO Billing Status = Fully Billed",
      ],
      fillFields: [
        {
          field: "Vendor",
          value: vendor.name,
          where: "Bill Header",
          how: "Otomatis",
          required: true,
        },
        {
          field: "Bill Reference",
          value: "INV-SBM-001",
          where: "Bill Header",
          how: "Ketik",
          note: "Nomor invoice dari vendor",
        },
        {
          field: "Payment Terms",
          value: vendor.paymentTerms,
          where: "Bill Header",
          how: "Otomatis/pilih",
        },
        {
          field: "Product lines",
          value: `${kopi.name} × ${seed.po.kopiQty}; ${teh.name} × ${seed.po.tehQty}`,
          where: "Invoice Lines",
          how: "Otomatis dari PO",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/14-vendor-bills.png",
        caption: "Vendor Bills — hasil Create Bill dari Purchase Order",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-p2p-standard",
      title: "Procure-to-Pay standar bahan baku",
      whenToUse: `Restock rutin dari ${vendor.name}.`,
      flow: ["RFQ", "Confirm PO", "Validate Receipt", "Create Bill", "Pay"],
      notes: "Jalur utama latihan Core Flow Purchase.",
    },
    {
      id: "sc-rfq-compare",
      title: "Bandingkan penawaran dua vendor",
      whenToUse: "Harga spot berubah; perlu negosiasi.",
      flow: [
        `RFQ ke ${vendor.name}`,
        `RFQ paralel ke vendor alternatif`,
        "Bandingkan unit price",
        "Confirm hanya RFQ termurah/terbaik",
        "Cancel RFQ lain",
      ],
    },
    {
      id: "sc-partial-receipt",
      title: "Penerimaan parsial + backorder",
      whenToUse: "Vendor kirim sebagian dulu.",
      flow: [
        "Confirm PO",
        "Receipt qty < demand",
        "Validate + Create Backorder",
        "Bill qty received saja",
        "Terima sisa di backorder",
      ],
    },
    {
      id: "sc-packaging-buy",
      title: "Beli kemasan dari CV Kemasan Prima",
      whenToUse: `Stok ${dus.name} menipis.`,
      flow: [
        `RFQ ke ${vendorKemasan.name}`,
        `Line ${dus.name} qty sesuai kebutuhan`,
        "Confirm → Receive → Bill",
        "Terms 15 Days",
      ],
    },
  ],
  integrations: [
    {
      id: "int-pur-inventory",
      withModule: "Inventory",
      relationship: "PO → stock.picking incoming",
      whatHappens:
        "Confirm PO membuat receipt; Validate menambah stock.quant dan qty_received di purchase.order.line.",
    },
    {
      id: "int-pur-accounting",
      withModule: "Accounting",
      relationship: "PO → account.move in_invoice",
      whatHappens:
        "Create Bill menyalin line PO; GR/IR atau stock interim terselesaikan sesuai metode valuation.",
    },
    {
      id: "int-pur-sales",
      withModule: "Sales",
      relationship: "Stok hasil Purchase mendukung delivery SO",
      whatHappens: `Tanpa receipt ${kopi.name}, Sales ke ${seed.customers.toko.name} tidak bisa Validate Delivery.`,
    },
    {
      id: "int-pur-contacts",
      withModule: "Contacts",
      relationship: "Vendor master",
      whatHappens:
        "Payment terms, bank account, dan tax ID vendor mengalir ke PO & bill.",
    },
  ],
  mistakes: [
    {
      id: "m-bill-before-receipt",
      problem: "Create Bill penuh sebelum barang diterima (received policy)",
      why: "Membayar barang yang belum ada — mismatch stok & AP",
      detect: "Bill qty > qty_received",
      fix: "Reset to draft / credit note; bill ulang setelah receipt",
      prevent: "Control Policy = On received quantities untuk goods",
    },
    {
      id: "m-wrong-vendor-product",
      problem: "Produk tidak Can be Purchased",
      why: "Line RFQ tidak menemukan produk",
      detect: "Search product kosong di RFQ",
      fix: "Edit produk → centang Can be Purchased",
      prevent: "Checklist master data sebelum go-live purchasing",
    },
    {
      id: "m-duplicate-bill",
      problem: "Vendor bill manual ganda selain dari PO",
      why: "Double AP; PO tetap Waiting Bills",
      detect: "Dua bill sama reference; PO belum Fully Billed",
      fix: "Cancel bill manual; Create Bill dari PO",
      prevent: "SOP: bill selalu dari PO",
    },
    {
      id: "m-price-typo",
      problem: "Unit price RFQ salah ketik (mis. 900000 bukan 90000)",
      why: "Overpay vendor; margin sales rusak",
      detect: "Total PO jauh di atas norma; variance vs seller_ids",
      fix: "Cancel/ambil draft sebelum bill; koreksi price",
      prevent: "Pakai product.supplierinfo; approval di atas threshold",
    },
    {
      id: "m-ignore-backorder",
      problem: "Validate receipt kurang qty tanpa backorder",
      why: "Sisa PO hilang dari radar gudang",
      detect: "PO Fully Received padahal fisik belum lengkap",
      fix: "Manual receipt tambahan atau koreksi qty",
      prevent: "Selalu Create Backorder jika qty kurang",
    },
  ],
  troubleshooting: [
    {
      id: "t-no-receipt",
      problem: "Smart button Receipt tidak muncul setelah Confirm",
      causes: [
        "Produk bertipe Service",
        "Route/Dropship khusus",
        "Inventory app belum terpasang",
      ],
      diagnosis: [
        "Cek Product Type",
        "Cek apakah Inventory terinstall",
        "Cek purchase.order picking_ids",
      ],
      solution: [
        "Ubah ke Goods storable jika memang barang",
        "Install Inventory",
        "Buat manual receipt jika darurat (hati-hati)",
      ],
      prevention: "Master produk benar sebelum Confirm PO",
    },
    {
      id: "t-nothing-to-bill",
      problem: "Nothing to bill pada PO",
      causes: [
        "Received policy tapi belum validate receipt",
        "Sudah Fully Billed",
      ],
      diagnosis: [
        "Cek qty_received vs qty_invoiced",
        "Cek Control Policy produk",
      ],
      solution: [
        "Validate Receipt",
        "Atau ubah policy untuk jasa",
      ],
      prevention: "Urutan Confirm → Receive → Bill",
    },
    {
      id: "t-tax-purchase",
      problem: "Bill tanpa Pajak Pembelian 11%",
      causes: [
        "Vendor Taxes kosong di produk",
        "Fiscal position mengganti tax ke kosong",
      ],
      diagnosis: [
        "Cek product vendor taxes",
        "Cek line tax di PO sebelum Confirm",
      ],
      solution: [
        `Set ${kopi.purchaseTax} di produk`,
        "Update line PO/bill",
      ],
      prevention: "Tax default di kategori produk",
    },
    {
      id: "t-cannot-confirm",
      problem: "Tidak bisa Confirm (Waiting Approval)",
      causes: ["Approval rule aktif", "User bukan Manager"],
      diagnosis: [
        "Cek Settings Purchase Approval",
        "Cek activity Approvers",
      ],
      solution: [
        "Login sebagai Purchase Manager → Approve",
        "Atau nonaktifkan approval di database latihan",
      ],
      prevention: "Dokumentasikan matriks approval sebelum produksi",
    },
  ],
  behind: {
    models: [
      "purchase.order",
      "purchase.order.line",
      "product.supplierinfo",
      "stock.picking",
      "stock.move",
      "account.move",
      "account.move.line",
      "res.partner",
    ],
    relations: [
      "purchase.order.partner_id → res.partner",
      "purchase.order.order_line → purchase.order.line",
      "purchase.order.picking_ids → stock.picking",
      "purchase.order.invoice_ids → account.move",
      "product.supplierinfo.partner_id → res.partner",
    ],
    automations: [
      "button_confirm: draft→purchase, create incoming pickings",
      "_create_invoices / action_create_invoice: vendor bills",
      "stock move done updates qty_received",
    ],
    securityNotes: [
      "purchase.group_purchase_user vs purchase.group_purchase_manager",
      "Approval amount memakai purchase.order amount_total",
    ],
    note: "Model pusat P2P adalah purchase.order; state RFQ/sent/to approve/purchase/done/cancel.",
  },
  reporting: [
    {
      name: "Purchase Analysis",
      path: "Purchase → Reporting → Purchase",
      kpi: "Spend per vendor/produk",
      decision: `Evaluasi ketergantungan pada ${vendor.name}`,
    },
    {
      name: "Vendor Delay",
      path: "Purchase → Reporting (pivot Expected vs Effective)",
      kpi: "Lead time aktual vs janji",
      decision: "Ganti vendor atau ubah safety stock",
    },
    {
      name: "Orders to Receive",
      path: "Purchase → Orders → Purchase Orders (Not Received)",
      kpi: "Backlog inbound",
      decision: "Eskalasi follow-up receipt",
    },
    {
      name: "Waiting Bills",
      path: "Purchase → Orders → Purchase Orders (Waiting Bills)",
      kpi: "AP belum tercatat",
      decision: "Create Bill segera agar hutang akurat",
    },
  ],
  security: {
    roles: [
      {
        role: "Purchase / User",
        can: [
          "Buat RFQ/PO",
          "Send RFQ ke vendor",
          "Confirm dalam batas tanpa approval (jika dikonfigurasi)",
        ],
        cannot: [
          "Ubah Settings Purchase",
          "Approve PO di atas threshold (jika aktif)",
          "Post payment AP tanpa hak Accounting",
        ],
        whyDifferent:
          "Purchaser operasional vs kontrol kebijakan & budget oleh Manager.",
      },
      {
        role: "Purchase / Manager",
        can: [
          "Semua PO",
          "Approve orders",
          "Setup agreements & settings",
        ],
        cannot: [
          "Mengubah COA tanpa hak Accounting",
          "Validate receipt tanpa hak Inventory (tergantung ACL)",
        ],
        whyDifferent:
          "Fokus governance purchasing, bukan pencatatan gudang/akutansi harian.",
      },
    ],
    notes: [
      "Inventory User wajib untuk Validate Receipt",
      "Billing hak Accounting untuk Confirm Vendor Bill",
    ],
  },
  levels: {
    beginner: [
      "Buat RFQ ke vendor seed",
      "Confirm PO & pahami status",
      "Validate Receipt sederhana",
      "Create Vendor Bill Regular",
    ],
    intermediate: [
      "Control Policy ordered vs received",
      "Partial receipt + backorder",
      "Vendor pricelist (supplierinfo)",
      "Payment terms & due date AP",
    ],
    advanced: [
      "Purchase agreements / blanket",
      "Multi-vendor RFQ comparison",
      "3-way matching exception handling",
      "Landed costs dasar (jika app aktif)",
    ],
    expert: [
      "Desain approval matrix & budget",
      "Integrasi replenishment reordering rules",
      "Dropship vs stok sendiri",
      "KPI P2P cycle time & price variance",
    ],
  },
  exercises: [
    {
      id: "ex-rfq-basic",
      title: "RFQ bahan baku",
      objective: `RFQ lengkap ke ${vendor.name}`,
      prerequisites: ["Vendor & produk tersedia"],
      task: [
        `Buat RFQ ${kopi.name} × ${seed.po.kopiQty}, ${teh.name} × ${seed.po.tehQty}`,
        "Save dan catat nomor",
      ],
      expectedResult: "Status RFQ; pajak 11% terpasang",
      checklist: ["Vendor benar", "Harga beli benar", "Deliver To = WH"],
    },
    {
      id: "ex-receive",
      title: "Confirm & Receive",
      objective: "Stok bertambah sesuai PO",
      prerequisites: ["RFQ sudah dibuat"],
      task: ["Confirm Order", "Validate Receipt penuh", "Cek On Hand"],
      expectedResult: "Fully Received; quant naik",
      checklist: ["Tidak ada backorder", "PO status updated"],
    },
    {
      id: "ex-bill",
      title: "Vendor Bill dari PO",
      objective: "Post AP bill",
      prerequisites: ["Receipt selesai"],
      task: ["Create Bill", "Isi Bill Reference", "Confirm"],
      expectedResult: "Fully Billed; journal posted",
      checklist: ["Origin = PO", "Tax pembelian ada"],
    },
    {
      id: "ex-partial-receipt",
      title: "Partial receipt",
      objective: "Latihan backorder inbound",
      prerequisites: ["PO confirmed"],
      task: [
        `Terima ${kopi.name} sebagian`,
        "Create Backorder",
        "Bill qty received",
      ],
      expectedResult: "Dua picking; bill parsial",
      checklist: ["Backorder linked ke PO", "Billing Status belum Fully"],
    },
    {
      id: "ex-kemasan",
      title: "PO kemasan",
      objective: `Beli ${dus.name} dari ${vendorKemasan.name}`,
      prerequisites: [`Produk ${dus.name}`, `Vendor ${vendorKemasan.name}`],
      task: [
        "RFQ → Confirm → Receive → Bill",
        `Terms ${vendorKemasan.paymentTerms}`,
      ],
      expectedResult: "Stok kemasan naik; bill 15 Days",
      checklist: ["Vendor kemasan bukan bahan", "Harga 5000"],
    },
  ],
  coreFlowLinks: [
    { label: "Core Flow Purchase", href: "/modul/flow-purchase" },
    { label: "RFQ sampai PO", href: "/modul/flow-purchase/rfq-to-po" },
    { label: "Receive & Bill", href: "/modul/flow-purchase/receive-and-bill" },
    { label: "Inventory Ops", href: "/modul/flow-inventory" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
  ],
};
