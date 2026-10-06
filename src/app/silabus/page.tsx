import Link from "next/link";
import { modules, learningPathSummary } from "@/data/modules";

export default function SilabusPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Kurikulum lengkap</p>
      <h1 className="font-heading mt-2 max-w-3xl text-4xl text-teal-950 sm:text-5xl">
        Silabus Odoo 19 Functional
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
        {learningPathSummary.principle}
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-teal-900/10 bg-white/70 p-4 text-sm text-stone-700 sm:grid-cols-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500">
            Database
          </div>
          <div className="mt-1 font-semibold">{learningPathSummary.database}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500">
            Login
          </div>
          <div className="mt-1 font-semibold">admin / admin</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-500">
            Stack
          </div>
          <div className="mt-1 font-semibold">
            {learningPathSummary.stack.join(" · ")}
          </div>
        </div>
      </div>

      <ol className="mt-10 space-y-4">
        {modules.map((mod, index) => (
          <li key={mod.slug}>
            <article
              className="module-card"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70">
                    Modul {mod.number}
                  </p>
                  <h2 className="font-heading mt-1 text-2xl text-teal-950 sm:text-3xl">
                    <Link href={`/modul/${mod.slug}`} className="hover:underline">
                      {mod.title}
                    </Link>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mod.apps.map((app) => (
                    <span
                      key={app}
                      className="rounded-full border border-teal-900/10 bg-teal-50 px-2.5 py-1 text-[11px] text-teal-900"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
                {mod.description}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/modul/${mod.slug}/${lesson.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 text-sm transition hover:border-teal-800/30 hover:bg-white"
                    >
                      <span className="font-medium text-stone-800">
                        {lesson.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-stone-500">
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
