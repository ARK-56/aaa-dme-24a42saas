import type { Metadata } from "next";
import { Suspense } from "react";
import AccountDashboardSection from "@/components/account/AccountDashboardSection";
import OrderLookupForm from "@/components/account/OrderLookupForm";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Order Form" };

export default function OrderFormPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-contact.svg"
        heading="It's So Nice To Meet You!"
        tag={DISCOVER_TAGLINE}
      />
      {/* Both read search params, so they render inside a Suspense boundary. */}
      <Suspense fallback={null}>
        <AccountDashboardSection />
        <OrderLookupForm />
      </Suspense>
      <TickerBanner />
    </>
  );
}
