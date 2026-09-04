"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DiscoverTag from "@/components/sections/DiscoverTag";

export interface ProcessStep {
  title: string;
  body: string;
  icon: React.ReactNode;
}

/** Homepage step list. The About page passes its own set. */
export const HOME_PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Trusted Expertise",
    body: "We work exclusively with licensed providers and suppliers, ensuring patients receive safe, reliable, and medically approved equipment.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
  },
  {
    title: "Simplified Process",
    body: "We take the stress out of accessing medical equipment by guiding you through prescriptions, insurance approvals, and provider connections — so you can focus on your health.",
    icon: (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ),
  },
  {
    title: "Nationwide Reach",
    body: "No matter where you live, AAA DME connects you with the care and equipment you need, delivered directly to your home.",
    icon: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ),
  },
  {
    title: "Patient-Centered Care",
    body: "We put patients first — offering personalized guidance, helpful resources, and ongoing support to make healthcare access easier and more compassionate.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    title: "Insurance Support Included",
    body: "Our team coordinates directly with Medicare and other major insurers to handle billing, approvals, and paperwork on your behalf.",
    icon: <path d="M18 20V10M12 20V4M6 20v-6" />,
  },
  {
    title: "Real Results, Real People",
    body: "From diabetes management to joint recovery and lymphedema care, we've helped patients across the U.S. get the right equipment at the right time.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
];

interface Props {
  steps?: ProcessStep[];
  /** Eyebrow label above the heading. */
  tag?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Timeline whose steps light up as they scroll past 60% of the viewport, with
 * the connecting progress bar filling to match.
 */
export default function Process({
  steps: STEPS = HOME_PROCESS_STEPS,
  tag,
  children,
}: Props) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const track = useCallback(() => {
    const triggerPoint = window.innerHeight * 0.6;
    let active = -1;
    stepRefs.current.forEach((item, index) => {
      if (item && item.getBoundingClientRect().top < triggerPoint) {
        active = index;
      }
    });
    setActiveIndex(active);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track);
    track();
    return () => {
      window.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
    };
  }, [track]);

  const progress =
    activeIndex === -1 ? 0 : (activeIndex / (STEPS.length - 1)) * 100;

  return (
    <section className="process-section">
      <div className="container process-grid">
        <div className="process-left">
          <DiscoverTag>{tag}</DiscoverTag>
          <h2 className="process-main-title">
            Our Process, To
            <br />
            make your journey
            <br />
            smoother
          </h2>
        </div>

        <div className="process-right">
          <div className="timeline-line">
            <div
              className="timeline-progress"
              id="timeline-progress-bar"
              style={{ height: `${progress}%` }}
            />
          </div>

          {STEPS.map((step, index) => (
            <div
              key={step.title}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className={`process-step-item${index <= activeIndex ? " active" : ""}`}
              data-step={index + 1}
            >
              <div className="icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {step.icon}
                </svg>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
