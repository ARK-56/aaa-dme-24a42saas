interface AboutCard {
  image: string;
  alt: string;
  /** Small label above the figure. */
  eyebrow: string;
  /** The headline number or short phrase. */
  stat: string;
  statCaption: string;
  body: string;
}

/**
 * The three stages of the service. Previously these were flat SVGs that all
 * embedded the *same* overlay bitmap, so every card repeated "We Simplify The
 * Process Of Doctors Prescribe Medical Equipment" — the text was baked into the
 * image and could not be edited. They are markup now, so each says its own
 * thing and the copy stays translatable and searchable.
 */
const CARDS: AboutCard[] = [
  {
    image: "/assets/images/about/card1-2.png",
    alt: "Patient reviewing their insurance coverage at home",
    eyebrow: "Step one",
    stat: "24 hrs",
    statCaption: "Typical eligibility answer",
    body: "We check your benefits with Medicare, Medicaid or your private plan and tell you what is covered — and what it will cost you — before you commit to anything.",
  },
  {
    image: "/assets/images/about/card2-2.png",
    alt: "Clinician discussing equipment with a patient",
    eyebrow: "Step two",
    stat: "Zero",
    statCaption: "Forms for you to chase",
    body: "We contact your physician directly for the prescription and clinical documentation, then file the prior authorisation. No faxing, no chasing signatures.",
  },
  {
    image: "/assets/images/images/feature-card3.png",
    alt: "Medical equipment delivered to a patient's home",
    eyebrow: "Step three",
    stat: "3–5 days",
    statCaption: "Standard delivery, fully tracked",
    body: "Once approved, a licensed supplier ships to your door. We stay on for resupply reminders, replacement parts and any coverage question that comes up later.",
  },
];

// Repeated so the CSS marquee loops seamlessly: the keyframes translate by
// exactly half the track, landing back on a copy of the opening frame.
const TRACK = [...CARDS, ...CARDS];

/**
 * Continuously crawling card rail, used on the homepage and About page.
 *
 * Motion is entirely CSS: `.about-slider-track` runs the `smoothAboutMarquee`
 * keyframes and `.about-slider-window:hover` pauses them. A JS slider here
 * would be dead code — an animated `transform` always beats an inline one.
 */
export default function AboutCardsSlider() {
  return (
    <div className="about-slider-window">
      <div className="about-slider-track" id="about-cards-track">
        {TRACK.map((card, index) => (
          <article
            className="about-graphic-card about-step-card"
            key={`${card.eyebrow}-${index}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.alt}
              className="about-step-photo"
              loading="lazy"
            />
            <div className="about-step-scrim" />

            <div className="about-step-head">
              <span className="about-step-eyebrow">{card.eyebrow}</span>
              <span className="about-step-stat">{card.stat}</span>
              <span className="about-step-stat-caption">
                {card.statCaption}
              </span>
            </div>

            <p className="about-step-body">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
