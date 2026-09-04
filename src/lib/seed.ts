import featuredProductsJson from "@/data/featured-products.json";
import productsJson from "@/data/products.json";
import type { Product } from "@/lib/types";

/**
 * Catalog shipped with the theme. Used as the first paint and as the fallback
 * whenever the Redis-backed store is unreachable.
 */
export const SEED_PRODUCTS = productsJson as Product[];
export const SEED_FEATURED_PRODUCTS = featuredProductsJson as Product[];

/** Sidebar/category filter order, carried over from the original data store. */
export const PRODUCT_CATEGORIES = [
  "Wheelchairs",
  "Hospital Beds",
  "Walkers & Rollators",
  "Respiratory",
  "Mobility Scooters",
  "Bath Safety",
  "Patient Lifts",
] as const;
