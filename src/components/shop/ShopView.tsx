"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useStore } from "@/context/StoreProvider";
import type { Product } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

type SortKey = "featured" | "price-low" | "price-high" | "rating";

const AVAILABILITY = [
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out Of Stock" },
] as const;

type Availability = (typeof AVAILABILITY)[number]["value"];

export default function ShopView() {
  const { products, categories } = useStore();

  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // Price bounds follow the catalog, matching the theme's dynamic slider range.
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 5000),
    };
  }, [products]);

  const [priceMin, setPriceMin] = useState(bounds.min);
  const [priceMax, setPriceMax] = useState(bounds.max);
  // Tracks whether the user has moved a handle, so a catalog refresh does not
  // stomp their selection.
  const priceTouched = useRef(false);

  useEffect(() => {
    if (priceTouched.current) return;
    setPriceMin(bounds.min);
    setPriceMax(bounds.max);
  }, [bounds.min, bounds.max]);

  const stockCounts = useMemo(
    () => ({
      "in-stock": products.filter((p) => p.inStock).length,
      "out-of-stock": products.filter((p) => !p.inStock).length,
    }),
    [products]
  );

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      let matchesAvailability = true;
      if (availability.length > 0) {
        const wantsIn = availability.includes("in-stock");
        const wantsOut = availability.includes("out-of-stock");
        if (wantsIn && !wantsOut) matchesAvailability = product.inStock;
        else if (!wantsIn && wantsOut) matchesAvailability = !product.inStock;
      }

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice =
        product.price >= priceMin && product.price <= priceMax;

      return matchesAvailability && matchesCategory && matchesPrice;
    });

    const sorted: Product[] = [...result];
    if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    // "featured" keeps the catalog's own ordering.

    return sorted;
  }, [products, availability, selectedCategories, priceMin, priceMax, sort]);

  // Any change to the result set returns the user to the first page.
  useEffect(() => {
    setPage(1);
  }, [availability, selectedCategories, priceMin, priceMax, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const goToPage = (next: number) => {
    setPage(next);
    if (gridRef.current) {
      window.scrollTo({
        top: gridRef.current.getBoundingClientRect().top + window.scrollY - 160,
        behavior: "smooth",
      });
    }
  };

  const toggle = <T extends string>(
    list: T[],
    value: T,
    setter: (next: T[]) => void
  ) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const resetFilters = () => {
    setAvailability([]);
    setSelectedCategories([]);
    priceTouched.current = false;
    setPriceMin(bounds.min);
    setPriceMax(bounds.max);
    setSort("featured");
  };

  const updatePrice = (which: "min" | "max", raw: string) => {
    priceTouched.current = true;
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    if (which === "min") setPriceMin(value);
    else setPriceMax(value);
  };

  return (
    <section className="shop-page-section">
      <div className="container shop-layout-container">
        <aside className="shop-filter-sidebar">
          <div className="filter-header-row">
            <h3 className="sidebar-title">Filter :</h3>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>

          <div className="filter-accordion-block active">
            <button type="button" className="filter-acc-trigger">
              <span>Availability</span>
              <span className="acc-chevron" />
            </button>
            <div className="filter-acc-panel">
              <div className="checkbox-group-row">
                {AVAILABILITY.map((option) => (
                  <label className="custom-checkbox" key={option.value}>
                    <input
                      type="checkbox"
                      name="availability"
                      value={option.value}
                      className="filter-checkbox"
                      checked={availability.includes(option.value)}
                      onChange={() =>
                        toggle(availability, option.value, setAvailability)
                      }
                    />
                    <span className="checkbox-box" />
                    <span className="checkbox-label">
                      {option.label}{" "}
                      <span className="count-lbl">
                        ({String(stockCounts[option.value]).padStart(2, "0")})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-accordion-block active">
            <button type="button" className="filter-acc-trigger">
              <span>Price</span>
              <span className="acc-chevron" />
            </button>
            <div className="filter-acc-panel">
              <div className="price-slider-wrapper">
                <div className="slider-track-line" />
                <input
                  type="range"
                  min={bounds.min}
                  max={bounds.max}
                  value={priceMin}
                  className="range-input min-range"
                  onChange={(e) => updatePrice("min", e.target.value)}
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min={bounds.min}
                  max={bounds.max}
                  value={priceMax}
                  className="range-input max-range"
                  onChange={(e) => updatePrice("max", e.target.value)}
                  aria-label="Maximum price"
                />
              </div>
              <div className="price-numeric-fields">
                <div className="price-input-box">
                  <span className="currency-tag">USD</span>
                  <input
                    type="number"
                    value={priceMin}
                    min={bounds.min}
                    max={bounds.max}
                    onChange={(e) => updatePrice("min", e.target.value)}
                    aria-label="Minimum price value"
                  />
                </div>
                <div className="price-input-box">
                  <span className="currency-tag">USD</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={bounds.min}
                    max={bounds.max}
                    onChange={(e) => updatePrice("max", e.target.value)}
                    aria-label="Maximum price value"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="filter-accordion-block active">
            <button type="button" className="filter-acc-trigger">
              <span>By Category</span>
              <span className="acc-chevron" />
            </button>
            <div className="filter-acc-panel">
              <div className="checkbox-group-row" id="category-filter-stack">
                {categories.map((category) => {
                  const count = products.filter(
                    (p) => p.category === category
                  ).length;
                  return (
                    <label className="custom-checkbox" key={category}>
                      <input
                        type="checkbox"
                        name="category"
                        value={category}
                        className="filter-checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() =>
                          toggle(
                            selectedCategories,
                            category,
                            setSelectedCategories
                          )
                        }
                      />
                      <span className="checkbox-box" />
                      <span className="checkbox-label">
                        {category}{" "}
                        <span className="count-lbl">
                          ({String(count).padStart(2, "0")})
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <main className="shop-products-main-panel">
          <div className="shop-sort-toolbar-row">
            <p className="toolbar-results-count">
              <span id="filtered-items-count">{filtered.length}</span> Products
              Found
            </p>

            <div className="sort-dropdown-wrapper">
              <label htmlFor="shop-sorting-select" className="sort-label">
                Sort By:
              </label>
              <div className="custom-select-box">
                <select
                  id="shop-sorting-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="featured">All Products</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className="shop-products-grid"
            id="shop-cards-target-grid"
            ref={gridRef}
          >
            {visible.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "64px 20px",
                  color: "var(--text-muted)",
                }}
              >
                No medical supplies match the selected criteria. Try adjusting
                filters or resetting.
              </div>
            ) : (
              visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  reviewLabel="reviews"
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="shop-pagination-row">
              <button
                type="button"
                className="pag-nav-btn"
                aria-label="Previous Page"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                ←
              </button>
              <div className="pag-pages-list-wrapper">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      type="button"
                      className={`pag-num-link${num === page ? " active" : ""}`}
                      onClick={() => goToPage(num)}
                    >
                      {num}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                className="pag-nav-btn"
                aria-label="Next Page"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                →
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
