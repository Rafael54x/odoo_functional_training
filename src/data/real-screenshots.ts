/**
 * Real screenshots captured from Odoo 19.0+e (Enterprise).
 * Source: Runbot build 127573965 — server_version "19.0+e"
 */
export type RealShot = {
  src: string;
  caption: string;
  moduleHint?: string;
};

export const enterpriseMeta = {
  edition: "Enterprise",
  version: "19.0+e",
  sourceLabel: "Odoo 19 Enterprise (verified via /web/webclient/version_info)",
};

/** Map lesson step ids → real Enterprise screenshots */
export const stepScreenshots: Record<string, RealShot> = {
  // Intro
  "konsep-apps": {
    src: "/screenshots/odoo19e/01-home-apps.png",
    caption: "Home Apps Odoo 19 Enterprise — grid modul lengkap",
  },
  "login-db": {
    src: "/screenshots/odoo19e/01-home-apps.png",
    caption: "Setelah login admin — Home Apps Enterprise",
  },
  "verify-menus": {
    src: "/screenshots/odoo19e/01-home-apps.png",
    caption: "Verifikasi Purchase, Inventory, Sales, Accounting tersedia",
  },

  // Company
  "buka-company": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Settings — konfigurasi perusahaan",
  },
  "isi-identitas": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Profil company di Settings",
  },
  "fiscal-pack": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Accounting / Invoicing settings & localization",
  },
  "feature-flags": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Feature flags per modul di Settings",
  },

  // Contacts
  "buka-contacts": {
    src: "/screenshots/odoo19e/02-contacts-list.png",
    caption: "Contacts — daftar mitra",
  },
  "new-vendor": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form Contact baru (vendor/customer)",
  },
  "vendor-purchase-tab": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form contact — tab Sales & Purchase",
  },
  "vendor-accounting": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form contact — tab Accounting",
  },
  "child-addresses": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Contacts & Addresses pada company",
  },
  "new-customer": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form customer baru",
  },
  "dual-role": {
    src: "/screenshots/odoo19e/02-contacts-list.png",
    caption: "List Contacts — filter customer/vendor",
  },

  // Accounting master
  "buka-coa": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting overview / Chart of Accounts entry",
  },
  "taxes": {
    src: "/screenshots/odoo19e/16-taxes.png",
    caption: "Configuration → Taxes",
  },
  "journals": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting journals & dashboard",
  },
  "payment-terms": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Payment terms via Accounting/Invoicing config",
  },
  "fiscal-position": {
    src: "/screenshots/odoo19e/16-taxes.png",
    caption: "Taxes & fiscal configuration",
  },

  // Inventory master
  "overview": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory Overview — operation types",
  },
  "warehouse-form": {
    src: "/screenshots/odoo19e/17-warehouses.png",
    caption: "Configuration → Warehouses",
  },
  "locations": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory locations via Overview",
  },
  "operation-types": {
    src: "/screenshots/odoo19e/06b-inventory-overview.png",
    caption: "Operation Types di Inventory Overview",
  },
  "product-storable": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products list — storable goods",
  },
  "product-service": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products — termasuk service",
  },
  "category": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Product categories dari Products",
  },
  "uom": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products & UoM context",
  },

  // Purchase
  "new-rfq": {
    src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
    caption: "RFQ form baru — status RFQ → RFQ Sent → Purchase Order",
  },
  "send-confirm": {
    src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
    caption: "RFQ — tombol Send RFQ / Confirm Order",
  },
  "receive": {
    src: "/screenshots/odoo19e/13-inventory-receipts.png",
    caption: "Inventory Receipts dari PO",
  },
  "create-bill": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bills",
  },
  "pay-bill": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bill — Register Payment",
  },
  "verify-p2p": {
    src: "/screenshots/odoo19e/04-purchase-rfq-list.png",
    caption: "Purchase Orders / RFQ list — status kontrol",
  },

  // Inventory ops
  "internal-transfer": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory Overview — Internal Transfers",
  },
  "adjustment": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Physical Inventory / Adjustments",
  },
  "traceability": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Product moves / On Hand dari Products",
  },

  // Sales
  "new-quotation": {
    src: "/screenshots/odoo19e/09-sales-quotation-form.png",
    caption: "Sales Quotation form baru",
  },
  "confirm-so": {
    src: "/screenshots/odoo19e/09-sales-quotation-form.png",
    caption: "Quotation — Confirm → Sales Order",
  },
  "validate-delivery": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Delivery Orders di Inventory",
  },
  "create-invoice": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Customer Invoices dari SO",
  },
  "policy-compare": {
    src: "/screenshots/odoo19e/08-sales-quotations.png",
    caption: "Sales quotations list",
  },

  // Invoicing
  "post-invoice": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Customer Invoices — Confirm/Post",
  },
  "journal-items": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting — journal entries",
  },
  "customer-payment": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Register Payment customer",
  },
  "credit-note": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Credit Note dari invoice",
  },
  "bank-statement": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Bank reconciliation di Accounting",
  },
  "aged-reports": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Reporting AR/AP di Accounting",
  },
  "standalone-bill-invoice": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bills standalone",
  },

  // E2E
  "script-p2p": {
    src: "/screenshots/odoo19e/04-purchase-rfq-list.png",
    caption: "Purchase list — siklus P2P",
  },
  "script-o2c": {
    src: "/screenshots/odoo19e/08-sales-quotations.png",
    caption: "Sales list — siklus O2C",
  },
  "closing-checks": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting control tower",
  },
};

export function getStepScreenshot(stepId: string): RealShot | undefined {
  return stepScreenshots[stepId];
}
