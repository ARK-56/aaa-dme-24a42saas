import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import TermsConditions from "@/components/legal/TermsConditions";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of aaadmeinc.com, coverage requests, verification codes, and orders.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Terms & Conditions"
        tag="YOUR HEALTH, OUR PRIORITY."
      />
      <TermsConditions />
      <TickerBanner />
    </>
  );
}
