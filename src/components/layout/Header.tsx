"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { useAuth } from "@/context/AuthProvider";
import { ROUTES } from "@/lib/routes";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home", match: (p: string) => p === "/" },
  {
    href: ROUTES.about,
    label: "About Us",
    match: (p: string) => p.startsWith("/about"),
  },
  {
    href: ROUTES.shop,
    label: "Shop",
    match: (p: string) => p.startsWith("/shop") || p.startsWith("/product"),
  },
  {
    href: ROUTES.contact,
    label: "Contact Us",
    match: (p: string) => p.startsWith("/contact"),
  },
  {
    href: ROUTES.blogs,
    label: "Blogs",
    match: (p: string) => p.startsWith("/blog"),
  },
];

export default function Header() {
  const pathname = usePathname();
  const { session, hydrated, openModal, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleProfileClick = useCallback(() => {
    if (session.isLoggedIn) {
      setDropdownOpen((open) => !open);
    } else {
      openModal("login");
    }
  }, [session.isLoggedIn, openModal]);

  const handleMobileProfileClick = useCallback(() => {
    if (!session.isLoggedIn) {
      openModal("login");
      return;
    }
    if (
      window.confirm(
        `Logged in as ${session.userEmail}. Would you like to log out?`
      )
    ) {
      logout();
    }
  }, [session, openModal, logout]);

  // `hydrated` gates the signed-in styling so the server markup and the first
  // client render agree before localStorage is read.
  const loggedIn = hydrated && session.isLoggedIn;
  const displayName =
    session.userName || session.userEmail?.split("@")[0] || "Account";

  return (
    <>
      <div className="top-announcement-header glass-premium-announcement">
        <div className="announcement-content-track">
          <p className="announcement-text">
            Secure Insurance Verification, Zero Paperwork Stress &amp; Absolute
            Cost Clarity
          </p>
        </div>
      </div>

      <header className="main-navigation-navbar">
        <div className="container nav-flex-wrapper">
          <Link href={ROUTES.home} className="nav-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/images/logo-color.png"
              alt="AAA DME Medical Supply Inc"
              className="nav-logo-img"
            />
          </Link>

          <nav
            className={`nav-links-menu${menuOpen ? " mobile-active" : ""}`}
            id="mobile-nav-menu"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`menu-link${link.match(pathname) ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleMobileProfileClick}
              className={`menu-link mobile-profile-only${
                loggedIn ? " logged-in-link" : ""
              }`}
            >
              {loggedIn ? `Account (${displayName})` : "Account / Login"}
            </button>
          </nav>

          <div className="nav-action-side">
            <button
              ref={profileBtnRef}
              type="button"
              onClick={handleProfileClick}
              className={`profile-btn${loggedIn ? " logged-in" : ""}`}
              aria-label="Account Profile"
              aria-expanded={dropdownOpen}
            >
              <svg
                className="profile-icon-svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span
                className="active-badge-checkmark"
                style={{ display: loggedIn ? "flex" : "none" }}
              >
                ✓
              </span>
            </button>

            <Link href={ROUTES.cart} className="btn-view-cart">
              <span>View Cart</span>
              <div className="cart-arrow-badge">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </Link>

            <button
              type="button"
              className={`mobile-menu-trigger-btn${menuOpen ? " active" : ""}`}
              id="nav-toggle-trigger"
              aria-label="Toggle Mobile Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {dropdownOpen && (
        <ProfileDropdown
          anchorRef={profileBtnRef}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </>
  );
}
