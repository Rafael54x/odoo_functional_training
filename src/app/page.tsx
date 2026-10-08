import Link from "next/link";
import { ArrowRight, BookOpenCheck, ListOrdered, Route } from "lucide-react";
import { modules, learningPathSummary } from "@/data/modules";
import { odooLab } from "@/data/odoo-lab";

export default function HomePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div>
      <section className="hero-shell">
        <div className="hero-inner mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-3xl text-teal-50">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200/90">
              Odoo Functional Lab
            </p>
            <h1 className="font-heading mt-4 text-4xl leading-[1.08] sm:text-6xl">
              Belajar Odoo Functional dari nol, langkah demi langkah.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-teal-50/85 sm:text-lg">
              Panduan praktik untuk pemula di instance{" "}
              <span className="font-semibold text-amber-200">{odooLab.name}</span>{" "}
              ({odooLab.edition}) — dari login & kenalan layar sampai transaksi
              beli–stok–jual–tagih, dengan jalur klik yang jelas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cara-pakai"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-teal-950 transition hover:bg-amber-200"
              >
                Cara pakai dulu <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/modul/pengenalan/apa-itu-odoo-functional"
                className="inline-flex h-11 items-center rounded-lg border border-teal-100/40 px-4 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
              >
                Langsung Modul 00
              </Link>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { label: "Modul berurutan", value: String(modules.length) },
              { label: "Lesson praktik", value: String(totalLessons) },
              { label: "Odoo latihan", value: odooLab.url.replace("http://", "") },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-teal-50 backdrop-blur-md"
              >
                <div className="font-heading text-2xl">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-teal-50/70">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <p className="eyebrow">Cara belajar yang disarankan</p>
        <h2 className="font-heading mt-2 text-3xl text-teal-950 sm:text-4xl">
          Satu langkah, kerjakan, baru lanjut
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpenCheck,
              title: "Baca panduan pemula",
              body: "Kenali istilah dasar dan cara memakai lab sebelum masuk transaksi.",
              href: "/cara-pakai",
            },
            {
              icon: ListOrdered,
              title: "Ikuti Core Flow",
              body: "Modul 00 → setup → master data → Purchase/Sales. Jangan loncat.",
              href: "/silabus",
            },
            {
              icon: Route,
              title: "Peta kurikulum",
              body: "Dual Layer, Module Matrix, dan Learning Path sebelum Deep Dive.",
              href: "/kurikulum",
            },
            {
              icon: BookOpenCheck,
              title: "Peta alur proses",
              body: "Kalau bingung “ini masuk ke mana”, buka peta proses dulu.",
              href: "/alur",
            },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="module-card">
              <item.icon className="size-5 text-teal-800" />
              <h3 className="font-heading mt-3 text-xl text-teal-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {item.body}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <p className="eyebrow">Mulai di sini</p>
          <h2 className="font-heading mt-2 text-3xl text-teal-950">
            Empat modul pertama
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            {learningPathSummary.principle}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {modules.slice(0, 4).map((mod, index) => (
              <Link
                key={mod.slug}
                href={`/modul/${mod.slug}`}
                className="module-card"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70">
                  Modul {mod.number}
                </span>
                <h3 className="font-heading mt-2 text-2xl text-teal-950">
                  {mod.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {mod.plainSummary ?? mod.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
