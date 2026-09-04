"use client";

import { useEffect, useState } from "react";

interface Props {
  /** Pre-written patient email; null keeps the modal closed. */
  emailText: string | null;
  onClose: () => void;
}

/** Confirmation popup with the notification text to send the patient. */
export default function CodeCopyModal({ emailText, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = emailText ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (emailText) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [emailText, onClose]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!emailText) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      setCopied(true);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }
  };

  return (
    <div
      className="admin-modal-overlay modal-active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="admin-modal-card" style={{ maxWidth: 480 }}>
        <div
          className="admin-modal-header"
          style={{
            background: "rgba(34,197,94,0.06)",
            borderBottom: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          <div className="admin-modal-title-block">
            <h3 className="admin-modal-title" style={{ color: "#15803d" }}>
              ✓ Code Issued &amp; Granted
            </h3>
            <p style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>
              Verification code is now active.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close Copy Popup"
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

        <div className="admin-modal-body" style={{ padding: 24 }}>
          <p
            style={{
              fontSize: 13,
              color: "#667085",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            Copy the coverage notification text below to email the patient
            directly:
          </p>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e4e8ef",
              borderRadius: 10,
              padding: 18,
              position: "relative",
            }}
          >
            <textarea
              readOnly
              value={emailText}
              style={{
                width: "100%",
                height: 160,
                border: "none",
                background: "none",
                resize: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: "inherit",
                lineHeight: 1.6,
                color: "#344054",
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              width: "100%",
              marginTop: 20,
              background: copied ? "#15803d" : "#03231c",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {copied ? (
              "✓ Copied successfully!"
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Text to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
