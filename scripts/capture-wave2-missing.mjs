#!/usr/bin/env node
/**
 * Fill Wave 2 screenshots that were still [SCREENSHOT REQUIRED].
 * Public Odoo 19 Enterprise runbot (server_version must be 19.0+e).
 * Neutralizes a website CSS rotate so the saved UI is upright.
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

async function shot(page, name) {
  await page.addStyleTag({
    content: "html, body { transform: none !important; }",
  }).catch(() => {});
  await page.waitForTimeout(700);
  const dest = path.join(LAB, `${name}.png`);
  await page.screenshot({ path: dest, fullPage: false });
  const snippet = (await page.locator("body").innerText().catch(() => ""))
    .replace(/\s+/g, " ")
    .slice(0, 180);
  console.log("saved", name);
  console.log(" ", page.url());
  console.log(" ", snippet);
}

async function gotoSafe(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2200);
}

async function main() {
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
  const authBody = await auth.json();
  const version = authBody?.result?.server_version || "";
  console.log("AUTH", authBody?.result?.name, version, "uid", authBody?.result?.uid);
  if (!String(version).includes("+e")) {
    console.error("ABORT not enterprise", version, JSON.stringify(authBody).slice(0, 300));
    process.exit(2);
  }

  async function openSettings(label) {
    await gotoSafe(page, `${BASE}/odoo/settings?db=${DB}`);
    const side = page.locator(".o_base_settings a, .settings_tab, .o_setting_nav a, nav a").filter({ hasText: new RegExp(`^\\s*${label}\\s*$`, "i") }).first();
    if (await side.count()) {
      await side.click({ timeout: 8000 });
      await page.waitForTimeout(1200);
      return;
    }
    const search = page.locator(".o_control_panel .o_searchview_input").first();
    await search.click({ timeout: 8000 });
    await search.fill(label);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1200);
  }

  const settings = [
    ["w2-settings-crm", "CRM"],
    ["w2-settings-project", "Project"],
    ["w2-settings-mrp", "Manufacturing"],
    ["w2-settings-employees", "Employees"],
    ["w2-settings-timesheet", "Timesheets"],
  ];
  for (const [name, label] of settings) {
    try {
      await openSettings(label);
      await shot(page, name);
    } catch (e) {
      console.error("settings", label, e.message.split("\n")[0]);
    }
  }

  async function openAction(name, urls) {
    for (const url of urls) {
      try {
        await gotoSafe(page, url);
        const text = await page.locator("body").innerText();
        if (/Odoo Server Error|Traceback|Log in/.test(text.slice(0, 400)) && !/Employees|CRM|Project|Manufacturing|Timesheet/.test(text.slice(0, 400))) {
          console.log("skip", name, url);
          continue;
        }
        await shot(page, name);
        return true;
      } catch (e) {
        console.error("route", name, e.message.split("\n")[0]);
      }
    }
    return false;
  }

  await openAction("w2-crm-leads", [
    `${BASE}/odoo/action-crm.crm_lead_all_leads?db=${DB}`,
  ]);
  await openAction("w2-project-tasks", [
    `${BASE}/odoo/action-project.action_view_all_task?db=${DB}`,
  ]);
  await openAction("w2-timesheets-approve", [
    `${BASE}/odoo/action-hr_timesheet.timesheet_action_all?db=${DB}`,
    `${BASE}/odoo/timesheets?db=${DB}`,
  ]);
  await openAction("w2-employees-departments", [
    `${BASE}/odoo/action-hr.hr_department_kanban_action?db=${DB}`,
    `${BASE}/odoo/action-hr.hr_department_tree_action?db=${DB}`,
  ]);

  async function clickNew(page) {
    const btn = page.locator(".o_list_button_add, .o-kanban-button-new").first();
    if (!(await btn.count())) return false;
    await btn.click({ timeout: 8000 });
    await page.waitForTimeout(1500);
    return true;
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-crm.crm_lead_all_leads?db=${DB}`);
    if (await clickNew(page)) await shot(page, "w2-crm-lead-form");
    else console.log("no New on leads");
  } catch (e) {
    console.error("lead", e.message.split("\n")[0]);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-project.action_view_all_task?db=${DB}`);
    const row = page.locator(".o_kanban_record, .o_data_row").first();
    if (await row.count()) {
      await row.click();
      await page.waitForTimeout(1500);
      await shot(page, "w2-project-task-form");
    } else if (await clickNew(page)) await shot(page, "w2-project-task-form");
  } catch (e) {
    console.error("task", e.message.split("\n")[0]);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-hr.hr_department_kanban_action?db=${DB}`);
    const row = page.locator(".o_kanban_record, .o_data_row").first();
    if (await row.count()) {
      await row.click();
      await page.waitForTimeout(1500);
      await shot(page, "w2-employee-department-form");
    } else if (await clickNew(page)) await shot(page, "w2-employee-department-form");
  } catch (e) {
    console.error("dept", e.message.split("\n")[0]);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-mrp.mrp_bom_form_action?db=${DB}`);
    if (await clickNew(page)) await shot(page, "w2-mrp-bom-subcontract-form");
  } catch (e) {
    console.error("bom", e.message.split("\n")[0]);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/employees?db=${DB}`);
    const switches = page.locator(".o_cp_switch_buttons button, .o_switch_view button");
    const n = await switches.count();
    for (let i = 0; i < n; i++) {
      const tip = (await switches.nth(i).getAttribute("data-tooltip")) || "";
      const aria = (await switches.nth(i).getAttribute("aria-label")) || "";
      console.log("switch", i, tip || aria);
    }
    const org = page.locator('button[data-tooltip*="Org"], button[aria-label*="Org"], button[data-tooltip*="Hierarchy"]').first();
    if (await org.count()) {
      await org.click();
      await page.waitForTimeout(1600);
      await shot(page, "w2-employees-orgchart");
    }
    await gotoSafe(page, `${BASE}/odoo/employees?db=${DB}`);
    const card = page.locator(".o_kanban_record").first();
    if (await card.count()) {
      await card.click();
      await page.waitForTimeout(1500);
      await shot(page, "w2-employee-form-open");
      const tabs = page.locator(".o_notebook .nav-link");
      const tn = await tabs.count();
      for (let i = 0; i < tn; i++) {
        console.log("tab", (await tabs.nth(i).innerText()).replace(/\s+/g, " "));
      }
      const skills = page.getByRole("tab", { name: /Skill|Resume/i }).first();
      if (await skills.count()) {
        await skills.click();
        await page.waitForTimeout(900);
        await shot(page, "w2-employee-skills");
      }
    }
  } catch (e) {
    console.error("hr", e.message.split("\n")[0]);
  }

  fs.writeFileSync(
    path.join(LAB, "CAPTURE-SOURCE-W2.txt"),
    [
      "Odoo 19 Enterprise screenshots (Wave 2)",
      `server_version: ${version}`,
      `source: ${BASE}`,
      `db: ${DB} (public runbot demo, Mitchell Admin)`,
      `captured: ${new Date().toISOString()}`,
      "Missing-screen pass uses the current Enterprise Run build.",
      "Earlier w2-*.png files are from the previous 19.0+e runbot build (same edition).",
      "",
    ].join("\n"),
  );

  await browser.close();
  console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
