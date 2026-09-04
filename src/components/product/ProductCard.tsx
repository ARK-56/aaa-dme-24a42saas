"use client";

import Link from "next/link";
import { useState } from "react";
import { useRequestModal } from "@/context/RequestModalProvider";
import { useStore } from "@/context/StoreProvider";
import { assetSrc, PRODUCT_IMAGE_FALLBACK, productHref } from "@/lib/routes";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  /** "reviews" appends the word to the review count, as the shop grid did. */
  reviewLabel?: "count" | "reviews";
  /** The related-products rail used a shorter button label and hid HCPCS. */
  variant?: "full" | "compact";
}

export default function ProductCard({
  product,
  reviewLabel = "count",
  variant = "full",
}: Props) {
  const { addToCart } = useStore();
  const { openRequestModal } = useRequestModal();
  const [imgSrc, setImgSrc] = useState(assetSrc(product.image));

  const isSale = Boolean(product.isSale && product.originalPrice);
  const href = productHref(product.id);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link href={href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={product.name}
            className="product-img"
            onError={() => setImgSrc(PRODUCT_IMAGE_FALLBACK)}
          />
        </Link>
      </div>

      <div className="product-meta-row">
        <div className="rating-box">
          <span className="stars">★ {product.rating.toFixed(1)}</span>
          <span className="rating-num">
            ({product.reviewCount}
            {reviewLabel === "reviews" ? " reviews" : ""})
          </span>
        </div>
        {variant === "full" && (
          <span className="product-hcpcs-label">
            HCPCS: <strong>{product.hcpcsCode}</strong>
          </span>
        )}
      </div>

      <div className="product-title-row">
        <h3>
          <Link href={href} className="product-title-link">
            {product.name}
          </Link>
        </h3>
        <div className="price-container-block">
          {isSale && (
            <span className="price-original-strike">
              ${product.originalPrice}
            </span>
          )}
          <span className="price-label">${product.price}</span>
        </div>
      </div>

      <p className="product-description">{product.description}</p>

      <div className="product-card-actions">
        <button
          type="button"
          className="btn-add-to-cart"
          disabled={!product.inStock}
          onClick={() => addToCart(product.id, 1)}
        >
          <span>{product.inStock ? "Add To Cart" : "Out of Stock"}</span>
          <div className="cart-btn-arrow">
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
          className="btn-request-product"
          onClick={() => openRequestModal(product.id)}
        >
          <span>{variant === "compact" ? "Request" : "Request Product"}</span>
          <div className="request-btn-arrow">
            <svg
              width={variant === "compact" ? 14 : 16}
              height={variant === "compact" ? 14 : 16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              {variant === "full" && <line x1="3" y1="10" x2="21" y2="10" />}
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
