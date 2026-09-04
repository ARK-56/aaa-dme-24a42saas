import DiscoverTag from "@/components/sections/DiscoverTag";

/**
 * Legal page body. The theme shipped identical copy on the privacy and terms
 * pages — only the title differs — so both routes render this one component.
 *
 * The wording is still the theme's generic boilerplate (rebranded to AAA DME);
 * it has not been reviewed by anyone qualified. The terms page in particular
 * needs its own text rather than a copy of the privacy policy.
 */
export default function LegalDocument({ title }: { title: string }) {
  return (
    <section className="legal-document-section">
      <div className="container legal-split-grid">
        <aside className="legal-sticky-title-pane">
          <div style={{ marginTop: 10 }}>
            <DiscoverTag emerald />
          </div>
          <h1 className="legal-master-page-title">{title}</h1>
          <p className="legal-master-page-tagline">
            AAA DME is committed to protecting your privacy and ensuring the
            security of your personal information. This Privacy Policy outlines
            how we collect, use, and safeguard your data.
          </p>
        </aside>

        <main className="legal-content-scroll-pane">
          <div className="legal-text-block">
            <h2 className="legal-section-heading">
              Personal Information We Collect
            </h2>
            <p className="legal-body-copy">
              When you visit aaadmeinc.com, we automatically collect certain
              information about your device, including information about your web
              browser, IP address, time zone, and some of the installed cookies
              on your device. Additionally, as you browse the Site, we collect
              information about the individual web pages or products you view,
              what websites or search terms referred you to the Site, and how you
              interact with the Site.
            </p>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Why Do We Process Your Data?</h2>
            <p className="legal-body-copy">
              Our top priority is customer data security, and, as such, we may
              process only minimal user data, only as much as it is absolutely
              necessary to maintain the website. Information collected
              automatically is used only to identify potential cases of abuse and
              establish statistical information regarding website usage. This
              statistical information is not otherwise aggregated in such a way
              that it would identify any particular user of the system.
            </p>
            <p className="legal-body-copy">
              You can visit the website without telling us who you are or
              revealing any information, by which someone could identify you as a
              specific, identifiable individual. If, however, you wish to use some
              of the website&apos;s features, or you wish to receive our
              newsletter or provide other details by filling a form, you may
              provide personal data to us, such as your email, first name, last
              name, city of residence, organization, telephone number.
            </p>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Your Rights</h2>
            <p className="legal-body-copy">
              If you are a European resident, you have the following rights
              related to your personal data:
            </p>
            <ul className="legal-bullet-list">
              <li>The right to be informed.</li>
              <li>The right of access.</li>
              <li>The right to rectification.</li>
              <li>The right to erasure.</li>
              <li>The right to restrict processing.</li>
              <li>The right to data portability.</li>
              <li>The right to object.</li>
              <li>
                Rights in relation to automated decision-making and profiling.
              </li>
            </ul>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Links To Other Websites</h2>
            <p className="legal-body-copy">
              Our website may contain links to other websites that are not owned
              or controlled by us. Please be aware that we are not responsible for
              such other websites or third parties&apos; privacy practices. We
              encourage you to be aware when you leave our website and read the
              privacy statements of each website that may collect personal
              information.
            </p>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Information Security</h2>
            <p className="legal-body-copy">
              We secure information you provide on computer servers in a
              controlled, secure environment, protected from unauthorized access,
              use, or disclosure. We keep reasonable administrative, technical,
              and physical safeguards to protect against unauthorized access, use,
              modification, and personal data disclosure in its control and
              custody.
            </p>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Legal Disclosure</h2>
            <p className="legal-body-copy">
              We will disclose any information we collect, use or receive if
              required or permitted by law, such as to comply with a subpoena or
              similar legal process, and when we believe in good faith that
              disclosure is necessary to protect our rights, protect your safety
              or the safety of others, investigate fraud, or respond to a
              government request.
            </p>
          </div>

          <div className="legal-text-block">
            <h2 className="legal-section-heading">Contact Us</h2>
            <p className="legal-body-copy">
              If you would like to contact us to understand more about this Policy
              or wish to contact us concerning any matter relating to individual
              rights and your Personal Information, you may send an email to:
            </p>
            <ul className="legal-contact-list">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:aaadmeinc@gmail.com"
                  className="legal-inline-link"
                >
                  aaadmeinc@gmail.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+13475990043" className="legal-inline-link">
                  (347) 599 0043
                </a>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </section>
  );
}
