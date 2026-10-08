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
import { posDeepDive } from "./pos";
import { helpdeskDeepDive } from "./helpdesk";
import { qualityDeepDive } from "./quality";
import { barcodeDeepDive } from "./barcode";
import { recruitmentDeepDive } from "./recruitment";

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

/** Wave 3 Deep Dive modules dengan konten penuh */
export const wave3DeepDives: DeepDiveModule[] = [
  posDeepDive,
  helpdeskDeepDive,
  qualityDeepDive,
  barcodeDeepDive,
  recruitmentDeepDive,
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
  posDeepDive,
  helpdeskDeepDive,
  qualityDeepDive,
  barcodeDeepDive,
  recruitmentDeepDive,
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
    slug: "subscriptions",
    name: "Subscriptions",
    wave: 4,
    availability: "verify",
    note: "Recurring revenue — lanjut setelah Wave 3 retail/service.",
  },
  {
    slug: "marketing",
    name: "Email Marketing",
    wave: 4,
    availability: "verify",
    note: "Mailing lists & campaigns.",
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
  ...wave3DeepDives,
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
