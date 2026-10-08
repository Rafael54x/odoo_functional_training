import type { DeepDiveModule } from "../types";
import { salesDeepDive } from "./sales";
import { purchaseDeepDive } from "./purchase";
import { inventoryDeepDive } from "./inventory";
import { accountingDeepDive } from "./accounting";
import { contactsDeepDive } from "./contacts";
import { usersDeepDive } from "./users";
import { settingsDeepDive } from "./settings";
import { crmDeepDive } from "./crm";
import { projectDeepDive } from "./project";
import { timesheetsDeepDive } from "./timesheets";
import { employeesDeepDive } from "./employees";
import { manufacturingDeepDive } from "./manufacturing";
import { websiteDeepDive } from "./website";
import { ecommerceDeepDive } from "./ecommerce";
import { companiesDeepDive } from "./companies";
import { localizationDeepDive } from "./localization";
import { developerModeDeepDive } from "./developer-mode";
import { invoicingDeepDive } from "./invoicing-deep";

/** Wave 1 Deep Dive modules dengan konten penuh */
export const wave1DeepDives: DeepDiveModule[] = [
  contactsDeepDive,
  salesDeepDive,
  purchaseDeepDive,
  inventoryDeepDive,
  accountingDeepDive,
  usersDeepDive,
  settingsDeepDive,
];

/** Wave 2 Deep Dive modules dengan konten penuh */
export const wave2DeepDives: DeepDiveModule[] = [
  crmDeepDive,
  projectDeepDive,
  timesheetsDeepDive,
  employeesDeepDive,
  manufacturingDeepDive,
  websiteDeepDive,
  ecommerceDeepDive,
  companiesDeepDive,
  localizationDeepDive,
  developerModeDeepDive,
  invoicingDeepDive,
];

export {
  salesDeepDive,
  purchaseDeepDive,
  inventoryDeepDive,
  accountingDeepDive,
  contactsDeepDive,
  usersDeepDive,
  settingsDeepDive,
  crmDeepDive,
  projectDeepDive,
  timesheetsDeepDive,
  employeesDeepDive,
  manufacturingDeepDive,
  websiteDeepDive,
  ecommerceDeepDive,
  companiesDeepDive,
  localizationDeepDive,
  developerModeDeepDive,
  invoicingDeepDive,
};

export type DeepDivePlaceholder = {
  slug: string;
  name: string;
  wave: 2 | 3 | 4;
  availability: DeepDiveModule["availability"];
  note: string;
};

/**
 * Modul Deep Dive gelombang berikutnya — belum punya file konten penuh.
 */
export const laterPlaceholders: DeepDivePlaceholder[] = [
  {
    slug: "pos",
    name: "Point of Sale",
    wave: 3,
    availability: "verify",
    note: "Retail counter; butuh produk & payment method.",
  },
  {
    slug: "helpdesk",
    name: "Helpdesk",
    wave: 3,
    availability: "verify",
    note: "Support tickets — Wave 3.",
  },
  {
    slug: "quality",
    name: "Quality",
    wave: 3,
    availability: "verify",
    note: "Quality checks on receipt/production.",
  },
  {
    slug: "barcode",
    name: "Barcode",
    wave: 3,
    availability: "verify",
    note: "Mobile scanning ops.",
  },
  {
    slug: "recruitment",
    name: "Recruitment",
    wave: 3,
    availability: "verify",
    note: "Hiring pipeline.",
  },
  {
    slug: "studio",
    name: "Studio",
    wave: 4,
    availability: "verify",
    note: "Kustomisasi no-code — setelah fondasi functional kuat.",
  },
];

/** Semua Deep Dive yang sudah tersedia (konten penuh) */
export const deepDiveModules: DeepDiveModule[] = [
  ...wave1DeepDives,
  ...wave2DeepDives,
];

export function getDeepDive(slug: string): DeepDiveModule | undefined {
  return deepDiveModules.find((m) => m.slug === slug);
}

export function getDeepDiveOrPlaceholder(
  slug: string,
): DeepDiveModule | DeepDivePlaceholder | undefined {
  return (
    getDeepDive(slug) ?? laterPlaceholders.find((p) => p.slug === slug)
  );
}
