// The last three cards repeat the first three so the marquee loops seamlessly:
// the keyframes translate by exactly half the track, landing back on a copy of
// the starting frame.
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

/**
 * Continuously crawling graphic-card rail, used on the homepage and About page.
 *
 * Motion is entirely CSS: `.about-slider-track` runs the `smoothAboutMarquee`
 * keyframes, and `.about-slider-window:hover` pauses them. A JS slider here
 * would be dead code — an animated `transform` always beats an inline one.
 */
export default function AboutCardsSlider() {
  return (
    <div className="about-slider-window">
      <div className="about-slider-track" id="about-cards-track">
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
