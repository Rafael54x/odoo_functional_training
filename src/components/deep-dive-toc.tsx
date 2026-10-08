"use client";

import Link from "next/link";
import { useCallback, useEffect, type MouseEvent } from "react";

export type TocItem = readonly [id: string, label: string];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;

  const apply = () => {
    el.scrollIntoView({ block: "start", behavior: "auto" });
  };

  apply();
  // Re-align after lazy images / layout shift above the target
  requestAnimationFrame(() => {
    apply();
    window.setTimeout(apply, 120);
    window.setTimeout(apply, 320);
  });
  return true;
}

export function DeepDiveToc({
  items,
  compact = false,
}: {
  items: readonly TocItem[];
  compact?: boolean;
}) {
  const goTo = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      event.stopPropagation();
      scrollToId(id);
      const next = `#${id}`;
      if (window.location.hash !== next) {
        history.pushState(null, "", next);
      }
    },
    [],
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const t = window.setTimeout(() => scrollToId(hash), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <nav aria-label="Daftar isi modul">
      <p
        className={
          compact
            ? "mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-teal-800/70"
            : "mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-800/65"
        }
      >
        Loncat ke bagian
      </p>
      <ul className={compact ? "flex flex-wrap gap-1.5" : "space-y-0.5"}>
        {items.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => goTo(e, id)}
              className={
                compact
                  ? "inline-block rounded-full border border-stone-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-teal-50"
                  : "block rounded-md px-2.5 py-1.5 text-[12.5px] leading-snug text-stone-600 transition hover:bg-teal-50 hover:text-teal-950"
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DeepDiveSidebar({ items }: { items: readonly TocItem[] }) {
  return (
    <aside className="sticky top-20 hidden max-h-[calc(100vh-5.5rem)] w-full overflow-y-auto rounded-2xl border border-teal-900/10 bg-white/95 p-3.5 shadow-[0_1px_0_rgba(15,60,50,0.04)] lg:block">
      <DeepDiveToc items={items} />
      <div className="mt-4 border-t border-stone-100 pt-3">
        <p className="px-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
          Cepat
        </p>
        <Link
          href="/materi"
          className="mt-1 block rounded-md px-2.5 py-1.5 text-[12.5px] text-teal-800 transition hover:bg-teal-50"
        >
          ← Semua modul
        </Link>
        <Link
          href="/kurikulum"
          className="block rounded-md px-2.5 py-1.5 text-[12.5px] text-teal-800 transition hover:bg-teal-50"
        >
          Peta kurikulum
        </Link>
        <Link
          href="/silabus"
          className="block rounded-md px-2.5 py-1.5 text-[12.5px] text-teal-800 transition hover:bg-teal-50"
        >
          Core Flow
        </Link>
      </div>
    </aside>
  );
}
