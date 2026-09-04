"use client";

import { useEffect } from "react";
import { fmt, safe } from "@/components/admin/AdminPanel";
import { useStore } from "@/context/StoreProvider";
import { assetSrc } from "@/lib/routes";
import type { CoverageRequest } from "@/lib/types";

interface Props {
  request: CoverageRequest | null;
  onClose: () => void;
}

/** Read-only view of one intake submission and the device it asks for. */
export default function RequestDetailModal({ request, onClose }: Props) {
  const { getProductById } = useStore();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = request ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (request) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [request, onClose]);

  if (!request) return null;

  const product = getProductById(request.productId);

  return (
    <div
      className="admin-modal-overlay modal-active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div className="admin-modal-title-block">
            <h3 className="admin-modal-title">Request Details</h3>
            <span className="admin-modal-id">{safe(request.requestId)}</span>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close Details Modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="admin-modal-body">
          <div className="modal-detail-grid">
            <div className="modal-field">
              <span className="modal-field-label">Full Name</span>
              <span className="modal-field-value">{safe(request.fullName)}</span>
            </div>
            <div className="modal-field">
              <span className="modal-field-label">Email</span>
              <span className="modal-field-value">{safe(request.email)}</span>
            </div>
            <div className="modal-field">
              <span className="modal-field-label">Phone</span>
              <span className="modal-field-value">{safe(request.phone)}</span>
            </div>
            <div className="modal-field">
              <span className="modal-field-label">Date of Birth</span>
              <span className="modal-field-value">{safe(request.dob)}</span>
            </div>
            <div className="modal-field full">
              <span className="modal-field-label">Address</span>
              <span className="modal-field-value">
                {safe(request.address)}
                {request.zip_code ? `, ${request.zip_code}` : ""}
              </span>
            </div>
            <div className="modal-field">
              <span className="modal-field-label">Medicare ID</span>
              <span className="modal-field-value mono">
                {safe(request.medicare_id)}
              </span>
            </div>
            <div className="modal-field">
              <span className="modal-field-label">Submitted</span>
              <span className="modal-field-value">{fmt(request.timestamp)}</span>
            </div>
            {request.physician_instruction && (
              <div className="modal-field full">
                <span className="modal-field-label">Physician Notes</span>
                <span className="modal-field-value">
                  {request.physician_instruction}
                </span>
              </div>
            )}
          </div>

          <hr className="modal-section-divider" />
          <p className="modal-section-label">Requested Product</p>

          {product ? (
            <div className="modal-product-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetSrc(product.image)}
                alt={product.name}
                className="modal-product-img"
              />
              <div className="modal-product-info">
                <p className="modal-product-name">{product.name}</p>
                <p className="modal-product-id">ID: {product.id}</p>
                <p className="modal-product-id">
                  HCPCS: {product.hcpcsCode} &bull; {product.category}
                </p>
              </div>
              <span className="badge badge-blue">
                ${product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="modal-product-row">
              <div className="modal-product-info">
                <p className="modal-product-name">{safe(request.productName)}</p>
                <p className="modal-product-id">
                  ID: {safe(request.productId)}
                </p>
              </div>
            </div>
          )}

          {request.hasPrescriptionFile && (
            <div style={{ marginTop: 12 }}>
              <span className="badge badge-green">
                Prescription Document Attached
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
