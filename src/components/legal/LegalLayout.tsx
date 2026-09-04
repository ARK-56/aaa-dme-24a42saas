import DiscoverTag from "@/components/sections/DiscoverTag";

interface Props {
  title: string;
  tagline: string;
  /** Shown under the tagline so readers can see how current the document is. */
  lastUpdated: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for the privacy and terms pages: sticky title pane on the left,
 * scrolling document body on the right.
 */
export default function LegalLayout({
  title,
  tagline,
  lastUpdated,
  children,
}: Props) {
  return (
    <section className="legal-document-section">
      <div className="container legal-split-grid">
        <aside className="legal-sticky-title-pane">
          <div style={{ marginTop: 10 }}>
            <DiscoverTag emerald>YOUR HEALTH, OUR PRIORITY.</DiscoverTag>
          </div>
          <h1 className="legal-master-page-title">{title}</h1>
          <p className="legal-master-page-tagline">{tagline}</p>
          <p
            className="legal-master-page-tagline"
            style={{ fontWeight: 700, marginTop: 12 }}
          >
            Last updated: {lastUpdated}
          </p>
        </aside>

        <main className="legal-content-scroll-pane">{children}</main>
      </div>
    </section>
  );
}

/** One titled section of a legal document. */
export function LegalBlock({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-text-block">
      <h2 className="legal-section-heading">{heading}</h2>
      {children}
    </div>
  );
}
