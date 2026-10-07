/**
 * Target Odoo latihan untuk seluruh silabus.
 * Instance di odoodev2 — port 8072, database odoo
 */
export const odooLab = {
  name: "odoo-lab",
  edition: "Odoo 19 Enterprise",
  url: "http://172.16.2.123:8072",
  database: "odoo",
  user: "admin",
  password: "admin",
  hostLabel: "odoodev2",
  mcpUrl: "http://172.16.2.123:8072/mcp",
} as const;

export function odooLoginHint() {
  return `${odooLab.url} · DB ${odooLab.database} · ${odooLab.user} / ${odooLab.password}`;
}
