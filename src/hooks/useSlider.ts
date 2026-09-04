"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface Options {
  /** Number of cards on the track. */
  count: number;
  /** Column gap between cards, in px, matching the CSS for that track. */
  gap: number;
  /** Advance automatically every N ms. Omit for a manual-only slider. */
  autoPlayMs?: number;
}

interface Slider {
  trackRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  index: number;
  maxIndex: number;
  /** Track transform for the current index. */
  offset: number;
  next: () => void;
  prev: () => void;
  atStart: boolean;
  atEnd: boolean;
  /** Fill ratio for the theme's progress bar, in percent. */
  progress: number;
}

/**
 * Horizontal card slider used by the featured-products, related-products and
 * blogs rails. Mirrors the theme's arithmetic: the number of steps is the card
 * count minus however many cards fit in the viewport, and both arrows wrap.
 *
 * (The about-cards rail is not built on this — it is a pure CSS marquee.)
 */
export function useSlider({ count, gap, autoPlayMs }: Options): Slider {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState({ cardWidth: 0, maxIndex: 0 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    if (!track || !viewport || !firstCard || count === 0) {
      setMetrics({ cardWidth: 0, maxIndex: 0 });
      return;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const visibleWidth = viewport.getBoundingClientRect().width;
    const perView = Math.floor(visibleWidth / (cardWidth + gap)) || 1;
    setMetrics({ cardWidth, maxIndex: Math.max(0, count - perView) });
  }, [count, gap]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Clamp when the catalog shrinks or the viewport grows.
  useEffect(() => {
    setIndex((current) => Math.min(current, metrics.maxIndex));
  }, [metrics.maxIndex]);

  const next = useCallback(() => {
    setIndex((current) => (current < metrics.maxIndex ? current + 1 : 0));
  }, [metrics.maxIndex]);

  const prev = useCallback(() => {
    setIndex((current) => (current > 0 ? current - 1 : metrics.maxIndex));
  }, [metrics.maxIndex]);

  useEffect(() => {
    if (!autoPlayMs || metrics.maxIndex === 0) return;
    const timer = setInterval(() => {
      setIndex((current) => (current < metrics.maxIndex ? current + 1 : 0));
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, metrics.maxIndex]);

  return {
    trackRef,
    viewportRef,
    index,
    maxIndex: metrics.maxIndex,
    offset: index * (metrics.cardWidth + gap),
    next,
    prev,
    atStart: index === 0,
    atEnd: index >= metrics.maxIndex,
    progress:
      metrics.maxIndex === 0 ? 100 : (index / metrics.maxIndex) * 75 + 25,
  };
}
