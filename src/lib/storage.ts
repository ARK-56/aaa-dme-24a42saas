/**
 * localStorage keys, kept identical to the ones the original theme used so an
 * existing browser session (cart, login, pending checkout) carries over.
 */
export const STORAGE_KEYS = {
  products: "aaa_dme_products",
  featuredProducts: "aaa_dme_featured_products",
  users: "aaa_dme_registered_users",
  vouchers: "verification_vouchers",
  orders: "placed_orders",
  requests: "requested_orders",
  cart: "shopping_cart",
  session: "aaa_dme_auth_session",
  pendingCheckout: "dme_pending_checkout",
  orderPlacedSuccess: "dme_order_placed_success",
  placedOrderId: "dme_placed_order_id",
  placedProductId: "dme_placed_product_id",
  placedEmail: "dme_placed_email",
  placedUserId: "dme_placed_user_id",
} as const;

/** Reads and parses a localStorage key, returning `fallback` on any failure. */
export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not persist "${key}" to localStorage:`, err);
  }
}

export function removeLocal(...keys: string[]): void {
  if (typeof window === "undefined") return;
  keys.forEach((key) => window.localStorage.removeItem(key));
}
