"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lightbulb,
  ListChecks,
  TriangleAlert,
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <Link
          href={`/modul/${module.slug}`}
          className="inline-flex items-center gap-1 text-sm text-teal-800 hover:underline"
        >
          <ArrowLeft className="size-4" /> Modul {module.number}: {module.shortTitle}
        </Link>
        <p className="eyebrow mt-4">
          Lesson · {lesson.duration} · {doneCount}/{lesson.steps.length} langkah
        </p>
        <h1 className="font-heading mt-2 max-w-4xl text-3xl leading-tight text-teal-950 sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
          {lesson.summary}
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <section className="panel">
          <h2 className="panel-title">
            <ListChecks className="size-4" /> Tujuan pembelajaran
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-teal-700" />
                {o}
              </li>
            ))}
          </ul>
        </section>
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <section className="panel">
            <h2 className="panel-title">Prasyarat</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {lesson.prerequisites.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </section>
        )}
        {lesson.checklist && (
          <section className="panel md:col-span-2">
            <h2 className="panel-title">Checklist selesai lesson</h2>
            <ul className="mt-3 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
              {lesson.checklist.map((c) => (
                <li
                  key={c}
                  className="rounded-lg border border-teal-900/10 bg-teal-50/50 px-3 py-2"
                >
                  ☐ {c}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {lesson.flow && (
        <div className="mb-10">
          <FlowDiagram flow={lesson.flow} />
        </div>
      )}

      <div className="space-y-10">
        {lesson.steps.map((step, index) => {
          const done = isStepDone(progress, module.slug, lesson.slug, step.id);
          return (
            <article
              key={step.id}
              id={step.id}
              className="step-card scroll-mt-24"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200/80 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                    Langkah {index + 1}
                  </p>
                  <h2 className="font-heading mt-1 text-2xl text-stone-900">
                    {step.title}
                  </h2>
                  <p className="mt-2 font-mono text-xs text-stone-500 sm:text-sm">
                    Menu: {step.menuPath}
                  </p>
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

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Tujuan langkah
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {step.goal}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Mengapa penting
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {step.why}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Lakukan ini
                    </h3>
                    <ol className="mt-2 space-y-2 text-sm text-stone-700">
                      {step.actions.map((action, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-800 text-[11px] font-bold text-amber-100">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {step.tips && step.tips.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-950">
                        <Lightbulb className="size-4" /> Tips
                      </h3>
                      <ul className="mt-2 space-y-1 text-sm text-amber-950/90">
                        {step.tips.map((t) => (
                          <li key={t}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step.pitfalls && step.pitfalls.length > 0 && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-rose-950">
                        <TriangleAlert className="size-4" /> Hindari
                      </h3>
                      <ul className="mt-2 space-y-1 text-sm text-rose-950/90">
                        {step.pitfalls.map((t) => (
                          <li key={t}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {(() => {
                    const real = getStepScreenshot(step.id);
                    if (!real) {
                      return (
                        <OdooScreen
                          screen={step.screen}
                          caption={`Langkah ${index + 1}: ${step.title}`}
                        />
                      );
                    }
                    return (
                      <>
                        <figure className="overflow-hidden rounded-xl border border-teal-900/15 bg-[#132826] shadow-lg">
                          <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-amber-100/90">
                            <span>Screenshot nyata</span>
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
                          <figcaption className="px-3 py-2 text-xs text-teal-50/80">
                            {real.caption}
                          </figcaption>
                        </figure>
                        <details className="rounded-xl border border-stone-200 bg-white/70 p-3">
                          <summary className="cursor-pointer text-sm font-medium text-stone-700">
                            Lihat anotasi field / mock UI tambahan
                          </summary>
                          <div className="mt-3">
                            <OdooScreen
                              screen={step.screen}
                              caption={`Anotasi langkah ${index + 1}: ${step.title}`}
                            />
                          </div>
                        </details>
                      </>
                    );
                  })()}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
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
            className="nav-adjacent sm:text-right"
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
          <Link href="/silabus" className="nav-adjacent sm:text-right">
            <span>
              <span className="block text-[11px] uppercase tracking-wider text-stone-500">
                Selesai jalur
              </span>
              Kembali ke silabus
            </span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
