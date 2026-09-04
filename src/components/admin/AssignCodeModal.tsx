"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { CoverageRequest, User } from "@/lib/types";

interface Props {
  request: CoverageRequest | null;
  users: User[];
  onClose: () => void;
  onAssign: (
    request: CoverageRequest,
    code: string,
    productId: string,
    userId: string
  ) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#98a1a9",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e2e2",
  borderRadius: 8,
  padding: "10px 14px",
  fontFamily: "monospace",
  fontSize: 14,
  fontWeight: 700,
  color: "#03231c",
};

const readonlyStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#f8fafc",
  fontSize: 12,
  fontWeight: 400,
  color: "#667085",
  width: "100%",
  minWidth: 0,
};

/** Issues a 24-hour coverage code against a pending request. */
export default function AssignCodeModal({
  request,
  users,
  onClose,
  onAssign,
}: Props) {
  const [code, setCode] = useState("");

  // Matching the request's email to an account decides which user the code is
  // scoped to; the theme fell back to the first seeded account.
  const matchedUser = request
    ? users.find(
        (u) => u.email.toLowerCase() === (request.email ?? "").toLowerCase()
      )
    : undefined;
  const userId = matchedUser?.userId ?? "aaa-user_01";

  useEffect(() => {
    if (!request) return;
    setCode(`VERIFY-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [request]);

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    onAssign(request, trimmed, request.productId, userId);
  };

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
            <h3 className="admin-modal-title">Assign Verification Code</h3>
            <span className="admin-modal-id">{request.requestId}</span>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close Assign Modal"
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
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="assign-code-input" style={labelStyle}>
                  Verification Code *
                </label>
                <input
                  type="text"
                  id="assign-code-input"
                  required
                  placeholder="e.g. GENERATEDCODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div className="assign-modal-grid-2col">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  <label style={labelStyle}>Product ID</label>
                  <input
                    type="text"
                    readOnly
                    value={request.productId}
                    style={readonlyStyle}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  <label style={labelStyle}>User ID</label>
                  <input
                    type="text"
                    readOnly
                    value={userId}
                    style={readonlyStyle}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Expiry Limit</label>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#344054",
                    background: "#f8fafc",
                    padding: "10px 14px",
                    border: "1px solid #e2e2e2",
                    borderRadius: 8,
                  }}
                >
                  24 Hours from now (coverage authorization TTL)
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Grant &amp; Issue Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
