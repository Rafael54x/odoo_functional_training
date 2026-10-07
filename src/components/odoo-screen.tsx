import type { OdooScreenConfig } from "@/data/types";
import { odooLab } from "@/data/odoo-lab";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  NonNullable<OdooScreenConfig["statusColor"]>,
  string
> = {
  draft: "bg-zinc-200 text-zinc-800",
  sent: "bg-sky-100 text-sky-800",
  progress: "bg-amber-100 text-amber-900",
  done: "bg-emerald-100 text-emerald-900",
  paid: "bg-teal-100 text-teal-900",
  cancel: "bg-rose-100 text-rose-900",
};

export function OdooScreen({
  screen,
  caption,
}: {
  screen: OdooScreenConfig;
  caption?: string;
}) {
  return (
    <figure className="odoo-shot group">
      <div className="odoo-shot-chrome">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="odoo-shot-url">
          {odooLab.url.replace("http://", "")} · {screen.app} · {screen.menu}
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-teal-200/80">
          Skema field (bukan screenshot)
        </div>
      </div>

      <div className="odoo-shot-body">
        <header className="odoo-topbar">
          <div className="flex items-center gap-3">
            <div className="grid size-7 place-items-center rounded bg-white/15 text-[10px] font-bold">
              ▦
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">
                {screen.app}
              </div>
              <div className="text-[11px] text-teal-100/80">{screen.menu}</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="rounded-full bg-white/10 px-3 py-1 text-[11px]">
              PT Nusantara Functional Demo
            </div>
            <div className="grid size-7 place-items-center rounded-full bg-amber-300 text-[11px] font-bold text-teal-950">
              A
            </div>
          </div>
        </header>

        <div className="space-y-3 p-4 sm:p-5">
          {screen.breadcrumb && (
            <div className="text-xs text-stone-500">
              {screen.breadcrumb.join(" / ")}
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-xl font-semibold text-stone-900 sm:text-2xl">
                {screen.title}
              </h3>
              {screen.subtitle && (
                <p className="mt-1 text-sm text-stone-500">{screen.subtitle}</p>
              )}
            </div>
            {screen.status && (
              <span
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-semibold",
                  statusStyles[screen.statusColor ?? "draft"],
                )}
              >
                {screen.status}
              </span>
            )}
          </div>

          {screen.buttons && screen.buttons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {screen.buttons.map((btn, i) => (
                <span
                  key={btn}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium",
                    i === 0
                      ? "bg-[#714b67] text-white"
                      : "border border-stone-300 bg-white text-stone-700",
                  )}
                >
                  {btn}
                </span>
              ))}
            </div>
          )}

          {screen.tabs && (
            <div className="flex flex-wrap gap-1 border-b border-stone-200">
              {screen.tabs.map((tab) => (
                <span
                  key={tab}
                  className={cn(
                    "-mb-px border-b-2 px-3 py-2 text-xs font-medium",
                    tab === (screen.activeTab ?? screen.tabs?.[0])
                      ? "border-[#714b67] text-[#714b67]"
                      : "border-transparent text-stone-500",
                  )}
                >
                  {tab}
                </span>
              ))}
            </div>
          )}

          {screen.fields && screen.fields.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {screen.fields.map((field) => (
                <label
                  key={field.label}
                  className="rounded-lg border border-stone-200 bg-stone-50/80 px-3 py-2"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    {field.label}
                    {field.required ? " *" : ""}
                  </div>
                  <div className="mt-0.5 text-sm text-stone-900">
                    {field.value}
                  </div>
                  {field.hint && (
                    <div className="mt-1 text-[11px] text-stone-500">
                      {field.hint}
                    </div>
                  )}
                </label>
              ))}
            </div>
          )}

          {screen.columns && (
            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    {screen.columns.map((col) => (
                      <th key={col} className="px-3 py-2 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(screen.rows ?? []).length === 0 ? (
                    <tr>
                      <td
                        className="px-3 py-6 text-center text-stone-400"
                        colSpan={screen.columns.length}
                      >
                        No records yet — database latihan masih kosong di tahap ini
                      </td>
                    </tr>
                  ) : (
                    screen.rows!.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-stone-100 odd:bg-white even:bg-stone-50/70"
                      >
                        {row.map((cell, cidx) => (
                          <td key={cidx} className="px-3 py-2 text-stone-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {screen.kind === "apps" && screen.rows && (
            <div className="grid grid-cols-3 gap-3">
              {screen.rows.flat().map((app) => (
                <div
                  key={app}
                  className="grid aspect-[4/3] place-items-center rounded-xl border border-stone-200 bg-gradient-to-br from-white to-stone-100 text-sm font-semibold text-stone-700 shadow-sm"
                >
                  {app}
                </div>
              ))}
            </div>
          )}

          {screen.highlight && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              <span className="font-semibold">Fokus: </span>
              {screen.highlight}
            </div>
          )}

          {screen.chatter && screen.chatter.length > 0 && (
            <div className="rounded-lg border border-stone-200 bg-white p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                Chatter / Histori
              </div>
              <ul className="space-y-1.5">
                {screen.chatter.map((line) => (
                  <li key={line} className="text-xs text-stone-600">
                    • {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {screen.note && (
            <p className="text-xs leading-relaxed text-stone-500">{screen.note}</p>
          )}
        </div>
      </div>

      <figcaption className="odoo-shot-caption">
        {caption ??
          `Screenshot alur: ${screen.title} — representasi UI Odoo 19 untuk langkah ini`}
      </figcaption>
    </figure>
  );
}
