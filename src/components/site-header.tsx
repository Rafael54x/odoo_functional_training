import Link from "next/link";
import { BookOpen } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-teal-800 text-amber-200 shadow-lg shadow-teal-900/20 transition group-hover:rotate-3">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="font-heading text-lg leading-none text-teal-950 sm:text-xl">
              Odoo Functional Lab
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-teal-800/70">
              Core Flow + Materi Modul
            </div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm sm:gap-2">
          <Link href="/cara-pakai" className="nav-link">
            Cara pakai
          </Link>
          <Link href="/silabus" className="nav-link">
            Core Flow
          </Link>
          <Link href="/materi" className="nav-link">
            Materi Modul
          </Link>
          <Link href="/kurikulum" className="nav-link hidden md:inline-flex">
            Kurikulum
          </Link>
        </nav>
      </div>
    </header>
  );
}
