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
import { subscriptionsDeepDive } from "./subscriptions";
import { marketingDeepDive } from "./marketing";
import { studioDeepDive } from "./studio";

/** Fondasi operasional (Contacts → Accounting + Users/Settings) */
export const foundationDeepDives: DeepDiveModule[] = [
  contactsDeepDive,
  salesDeepDive,
  purchaseDeepDive,
  inventoryDeepDive,
  accountingDeepDive,
  usersDeepDive,
  settingsDeepDive,
];

/** Operasi adjacent (CRM, Project, HR, Web, MRP, dll.) */
export const adjacentDeepDives: DeepDiveModule[] = [
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

/** Suite lanjutan (POS, Helpdesk, Quality, Barcode, Recruitment) */
export const extendedDeepDives: DeepDiveModule[] = [
  posDeepDive,
  helpdeskDeepDive,
  qualityDeepDive,
  barcodeDeepDive,
  recruitmentDeepDive,
];

/** Growth & kustomisasi (Subscriptions, Marketing, Studio) */
export const growthDeepDives: DeepDiveModule[] = [
  subscriptionsDeepDive,
  marketingDeepDive,
  studioDeepDive,
];

/** @deprecated gunakan foundationDeepDives — alias kompatibilitas */
export const wave1DeepDives = foundationDeepDives;
/** @deprecated gunakan adjacentDeepDives */
export const wave2DeepDives = adjacentDeepDives;
/** @deprecated gunakan extendedDeepDives */
export const wave3DeepDives = extendedDeepDives;
/** @deprecated gunakan growthDeepDives */
export const wave4DeepDives = growthDeepDives;

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
  subscriptionsDeepDive,
  marketingDeepDive,
  studioDeepDive,
};

/** Semua Deep Dive tersedia (konten penuh) — urutan katalog datar */
export const deepDiveModules: DeepDiveModule[] = [
  ...foundationDeepDives,
  ...adjacentDeepDives,
  ...extendedDeepDives,
  ...growthDeepDives,
];

/** Grup katalog UI (tanpa label Wave) */
export const deepDiveCatalogGroups: Array<{
  id: string;
  title: string;
  description: string;
  modules: DeepDiveModule[];
}> = [
  {
    id: "foundation",
    title: "Fondasi operasional",
    description:
      "Contacts, Sales, Purchase, Inventory, Accounting, Users, dan Settings — mulai di sini setelah Core Flow.",
    modules: foundationDeepDives,
  },
  {
    id: "adjacent",
    title: "Operasi adjacent",
    description:
      "CRM, Project, Timesheets, Employees, Manufacturing, Website, eCommerce, Companies, Localization, Developer Mode, dan Invoicing harian.",
    modules: adjacentDeepDives,
  },
  {
    id: "extended",
    title: "Suite lanjutan",
    description:
      "Point of Sale, Helpdesk, Quality, Barcode, dan Recruitment untuk ritel & layanan.",
    modules: extendedDeepDives,
  },
  {
    id: "growth",
    title: "Growth & kustomisasi",
    description:
      "Subscriptions, Email Marketing, dan Studio — setelah fondasi functional kuat.",
    modules: growthDeepDives,
  },
];

export function getDeepDive(slug: string): DeepDiveModule | undefined {
  return deepDiveModules.find((m) => m.slug === slug);
}

export function getDeepDiveOrPlaceholder(
  slug: string,
): DeepDiveModule | undefined {
  return getDeepDive(slug);
}
