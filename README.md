# Odoo Functional Lab (Odoo 19)

Silabus praktik ramah pemula untuk Odoo 19 Enterprise.

## Odoo latihan (odoo19e)

| Item | Nilai |
| --- | --- |
| URL | http://172.16.2.123:8070 |
| Host | odoodev2 |
| Container | `odoo19e` |
| Database | `odoo_functional` |
| Login | `admin` / `admin` |

Setup Docker: lihat folder [`odoo19e/`](./odoo19e/README.md).

## Menjalankan web (local)

```bash
npm install
npm run dev
```

App: http://127.0.0.1:43129

## Deploy Vercel

```bash
npx vercel login
npx vercel --prod
```

Atau set secret `VERCEL_TOKEN` lalu `npx vercel --prod --token "$VERCEL_TOKEN"`.

## Alur baca pemula

1. `/cara-pakai`
2. Modul 00
3. Kerjakan di http://172.16.2.123:8070
