"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { useUi } from "@/context/UiProvider";
import { ROUTES } from "@/lib/routes";
import { readLocal, removeLocal, STORAGE_KEYS } from "@/lib/storage";
import type { Order, PendingCheckout, PlacedOrderReceipt } from "@/lib/types";

type StepId = "personal" | "shipping";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
};

const SUCCESS_KEYS = [
  STORAGE_KEYS.orderPlacedSuccess,
  STORAGE_KEYS.placedOrderId,
  STORAGE_KEYS.placedProductId,
  STORAGE_KEYS.placedEmail,
  STORAGE_KEYS.placedUserId,
];

export default function CheckoutView() {
  const { session } = useAuth();
  const {
    addPlacedOrder,
    deductInventory,
    updateVoucherStatus,
    requests,
    removeRequestedOrder,
    removeFromCart,
  } = useStore();
  const { notify } = useUi();
  const router = useRouter();

  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [openStep, setOpenStep] = useState<StepId>("personal");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PlacedOrderReceipt | null>(null);

  const personalRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<StepId, HTMLDivElement | null>>({
    personal: null,
    shipping: null,
  });

  useEffect(() => {
    // An order placed just before a reload resumes straight at the receipt.
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEYS.orderPlacedSuccess) === "true"
    ) {
      setReceipt({
        orderId: window.localStorage.getItem(STORAGE_KEYS.placedOrderId) ?? "",
        productId:
          window.localStorage.getItem(STORAGE_KEYS.placedProductId) ?? "",
        email: window.localStorage.getItem(STORAGE_KEYS.placedEmail) ?? "",
        userId:
          window.localStorage.getItem(STORAGE_KEYS.placedUserId) ?? "guest",
      });
      return;
    }
    setPending(readLocal<PendingCheckout | null>(STORAGE_KEYS.pendingCheckout, null));
  }, []);

  // Prefill from the signed-in account.
  useEffect(() => {
    setForm((current) => ({
      ...current,
      fullName: current.fullName || session.userName || "",
      email: current.email || session.userEmail || "",
    }));
  }, [session.userName, session.userEmail]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const locked = processing || receipt !== null;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [processing, receipt]);

  const update = (field: keyof typeof EMPTY_FORM, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const openAndScroll = (step: StepId) => {
    setOpenStep(step);
    const target = step === "personal" ? personalRef : shippingRef;
    if (target.current) {
      window.scrollTo({
        top: target.current.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      });
    }
  };

  const clearSuccessState = () => removeLocal(...SUCCESS_KEYS);

  const handleConfirm = () => {
    const { fullName, email, phone, street, city, state, zip } = form;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      openAndScroll("personal");
      notify("Please fill in all Personal Details.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      openAndScroll("personal");
      notify("Please enter a valid Email Address.");
      return;
    }
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      openAndScroll("shipping");
      notify("Please fill in all Shipping Address details.");
      return;
    }

    setProcessing(true);

    const orderId = `ORD-${Date.now()}`;
    const now = new Date().toISOString();
    const productId = pending?.productId ?? "";
    const items = pending?.items ?? [];
    const itemQty = items[0]?.quantity ?? 1;
    const confirmationCode = pending?.confirmationCode ?? "";
    const userId = session.userId || "guest";

    const order: Order = {
      orderId,
      orderDate: now,
      timestamp: now,
      confirmationCode,
      productId,
      productName: pending?.productName ?? "",
      items,
      totalProducts: pending?.totalProducts ?? 1,
      totalPrice: pending?.totalPrice ?? 0,
      personalDetails: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      shippingDetails: {
        streetAddress: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zip.trim(),
      },
      paymentDetails: {
        method: "insurance",
        billingSameAsShipping: true,
        billingAddress: "",
      },
      userEmail: email.trim(),
      userId,
      userName: fullName.trim(),
    };

    // Success state is written first so a reload mid-flight still lands on the
    // receipt rather than an empty checkout. These are plain strings, not JSON,
    // matching what the theme wrote and what the reader above expects.
    window.localStorage.setItem(STORAGE_KEYS.orderPlacedSuccess, "true");
    window.localStorage.setItem(STORAGE_KEYS.placedOrderId, orderId);
    window.localStorage.setItem(STORAGE_KEYS.placedProductId, productId);
    window.localStorage.setItem(STORAGE_KEYS.placedEmail, email.trim());
    window.localStorage.setItem(STORAGE_KEYS.placedUserId, userId);
    removeLocal(STORAGE_KEYS.pendingCheckout);

    addPlacedOrder(order);
    if (productId) {
      deductInventory(productId, itemQty);
      removeFromCart(productId);
    }
    if (confirmationCode) updateVoucherStatus(confirmationCode, "used");

    const granted = requests.find(
      (r) => r.productId === productId && r.status === "granted"
    );
    if (granted) removeRequestedOrder(granted.requestId);

    setTimeout(() => {
      setProcessing(false);
      setReceipt({ orderId, productId, email: email.trim(), userId });
    }, 1500);
  };

  const itemsCount = pending?.totalProducts ?? 0;
  const price = Number(pending?.totalPrice ?? 0).toFixed(2);

  const steps: { id: StepId; num: string; title: string }[] = [
    { id: "personal", num: "01", title: "Personal Details" },
    { id: "shipping", num: "02", title: "Shipping Address" },
  ];

  return (
    <>
      <section className="checkout-page-section">
        <div className="checkout-bg-gradient-wash" />

        <div className="container checkout-layout-grid">
          <div className="checkout-left-panel">
            <DiscoverTag />
            <h1 className="checkout-main-title">Secure Checkout Platform</h1>

            <div className="checkout-accordion-group">
              {steps.map((step) => {
                const isOpen = openStep === step.id;
                return (
                  <div
                    key={step.id}
                    className={`checkout-acc-item${isOpen ? " active" : ""}`}
                    id={`step-${step.id}`}
                    ref={step.id === "personal" ? personalRef : shippingRef}
                  >
                    <button
                      type="button"
                      className="checkout-acc-trigger"
                      onClick={() => setOpenStep(step.id)}
                    >
                      <span className="acc-step-num">{step.num}</span>
                      <span className="acc-step-title">{step.title}</span>
                      <span className="acc-status-icon" />
                    </button>
                    <div
                      className="checkout-acc-panel"
                      ref={(el) => {
                        panelRefs.current[step.id] = el;
                      }}
                      style={{
                        maxHeight: isOpen
                          ? `${panelRefs.current[step.id]?.scrollHeight ?? 600}px`
                          : "0px",
                      }}
                    >
                      {step.id === "personal" ? (
                        <div className="checkout-form-grid">
                          <div className="floating-input-group">
                            <input
                              type="text"
                              id="checkout-full-name"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.fullName}
                              onChange={(e) =>
                                update("fullName", e.target.value)
                              }
                            />
                            <label className="checkout-field-label">
                              Full Name{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                          <div className="floating-input-group">
                            <input
                              type="email"
                              id="checkout-email"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              Email Address{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                          <div className="floating-input-group">
                            <input
                              type="tel"
                              id="checkout-phone"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.phone}
                              onChange={(e) => update("phone", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              Phone Number{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="checkout-form-grid">
                          <div className="floating-input-group full-width">
                            <input
                              type="text"
                              id="checkout-street"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.street}
                              onChange={(e) => update("street", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              Street Address{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                          <div className="floating-input-group">
                            <input
                              type="text"
                              id="checkout-city"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.city}
                              onChange={(e) => update("city", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              City <span className="required-asterisk">*</span>
                            </label>
                          </div>
                          <div className="floating-input-group">
                            <input
                              type="text"
                              id="checkout-state"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.state}
                              onChange={(e) => update("state", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              State / Province{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                          <div className="floating-input-group">
                            <input
                              type="text"
                              id="checkout-zip"
                              className="checkout-input-field"
                              placeholder=" "
                              required
                              value={form.zip}
                              onChange={(e) => update("zip", e.target.value)}
                            />
                            <label className="checkout-field-label">
                              Postal / ZIP Code{" "}
                              <span className="required-asterisk">*</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="checkout-actions-footer">
              <Link href={ROUTES.cart} className="btn-checkout-back">
                <span className="arrow-back">←</span>
                <span>Back To Shopping Cart</span>
              </Link>
            </div>
          </div>

          <div className="checkout-summary-sidebar">
            <div className="summary-wrapper-card">
              <div className="summary-box-inner" id="checkout-summary-target">
                <h3 className="summary-box-title">Order Summary</h3>
                {pending && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#667085",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 12,
                      background: "rgba(3, 35, 28, 0.04)",
                      padding: "8px 12px",
                      borderRadius: 6,
                      borderLeft: "3px solid #03231c",
                    }}
                  >
                    Item: {pending.productName}
                  </div>
                )}
                <div className="summary-line-item">
                  <span>
                    Subtotal ({itemsCount} {itemsCount === 1 ? "Unit" : "Units"})
                  </span>
                  <span className="weight-bold">USD {price}</span>
                </div>
                <div className="summary-line-item">
                  <span>Shipping Fees</span>
                  <span className="text-emerald" style={{ fontWeight: 700 }}>
                    FREE
                  </span>
                </div>
                {pending && (
                  <div className="summary-line-item">
                    <span>Coverage Code</span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "#03231c",
                      }}
                    >
                      {pending.confirmationCode || "—"}
                    </span>
                  </div>
                )}
                <div className="summary-line-item border-thick mt-2">
                  <span className="total-label">ESTIMATED TOTAL:</span>
                  <span className="total-val">USD {price}</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-confirm-order"
                className="btn-confirm-order mt-3"
                style={{ border: "none", cursor: "pointer" }}
                onClick={handleConfirm}
              >
                <span>Confirm Order</span>
                <div className="confirm-arrow-badge">
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
          </div>
        </div>
      </section>

      {processing && <ProcessingModal />}
      {receipt && (
        <ThankYouModal
          receipt={receipt}
          onTrack={() => {
            clearSuccessState();
            router.push(
              `${ROUTES.orderForm}?orderId=${receipt.orderId}&productId=${receipt.productId}&email=${encodeURIComponent(receipt.email)}`
            );
          }}
          onContinue={() => {
            clearSuccessState();
            router.push(ROUTES.shop);
          }}
        />
      )}
    </>
  );
}

function ProcessingModal() {
  return (
    <div className="auth-modal-overlay modal-active" id="checkout-loading-modal">
      <div
        className="auth-modal-card"
        style={{
          maxWidth: 400,
          textAlign: "center",
          padding: "40px 30px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(3, 35, 28, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          color: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="loading-spinner-circle"
          style={{
            width: 60,
            height: 60,
            border: "4px solid rgba(255,255,255,0.1)",
            borderTopColor: "#4ade80",
            borderRadius: "50%",
            animation: "spin-loading-circle 1s linear infinite",
            margin: "0 auto 24px",
          }}
        />
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Processing Order
        </h2>
        <p style={{ color: "#98a2b3", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
          Please wait while we verify your insurance eligibility and submit your
          order details...
        </p>
      </div>
      <style>{`@keyframes spin-loading-circle { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ThankYouModal({
  receipt,
  onTrack,
  onContinue,
}: {
  receipt: PlacedOrderReceipt;
  onTrack: () => void;
  onContinue: () => void;
}) {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 8,
  };
  const labelStyle: React.CSSProperties = {
    color: "#98a2b3",
    fontWeight: 500,
  };

  return (
    <div
      className="auth-modal-overlay modal-active"
      id="checkout-thankyou-modal"
    >
      <div
        className="auth-modal-card"
        style={{
          maxWidth: 500,
          textAlign: "center",
          padding: "40px 30px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(3, 35, 28, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          color: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            background: "rgba(34, 197, 94, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            color: "#4ade80",
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          Thank You for Your Order!
        </h2>
        <p
          style={{
            color: "#98a2b3",
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          Your order has been placed successfully. Please save the details below
          to track your shipment status.
        </p>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 18,
            textAlign: "left",
            marginBottom: 28,
            fontSize: 13,
          }}
        >
          <div style={rowStyle}>
            <span style={labelStyle}>Order ID:</span>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#4ade80",
              }}
            >
              {receipt.orderId}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>User ID:</span>
            <span
              style={{ fontFamily: "monospace", fontWeight: 700, color: "#fff" }}
            >
              {receipt.userId}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Product ID:</span>
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#4ade80",
              }}
            >
              {receipt.productId}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={labelStyle}>Tracking Email:</span>
            <span style={{ fontWeight: 700, color: "#fff" }}>
              {receipt.email}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            className="auth-submit-btn"
            style={{ width: "100%", border: "none", cursor: "pointer" }}
            onClick={onTrack}
          >
            <span>Track Order Now</span>
            <div className="submit-arrow-badge">
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
            onClick={onContinue}
            style={{
              color: "#98a2b3",
              fontSize: 13,
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
