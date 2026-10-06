# Odoo Functional Lab (Odoo 19)

Silabus praktikum interaktif untuk belajar **Odoo 19 Functional** dari database kosong sampai flow transaksi modul standar: Contacts, Purchase, Inventory, Sales, dan Invoicing/Accounting.

## Database latihan

| Item | Nilai |
| --- | --- |
| Database | `odoo_functional` |
| User | `admin` |
| Password | `admin` |
| MCP endpoint | `http://localhost:8069/mcp` |

## Menjalankan lab (web)

```bash
npm install
npm run dev
```

App listen di `0.0.0.0:43129` (semua interface).

- Lokal di VM: [http://127.0.0.1:43129](http://127.0.0.1:43129)
- Akses multi-device: jalankan Cloudflare quick tunnel (saat agent aktif):

```bash
cloudflared tunnel --url http://127.0.0.1:43129
```

URL `https://*.trycloudflare.com` yang muncul bisa dibuka dari HP/laptop mana saja selama sesi agent + tunnel masih hidup.


## Isi silabus

1. Pengenalan & instalasi modul standar  
2. Setup perusahaan & localization  
3. Master Contacts (customer/vendor)  
4. Master Accounting (CoA, taxes, journals, payment terms)  
5. Master Inventory & Products  
6. Flow Purchase (RFQ → PO → Receipt → Bill → Payment)  
7. Operasi Inventory harian  
8. Flow Sales (Quotation → SO → Delivery → Invoice)  
9. Invoicing, payment, rekonsiliasi, laporan AR/AP  
10. End-to-end + troubleshooting + rubrik kompetensi  

Setiap langkah punya: path menu, alasan bisnis, aksi berurutan, tips/pitfall, **flow diagram**, dan **screenshot nyata Odoo 19 Enterprise (`19.0+e`)** plus anotasi field opsional.

Screenshot diambil dari instance Enterprise yang diverifikasi lewat `/web/webclient/version_info` → `server_version: "19.0+e"`.

## MCP Odoo di project ini

File `.cursor/mcp.json` sudah dikonfigurasi untuk server `odoo`.

1. Salin `.env.example` → `.env.local`  
2. Isi `ODOO_MCP_TOKEN`  
3. Buka project di **Cursor Desktop** (Odoo harus listen di `localhost:8069`)  
4. Reload Window → pastikan MCP `odoo` connected  

> Cloud Agent tidak bisa menjangkau `localhost` di laptop Anda. Untuk seed data / screenshot nyata dari Cloud Agent, expose Odoo via tunnel HTTPS atau jalankan agent secara lokal.

## Scripts

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Dev server di port 43129 |
| `npm run build` | Production build |
| `npm run start` | Start production di port 43129 |
| `npm run lint` | ESLint |
