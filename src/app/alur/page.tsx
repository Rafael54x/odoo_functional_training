import Link from "next/link";
import { FlowDiagram } from "@/components/flow-diagram";
import { modules } from "@/data/modules";
import type { LessonFlow } from "@/data/types";

const masterFlow: LessonFlow = {
  title: "Peta besar Procure-to-Pay & Order-to-Cash",
  description:
    "Master data menopang dua siklus utama. Inventory menjadi jembatan fisik; Invoicing menutup nilai uang.",
  nodes: [
    { id: "setup", label: "Company &\nLocalization", type: "start" },
    { id: "md", label: "Contacts\nProducts\nTaxes/WH", type: "process" },
    { id: "p2p", label: "Purchase\nP2P", type: "process" },
    { id: "o2c", label: "Sales\nO2C", type: "process" },
    { id: "stock", label: "Inventory\nIN / OUT", type: "doc" },
    { id: "acc", label: "Bill / Invoice\nPayment", type: "end" },
  ],
  edges: [
    { from: "setup", to: "md" },
    { from: "md", to: "p2p" },
    { from: "md", to: "o2c" },
    { from: "p2p", to: "stock", label: "Receipt" },
    { from: "o2c", to: "stock", label: "Delivery" },
    { from: "p2p", to: "acc", label: "Vendor Bill" },
    { from: "o2c", to: "acc", label: "Customer Invoice" },
  ],
};

export default function AlurPage() {
  const flows = modules.flatMap((mod) =>
    mod.lessons
      .filter((l) => l.flow)
      .map((l) => ({
        module: mod,
        lesson: l,
        flow: l.flow!,
      })),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Peta proses</p>
      <h1 className="font-heading mt-2 text-4xl text-teal-950 sm:text-5xl">
        Peta alur lengkap
      </h1>
      <p className="mt-4 max-w-2xl text-base text-stone-600 sm:text-lg">
        Bingung “ini langkah ke mana”? Lihat peta dulu, lalu kembali ke lesson
        untuk instruksi klik demi klik.
      </p>

      <div className="mt-8">
        <FlowDiagram flow={masterFlow} />
      </div>

      <div className="mt-10 space-y-8">
        {flows.map(({ module, lesson, flow }) => (
          <div key={`${module.slug}-${lesson.slug}`}>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800/70">
                  Modul {module.number} · {module.shortTitle}
                </p>
                <h2 className="font-heading text-2xl text-teal-950">
                  {lesson.title}
                </h2>
              </div>
              <Link
                href={`/modul/${module.slug}/${lesson.slug}`}
                className="text-sm font-medium text-teal-800 hover:underline"
              >
                Buka lesson →
              </Link>
            </div>
            <FlowDiagram flow={flow} />
          </div>
        ))}
      </div>
    </div>
  );
}
