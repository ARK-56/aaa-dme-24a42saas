"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useUi } from "@/context/UiProvider";
import { sendContactEmail } from "@/lib/emailService";
import { ROUTES } from "@/lib/routes";

const EMPTY = { name: "", email: "", phone: "" };

export default function Footer() {
  const { notify } = useUi();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await sendContactEmail({
        ...form,
        message: "(Submitted via CTA form)",
      });
      notify("Thank you! Our team will reach out shortly.");
      setForm(EMPTY);
    } catch (err) {
      console.error("CTA form send failed:", err);
      notify("Submission failed. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="main-footer-section">
      <div className="container">
        <div className="cta-sub-container">
          <video className="cta-video-bg" autoPlay loop muted playsInline>
            <source src="/assets/images/videos/cta-video.mp4" type="video/mp4" />
          </video>
          <div className="cta-video-tint" />

          <div className="cta-inner-layout">
            <div className="cta-info-side">
              <h2 className="cta-heading-title">
                Ready to Get Started?
                <br /> Let&apos;s Find What You Need.
              </h2>
              <div className="cta-meta-block">
                <p className="cta-tagline">Talk to our expert now!</p>
                <p className="cta-subtext">
                  Get a complete walkthrough from our care team. Simply fill in
                  your details and we&apos;ll reach out shortly to verify your
                  eligibility and guide your next steps.
                </p>
              </div>
            </div>

            <div className="cta-form-side">
              <div className="glass-form-wrapper">
                <h3 className="form-panel-title">
                  Get Your Medical Equipment <br />
                  Covered by Insurance.
                </h3>

                <form
                  id="footer-cta-form"
                  className="compact-cta-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-input-row">
                    <span className="field-icon">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-input-row">
                    <span className="field-icon">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-input-row">
                    <span className="field-icon">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="compact-submit-btn"
                    disabled={sending}
                  >
                    <span>{sending ? "Sending..." : "Submit Form"}</span>
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
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-mid-row">
          <div className="footer-brand-column">
            <Link href={ROUTES.home} className="footer-logo-link">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/images/logo.png"
                alt="AAA DME"
                className="footer-logo-img"
              />
            </Link>
          </div>

          <div className="footer-links-column">
            <ul className="footer-navigation-list">
              <li>
                <Link href={ROUTES.home}>Home</Link>
              </li>
              <li>
                <Link href={ROUTES.about}>About Us</Link>
              </li>
              <li>
                <Link href={ROUTES.shop}>Shop</Link>
              </li>
              <li>
                <Link href={ROUTES.contact}>Contact Us</Link>
              </li>
              <li>
                <Link href={ROUTES.blogs}>Blogs</Link>
              </li>
              <li>
                <Link href={ROUTES.orderForm}>Track Order</Link>
              </li>
            </ul>
          </div>

          <div className="footer-social-column">
            <a
              href="https://www.instagram.com/aaadmesupply"
              target="_blank"
              rel="noopener"
              className="social-icon-wrapper glass-element"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/AAA-DME-Medical-Supply/61563190737229/"
              target="_blank"
              rel="noopener"
              className="social-icon-wrapper glass-element"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/aaadmeinc"
              target="_blank"
              rel="noopener"
              className="social-icon-wrapper glass-element"
              aria-label="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-contact-bar">
          <div className="footer-contact-bar-item">
            <span className="footer-contact-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div className="footer-contact-bar-text">
              <span className="footer-contact-bar-label">Phone</span>
              <a href="tel:+13475990043" className="footer-contact-link">
                (347) 599 0043
              </a>
            </div>
          </div>

          <div className="footer-contact-bar-divider" />

          <div className="footer-contact-bar-item">
            <span className="footer-contact-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <div className="footer-contact-bar-text">
              <span className="footer-contact-bar-label">Email</span>
              <a
                href="mailto:aaadmeinc@gmail.com"
                className="footer-contact-link"
              >
                aaadmeinc@gmail.com
              </a>
            </div>
          </div>

          <div className="footer-contact-bar-divider" />

          <div className="footer-contact-bar-item">
            <span className="footer-contact-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div className="footer-contact-bar-text">
              <span className="footer-contact-bar-label">Location</span>
              <span className="footer-contact-bar-value">
                25 Elm Pl #401, Brooklyn, NY 11201, USA
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-legal-container">
            <p className="copyright-label">
              &copy; 2026 AAA DME All rights reserved.
            </p>
            <div className="legal-links-row">
              <Link href={ROUTES.privacyPolicy}>Privacy Policy</Link>
              <Link href={ROUTES.termsConditions}>Terms &amp; Conditions</Link>
            </div>
          </div>

          <div className="footer-credits-container">
            <span>
              Website By{" "}
              <a
                href="https://squadtechsol.com"
                target="_blank"
                rel="noopener"
                className="agency-credit-link"
              >
                Squad Tech Solutions
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
