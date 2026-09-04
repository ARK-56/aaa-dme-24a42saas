import type { Metadata } from "next";
import CheckoutView from "@/components/checkout/CheckoutView";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-contact.svg"
        heading="It's So Nice To Meet You!"
        tag={DISCOVER_TAGLINE}
      />
      <CheckoutView />
      <TickerBanner />
    </>
  );
}
