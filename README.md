# Odoo Functional Lab (Odoo 19)

Silabus praktik ramah pemula untuk Odoo 19 Enterprise.

Repo: https://github.com/Rafael54x/odoo_functional_training  
Deploy: Vercel (hubungkan ke repo di atas)

## Odoo latihan

| Item | Nilai |
| --- | --- |
| URL | http://172.16.2.123:8072 |
| Host | odoodev2 |
| Database | `odoo` |
| Login | `admin` / `admin` |
| MCP | http://172.16.2.123:8072/mcp |

MCP (opsional, hanya di mesin lokal Anda): salin `.env.example` → `.env.local`, isi `ODOO_MCP_TOKEN`.  
Konfigurasi Cursor: [`.cursor/mcp.json`](./.cursor/mcp.json) memakai `${env:ODOO_MCP_TOKEN}` — **jangan** commit token ke GitHub.

Screenshot di lesson adalah UI Odoo 19 Enterprise asli. Data company di gambar boleh beda dari lab Anda; ikut tabel **Isi field ini**.

## Menjalankan web (local)

```bash
npm install
npm run dev
```

App: http://127.0.0.1:43129

## Cara belajar (path pemula)

1. `/cara-pakai`
2. **Core Flow** di `/silabus` — alur bisnis (termasuk Users & Access + Closing)
3. **Materi Modul** di `/materi` — Deep Dive Wave 1–3 (termasuk POS, Helpdesk, Quality, Barcode, Recruitment)
4. Kerjakan di http://172.16.2.123:8072 (DB `odoo`)
5. Peta arsitektur: `/kurikulum` · [`CURRICULUM.md`](./CURRICULUM.md)

## Docker (opsional, package odoo19e)

Lihat [`odoo19e/README.md`](./odoo19e/README.md) jika ingin boot instance sendiri di odoodev2.
