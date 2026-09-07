/**
 * Create (or promote) an administrator account.
 *
 *   node scripts/seed-admin.mjs --email you@example.com [--name "Jane Doe"]
 *
 * The password comes from ADMIN_PASSWORD, or is generated and printed once if
 * that is unset. Passing a password on the command line is deliberately not
 * supported: argv shows up in shell history and in the process list.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local. That key bypasses RLS
 * entirely, so it belongs only in a local .env.local (already gitignored) or a
 * server-side secret store — never in NEXT_PUBLIC_*, never in the browser
 * bundle, and never committed.
 *
 * Safe to re-run: an address that already exists is promoted rather than
 * duplicated, and the password is left alone in that case.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

// Minimal .env.local reader so the script needs no extra dependency.
function loadEnvLocal() {
  let raw;
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = arg("--email")?.trim().toLowerCase();
const fullName = arg("--name")?.trim() || "Administrator";

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) {
  fail(
    "SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
      "  Supabase dashboard > Project Settings > API > service_role, then add it\n" +
      "  to .env.local. Do not prefix it with NEXT_PUBLIC_ — that would ship a\n" +
      "  key that bypasses every RLS policy to the browser."
  );
}
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  fail("Pass a valid address: --email you@example.com");
}

// Generated only when ADMIN_PASSWORD is unset, and printed once below.
const generated = !process.env.ADMIN_PASSWORD;
const password =
  process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** The admin API has no lookup-by-email, so page until the address turns up. */
async function findUserByEmail(address) {
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw new Error(`Could not list users: ${error.message}`);
    const hit = data.users.find((u) => u.email?.toLowerCase() === address);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
  let userId;
  let created = false;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    // Skips the confirmation mail: a seeded admin should be able to sign in
    // immediately without a round trip through an inbox.
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    const alreadyExists =
      error.status === 422 || /already (been )?registered|exists/i.test(error.message);
    if (!alreadyExists) throw new Error(`Could not create user: ${error.message}`);

    const existing = await findUserByEmail(email);
    if (!existing) {
      throw new Error(
        `Supabase reports ${email} exists but it was not found in the user list.`
      );
    }
    userId = existing.id;
    console.log(`  ${email} already exists — promoting, password unchanged.`);
  } else {
    userId = data.user.id;
    created = true;
  }

  // handle_new_user() creates this row on signup; upsert covers accounts that
  // predate the trigger, and sets the admin flag either way.
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, email, full_name: fullName, is_admin: true },
      { onConflict: "id" }
    );
  if (profileError) {
    throw new Error(`User exists but promotion failed: ${profileError.message}`);
  }

  const { data: check, error: checkError } = await supabase
    .from("profiles")
    .select("email, is_admin")
    .eq("id", userId)
    .single();
  if (checkError || !check?.is_admin) {
    throw new Error("Promotion did not stick — check the profiles table.");
  }

  console.log(`\n  ${created ? "Created" : "Promoted"} admin: ${check.email}`);
  console.log(`  user id: ${userId}`);
  if (created && generated) {
    console.log(`\n  Generated password: ${password}`);
    console.log("  Shown once. Store it in a password manager and change it after signing in.");
  }
  console.log("");
}

main().catch((err) => fail(err.message));
