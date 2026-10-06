import Link from "next/link";
import { ArrowRight, Layers3, Route, ShieldCheck } from "lucide-react";
import { modules, learningPathSummary } from "@/data/modules";

export default function HomePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalSteps = modules.reduce(
    (n, m) => n + m.lessons.reduce((a, l) => a + l.steps.length, 0),
    0,
  );

  return (
    <div>
      <section className="hero-shell">
        <div className="hero-inner mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="text-teal-50">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/90">
              Odoo Functional Lab
            </p>
            <h1 className="font-heading mt-4 max-w-2xl text-4xl leading-[1.05] sm:text-6xl">
              Belajar Odoo 19 Functional dari database kosong sampai transaksi utuh.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-50/85 sm:text-lg">
              Silabus praktik untuk database{" "}
              <span className="font-semibold text-amber-200">odoo_functional</span>{" "}
              (admin/admin): setup master data, lalu flow Purchase, Inventory,
              Sales, dan Invoicing — lengkap dengan alur proses dan screenshot UI
              tiap langkah.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/silabus"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-teal-950 transition hover:bg-amber-200"
              >
                Mulai silabus <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/setup-mcp"
                className="inline-flex h-11 items-center rounded-lg border border-teal-100/40 px-4 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
              >
                Hubungkan MCP Odoo
              </Link>
            </div>
          </div>

          <div className="hero-float rounded-3xl border border-white/15 bg-white/10 p-5 text-teal-50 shadow-2xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">
              Ringkasan jalur
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-black/20 p-3">
                <div className="font-heading text-3xl">{modules.length}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider opacity-80">
                  Modul
                </div>
              </div>
              <div className="rounded-2xl bg-black/20 p-3">
                <div className="font-heading text-3xl">{totalLessons}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider opacity-80">
                  Lesson
                </div>
              </div>
              <div className="rounded-2xl bg-black/20 p-3">
                <div className="font-heading text-3xl">{totalSteps}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider opacity-80">
                  Langkah
                </div>
              </div>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-teal-50/90">
              {learningPathSummary.stack.map((app) => (
                <li
                  key={app}
                  className="flex items-center justify-between rounded-xl bg-black/15 px-3 py-2"
                >
                  <span>{app}</span>
                  <span className="text-[11px] uppercase tracking-wider text-amber-200/80">
                    Standard
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers3,
              title: "Master data dulu",
              body: "Company, Contacts, Taxes, Warehouse, Products — fondasi sebelum transaksi.",
            },
            {
              icon: Route,
              title: "Flow per modul",
              body: "P2P dan O2C dijabarkan status demi status, termasuk partial & backorder.",
            },
            {
              icon: ShieldCheck,
              title: "Kontrol & laporan",
              body: "Tutup siklus dengan stok, AR/AP, payment, dan rekonsiliasi bank.",
            },
          ].map((item, i) => (
            <article
              key={item.title}
              className="panel"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <item.icon className="size-5 text-teal-800" />
              <h2 className="font-heading mt-3 text-xl text-teal-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Kurikulum</p>
            <h2 className="font-heading mt-2 text-3xl text-teal-950 sm:text-4xl">
              10 modul berurutan
            </h2>
          </div>
          <Link
            href="/silabus"
            className="hidden text-sm font-medium text-teal-800 hover:underline sm:inline"
          >
            Lihat semua →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {modules.slice(0, 4).map((mod, index) => (
            <Link
              key={mod.slug}
              href={`/modul/${mod.slug}`}
              className="module-card"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70">
                  Modul {mod.number}
                </span>
                <span className="rounded-full bg-teal-900/5 px-2.5 py-1 text-[11px] text-teal-900">
                  {mod.lessons.length} lesson
                </span>
              </div>
              <h3 className="font-heading mt-3 text-2xl text-teal-950">
                {mod.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {mod.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
