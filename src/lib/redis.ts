import { createClient, type RedisClientType } from "redis";
import type { DbFile } from "@/lib/dbFiles";

export { DB_FILES, isDbFile } from "@/lib/dbFiles";
export type { DbFile } from "@/lib/dbFiles";

/**
 * Redis-backed JSON document store, replacing the theme's database/*.json files.
 * Keys are namespaced the same way the original server.js namespaced them, so an
 * existing database keeps working against this app unchanged.
 */
export const REDIS_KEY_PREFIX = "aaa_dme:db:";

/** Give up on a dead host quickly rather than hanging the request. */
const CONNECT_TIMEOUT_MS = 5000;
const COMMAND_TIMEOUT_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 2;

// Next.js hot-reloads modules in dev, so the client is cached on globalThis to
// avoid opening a new connection on every reload.
const globalForRedis = globalThis as unknown as {
  redisClient?: RedisClientType;
  redisReady?: Promise<RedisClientType>;
};

function connect(): Promise<RedisClientType> {
  const url = process.env.REDIS_URL;
  if (!url) {
    return Promise.reject(
      new Error("REDIS_URL is not set — copy .env.local.example to .env.local")
    );
  }

  const client: RedisClientType = createClient({
    url,
    socket: {
      connectTimeout: CONNECT_TIMEOUT_MS,
      // node-redis retries forever by default; a handful of attempts is enough
      // to ride out a blip without stalling every request behind a dead host.
      reconnectStrategy: (retries) =>
        retries > MAX_RECONNECT_ATTEMPTS
          ? new Error("Redis unreachable")
          : Math.min((retries + 1) * 200, 1000),
    },
  });
  // Without a listener node-redis turns connection errors into unhandled
  // rejections; the connect() promise below is what actually surfaces them.
  client.on("error", (err: Error) =>
    console.error("[Redis] Client Error:", err.message)
  );

  globalForRedis.redisClient = client;
  return client.connect().then(() => {
    console.log("[Redis] Connected.");
    return client;
  });
}

export function getRedis(): Promise<RedisClientType> {
  if (!globalForRedis.redisReady) {
    globalForRedis.redisReady = connect().catch((err) => {
      // Clear the cached promise so the next request retries the connection
      // instead of replaying the original failure forever.
      globalForRedis.redisReady = undefined;
      // Close the half-open client so it stops retrying in the background.
      globalForRedis.redisClient?.disconnect().catch(() => {});
      globalForRedis.redisClient = undefined;
      throw err;
    });
  }
  return globalForRedis.redisReady;
}

/** Rejects rather than letting a stalled command hold a request open. */
function withTimeout<T>(work: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Redis ${label} timed out`)),
        COMMAND_TIMEOUT_MS
      )
    ),
  ]);
}

export async function readDoc(file: DbFile): Promise<string | null> {
  const client = await getRedis();
  return withTimeout(client.get(REDIS_KEY_PREFIX + file), "read");
}

export async function writeDoc(file: DbFile, json: string): Promise<void> {
  const client = await getRedis();
  await withTimeout(client.set(REDIS_KEY_PREFIX + file, json), "write");
}
