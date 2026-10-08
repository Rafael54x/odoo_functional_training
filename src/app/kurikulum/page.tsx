import Link from "next/link";
import {
  curriculumVision,
  coreBusinessFlow,
  coreProcessChains,
  deepDiveSectionTemplate,
  navigationTree,
} from "@/data/curriculum/architecture";
import {
  availabilityLabels,
  categoryMeta,
  moduleMatrix,
  type ModuleMatrixRow,
} from "@/data/curriculum/module-matrix";
import {
  configurationCardTemplate,
  finalProjectOutline,
  learningPaths,
} from "@/data/curriculum/learning-paths";
import {
  existingInventory,
  gaps,
  implementationPhases,
} from "@/data/curriculum/gap-analysis";

const severityColor: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900 border-rose-200",
  high: "bg-amber-100 text-amber-950 border-amber-200",
  medium: "bg-sky-100 text-sky-950 border-sky-200",
  low: "bg-stone-100 text-stone-700 border-stone-200",
};

const statusColor: Record<string, string> = {
  keep: "bg-emerald-100 text-emerald-900",
  enrich: "bg-amber-100 text-amber-950",
  add: "bg-violet-100 text-violet-950",
};

function modulesByCategory(cat: ModuleMatrixRow["category"]) {
  return moduleMatrix.filter((m) => m.category === cat);
}

