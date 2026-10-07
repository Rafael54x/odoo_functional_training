"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Eye,
  Lightbulb,
  BookOpenText,
  TriangleAlert,
  ChevronRight,
} from "lucide-react";
import type { Lesson, SyllabusModule } from "@/data/types";
import { FlowDiagram } from "@/components/flow-diagram";
import { OdooScreen } from "@/components/odoo-screen";
import {
  enterpriseMeta,
  getStepScreenshot,
} from "@/data/real-screenshots";
import {
  isStepDone,
  loadProgress,
  saveProgress,
  toggleStep,
  type ProgressState,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function pathPills(stepMenuPath: string, clickPath?: string[]) {
  if (clickPath?.length) return clickPath;
  return stepMenuPath
    .split(/→|->|\|/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function LessonClient({
  module,
  lesson,
  prev,
  next,
}: {
  module: SyllabusModule;
  lesson: Lesson;
  prev?: { moduleSlug: string; lessonSlug: string; title: string };
  next?: { moduleSlug: string; lessonSlug: string; title: string };
}) {
  const [progress, setProgress] = useState<ProgressState>({
    completedSteps: [],
    completedLessons: [],
  });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function onToggle(stepId: string) {
    const nextState = toggleStep(
      progress,
      module.slug,
      lesson.slug,
      stepId,
      lesson.steps.length,
    );
    setProgress(nextState);
    saveProgress(nextState);
  }

  const doneCount = lesson.steps.filter((s) =>
    isStepDone(progress, module.slug, lesson.slug, s.id),
  ).length;

  const progressPct = useMemo(
    () => Math.round((doneCount / Math.max(lesson.steps.length, 1)) * 100),
    [doneCount, lesson.steps.length],
  );

  return (
    <div className="lesson-shell">
      <div className="lesson-reading">
        <Link
          href={`/modul/${module.slug}`}
          className="inline-flex items-center gap-1 text-sm text-teal-800 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Modul {module.number}: {module.shortTitle}
        </Link>

        <header className="mt-5">
          <p className="eyebrow">
            Lesson · ±{lesson.duration} · {doneCount}/{lesson.steps.length}{" "}
            langkah selesai
          </p>
          <h1 className="font-heading mt-2 text-3xl leading-tight text-teal-950 sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
            {lesson.summary}
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Progress lesson</span>
              <span>{progressPct}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-200/80">
              <div
                className="h-full rounded-full bg-teal-700 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </header>

        {lesson.beginnerIntro && (
          <aside className="beginner-callout mt-6">
            <div className="flex items-start gap-3">
              <BookOpenText className="mt-0.5 size-5 shrink-0 text-teal-800" />
              <div>
                <p className="text-sm font-semibold text-teal-950">
                  Untuk pemula
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-700">
                  {lesson.beginnerIntro}
                </p>
              </div>
            </div>
          </aside>
        )}

        <section className="mt-6 rounded-2xl border border-stone-200/80 bg-white/70 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-stone-900">
            Setelah lesson ini Anda bisa
          </h2>
          <ul className="mt-3 space-y-2">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2 text-sm leading-relaxed text-stone-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" />
                {o}
              </li>
            ))}
          </ul>
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <div className="mt-4 border-t border-stone-200 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Kerjakan dulu
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                {lesson.prerequisites.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {lesson.flow && (
          <div className="mt-8">
            <FlowDiagram flow={lesson.flow} />
          </div>
        )}

        <div className="mt-10 space-y-8">
          {lesson.steps.map((step, index) => {
            const done = isStepDone(progress, module.slug, lesson.slug, step.id);
            const pills = pathPills(step.menuPath, step.clickPath);
            const real = getStepScreenshot(step.id);

            return (
              <article
                key={step.id}
                id={step.id}
                className={cn("step-read-card", done && "step-read-card-done")}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="step-index">{index + 1}</div>
                    <div>
                      <h2 className="font-heading text-xl text-stone-900 sm:text-2xl">
                        {step.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-stone-600">
                        <span className="font-medium text-stone-800">Hasil: </span>
                        {step.goal}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={done ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggle(step.id)}
                    className="gap-1.5"
                  >
                    {done ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                    {done ? "Selesai" : "Tandai selesai"}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-stone-500">
                    Jalur klik:
                  </span>
                  {pills.map((pill, i) => (
                    <span key={`${pill}-${i}`} className="contents">
                      <span className="rounded-md bg-teal-900/5 px-2 py-1 text-xs font-medium text-teal-900">
                        {pill}
                      </span>
                      {i < pills.length - 1 && (
                        <ChevronRight className="size-3.5 text-stone-400" />
                      )}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-stone-600">
                  <span className="font-medium text-stone-800">Kenapa: </span>
                  {step.why}
                </p>

                {step.glossary && step.glossary.length > 0 && (
                  <div className="mt-4 rounded-xl bg-stone-50 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Istilah di langkah ini
                    </p>
                    <dl className="mt-2 space-y-2">
                      {step.glossary.map((g) => (
                        <div key={g.term} className="text-sm">
                          <dt className="font-semibold text-teal-900">{g.term}</dt>
                          <dd className="text-stone-600">{g.meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-stone-900">
                    Ikuti langkah ini berurutan
                  </h3>
                  <ol className="mt-3 space-y-3">
                    {step.actions.map((action, i) => (
                      <li key={i} className="action-row">
                        <span className="action-num">{i + 1}</span>
                        <p className="text-sm leading-relaxed text-stone-700 sm:text-[15px]">
                          {action}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {step.fillFields && step.fillFields.length > 0 && (
                  <div className="fill-guide mt-5">
                    <h3 className="text-sm font-semibold text-stone-900">
                      Isi field ini (nilai konkret)
                    </h3>
                    <p className="mt-1 text-xs text-stone-500">
                      Salin nilai di kolom “Isi dengan” ke field Odoo yang sama.
                      Field bertanda ★ wajib.
                    </p>
                    <div className="mt-3 overflow-x-auto">
                      <table className="fill-table">
                        <thead>
                          <tr>
                            <th>Field di Odoo</th>
                            <th>Isi dengan</th>
                            <th>Lokasi</th>
                            <th>Cara</th>
                          </tr>
                        </thead>
                        <tbody>
                          {step.fillFields.map((f) => (
                            <tr key={`${f.field}-${f.value}`}>
                              <td>
                                {f.required ? (
                                  <span className="font-semibold text-teal-950">
                                    ★ {f.field}
                                  </span>
                                ) : (
                                  f.field
                                )}
                                {f.note && (
                                  <p className="mt-0.5 text-[11px] text-stone-500">
                                    {f.note}
                                  </p>
                                )}
                              </td>
                              <td>
                                <code className="fill-value">{f.value}</code>
                              </td>
                              <td>{f.where || "—"}</td>
                              <td>{f.how || "Ketik / pilih"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {step.expectToSee && (
                  <div className="expect-box mt-5">
                    <Eye className="size-4 shrink-0 text-teal-800" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-900/70">
                        Jika berhasil, Anda melihat
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-700">
                        {step.expectToSee}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  {real ? (
                    <figure className="shot-frame">
                      <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-amber-100/90">
                        <span>Screenshot Odoo asli</span>
                        <span>
                          {enterpriseMeta.version} · {enterpriseMeta.edition}
                        </span>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={real.src}
                        alt={real.caption}
                        className="w-full bg-white"
                      />
                      <figcaption className="px-3 py-2 text-xs leading-relaxed text-teal-50/85">
                        {real.caption}
                      </figcaption>
                    </figure>
                  ) : null}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Anotasi field (panduan isi)
                    </p>
                    <OdooScreen
                      screen={step.screen}
                      caption={`Langkah ${index + 1}: ${step.title}`}
                    />
                  </div>
                </div>

                {(step.tips?.length || step.pitfalls?.length) && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {step.tips && step.tips.length > 0 && (
                      <div className="tip-box">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-950">
                          <Lightbulb className="size-4" /> Tips
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-amber-950/90">
                          {step.tips.map((t) => (
                            <li key={t}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.pitfalls && step.pitfalls.length > 0 && (
                      <div className="warn-box">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-rose-950">
                          <TriangleAlert className="size-4" /> Hindari
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-rose-950/90">
                          {step.pitfalls.map((t) => (
                            <li key={t}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {lesson.checklist && (
          <section className="mt-10 rounded-2xl border border-teal-900/10 bg-teal-50/40 p-5">
            <h2 className="font-heading text-xl text-teal-950">
              Cek sebelum lanjut
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Centang mental dulu. Kalau ada yang belum, ulangi langkah terkait.
            </p>
            <ul className="mt-4 space-y-2">
              {lesson.checklist.map((c) => (
                <li
                  key={c}
                  className="rounded-xl border border-teal-900/10 bg-white/80 px-3 py-2.5 text-sm text-stone-700"
                >
                  ☐ {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/modul/${prev.moduleSlug}/${prev.lessonSlug}`}
              className="nav-adjacent"
            >
              <ArrowLeft className="size-4" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                  Sebelumnya
                </span>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/modul/${next.moduleSlug}/${next.lessonSlug}`}
              className="nav-adjacent sm:ml-auto sm:text-right"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                  Selanjutnya
                </span>
                {next.title}
              </span>
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link href="/silabus" className="nav-adjacent sm:ml-auto sm:text-right">
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                  Selesai jalur
                </span>
                Kembali ke silabus
              </span>
              <ArrowRight className="size-4" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
