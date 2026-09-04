"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { ROUTES } from "@/lib/routes";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  productId: "",
  orderId: "",
};

export default function OrderLookupForm() {
  const { session, hydrated, openModal } = useAuth();
  const { orders } = useStore();
  const params = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  // Prefill from the checkout redirect, then from the signed-in profile.
  useEffect(() => {
    const paramOrderId = params.get("orderId") ?? "";
    const paramProductId = params.get("productId") ?? "";
    const paramEmail = params.get("email") ?? "";
    const [first = "", last = ""] = (session.userName ?? "").split(" ");

    setForm((current) => ({
      ...current,
      orderId: paramOrderId || current.orderId,
      productId: paramProductId || current.productId,
      email: paramEmail || session.userEmail || current.email,
      firstName: current.firstName || first,
      lastName: current.lastName || last,
    }));
  }, [params, session.userName, session.userEmail]);

  const update = (field: keyof typeof EMPTY, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleTrack = () => {
    setError("");
    const orderId = form.orderId.trim();
    const productId = form.productId.trim();
    const email = form.email.trim();

    if (!orderId || !productId || !email) {
      setError(
        "Please fill in all required fields (Order ID, Product ID, and Email)."
      );
      return;
    }

    const match = orders.find(
      (o) =>
        o.orderId.toLowerCase() === orderId.toLowerCase() &&
        o.productId.toLowerCase() === productId.toLowerCase() &&
        o.userEmail.toLowerCase() === email.toLowerCase()
    );

    if (match) {
      router.push(`${ROUTES.orderTrack}?orderId=${match.orderId}`);
    } else {
      setError(
        "No matching order found. Please check your Order ID, Product ID, and Email Address."
      );
    }
  };

  return (
    <section className="order-track-section">
      <div className="track-bg-gradient-wash" />

      <div className="container track-layout-grid">
        <div className="track-info-left">
          <DiscoverTag />
          <h1 className="track-main-heading">
            Fill Out The Form To
            <br />
            Track Your Order
          </h1>
        </div>

        <div className="track-form-right">
          {hydrated && !session.isLoggedIn ? (
            <div
              style={{
                background: "rgba(3, 35, 28, 0.03)",
                border: "1px dashed #03231c",
                borderRadius: 20,
                padding: 40,
                textAlign: "center",
                color: "#03231c",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "rgba(3, 35, 28, 0.06)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Authentication Required
              </h3>
              <p
                style={{
                  color: "#667085",
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                You must be signed in to your patient account to access the
                order tracking form.
              </p>
              <button
                type="button"
                className="auth-submit-btn"
                style={{
                  display: "inline-flex",
                  width: "auto",
                  padding: "12px 30px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => openModal("login")}
              >
                <span>Sign In to Account</span>
                <div className="submit-arrow-badge" style={{ marginLeft: 8 }}>
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
            </div>
          ) : (
            <form
              className="premium-track-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleTrack();
              }}
            >
              <div
                className="auth-error-banner"
                style={{
                  display: error ? "block" : "none",
                  marginBottom: 20,
                }}
              >
                {error}
              </div>

              <div className="track-form-row-split-2">
                <div className="track-floating-group">
                  <input
                    type="text"
                    id="track-first-name"
                    className="track-input-field"
                    placeholder=" "
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                  />
                  <label htmlFor="track-first-name" className="track-field-label">
                    First Name <span className="required-asterisk">*</span>
                  </label>
                </div>
                <div className="track-floating-group">
                  <input
                    type="text"
                    id="track-last-name"
                    className="track-input-field"
                    placeholder=" "
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                  <label htmlFor="track-last-name" className="track-field-label">
                    Last Name
                  </label>
                </div>
              </div>

              <div className="track-floating-group">
                <input
                  type="email"
                  id="track-email"
                  className="track-input-field"
                  placeholder=" "
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                <label htmlFor="track-email" className="track-field-label">
                  E-mail Address <span className="required-asterisk">*</span>
                </label>
              </div>

              <div className="track-floating-group">
                <input
                  type="tel"
                  id="track-phone"
                  className="track-input-field"
                  placeholder=" "
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
                <label htmlFor="track-phone" className="track-field-label">
                  Phone No <span className="required-asterisk">*</span>
                </label>
              </div>

              <div className="track-floating-group">
                <input
                  type="text"
                  id="track-product-id"
                  className="track-input-field"
                  placeholder=" "
                  required
                  value={form.productId}
                  onChange={(e) => update("productId", e.target.value)}
                />
                <label htmlFor="track-product-id" className="track-field-label">
                  Product ID <span className="required-asterisk">*</span>
                </label>
              </div>

              <div className="track-floating-group">
                <input
                  type="text"
                  id="track-order-id"
                  className="track-input-field"
                  placeholder=" "
                  required
                  value={form.orderId}
                  onChange={(e) => update("orderId", e.target.value)}
                />
                <label htmlFor="track-order-id" className="track-field-label">
                  Order ID <span className="required-asterisk">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-track-submit"
                style={{ border: "none", cursor: "pointer" }}
              >
                <span>Track Order</span>
                <div className="track-arrow-circle-badge">
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