export default function KurikulumPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Evaluasi arsitektur · Phase 0</p>
      <h1 className="font-heading mt-2 max-w-4xl text-4xl text-teal-950 sm:text-5xl">
        {curriculumVision.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
        {curriculumVision.subtitle}. Target:{" "}
        <strong>{curriculumVision.versionTarget}</strong> · Lab{" "}
        <a href={curriculumVision.lab.url} className="font-semibold text-teal-800 underline">
          {curriculumVision.lab.url}
        </a>{" "}
        / DB <code>{curriculumVision.lab.database}</code>.
      </p>
      <p className="mt-3 max-w-3xl rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Ini adalah <strong>rancangan untuk dievaluasi</strong> sebelum rewrite besar.
        Core Flow 00–09 <strong>tidak dihapus</strong>. Deep Dive dan node baru baru
        diimplementasikan setelah arsitektur disetujui.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {[
          ["#gap", "Gap analysis"],
          ["#architecture", "Architecture"],
          ["#core-flow", "Core Flow"],
          ["#module-matrix", "Module Matrix"],
          ["#learning-paths", "Learning Paths"],
          ["#deep-template", "Deep Dive template"],
          ["#phases", "Implementation phases"],
          ["#final-project", "Final Project"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-teal-900/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-50"
          >
            {label}
          </a>
        ))}
      </div>

      {/* GAP */}
      <section id="gap" className="mt-14 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">1. Gap Analysis (Existing)</h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Hari ini platform = <strong>{existingInventory.layerToday}</strong>.{" "}
          {existingInventory.stats.coreModules} modul core · ~
          {existingInventory.stats.lessonsApprox} lesson · ~
          {existingInventory.stats.stepsApprox} step ·{" "}
          {existingInventory.stats.realScreenshotsOnDisk} screenshot Enterprise ·{" "}
          {existingInventory.stats.deepDiveModules} deep-dive modules.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h3 className="text-sm font-semibold text-emerald-950">Yang sudah kuat</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-emerald-950/90">
              {existingInventory.strengths.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
            <h3 className="text-sm font-semibold text-stone-900">Core existing (dipertahankan)</h3>
            <ol className="mt-2 space-y-1 text-sm text-stone-700">
              {existingInventory.modules.map((m) => (
                <li key={m.slug}>
                  <Link href={`/modul/${m.slug}`} className="font-medium text-teal-800 hover:underline">
                    {m.number}. {m.title}
                  </Link>
                  <span className="text-stone-500"> · {m.depth}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {gaps.map((g) => (
            <article
              key={g.id}
              className={`rounded-2xl border px-4 py-3 ${severityColor[g.severity]}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span>{g.severity}</span>
                <span className="opacity-70">· {g.area}</span>
              </div>
              <p className="mt-1 text-sm font-semibold">{g.finding}</p>
              <p className="mt-1 text-sm opacity-90">→ {g.recommendation}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">
          2. Curriculum Architecture (Dual Layer)
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-stone-700">
          {curriculumVision.principles.map((p) => (
            <li key={p} className="rounded-xl border border-stone-200 bg-white/70 px-3 py-2">
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-teal-900/15 bg-teal-50/40 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/80">
              Layer A
            </p>
            <h3 className="font-heading mt-1 text-2xl text-teal-950">
              Core Business Flow
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Proses bisnis terintegrasi. Entry point tetap{" "}
              <Link href="/silabus" className="font-semibold text-teal-800 underline">
                /silabus
              </Link>
              . Slug modul existing tidak diubah.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-800/80">
              Layer B
            </p>
            <h3 className="font-heading mt-1 text-2xl text-violet-950">
              Module-by-Module Deep Dive
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Mini-course per aplikasi Odoo (config → master → transaksi → integrasi →
              report → troubleshoot). Pilih modul di Materi Modul sesuai kebutuhan.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-stone-900">Navigation tree (target)</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {navigationTree.map((branch) => (
              <div
                key={branch.id}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <Link href={branch.href} className="font-heading text-lg text-teal-950 hover:underline">
                  {branch.label}
                </Link>
                <ul className="mt-2 space-y-1 text-xs text-stone-600">
                  {branch.children.slice(0, 8).map((c) => (
                    <li key={c.id}>• {c.label}</li>
                  ))}
                  {branch.children.length > 8 && (
                    <li className="text-stone-400">… +{branch.children.length - 8} lagi</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FLOW */}
      <section id="core-flow" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">3. Core Business Flow Map</h2>
        <p className="mt-2 text-sm text-stone-600">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900">keep</span>{" "}
          = existing ·{" "}
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-950">enrich</span>{" "}
          = perjelas ·{" "}
          <span className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-950">add</span>{" "}
          = node baru (belum ada lesson)
        </p>

        <ol className="mt-6 space-y-3">
          {coreBusinessFlow.map((node) => (
            <li
              key={node.id}
              className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-xl text-teal-950">
                  {node.order}. {node.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor[node.status]}`}
                >
                  {node.status}
                </span>
                {node.existingSlug && (
                  <Link
                    href={`/modul/${node.existingSlug}`}
                    className="text-xs font-semibold text-teal-800 underline"
                  >
                    buka existing
                  </Link>
                )}
              </div>
              <p className="mt-1 text-sm text-stone-700">{node.summary}</p>
              <p className="mt-1 text-xs text-stone-500">
                <strong>Business why:</strong> {node.businessWhy}
              </p>
            </li>
          ))}
        </ol>

        <div id="core-additions" className="mt-8 grid gap-3 md:grid-cols-2">
          {coreProcessChains.map((chain) => (
            <div
              key={chain.id}
              className="rounded-2xl border border-teal-900/10 bg-teal-50/30 p-4"
            >
              <h3 className="font-heading text-lg text-teal-950">{chain.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {chain.nodes.join(" → ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE MATRIX */}
      <section id="module-matrix" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">4. Module Matrix</h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Ketersediaan relatif ke Odoo 19 Enterprise. Status lab spesifik harus dicek di
          Apps pada environment Anda — jangan diklaim terpasang sebelum verifikasi.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(availabilityLabels).map(([key, val]) => (
            <span
              key={key}
              className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-700"
              title={val.hint}
            >
              {val.label}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-teal-950">
          <strong>Fondasi disarankan dulu:</strong>{" "}
          {moduleMatrix
            .filter((m) => m.wave === 1)
            .map((m) => m.name)
            .join(" · ")}
          . Setelah itu pilih modul di{" "}
          <Link href="/materi" className="font-semibold underline">
            Materi Modul
          </Link>
          .
        </div>

        {(Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>).map((cat) => {
          const meta = categoryMeta[cat];
          const rows = modulesByCategory(cat);
          return (
            <div key={cat} id={meta.id} className="mt-10 scroll-mt-24">
              <h3 className="font-heading text-2xl text-teal-950">{meta.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{meta.blurb}</p>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white/90">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-stone-50 text-[10px] uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="px-3 py-2">Module</th>
                      <th className="px-3 py-2">Availability</th>
                      <th className="px-3 py-2">Core?</th>
                      <th className="px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        id={`mod-${row.id}`}
                        className="border-t border-stone-100 align-top"
                      >
                        <td className="px-3 py-2 font-semibold text-stone-900">
                          {row.name}
                        </td>
                        <td className="px-3 py-2 text-stone-700">
                          {availabilityLabels[row.availability].label}
                        </td>
                        <td className="px-3 py-2">{row.inCoreFlow ? "Yes" : "—"}</td>
                        <td className="px-3 py-2 text-stone-600">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      {/* LEARNING PATHS */}
      <section id="learning-paths" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">5. Learning Paths</h2>
        <div className="mt-6 space-y-6">
          {learningPaths.map((path) => (
            <article
              key={path.id}
              className="rounded-2xl border border-stone-200 bg-white/80 p-5"
            >
              <h3 className="font-heading text-2xl text-teal-950">{path.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                {path.audience} · {path.durationHint}
              </p>
              <p className="mt-2 text-sm text-stone-600">{path.description}</p>
              <ol className="mt-4 space-y-2">
                {path.steps.map((step, i) => (
                  <li key={`${path.id}-${i}`} className="flex gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-900 text-[11px] font-bold text-amber-100">
                      {i + 1}
                    </span>
                    <div>
                      <Link href={step.target} className="font-medium text-teal-900 hover:underline">
                        {step.title}
                      </Link>
                      <span className="ml-2 text-[11px] uppercase tracking-wider text-stone-400">
                        {step.level}
                      </span>
                      {step.note && (
                        <p className="text-xs text-stone-500">{step.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div id="cross-master" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["cross-master", "Master Data Hub"],
            ["cross-config", "Configuration Hub"],
            ["cross-integration", "Integration Map"],
            ["cross-reporting", "Reporting"],
            ["cross-security", "Security"],
            ["cross-troubleshoot", "Troubleshooting"],
            ["cross-exercises", "Exercises"],
          ].map(([id, label]) => (
            <div
              key={id}
              id={id}
              className="rounded-xl border border-dashed border-stone-300 bg-stone-50/80 px-3 py-3 text-sm text-stone-600"
            >
              <strong className="text-stone-900">{label}</strong>
              <p className="mt-1 text-xs">
                Hub lintas-modul — lihat juga tautan di tiap Materi Modul.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DEEP TEMPLATE */}
      <section id="deep-template" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">
          6. Deep Dive Section Template (wajib)
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Setiap modul Deep Dive memakai struktur konsisten berikut.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {deepDiveSectionTemplate.map((s, i) => (
            <li
              key={s.id}
              className="rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-stone-800"
            >
              <span className="font-semibold text-teal-900">{i + 1}.</span> {s.title}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
            <h3 className="font-semibold text-stone-900">
              {configurationCardTemplate.title}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {configurationCardTemplate.fields.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 text-sm text-stone-600">
            <h3 className="font-semibold text-stone-900">Screenshot policy</h3>
            <ul className="mt-2 space-y-1">
              <li>• Hanya UI Odoo nyata (lab atau capture Enterprise terverifikasi).</li>
              <li>• Belum ada → tulis eksplisit <code>[SCREENSHOT REQUIRED]</code>.</li>
              <li>• Jangan mock UI yang diklaim sebagai screenshot asli.</li>
              <li>• Setiap shot: What you see / What to fill / Why / Expected result.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section id="phases" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">7. Implementation Phases</h2>
        <ol className="mt-6 space-y-4">
          {implementationPhases.map((p) => (
            <li
              key={p.phase}
              className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-xl text-teal-950">
                  Phase {p.phase}: {p.title}
                </span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600">{p.goal}</p>
              <ul className="mt-2 space-y-1 text-sm text-stone-700">
                {p.deliverables.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* FINAL PROJECT */}
      <section id="final-project" className="mt-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-teal-950">8. Final Project Outline</h2>
        <div className="mt-4 rounded-2xl border border-teal-900/15 bg-teal-50/40 p-5">
          <h3 className="font-heading text-2xl text-teal-950">
            {finalProjectOutline.title}
          </h3>
          <p className="mt-2 text-sm text-stone-700">{finalProjectOutline.objective}</p>
          <p className="mt-3 text-sm text-stone-600">
            Company: <strong>{finalProjectOutline.companyProfile.name}</strong> ·{" "}
            {finalProjectOutline.companyProfile.industry} ·{" "}
            {finalProjectOutline.companyProfile.currency}
          </p>
          <ol className="mt-4 space-y-1 text-sm text-stone-700">
            {finalProjectOutline.phases.map((ph, i) => (
              <li key={ph}>
                {i + 1}. {ph}
              </li>
            ))}
          </ol>
          <h4 className="mt-4 text-sm font-semibold text-stone-900">Validation checklist</h4>
          <ul className="mt-2 space-y-1 text-sm text-stone-700">
            {finalProjectOutline.validationChecklist.map((c) => (
              <li key={c}>☐ {c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-teal-900/15 bg-white/80 p-6">
        <h2 className="font-heading text-2xl text-teal-950">Keputusan yang diminta</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Sebelum implementasi Phase 1+, mohon review:
        </p>
        <ol className="mt-3 space-y-2 text-sm text-stone-700">
          <li>1. Apakah urutan Core Flow (keep/enrich/add) sudah sesuai?</li>
          <li>2. Apakah urutan fondasi (Sales, Purchase, Inventory, Accounting, Contacts, Users, Settings) OK?</li>
          <li>3. Modul mana yang wajib N/A di lab Anda (Payroll, POS, dll.)?</li>
          <li>4. Path default untuk homepage: Path A (Flow first) atau Path C (Consultant)?</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/silabus"
            className="inline-flex h-10 items-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-amber-100"
          >
            Lihat Core Flow existing
          </Link>
          <Link
            href="/cara-pakai"
            className="inline-flex h-10 items-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700"
          >
            Cara pakai lab
          </Link>
        </div>
      </section>
    </div>
  );
}
