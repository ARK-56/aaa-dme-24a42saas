"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { ROUTES } from "@/lib/routes";

const FEATURE_CARDS = [
  {
    image: "/assets/images/images/feature-card.png",
    title: "No Appointments. No Waiting.",
    body: "Get your equipment approved and delivered from home — no clinic visits needed.",
  },
  {
    image: "/assets/images/images/feature-card2.png",
    title: "Insurance Handled for You.",
    body: "We guide you through every step of the insurance and approval process.",
  },
  {
    image: "/assets/images/images/feature-card4.png",
    title: "Nationwide Coverage.",
    body: "We connect patients across all 50 states with certified medical suppliers.",
  },
  {
    image: "/assets/images/images/feature-card3.png",
    title: "Serving You, Always.",
    body: "Our team is here to answer your questions and support your health journey.",
  },
];

const CATEGORY_SLIDES = [
  {
    title: "Mobility Equipment",
    body: "From lightweight walkers to full-featured wheelchairs and hospital beds, our mobility solutions are prescribed by your doctor and delivered straight to your home — helping you move with confidence every day.",
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    title: "Self-Care Devices",
    body: "Manage your condition at home with equipment built for it. CPAP and BiPAP machines for sleep apnoea, portable oxygen concentrators rated for air travel, nebulisers and pulse oximeters — so you and your care team can act on what is actually happening, not on guesswork.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: "Medical Support",
    body: "The equipment that makes daily care safe: patient lifts and slings that end manual lifting, alternating pressure mattresses that prevent pressure injury, bath safety equipment and raised toilet seats. Prescribed, documented, and covered where your plan allows.",
    icon: <path d="M3 12h18M3 6h18M3 18h18" />,
  },
];

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const FeatureIcon = () => (
  <div className="feature-icon">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  </div>
);

/**
 * Feature tiles plus the looping category carousel. The dial in the header
 * fills as a stroke-dashoffset, matching the theme's radial progress badge.
 */
export default function FeaturesAndCategories() {
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = CATEGORY_SLIDES.length;

  // Slides are translated by their measured pixel width, as in the theme —
  // a percentage would be relative to the whole track, not one slide.
  const measure = () => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    setSlideWidth(first?.getBoundingClientRect().width ?? 0);
  };

  useLayoutEffect(measure, []);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const next = () => setIndex((current) => (current + 1) % total);
  const prev = () => setIndex((current) => (current - 1 + total) % total);

  const dashOffset = CIRCUMFERENCE - ((index + 1) / total) * CIRCUMFERENCE;

  return (
    <section className="features-categories-master">
      <div className="container-fluid features-inset-row">
        <div className="features-grid-row">
          {FEATURE_CARDS.map((card) => (
            <div className="feature-hover-card" key={card.title}>
              <div
                className="feature-overlay-img"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="feature-card-content">
                <FeatureIcon />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="categories-carousel-outer">
        <div className="container">
          <div className="category-header-flex">
            <div className="header-captions">
              <DiscoverTag emerald />
              <h2 className="cat-main-heading">Our Range Of Categories</h2>
            </div>

            <div className="circular-progress-badge">
              <svg className="progress-ring-svg" width="80" height="80">
                <circle className="ring-circle-bg" cx="40" cy="40" r={RADIUS} />
                <circle
                  className="ring-circle-fill"
                  id="cat-stroke-fill"
                  cx="40"
                  cy="40"
                  r={RADIUS}
                  style={{ strokeDashoffset: dashOffset }}
                />
              </svg>
              <div className="progress-digits-label" id="cat-text-counter">
                {index + 1} / {total}
              </div>
            </div>
          </div>

          <div className="cat-slider-window">
            <div
              className="cat-slider-track"
              id="categories-slider-track"
              ref={trackRef}
              style={{
                transform: `translate3d(-${index * slideWidth}px, 0px, 0px)`,
              }}
            >
              {CATEGORY_SLIDES.map((slide) => (
                <div className="cat-slide-item" key={slide.title}>
                  <div className="slide-meta-row">
                    <div className="meta-headline-group">
                      <div className="pulse-heart-badge">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          {slide.icon}
                        </svg>
                      </div>
                      <h3 className="slide-title">{slide.title}</h3>
                    </div>

                    <div className="slide-action-controls">
                      <div className="navigation-arrow-circles">
                        <button
                          type="button"
                          className="nav-arrow-circle prev-cat-btn"
                          aria-label="Previous Slide"
                          onClick={prev}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="nav-arrow-circle next-cat-btn active"
                          aria-label="Next Slide"
                          onClick={next}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <Link href={ROUTES.shop} className="btn-order-now-link">
                        <span>Order Products Now</span>
                        <div className="order-link-arrow">
                          <svg
                            width="14"
                            height="14"
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

                  <p className="slide-description">{slide.body}</p>

                  <div className="slide-graphic-hero-mask" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
