import featuredProductsJson from "@/data/featured-products.json";
import productsJson from "@/data/products.json";
import type { Product } from "@/lib/types";

/**
 * Catalogue shipped with the theme. Used for the first paint and as the
 * fallback whenever Supabase is unreachable or unconfigured.
 */
export const SEED_PRODUCTS = productsJson as Product[];
export const SEED_FEATURED_PRODUCTS = featuredProductsJson as Product[];

// The taxonomy now lives in lib/categories.ts alongside the group mapping.
// Re-exported here so existing imports keep working.
export { PRODUCT_CATEGORIES } from "@/lib/categories";
