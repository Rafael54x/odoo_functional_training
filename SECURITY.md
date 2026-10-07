# Security notes

## Jangan commit

- `.env.local` / file berisi `ODOO_MCP_TOKEN`, GitHub PAT, password produksi
- Source Odoo Enterprise (`odoo19e/src/`, `odoo19/enterprise/`)
- Key SSH / `*.pem` / `*.token`

## Yang aman di repo

- Kredensial **lab latihan** `admin` / `admin` di silabus (sengaja untuk DB `odoo` di jaringan internal)
- URL lab internal `http://172.16.2.123:8072`
- `.env.example` dengan placeholder saja
- `.cursor/mcp.json` yang mereferensikan `${env:ODOO_MCP_TOKEN}` tanpa nilai token

## Jika token pernah terkirim di chat / commit

1. **GitHub PAT** — revoke di GitHub → Settings → Developer settings → Personal access tokens  
2. **Odoo MCP Bearer** — regenerate di Odoo (Settings → MCP / API keys)  
3. Update `.env.local` lokal; jangan push ulang token ke chat atau repo
