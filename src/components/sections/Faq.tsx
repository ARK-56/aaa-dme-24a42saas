import Accordion, { type AccordionEntry } from "@/components/sections/Accordion";
import DiscoverTag from "@/components/sections/DiscoverTag";

/**
 * Homepage question set — the questions patients actually ask before starting
 * a request. The About page passes its own, more company-focused set.
 */
export const HOME_FAQ_ENTRIES: AccordionEntry[] = [
  {
    question: "How do I find out if my insurance covers my equipment?",
    answer:
      "Send us a coverage request and our team checks it directly with your plan — Medicare, Medicaid or private. You get a clear answer on whether the item is covered and what it will cost you, usually within a day or two, before you commit to anything. The check itself is free and there is no obligation to order.",
  },
  {
    question: "Do I need a prescription before I can order?",
    answer:
      "Most durable medical equipment does, including hospital beds, CPAP and BiPAP machines, oxygen concentrators and power wheelchairs. Items like bath safety equipment, canes and rollators generally do not. If you need a prescription and do not have one yet, we contact your physician's office and gather the documentation for you — you do not have to chase signatures or send faxes.",
  },
  {
    question: "How long does the whole process take?",
    answer:
      "Eligibility checks usually come back within a day or two. Where a prescription or prior authorisation is needed, approval typically takes three to five business days once your physician responds. After that, standard ground shipping is three to five business days; freight and white-glove items are scheduled with you directly.",
  },
  {
    question: "What does the verification code in my cart do?",
    answer:
      "When we confirm coverage for a specific item, we issue you a verification code for it. Entering that code against the item in your cart unlocks checkout, which is how we make sure nothing is ordered before coverage is settled. Codes are valid for 24 hours, work once, and are tied to your account and that product.",
  },
  {
    question: "What if my request is declined?",
    answer:
      "Declined requests appear in your account with the reason. A denial is often down to missing or insufficient documentation rather than a final no, and in many cases it can be resolved with additional notes from your physician or an appeal. Contact us and we will tell you honestly whether it is worth pursuing.",
  },
  {
    question: "Who actually delivers and services the equipment?",
    answer:
      "AAA DME is an independent navigator, not a supplier. Once coverage is confirmed we connect you with a licensed, accredited supplier who ships the equipment and handles warranty service. We stay involved for resupply scheduling, replacement parts, and any coverage questions that come up later.",
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
