/**
 * Recapture Wave 2 screenshots from Odoo 19.0+e runbot,
 * dismissing Minecraft / floating canvas overlays before each shot.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE =
  process.env.ODOO_CAPTURE_BASE ||
  "https://127871400-19-0.runbot114.odoo.com";
const DB = process.env.ODOO_CAPTURE_DB || "127871400-19-0-all";
const LAB = path.resolve("public/screenshots/odoo19e");
fs.mkdirSync(LAB, { recursive: true });

async function dismissOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.evaluate(() => {
    // Remove classic Minecraft / canvas game popups if present
    document
      .querySelectorAll(
        "iframe[src*='minecraft'], iframe[src*='classic'], canvas, .o_minecraft, #minecraft",
      )
      .forEach((el) => {
        const box = el.closest("div") || el;
        try {
          box.remove();
        } catch {
          /* ignore */
        }
      });
    // Hide any fixed/absolute floating windows that look like game HUD
    for (const el of document.querySelectorAll("div, section, aside")) {
      const style = window.getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "absolute") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 280 || r.width > 700 || r.height < 200 || r.height > 500)
        continue;
      const t = (el.innerText || "").slice(0, 80);
      if (/0\.0\.23|minecraft|rd-\d{8}/i.test(t) || el.querySelector("canvas")) {
        el.remove();
      }
    }
    document.documentElement.style.transform = "none";
    document.body.style.transform = "none";
  });
  await page.waitForTimeout(400);
}

async function shot(page, name) {
  await dismissOverlays(page);
  await page.waitForTimeout(500);
  const dest = path.join(LAB, `${name}.png`);
  await page.screenshot({ path: dest, fullPage: false });
  console.log("saved", name, page.url().slice(0, 100));
}

async function go(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2200);
  await dismissOverlays(page);
}

async function clickNew(page) {
  const btn = page
    .locator(
      ".o_list_button_add, .o-kanban-button-new, .o_control_panel button:has-text('New')",
    )
    .first();
  if (!(await btn.count())) return false;
  await btn.click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1600);
  return true;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const auth = await page.request.post(`${BASE}/web/session/authenticate`, {
  headers: { "Content-Type": "application/json" },
  data: {
    jsonrpc: "2.0",
    method: "call",
    params: { db: DB, login: "admin", password: "admin" },
    id: 1,
  },
});
const body = await auth.json();
const version = body?.result?.server_version || "";
console.log("AUTH", body?.result?.uid, version, body?.result?.name);
if (!String(version).includes("+e") && !body?.result?.uid) {
  console.error("ABORT auth/version", body);
  process.exit(2);
}

const routes = [
  ["w2-00-home-apps", `${BASE}/odoo?db=${DB}`],
  ["w2-crm-pipeline", `${BASE}/odoo/crm?db=${DB}`],
  ["w2-project", `${BASE}/odoo/project?db=${DB}`],
  ["w2-timesheets", `${BASE}/odoo/timesheets?db=${DB}`],
  ["w2-employees", `${BASE}/odoo/employees?db=${DB}`],
  ["w2-mrp", `${BASE}/odoo/manufacturing?db=${DB}`],
  ["w2-website", `${BASE}/odoo/website?db=${DB}`],
  [
    "w2-ecommerce",
    `${BASE}/odoo/action-website_sale.product_template_action?db=${DB}`,
  ],
  ["w2-settings", `${BASE}/odoo/settings?db=${DB}`],
  ["w2-invoicing", `${BASE}/odoo/accounting?db=${DB}`],
  ["w2-calendar", `${BASE}/odoo/calendar?db=${DB}`],
  ["w2-settings-general", `${BASE}/odoo/settings?db=${DB}`],
  ["w2-users-list", `${BASE}/odoo/action-base.action_res_users?db=${DB}`],
  [
    "w2-companies",
    `${BASE}/odoo/action-base.action_res_company_form?db=${DB}`,
  ],
  [
    "w2-mrp-bom-list",
    `${BASE}/odoo/action-mrp.mrp_bom_form_action?db=${DB}`,
  ],
  [
    "w2-timesheets-lines",
    `${BASE}/odoo/action-hr_timesheet.act_hr_timesheet_line?db=${DB}`,
  ],
  [
    "w2-ecommerce-products",
    `${BASE}/odoo/action-website_sale.product_template_action_website?db=${DB}`,
  ],
];

for (const [name, url] of routes) {
  try {
    await go(page, url);
    await shot(page, name);
  } catch (e) {
    console.error("fail", name, e.message);
  }
}

const news = [
  ["w2-crm-form-new", `${BASE}/odoo/crm?db=${DB}`],
  ["w2-project-form-new", `${BASE}/odoo/project?db=${DB}`],
  ["w2-employee-form-new", `${BASE}/odoo/employees?db=${DB}`],
];
for (const [name, url] of news) {
  try {
    await go(page, url);
    if (await clickNew(page)) await shot(page, name);
  } catch (e) {
    console.error(e.message);
  }
}

try {
  await go(page, `${BASE}/odoo/action-mrp.mrp_bom_form_action?db=${DB}`);
  if (await clickNew(page)) await shot(page, "w2-mrp-bom-form");
} catch (e) {
  console.error(e.message);
}

fs.writeFileSync(
  path.join(LAB, "CAPTURE-SOURCE-W2-CLEAN.txt"),
  [
    "Odoo 19 Enterprise screenshots (Wave 2 cleaned — Minecraft overlay removed)",
    `server_version: ${version}`,
    `source: ${BASE}`,
    `db: ${DB}`,
    `captured: ${new Date().toISOString()}`,
  ].join("\n"),
);

await browser.close();
console.log("DONE clean w2 recapture");
