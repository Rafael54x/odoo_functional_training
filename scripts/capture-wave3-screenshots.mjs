#!/usr/bin/env node
/**
 * Capture Wave 3 screenshots from public Odoo 19 Enterprise runbot.
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

async function prep(page) {
  await page
    .addStyleTag({ content: "html, body { transform: none !important; }" })
    .catch(() => {});
}

async function shot(page, name) {
  await prep(page);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(LAB, `${name}.png`), fullPage: false });
  console.log(
    "saved",
    name,
    (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 140),
  );
}

async function go(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2000);
  await prep(page);
}

async function clickNew(page) {
  const btn = page.locator(".o_list_button_add, .o-kanban-button-new").first();
  if (!(await btn.count())) return false;
  await btn.click({ timeout: 8000 });
  await page.waitForTimeout(1400);
  return true;
}

async function openFirst(page) {
  const row = page.locator(".o_kanban_record, .o_data_row").first();
  if (!(await row.count())) return false;
  await row.click();
  await page.waitForTimeout(1400);
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
console.log("AUTH", body?.result?.name, version);
if (!String(version).includes("+e")) process.exit(2);

await go(page, `${BASE}/odoo?db=${DB}`);
await shot(page, "w3-00-home-apps");

const routes = [
  ["w3-pos", `${BASE}/odoo/point-of-sale?db=${DB}`],
  ["w3-pos-sessions", `${BASE}/odoo/pos-sessions?db=${DB}`],
  ["w3-helpdesk", `${BASE}/odoo/all-tickets?db=${DB}`],
  ["w3-helpdesk-app", `${BASE}/odoo/helpdesk?db=${DB}`],
  ["w3-helpdesk-teams", `${BASE}/odoo/helpdesk-teams?db=${DB}`],
  ["w3-quality", `${BASE}/odoo/quality-checks?db=${DB}`],
  ["w3-quality-app", `${BASE}/odoo/quality?db=${DB}`],
  ["w3-quality-points", `${BASE}/odoo/control-points?db=${DB}`],
  ["w3-barcode", `${BASE}/odoo/barcode?db=${DB}`],
  ["w3-barcode-ops", `${BASE}/odoo/barcode?db=${DB}`],
  ["w3-recruitment", `${BASE}/odoo/recruitment-applications?db=${DB}`],
  ["w3-recruitment-app", `${BASE}/odoo/recruitment?db=${DB}`],
  ["w3-recruitment-apps", `${BASE}/odoo/recruitment?db=${DB}`],
  ["w3-subscriptions", `${BASE}/odoo/subscriptions?db=${DB}`],
  ["w3-marketing", `${BASE}/odoo/mailing-lists?db=${DB}`],
];
for (const [name, url] of routes) {
  try {
    await go(page, url);
    await shot(page, name);
  } catch (e) {
    console.error(name, e.message.split("\n")[0]);
  }
}

try {
  await go(page, `${BASE}/odoo/all-tickets?db=${DB}`);
  if (await clickNew(page)) await shot(page, "w3-helpdesk-ticket-form");
} catch (e) {
  console.error(e.message.split("\n")[0]);
}
try {
  await go(page, `${BASE}/odoo/control-points?db=${DB}`);
  if (await clickNew(page)) await shot(page, "w3-quality-point-form");
} catch (e) {
  console.error(e.message.split("\n")[0]);
}
try {
  await go(page, `${BASE}/odoo/recruitment-applications?db=${DB}`);
  if (await openFirst(page)) await shot(page, "w3-recruitment-applicant");
} catch (e) {
  console.error(e.message.split("\n")[0]);
}
try {
  await go(page, `${BASE}/odoo/action-hr_recruitment.action_hr_job?db=${DB}`);
  if (await clickNew(page)) await shot(page, "w3-recruitment-job-form");
} catch (e) {
  console.error(e.message.split("\n")[0]);
}
try {
  await go(page, `${BASE}/odoo/point-of-sale?db=${DB}`);
  await shot(page, "w3-pos-config");
} catch (e) {
  console.error(e.message.split("\n")[0]);
}

for (const [name, q] of [
  ["w3-settings-pos", "Point of Sale"],
  ["w3-settings-pos-payment", "Payment Methods"],
  ["w3-settings-helpdesk", "Helpdesk"],
  ["w3-settings-helpdesk-sla", "SLA"],
  ["w3-settings-quality", "Quality"],
  ["w3-settings-barcode", "Barcode"],
  ["w3-settings-recruitment", "Recruitment"],
]) {
  try {
    await go(page, `${BASE}/odoo/settings?db=${DB}`);
    const search = page.locator(".o_control_panel .o_searchview_input").first();
    await search.click();
    await search.fill(q);
    await page.waitForTimeout(1000);
    await shot(page, name);
  } catch (e) {
    console.error(name, e.message.split("\n")[0]);
  }
}

fs.writeFileSync(
  path.join(LAB, "CAPTURE-SOURCE-W3.txt"),
  [
    "Odoo 19 Enterprise screenshots (Wave 3)",
    `server_version: ${version}`,
    `source: ${BASE}`,
    `db: ${DB}`,
    `captured: ${new Date().toISOString()}`,
    "",
  ].join("\n"),
);
fs.writeFileSync(
  path.join(LAB, "version-w3.json"),
  JSON.stringify(
    {
      result: { server_version: version },
      source: BASE,
      db: DB,
      wave: 3,
    },
    null,
    2,
  ),
);

await browser.close();
console.log(
  "DONE",
  fs.readdirSync(LAB).filter((f) => f.startsWith("w3-")).length,
  "files",
);
