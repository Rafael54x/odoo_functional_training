import Link from "next/link";
import { modules, learningPathSummary } from "@/data/modules";
import { odooLab, odooLoginHint } from "@/data/odoo-lab";

export default function SilabusPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Layer A · Path pemula</p>
      <h1 className="font-heading mt-2 max-w-3xl text-4xl text-teal-950 sm:text-5xl">
        Core Business Flow
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
        {learningPathSummary.principle} Setelah Core Flow lancar, lanjut{" "}
        <Link href="/materi" className="font-semibold text-teal-800 underline">
          Materi Modul (Deep Dive)
        </Link>
        .
      </p>

      <div className="mt-6 rounded-2xl border border-teal-900/10 bg-white/70 px-4 py-3 text-sm text-stone-700">
        Odoo:{" "}
        <a href={odooLab.url} className="font-semibold text-teal-800 underline">
          {odooLab.url}
        </a>{" "}
        · {odooLoginHint()} ·{" "}
        <Link href="/cara-pakai" className="font-semibold text-teal-800 underline">
          Cara pakai
        </Link>
      </div>

      <ol className="mt-10 space-y-4">
        {modules.map((mod, index) => (
          <li key={mod.slug}>
            <article
              className="module-card"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70">
                  Modul {mod.number}
                </p>
                <p className="text-xs text-stone-500">
                  {mod.lessons.length} lesson · {mod.apps.slice(0, 3).join(" · ")}
                </p>
              </div>
              <h2 className="font-heading mt-2 text-2xl text-teal-950 sm:text-3xl">
                <Link href={`/modul/${mod.slug}`} className="hover:underline">
                  {mod.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
                {mod.plainSummary ?? mod.description}
              </p>
              <ul className="mt-4 space-y-2">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/modul/${mod.slug}/${lesson.slug}`}
                      className="flex flex-col gap-0.5 rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2.5 transition hover:border-teal-800/30 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-medium text-stone-800">
                        {lesson.title}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {lesson.steps.length} langkah · {lesson.duration}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
