# Odoo Functional Lab (Odoo 19)

Silabus praktik **ramah pemula** untuk belajar Odoo 19 Functional dari nol: kenalan layar → setup → master data → transaksi Purchase / Inventory / Sales / Accounting.

## Database latihan

| Item | Nilai |
| --- | --- |
| Database | `odoo_functional` |
| User | `admin` |
| Password | `admin` |

## Menjalankan lab (web)

```bash
npm install
npm run dev
```

App listen di `0.0.0.0:43129`.

- Lokal: [http://127.0.0.1:43129](http://127.0.0.1:43129)
- Multi-device (saat agent aktif):

```bash
cloudflared tunnel --url http://127.0.0.1:43129
```

## Alur baca untuk pemula

1. Buka **/cara-pakai**
2. Mulai **Modul 00**
3. Kerjakan langkah berurutan (jalur klik + “Jika berhasil, Anda melihat…”)
4. Centang checklist sebelum pindah lesson

## Scripts

| Command | Keterangan |
| --- | --- |
| `npm run dev` | Dev server port 43129 |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | ESLint |
