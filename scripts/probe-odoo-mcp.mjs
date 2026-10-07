#!/usr/bin/env node
/**
 * Probe Odoo MCP endpoint (Streamable HTTP / JSON-RPC).
 *
 *   export ODOO_MCP_TOKEN=...
 *   node scripts/probe-odoo-mcp.mjs
 *
 * Default URL: http://172.16.2.123:8072/mcp
 */

const url = process.env.ODOO_MCP_URL || "http://172.16.2.123:8072/mcp";
const token = process.env.ODOO_MCP_TOKEN || "";

if (!token) {
  console.error("Set ODOO_MCP_TOKEN first.");
  process.exit(1);
}

async function rpc(method, params = {}, id = 1) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const text = await res.text();
  return { status: res.status, text };
}

const init = await rpc("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "odoo-lab-probe", version: "1.0" },
});
console.log("initialize", init.status);
console.log(init.text.slice(0, 2000));

const tools = await rpc("tools/list", {}, 2);
console.log("\ntools/list", tools.status);
console.log(tools.text.slice(0, 4000));
