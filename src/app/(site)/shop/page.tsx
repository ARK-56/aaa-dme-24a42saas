import type { Metadata } from "next";
import { Suspense } from "react";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";
import ShopView from "@/components/shop/ShopView";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Explore Our Product Catalog"
        tag={DISCOVER_TAGLINE}
      />
      {/* ShopView reads ?group= / ?category= from the URL. */}
      <Suspense fallback={null}>
        <ShopView />
      </Suspense>
      <TickerBanner />
    </>
  );
}
