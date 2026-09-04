"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CartRow from "@/components/cart/CartRow";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { useUi } from "@/context/UiProvider";
import { removeLocal, STORAGE_KEYS, writeLocal } from "@/lib/storage";
import { ROUTES } from "@/lib/routes";
import type { PendingCheckout, Voucher } from "@/lib/types";

export default function CartView() {
  const { cart, vouchers } = useStore();
  const { session } = useAuth();
  const { notify } = useUi();
  const router = useRouter();

  // productId -> the coverage code that unlocked checkout for that row.
  const [verified, setVerified] = useState<Record<string, string>>({});

  const isUsable = useCallback(
    (voucher: Voucher) =>
      voucher.status === "active" &&
      (!voucher.expiresAt || Date.now() < voucher.expiresAt) &&
      !voucher.isUsed,
    []
  );

  // Rows whose code was already approved for this account unlock on load.
  useEffect(() => {
    if (!session.isLoggedIn) {
      setVerified({});
      return;
    }
    setVerified((current) => {
      const next = { ...current };
      let changed = false;
      cart.forEach((item) => {
        if (next[item.productId]) return;
        const match = vouchers.find(
          (v) =>
            v.productId === item.productId &&
            v.userId === session.userId &&
            isUsable(v)
        );
        if (match) {
          next[item.productId] = match.code;
          changed = true;
        }
      });
      return changed ? next : current;
    });
  }, [cart, vouchers, session.isLoggedIn, session.userId, isUsable]);

  const verify = useCallback(
    (productId: string, rawCode: string): { ok: boolean; message: string } => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return { ok: false, message: "Please enter a code." };
      if (!session.isLoggedIn) {
        return {
          ok: false,
          message: "⚠ You must be logged in to verify code.",
        };
      }

      const voucher = vouchers.find((v) => v.code?.toUpperCase() === code);
      if (!voucher) return { ok: false, message: "✕ Code does not exist." };
      if (
        voucher.status === "expired" ||
        (voucher.expiresAt && Date.now() > voucher.expiresAt)
      ) {
        return { ok: false, message: "✕ Code has expired." };
      }
      if (voucher.status === "used" || voucher.isUsed) {
        return { ok: false, message: "✕ Code has already been used." };
      }
      if (voucher.productId !== productId) {
        return { ok: false, message: "✕ Code is not valid for this product." };
      }
      if (voucher.userId !== session.userId) {
        return {
          ok: false,
          message: "✕ Code does not belong to your account.",
        };
      }

      setVerified((current) => ({ ...current, [productId]: code }));
      return { ok: true, message: "✓ Code verified! Ready to check out." };
    },
    [vouchers, session]
  );

  /** Changing quantity invalidates a verified code, as in the theme. */
  const clearVerification = useCallback((productId: string) => {
    setVerified((current) => {
      if (!current[productId]) return current;
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const checkoutRow = useCallback(
    (productId: string) => {
      const code = verified[productId];
      const item = cart.find((i) => i.productId === productId);
      if (!code || !item) return;

      const pending: PendingCheckout = {
        confirmationCode: code,
        productId,
        productName: item.name,
        items: [item],
        totalProducts: item.quantity,
        totalPrice: (item.price * item.quantity).toFixed(2),
      };

      // Clear any stale success state before starting a new checkout.
      removeLocal(
        STORAGE_KEYS.orderPlacedSuccess,
        STORAGE_KEYS.placedOrderId,
        STORAGE_KEYS.placedProductId,
        STORAGE_KEYS.placedEmail,
        STORAGE_KEYS.placedUserId
      );
      writeLocal(STORAGE_KEYS.pendingCheckout, pending);

      notify("Proceeding to checkout...");
      setTimeout(() => router.push(ROUTES.checkout), 800);
    },
    [verified, cart, notify, router]
  );

  return (
    <section className="shopping-cart-section">
      <div className="cart-bg-gradient-wash" />

      <div className="container cart-layout-grid">
        <div className="cart-left-panel">
          <DiscoverTag />
          <h1 className="cart-main-title">
            Items Currently In Your
            <br />
            Shopping Cart
          </h1>

          <div className="cart-table-header">
            <span className="hdr-product">Your Product</span>
            <span className="hdr-quantity" style={{ textAlign: "center" }}>
              Quantity
            </span>
            <span className="hdr-total" style={{ textAlign: "right" }}>
              Total
            </span>
          </div>

          <div className="cart-items-slider-container">
            <div id="cart-items-target">
              {cart.length === 0 ? (
                <div
                  className="cart-empty-state"
                  style={{ textAlign: "center", padding: "48px 24px" }}
                >
                  <div className="cart-empty-icon">
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <h3
                    className="cart-empty-title"
                    style={{ fontSize: 20, fontWeight: 700, color: "#03231c" }}
                  >
                    Your cart is empty
                  </h3>
                  <p
                    className="cart-empty-sub"
                    style={{ color: "#667085", margin: "8px 0 24px" }}
                  >
                    Browse our catalog and add medical equipment to your cart.
                  </p>
                  <Link
                    href={ROUTES.shop}
                    className="btn-continue-shopping"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span className="arrow-back">←</span>
                    <span>Browse Products</span>
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <CartRow
                    key={item.productId}
                    item={item}
                    verifiedCode={verified[item.productId] ?? ""}
                    onVerify={verify}
                    onQuantityChange={clearVerification}
                    onCheckout={checkoutRow}
                  />
                ))
              )}
            </div>
          </div>

          <div className="cart-actions-footer">
            <Link href={ROUTES.shop} className="btn-continue-shopping">
              <span className="arrow-back">←</span>
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
