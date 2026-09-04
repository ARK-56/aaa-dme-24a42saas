import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import type { BlogSummary } from "@/lib/blogs";

interface Props {
  post: BlogSummary;
  children: React.ReactNode;
}

/** Editorial chrome shared by every blog post: back link, headline, meta row. */
export default function BlogShell({ post, children }: Props) {
  return (
    <section className="blog-detail-section">
      <div className="container blog-editorial-container">
        <div className="blog-top-navigation">
          <Link href={ROUTES.blogs} className="btn-back-blogs">
            <span className="back-icon-arrow">←</span>
            <span>Back to Blogs</span>
          </Link>
        </div>

        <div className="blog-main-body">
          <header className="blog-post-header">
            <h1 className="blog-main-headline">
              {post.detailTitle ?? post.title}
            </h1>
            <div className="blog-meta-pills-row">
              <span className="meta-tag-category">
                {post.detailCategory ?? post.category}
              </span>
              <span className="meta-tag-date">{post.date}</span>
            </div>
          </header>

          <hr className="blog-editorial-divider" />

          {children}
        </div>
      </div>
    </section>
  );
}

/** Contextual insurance CTA the posts drop between sections. */
export function BlogInsuranceBanner({
  title,
  rightHeading,
  pills,
}: {
  title: React.ReactNode;
  rightHeading: React.ReactNode;
  pills: string[];
}) {
  return (
    <section className="insurance-banner-section" style={{ padding: "40px 0" }}>
      <div className="container" style={{ padding: 0 }}>
        <div className="insurance-banner-inner">
          <div className="banner-column-left">
            <h2 className="banner-main-title">{title}</h2>
            <Link href={ROUTES.contact} className="btn-verify-insurance">
              <span>Verify Your Insurance Now</span>
              <div className="verify-arrow-badge">
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
          <div className="banner-column-right">
            <h3 className="banner-right-heading">{rightHeading}</h3>
            <div className="banner-static-pills">
              {pills.map((pill) => (
                <span className="insurance-tag-pill" key={pill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogMediaFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="blog-editorial-media-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="blog-svg-media-asset" />
    </div>
  );
}

/** Inline link style the posts use inside body copy. */
export const inlineLinkStyle: React.CSSProperties = {
  color: "var(--accent-mint)",
  textDecoration: "none",
  fontWeight: 600,
};

export const greenLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#22c55e",
};
