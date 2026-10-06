import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, modules } from "@/data/modules";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/silabus" className="text-sm text-teal-800 hover:underline">
        ← Semua silabus
      </Link>
      <p className="eyebrow mt-4">Modul {mod.number}</p>
      <h1 className="font-heading mt-2 text-4xl text-teal-950 sm:text-5xl">
        {mod.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
        {mod.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {mod.apps.map((app) => (
          <span
            key={app}
            className="rounded-full border border-teal-900/10 bg-white px-3 py-1 text-xs text-teal-900"
          >
            {app}
          </span>
        ))}
      </div>

      <section className="panel mt-8">
        <h2 className="panel-title">Hasil yang Anda kuasai</h2>
        <ul className="mt-3 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
          {mod.outcomes.map((o) => (
            <li key={o} className="flex gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-teal-700" />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <h2 className="font-heading mt-10 text-2xl text-teal-950">Lessons</h2>
      <div className="mt-4 space-y-3">
        {mod.lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/modul/${mod.slug}/${lesson.slug}`}
            className="module-card block"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-xl text-teal-950">
                {lesson.title}
              </h3>
              <span className="text-xs text-stone-500">
                {lesson.duration} · {lesson.steps.length} langkah
                {lesson.flow ? " · + flow diagram" : ""}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {lesson.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
