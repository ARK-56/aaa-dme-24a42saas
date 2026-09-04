import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import InnerHero from "@/components/layout/InnerHero";
import { DISCOVER_TAGLINE } from "@/components/sections/DiscoverTag";
import TickerBanner from "@/components/sections/TickerBanner";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <InnerHero
        backgroundImage="/assets/images/images/hero-contact.svg"
        heading="It's So Nice To Meet You!"
        tag={DISCOVER_TAGLINE}
      />

      <section className="contact-form-section">
        <div className="contact-bg-gradient-wash" />

        <div className="container contact-layout-grid">
          <div className="contact-info-left">
            <h1 className="contact-main-heading">
              Any Query?
              <br />
              Please Let Us Know.
            </h1>
            <p className="contact-sub-description">
              Fill out the attached form and we will contact you within 24 hours
              to get to know you and schedule a free meeting with you.
            </p>
          </div>

          <div className="contact-form-right">
            <ContactForm />
          </div>
        </div>
      </section>

      <TickerBanner />
    </>
  );
}
