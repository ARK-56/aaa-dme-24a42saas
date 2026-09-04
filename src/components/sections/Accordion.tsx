"use client";

import { useEffect, useRef, useState } from "react";

export interface AccordionEntry {
  question: string;
  answer: string;
}

interface Props {
  entries: AccordionEntry[];
  /** Index open on first render; the theme opened the first question. */
  defaultOpen?: number;
}

/**
 * Single-open accordion. Panel height is measured and set inline so the CSS
 * max-height transition animates, exactly as the theme's script did.
 */
export default function Accordion({ entries, defaultOpen = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);

  const measure = () => {
    setHeights(panelRefs.current.map((panel) => panel?.scrollHeight ?? 0));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [entries]);

  return (
    <div className="accordion-group">
      {entries.map((entry, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={entry.question}
            className={`accordion-item${isOpen ? " active" : ""}`}
          >
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="faq-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="faq-question">{entry.question}</span>
              <span className="faq-icon">
                <span className="icon-line horizontal" />
                <span className="icon-line vertical" />
              </span>
            </button>
            <div
              ref={(el) => {
                panelRefs.current[index] = el;
              }}
              className="accordion-panel"
              style={{ maxHeight: isOpen ? `${heights[index] ?? 0}px` : "0px" }}
            >
              <div className="panel-content">{entry.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
