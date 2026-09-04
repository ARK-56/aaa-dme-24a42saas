"use client";

import { useSlider } from "@/hooks/useSlider";

// The last three repeat the first three so the auto-advancing loop never shows
// an empty gutter — the same trick the theme's markup used.
const CARDS = [
  {
    src: "/assets/images/images/about-card1.svg",
    alt: "Doctors Advice Prescription Card Asset",
  },
  {
    src: "/assets/images/images/about-card2.svg",
    alt: "Clinical Analysis Eye Insight Card Asset",
  },
  {
    src: "/assets/images/images/about-card3.svg",
    alt: "Patient Recovery Therapy Card Asset",
  },
  {
    src: "/assets/images/images/about-card1.svg",
    alt: "Doctors Advice Prescription Card Asset",
  },
  {
    src: "/assets/images/images/about-card2.svg",
    alt: "Clinical Analysis Eye Insight Card Asset",
  },
  {
    src: "/assets/images/images/about-card3.svg",
    alt: "Patient Recovery Therapy Card Asset",
  },
];

/** Auto-advancing graphic-card rail, used on the homepage and About page. */
export default function AboutCardsSlider() {
  const slider = useSlider({
    count: CARDS.length,
    gap: 20,
    autoPlayMs: 4000,
    pauseOnHover: true,
  });

  return (
    <div
      className="about-slider-window"
      ref={slider.viewportRef}
      {...slider.hoverProps}
    >
      <div
        className="about-slider-track"
        id="about-cards-track"
        ref={slider.trackRef}
        style={{ transform: `translate3d(-${slider.offset}px, 0px, 0px)` }}
      >
        {CARDS.map((card, index) => (
          <div className="about-graphic-card" key={`${card.src}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.src} alt={card.alt} className="card-full-graphic" />
          </div>
        ))}
      </div>
    </div>
  );
}
