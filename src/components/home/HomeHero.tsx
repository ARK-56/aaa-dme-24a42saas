import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const FEATURES = [
  {
    title: "Doctor-Prescribed Equipment",
    body: "Via licensed medical providers and certified suppliers.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
      </>
    ),
  },
  {
    title: "Zero Paperwork Stress",
    body: "Handle insurance approvals & documentation completely.",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    title: "Nationwide Home Delivery",
    body: "Delivers prescribed equipment right to your home, all over U.S.",
    icon: (
      <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5M12 2v12M8 6l4-4 4 4" />
    ),
  },
];

export default function HomeHero() {
  return (
    <section className="cinematic-hero-section">
      <video className="hero-underlying-video" autoPlay loop muted playsInline>
        <source src="/assets/images/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-darkening-fallback-tint" />

      <div className="hero-diagonal-transition-overlay">
        <svg
          className="diagonal-mask-svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
        >
          <path
            className="mask-pane-left"
            d="M0,0 L760,0 L960,1080 L0,1080 Z"
            fill="url(#left-teal-gradient)"
          />
          <path
            className="mask-pane-right"
            d="M760,0 L1920,0 L1920,1080 L960,1080 Z"
            fill="url(#right-mint-gradient)"
          />

          <defs>
            <linearGradient
              id="left-teal-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#03231c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0e3f34" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient
              id="right-mint-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0e3f34" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00afb9" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container hero-content-container-grid">
        <div className="hero-upper-title-span">
          <h1 className="hero-main-h1-title">
            Making Healthcare <br /> Access Simple, <br />
            Reliable, and <br />
            Stress-Free.
          </h1>
        </div>

        <div className="hero-lower-details-split">
          <div className="hero-features-column-stack">
            {FEATURES.map((feature) => (
              <div className="hero-feature-interactive-row" key={feature.title}>
                <div className="hero-row-icon-circle">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <div className="hero-row-text-block">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-summary-action-block">
            <p className="hero-summary-statement">
              Your body holds the answers — we help you see them.
            </p>

            <Link href={ROUTES.shop} className="btn-hero-order-products">
              <span>Order Products Now</span>
              <div className="hero-order-btn-arrow-badge">
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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
