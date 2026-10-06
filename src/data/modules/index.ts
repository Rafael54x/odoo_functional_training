import type { SyllabusModule, Lesson } from "../types";
import { introModule } from "./00-intro";
import { companyModule } from "./01-company";
import { contactsModule } from "./02-contacts";
import { accountingMasterModule } from "./03-accounting-master";
import { inventoryMasterModule } from "./04-inventory-master";
import { purchaseModule } from "./05-purchase";
import { inventoryOpsModule } from "./06-inventory-ops";
import { salesModule } from "./07-sales";
import { invoicingModule } from "./08-invoicing";
import { e2eModule } from "./09-e2e";

export const modules: SyllabusModule[] = [
  introModule,
  companyModule,
  contactsModule,
  accountingMasterModule,
  inventoryMasterModule,
  purchaseModule,
  inventoryOpsModule,
  salesModule,
  invoicingModule,
  e2eModule,
];

export function getModule(slug: string): SyllabusModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string,
): { module: SyllabusModule; lesson: Lesson } | undefined {
  const module = getModule(moduleSlug);
  if (!module) return undefined;
  const lesson = module.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { module, lesson };
}

export function getAllLessons(): Array<{
  module: SyllabusModule;
  lesson: Lesson;
}> {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
}

export function getAdjacentLesson(moduleSlug: string, lessonSlug: string) {
  const flat = getAllLessons();
  const idx = flat.findIndex(
    (x) => x.module.slug === moduleSlug && x.lesson.slug === lessonSlug,
  );
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

export const learningPathSummary = {
  title: "Jalur Belajar Odoo 19 Functional",
  database: "odoo_functional",
  credentials: { user: "admin", password: "admin" },
  stack: [
    "Contacts",
    "Sales",
    "Purchase",
    "Inventory",
    "Invoicing / Accounting",
  ],
  principle:
    "Urutan emas untuk pemula: kenalan layar Odoo → setup perusahaan → isi kontak & produk → baru beli/jual → baru pelajari tagihan & laporan. Loncat urutan biasanya bikin bingung.",
};
