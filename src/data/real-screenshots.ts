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
    caption: "Home Apps Odoo 19 Enterprise — grid modul lengkap · lab http://172.16.2.123:8072 · DB odoo",
  },
  "login-db": {
    src: "/screenshots/odoo19e/01-home-apps.png",
    caption: "Setelah login admin — Home Apps Enterprise · lab http://172.16.2.123:8072 · DB odoo",
  },
  "verify-menus": {
    src: "/screenshots/odoo19e/01-home-apps.png",
    caption: "Verifikasi Purchase, Inventory, Sales, Accounting tersedia · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Company
  "buka-company": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Settings — konfigurasi perusahaan · lab http://172.16.2.123:8072 · DB odoo",
  },
  "isi-identitas": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Profil company di Settings · lab http://172.16.2.123:8072 · DB odoo",
  },
  "fiscal-pack": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Accounting / Invoicing settings & localization · lab http://172.16.2.123:8072 · DB odoo",
  },
  "feature-flags": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Feature flags per modul di Settings · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Contacts
  "buka-contacts": {
    src: "/screenshots/odoo19e/02-contacts-list.png",
    caption: "Contacts — daftar mitra · lab http://172.16.2.123:8072 · DB odoo",
  },
  "new-vendor": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form Contact baru (vendor/customer) · lab http://172.16.2.123:8072 · DB odoo",
  },
  "vendor-purchase-tab": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form contact — tab Sales & Purchase · lab http://172.16.2.123:8072 · DB odoo",
  },
  "vendor-accounting": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form contact — tab Accounting · lab http://172.16.2.123:8072 · DB odoo",
  },
  "child-addresses": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Contacts & Addresses pada company · lab http://172.16.2.123:8072 · DB odoo",
  },
  "new-customer": {
    src: "/screenshots/odoo19e/03-contacts-form-new.png",
    caption: "Form customer baru · lab http://172.16.2.123:8072 · DB odoo",
  },
  "dual-role": {
    src: "/screenshots/odoo19e/02-contacts-list.png",
    caption: "List Contacts — filter customer/vendor · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Accounting master
  "buka-coa": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting overview / Chart of Accounts entry · lab http://172.16.2.123:8072 · DB odoo",
  },
  "taxes": {
    src: "/screenshots/odoo19e/16-taxes.png",
    caption: "Configuration → Taxes · lab http://172.16.2.123:8072 · DB odoo",
  },
  "journals": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting journals & dashboard · lab http://172.16.2.123:8072 · DB odoo",
  },
  "payment-terms": {
    src: "/screenshots/odoo19e/11-settings.png",
    caption: "Payment terms via Accounting/Invoicing config · lab http://172.16.2.123:8072 · DB odoo",
  },
  "fiscal-position": {
    src: "/screenshots/odoo19e/16-taxes.png",
    caption: "Taxes & fiscal configuration · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Inventory master
  "overview": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory Overview — operation types · lab http://172.16.2.123:8072 · DB odoo",
  },
  "warehouse-form": {
    src: "/screenshots/odoo19e/17-warehouses.png",
    caption: "Configuration → Warehouses · lab http://172.16.2.123:8072 · DB odoo",
  },
  "locations": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory locations via Overview · lab http://172.16.2.123:8072 · DB odoo",
  },
  "operation-types": {
    src: "/screenshots/odoo19e/06b-inventory-overview.png",
    caption: "Operation Types di Inventory Overview · lab http://172.16.2.123:8072 · DB odoo",
  },
  "product-storable": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products list — storable goods · lab http://172.16.2.123:8072 · DB odoo",
  },
  "product-service": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products — termasuk service · lab http://172.16.2.123:8072 · DB odoo",
  },
  "category": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Product categories dari Products · lab http://172.16.2.123:8072 · DB odoo",
  },
  "uom": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Products & UoM context · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Purchase
  "new-rfq": {
    src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
    caption: "RFQ form baru — status RFQ → RFQ Sent → Purchase Order · lab http://172.16.2.123:8072 · DB odoo",
  },
  "send-confirm": {
    src: "/screenshots/odoo19e/05-purchase-rfq-form.png",
    caption: "RFQ — tombol Send RFQ / Confirm Order · lab http://172.16.2.123:8072 · DB odoo",
  },
  "receive": {
    src: "/screenshots/odoo19e/13-inventory-receipts.png",
    caption: "Inventory Receipts dari PO · lab http://172.16.2.123:8072 · DB odoo",
  },
  "create-bill": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bills · lab http://172.16.2.123:8072 · DB odoo",
  },
  "pay-bill": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bill — Register Payment · lab http://172.16.2.123:8072 · DB odoo",
  },
  "verify-p2p": {
    src: "/screenshots/odoo19e/04-purchase-rfq-list.png",
    caption: "Purchase Orders / RFQ list — status kontrol · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Inventory ops
  "internal-transfer": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Inventory Overview — Internal Transfers · lab http://172.16.2.123:8072 · DB odoo",
  },
  "adjustment": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Physical Inventory / Adjustments · lab http://172.16.2.123:8072 · DB odoo",
  },
  "traceability": {
    src: "/screenshots/odoo19e/07-products-list.png",
    caption: "Product moves / On Hand dari Products · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Sales
  "new-quotation": {
    src: "/screenshots/odoo19e/09-sales-quotation-form.png",
    caption: "Sales Quotation form baru · lab http://172.16.2.123:8072 · DB odoo",
  },
  "confirm-so": {
    src: "/screenshots/odoo19e/09-sales-quotation-form.png",
    caption: "Quotation — Confirm → Sales Order · lab http://172.16.2.123:8072 · DB odoo",
  },
  "validate-delivery": {
    src: "/screenshots/odoo19e/06-inventory-overview.png",
    caption: "Delivery Orders di Inventory · lab http://172.16.2.123:8072 · DB odoo",
  },
  "create-invoice": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Customer Invoices dari SO · lab http://172.16.2.123:8072 · DB odoo",
  },
  "policy-compare": {
    src: "/screenshots/odoo19e/08-sales-quotations.png",
    caption: "Sales quotations list · lab http://172.16.2.123:8072 · DB odoo",
  },

  // Invoicing
  "post-invoice": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Customer Invoices — Confirm/Post · lab http://172.16.2.123:8072 · DB odoo",
  },
  "journal-items": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting — journal entries · lab http://172.16.2.123:8072 · DB odoo",
  },
  "customer-payment": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Register Payment customer · lab http://172.16.2.123:8072 · DB odoo",
  },
  "credit-note": {
    src: "/screenshots/odoo19e/15-customer-invoices.png",
    caption: "Credit Note dari invoice · lab http://172.16.2.123:8072 · DB odoo",
  },
  "bank-statement": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Bank reconciliation di Accounting · lab http://172.16.2.123:8072 · DB odoo",
  },
  "aged-reports": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Reporting AR/AP di Accounting · lab http://172.16.2.123:8072 · DB odoo",
  },
  "standalone-bill-invoice": {
    src: "/screenshots/odoo19e/14-vendor-bills.png",
    caption: "Vendor Bills standalone · lab http://172.16.2.123:8072 · DB odoo",
  },

  // E2E
  "script-p2p": {
    src: "/screenshots/odoo19e/04-purchase-rfq-list.png",
    caption: "Purchase list — siklus P2P · lab http://172.16.2.123:8072 · DB odoo",
  },
  "script-o2c": {
    src: "/screenshots/odoo19e/08-sales-quotations.png",
    caption: "Sales list — siklus O2C · lab http://172.16.2.123:8072 · DB odoo",
  },
  "closing-checks": {
    src: "/screenshots/odoo19e/10-accounting.png",
    caption: "Accounting control tower · lab http://172.16.2.123:8072 · DB odoo",
  },
};

export function getStepScreenshot(stepId: string): RealShot | undefined {
  return stepScreenshots[stepId];
}
