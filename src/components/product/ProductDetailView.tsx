"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductRail from "@/components/product/ProductRail";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useRequestModal } from "@/context/RequestModalProvider";
import { useStore } from "@/context/StoreProvider";
import { getProductContent } from "@/data/productContent";
import { assetSrc, PRODUCT_IMAGE_FALLBACK, ROUTES } from "@/lib/routes";

const SHIPPING_DESCRIPTIONS: Record<string, string> = {
  "white-glove":
    "Home assembly, room-of-choice positioning & cleanup included",
  "ltl-freight": "Palletized curbside freight delivery, signature required",
};

function shippingDescription(profile: string): string {
  return (
    SHIPPING_DESCRIPTIONS[profile] ??
    "Standard ground shipping, 3-5 business days"
  );
}

const THUMB_COUNT = 5;

interface AccordionSection {
  label: string;
  content: React.ReactNode;
}

export default function ProductDetailView({ productId }: { productId: string }) {
  const { products, getProductById, addToCart, synced } = useStore();
  const { openRequestModal } = useRequestModal();

  const product = getProductById(productId);

  // Copy now lives on the product row so the admin panel can edit it. The
  // productContent.ts lookup stays as a fallback for any row not yet backfilled
  // by migration 0004; once that has run everywhere, the file can go.
  const dbContent =
    product && product.overview?.length && product.bestFor
      ? {
          overview: product.overview,
          features: product.features ?? [],
          bestFor: product.bestFor,
        }
      : undefined;
  const content = dbContent ?? getProductContent(productId);

  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [openSection, setOpenSection] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [panelHeights, setPanelHeights] = useState<number[]>([]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const images =
      product.images && product.images.length > 0
        ? product.images
        : [product.image];
    // Pad to five thumbnail slots by repeating the last image, as the theme did.
    return Array.from(
      { length: THUMB_COUNT },
      (_, i) => images[i] ?? images[images.length - 1]
    );
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    if (sameCategory.length < 3) {
      const others = products.filter(
        (p) => p.category !== product.category && p.id !== product.id
      );
      return sameCategory.concat(others).slice(0, 5);
    }
    return sameCategory.slice(0, 6);
  }, [products, product]);

  const sections: AccordionSection[] = useMemo(() => {
    if (!product) return [];
    return [
      {
        label: "SPECIFICATIONS",
        content: (
          <div className="specs-grid-layout">
            <div className="spec-item">
              <span className="spec-label">HCPCS Code:</span>{" "}
              <span className="spec-value">{product.hcpcsCode}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">FDA Class:</span>{" "}
              <span className="spec-value">{product.fdaClass}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Prescription Required:</span>{" "}
              <span className="spec-value">
                {product.isPrescriptionRequired
                  ? "Yes (Medical documentation needed)"
                  : "No"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Shipping Profile:</span>{" "}
              <span className="spec-value">
                {product.shippingClass.toUpperCase()} (
                {shippingDescription(product.shippingClass)})
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Warranty Coverage:</span>{" "}
              <span className="spec-value">{product.warrantyType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Inventory Status:</span>{" "}
              <span className="spec-value">
                {product.inStock
                  ? "In Stock (Ready to dispatch)"
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        ),
      },
      {
        label: "PRODUCT OVERVIEW & BENEFITS",
        content: content ? (
          <>
            {content.overview.map((paragraph, i) => (
              <p
                className="acc-panel-paragraph"
                key={i}
                style={i > 0 ? { marginTop: 12 } : undefined}
              >
                {paragraph}
              </p>
            ))}

            <p
              className="acc-panel-paragraph"
              style={{ marginTop: 16, fontWeight: 700 }}
            >
              Key features
            </p>
            <ul className="specs-grid-layout" style={{ marginTop: 8 }}>
              {content.features.map((feature) => (
                <li className="spec-item" key={feature}>
                  <span className="spec-value">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="acc-panel-paragraph" style={{ marginTop: 16 }}>
              <strong>Best for:</strong> {content.bestFor}
            </p>
          </>
        ) : (
          // Fallback for products added through the admin panel, which have no
          // editorial entry in productContent.ts yet.
          <>
            <p className="acc-panel-paragraph">{product.description}</p>
            <p className="acc-panel-paragraph" style={{ marginTop: 12 }}>
              Speak to your physician about whether this equipment suits your
              condition. Our team can confirm what your plan covers and gather
              the documentation your insurer needs before you order.
            </p>
          </>
        ),
      },
      {
        label: "SHIPPING & REGULATORY METRICS",
        content: (
          <p className="acc-panel-paragraph">
            FDA regulated device classifications are rigorously monitored on
            this catalog. Prescription-labeled equipment requires a signed
            physician intake form submission prior to direct procurement
            verification. LTL Freight and White-Glove shipping categories
            mandate visual signature confirmation upon arrival.
          </p>
        ),
      },
    ];
  }, [product, content]);

  useEffect(() => {
    setPanelHeights(panelRefs.current.map((panel) => panel?.scrollHeight ?? 0));
  }, [sections]);

  useEffect(() => {
    setGalleryIndex(0);
    setImgError(false);
    setQuantity(1);
  }, [productId]);

  // The catalog arrives from the server after mount; only treat an unknown id
  // as a 404 once that sync has settled.
  if (!product) {
    if (synced) notFound();
    return (
      <section className="product-details-section">
        <div className="container">
          <p className="details-product-copy">Loading product…</p>
        </div>
      </section>
    );
  }

  const isSale = Boolean(product.isSale && product.originalPrice);
  const primeSrc = imgError
    ? PRODUCT_IMAGE_FALLBACK
    : assetSrc(gallery[galleryIndex]);

  return (
    <>
      <section className="product-details-section">
        <div className="container">
          <div className="details-top-navigation">
            <Link href={ROUTES.shop} className="btn-back-listing">
              <span className="back-icon-circle">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </span>
              <span>Back to Listing</span>
            </Link>
          </div>

          <div className="product-details-grid">
            <div className="details-visual-sticky-pane">
              <div className="main-hero-display-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={primeSrc}
                  id="prime-gallery-target"
                  alt={product.name}
                  className="display-prime-img"
                  onError={() => setImgError(true)}
                />
              </div>

              <div className="thumbnail-carousel-row">
                {gallery.map((src, index) => (
                  <button
                    type="button"
                    key={`${src}-${index}`}
                    className={`thumb-card${index === galleryIndex ? " active" : ""}`}
                    data-gallery-index={index}
                    onClick={() => {
                      setGalleryIndex(index);
                      setImgError(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={assetSrc(src)}
                      alt={`${product.name} view ${index + 1}`}
                      className="gallery-thumb-trigger"
                    />
                  </button>
                ))}
              </div>

              <div className="gallery-dashboard-controls">
                <div className="gallery-step-digits">
                  <span id="curr-slide-num">
                    {String(galleryIndex + 1).padStart(2, "0")}
                  </span>{" "}
                  <span className="divider-slash">/</span>{" "}
                  <span className="total-slides-count">
                    {String(gallery.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="gallery-nav-buttons">
                  <button
                    type="button"
                    className={`gal-nav-circle prev-gal-btn${
                      galleryIndex > 0 ? " active" : ""
                    }`}
                    aria-label="Previous Thumbnail"
                    onClick={() =>
                      setGalleryIndex((i) => Math.max(0, i - 1))
                    }
                  >
                    <svg
                      width="14"
                      height="14"
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
                    className={`gal-nav-circle next-gal-btn${
                      galleryIndex < gallery.length - 1 ? " active" : ""
                    }`}
                    aria-label="Next Thumbnail"
                    onClick={() =>
                      setGalleryIndex((i) =>
                        Math.min(gallery.length - 1, i + 1)
                      )
                    }
                  >
                    <svg
                      width="14"
                      height="14"
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
            </div>

            <div className="details-content-scroll-panel">
              <div className="product-title-badge-row">
                <h1 className="details-product-title">{product.name}</h1>
                <span className="product-category-pill-tag">
                  {product.category}
                </span>
              </div>

              <p className="details-product-copy">{product.description}</p>

              <div className="product-nutritional-metrics-row">
                <div className="nutri-feature-cell">
                  <div className="nutri-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="nutri-label">
                    HCPCS: {product.hcpcsCode}
                  </span>
                </div>
                <div className="nutri-divider-bar" />
                <div className="nutri-feature-cell">
                  <div className="nutri-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m10 15 5-3-5-3v6Z" />
                    </svg>
                  </div>
                  <span className="nutri-label">{product.fdaClass} Device</span>
                </div>
                <div className="nutri-divider-bar" />
                <div className="nutri-feature-cell">
                  <div className="nutri-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <span className="nutri-label">{product.warrantyType}</span>
                </div>
              </div>

              <div className="details-pricing-block" id="detail-pricing-target">
                <div className="details-price-tag">
                  {isSale && (
                    <span className="price-original-strike">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="price-actual">${product.price}</span>
                </div>
                {product.isPrescriptionRequired && (
                  <div className="details-rx-badge-row">
                    <span className="rx-required-label">
                      ♥ Prescription Required
                    </span>
                  </div>
                )}
              </div>

              <div className="details-action-purchase-row">
                <div className="details-quantity-stepper">
                  <button
                    type="button"
                    className="details-step-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    —
                  </button>
                  <span className="details-qty-value" id="detail-qty-display">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="details-step-btn"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-details-add-to-cart"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product.id, quantity)}
                >
                  <span>{product.inStock ? "Add To Cart" : "Out of Stock"}</span>
                  <div className="details-cart-arrow-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </button>

                <button
                  type="button"
                  className="btn-details-request-product btn-request-product"
                  onClick={() => openRequestModal(product.id)}
                >
                  <span>Request Product</span>
                  <div className="details-cart-arrow-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="details-accordion-stack">
                {sections.map((section, index) => {
                  const isOpen = openSection === index;
                  return (
                    <div
                      key={section.label}
                      className={`details-acc-item${isOpen ? " active" : ""}`}
                    >
                      <button
                        type="button"
                        className="details-acc-trigger"
                        aria-expanded={isOpen}
                        onClick={() => setOpenSection(isOpen ? -1 : index)}
                      >
                        <span>{section.label}</span>
                        <span className="details-acc-chevron" />
                      </button>
                      <div
                        ref={(el) => {
                          panelRefs.current[index] = el;
                        }}
                        className="details-acc-panel"
                        style={{
                          maxHeight: isOpen
                            ? `${panelHeights[index] ?? 0}px`
                            : "0px",
                        }}
                      >
                        {section.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-header-row">
            <div className="header-left">
              <DiscoverTag>
                CLINICAL HARDWARE DIRECTLY CORRELATED TO DIAGNOSIS PATH.
              </DiscoverTag>
              <h2 className="products-main-title">Related Products</h2>
            </div>
          </div>

          <ProductRail products={related} variant="compact" />
        </div>
      </section>
    </>
  );
}
