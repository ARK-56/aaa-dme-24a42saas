import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";
import { BLOG_CARD_ORDER, BLOG_POSTS } from "@/lib/blogs";

export const metadata: Metadata = { title: "Blogs" };

const CARDS = BLOG_CARD_ORDER.map((i) => BLOG_POSTS[i]);

export default function BlogsPage() {
  const firstRow = CARDS.slice(0, 3);
  const secondRow = CARDS.slice(3);

  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-blog.svg"
        heading="Our Blogs & Insights"
        tag={DISCOVER_TAGLINE}
      />

      <section className="blogs-section">
        <div className="container">
          <div className="blogs-grid-container">
            {firstRow.map((post, index) => (
              <BlogCard key={`${post.slug}-${index}`} post={post} />
            ))}
          </div>
          <div className="blogs-grid-container margin-top-40">
            {secondRow.map((post, index) => (
              <BlogCard key={`${post.slug}-row2-${index}`} post={post} />
            ))}
          </div>
        </div>
      </section>

      <TickerBanner />
    </>
  );
}
