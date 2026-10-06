# odoo19e — Odoo 19 Enterprise (Docker) di odoodev2

| Item | Nilai |
| --- | --- |
| Host | `odoodev2` (`172.16.2.123`) |
| Layout | `/opt/odoo/community` + `/opt/odoo/enterprise` |
| UI | http://172.16.2.123:8070 |
| Container | `odoo19e` |
| DB latihan | `odoo_functional` · `admin` / `admin` |
| Master password | `admin` |

## Status yang Anda lihat di server

```text
/opt/odoo/community   ← sudah ada
/opt/odoo/enterprise  ← KOSONG → harus diisi dulu
```

Tanpa isi enterprise, container **sengaja gagal start** (bukan Community silently).

## Cara tercepat (dari laptop Windows)

Di **Git Bash** / **WSL** (bukan di prompt `C:\Users\user>` murni tanpa scp/rsync):

```bash
# dari root repo silabus ini
bash odoo19e/scripts/deploy-from-laptop.sh odoodev2 "/c/Users/user/odoo-19.0+e.20250918"
```

Itu akan: upload `odoo19e` → copy source Windows → isi `/opt/odoo/enterprise` → `docker compose up` di port **8070**.

## Sudah SSH di odoodev2?

### 1) Upload paket (dari laptop, terminal lain)

```bash
bash odoo19e/scripts/upload-odoo19e-only.sh odoodev2
```

### 2) Copy Enterprise dari Windows, lalu di server:

```bash
# laptop:
scp -r "/c/Users/user/odoo-19.0+e.20250918" odoodev2:~/odoo-19.0e-src

# odoodev2:
cd ~/odoo19e
bash scripts/bootstrap-on-odoodev2.sh ~/odoo-19.0e-src
```

Atau jika enterprise sudah terisi:

```bash
cd ~/odoo19e
bash scripts/start-on-odoodev2.sh
```

### Alternatif: clone repo private

```bash
bash ~/odoo19e/scripts/fill-enterprise.sh --git
bash ~/odoo19e/scripts/start-on-odoodev2.sh
```

(Butuh akses GitHub `odoo/enterprise` branch `19.0`.)

## Buat database latihan

1. Buka http://172.16.2.123:8070  
2. Create database:
   - Master password: `admin`
   - Database: `odoo_functional`
   - Email / password: `admin` / `admin`
   - **Jangan** load demo data  
3. Install Apps: Contacts, Inventory, Purchase, Sales, Accounting

## Perintah berguna (di odoodev2)

```bash
cd ~/odoo19e
docker compose ps
docker compose logs -f odoo
docker compose restart odoo
docker compose down
```
