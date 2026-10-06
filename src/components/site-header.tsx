import Link from "next/link";
import { BookOpen, Database } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-teal-800 text-amber-200 shadow-lg shadow-teal-900/20 transition group-hover:rotate-3">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="font-heading text-lg leading-none text-teal-950 sm:text-xl">
              Odoo Functional Lab
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-teal-800/70">
              Odoo 19 · Silabus Praktikum
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link href="/silabus" className="nav-link">
            Silabus
          </Link>
          <Link href="/alur" className="nav-link">
            Peta Alur
          </Link>
          <Link href="/setup-mcp" className="nav-link hidden sm:inline-flex">
            MCP
          </Link>
          <div className="ml-1 hidden items-center gap-1.5 rounded-full border border-teal-800/15 bg-white/70 px-3 py-1.5 text-xs text-teal-900 md:flex">
            <Database className="size-3.5" />
            odoo_functional
          </div>
        </nav>
      </div>
    </header>
  );
}
