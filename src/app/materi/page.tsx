import Link from "next/link";
import {
  deepDiveModules,
  laterPlaceholders,
} from "@/data/deep-dive/modules";

const availabilityLabel = {
  available: "Available (Odoo 19 Enterprise)",
  verify: "[VERIFY IN ODOO UI]",
  not_available: "Not Available in Current Environment",
} as const;

export default function MateriPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Layer B · Module Deep Dive</p>
      <h1 className="font-heading mt-2 max-w-3xl text-4xl text-teal-950 sm:text-5xl">
        Materi Modul
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
        Mini-course per aplikasi Odoo: configuration, master data, field docs,
        skenario, integrasi, troubleshooting, dan exercise. Path pemula tetap
        mulai dari{" "}
        <Link href="/silabus" className="font-semibold text-teal-800 underline">
          Core Flow
        </Link>{" "}
        dulu.
      </p>

      <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/40 px-4 py-3 text-sm text-teal-950">
        <strong>Wave 1 siap dipelajari:</strong>{" "}
        {deepDiveModules.map((m) => m.shortTitle).join(" · ")}
      </div>

      <h2 className="font-heading mt-10 text-2xl text-teal-950">Wave 1</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {deepDiveModules.map((mod) => (
          <Link
            key={mod.slug}
            href={`/materi/${mod.slug}`}
            className="module-card block"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800/70">
                Wave {mod.wave}
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

      <h2 className="font-heading mt-12 text-2xl text-teal-950">
        Wave berikutnya (katalog)
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Belum ada konten penuh — ditandai jujur. Standard Odoo 19 Enterprise
        biasanya punya app ini; tetap verifikasi di lab Apps.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {laterPlaceholders.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-4 py-3"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Wave {p.wave} · {availabilityLabel[p.availability]}
            </p>
            <h3 className="mt-1 font-heading text-lg text-stone-800">{p.name}</h3>
            <p className="mt-1 text-xs text-stone-600">{p.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
