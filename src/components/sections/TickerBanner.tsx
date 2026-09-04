const TickerIcon = () => (
  <div className="ticker-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const TickerGroup = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div className="ticker-group" aria-hidden={ariaHidden || undefined}>
    {[0, 1, 2].map((i) => (
      <div className="ticker-item" key={i}>
        <TickerIcon />
        <span className="ticker-text">AAA DME</span>
        <span className="ticker-badge">INC</span>
      </div>
    ))}
  </div>
);

/** Marquee strip. The second group is the duplicate that makes the loop seamless. */
export default function TickerBanner() {
  return (
    <section className="ticker-banner-section">
      <div className="ticker-container">
        <div className="ticker-scroll-track">
          <TickerGroup />
          <TickerGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
