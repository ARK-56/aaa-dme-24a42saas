"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useAuth } from "@/context/AuthProvider";
import { ROUTES } from "@/lib/routes";

interface Props {
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/**
 * Account menu anchored under the header profile button. Positioned in a layout
 * effect (rather than with CSS) to match the theme, which measured the button
 * and placed the card in page coordinates.
 */
export default function ProfileDropdown({ anchorRef, onClose }: Props) {
  const { session, isAdmin, logout } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const card = cardRef.current;
    if (!anchor || !card) return;

    const rect = anchor.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.right + window.scrollX - card.offsetWidth,
    });
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !cardRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onClose();
      }
    };
    // Deferred so the click that opened the menu does not immediately close it.
    const timer = setTimeout(
      () => document.addEventListener("click", handleClickOutside),
      10
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [anchorRef, onClose]);

  if (!session.isLoggedIn) return null;

  const displayName =
    session.userName || session.userEmail?.split("@")[0] || "Account";

  return (
    <div
      ref={cardRef}
      className="profile-dropdown-card"
      id="profile-dropdown"
      style={{
        top: position?.top,
        left: position?.left,
        visibility: position ? "visible" : "hidden",
      }}
    >
      <div className="dropdown-header-block">
        <div className="user-avatar-placeholder">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="user-meta-info">
          <p className="user-email-label">{displayName}</p>
          <p style={{ fontSize: 11, color: "#667085", marginTop: 1 }}>
            {session.userEmail}
          </p>
          {isAdmin && (
            <p
              style={{
                fontSize: 10,
                color: "#22c55e",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: 2,
              }}
            >
              Administrator
            </p>
          )}
        </div>
      </div>

      <div className="dropdown-links-list">
        {isAdmin ? (
          <Link href={ROUTES.adminPanel} className="drop-item" onClick={onClose}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: 6, verticalAlign: -2 }}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin Panel
          </Link>
        ) : (
          <>
            <Link href={ROUTES.orderForm} className="drop-item" onClick={onClose}>
              Track My Orders
            </Link>
            <Link
              href={`${ROUTES.orderForm}?view=declined`}
              className="drop-item"
              onClick={onClose}
            >
              Declined Requests
            </Link>
          </>
        )}
        <button
          type="button"
          className="drop-item btn-logout"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
