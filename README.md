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

Setup Docker: lihat [`odoo19e/README.md`](./odoo19e/README.md)  
Perintah tempel di server: [`odoo19e/ON-SERVER.md`](./odoo19e/ON-SERVER.md)

Layout host odoodev2: `/opt/odoo/community` + `/opt/odoo/enterprise` (enterprise harus diisi dulu).

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
