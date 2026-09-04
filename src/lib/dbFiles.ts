export const DB_FILES = [
  "products.json",
  "featured-products.json",
  "users.json",
  "orders.json",
  "requests.json",
  "verification-codes.json",
] as const;

export type DbFile = (typeof DB_FILES)[number];

export function isDbFile(name: string): name is DbFile {
  return (DB_FILES as readonly string[]).includes(name);
}
