"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useStore } from "@/context/StoreProvider";
import { assetSrc, PRODUCT_IMAGE_FALLBACK, ROUTES } from "@/lib/routes";
import type { CartItem } from "@/lib/types";

type Stage = "processing" | "on its way" | "delivered";

const NODES: { caption: string; icon: React.ReactNode }[] = [
  {
    caption: "Processing",
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  },
  {
    caption: "On It's Way",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    caption: "Delivered",
    icon: (
      <>
        <path d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </>
    ),
  },
];

/** Stage and fill percentage derived from time elapsed, as in the theme. */
function stageFor(timestamp: string): { stage: Stage; completed: number; fill: string } {
  const elapsedHours =
    (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
  if (elapsedHours > 96)
    return { stage: "delivered", completed: 3, fill: "100%" };
  if (elapsedHours > 48)
    return { stage: "on its way", completed: 2, fill: "50%" };
  return { stage: "processing", completed: 1, fill: "0%" };
}

function ItemImage({ item }: { item: CartItem }) {
  const [src, setSrc] = useState(assetSrc(item.image));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={item.name}
      className="status-row-item-img"
      onError={() => setSrc(PRODUCT_IMAGE_FALLBACK)}
    />
  );
}

export default function OrderTrackView() {
  const params = useSearchParams();
  const router = useRouter();
  const { orders, synced } = useStore();

  const orderId = params.get("orderId");

  const order = useMemo(
    () =>
      orderId
        ? orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase())
        : undefined,
    [orders, orderId]
  );

  // Send the visitor back to the lookup form when there is nothing to show —
  // but only once the server sync has settled, so a slow load is not a miss.
  useEffect(() => {
    if (!orderId) {
      router.replace(ROUTES.orderForm);
      return;
    }
    if (synced && !order) router.replace(ROUTES.orderForm);
  }, [orderId, order, synced, router]);

  if (!order) {
    return (
      <section className="order-status-section">
        <div className="container">
          <div className="status-header-block">
            <h1 className="status-main-heading">
              {synced ? "Order not found" : "Loading order…"}
            </h1>
          </div>
        </div>
      </section>
    );
  }

  const { stage, completed, fill } = stageFor(order.timestamp || order.orderDate);

  const items: CartItem[] =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            productId: order.productId,
            name: order.productName,
            price: Number(order.totalPrice) / (order.totalProducts || 1),
            image: PRODUCT_IMAGE_FALLBACK,
            quantity: order.totalProducts || 1,
            hcpcsCode: "",
            isPrescriptionRequired: false,
          },
        ];

  const { city, state } = order.shippingDetails;

  return (
    <section className="order-status-section">
      <div className="container">
        <div className="status-header-block">
          <DiscoverTag emerald />
          <h1 className="status-main-heading">
            Order Status: {stage.toUpperCase()}
            <br />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#667085",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ID: {order.orderId}
            </span>
          </h1>
        </div>

        <div className="status-progress-timeline-wrapper">
          <div className="timeline-track-rail">
            <div
              className="timeline-fill-bar-progress"
              style={{ width: fill }}
            />
          </div>

          <div className="timeline-nodes-delivery-container">
            {NODES.map((node, index) => (
              <div
                key={node.caption}
                className={`status-timeline-node ${
                  index < completed ? "completed-step" : "pending-step"
                }`}
              >
                <div className="node-icon-circle-badge">
                  <svg
                    className="checkmark-svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    className="hover-pulse-icon-svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {node.icon}
                  </svg>
                </div>
                <span className="node-caption-label">{node.caption}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="status-content-layout-grid">
          <div className="status-left-panel">
            <div className="status-table-headers-row">
              <span className="th-col-prod">Your Product</span>
              <span className="th-col-qty">Quantity</span>
              <span className="th-col-tot">Total</span>
            </div>

            <div className="status-products-listing-deck">
              {items.map((item, index) => (
                <div
                  className="status-product-item-row"
                  key={`${item.productId}-${index}`}
                >
                  <div className="status-product-meta-cell">
                    <ItemImage item={item} />
                    <div className="status-product-text">
                      <h3>{item.name}</h3>
                      <p className="status-row-unit-price">
                        USD {Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="status-quantity-meta-cell">
                    <div className="status-static-qty-pill">
                      {String(item.quantity).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="status-total-meta-cell">
                    <span className="status-row-total-val">
                      USD {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="status-supplementary-grid-cards">
              <div className="status-data-card-info-box">
                <div className="info-box-header">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <h3>Personal Details</h3>
                </div>
                <ul className="info-box-data-list">
                  <li>
                    <span className="lbl-dim">Name:</span>{" "}
                    {order.personalDetails?.fullName || order.userName || "—"}
                  </li>
                  <li>
                    <span className="lbl-dim">Email:</span>{" "}
                    {order.personalDetails?.email || order.userEmail || "—"}
                  </li>
                  <li>
                    <span className="lbl-dim">Phone:</span>{" "}
                    {order.personalDetails?.phone || "—"}
                  </li>
                </ul>
              </div>

              <div className="status-data-card-info-box">
                <div className="info-box-header">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h3>Delivery Details</h3>
                </div>
                <ul className="info-box-data-list">
                  <li>
                    <span className="lbl-dim">Address:</span>{" "}
                    {order.shippingDetails?.streetAddress || "—"}
                  </li>
                  <li>
                    <span className="lbl-dim">City/State:</span> {city}
                    {city && state ? ", " : ""}
                    {state}
                  </li>
                  <li>
                    <span className="lbl-dim">ZIP Code:</span>{" "}
                    {order.shippingDetails?.zipCode || "—"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="status-right-panel-sidebar">
            <div className="status-sticky-total-widget">
              <div className="status-total-row-item border-thick">
                <span className="status-summary-label">TOTAL AMOUNT:</span>
                <span className="status-summary-value">
                  USD {Number(order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
              <p className="status-summary-disclaimer">
                All prices include taxes. Shipping and final charges will be
                calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
