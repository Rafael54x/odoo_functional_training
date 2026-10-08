/**
 * Screenshot Odoo 19 Enterprise asli (bukan mock UI).
 * Dipakai sebagai referensi layar — layout tombol/menu sama di lab Anda
 * (http://172.16.2.123:8072 · DB odoo). Nama company/data demo di gambar
 * bisa berbeda; ikuti nilai di tabel "Isi field ini".
 */
export type RealShot = {
  src: string;
  caption: string;
  /** Poin yang harus diperhatikan di gambar */
  lookFor?: string[];
  moduleHint?: string;
};

export const enterpriseMeta = {
  edition: "Enterprise",
  version: "19.0+e",
  sourceLabel: "Screenshot UI Odoo 19 Enterprise asli",
};

const labNote =
  "UI sama di lab http://172.16.2.123:8072 (DB odoo). Data company di gambar boleh berbeda — ikuti tabel isi field.";

function shot(
  src: string,
  caption: string,
  lookFor?: string[],
): RealShot {
  return {
    src,
    caption: `${caption} · ${labNote}`,
    lookFor,
  };
}

/** Map lesson step ids → real Enterprise screenshots */
export const stepScreenshots: Record<string, RealShot> = {
  // Intro
  "konsep-apps": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Home Apps — grid modul Odoo 19 Enterprise",
    [
      "Cari ikon Contacts, Purchase, Inventory, Sales, Accounting",
      "Ikon 9 kotak di pojok = ganti Apps",
    ],
  ),
  "login-db": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Setelah login berhasil — Anda masuk ke Home Apps",
    ["Bukan lagi form login", "User terlihat di pojok kanan atas"],
  ),
  "update-apps-list": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Apps — tempat Update Apps List & Install modul",
    ["Buka Apps dari Home", "Gunakan Search untuk cari nama modul"],
  ),
  "install-contacts": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Apps — Install Contacts dari Home/Apps",
    ["Cari Contacts", "Tombol Install / Activate pada kartu app"],
  ),
  "install-purchase-inventory-sales": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Apps — Purchase, Inventory, Sales, Accounting di Home",
    ["Pastikan keempat ikon muncul setelah install"],
  ),
  "verify-menus": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Verifikasi modul transaksi tersedia di Home Apps",
    ["Purchase · Inventory · Sales · Accounting"],
  ),

  // Company
  "buka-company": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Settings — konfigurasi perusahaan",
    ["Menu Settings / Companies", "Update Info untuk edit profil"],
  ),
  "isi-identitas": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Settings — form identitas company",
    ["Company Name, Address, Tax ID, Currency"],
  ),
  "fiscal-pack": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Accounting/Invoicing Settings — Fiscal Localization",
    ["Package negara / localization sebelum transaksi"],
  ),
  "currency-lang": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Settings — Currency, Language, Preferences",
    ["Aktifkan IDR", "Timezone Asia/Jakarta di Preferences user"],
  ),
  "feature-flags": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Settings per modul — Units of Measure, Locations, dll.",
    ["Save setiap halaman settings", "Menu baru bisa muncul setelah Save"],
  ),

  // Contacts
  "buka-contacts": shot(
    "/screenshots/odoo19e/02-contacts-list.png",
    "Contacts — daftar mitra (list/kanban)",
    ["Tombol New", "Filter Customers / Vendors"],
  ),
  "rencana-data": shot(
    "/screenshots/odoo19e/02-contacts-list.png",
    "Contacts — tempat menyimpan vendor & customer seed",
    ["Nanti list terisi PT Sumber Bahan, Toko Maju Jaya, dll."],
  ),
  "new-vendor": shot(
    "/screenshots/odoo19e/03-contacts-form-new.png",
    "Form Contact baru — buat vendor",
    [
      "Pilih Company (bukan Individual)",
      "Isi Name & Address",
      "Save di pojok kiri atas / header",
    ],
  ),
  "vendor-purchase-tab": shot(
    "/screenshots/odoo19e/03-contacts-form-new.png",
    "Form Contact — buka tab Sales & Purchase",
    ["Tab di bawah header form", "Bag Purchase: Payment Terms"],
  ),
  "vendor-accounting": shot(
    "/screenshots/odoo19e/03-contacts-form-new.png",
    "Form Contact — tab Accounting (Payable)",
    ["Account Payable untuk vendor bill"],
  ),
  "child-addresses": shot(
    "/screenshots/odoo19e/03-contacts-form-new.png",
    "Form Contact — Contacts & Addresses (child)",
    ["Add Invoice Address / Contact person"],
  ),
  "new-customer": shot(
    "/screenshots/odoo19e/03-contacts-form-new.png",
    "Form Contact baru — buat customer",
    ["Tab Sales & Purchase → Payment Terms & Pricelist"],
  ),
  "dual-role": shot(
    "/screenshots/odoo19e/02-contacts-list.png",
    "Contacts list — filter Customers & Vendors",
    ["Satu partner bisa muncul di kedua filter jika dual-role"],
  ),

  // Accounting master
  "buka-coa": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — pintu masuk Chart of Accounts / dashboard",
    ["Configuration → Chart of Accounts"],
  ),
  "akun-produk": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — akun Income/Expense di kategori/produk",
    ["Tab Accounting pada produk atau Product Category"],
  ),
  "taxes": shot(
    "/screenshots/odoo19e/16-taxes.png",
    "Configuration → Taxes",
    ["Pajak penjualan & pembelian", "Percentage / tax group"],
  ),
  "journals": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — journals & dashboard",
    ["Sales, Purchase, Bank, Cash, Miscellaneous"],
  ),
  "payment-terms": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Payment Terms lewat Accounting/Invoicing config",
    ["30 Days, 15 Days dipakai di contact & dokumen"],
  ),
  "fiscal-position": shot(
    "/screenshots/odoo19e/16-taxes.png",
    "Taxes & fiscal configuration",
    ["Fiscal Position memetakan pajak domestik/impor"],
  ),

  // Inventory master
  "overview": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Inventory Overview — kartu operasi gudang",
    ["Receipts", "Delivery Orders", "Internal Transfers"],
  ),
  "warehouse-form": shot(
    "/screenshots/odoo19e/17-warehouses.png",
    "Configuration → Warehouses",
    ["Incoming/Outgoing steps (1-step vs multi-step)"],
  ),
  "locations": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Inventory — lokasi di balik Overview/Configuration",
    ["WH/Stock, Input, Output"],
  ),
  "operation-types": shot(
    "/screenshots/odoo19e/06b-inventory-overview.png",
    "Operation Types di Inventory Overview",
    ["WH/IN Receipts · WH/OUT Delivery · WH/INT Internal"],
  ),
  "product-storable": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — daftar barang storable",
    ["New → Product Type Goods", "Can be Purchased & Sold"],
  ),
  "product-service": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — termasuk tipe Service",
    ["Service tidak menambah stok gudang"],
  ),
  "category": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — kategori dari daftar/produk",
    ["Product Category mengatur akun & costing"],
  ),
  "uom": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — Unit of Measure pada form produk",
    ["Units, kg, dll. setelah UoM diaktifkan di Settings"],
  ),
  "reordering-optional": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — Reordering Rules (opsional)",
    ["Smart button Reordering / Min-Max pada produk"],
  ),

  // Purchase
  "new-rfq": shot(
    "/screenshots/odoo19e/05-purchase-rfq-form.png",
    "Form RFQ baru — Vendor, Products, status RFQ",
    [
      "Field Vendor wajib",
      "Tab Products → Add a product",
      "Status bar: RFQ → RFQ Sent → Purchase Order",
      "Tombol Send RFQ / Confirm Order",
    ],
  ),
  "send-confirm": shot(
    "/screenshots/odoo19e/05-purchase-rfq-form.png",
    "RFQ — tombol Send RFQ dan Confirm Order",
    ["Setelah Confirm, status jadi Purchase Order", "Smart button Receipt muncul"],
  ),
  "receive": shot(
    "/screenshots/odoo19e/13-inventory-receipts.png",
    "Inventory Receipts — terima barang dari PO",
    ["Validate receipt", "Qty Done = qty diterima"],
  ),
  "create-bill": shot(
    "/screenshots/odoo19e/14-vendor-bills.png",
    "Vendor Bills — tagihan dari PO",
    ["Create Bill dari PO", "Post / Confirm bill"],
  ),
  "pay-bill": shot(
    "/screenshots/odoo19e/14-vendor-bills.png",
    "Vendor Bill — Register Payment",
    ["Journal Bank/Cash", "Payment State → Paid"],
  ),
  "verify-p2p": shot(
    "/screenshots/odoo19e/04-purchase-rfq-list.png",
    "Daftar RFQ / Purchase Orders — kontrol status P2P",
    ["Receipt status", "Billing status"],
  ),

  // Inventory ops
  "internal-transfer": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Inventory Overview — Internal Transfers",
    ["Kartu Internal Transfers → New"],
  ),
  "adjustment": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Physical Inventory / Adjustments dari Overview",
    ["Sesuaikan On Hand setelah opname"],
  ),
  "traceability": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — On Hand / Moves untuk telusur stok",
    ["Smart button On Hand atau Product Moves"],
  ),
  "lots-optional": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products — Lot/Serial Tracking (opsional)",
    ["Inventory tab → Tracking By Lots / Serial"],
  ),

  // Sales
  "new-quotation": shot(
    "/screenshots/odoo19e/09-sales-quotation-form.png",
    "Form Quotation baru — Customer & order lines",
    [
      "Field Customer wajib",
      "Add product lines",
      "Status Quotation → Quotation Sent → Sales Order",
    ],
  ),
  "confirm-so": shot(
    "/screenshots/odoo19e/09-sales-quotation-form.png",
    "Quotation — Confirm menjadi Sales Order",
    ["Tombol Confirm", "Smart button Delivery muncul"],
  ),
  "validate-delivery": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Delivery Orders di Inventory Overview",
    ["Validate delivery agar stok keluar"],
  ),
  "create-invoice": shot(
    "/screenshots/odoo19e/15-customer-invoices.png",
    "Customer Invoices — dari Sales Order",
    ["Create Invoice → Draft lalu Confirm/Post"],
  ),
  "policy-compare": shot(
    "/screenshots/odoo19e/08-sales-quotations.png",
    "Daftar Quotations / Sales Orders",
    ["Invoice Status: To Invoice / Fully Invoiced"],
  ),

  // Invoicing
  "post-invoice": shot(
    "/screenshots/odoo19e/15-customer-invoices.png",
    "Customer Invoices — Confirm/Post",
    ["Status Posted", "Payment State Not Paid → lalu Register Payment"],
  ),
  "journal-items": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — journal entries / items",
    ["Smart button Journal Items pada invoice"],
  ),
  "customer-payment": shot(
    "/screenshots/odoo19e/15-customer-invoices.png",
    "Register Payment pada customer invoice",
    ["Payment State menjadi Paid setelah register"],
  ),
  "credit-note": shot(
    "/screenshots/odoo19e/15-customer-invoices.png",
    "Credit Note dari invoice customer",
    ["Tombol Credit Note / Reverse"],
  ),
  "bank-statement": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Bank reconciliation di Accounting",
    ["Bank journal → Statements / Reconciliation"],
  ),
  "aged-reports": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Reporting AR/AP di Accounting",
    ["Aged Receivable / Aged Payable"],
  ),
  "standalone-bill-invoice": shot(
    "/screenshots/odoo19e/14-vendor-bills.png",
    "Vendor Bills standalone (tanpa PO)",
    ["Vendors → Bills → New"],
  ),

  // E2E
  "script-p2p": shot(
    "/screenshots/odoo19e/04-purchase-rfq-list.png",
    "Purchase list — siklus Procure-to-Pay",
    ["PO → Receipt → Bill → Payment"],
  ),
  "script-o2c": shot(
    "/screenshots/odoo19e/08-sales-quotations.png",
    "Sales list — siklus Order-to-Cash",
    ["SO → Delivery → Invoice → Payment"],
  ),
  "closing-checks": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — cek penutup stok & AR/AP",
    ["Dashboard & laporan akhir siklus"],
  ),
  "common-errors": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Home Apps — titik balik jika menu/modul hilang",
    ["Install ulang modul yang kurang", "Cek filter Apps"],
  ),
  "competency": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Home Apps — seluruh modul yang sudah dikuasai",
    ["Contacts → Purchase → Inventory → Sales → Accounting"],
  ),

  // Users & Access (Core 02a)
  "buka-users": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Settings — pintu masuk Users & Companies",
    ["Settings → Users & Companies → Users"],
  ),
  "create-sales-user": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Users — buat user Sales",
    ["Access Rights / Groups: Sales"],
  ),
  "create-purchase-user": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Users — buat user Purchase",
    ["Access Rights / Groups: Purchase"],
  ),
  "set-passwords": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Users — set password / invite",
    ["Password atau invitation email"],
  ),
  "manager-vs-user-note": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Users — beda User vs Manager group",
    ["Manager punya config & approval lebih luas"],
  ),
  "logout-admin": shot(
    "/screenshots/odoo19e/01-home-apps.png",
    "Logout admin sebelum uji user lain",
    ["User menu → Log out"],
  ),
  "login-ayu-quotation": shot(
    "/screenshots/odoo19e/09-sales-quotation-form.png",
    "Login sebagai Sales User — buat Quotation",
    ["Hanya menu Sales yang relevan"],
  ),
  "login-budi-rfq": shot(
    "/screenshots/odoo19e/05-purchase-rfq-form.png",
    "Login sebagai Purchase User — buat RFQ",
    ["Hanya menu Purchase yang relevan"],
  ),
  "prove-no-manage-users": shot(
    "/screenshots/odoo19e/11-settings.png",
    "User biasa tidak boleh Manage Users",
    ["Settings Users tersembunyi / Access Error"],
  ),
  "wrap-matrix": shot(
    "/screenshots/odoo19e/11-settings.png",
    "Ringkas matrix akses User vs Manager",
    ["Dokumentasikan group yang dipakai di lab"],
  ),

  // Closing & Reporting (Core 10)
  "define-cutoff": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — tentukan cutoff periode latihan",
    ["Tanggal tutup operasional & akuntansi"],
  ),
  "close-purchase-ops": shot(
    "/screenshots/odoo19e/04-purchase-rfq-list.png",
    "Purchase list — tutup PO terbuka",
    ["Receipt & bill status sebelum closing"],
  ),
  "close-sales-ops": shot(
    "/screenshots/odoo19e/08-sales-quotations.png",
    "Sales list — tutup SO/delivery/invoice",
    ["Tidak ada delivery Waiting tanpa alasan"],
  ),
  "close-bills-invoices": shot(
    "/screenshots/odoo19e/15-customer-invoices.png",
    "Invoices/Bills — pastikan Posted/Paid sesuai skenario",
    ["AR/AP bersih untuk periode latihan"],
  ),
  "stock-snapshot": shot(
    "/screenshots/odoo19e/07-products-list.png",
    "Products / On Hand — snapshot stok akhir",
    ["Qty masuk akal vs receipt−delivery"],
  ),
  "closing-signoff": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Accounting — sign-off closing checklist",
    ["Dashboard & kontrol akhir"],
  ),
  "sales-analysis": shot(
    "/screenshots/odoo19e/08-sales-quotations.png",
    "Sales reporting / analysis",
    ["Omzet per customer/produk"],
  ),
  "purchase-analysis": shot(
    "/screenshots/odoo19e/04-purchase-rfq-list.png",
    "Purchase reporting / analysis",
    ["Belanja per vendor"],
  ),
  "inventory-report-restock": shot(
    "/screenshots/odoo19e/06-inventory-overview.png",
    "Inventory — putusan restock dari laporan stok",
    ["On Hand rendah → rencana PO"],
  ),
  "aged-receivable-decisions": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Aged Receivable — keputusan penagihan",
    ["Invoice jatuh tempo"],
  ),
  "aged-payable-decisions": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Aged Payable — keputusan bayar vendor",
    ["Bill jatuh tempo"],
  ),
  "decision-memo": shot(
    "/screenshots/odoo19e/10-accounting.png",
    "Closing — ringkas keputusan dari laporan",
    ["Apa yang diputuskan dari angka Odoo"],
  ),
};

export function getStepScreenshot(stepId: string): RealShot | undefined {
  return stepScreenshots[stepId];
}
