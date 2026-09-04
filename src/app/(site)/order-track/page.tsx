import type { Metadata } from "next";
import { Suspense } from "react";
import OrderTrackView from "@/components/account/OrderTrackView";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Track Order" };

export default function OrderTrackPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-contact.svg"
        heading="It's So Nice To Meet You!"
        tag={DISCOVER_TAGLINE}
      />
      <Suspense fallback={null}>
        <OrderTrackView />
      </Suspense>
      <TickerBanner />
    </>
  );
}
