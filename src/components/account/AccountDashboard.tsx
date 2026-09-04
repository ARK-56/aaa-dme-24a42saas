"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { ROUTES } from "@/lib/routes";

type RequestFilter = "all" | "declined";

function formatDate(value: string | number | undefined): string {
  const date = new Date(value ?? Date.now());
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Shipping status derived from elapsed time, exactly as the theme did. */
function orderStatus(timestamp: string): { text: string; className: string } {
  const elapsedHours =
    (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
  if (elapsedHours > 96)
    return { text: "Delivered", className: "myacct-badge-green" };
  if (elapsedHours > 48)
    return { text: "On its way", className: "myacct-badge-blue" };
  return { text: "Processing", className: "myacct-badge-amber" };
}

function requestStatus(status: string | undefined): {
  text: string;
  className: string;
} {
  const value = (status ?? "").toLowerCase();
  if (value === "granted" || value === "approved")
    return { text: "Approved", className: "myacct-badge-green" };
  if (value === "declined")
    return { text: "Declined", className: "myacct-badge-red" };
  return { text: "Pending", className: "myacct-badge-amber" };
}

export default function AccountDashboard({
  initialFilter = "all",
}: {
  initialFilter?: RequestFilter;
}) {
  const { session } = useAuth();
  const { orders, requests } = useStore();
  const [filter, setFilter] = useState<RequestFilter>(initialFilter);

  const myOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.userId === session.userId || o.userEmail === session.userEmail
      ),
    [orders, session.userId, session.userEmail]
  );

  const myRequests = useMemo(() => {
    // Records are matched by email or by the userId some of them carry.
    const mine = requests.filter(
      (r) =>
        (r.email &&
          session.userEmail &&
          r.email.toLowerCase() === session.userEmail.toLowerCase()) ||
        (r.userId && r.userId === session.userId)
    );
    return filter === "declined"
      ? mine.filter((r) => (r.status ?? "").toLowerCase() === "declined")
      : mine;
  }, [requests, session.userEmail, session.userId, filter]);

  if (!session.isLoggedIn) return null;

  return (
    <section className="myacct-section" id="myacct-section">
      <div className="container">
        <div className="myacct-block">
          <h2 className="myacct-heading">My Orders</h2>
          <div className="myacct-list">
            {myOrders.length === 0 ? (
              <div className="myacct-empty">
                You have not placed any orders yet.
              </div>
            ) : (
              myOrders.map((order) => {
                const status = orderStatus(order.timestamp || order.orderDate);
                return (
                  <div className="myacct-row" key={order.orderId}>
                    <div>
                      <div className="myacct-row-title">
                        {order.productName ||
                          order.items?.[0]?.name ||
                          "Medical Product"}
                      </div>
                      <div className="myacct-row-sub">
                        Order ID:{" "}
                        <span style={{ fontFamily: "monospace" }}>
                          {order.orderId}
                        </span>{" "}
                        • {formatDate(order.timestamp || order.orderDate)}
                      </div>
                    </div>
                    <div className="myacct-row-meta">
                      <span className="myacct-row-total">
                        USD {Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                      <span className={`myacct-badge ${status.className}`}>
                        {status.text}
                      </span>
                      <Link
                        href={`${ROUTES.orderTrack}?orderId=${order.orderId}`}
                        className="myacct-track-link"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="myacct-block" id="myacct-requests-block">
          <div className="myacct-block-header">
            <h2 className="myacct-heading">My Coverage Requests</h2>
            <div className="myacct-tabs">
              <button
                type="button"
                className={`myacct-tab${filter === "all" ? " active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`myacct-tab${filter === "declined" ? " active" : ""}`}
                onClick={() => setFilter("declined")}
              >
                Declined
              </button>
            </div>
          </div>
          <div className="myacct-list">
            {myRequests.length === 0 ? (
              <div className="myacct-empty">No coverage requests found.</div>
            ) : (
              myRequests.map((request) => {
                const status = requestStatus(request.status);
                return (
                  <div className="myacct-row" key={request.requestId}>
                    <div>
                      <div className="myacct-row-title">
                        {request.productName || "Requested Product"}
                      </div>
                      <div className="myacct-row-sub">
                        Request ID:{" "}
                        <span style={{ fontFamily: "monospace" }}>
                          {request.requestId}
                        </span>{" "}
                        • {formatDate(request.timestamp)}
                      </div>
                    </div>
                    <div className="myacct-row-meta">
                      <span className={`myacct-badge ${status.className}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
