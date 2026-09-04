interface Props {
  /** Background art, e.g. "/assets/images/images/hero-shop.svg". */
  backgroundImage: string;
  heading: string;
  tag: string;
}

/** Diagonal-masked page banner used at the top of every inner page. */
export default function InnerHero({ backgroundImage, heading, tag }: Props) {
  return (
    <section
      className="inner-page-hero-section"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="inner-hero-darkener-overlay" />

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

      <div className="container inner-hero-content-flex">
        <div className="inner-hero-text-block">
          <div className="discover-tag text-emerald">
            <svg
              className="asterisk-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{tag}</span>
          </div>
          <h1 className="inner-hero-h1-heading">{heading}</h1>
        </div>
      </div>
    </section>
  );
}
