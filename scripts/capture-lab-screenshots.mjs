#!/usr/bin/env node
/**
 * Capture screenshots from the lab Odoo (run on a machine that can reach odoodev2).
 *
 *   npm i -D playwright
 *   npx playwright install chromium
 *   node scripts/capture-lab-screenshots.mjs
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.ODOO_URL || "http://172.16.2.123:8072";
const DB = process.env.ODOO_DB || "odoo";
const USER = process.env.ODOO_USER || "admin";
const PASS = process.env.ODOO_PASSWORD || "admin";
const LAB = path.resolve("public/screenshots/odoo19e");

fs.mkdirSync(LAB, { recursive: true });

async function shot(page, name) {
  const file = path.join(LAB, `${name}.png`);
  await page.waitForTimeout(800);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/web/login?db=${DB}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const login = page.locator('input[name="login"]:visible');
  if (await login.count()) {
    await login.fill(USER);
    await page.locator('input[name="password"]:visible').fill(PASS);
    await page
      .locator('.oe_login_form button[type="submit"], button[type="submit"]')
      .first()
      .click();
    await page.waitForTimeout(4000);
  }

  await page.goto(`${BASE}/odoo?db=${DB}`, { waitUntil: "domcontentloaded" });
  await shot(page, "01-home-apps");

  const routes = [
    ["02-contacts-list", `${BASE}/odoo/contacts?db=${DB}`],
    ["04-purchase-rfq-list", `${BASE}/odoo/purchase?db=${DB}`],
    ["06-inventory-overview", `${BASE}/odoo/inventory?db=${DB}`],
    ["08-sales-quotations", `${BASE}/odoo/sales?db=${DB}`],
    ["10-accounting", `${BASE}/odoo/accounting?db=${DB}`],
    ["11-settings", `${BASE}/odoo/settings?db=${DB}`],
  ];
  for (const [name, url] of routes) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    await shot(page, name);
  }

  await browser.close();
  console.log("Done. Screenshots in", LAB);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
