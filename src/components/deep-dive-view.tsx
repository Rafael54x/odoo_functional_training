import type { ReactNode } from "react";
import Link from "next/link";
import type { DeepDiveModule, ShotRef } from "@/data/deep-dive/types";

function ShotBlock({ shot }: { shot?: ShotRef }) {
  if (!shot) return null;
  if (shot.required || !shot.src) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-3 py-3 text-sm text-amber-950">
        <p className="font-semibold">[SCREENSHOT REQUIRED]</p>
        <p className="mt-1">{shot.caption}</p>
        {shot.whatYouSee && (
          <p className="mt-2 text-xs">What you should see: {shot.whatYouSee}</p>
        )}
      </div>
    );
  }
  return (
    <figure className="shot-frame mt-3">
      <div className="px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-amber-100/90">
        Screenshot Odoo 19 Enterprise (asli)
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shot.src} alt={shot.caption} className="w-full bg-white" loading="lazy" />
      <figcaption className="space-y-1 px-3 py-3 text-xs text-teal-50/90">
        <p>{shot.caption}</p>
        {shot.whatYouSee && <p>Seeing: {shot.whatYouSee}</p>}
        {shot.whatToFill && <p>Fill: {shot.whatToFill}</p>}
        {shot.why && <p>Why: {shot.why}</p>}
        {shot.expectedResult && <p>Expected: {shot.expectedResult}</p>}
      </figcaption>
    </figure>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="font-heading text-2xl text-teal-950 sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function DeepDiveView({ mod }: { mod: DeepDiveModule }) {
  const toc = [
    ["overview", "Overview"],
    ["prerequisites", "Prerequisites"],
    ["installation", "Installation"],
    ["configuration", "Configuration"],
    ["master-data", "Master Data"],
    ["dependencies", "Dependencies"],
    ["fields", "Field Docs"],
    ["procedures", "Procedures"],
    ["scenarios", "Scenarios"],
    ["integration", "Integration"],
    ["mistakes", "Common Mistakes"],
    ["troubleshooting", "Troubleshooting"],
    ["behind", "Behind the Scene"],
    ["reporting", "Reporting"],
    ["security", "Security"],
    ["levels", "Learning Levels"],
    ["exercises", "Exercises"],
  ] as const;

  return (
    <div className="mx-auto w-full max-w-[52rem] px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/materi" className="text-sm text-teal-800 hover:underline">
        ← Semua Materi Modul
      </Link>

      <p className="eyebrow mt-4">
        Deep Dive ·{" "}
        {mod.availability === "available"
          ? "Odoo 19 Enterprise"
          : mod.availability}
      </p>
      <h1 className="font-heading mt-2 text-4xl text-teal-950 sm:text-5xl">
        {mod.name}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-stone-600">
        {mod.overview.function}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {mod.apps.map((a) => (
          <span
            key={a}
            className="rounded-full border border-teal-900/10 bg-white px-3 py-1 text-xs text-teal-900"
          >
            {a}
          </span>
        ))}
      </div>

      {mod.coreFlowLinks && mod.coreFlowLinks.length > 0 && (
        <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-3 text-sm text-teal-950">
          <strong>Kaitkan ke Core Flow:</strong>{" "}
          {mod.coreFlowLinks.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <Link href={l.href} className="font-semibold underline">
                {l.label}
              </Link>
            </span>
          ))}
        </div>
      )}

      <nav className="mt-8 flex flex-wrap gap-2">
        {toc.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-stone-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-teal-50"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="overview" title="1. Module Overview">
        <p className="text-sm text-stone-700">
          <strong>Masalah bisnis:</strong> {mod.overview.businessProblem}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Kapan dibutuhkan:</strong> {mod.overview.whenNeeded}
        </p>
        <p className="text-sm text-stone-700">
          <strong>User tipikal:</strong> {mod.overview.typicalUsers.join(", ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Modul terkait:</strong> {mod.overview.relatedModules.join(", ")}
        </p>
        <div className="rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-700">
          <strong>Skenario bisnis:</strong> {mod.overview.businessScenario}
        </div>
      </Section>

      <Section id="prerequisites" title="2. Prerequisites">
        <ul className="space-y-2 text-sm text-stone-700">
          <li>
            <strong>Modul:</strong> {mod.prerequisites.modules.join(" · ")}
          </li>
          <li>
            <strong>Master data:</strong> {mod.prerequisites.masterData.join(" · ")}
          </li>
          <li>
            <strong>Configuration:</strong>{" "}
            {mod.prerequisites.configuration.join(" · ")}
          </li>
          <li>
            <strong>Access:</strong> {mod.prerequisites.access.join(" · ")}
          </li>
        </ul>
        <p className="text-sm text-stone-600">{mod.prerequisites.relationships}</p>
      </Section>

      <Section id="installation" title="3. Installation">
        <ol className="space-y-2">
          {mod.installation.how.map((s, i) => (
            <li key={s} className="action-row">
              <span className="action-num">{i + 1}</span>
              <p className="text-sm text-stone-700">{s}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-stone-700">
          <strong>Dependencies:</strong> {mod.installation.dependencies.join(" · ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Menu baru:</strong> {mod.installation.newMenus.join(" · ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Settings baru:</strong> {mod.installation.newSettings.join(" · ")}
        </p>
      </Section>

      <Section id="configuration" title="4. Complete Configuration">
        {mod.configurations.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4"
          >
            <h3 className="font-heading text-xl text-teal-950">{c.name}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
              {c.location}
            </p>
            <dl className="mt-3 space-y-2 text-sm text-stone-700">
              <div>
                <dt className="font-semibold text-stone-900">What is it?</dt>
                <dd>{c.what}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-900">Why enable?</dt>
                <dd>{c.whyEnable}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-900">When enable?</dt>
                <dd>{c.whenEnable}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-900">When NOT?</dt>
                <dd>{c.whenNot}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-900">Business example</dt>
                <dd>{c.businessExample}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-900">Impact</dt>
                <dd>{c.impact}</dd>
              </div>
            </dl>
            <ShotBlock shot={c.screenshot} />
          </article>
        ))}
      </Section>

      <Section id="master-data" title="5. Master Data">
        {mod.masterData.map((md) => (
          <article
            key={md.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4"
          >
            <h3 className="font-heading text-xl text-teal-950">{md.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{md.purpose}</p>
            <p className="mt-1 text-xs text-stone-500">
              {md.required ? "Required" : "Optional"} · {md.whyNeeded}
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="fill-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Req</th>
                    <th>Purpose / Why</th>
                    <th>Example</th>
                    <th>If empty</th>
                  </tr>
                </thead>
                <tbody>
                  {md.fields.map((f) => (
                    <tr key={f.field}>
                      <td className="font-semibold">{f.field}</td>
                      <td>{f.type}</td>
                      <td>{f.required ? "Yes" : "No"}</td>
                      <td>
                        {f.purpose}
                        <span className="block text-[11px] text-stone-500">{f.why}</span>
                      </td>
                      <td>
                        <code className="fill-value">{f.example}</code>
                      </td>
                      <td>{f.impactIfEmpty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ShotBlock shot={md.screenshot} />
          </article>
        ))}
      </Section>

      <Section id="dependencies" title="6. Master Data Dependency">
        <p className="text-sm text-stone-700">{mod.dependencies.summary}</p>
        <p className="text-sm font-medium text-stone-800">
          {mod.dependencies.nodes.map((n) => n.label).join(" → ")}
        </p>
        <ul className="space-y-2 text-sm text-stone-700">
          {mod.dependencies.edges.map((e) => (
            <li key={`${e.from}-${e.to}`} className="rounded-xl bg-stone-50 px-3 py-2">
              <strong>
                {mod.dependencies.nodes.find((n) => n.id === e.from)?.label} →{" "}
                {mod.dependencies.nodes.find((n) => n.id === e.to)?.label}
              </strong>
              <span className="block text-stone-600">{e.why}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="fields" title="7. Field-by-Field Documentation">
        {mod.forms.map((form) => (
          <article
            key={form.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4"
          >
            <h3 className="font-heading text-xl text-teal-950">{form.name}</h3>
            <p className="text-xs text-stone-500">{form.menuPath}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="fill-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Required</th>
                    <th>Purpose</th>
                    <th>Why</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {form.fields.map((f) => (
                    <tr key={f.field}>
                      <td className="font-semibold">{f.field}</td>
                      <td>{f.required ? "Yes" : "No"}</td>
                      <td>{f.purpose}</td>
                      <td>{f.why}</td>
                      <td>
                        <code className="fill-value">{f.example}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ShotBlock shot={form.screenshot} />
          </article>
        ))}
      </Section>

      <Section id="procedures" title="8. Step-by-Step Procedures">
        {mod.procedures.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4"
          >
            <h3 className="font-heading text-xl text-teal-950">{p.title}</h3>
            <p className="mt-1 text-sm text-stone-600">
              <strong>Goal:</strong> {p.goal}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Preparation
            </p>
            <ul className="mt-1 space-y-1 text-sm text-stone-700">
              {p.preparation.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
            <ol className="mt-3 space-y-2">
              {p.steps.map((s, i) => (
                <li key={i} className="action-row">
                  <span className="action-num">{i + 1}</span>
                  <p className="text-sm text-stone-700">{s}</p>
                </li>
              ))}
            </ol>
            {p.fillFields && p.fillFields.length > 0 && (
              <div className="fill-guide mt-4">
                <h4 className="text-sm font-semibold">Isi field ini</h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="fill-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                        <th>Where</th>
                        <th>How</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.fillFields.map((f) => (
                        <tr key={`${f.field}-${f.value}`}>
                          <td>{f.required ? `★ ${f.field}` : f.field}</td>
                          <td>
                            <code className="fill-value">{f.value}</code>
                          </td>
                          <td>{f.where || "—"}</td>
                          <td>{f.how || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="expect-box mt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-900/70">
                  Expected result
                </p>
                <p className="mt-1 text-sm text-stone-700">{p.expectedResult}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
              {p.verification.map((v) => (
                <li key={v}>☐ {v}</li>
              ))}
            </ul>
            <ShotBlock shot={p.screenshot} />
          </article>
        ))}
      </Section>

      <Section id="scenarios" title="9. Business Scenarios">
        {mod.scenarios.map((s) => (
          <article
            key={s.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4"
          >
            <h3 className="font-heading text-lg text-teal-950">{s.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{s.whenToUse}</p>
            <p className="mt-2 text-sm font-medium text-stone-800">
              {s.flow.join(" → ")}
            </p>
            {s.notes && <p className="mt-2 text-xs text-stone-500">{s.notes}</p>}
          </article>
        ))}
      </Section>

      <Section id="integration" title="10. End-to-End Integration">
        {mod.integrations.map((i) => (
          <article
            key={i.id}
            className="rounded-xl border border-stone-200 bg-white/85 px-4 py-3 text-sm"
          >
            <p className="font-semibold text-teal-950">
              {mod.shortTitle} ↔ {i.withModule}
            </p>
            <p className="mt-1 text-stone-700">{i.relationship}</p>
            <p className="mt-1 text-stone-600">{i.whatHappens}</p>
          </article>
        ))}
      </Section>

      <Section id="mistakes" title="11. Common Mistakes">
        {mod.mistakes.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 text-sm"
          >
            <h3 className="font-semibold text-rose-950">{m.problem}</h3>
            <p className="mt-2 text-rose-950/90">
              <strong>Why:</strong> {m.why}
            </p>
            <p className="text-rose-950/90">
              <strong>Detect:</strong> {m.detect}
            </p>
            <p className="text-rose-950/90">
              <strong>Fix:</strong> {m.fix}
            </p>
            <p className="text-rose-950/90">
              <strong>Prevent:</strong> {m.prevent}
            </p>
          </article>
        ))}
      </Section>

      <Section id="troubleshooting" title="12. Troubleshooting">
        {mod.troubleshooting.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4 text-sm"
          >
            <h3 className="font-semibold text-stone-900">{t.problem}</h3>
            <p className="mt-2">
              <strong>Causes:</strong> {t.causes.join(" · ")}
            </p>
            <p>
              <strong>Diagnosis:</strong> {t.diagnosis.join(" · ")}
            </p>
            <p>
              <strong>Solution:</strong> {t.solution.join(" · ")}
            </p>
            <p>
              <strong>Prevention:</strong> {t.prevention}
            </p>
          </article>
        ))}
      </Section>

      <Section id="behind" title="13. Behind the Scene">
        <p className="text-sm text-stone-600">{mod.behind.note}</p>
        <p className="text-sm text-stone-700">
          <strong>Models:</strong> {mod.behind.models.join(", ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Relations:</strong> {mod.behind.relations.join(" · ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Automations:</strong> {mod.behind.automations.join(" · ")}
        </p>
        <p className="text-sm text-stone-700">
          <strong>Security:</strong> {mod.behind.securityNotes.join(" · ")}
        </p>
      </Section>

      <Section id="reporting" title="14. Reporting">
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white/85">
          <table className="fill-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Path</th>
                <th>KPI</th>
                <th>Keputusan bisnis</th>
              </tr>
            </thead>
            <tbody>
              {mod.reporting.map((r) => (
                <tr key={r.name}>
                  <td className="font-semibold">{r.name}</td>
                  <td>{r.path}</td>
                  <td>{r.kpi}</td>
                  <td>{r.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="security" title="15. Security & Access Rights">
        {mod.security.roles.map((r) => (
          <article
            key={r.role}
            className="rounded-2xl border border-stone-200 bg-white/85 p-4 text-sm"
          >
            <h3 className="font-semibold text-teal-950">{r.role}</h3>
            <p className="mt-2">
              <strong>Can:</strong> {r.can.join(" · ")}
            </p>
            <p>
              <strong>Cannot:</strong> {r.cannot.join(" · ")}
            </p>
            <p className="text-stone-600">{r.whyDifferent}</p>
          </article>
        ))}
        <ul className="space-y-1 text-sm text-stone-700">
          {mod.security.notes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </Section>

      <Section id="levels" title="16. Learning Levels">
        {(
          [
            ["Beginner", mod.levels.beginner],
            ["Intermediate", mod.levels.intermediate],
            ["Advanced", mod.levels.advanced],
            ["Expert / Consultant", mod.levels.expert],
          ] as const
        ).map(([label, items]) => (
          <div
            key={label}
            className="rounded-xl border border-stone-200 bg-white/80 px-4 py-3"
          >
            <h3 className="text-sm font-semibold text-teal-950">{label}</h3>
            <ul className="mt-2 space-y-1 text-sm text-stone-700">
              {items.map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section id="exercises" title="17. Practice / Exercises">
        {mod.exercises.map((ex) => (
          <article
            key={ex.id}
            className="rounded-2xl border border-teal-900/10 bg-teal-50/30 p-4 text-sm"
          >
            <h3 className="font-heading text-lg text-teal-950">{ex.title}</h3>
            <p className="mt-1 text-stone-700">
              <strong>Objective:</strong> {ex.objective}
            </p>
            <p className="mt-2 text-xs text-stone-500">
              Prereq: {ex.prerequisites.join(" · ")}
            </p>
            <ol className="mt-3 space-y-1 text-stone-700">
              {ex.task.map((t, i) => (
                <li key={i}>
                  {i + 1}. {t}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-stone-700">
              <strong>Expected:</strong> {ex.expectedResult}
            </p>
            <ul className="mt-2 space-y-1">
              {ex.checklist.map((c) => (
                <li key={c}>☐ {c}</li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <div className="mt-12 rounded-2xl border border-stone-200 bg-white/80 p-5 text-sm text-stone-600">
        Selesai Deep Dive <strong>{mod.shortTitle}</strong>? Kembali ke{" "}
        <Link href="/silabus" className="font-semibold text-teal-800 underline">
          Core Flow
        </Link>{" "}
        untuk menguji integrasi, atau pilih modul lain di{" "}
        <Link href="/materi" className="font-semibold text-teal-800 underline">
          Materi Modul
        </Link>
        .
      </div>
    </div>
  );
}
