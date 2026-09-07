"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductRail from "@/components/product/ProductRail";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useStore } from "@/context/StoreProvider";
import { isInGroup, PRODUCT_GROUPS } from "@/lib/categories";
import { shopGroupHref } from "@/lib/routes";

export default function FeaturedProducts() {
  const { featuredProducts, products } = useStore();
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const shown = useMemo(() => {
    const group = PRODUCT_GROUPS.find((g) => g.slug === activeGroup);

    // No tab selected: the curated featured set, falling back to the first six
    // items when nothing has been curated.
    if (!group) {
      return featuredProducts.length > 0
        ? featuredProducts
        : products.slice(0, 6);
    }

    // A tab is selected: show that group from the whole catalogue, so the tabs
    // are not limited to whatever happens to be featured.
    return products.filter((p) => isInGroup(p.category, group));
  }, [activeGroup, featuredProducts, products]);

  return (
    <section className="products-section">
      <div className="container">
        <div className="products-header-row">
          <div className="header-left">
            <DiscoverTag />
            <h2 className="products-main-title">Our Featured Products</h2>
          </div>

          <div className="products-filter-tabs">
            {PRODUCT_GROUPS.map((group) => (
              <button
                key={group.slug}
                type="button"
                className={`filter-tab${
                  activeGroup === group.slug ? " active" : ""
                }`}
                onClick={() =>
                  setActiveGroup((current) =>
                    current === group.slug ? null : group.slug
                  )
                }
                title={group.label}
              >
                {group.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="products-empty-note">
            Nothing in this category just now — try another, or browse the full
            catalogue.
          </p>
        ) : (
          // Remounting on tab change resets the rail to the first slide rather
          // than leaving it scrolled past the end of a shorter list.
          <ProductRail key={activeGroup ?? "featured"} products={shown} autoPlay />
        )}

        {activeGroup && (
          <div className="products-view-all-row">
            <Link href={shopGroupHref(activeGroup)} className="btn-view-all-blogs">
              <span>
                View all{" "}
                {PRODUCT_GROUPS.find((g) => g.slug === activeGroup)?.label}
              </span>
              <div className="view-all-arrow">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
