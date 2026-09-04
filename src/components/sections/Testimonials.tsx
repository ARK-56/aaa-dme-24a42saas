import Link from "next/link";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { ROUTES } from "@/lib/routes";

export interface Testimonial {
  heading: string;
  avatar: string;
  quote: string;
  name: string;
  specialty: string;
  elevated?: boolean;
}

/** Homepage quotes. The About page passes its own set. */
export const HOME_TESTIMONIALS: Testimonial[] = [
  {
    heading: "Unbelievable Accuracy & Clarity!",
    avatar: "/assets/images/images/profile-6.jpg",
    quote:
      "AAA DME completely simplified our insurance verification and provided clear medical device insights. Highly recommended!",
    name: "Dr. Omar R,",
    specialty: "Aesthetic Specialist",
    elevated: true,
  },
  {
    heading: "Extremely Intuitive Monitoring!",
    avatar: "/assets/images/images/profile-2.jpg",
    quote:
      "Integrating Altivox telemetry and self-care monitoring into my daily routine has been seamless. The diagnostic updates are fast and accurate.",
    name: "Dr. Sarah M,",
    specialty: "General Practitioner",
  },
  {
    heading: "Remarkable Telemetry Devices!",
    avatar: "/assets/images/images/profile-3.jpg",
    quote:
      "Our clinics now monitor post-op patients remotely using Altivox's advanced health channels. The cost clarity and setup speeds are outstanding.",
    name: "Dr. Evelyn K,",
    specialty: "Cardiology Director",
  },
  {
    heading: "The Best Support Integration!",
    avatar: "/assets/images/images/profile-4.jpg",
    quote:
      "Altivox has bridged the gap between our recovery goals and accessible medical equipment. Highly recommend their predictive diagnostic solutions.",
    name: "Dr. Marcus T,",
    specialty: "Rehabilitation Specialist",
  },
];

const HOME_DESCRIPTION =
  "From diabetes management to joint recovery and lymphedema care, we've helped patients across the U.S. get the right equipment at the right time.";

const QuoteBadge = () => (
  <div className="badge-quote-icon">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-2.638 3.995-4.317H0V3h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-2.638 3.996-4.317H14V3h14z" />
    </svg>
  </div>
);

interface Props {
  items?: Testimonial[];
  /** Eyebrow label above the heading. */
  tag?: React.ReactNode;
  description?: string;
}

export default function Testimonials({
  items = HOME_TESTIMONIALS,
  tag,
  description = HOME_DESCRIPTION,
}: Props) {
  return (
    <section className="testimonials-section">
      <div className="container testimonial-layout-grid">
        <div className="testi-info-side">
          <DiscoverTag emerald>{tag}</DiscoverTag>
          <h2 className="testi-main-title">
            What Client Says
            <br />
            About Us
          </h2>
          <p className="testi-desc">{description}</p>

          <Link href={ROUTES.shop} className="btn-order-now">
            <span>Order Products Now</span>
            <div className="order-btn-arrow">
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

        <div className="testi-cards-side-grid">
          {items.map((item) => (
            <div
              key={item.name + item.heading}
              className={`testimonial-glass-card${
                item.elevated ? " primary-elevated" : ""
              }`}
            >
              <div className="card-quote-bg">&ldquo;</div>
              <h3 className="card-heading-feedback">{item.heading}</h3>

              <div className="user-profile-row">
                <div className="avatar-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.avatar}
                    alt={item.name.replace(/,$/, "")}
                    className="user-avatar"
                  />
                  <QuoteBadge />
                </div>
              </div>

              <p className="feedback-paragraph">{item.quote}</p>
              <h4 className="doctor-signature-tag">
                {item.name} <span className="spec-label">{item.specialty}</span>
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
