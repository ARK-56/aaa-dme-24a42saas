"use client";

import ProductRail from "@/components/product/ProductRail";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useStore } from "@/context/StoreProvider";

export default function FeaturedProducts() {
  const { featuredProducts, products } = useStore();

  // The theme fell back to the first six catalog items when no featured set
  // had been curated.
  const shown =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <section className="products-section">
      <div className="container">
        <div className="products-header-row">
          <div className="header-left">
            <DiscoverTag />
            <h2 className="products-main-title">Our Featured Products</h2>
          </div>

          <div className="products-filter-tabs">
            <button type="button" className="filter-tab">
              Equipment
            </button>
            <button type="button" className="filter-tab">
              Devices
            </button>
            <button type="button" className="filter-tab">
              Supports
            </button>
          </div>
        </div>

        <ProductRail products={shown} />
      </div>
    </section>
  );
}
