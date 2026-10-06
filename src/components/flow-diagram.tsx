import type { LessonFlow } from "@/data/types";
import { cn } from "@/lib/utils";

const typeStyles = {
  start: "from-teal-700 to-teal-900 text-teal-50",
  process: "from-stone-800 to-stone-950 text-stone-50",
  decision: "from-amber-600 to-amber-800 text-amber-50",
  doc: "from-[#5c3d54] to-[#3d2940] text-rose-50",
  end: "from-emerald-700 to-emerald-950 text-emerald-50",
};

export function FlowDiagram({ flow }: { flow: LessonFlow }) {
  return (
    <section className="flow-panel">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Alur proses</p>
          <h3 className="font-heading text-2xl text-stone-900">{flow.title}</h3>
        </div>
        <p className="max-w-xl text-sm text-stone-600">{flow.description}</p>
      </div>

      <div className="flow-track">
        {flow.nodes.map((node, index) => {
          const edge = flow.edges.find((e) => e.from === node.id);
          return (
            <div key={node.id} className="contents">
              <div
                className={cn(
                  "flow-node bg-gradient-to-br shadow-md",
                  typeStyles[node.type ?? "process"],
                )}
              >
                <span className="mb-1 text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {node.type ?? "process"}
                </span>
                <span className="whitespace-pre-line text-sm font-semibold leading-snug">
                  {node.label}
                </span>
              </div>
              {index < flow.nodes.length - 1 && (
                <div className="flow-edge" aria-hidden>
                  <div className="flow-edge-line" />
                  {edge?.label && (
                    <span className="flow-edge-label">{edge.label}</span>
                  )}
                  <div className="flow-edge-arrow" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {flow.edges.length > 0 && (
        <ul className="mt-4 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
          {flow.edges.map((edge) => {
            const from = flow.nodes.find((n) => n.id === edge.from)?.label;
            const to = flow.nodes.find((n) => n.id === edge.to)?.label;
            return (
              <li
                key={`${edge.from}-${edge.to}-${edge.label ?? ""}`}
                className="rounded-md border border-stone-200 bg-white/70 px-3 py-2"
              >
                <span className="font-medium text-stone-800">
                  {from?.replace(/\n/g, " ")}
                </span>
                <span className="mx-1 text-teal-700">→</span>
                <span className="font-medium text-stone-800">
                  {to?.replace(/\n/g, " ")}
                </span>
                {edge.label ? (
                  <span className="mt-0.5 block text-stone-500">
                    {edge.label}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
