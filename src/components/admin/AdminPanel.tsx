"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AssignCodeModal from "@/components/admin/AssignCodeModal";
import CodeCopyModal from "@/components/admin/CodeCopyModal";
import ProductFormModal, { EMPTY_PRODUCT } from "@/components/admin/ProductFormModal";
import RequestDetailModal from "@/components/admin/RequestDetailModal";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/types";
import { assetSrc, productHref, ROUTES } from "@/lib/routes";
import type { CoverageRequest, Order, Product, Voucher } from "@/lib/types";

export const VOUCHER_TTL_MS = 24 * 60 * 60 * 1000;

type TabId = "products" | "requested" | "placed" | "users" | "vouchers";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "products",
    label: "Products",
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  {
    id: "requested",
    label: "Requested Orders",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    id: "placed",
    label: "Placed Orders",
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    id: "users",
    label: "Users",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    id: "vouchers",
    label: "Verification Codes",
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
];

/** "Mar 4, 2026, 06:15 PM" */
export function fmt(value: string | number | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "Mar 4, 2026" */
export function fmtDate(value: string | number | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function safe(value: string | undefined | null): string {
  return value || "—";
}

const EyeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function StatusBadge({ status }: { status: string | undefined }) {
  const value = (status ?? "").toLowerCase();
  if (value === "pending")
    return <span className="badge badge-amber">Pending</span>;
  if (value === "granted")
    return <span className="badge badge-green">Granted</span>;
  if (value === "declined")
    return <span className="badge badge-red">Declined</span>;
  return <span className="badge badge-gray">{status}</span>;
}

export default function AdminPanel() {
  const { session, isAdmin, hydrated, logout } = useAuth();
  const { products, requests, orders, vouchers, getProductById, refresh } =
    useStore();
  const supabase = getSupabaseBrowserClient();

  // Staff-only listing. RLS lets an admin read every profile; for anyone else
  // this simply comes back empty, so the tab is safe even if the page loads.
  const [users, setUsers] = useState<ProfileRow[]>([]);

  const [tab, setTab] = useState<TabId>("products");
  const [detailRequest, setDetailRequest] = useState<CoverageRequest | null>(
    null
  );
  const [assignRequest, setAssignRequest] = useState<CoverageRequest | null>(
    null
  );
  const [issuedEmail, setIssuedEmail] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Deletes a product. Orders reference products by id, so a delete can be
   * rejected by a foreign key; that is reported rather than swallowed.
   */
  const handleDeleteProduct = useCallback(
    async (product: Product) => {
      if (!supabase) return;
      const confirmed = window.confirm(
        `Delete "${product.name}"? This cannot be undone.`
      );
      if (!confirmed) return;

      setDeletingId(product.id);
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      setDeletingId(null);

      if (error) {
        window.alert(
          `Could not delete: ${error.message}\n\n` +
            `Products referenced by an existing order cannot be removed; ` +
            `mark it out of stock instead.`
        );
        return;
      }
      await refresh();
    },
    [supabase, refresh]
  );

  useEffect(() => {
    if (!supabase || !isAdmin) return;
    let active = true;
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active) setUsers(data ?? []);
      });
    return () => {
      active = false;
    };
  }, [supabase, isAdmin]);

  // Sweep codes whose TTL lapsed. Postgres is the source of truth now, so this
  // writes the status back rather than only fixing it in memory.
  useEffect(() => {
    if (!supabase) return;
    const stale = vouchers.filter(
      (v) => v.status === "granted" && v.expiresAt && Date.now() > v.expiresAt
    );
    if (stale.length === 0) return;
    supabase
      .from("vouchers")
      .update({ status: "expired" })
      .in("code", stale.map((v) => v.code))
      .then(() => refresh());
  }, [vouchers, supabase, refresh]);

  const handleDecline = useCallback(
    async (requestId: string) => {
      if (!supabase) return;
      if (!window.confirm(`Are you sure you want to decline request ${requestId}?`)) {
        return;
      }
      const { error } = await supabase
        .from("coverage_requests")
        .update({ status: "declined" })
        .eq("request_ref", requestId);
      if (error) {
        window.alert(`Could not decline the request: ${error.message}`);
        return;
      }
      await refresh();
    },
    [supabase, refresh]
  );

  const handleAssign = useCallback(
    async (
      request: CoverageRequest,
      code: string,
      productId: string,
      userId: string
    ) => {
      if (!supabase) return;

      const { error: voucherError } = await supabase.from("vouchers").insert({
        code,
        product_id: productId,
        user_id: userId,
        request_id: null,
        expires_at: new Date(Date.now() + VOUCHER_TTL_MS).toISOString(),
      });

      if (voucherError) {
        window.alert(`Could not issue the code: ${voucherError.message}`);
        return;
      }

      const { error: statusError } = await supabase
        .from("coverage_requests")
        .update({ status: "granted" })
        .eq("request_ref", request.requestId);

      if (statusError) {
        window.alert(`Code issued, but the request status did not update: ${statusError.message}`);
      }

      await refresh();

      const product = getProductById(productId);
      const productName = product?.name || request.productName || "Device";
      setAssignRequest(null);
      setIssuedEmail(
        `Subject: Coverage Approved: Verification Code for ${productName}

Dear ${request.fullName || "Patient"},

We are pleased to inform you that your insurance coverage request for the ${productName} has been approved.

Your verification code is: ${code}

This code is valid for 24 hours. Please enter this code in your cart field under this product to proceed with checkout.

Best regards,
AAA DME Medical Supply Care Team`
      );
    },
    [supabase, refresh, getProductById]
  );

  const counts = useMemo(
    () => ({
      products: products.length,
      requested: requests.length,
      placed: orders.length,
      users: users.length,
      vouchers: vouchers.length,
    }),
    [products, requests, orders, users, vouchers]
  );

  const tabCounts: Record<TabId, number> = {
    products: counts.products,
    requested: counts.requested,
    placed: counts.placed,
    users: counts.users,
    vouchers: counts.vouchers,
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link href={ROUTES.home} className="admin-logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/images/logo-color.png"
              alt="AAA DME"
              className="admin-logo-img"
            />
          </Link>
          <div className="admin-topbar-right">
            <span className="admin-badge-pill">
              <span className="admin-badge-dot" />
              Admin Mode
            </span>
            <Link href={ROUTES.home} className="admin-nav-site-link">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="nav-link-text">Back to Site</span>
            </Link>
            <button type="button" className="admin-logout-btn" onClick={logout}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Session comes from localStorage, so nothing is decided until hydration. */}
      {!hydrated ? null : !session.isLoggedIn || !isAdmin ? (
        <div className="admin-access-denied">
          <div className="access-denied-card">
            <div className="access-denied-icon">
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2>Access Restricted</h2>
            <p>
              This panel is for authorised administrators only.
              <br />
              Please log in with your admin account.
            </p>
            <Link href={ROUTES.home} className="access-denied-btn">
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : (
        <main className="admin-main">
          <div className="admin-page-header">
            <div className="admin-page-header-inner">
              <div className="admin-page-title-block">
                <div className="admin-page-eyebrow">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Reporting &amp; Tracking Dashboard
                </div>
                <h1 className="admin-page-h1">Admin Panel</h1>
              </div>
              <div className="admin-summary-chips">
                {(
                  [
                    ["Products", counts.products],
                    ["Requests", counts.requested],
                    ["Orders", counts.placed],
                    ["Users", counts.users],
                    ["Vouchers", counts.vouchers],
                  ] as const
                ).map(([label, value]) => (
                  <div className="summary-chip" key={label}>
                    <span className="summary-chip-value">{value}</span>
                    <span className="summary-chip-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <nav className="admin-tabs-bar" aria-label="Admin sections">
            <div className="admin-tabs-inner">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-tab${tab === item.id ? " active" : ""}`}
                  onClick={() => setTab(item.id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {item.icon}
                  </svg>
                  {item.label}
                  <span className="tab-count">{tabCounts[item.id]}</span>
                </button>
              ))}
            </div>
          </nav>

          {tab === "products" && (
            <section className="admin-section active">
              <div className="admin-section-header">
                <div className="admin-section-title-row">
                  <h2 className="admin-section-title">Product Catalogue</h2>
                  <p className="admin-section-subtitle">
                    Add, edit and remove catalogue items. Images upload straight
                    to storage; the eye icon opens the public detail page.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-add-btn"
                  onClick={() => setEditProduct(EMPTY_PRODUCT)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Product
                </button>
              </div>
              <AdminTable<Product>
                rows={products}
                rowKey={(p) => p.id}
                searchPlaceholder="Search by name, ID, category…"
                emptyMessage="No products match your search."
                columns={[
                  { label: "#", className: "col-num" },
                  { label: "Product" },
                  { label: "Product ID", className: "col-id" },
                  { label: "Category" },
                  { label: "Price", className: "col-price" },
                  { label: "Stock", className: "col-stock" },
                  { label: "Actions", className: "col-action" },
                ]}
                filterFn={(p, q) =>
                  (p.name || "").toLowerCase().includes(q) ||
                  (p.id || "").toLowerCase().includes(q) ||
                  (p.category || "").toLowerCase().includes(q) ||
                  (p.hcpcsCode || "").toLowerCase().includes(q)
                }
                renderRow={(p, idx) => (
                  <>
                    <td className="col-num" style={{ color: "#98a1a9", fontSize: 12 }}>
                      {idx}
                    </td>
                    <td>
                      <div className="product-name-cell">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={assetSrc(p.image)}
                          alt={p.name}
                          className="product-thumb"
                        />
                        <span className="product-name-text">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="id-mono" title={p.id}>
                        {p.id.substring(0, 18)}…
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td className="col-price">
                      <span className="price-text">
                        ${p.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="col-stock">
                      <span style={{ fontWeight: 700, color: "#03231c" }}>
                        {p.inventory !== undefined ? p.inventory : 10}
                      </span>
                    </td>
                    <td className="col-action">
                      <div className="row-actions">
                        <Link
                          href={productHref(p.id)}
                          target="_blank"
                          className="btn-eye"
                          title="View Product"
                        >
                          <EyeIcon />
                        </Link>
                        <button
                          type="button"
                          className="btn-row-edit"
                          title="Edit Product"
                          onClick={() => setEditProduct(p)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="btn-row-delete"
                          title="Delete Product"
                          disabled={deletingId === p.id}
                          onClick={() => void handleDeleteProduct(p)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </>
                )}
              />
            </section>
          )}

          {tab === "requested" && (
            <section className="admin-section active">
              <div className="admin-section-header">
                <div className="admin-section-title-row">
                  <h2 className="admin-section-title">Requested Orders</h2>
                  <p className="admin-section-subtitle">
                    Medical intake requests submitted by users. Actions: View
                    details, assign code, or decline request.
                  </p>
                </div>
              </div>
              <AdminTable<CoverageRequest>
                rows={requests}
                rowKey={(r) => r.requestId}
                searchPlaceholder="Search by ID, name, product…"
                emptyMessage="No requested orders found."
                columns={[
                  { label: "#", className: "col-num" },
                  { label: "Request ID", className: "col-id" },
                  { label: "Submitted" },
                  { label: "Patient" },
                  { label: "Product" },
                  { label: "Status" },
                  { label: "Actions", className: "col-action" },
                ]}
                filterFn={(r, q) =>
                  (r.requestId || "").toLowerCase().includes(q) ||
                  (r.fullName || "").toLowerCase().includes(q) ||
                  (r.productName || "").toLowerCase().includes(q) ||
                  (r.email || "").toLowerCase().includes(q)
                }
                renderRow={(r, idx) => (
                  <>
                    <td className="col-num" style={{ color: "#98a1a9", fontSize: 12 }}>
                      {idx}
                    </td>
                    <td>
                      <span className="id-mono" title={r.requestId}>
                        {safe(r.requestId)}
                      </span>
                    </td>
                    <td>{fmtDate(r.timestamp)}</td>
                    <td>{safe(r.fullName)}</td>
                    <td>{safe(r.productName)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td
                      className="col-action"
                      style={{ whiteSpace: "nowrap", width: 140 }}
                    >
                      <button
                        type="button"
                        className="btn-eye"
                        title="View Details"
                        style={{ marginRight: 4 }}
                        onClick={() => setDetailRequest(r)}
                      >
                        <EyeIcon />
                      </button>
                      {r.status === "pending" && (
                        <>
                          <button
                            type="button"
                            className="btn-eye"
                            title="Assign Code"
                            style={{
                              marginRight: 4,
                              background: "rgba(34,197,94,0.08)",
                              color: "#15803d",
                              borderColor: "rgba(34,197,94,0.15)",
                            }}
                            onClick={() => setAssignRequest(r)}
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
                          <button
                            type="button"
                            className="btn-eye"
                            title="Decline Request"
                            style={{
                              background: "rgba(239,68,68,0.08)",
                              color: "#b91c1c",
                              borderColor: "rgba(239,68,68,0.15)",
                            }}
                            onClick={() => handleDecline(r.requestId)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </>
                      )}
                    </td>
                  </>
                )}
              />
            </section>
          )}

          {tab === "placed" && (
            <section className="admin-section active">
              <div className="admin-section-header">
                <div className="admin-section-title-row">
                  <h2 className="admin-section-title">Placed Orders</h2>
                  <p className="admin-section-subtitle">
                    Completed checkout transactions with full billing and product
                    details.
                  </p>
                </div>
              </div>
              <AdminTable<Order>
                rows={orders}
                rowKey={(o) => o.orderId}
                searchPlaceholder="Search by order ID, code, email…"
                emptyMessage="No placed orders found."
                columns={[
                  { label: "#", className: "col-num" },
                  { label: "Date" },
                  { label: "Confirmation" },
                  { label: "Order ID", className: "col-id" },
                  { label: "Items", className: "col-num" },
                  { label: "Total", className: "col-price" },
                  { label: "Status" },
                  { label: "User Email" },
                ]}
                filterFn={(o, q) =>
                  (o.orderId || "").toLowerCase().includes(q) ||
                  (o.confirmationCode || "").toLowerCase().includes(q) ||
                  (o.userEmail || "").toLowerCase().includes(q) ||
                  (o.productName || "").toLowerCase().includes(q)
                }
                renderRow={(o, idx) => {
                  const itemCount = Array.isArray(o.items)
                    ? o.items.length
                    : o.totalProducts || 1;
                  const elapsedHours =
                    (Date.now() -
                      new Date(o.timestamp || o.orderDate).getTime()) /
                    (1000 * 60 * 60);
                  const badge =
                    elapsedHours <= 48 ? (
                      <span className="badge badge-amber">Processing</span>
                    ) : elapsedHours <= 96 ? (
                      <span className="badge badge-blue">On It&apos;s Way</span>
                    ) : (
                      <span className="badge badge-green">Delivered</span>
                    );

                  return (
                    <>
                      <td
                        className="col-num"
                        style={{ color: "#98a1a9", fontSize: 12 }}
                      >
                        {idx}
                      </td>
                      <td>{fmtDate(o.timestamp || o.orderDate)}</td>
                      <td>
                        <code
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#03231c",
                          }}
                        >
                          {safe(o.confirmationCode)}
                        </code>
                      </td>
                      <td>
                        <span className="id-mono" title={o.orderId}>
                          {(o.orderId || "—").substring(0, 18)}
                          {o.orderId && o.orderId.length > 18 ? "…" : ""}
                        </span>
                        {o.productName && (
                          <>
                            <br />
                            <small style={{ color: "#667085" }}>
                              {o.productName}
                            </small>
                          </>
                        )}
                      </td>
                      <td className="col-num">{itemCount}</td>
                      <td className="col-price">
                        <span className="price-text">
                          {o.totalPrice
                            ? `$${Number(o.totalPrice).toFixed(2)}`
                            : "—"}
                        </span>
                      </td>
                      <td>{badge}</td>
                      <td>{safe(o.userEmail)}</td>
                    </>
                  );
                }}
              />
            </section>
          )}

          {tab === "users" && (
            <section className="admin-section active">
              <div className="admin-section-header">
                <div className="admin-section-title-row">
                  <h2 className="admin-section-title">Registered Users</h2>
                  <p className="admin-section-subtitle">
                    All registered patient profiles in the DME database.
                  </p>
                </div>
              </div>
              <AdminTable<ProfileRow>
                rows={users}
                rowKey={(u, i) => u.id || `user-${i}`}
                searchPlaceholder="Search by user ID, name, email…"
                emptyMessage="No users found matching your search."
                columns={[
                  { label: "#", className: "col-num" },
                  { label: "User ID", className: "col-id" },
                  { label: "Full Name" },
                  { label: "Email Address" },
                  { label: "Role" },
                  { label: "Date Joined" },
                ]}
                filterFn={(u, q) =>
                  (u.id || "").toLowerCase().includes(q) ||
                  (u.full_name || "").toLowerCase().includes(q) ||
                  (u.email || "").toLowerCase().includes(q)
                }
                renderRow={(u, idx) => (
                  <>
                    <td className="col-num" style={{ color: "#98a1a9", fontSize: 12 }}>
                      {idx}
                    </td>
                    <td>
                      <span className="id-mono" title={u.id}>
                        {u.id.slice(0, 8)}…
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#03231c" }}>
                      {safe(u.full_name)}
                    </td>
                    <td>{safe(u.email)}</td>
                    <td>
                      {u.is_admin ? (
                        <span className="badge badge-green">Admin</span>
                      ) : (
                        <span className="badge badge-gray">Patient</span>
                      )}
                    </td>
                    <td>{fmt(u.created_at)}</td>
                  </>
                )}
              />
            </section>
          )}

          {tab === "vouchers" && (
            <section className="admin-section active">
              <div className="admin-section-header">
                <div className="admin-section-title-row">
                  <h2 className="admin-section-title">Verification Codes</h2>
                  <p className="admin-section-subtitle">
                    Active, redeemed, and expired patient coverage verification
                    codes.
                  </p>
                </div>
              </div>
              <AdminTable<Voucher>
                rows={vouchers}
                rowKey={(v, i) => `${v.code}-${i}`}
                searchPlaceholder="Search by code, status…"
                emptyMessage="No verification codes found."
                columns={[
                  { label: "#", className: "col-num" },
                  { label: "Code" },
                  { label: "Date Created" },
                  { label: "Expiry Time" },
                  { label: "Product ID" },
                  { label: "User ID" },
                  { label: "Status" },
                ]}
                filterFn={(v, q) =>
                  (v.code || "").toLowerCase().includes(q) ||
                  (v.status || "").toLowerCase().includes(q) ||
                  (v.productId || "").toLowerCase().includes(q) ||
                  (v.userId || "").toLowerCase().includes(q)
                }
                renderRow={(v, idx) => {
                  const badge =
                    v.status === "granted" ? (
                      <span className="badge badge-green">Granted</span>
                    ) : v.status === "used" ? (
                      <span className="badge badge-gray">Redeemed</span>
                    ) : v.status === "expired" ? (
                      <span className="badge badge-red">Expired</span>
                    ) : (
                      <span className="badge badge-gray">{v.status}</span>
                    );

                  return (
                    <>
                      <td
                        className="col-num"
                        style={{ color: "#98a1a9", fontSize: 12 }}
                      >
                        {idx}
                      </td>
                      <td>
                        <code
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#03231c",
                          }}
                        >
                          {v.code || "—"}
                        </code>
                      </td>
                      <td>{fmtDate(v.createdAt)}</td>
                      <td>{fmt(v.expiresAt)}</td>
                      <td>
                        <span className="id-mono" title={v.productId}>
                          {v.productId
                            ? `${v.productId.substring(0, 14)}…`
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="id-mono">{v.userId || "—"}</span>
                      </td>
                      <td>{badge}</td>
                    </>
                  );
                }}
              />
            </section>
          )}
        </main>
      )}

      <RequestDetailModal
        request={detailRequest}
        onClose={() => setDetailRequest(null)}
      />
      <AssignCodeModal
        request={assignRequest}
        users={users}
        onClose={() => setAssignRequest(null)}
        onAssign={handleAssign}
      />
      <CodeCopyModal
        emailText={issuedEmail}
        onClose={() => setIssuedEmail(null)}
      />
      <ProductFormModal
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onSaved={() => void refresh()}
      />
    </>
  );
}
