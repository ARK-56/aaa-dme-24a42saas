import type { Metadata } from "next";
import InnerHero from "@/components/layout/InnerHero";
import AboutCardsSlider from "@/components/sections/AboutCardsSlider";
import DiscoverTag from "@/components/sections/DiscoverTag";
import Faq from "@/components/sections/Faq";
import Process, { type ProcessStep } from "@/components/sections/Process";
import Testimonials, {
  type Testimonial,
} from "@/components/sections/Testimonials";
import TickerBanner from "@/components/sections/TickerBanner";
import type { AccordionEntry } from "@/components/sections/Accordion";

export const metadata: Metadata = { title: "About" };

const ACHIEVEMENTS: { title: React.ReactNode; icon: React.ReactNode; left: string }[] =
  [
    {
      left: "10%",
      title: (
        <>
          Comprehensive
          <br />
          End-to-End Service
        </>
      ),
      icon: <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />,
    },
    {
      left: "28%",
      title: (
        <>
          Innovative,
          <br />
          Smart Solutions
        </>
      ),
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </>
      ),
    },
    {
      left: "47%",
      title: (
        <>
          Accredited
          <br />& Certified
        </>
      ),
      icon: <polyline points="20 6 9 17 4 12" />,
    },
    {
      left: "65%",
      title: (
        <>
          Tailored to
          <br />
          Your Needs
        </>
      ),
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" />
        </>
      ),
    },
    {
      left: "82%",
      title: (
        <>
          Industry Expertise
          <br />& Experience
        </>
      ),
      icon: <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />,
    },
    {
      left: "98%",
      title: (
        <>
          Commitment
          <br />
          to Safety
        </>
      ),
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </>
      ),
    },
  ];

const ABOUT_PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Learn What CGM Is and How It Works",
    body: "Understand what a Continuous Glucose Monitor does and whether it's the right solution for your diabetes management needs — no jargon, no confusion.",
    icon: (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ),
  },
  {
    title: "Check Your Eligibility",
    body: "Based on your health conditions and insurance plan, we help you determine if you qualify for CGM systems, medical braces, or other durable medical equipment.",
    icon: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ),
  },
  {
    title: "Get Matched With a Licensed Provider",
    body: "We connect you directly with a licensed medical provider or certified supplier who can fulfill your prescription and coordinate your care from start to finish.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: "Receive Documentation & Insurance Support",
    body: "Our team helps retrieve and organize all required paperwork — including prescription details and insurance pre-authorization — so nothing falls through the cracks.",
    icon: <path d="M18 20V10M12 20V4M6 20v-6" />,
  },
  {
    title: "Get Your Equipment Delivered to Your Door",
    body: "Once approved, your medical equipment is shipped directly to your home — fully tracked, brand new, and ready to use.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    title: "Ongoing Education & Support After Delivery",
    body: "We stay with you after delivery — providing resources, guidance, and ongoing support so you feel confident using your equipment every step of the way.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
  },
];

/** PLACEHOLDER — theme copy, not real endorsements. See HOME_TESTIMONIALS. */
const ABOUT_TESTIMONIALS: Testimonial[] = [
  {
    heading: "Unbelievable Accuracy & Clarity!",
    avatar: "/assets/images/images/profile.svg",
    quote:
      "AAA DME completely simplified our insurance verification and provided clear medical device insights. Highly recommended!",
    name: "Dr. Omar R,",
    specialty: "Aesthetic Specialist",
    elevated: true,
  },
  {
    heading: "Extremely Intuitive Monitoring!",
    avatar: "/assets/images/images/profile.svg",
    quote:
      "Working with AAA DME has made it so easy to get my patients the equipment they need. Insurance coordination is handled quickly and the delivery process is seamless.",
    name: "Dr. Sarah M,",
    specialty: "General Practitioner",
  },
  {
    heading: "Remarkable Telemetry Devices!",
    avatar: "/assets/images/images/profile.svg",
    quote:
      "We've recommended AAA DME to dozens of post-op patients who needed home equipment fast. The cost clarity and zero-paperwork process is exactly what a busy clinic needs.",
    name: "Dr. Evelyn K,",
    specialty: "Cardiology Director",
  },
  {
    heading: "The Best Support Integration!",
    avatar: "/assets/images/images/profile.svg",
    quote:
      "AAA DME has bridged the gap between our recovery goals and the medical equipment our patients actually need at home. Highly recommend their patient-first approach.",
    name: "Dr. Marcus T,",
    specialty: "Rehabilitation Specialist",
  },
];

