/**
 * Insurers AAA DME works with. The logo strip doubles as social proof, so it
 * sits directly under the hero.
 *
 * cigna.svg and unitedhealthcare.svg ship with a viewBox but no width/height,
 * which gives them no intrinsic size inside <img> — `.ticker-item img` in
 * style.css sets an explicit height so they render alongside the PNGs.
 */
const INSURERS = [
  { src: "/assets/images/insurances/blue-cross.png", name: "Blue Cross" },
  { src: "/assets/images/insurances/cigna.svg", name: "Cigna" },
  { src: "/assets/images/insurances/medicare.png", name: "Medicare" },
  { src: "/assets/images/insurances/aetna.png", name: "Aetna" },
  {
    src: "/assets/images/insurances/unitedhealthcare.svg",
    name: "UnitedHealthcare",
  },
];

const TickerGroup = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div className="ticker-group" aria-hidden={ariaHidden || undefined}>
    {INSURERS.map((insurer) => (
      <div className="ticker-item" key={insurer.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={insurer.src} alt={`${insurer.name} insurance accepted`} />
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
