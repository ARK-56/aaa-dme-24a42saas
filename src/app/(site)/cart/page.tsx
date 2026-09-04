import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-contact.svg"
        heading="It's So Nice To Meet You!"
        tag={DISCOVER_TAGLINE}
      />
      <CartView />
      <TickerBanner />
    </>
  );
}
