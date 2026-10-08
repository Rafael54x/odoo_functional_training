import type { DeepDiveModule } from "../types";
import { salesDeepDive } from "./sales";
import { purchaseDeepDive } from "./purchase";
import { inventoryDeepDive } from "./inventory";
import { accountingDeepDive } from "./accounting";
import { contactsDeepDive } from "./contacts";
import { usersDeepDive } from "./users";
import { settingsDeepDive } from "./settings";
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
 * Dipakai katalog /kurikulum sebagai penanda rencana.
 */
export const laterPlaceholders: DeepDivePlaceholder[] = [
  {
    slug: "crm",
    name: "CRM",
    wave: 2,
    availability: "verify",
    note: "Pipeline, lead/opportunity; verifikasi install di lab sebelum klaim available.",
  },
  {
    slug: "pos",
    name: "Point of Sale",
    wave: 3,
    availability: "verify",
    note: "Retail counter; butuh produk & payment method.",
  },
  {
    slug: "mrp",
    name: "Manufacturing",
    wave: 3,
    availability: "verify",
    note: "BoM, MO, work orders — verifikasi lisensi Enterprise lab.",
  },
  {
    slug: "hr",
    name: "Employees / HR",
    wave: 3,
    availability: "verify",
    note: "Master karyawan & struktur departemen.",
  },
  {
    slug: "project",
    name: "Project",
    wave: 3,
    availability: "verify",
    note: "Task, timesheet linkage ke Sales/Services.",
  },
  {
    slug: "studio",
    name: "Studio",
    wave: 4,
    availability: "verify",
    note: "Kustomisasi no-code — hanya setelah fondasi functional kuat.",
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
