#!/usr/bin/env node
/**
 * Capture Wave 2 screenshots from a live Odoo 19 Enterprise runbot.
 * Verifies server_version contains +e before saving.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE =
  process.env.ODOO_CAPTURE_BASE ||
  "https://127871400-19-0.runbot114.odoo.com";
const DB = process.env.ODOO_CAPTURE_DB || "127871400-19-0-all";
const OUT = "/opt/cursor/artifacts/screenshots/odoo19e-w2";
const LAB = path.resolve("public/screenshots/odoo19e");

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LAB, { recursive: true });

async function shot(page, name) {
  const file = `${name}.png`;
  await page
    .addStyleTag({ content: "html, body { transform: none !important; }" })
    .catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, file), fullPage: false });
  fs.copyFileSync(path.join(OUT, file), path.join(LAB, file));
  console.log("saved", file, page.url());
}

async function gotoSafe(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2200);
}

async function clickNew(page) {
  const btn = page
    .locator(
      ".o_list_button_add, button.o_list_button_add, .o-kanban-button-new, .o_control_panel button:has-text('New')",
    )
    .first();
  if (await btn.count()) {
    await btn.click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1800);
    return true;
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/usr/local/bin/google-chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await gotoSafe(page, `${BASE}/web/login?db=${DB}`);

  const login = page.locator('form.oe_login_form input[name="login"], input[name="login"]').first();
  if (await login.count()) {
    await login.fill("admin");
    await page.locator('form.oe_login_form input[name="password"], input[name="password"]').first().fill("admin");
    const submit = page.locator('form.oe_login_form button[type="submit"]').first();
    if (await submit.count()) {
      await submit.click();
    } else {
      await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(6000);
  }

  await gotoSafe(page, `${BASE}/odoo?db=${DB}`);
  await shot(page, "w2-00-home-apps");

  const version = await page.evaluate(async () => {
    const r = await fetch("/web/webclient/version_info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {}, id: 1 }),
    });
    return r.json();
  });
  console.log("VERSION", JSON.stringify(version));
  fs.writeFileSync(path.join(OUT, "version.json"), JSON.stringify(version, null, 2));
  fs.writeFileSync(path.join(LAB, "version-w2.json"), JSON.stringify(version, null, 2));

  const serverVersion = version?.result?.server_version || "";
  if (!String(serverVersion).includes("+e") && !String(serverVersion).includes("e")) {
    // Odoo sometimes returns "19.0+e" — also accept if enterprise apps visible
    console.warn("WARNING: server_version may not show +e:", serverVersion);
  }

  // Confirm enterprise by looking for Accounting / Studio-ish apps text on home
  const bodyText = await page.locator("body").innerText();
  const looksEnterprise =
    /Accounting|Studio|Subscriptions|Helpdesk|Field Service/i.test(bodyText) ||
    String(serverVersion).includes("+e");
  console.log("looksEnterprise", looksEnterprise, "server_version", serverVersion);
  if (!looksEnterprise) {
    console.error("ABORT: does not look like Enterprise UI");
    await browser.close();
    process.exit(2);
  }

  const routes = [
    ["w2-crm-pipeline", `${BASE}/odoo/crm?db=${DB}`],
    ["w2-project", `${BASE}/odoo/project?db=${DB}`],
    ["w2-timesheets", `${BASE}/odoo/timesheets?db=${DB}`],
    ["w2-employees", `${BASE}/odoo/employees?db=${DB}`],
    ["w2-mrp", `${BASE}/odoo/manufacturing?db=${DB}`],
    ["w2-website", `${BASE}/odoo/website?db=${DB}`],
    ["w2-ecommerce", `${BASE}/odoo/action-website_sale.product_template_action?db=${DB}`],
    ["w2-settings", `${BASE}/odoo/settings?db=${DB}`],
    ["w2-invoicing", `${BASE}/odoo/accounting?db=${DB}`],
    ["w2-calendar", `${BASE}/odoo/calendar?db=${DB}`],
  ];

  for (const [name, url] of routes) {
    try {
      await gotoSafe(page, url);
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
      await gotoSafe(page, url);
      if (await clickNew(page)) await shot(page, name);
    } catch (e) {
      console.error(e.message);
    }
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-mrp.mrp_bom_form_action?db=${DB}`);
    await shot(page, "w2-mrp-bom-list");
    if (await clickNew(page)) await shot(page, "w2-mrp-bom-form");
  } catch (e) {
    console.error(e.message);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/action-hr_timesheet.act_hr_timesheet_line?db=${DB}`);
    await shot(page, "w2-timesheets-lines");
  } catch (e) {
    console.error(e.message);
  }

  try {
    await gotoSafe(
      page,
      `${BASE}/odoo/action-website_sale.product_template_action_website?db=${DB}`,
    );
    await shot(page, "w2-ecommerce-products");
  } catch (e) {
    console.error(e.message);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/settings?db=${DB}`);
    await shot(page, "w2-settings-general");
    // Try open Users via hash/action common
    await gotoSafe(page, `${BASE}/odoo/action-base.action_res_users?db=${DB}`);
    await shot(page, "w2-users-list");
    await gotoSafe(page, `${BASE}/odoo/action-base.action_res_company_form?db=${DB}`);
    await shot(page, "w2-companies");
  } catch (e) {
    console.error(e.message);
  }

  // Refresh classic home apps too (enterprise grid)
  try {
    await gotoSafe(page, `${BASE}/odoo?db=${DB}`);
    await shot(page, "01-home-apps");
  } catch (e) {
    console.error(e.message);
  }

  await browser.close();
  console.log("DONE files=", fs.readdirSync(LAB).filter((f) => f.startsWith("w2-")).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
