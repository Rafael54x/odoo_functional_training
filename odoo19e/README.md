# odoo19e — Odoo 19 Enterprise (Docker)

Target host: **odoodev2** (`172.16.2.123`)  
UI: **http://172.16.2.123:8070**  
Database latihan: **odoo_functional** (admin / admin)

## 1) Copy source Enterprise dari Windows ke odoodev2

Di mesin yang punya folder `C:\Users\user\odoo-19.0+e.20250918`:

```bash
# Contoh dari WSL / Git Bash di Windows
scp -r "/c/Users/user/odoo-19.0+e.20250918" odoodev2:~/odoo-19.0e-src
```

Atau di odoodev2 jika folder sudah di-share:

```bash
ls ~/odoo-19.0e-src   # pastikan ada odoo-bin
```

## 2) Copy folder `odoo19e` ke odoodev2

```bash
# dari laptop (repo ini)
scp -r odoo19e odoodev2:~/odoo19e
```

## 3) Bootstrap container

```bash
ssh odoodev2
cd ~/odoo19e
bash scripts/bootstrap-on-odoodev2.sh ~/odoo-19.0e-src
```

Container name: **odoo19e** · Port host: **8070** → container 8069

## 4) Buat database latihan

1. Buka http://172.16.2.123:8070
2. Create database:
   - Master password: `admin`
   - Database name: `odoo_functional`
   - Email: `admin`
   - Password: `admin`
   - **Jangan** load demo data
3. Install Apps: Contacts, Inventory, Purchase, Sales, Accounting

## Perintah berguna

```bash
docker compose ps
docker compose logs -f odoo
docker compose restart odoo
docker compose down
```
