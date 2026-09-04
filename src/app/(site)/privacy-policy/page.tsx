import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import PrivacyPolicy from "@/components/legal/PrivacyPolicy";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AAA DME Inc collects, uses, shares, and protects your personal and health information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Privacy Policy"
        tag="YOUR HEALTH, OUR PRIORITY."
      />
      <PrivacyPolicy />
      <TickerBanner />
    </>
  );
}
