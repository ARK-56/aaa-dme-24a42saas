import type { DbFile } from "@/lib/dbFiles";

/**
 * Reads a document from the server store. Returns null when the API is
 * unreachable or the document has not been initialized yet, so callers can fall
 * back to their local cache.
 */
export async function fetchDoc<T>(file: DbFile): Promise<T | null> {
  try {
    const res = await fetch(`/api/db/${file}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Writes a document to the server store. Failures are logged rather than
 * thrown — the caller has already updated its local cache, which the original
 * theme treated as the synchronous backup.
 */
export async function saveDoc(file: DbFile, data: unknown): Promise<boolean> {
  try {
    const res = await fetch(`/api/db/${file}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.warn(`Server write failed for ${file} (${res.status}).`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Server write failed for ${file}, using local cache:`, err);
    return false;
  }
}
