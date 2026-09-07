"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfileDropdown from "@/components/layout/ProfileDropdown";
import { useAuth } from "@/context/AuthProvider";
import { PRODUCT_GROUPS } from "@/lib/categories";
import SocialLinks from "@/components/layout/SocialLinks";
import { COMPANY } from "@/lib/company";
import { ROUTES, shopGroupHref } from "@/lib/routes";

interface NavLink {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
  /** Renders the Shop item as a menu of product groups. */
  groups?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: ROUTES.home, label: "Home", match: (p) => p === "/" },
  {
    href: ROUTES.shop,
    label: "Shop",
    match: (p) => p.startsWith("/shop") || p.startsWith("/product"),
    groups: true,
  },
  { href: ROUTES.about, label: "About", match: (p) => p.startsWith("/about") },
  {
    href: ROUTES.contact,
    label: "Contact",
    match: (p) => p.startsWith("/contact"),
  },
  { href: ROUTES.blogs, label: "Blogs", match: (p) => p.startsWith("/blog") },
];

export default function Header() {
  const pathname = usePathname();
  const { session, hydrated, openModal, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const shopItemRef = useRef<HTMLDivElement>(null);

  // Close everything whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setShopMenuOpen(false);
  }, [pathname]);

  // The menu now covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!menuOpen) setShopMenuOpen(false);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes the whole menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Dismiss the shop menu on outside click or Escape.
  useEffect(() => {
    if (!shopMenuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!shopItemRef.current?.contains(event.target as Node)) {
        setShopMenuOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShopMenuOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [shopMenuOpen]);

  const handleProfileClick = useCallback(() => {
    if (session.isLoggedIn) {
      setDropdownOpen((open) => !open);
    } else {
      openModal("login");
    }
  }, [session.isLoggedIn, openModal]);

  // `hydrated` gates the signed-in styling so server markup and the first
  // client render agree before the session is restored.
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
            aria-hidden={!menuOpen}
          >
            <div className="mobile-nav-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/images/logo.png"
                alt="AAA DME"
                className="mobile-nav-logo"
              />
              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {NAV_LINKS.map((link) =>
              link.groups ? (
                <div
                  key={link.href}
                  className="nav-shop-item"
                  ref={shopItemRef}
                >
                  <Link
                    href={link.href}
                    className={`menu-link${
                      link.match(pathname) ? " active" : ""
                    }${shopMenuOpen ? " submenu-open" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={shopMenuOpen}
                    onClick={(event) => {
                      // Click-only at every width. Hover used to open it while
                      // onMouseLeave closed it, and crossing the gap to the
                      // panel made the two fight, which read as flicker.
                      // "All Products" inside the panel is the way to /shop.
                      event.preventDefault();
                      setShopMenuOpen((open) => !open);
                    }}
                  >
                    {link.label}
                    <span className="nav-shop-caret" aria-hidden="true" />
                  </Link>

                  <div
                    className={`nav-shop-dropdown${
                      shopMenuOpen ? " open" : ""
                    }`}
                  >
                    <Link href={ROUTES.shop} className="nav-shop-dropdown-all">
                      All Products
                    </Link>
                    {PRODUCT_GROUPS.map((group) => (
                      <Link
                        key={group.slug}
                        href={shopGroupHref(group.slug)}
                        className="nav-shop-dropdown-link"
                      >
                        <span className="nav-shop-dropdown-label">
                          {group.label}
                        </span>
                        <span className="nav-shop-dropdown-meta">
                          {group.categories.join(" · ")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`menu-link${link.match(pathname) ? " active" : ""}`}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mirrors the desktop pill inside the overlay. */}
            <div className="mobile-account-block">
              {loggedIn ? (
                <>
                  <div className="mobile-account-user">
                    <span className="account-avatar" aria-hidden="true">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <span className="mobile-account-meta">
                      <span className="mobile-account-name">{displayName}</span>
                      {session.userEmail && (
                        <span className="mobile-account-email">
                          {session.userEmail}
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mobile-account-signout"
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="mobile-account-signin"
                  onClick={() => {
                    // Close the overlay first; the modal would otherwise open
                    // on top of the full-screen nav.
                    setMenuOpen(false);
                    openModal("login");
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Log In
                </button>
              )}
            </div>

            <div className="mobile-nav-foot">
              {/* Grouped so phone and email stay stacked while the whole
                  block sits on one row opposite the socials. */}
              <div className="mobile-nav-contacts">
                <a href={COMPANY.phone.href} className="mobile-nav-contact">
                  {COMPANY.phone.display}
                </a>
                <a href={COMPANY.email.href} className="mobile-nav-contact">
                  {COMPANY.email.display}
                </a>
              </div>
              <SocialLinks
                className="mobile-nav-socials"
                linkClassName="mobile-nav-social"
              />
            </div>
          </nav>

          <div className="nav-action-side">
            {/* Labelled rather than a bare glyph: signed out it says what it
                does, signed in it shows whose session it is and carets to
                signal that it opens a menu. */}
            <button
              ref={profileBtnRef}
              type="button"
              onClick={handleProfileClick}
              className={`profile-btn${loggedIn ? " logged-in" : ""}`}
              aria-label={
                loggedIn
                  ? `Account menu for ${displayName}`
                  : "Log in to your account"
              }
              aria-haspopup={loggedIn ? "menu" : undefined}
              aria-expanded={loggedIn ? dropdownOpen : undefined}
            >
              {loggedIn ? (
                <span className="account-avatar" aria-hidden="true">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  className="profile-icon-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              <span className="profile-btn-label">
                {loggedIn ? displayName : "Log In"}
              </span>
              {loggedIn && (
                <span className="profile-btn-caret" aria-hidden="true" />
              )}
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
