/**
 * Two levels of taxonomy.
 *
 * The catalogue's own `category` field is specific (Wheelchairs, Respiratory,
 * Bath Safety…). The marketing side of the site talks in three broader groups —
 * the homepage carousel, the featured-product tabs and the header's Shop menu
 * all use these. Defining the mapping once means every one of those filters
 * agrees with the others.
 */

export const PRODUCT_CATEGORIES = [
  "Wheelchairs",
  "Hospital Beds",
  "Walkers & Rollators",
  "Respiratory",
  "Mobility Scooters",
  "Bath Safety",
  "Patient Lifts",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface ProductGroup {
  /** URL-safe id, used as ?group= on the shop page. */
  slug: string;
  /** Full name, used in the header menu and the categories carousel. */
  label: string;
  /** Short form for the featured-products tab row. */
  shortLabel: string;
  blurb: string;
  categories: readonly ProductCategory[];
}

export const PRODUCT_GROUPS: readonly ProductGroup[] = [
  {
    slug: "mobility-equipment",
    label: "Mobility Equipment",
    shortLabel: "Equipment",
    blurb:
      "Wheelchairs, rollators and scooters — the equipment that keeps you moving, prescribed by your doctor and delivered to your door.",
    categories: ["Wheelchairs", "Walkers & Rollators", "Mobility Scooters"],
  },
  {
    slug: "self-care-devices",
    label: "Self-Care Devices",
    shortLabel: "Devices",
    blurb:
      "CPAP and BiPAP machines, oxygen concentrators, nebulisers and monitors — equipment you manage your condition with at home.",
    categories: ["Respiratory"],
  },
  {
    slug: "medical-support",
    label: "Medical Support",
    shortLabel: "Supports",
    blurb:
      "Hospital beds, patient lifts, pressure relief and bath safety — the equipment that makes daily care safe for patient and caregiver alike.",
    categories: ["Hospital Beds", "Patient Lifts", "Bath Safety"],
  },
];

export function getGroupBySlug(slug: string | null | undefined) {
  if (!slug) return undefined;
  return PRODUCT_GROUPS.find((g) => g.slug === slug);
}

/** The group a specific catalogue category belongs to, if any. */
export function getGroupForCategory(category: string) {
  return PRODUCT_GROUPS.find((g) =>
    (g.categories as readonly string[]).includes(category)
  );
}

/** True when a product's category falls inside the given group. */
export function isInGroup(category: string, group: ProductGroup) {
  return (group.categories as readonly string[]).includes(category);
}
