/**
 * Move catalogue images out of /public and into the product-images bucket.
 *
 *   node scripts/upload-product-images.mjs [--dry-run]
 *
 * Reads every product row, uploads any image still pointing at a local
 * /public path, and rewrites the row to the bucket's public URL. Rows already
 * on a URL are left alone, so this is safe to re-run.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY. Run migration 0003 first — it creates the
 * bucket this writes to.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { basename, extname, join } from "node:path";

const BUCKET = "product-images";

const MIME = {
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function loadEnvLocal() {
  let raw;
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.argv.includes("--dry-run");

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) {
  fail(
    "SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
      "  Supabase dashboard > Project Settings > API > service_role, into .env.local.\n" +
      "  Never give it a NEXT_PUBLIC_ prefix."
  );
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** A local path is anything not already absolute (http/https or data:). */
const isLocal = (p) => typeof p === "string" && p !== "" && !/^(https?:|data:)/.test(p);

/** "assets/images/products/p1.avif" and "/assets/..." both live under /public. */
const publicPathFor = (p) => join("public", p.replace(/^\//, ""));

async function uploadOne(localPath) {
  const file = publicPathFor(localPath);
  if (!existsSync(file)) {
    return { skipped: `missing on disk: ${file}` };
  }

  const ext = extname(file).toLowerCase();
  const objectName = basename(file);
  const body = readFileSync(file);

  if (dryRun) {
    return { url: `<dry-run> ${BUCKET}/${objectName}`, bytes: body.length };
  }

  const { error } = await supabase.storage.from(BUCKET).upload(objectName, body, {
    contentType: MIME[ext] ?? "application/octet-stream",
    // Re-running should refresh the object rather than fail on conflict.
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) return { skipped: `upload failed (${objectName}): ${error.message}` };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectName);
  return { url: data.publicUrl, bytes: body.length };
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image, images");
  if (error) fail(`Could not read products: ${error.message}`);

  console.log(`\n  ${products.length} products${dryRun ? " (dry run)" : ""}\n`);

  // One upload per distinct file: several products can share an image.
  const uploaded = new Map();
  const problems = [];
  let bytes = 0;

  const upload = async (path) => {
    if (uploaded.has(path)) return uploaded.get(path);
    const result = await uploadOne(path);
    if (result.skipped) {
      problems.push(result.skipped);
      uploaded.set(path, null);
      return null;
    }
    bytes += result.bytes;
    uploaded.set(path, result.url);
    return result.url;
  };

  let changed = 0;

  for (const product of products) {
    const nextImage = isLocal(product.image) ? await upload(product.image) : null;

    const gallery = product.images ?? [];
    let galleryChanged = false;
    const nextGallery = [];
    for (const item of gallery) {
      if (!isLocal(item)) {
        nextGallery.push(item);
        continue;
      }
      const url = await upload(item);
      nextGallery.push(url ?? item);
      if (url) galleryChanged = true;
    }

    const patch = {};
    if (nextImage) patch.image = nextImage;
    if (galleryChanged) patch.images = nextGallery;
    if (Object.keys(patch).length === 0) continue;

    changed += 1;
    if (dryRun) {
      console.log(`  ${product.name}\n    -> ${patch.image ?? "(gallery only)"}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update(patch)
      .eq("id", product.id);
    if (updateError) {
      problems.push(`row update failed (${product.name}): ${updateError.message}`);
    } else {
      console.log(`  ${product.name}\n    -> ${patch.image ?? "(gallery only)"}`);
    }
  }

  const files = [...uploaded.values()].filter(Boolean).length;
  console.log(
    `\n  ${files} file(s), ${(bytes / 1024 / 1024).toFixed(1)} MB, ${changed} row(s) ${
      dryRun ? "would change" : "updated"
    }.`
  );

  if (problems.length) {
    console.log(`\n  ${problems.length} problem(s):`);
    for (const p of problems) console.log(`    - ${p}`);
    process.exitCode = 1;
  }
  console.log("");
}

main().catch((err) => fail(err.message));
