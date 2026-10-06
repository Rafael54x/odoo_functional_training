import Link from "next/link";

export default function SetupMcpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">Integrasi Cursor</p>
      <h1 className="font-heading mt-2 text-4xl text-teal-950 sm:text-5xl">
        MCP Odoo untuk chat / project ini
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
        Konfigurasi project-level sudah disiapkan di{" "}
        <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-sm">
          .cursor/mcp.json
        </code>
        . MCP mengarah ke endpoint native Odoo{" "}
        <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-sm">
          http://localhost:8069/mcp
        </code>
        .
      </p>

      <section className="panel mt-8 space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-heading text-xl text-teal-950">1. Token & env</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Salin <code>.env.example</code> menjadi <code>.env.local</code>.
          </li>
          <li>
            Isi <code>ODOO_MCP_TOKEN</code> dengan Bearer token MCP Anda (jangan
            commit token ke git).
          </li>
          <li>
            Pastikan Odoo 19 jalan di <code>localhost:8069</code> dengan database{" "}
            <code>odoo_functional</code>, user <code>admin</code>, password{" "}
            <code>admin</code>.
          </li>
        </ol>
      </section>

      <section className="panel mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-heading text-xl text-teal-950">
          2. Aktifkan di Cursor Desktop
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Buka project ini di Cursor Desktop (bukan hanya Cloud Agent).</li>
          <li>
            Restart / Reload Window agar{" "}
            <code>.cursor/mcp.json</code> terbaca.
          </li>
          <li>
            Cek Settings → MCP: server <strong>odoo</strong> berstatus connected.
          </li>
          <li>
            Di chat Agent, pastikan tools Odoo tersedia (list_models /
            search_read / create_records, dll tergantung modul MCP yang terpasang).
          </li>
        </ol>
      </section>

      <section className="panel mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-heading text-xl text-teal-950">
          3. Catatan untuk Cloud Agent
        </h2>
        <p>
          Cloud Agent berjalan di VM terpisah. <code>localhost:8069</code> di sana{" "}
          <strong>bukan</strong> laptop Anda, jadi MCP lokal tidak otomatis
          tersambung dari cloud.
        </p>
        <p>Agar agent cloud bisa menulis ke Odoo Anda, pilih salah satu:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Jalankan agent di Cursor Desktop lokal (recommended untuk MCP
            localhost), atau
          </li>
          <li>
            Expose Odoo via tunnel aman (ngrok / Cloudflare Tunnel) lalu update{" "}
            <code>url</code> di <code>.cursor/mcp.json</code> ke URL publik HTTPS,
            atau
          </li>
          <li>
            Berikan URL publik Odoo + token di follow-up chat untuk dihubungkan
            ulang.
          </li>
        </ul>
      </section>

      <section className="panel mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-heading text-xl text-teal-950">
          4. Odoo 19 Enterprise di mesin agent
        </h2>
        <p>
          Screenshot di silabus diambil dari <strong>Odoo 19.0+e (Enterprise)</strong>.
          Source install lokal butuh clone private repo{" "}
          <code>github.com/odoo/enterprise</code> (subscription) ke{" "}
          <code>odoo19/enterprise</code>, lalu jalankan{" "}
          <code>./odoo19/start-enterprise.sh</code>. Community saja tidak cukup.
        </p>
        <p>
          Kirim GitHub PAT yang punya akses <code>odoo/enterprise</code> branch{" "}
          <code>19.0</code> jika ingin instance Enterprise lokal permanen di VM ini
          (DB <code>odoo_functional</code>, admin/admin).
        </p>
      </section>

      <section className="panel mt-4 space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-heading text-xl text-teal-950">
          5. Setelah MCP nyambung
        </h2>
        <p>Anda bisa minta agent untuk:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Install/cek modul standar di database kosong</li>
          <li>Seed master data sesuai silabus (contacts, products, taxes)</li>
          <li>Menjalankan transaksi sample P2P / O2C</li>
          <li>
            Refresh screenshot dari instance Enterprise lokal / MCP Anda
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/silabus"
          className="rounded-full bg-teal-800 px-4 py-2 text-sm font-medium text-amber-100"
        >
          Lanjut ke silabus
        </Link>
        <Link
          href="/"
          className="rounded-full border border-teal-900/15 px-4 py-2 text-sm font-medium text-teal-900"
        >
          Beranda
        </Link>
      </div>
    </div>
  );
}
