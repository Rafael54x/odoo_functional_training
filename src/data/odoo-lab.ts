/**
 * Target Odoo latihan untuk seluruh silabus.
 * Instance: odoo19e di odoodev2
 */
export const odooLab = {
  name: "odoo19e",
  edition: "Odoo 19 Enterprise",
  url: "http://172.16.2.123:8070",
  database: "odoo_functional",
  user: "admin",
  password: "admin",
  hostLabel: "odoodev2",
} as const;

export function odooLoginHint() {
  return `${odooLab.url} · DB ${odooLab.database} · ${odooLab.user} / ${odooLab.password}`;
}
