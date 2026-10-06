# Perintah siap tempel di odoodev2

Anda sekarang di:

```text
melawai@odoodev2:/opt/odoo/enterprise$
```

Enterprise **kosong**. Lakukan ini.

## Di laptop Windows (terminal baru)

PowerShell:

```powershell
cd <folder-repo-silabus>
powershell -ExecutionPolicy Bypass -File odoo19e\scripts\deploy-from-windows.ps1
```

Atau Git Bash:

```bash
bash odoo19e/scripts/deploy-from-laptop.sh odoodev2 "/c/Users/user/odoo-19.0+e.20250918"
```

## Atau manual (2 terminal)

**Laptop:**

```text
scp -r C:\Users\user\odoo-19.0+e.20250918 odoodev2:~/odoo-19.0e-src
scp -r odoo19e odoodev2:~/odoo19e
```

**odoodev2 (session SSH yang sudah terbuka):**

```bash
cd ~/odoo19e
bash scripts/bootstrap-on-odoodev2.sh ~/odoo-19.0e-src
```

Tunggu sampai muncul:

```text
OK — Odoo 19 Enterprise siap
  URL : http://172.16.2.123:8070
```

Lalu buat DB `odoo_functional` (master `admin`, login `admin`/`admin`, tanpa demo).
