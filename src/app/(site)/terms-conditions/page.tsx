import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import LegalDocument from "@/components/legal/LegalDocument";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsConditionsPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Explore Our Product Catalog"
        tag={DISCOVER_TAGLINE}
      />
      <LegalDocument title="Terms & Conditions" />
      <TickerBanner />
    </>
  );
}
