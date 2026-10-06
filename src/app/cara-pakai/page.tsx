import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Siapkan Odoo latihan",
    body: "Pakai database odoo_functional, login admin / admin. Jangan campur dengan data produksi.",
  },
  {
    title: "Mulai dari Modul 00",
    body: "Jangan loncat ke Purchase/Sales dulu. Pelajari navigasi dan install modul terlebih dahulu.",
  },
  {
    title: "Baca satu langkah, kerjakan di Odoo, baru lanjut",
    body: "Tiap langkah punya jalur klik, instruksi berurutan, dan “Jika berhasil, Anda melihat…”. Ikuti itu.",
  },
  {
    title: "Tandai selesai jika sudah berhasil",
    body: "Tombol “Tandai selesai” membantu Anda tahu progress. Checklist di akhir lesson wajib dicek.",
  },
  {
    title: "Urutan tetap: data dulu, transaksi kemudian",
    body: "Contacts & Products dulu → baru Purchase/Sales → baru pelajari laporan. Loncat urutan = sering error.",
  },
];

const glossary = [
  {
    term: "Apps",
    meaning: "Aplikasi di Home Odoo (Purchase, Sales, Inventory, dll).",
  },
  {
    term: "Master data",
    meaning: "Data dasar yang dipakai berulang: kontak, produk, pajak, gudang.",
  },
  {
    term: "RFQ / PO",
    meaning: "Request for Quotation (penawaran beli) / Purchase Order (pesanan beli tetap).",
  },
  {
    term: "SO / Quotation",
    meaning: "Sales Order / penawaran jual ke pelanggan.",
  },
  {
    term: "Receipt / Delivery",
    meaning: "Barang masuk gudang / barang keluar ke pelanggan.",
  },
  {
    term: "Invoice / Bill",
    meaning: "Tagihan ke pelanggan / tagihan dari vendor.",
  },
];

export default function CaraPakaiPage() {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Panduan pemula</p>
      <h1 className="font-heading mt-2 text-4xl text-teal-950 sm:text-5xl">
        Cara memakai lab ini
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
        Lab ini dibuat untuk orang yang baru kenal Odoo. Anda tidak perlu background
        ERP. Ikuti urutan di bawah — pelan saja.
      </p>

      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={s.title} className="howto-step rounded-2xl border border-stone-200/80 bg-white/75 p-4">
            <span className="howto-num">{i + 1}</span>
            <div>
              <h2 className="font-heading text-xl text-teal-950">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-2xl border border-stone-200/80 bg-white/75 p-5">
        <h2 className="font-heading text-2xl text-teal-950">Kamus mini</h2>
        <p className="mt-1 text-sm text-stone-600">
          Istilah yang sering muncul. Baca sekali, nanti ketemu lagi di lesson.
        </p>
        <dl className="mt-4 space-y-3">
          {glossary.map((g) => (
            <div key={g.term} className="border-t border-stone-100 pt-3 first:border-0 first:pt-0">
              <dt className="text-sm font-semibold text-teal-900">{g.term}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-stone-600">
                {g.meaning}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/modul/pengenalan/apa-itu-odoo-functional"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-amber-100"
        >
          Mulai Modul 00 <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/silabus"
          className="inline-flex h-11 items-center rounded-lg border border-teal-900/15 px-4 text-sm font-semibold text-teal-900"
        >
          Lihat semua silabus
        </Link>
      </div>
    </div>
  );
}
