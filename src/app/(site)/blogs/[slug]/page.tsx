import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/blog/BlogShell";
import CpapSuppliesCovered from "@/components/blog/posts/CpapSuppliesCovered";
import PortableOxygenConcentrators from "@/components/blog/posts/PortableOxygenConcentrators";
import WhatMakesAaaDmeDifferent from "@/components/blog/posts/WhatMakesAaaDmeDifferent";
import WheelchairFast from "@/components/blog/posts/WheelchairFast";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogs";

const POST_BODIES: Record<string, () => React.ReactElement> = {
  "cpap-supplies-covered": CpapSuppliesCovered,
  "wheelchair-fast": WheelchairFast,
  "portable-oxygen-concentrators-2025": PortableOxygenConcentrators,
  "what-makes-aaa-dme-different": WhatMakesAaaDmeDifferent,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return { title: post ? `Blog: ${post.title}` : "Blog" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Body = POST_BODIES[slug];

  if (!post || !Body) notFound();

  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-shop.svg"
        heading="Our Blogs & Insights"
        tag={DISCOVER_TAGLINE}
      />
      <BlogShell post={post}>
        <Body />
      </BlogShell>
      <TickerBanner />
    </>
  );
}
