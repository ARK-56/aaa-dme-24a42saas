import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import TickerBanner from "@/components/sections/TickerBanner";
import ShopView from "@/components/shop/ShopView";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Explore Our Product Catalog"
        tag={DISCOVER_TAGLINE}
      />
      <ShopView />
      <TickerBanner />
    </>
  );
}
