import Accordion, { type AccordionEntry } from "@/components/sections/Accordion";
import DiscoverTag from "@/components/sections/DiscoverTag";

/** Homepage question set. The About page passes its own. */
export const HOME_FAQ_ENTRIES: AccordionEntry[] = [
  {
    question: "What is a CGM and how does it work?",
    answer:
      "A Continuous Glucose Monitor (CGM) is a small wearable device that tracks your glucose levels throughout the day and night. It uses a tiny sensor placed just under your skin, usually on your arm or stomach, and sends readings to a smartphone or monitor—no constant finger pricks needed.",
  },
  {
    question: "Does using a CGM hurt?",
    answer:
      "Most people say they barely feel the sensor being applied. Once in place, it's discreet and comfortable to wear, and it automatically tracks your glucose without repeated pricking.",
  },
  {
    question: "Can hospital beds be adjusted for comfort?",
    answer:
      "Absolutely. Most hospital beds allow adjustments to the head, foot, and overall height, making them more comfortable and supportive for both patients and caregivers.",
  },
  {
    question: "What are medical braces used for?",
    answer:
      "Medical braces provide support, stability, and pain relief for conditions like arthritis, sports injuries, post-surgical recovery, and joint or muscle weakness.",
  },
  {
    question: "How do I know which brace is right for me?",
    answer:
      "Your doctor or healthcare provider will recommend the appropriate type of brace based on your condition, whether it's for your knee, back, wrist, or another area.",
  },
  {
    question: "What products does Aaadmeinc help patients access?",
    answer:
      "We specialize in connecting patients with essential medical equipment, including wheelchairs, walkers,",
  },
];

interface Props {
  entries?: AccordionEntry[];
  /** Eyebrow label above the heading. */
  tag?: React.ReactNode;
}

export default function Faq({ entries = HOME_FAQ_ENTRIES, tag }: Props) {
  return (
    <section className="faq-section">
      <div className="container faq-grid">
        <div className="faq-left">
          <div className="faq-sticky-wrapper">
            <div className="faq-image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/images/faq-cover.svg"
                alt="Frequently asked questions"
              />
            </div>
          </div>
        </div>

        <div className="faq-right">
          <DiscoverTag>{tag}</DiscoverTag>
          <h2 className="faq-main-title">
            Answers Of Your
            <br />
            Questions
          </h2>
          <Accordion entries={entries} />
        </div>
      </div>
    </section>
  );
}
