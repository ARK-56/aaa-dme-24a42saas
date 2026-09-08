"use client";

import { useEffect, useState } from "react";
import { useRequestModal } from "@/context/RequestModalProvider";
import { useStore } from "@/context/StoreProvider";
import { assetSrc, PRODUCT_IMAGE_FALLBACK } from "@/lib/routes";
import type { CartItem } from "@/lib/types";

type StatusTone = "success" | "error" | "warning";

interface Props {
  item: CartItem;
  verifiedCode: string;
  onVerify: (
    productId: string,
    code: string
  ) => { ok: boolean; message: string };
  onQuantityChange: (productId: string) => void;
  onCheckout: (productId: string) => void;
}

const DEFAULT_WARNING =
  "Verification required. Enter code or request equipment.";
const VERIFIED_MESSAGE = "✓ Code verified! Ready to check out.";

export default function CartRow({
  item,
  verifiedCode,
  onVerify,
  onQuantityChange,
  onCheckout,
}: Props) {
  const { setCartQuantity, removeFromCart } = useStore();
  const { openRequestModal } = useRequestModal();

  const [codeInput, setCodeInput] = useState(verifiedCode);
  const [status, setStatus] = useState<{ text: string; tone: StatusTone }>({
    text: verifiedCode ? VERIFIED_MESSAGE : DEFAULT_WARNING,
    tone: verifiedCode ? "success" : "warning",
  });
  // Which src failed, not which to show - see ProductCard for why.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  // A code resolved elsewhere (e.g. an already-approved voucher) unlocks the row.
  useEffect(() => {
    if (!verifiedCode) return;
    setCodeInput(verifiedCode);
    setStatus({ text: VERIFIED_MESSAGE, tone: "success" });
  }, [verifiedCode]);

  const isVerified = Boolean(verifiedCode);

  const changeQuantity = (delta: number) => {
    const next = Math.min(Math.max(item.quantity + delta, 1), 99);
    if (next === item.quantity) return;
    setCartQuantity(item.productId, next);
    onQuantityChange(item.productId);
    setCodeInput("");
    setStatus({
      text: "Quantity changed — please re-verify your code.",
      tone: "warning",
    });
  };

  const handleVerify = () => {
    const result = onVerify(item.productId, codeInput);
    setStatus({
      text: result.message,
      tone: result.ok ? "success" : "error",
    });
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => removeFromCart(item.productId), 300);
  };

  return (
    <div
      className="cart-item-row"
      data-product-id={item.productId}
      data-price={item.price}
      style={
        removing
          ? {
              opacity: 0,
              transform: "translateX(-20px)",
              transition: "all 0.3s ease",
            }
          : undefined
      }
    >
      <div className="cart-item-row-top">
        <div
          className="cart-product-cell"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              failedSrc === assetSrc(item.image)
                ? PRODUCT_IMAGE_FALLBACK
                : assetSrc(item.image)
            }
            alt={item.name}
            className="cart-item-img"
            onError={() => setFailedSrc(assetSrc(item.image))}
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              objectFit: "cover",
              border: "1px solid #e4e8ef",
            }}
          />
          <div className="product-info-text">
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#03231c",
                marginBottom: 4,
              }}
            >
              {item.name}
            </h3>
            <p
              className="unit-price"
              style={{ fontSize: 13, color: "#667085" }}
            >
              USD {item.price.toFixed(2)} / unit{" "}
              {item.isPrescriptionRequired && (
                <span
                  className="cart-rx-pill"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#b91c1c",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    marginLeft: 8,
                    verticalAlign: "middle",
                  }}
                >
                  RX Required
                </span>
              )}
            </p>
          </div>
        </div>

        <div
          className="cart-quantity-cell"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            className="quantity-stepper"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #d0d5dd",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <button
              type="button"
              className="step-btn step-down"
              onClick={() => changeQuantity(-1)}
              aria-label="Decrease quantity"
              style={{
                border: "none",
                background: "none",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              -
            </button>
            <span
              className="qty-number"
              style={{ fontWeight: 600, padding: "0 4px" }}
            >
              {String(item.quantity).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="step-btn step-up"
              onClick={() => changeQuantity(1)}
              aria-label="Increase quantity"
              style={{
                border: "none",
                background: "none",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="btn-remove-item"
            aria-label="Remove Item"
            onClick={handleRemove}
            style={{
              background: "none",
              border: "none",
              color: "#98a2b3",
              cursor: "pointer",
              padding: 6,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        <div className="cart-total-cell" style={{ textAlign: "right" }}>
          <span
            className="row-total-price"
            style={{ fontSize: 16, fontWeight: 700, color: "#03231c" }}
          >
            USD {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="cart-row-actions">
        <button
          type="button"
          className="btn-row-request btn-request-product"
          onClick={() => openRequestModal(item.productId)}
        >
          <span>Request Product</span>
          <div className="action-btn-circle">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </button>

        <div className="cart-verify-input-wrap">
          <input
            type="text"
            className="cart-verify-input"
            value={codeInput}
            placeholder="Verification Code"
            autoComplete="off"
            disabled={isVerified}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleVerify();
            }}
          />
          <button
            type="button"
            className="btn-row-verify"
            disabled={isVerified}
            aria-label="Verify Code"
            onClick={handleVerify}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="btn-row-checkout"
          disabled={!isVerified}
          onClick={() => onCheckout(item.productId)}
        >
          <span>Checkout Item</span>
          <div className="action-btn-circle">
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
        </button>
      </div>

      <div
        className={`verification-status-label status-${status.tone}`}
        style={{ marginTop: 10, fontSize: 12, fontWeight: 600 }}
      >
        {status.text}
      </div>
    </div>
  );
}
