import Link from "next/link";
import {
  deepDiveCatalogGroups,
  deepDiveModules,
} from "@/data/deep-dive/modules";

const availabilityLabel = {
  available: "Available (Odoo 19 Enterprise)",
  verify: "[VERIFY IN ODOO UI]",
  not_available: "Not Available in Current Environment",
} as const;

const categoryLabel: Record<string, string> = {
  sales: "Sales",
  purchase: "Purchase",
  inventory: "Inventory",
  accounting: "Accounting",
  services: "Services",
  hr: "HR",
  website: "Website",
  marketing: "Marketing",
  administration: "Admin",
  manufacturing: "Manufacturing",
  retail: "Retail",
};

function ModuleGrid({
  modules,
}: {
  modules: typeof deepDiveModules;
}) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {modules.map((mod) => (
        <Link
          key={mod.slug}
          href={`/materi/${mod.slug}`}
          className="module-card block"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800/70">
              {categoryLabel[mod.category] ?? mod.category}
            </p>
            <p className="text-[11px] text-stone-500">
              {availabilityLabel[mod.availability]}
            </p>
          </div>
          <h3 className="font-heading mt-2 text-2xl text-teal-950">
            {mod.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {mod.overview.function}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            {mod.configurations.length} config · {mod.procedures.length}{" "}
            prosedur · {mod.exercises.length} exercise
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function MateriPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Layer B · Module Deep Dive</p>
      <h1 className="font-heading mt-2 max-w-3xl text-4xl text-teal-950 sm:text-5xl">
        Materi Modul
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
        Mini-course per aplikasi Odoo 19 Enterprise ({deepDiveModules.length}{" "}
        modul). Path pemula: selesaikan{" "}
        <Link href="/silabus" className="font-semibold text-teal-800 underline">
          Core Flow
        </Link>{" "}
        dulu, lalu pilih modul di bawah satu per satu. Screenshot dari Odoo{" "}
        <strong>19.0+e</strong>.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {deepDiveCatalogGroups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-teal-200 bg-teal-50/50 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100"
          >
            {g.title}
          </a>
        ))}
      </div>

      {deepDiveCatalogGroups.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-24">
          <h2 className="font-heading mt-12 text-2xl text-teal-950">
            {group.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            {group.description}
          </p>
          <ModuleGrid modules={group.modules} />
        </section>
      ))}
    </div>
  );
}
