#!/usr/bin/env node
/**
 * Redis connectivity checker and seeder.
 *
 *   npm run redis:check     diagnose REDIS_URL — DNS, TCP, auth, round-trip
 *   npm run redis:seed      initialise any missing collections
 *
 * The seeder never overwrites a collection that already has data.
 */
import dns from "node:dns/promises";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "redis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PREFIX = "aaa_dme:db:";
const SEED = ROOT;

/** Collection -> file providing its initial value (null = empty array). */
const COLLECTIONS = {
  "products.json": "src/data/products.json",
  "featured-products.json": "src/data/featured-products.json",
  "users.json": null,
  "orders.json": null,
  "requests.json": null,
  "verification-codes.json": null,
};

// .env.local is not loaded automatically outside Next, so read it here.
function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

const ok = (s) => `  [ok]   ${s}`;
const bad = (s) => `  [FAIL] ${s}`;
const info = (s) => `  ...    ${s}`;

function tcpProbe(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port });
    const done = (result) => {
      sock.destroy();
      resolve(result);
    };
    sock.setTimeout(timeout);
    sock.once("connect", () => done({ ok: true }));
    sock.once("timeout", () => done({ ok: false, reason: "timed out" }));
    sock.once("error", (e) => done({ ok: false, reason: e.code || e.message }));
  });
}

async function main() {
  loadEnvLocal();
  const seedMode = process.argv.includes("--seed");
  const url = process.env.REDIS_URL;

  console.log("\nRedis check\n");

  if (!url) {
    console.log(bad("REDIS_URL is not set."));
    console.log(info("Copy .env.local.example to .env.local and fill it in."));
    process.exit(1);
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    console.log(bad("REDIS_URL is not a valid URL."));
    process.exit(1);
  }

  const host = parsed.hostname;
  const port = Number(parsed.port || 6379);
  console.log(ok(`REDIS_URL parsed — host ${host}, port ${port}`));
  console.log(
    ok(`credentials ${parsed.password ? "present" : "absent"} in the URL`)
  );

  // 1. DNS
  try {
    const addrs = await dns.resolve4(host);
    console.log(ok(`DNS resolves to ${addrs.join(", ")}`));
  } catch (e) {
    if (host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      console.log(info(`skipping DNS for ${host}`));
    } else {
      console.log(bad(`DNS lookup failed for ${host} (${e.code})`));
      console.log(
        info(
          "The instance hostname does not exist. It was most likely deleted or the subscription lapsed — provision a new database and update REDIS_URL."
        )
      );
      process.exit(1);
    }
  }

  // 2. TCP
  const tcp = await tcpProbe(host, port);
  if (tcp.ok) {
    console.log(ok(`TCP connect to ${host}:${port} succeeded`));
  } else {
    console.log(bad(`TCP connect to ${host}:${port} failed (${tcp.reason})`));
    console.log(info("Check the port and any IP allow-list on the instance."));
    process.exit(1);
  }

  // 3. Redis handshake + round-trip
  const client = createClient({
    url,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (r) =>
        r > 2 ? new Error("unreachable") : Math.min((r + 1) * 200, 1000),
    },
  });
  client.on("error", () => {}); // reported via the await below

  try {
    const t0 = Date.now();
    await client.connect();
    console.log(ok(`authenticated and ready in ${Date.now() - t0} ms`));

    const probeKey = `${PREFIX}__connectivity_probe`;
    await client.set(probeKey, "ok");
    const readBack = await client.get(probeKey);
    await client.del(probeKey);
    console.log(
      readBack === "ok"
        ? ok("read/write round-trip succeeded")
        : bad(`round-trip returned ${JSON.stringify(readBack)}`)
    );
  } catch (e) {
    console.log(bad(`Redis handshake failed: ${e.message}`));
    console.log(info("Usually a wrong password or a TLS/non-TLS mismatch."));
    process.exit(1);
  }

  // 4. Collection inventory
  console.log("\nCollections\n");
  const missing = [];
  for (const name of Object.keys(COLLECTIONS)) {
    const raw = await client.get(PREFIX + name);
    if (raw === null) {
      missing.push(name);
      console.log(`  ${name.padEnd(26)} not initialised`);
    } else {
      let size = "?";
      try {
        const v = JSON.parse(raw);
        size = Array.isArray(v) ? `${v.length} records` : "object";
      } catch {
        size = "unparseable JSON";
      }
      console.log(`  ${name.padEnd(26)} ${size}`);
    }
  }

  if (seedMode && missing.length) {
    console.log("\nSeeding\n");
    for (const name of missing) {
      const source = COLLECTIONS[name];
      const value = source
        ? fs.readFileSync(path.join(SEED, source), "utf8")
        : "[]";
      await client.set(PREFIX + name, value);
      console.log(ok(`${name} seeded from ${source ?? "empty array"}`));
    }
  } else if (missing.length) {
    console.log(`\n  ${missing.length} collection(s) not initialised.`);
    console.log("  Run: npm run redis:seed\n");
  } else {
    console.log("\n  All collections present.\n");
  }

  await client.quit();
}

main().catch((e) => {
  console.error("\nUnexpected error:", e.message, "\n");
  process.exit(1);
});
