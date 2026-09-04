/**
 * Single source of truth for AAA DME's contact details, so the footer, the
 * legal pages and anywhere else cannot drift apart.
 */
export const COMPANY = {
  legalName: "AAA DME Inc",
  shortName: "AAA DME",

  phone: {
    display: "(347) 599 0043",
    href: "tel:+13475990043",
  },

  email: {
    display: "aaadmeinc@gmail.com",
    href: "mailto:aaadmeinc@gmail.com",
  },

  address: {
    /** One-line form used in the footer bar. */
    display: "25 Elm Pl #401, Brooklyn, NY 11201, USA",
    /** Without the country, for prose inside the legal documents. */
    short: "25 Elm Pl #401, Brooklyn, NY 11201",
    street: "25 Elm Pl #401",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    /** Google Maps listing — opens the business location. */
    mapUrl: "https://share.google/2DtN7ezuUKHkZV9H6",
  },
} as const;
