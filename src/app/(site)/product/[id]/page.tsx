import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import ProductDetailView from "@/components/product/ProductDetailView";
import TickerBanner from "@/components/sections/TickerBanner";
import { SEED_PRODUCTS } from "@/lib/seed";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = SEED_PRODUCTS.find((p) => p.id === id);
  return { title: product?.name ?? "Product Detail" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Product Details"
        tag="CLINICAL EXCELLENCE IN RESIDENTIAL HOME CARE AESTHETICS."
      />
      <ProductDetailView productId={id} />
      <TickerBanner />
    </>
  );
}
