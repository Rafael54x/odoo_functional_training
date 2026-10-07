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

Set token MCP di `.env.local` (`ODOO_MCP_TOKEN`) — lihat `.env.example`.  
Konfigurasi Cursor MCP: [`.cursor/mcp.json`](./.cursor/mcp.json).

## Menjalankan web (local)

```bash
npm install
npm run dev
```

App: http://127.0.0.1:43129

## Cara belajar

1. `/cara-pakai`
2. Modul 00
3. Kerjakan tiap langkah di http://172.16.2.123:8072 (DB `odoo`)
4. Pakai tabel **Isi field ini** + screenshot di tiap step

## Docker (opsional, package odoo19e)

Lihat [`odoo19e/README.md`](./odoo19e/README.md) jika ingin boot instance sendiri di odoodev2.
