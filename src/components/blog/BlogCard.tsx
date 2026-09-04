import Link from "next/link";
import { blogHref } from "@/lib/routes";
import type { BlogSummary } from "@/lib/blogs";

export default function BlogCard({ post }: { post: BlogSummary }) {
  return (
    <div className="blog-slide-card">
      <div className="blog-solid-overlay" />

      <div className="blog-card-inner">
        <h3 className="blog-title">
          <Link href={blogHref(post.slug)} className="blog-title-link">
            {post.title}
          </Link>
        </h3>

        <div className="blog-card-bottom">
          <div className="read-time-row">
            <span className="read-time-num">
              {String(post.minutes).padStart(2, "0")}
            </span>
            <span className="read-time-label">Minutes</span>
          </div>
          <div className="card-divider-line" />
          <div className="meta-footer-row">
            <span className="meta-type">{post.category}</span>
            <span className="meta-date">{post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
