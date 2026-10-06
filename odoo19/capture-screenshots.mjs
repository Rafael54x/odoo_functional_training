import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "https://127573965-19-0.runbot179.odoo.com";
const DB = "127573965-19-0-all";
const OUT = "/opt/cursor/artifacts/screenshots/odoo19e";
const LAB = "/workspace/public/screenshots/odoo19e";

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LAB, { recursive: true });

async function shot(page, name) {
  const file = `${name}.png`;
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, file), fullPage: false });
  fs.copyFileSync(path.join(OUT, file), path.join(LAB, file));
  console.log("saved", file, "url=", page.url());
}

async function gotoSafe(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2500);
}

async function clickNew(page) {
  const btn = page.locator(".o_list_button_add, button.o_list_button_add, .o-kanban-button-new, button:has-text('New')").first();
  if (await btn.count()) {
    await btn.click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
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
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await gotoSafe(page, `${BASE}/web/login?db=${DB}`);

  // Login only if login form visible
  const login = page.locator('input[name="login"]:visible');
  if (await login.count()) {
    await login.fill("admin");
    await page.locator('input[name="password"]:visible').fill("admin");
    await page.locator('.oe_login_form button[type="submit"], form.oe_login_form button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  await gotoSafe(page, `${BASE}/odoo?db=${DB}`);
  await shot(page, "01-home-apps");

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

  const routes = [
    ["02-contacts-list", `${BASE}/odoo/contacts?db=${DB}`],
    ["04-purchase-rfq-list", `${BASE}/odoo/purchase?db=${DB}`],
    ["06-inventory-overview", `${BASE}/odoo/inventory?db=${DB}`],
    ["07-products-list", `${BASE}/odoo/action-stock.stock_product_normal_action?db=${DB}`],
    ["08-sales-quotations", `${BASE}/odoo/sales?db=${DB}`],
    ["10-accounting", `${BASE}/odoo/accounting?db=${DB}`],
    ["11-settings", `${BASE}/odoo/settings?db=${DB}`],
  ];

  for (const [name, url] of routes) {
    try {
      await gotoSafe(page, url);
      await shot(page, name);
    } catch (e) {
      console.error("route failed", name, e.message);
      await shot(page, `${name}-error`);
    }
  }

  // Forms with New
  try {
    await gotoSafe(page, `${BASE}/odoo/contacts?db=${DB}`);
    if (await clickNew(page)) await shot(page, "03-contacts-form-new");
  } catch (e) {
    console.error(e.message);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/purchase?db=${DB}`);
    // Prefer RFQ menu if visible
    const rfq = page.locator("a:has-text('Requests for Quotation'), .o_menu_item:has-text('Requests for Quotation')").first();
    if (await rfq.count()) {
      await rfq.click();
      await page.waitForTimeout(2000);
      await shot(page, "04b-purchase-rfq-list");
    }
    if (await clickNew(page)) await shot(page, "05-purchase-rfq-form");
  } catch (e) {
    console.error(e.message);
  }

  try {
    await gotoSafe(page, `${BASE}/odoo/sales?db=${DB}`);
    if (await clickNew(page)) await shot(page, "09-sales-quotation-form");
  } catch (e) {
    console.error(e.message);
  }

  // Invoices list
  try {
    await gotoSafe(page, `${BASE}/odoo/accounting?db=${DB}`);
    const inv = page.locator("a:has-text('Invoices'), .o_menu_item:has-text('Customers')").first();
    if (await inv.count()) {
      await inv.click();
      await page.waitForTimeout(1500);
    }
    const inv2 = page.locator("a:has-text('Invoices')").first();
    if (await inv2.count()) {
      await inv2.click();
      await page.waitForTimeout(2000);
    }
    await shot(page, "10b-customer-invoices");
  } catch (e) {
    console.error(e.message);
  }

  await browser.close();
  console.log("DONE files=", fs.readdirSync(OUT).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
