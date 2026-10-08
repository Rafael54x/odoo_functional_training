import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { odooLab, odooLoginHint } from "@/data/odoo-lab";

const steps = [
  {
    title: "Buka Odoo latihan",
    body: `Di browser, buka ${odooLab.url}. Database: ${odooLab.database}. Login ${odooLab.user} / ${odooLab.password}. Ini instance Odoo 19 Enterprise di ${odooLab.hostLabel}.`,
  },
  {
    title: "Mulai dari Core Flow (Modul 00)",
    body: "Path pemula: Core Flow dulu (navigasi → company → users → master → beli/jual → closing). Jangan loncat ke Materi Modul Deep Dive sebelum transaksi dasar lancar.",
  },
  {
    title: "Lanjut Materi Modul setelah Core Flow",
    body: "Deep Dive per app (Sales, Purchase, Inventory, Accounting, Contacts, Users, Settings) ada di menu Materi Modul — untuk mendalami config, field, skenario, dan troubleshooting.",
  },
  {
    title: "Baca satu langkah → isi field → cek hasil",
    body: "Tiap langkah punya jalur klik, daftar aksi berurutan, tabel “Isi field ini”, screenshot Odoo, dan kotak “Jika berhasil, Anda melihat…”. Kerjakan di Odoo yang sama, baru lanjut.",
  },
  {
    title: "Pakai nilai seed yang sama",
    body: "Vendor PT Sumber Bahan Makmur, customer Toko Maju Jaya, produk Kopi Arabika 1kg — dipakai di seluruh silabus agar flow mudah diulang.",
  },
  {
    title: "Urutan tetap: data dulu, transaksi kemudian",
    body: "Contacts & Products dulu → Purchase (terima stok) → Sales (kirim & tagih) → laporan. Loncat urutan = sering error “no stock / missing partner”.",
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
  {
    term: "3-way matching",
    meaning: "Cocokkan PO ↔ Receipt ↔ Vendor Bill sebelum bayar.",
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
        Lab ini untuk pemula Odoo. Semua praktik dikerjakan di{" "}
        <strong>{odooLab.url}</strong> · database <strong>{odooLab.database}</strong>{" "}
        ({odooLab.edition}).
      </p>

      <aside className="beginner-callout mt-6">
        <p className="text-sm font-semibold text-teal-950">Target Odoo latihan</p>
        <p className="mt-1 text-sm leading-relaxed text-stone-700">
          {odooLoginHint()}
        </p>
        <a
          href={odooLab.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:underline"
        >
          Buka Odoo sekarang <ExternalLink className="size-3.5" />
        </a>
      </aside>

      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="howto-step rounded-2xl border border-stone-200/80 bg-white/75 p-4"
          >
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
            <div
              key={g.term}
              className="border-t border-stone-100 pt-3 first:border-0 first:pt-0"
            >
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
          className="inline-flex h-11 items-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700"
        >
          Lihat silabus
        </Link>
      </div>
    </div>
  );
}
