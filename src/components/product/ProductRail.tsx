"use client";

import ProductCard from "@/components/product/ProductCard";
import { useSlider } from "@/hooks/useSlider";
import type { Product } from "@/lib/types";

interface Props {
  products: Product[];
  /** The related-products rail uses the shorter card layout. */
  variant?: "full" | "compact";
}

/**
 * Horizontal product carousel with the theme's progress bar and arrow controls.
 * Backs both "Our Featured Products" on the homepage and "Related Products" on
 * the detail page.
 */
export default function ProductRail({ products, variant = "full" }: Props) {
  const slider = useSlider({ count: products.length, gap: 24 });

  return (
    <>
      <div className="products-slider-window" ref={slider.viewportRef}>
        <div
          className="products-slider-track"
          id="product-track"
          ref={slider.trackRef}
          style={{ transform: `translate3d(-${slider.offset}px, 0px, 0px)` }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={variant}
            />
          ))}
        </div>
      </div>

      <div className="products-bottom-controls">
        <div className="slider-progress-bar-container">
          <div
            className="slider-progress-fill"
            id="product-slider-progress"
            style={{ width: `${slider.progress}%` }}
          />
        </div>

        <div className="slider-nav-buttons">
          <button
            type="button"
            className={`nav-arrow-btn${slider.atStart ? "" : " active"}`}
            id="prod-slide-prev"
            aria-label="Slide Left"
            onClick={slider.prev}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className={`nav-arrow-btn${slider.atEnd ? "" : " active"}`}
            id="prod-slide-next"
            aria-label="Slide Right"
            onClick={slider.next}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