const ABOUT_FAQ: AccordionEntry[] = [
  {
    question: "Is My Information Secure?",
    answer:
      "Absolutely. Every piece of information you share is fully protected under HIPAA privacy regulations. Your data is never sold, shared, or disclosed without your explicit consent.",
  },
  {
    question: "Is It Covered Under My Medicare?",
    answer:
      "Our billing team coordinates directly with major medical insurance options, including comprehensive Medicare coverage routes, to eliminate unexpected out-of-pocket stress.",
  },
  {
    question: "Is My Health Information Protected Under HIPAA?",
    answer:
      "Absolutely. Every element of data transmission, cloud encryption layer, and file storage fully aligns with strict state and national HIPAA privacy regulations.",
  },
  {
    question: "How Long Until I Receive My Equipment?",
    answer:
      "Once verified by our medical coordinators, delivery typically reaches your home location within 3 to 5 business days, fully tracked.",
  },
  {
    question: "Do I Need an Active Prescription Before Ordering?",
    answer:
      "Yes, durable medical equipment requires validation. However, our internal navigation desk can assist in contacting your doctor directly to safely retrieve documentation for you.",
  },
  {
    question: "How Can I Modify or Return My Assigned Gear?",
    answer:
      "Returns or equipment modifications can be scheduled instantly through your dedicated concierge manager without complex forms or processing roadblocks.",
  },
];

export default function AboutPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-blog.svg"
        heading="Your Trusted Health Partner"
        tag="YOUR HEALTH, OUR PRIORITY."
      />

      <TickerBanner />

      <section className="about-vision-section">
        <div className="container vision-mission-grid">
          <div className="vision-image-side">
            <div className="vision-img-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/images/about-section.svg"
                alt="Our Mission and Vision Showcase"
                className="vision-native-png"
              />
            </div>
          </div>

          <div className="vision-content-side">
            <div className="vision-block-group">
              <h2 className="vision-block-title">Our Mission</h2>
              <p className="vision-block-desc">
                AAA DME Inc is a trusted patient support platform dedicated to
                helping individuals access essential medical equipment —
                specifically Continuous Glucose Monitoring (CGM) systems and
                doctor-prescribed medical braces. We bridge the gap between
                people who need real solutions for chronic conditions and the
                licensed providers and suppliers who can help. Whether
                you&apos;re managing diabetes or seeking relief from joint pain,
                post-surgical recovery, or mobility challenges, we make the
                process easier to understand and access.
              </p>
            </div>

            <hr className="vision-section-divider" />

            <div className="vision-block-group">
              <h2 className="vision-block-title">Our Vision</h2>
              <p className="vision-block-desc">
                We envision a world where every patient has clear, stress-free
                access to the medical equipment they need — covered by insurance,
                prescribed by their doctor, and delivered to their door. Through
                education, eligibility support, and trusted supplier connections,
                we are building a more accessible healthcare future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="analysis-graph-section">
        <div className="container-fluid">
          <div className="analysis-header-block">
            <DiscoverTag emerald>YOUR HEALTH, OUR PRIORITY.</DiscoverTag>
            <h2 className="analysis-section-title">
              Our Achievements &amp;
              <br />
              What Sets Us Apart
            </h2>
          </div>

          <div className="analysis-chart-data-wrapper">
            {ACHIEVEMENTS.map((node, index) => (
              <div
                className="analysis-data-node"
                key={index}
                style={
                  {
                    "--node-left-position": node.left,
                  } as React.CSSProperties
                }
              >
                <div className="analysis-interactive-card">
                  <div className="node-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {node.icon}
                    </svg>
                  </div>
                  <h3 className="node-card-title">{node.title}</h3>
                </div>
                <div className="node-connector-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process steps={ABOUT_PROCESS_STEPS} tag="HOW WE WORK">
        <div className="container" style={{ marginTop: 60 }}>
          <AboutCardsSlider />
        </div>
      </Process>

      <Testimonials
        items={ABOUT_TESTIMONIALS}
        tag="WHAT PEOPLE SAY"
        description="Don't just take our word for it. Patients and healthcare professionals across the country have trusted AAA DME Inc to simplify their medical equipment journey — from eligibility checks to home delivery."
      />

      <Faq entries={ABOUT_FAQ} tag="COMMON QUESTIONS" />

      <TickerBanner />
    </>
  );
}
