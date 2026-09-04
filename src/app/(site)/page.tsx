import type { Metadata } from "next";
import BlogsRail from "@/components/home/BlogsRail";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesAndCategories from "@/components/home/FeaturesAndCategories";
import HomeHero from "@/components/home/HomeHero";
import InsuranceBanner from "@/components/home/InsuranceBanner";
import AboutCards from "@/components/sections/AboutCards";
import Faq from "@/components/sections/Faq";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TickerBanner />
      <AboutCards />
      <FeaturesAndCategories />
      <Process />
      <FeaturedProducts />
      <Testimonials />
      <InsuranceBanner />
      <Faq />
      <BlogsRail />
      <TickerBanner />
    </>
  );
}
