import Link from "next/link";
import {
  coreFlowMindNodes,
  deepDiveGroups,
  learningJourneySteps,
  learningMapIntro,
  moduleRelations,
  processChains,
} from "@/data/curriculum/learning-map";

export default function KurikulumPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Peta kurikulum</p>
      <h1 className="font-heading mt-2 max-w-4xl text-4xl text-teal-950 sm:text-5xl">
        {learningMapIntro.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
        {learningMapIntro.subtitle}
      </p>
      <p className="mt-3 max-w-3xl rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-teal-950">
        {learningMapIntro.principle}
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {[
          ["#journey", "Jalur belajar"],
          ["#mindmap", "Mindmap"],
          ["#core-flow", "Core Flow"],
          ["#chains", "Rantai proses"],
          ["#deep-dive", "Materi Modul"],
          ["#relations", "Hubungan modul"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-teal-900/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-50"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* JOURNEY */}
      <section id="journey" className="mt-14 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">Jalur belajar singkat</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {learningJourneySteps.map((step) => (
            <li key={step.n}>
              <Link
                href={step.href}
                className="block h-full rounded-2xl border border-stone-200 bg-white/85 p-4 transition hover:border-teal-300 hover:bg-teal-50/40"
              >
                <span className="grid size-8 place-items-center rounded-full bg-teal-900 text-sm font-bold text-amber-100">
                  {step.n}
                </span>
                <h3 className="font-heading mt-3 text-xl text-teal-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {step.body}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* MINDMAP visual */}
      <section id="mindmap" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">
          Mindmap seluruh pembelajaran
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Dua lapisan: alur bisnis terintegrasi (Core Flow), lalu pendalaman per aplikasi
          (Materi Modul). Panah di bawah menunjukkan hubungan data antar modul.
        </p>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-teal-900/10 bg-gradient-to-br from-teal-50/80 via-white to-amber-50/40 p-5 sm:p-8">
          <div className="mx-auto flex min-w-[640px] max-w-4xl flex-col items-center gap-4">
            <div className="rounded-2xl border-2 border-teal-800 bg-teal-900 px-6 py-3 text-center text-amber-50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
                Mulai di sini
              </p>
              <p className="font-heading text-2xl">Odoo Functional Lab</p>
            </div>

            <div className="h-8 w-px bg-teal-700/40" aria-hidden />

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-teal-300 bg-white/90 p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-800/70">
                  Layer A
                </p>
                <h3 className="font-heading mt-1 text-xl text-teal-950">
                  Core Business Flow
                </h3>
                <p className="mt-2 text-xs text-stone-600">
                  Setup → master → beli → stok → jual → tagih → closing
                </p>
                <Link
                  href="/silabus"
                  className="mt-3 inline-block text-xs font-semibold text-teal-800 underline"
                >
                  Buka Silabus →
                </Link>
              </div>
              <div className="rounded-2xl border border-amber-300/80 bg-white/90 p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-900/70">
                  Layer B
                </p>
                <h3 className="font-heading mt-1 text-xl text-teal-950">
                  Materi Modul (Deep Dive)
                </h3>
                <p className="mt-2 text-xs text-stone-600">
                  Config → master → prosedur → integrasi → exercise per app
                </p>
                <Link
                  href="/materi"
                  className="mt-3 inline-block text-xs font-semibold text-teal-800 underline"
                >
                  Buka Materi Modul →
                </Link>
              </div>
            </div>

            <div className="h-6 w-px bg-teal-700/30" aria-hidden />

            <div className="grid w-full gap-2 sm:grid-cols-4">
              {deepDiveGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="rounded-xl border border-stone-200 bg-white/80 px-3 py-3 text-center transition hover:border-teal-300"
                >
                  <p className="text-xs font-semibold text-teal-950">{g.title}</p>
                  <p className="mt-1 text-[11px] text-stone-500">
                    {g.modules.length} modul
                  </p>
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-teal-700/30" aria-hidden />

            <div className="w-full rounded-2xl border border-dashed border-teal-300/80 bg-teal-50/50 px-4 py-3 text-center text-sm text-teal-950">
              Integrasi lab:{" "}
              <strong>Contacts ↔ Sales/Purchase ↔ Inventory ↔ Accounting</strong>
              {" · "}
              <strong>CRM → Sales</strong>
              {" · "}
              <strong>Project ↔ Timesheets</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FLOW DETAIL */}
      <section id="core-flow" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">Core Flow — urutan modul</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Ikuti nomor berurutan. Setiap kartu membuka lesson Core Flow.
        </p>
        <ol className="mt-6 space-y-2">
          {coreFlowMindNodes.map((node, i) => (
            <li key={node.slug}>
              <Link
                href={node.href}
                className="flex flex-wrap items-start gap-3 rounded-2xl border border-stone-200 bg-white/85 px-4 py-3 transition hover:border-teal-300 hover:bg-teal-50/30"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-900 text-xs font-bold text-amber-100">
                  {node.number || String(i).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-lg text-teal-950">{node.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-stone-600">
                    {node.summary}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">
                    Apps: {node.apps.join(" · ")}
                  </p>
                </div>
                {i < coreFlowMindNodes.length - 1 && (
                  <span className="hidden text-teal-700/50 sm:block" aria-hidden>
                    ↓
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* PROCESS CHAINS */}
      <section id="chains" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">Rantai proses bisnis</h2>
        <p className="mt-2 text-sm text-stone-600">
          Pola yang sama diulang di Core Flow dan Deep Dive — hafalkan arah panahnya.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {processChains.map((chain) => (
            <Link
              key={chain.id}
              href={chain.href}
              className="rounded-2xl border border-stone-200 bg-white/85 p-5 transition hover:border-teal-300"
            >
              <h3 className="font-heading text-xl text-teal-950">{chain.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                {chain.nodes.map((n, i) => (
                  <span key={n}>
                    {i > 0 && (
                      <span className="mx-1.5 text-teal-700/60" aria-hidden>
                        →
                      </span>
                    )}
                    <span className="font-medium">{n}</span>
                  </span>
                ))}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* DEEP DIVE GROUPS */}
      <section id="deep-dive" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">Materi Modul per kelompok</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Pilih modul sesuai kebutuhan setelah Core Flow. Tidak ada urutan “wave” —
          mulai dari fondasi operasional jika masih pemula.
        </p>

        <div className="mt-8 space-y-10">
          {deepDiveGroups.map((group) => (
            <div key={group.id} id={`group-${group.id}`} className="scroll-mt-24">
              <h3 className="font-heading text-2xl text-teal-950">{group.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{group.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.modules.map((m) => (
                  <Link
                    key={m.slug}
                    href={m.href}
                    className="rounded-full border border-teal-900/10 bg-white px-3 py-1.5 text-sm font-semibold text-teal-900 hover:bg-teal-50"
                    title={m.related.join(", ")}
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RELATIONS */}
      <section id="relations" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">
          Hubungan antar modul
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Setiap baris: data atau dokumen mengalir dari modul kiri ke kanan. Pakai ini
          saat bingung “kenapa field ini kosong” atau “dokumen ini lahir dari mana”.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white/90">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-[10px] uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Dari</th>
                <th className="px-4 py-3">Ke</th>
                <th className="px-4 py-3">Kenapa terhubung</th>
              </tr>
            </thead>
            <tbody>
              {moduleRelations.map((r) => (
                <tr
                  key={`${r.from}-${r.to}-${r.why}`}
                  className="border-t border-stone-100"
                >
                  <td className="px-4 py-2.5 font-semibold text-teal-950">
                    {r.from}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-teal-950">
                    <span className="mr-2 text-teal-600/70" aria-hidden>
                      →
                    </span>
                    {r.to}
                  </td>
                  <td className="px-4 py-2.5 text-stone-600">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-teal-900/15 bg-white/80 p-6">
        <h2 className="font-heading text-2xl text-teal-950">Siap mulai?</h2>
        <p className="mt-2 text-sm text-stone-600">
          Path pemula yang disarankan: Cara pakai → Core Flow → satu Deep Dive fondasi
          (Sales atau Inventory) → uji rantai P2P/O2C di lab.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/silabus"
            className="inline-flex h-10 items-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-amber-100"
          >
            Mulai Core Flow
          </Link>
          <Link
            href="/materi"
            className="inline-flex h-10 items-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700"
          >
            Lihat Materi Modul
          </Link>
          <Link
            href="/alur"
            className="inline-flex h-10 items-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700"
          >
            Peta alur proses
          </Link>
        </div>
      </section>
    </div>
  );
}
