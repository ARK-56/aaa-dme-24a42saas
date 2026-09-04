import Link from "next/link";
import AboutCardsSlider from "@/components/sections/AboutCardsSlider";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { ROUTES } from "@/lib/routes";

/** Homepage "about" band: heading, the graphic-card rail, and a summary row. */
export default function AboutCards() {
  return (
    <section className="about-us-section">
      <div className="about-bg-gradient-glow" />

      <div className="container">
        <div className="about-header-wrapper">
          <DiscoverTag />
          <h2 className="about-main-heading">
            A Predictive, Personalized
            <br />
            Health Platform
          </h2>
        </div>

        <AboutCardsSlider />

        <div className="about-bottom-flex-row">
          <p className="about-bottom-summary">
            To make life-improving medical equipment more accessible, more
            affordable, and more aligned with your everyday health goals.
          </p>

          <Link href={ROUTES.about} className="btn-view-about-more">
            <span>View More About Us</span>
            <div className="about-link-arrow">
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
    </section>
  );
}
