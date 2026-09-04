/** Route map for the pages the original theme served as flat .html files. */
export const ROUTES = {
  home: "/",
  about: "/about",
  shop: "/shop",
  contact: "/contact",
  blogs: "/blogs",
  cart: "/cart",
  checkout: "/checkout",
  orderForm: "/order-form",
  orderTrack: "/order-track",
  privacyPolicy: "/privacy-policy",
  termsConditions: "/terms-conditions",
  adminPanel: "/admin-panel",
} as const;

export function productHref(id: string): string {
  return `/product/${id}`;
}

export function blogHref(slug: string): string {
  return `/blogs/${slug}`;
}

/** Fallback art for product images that fail to load, as in the theme. */
export const PRODUCT_IMAGE_FALLBACK =
  "/assets/images/images/featured-product.svg";

/**
 * The theme wrote image paths relative to the page ("assets/..."); in Next they
 * are served from /public, so leading-slash them without touching absolute or
 * data URLs.
 */
export function assetSrc(path: string | undefined | null): string {
  if (!path) return PRODUCT_IMAGE_FALLBACK;
  if (/^(https?:|data:|\/)/.test(path)) return path;
  return `/${path.replace(/^\.?\//, "")}`;
}
