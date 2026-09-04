"use client";

import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import DiscoverTag from "@/components/sections/DiscoverTag";
import { useSlider } from "@/hooks/useSlider";
import { BLOG_CARD_ORDER, BLOG_POSTS } from "@/lib/blogs";
import { ROUTES } from "@/lib/routes";

const CARDS = BLOG_CARD_ORDER.map((i) => BLOG_POSTS[i]);

export default function BlogsRail() {
  const slider = useSlider({
    count: CARDS.length,
    gap: 24,
    autoPlayMs: 5000,
  });

  return (
    <section className="blogs-section">
      <div className="container">
        <div className="blogs-header-row">
          <div className="blogs-header-left">
            <DiscoverTag />
            <h2 className="blogs-main-title">Our Blogs &amp; Insights</h2>
          </div>

          <div className="blogs-controls-side">
            <div className="blogs-nav-arrows">
              <button
                type="button"
                className={`blog-arrow-circle${slider.atStart ? "" : " active"}`}
                id="blog-prev-btn"
                aria-label="Slide Blogs Left"
                onClick={slider.prev}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className={`blog-arrow-circle${slider.atEnd ? "" : " active"}`}
                id="blog-next-btn"
                aria-label="Slide Blogs Right"
                onClick={slider.next}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link href={ROUTES.blogs} className="btn-view-all-blogs">
              <span>View All Blogs</span>
              <div className="view-all-arrow">
                <svg
                  width="14"
                  height="14"
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
        </div>

        <div className="blogs-slider-window" ref={slider.viewportRef}>
          <div
            className="blogs-slider-track"
            id="blogs-track"
            ref={slider.trackRef}
            style={{ transform: `translate3d(-${slider.offset}px, 0px, 0px)` }}
          >
            {CARDS.map((post, index) => (
              <BlogCard key={`${post.slug}-${index}`} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
