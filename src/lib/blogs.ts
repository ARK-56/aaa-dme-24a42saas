export interface BlogSummary {
  slug: string;
  title: string;
  /** Read time in minutes, rendered zero-padded by the card. */
  minutes: number;
  category: string;
  date: string;
  /** The theme's post pages carried their own headline/category in a couple of
   * cases; these override the card values on the detail page. */
  detailTitle?: string;
  detailCategory?: string;
}

/** The four posts the theme shipped, keyed by their new route slugs. */
export const BLOG_POSTS: BlogSummary[] = [
  {
    slug: "cpap-supplies-covered",
    title: "AAA DME's Easy Steps to Get Your CPAP Supplies Covered",
    minutes: 3,
    category: "Sleep Therapy",
    date: "Nov 11, 2025",
  },
  {
    slug: "wheelchair-fast",
    title: "Need a Wheelchair Fast? AAA DME's Hassle-Free Solution",
    minutes: 4,
    category: "Mobility Solutions",
    date: "Oct 29, 2025",
  },
  {
    slug: "portable-oxygen-concentrators-2025",
    title:
      "AAA DME provides Best Portable Oxygen Concentrators 2025 – Doctor Approved",
    minutes: 6,
    category: "Oxygen Therapy",
    date: "Oct 29, 2025",
    detailTitle: "Best Portable Oxygen Concentrators 2025 – Doctor Approved",
    detailCategory: "Respiratory Therapy",
  },
  {
    slug: "what-makes-aaa-dme-different",
    title: "What Actually Makes AAA DME Different from Other DME Companies?",
    minutes: 5,
    category: "Patient Advocacy",
    date: "May 15, 2025",
    detailTitle:
      "What Actually Makes AAA DME Different from Other DME Companies",
  },
];

export function getBlogPost(slug: string): BlogSummary | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * Card order used on the homepage rail and the blogs index, which both repeated
 * two posts to fill out the row.
 */
export const BLOG_CARD_ORDER = [0, 1, 2, 3, 0, 2] as const;
