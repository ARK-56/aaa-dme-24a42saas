import Link from "next/link";
import LegalLayout, { LegalBlock } from "@/components/legal/LegalLayout";
import { ROUTES } from "@/lib/routes";

/**
 * Terms of service. The theme shipped the privacy policy under this title; this
 * is a real document covering what the site actually does — coverage requests,
 * verification codes, ordering, and fulfilment by third-party suppliers.
 *
 * NOT LEGAL ADVICE. Needs attorney review before launch, especially the
 * returns, liability, and arbitration sections.
 */
export default function TermsConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      tagline="These terms govern your use of aaadmeinc.com and the coverage navigation service offered through it. By using the site, you agree to them."
      lastUpdated="September 5, 2026"
    >
      <LegalBlock heading="About These Terms">
        <p className="legal-body-copy">
          These Terms &amp; Conditions are an agreement between you and AAA DME
          Inc, 25 Elm Pl #401, Brooklyn, NY 11201. They apply whenever you browse
          aaadmeinc.com, create an account, submit a coverage request, or place
          an order. If you do not agree with them, please do not use the site.
        </p>
        <p className="legal-body-copy">
          Our{" "}
          <Link href={ROUTES.privacyPolicy} className="legal-inline-link">
            Privacy Policy
          </Link>{" "}
          explains how we handle your information and forms part of these terms.
        </p>
      </LegalBlock>

      <LegalBlock heading="What AAA DME Does — and Does Not Do">
        <p className="legal-body-copy">
          AAA DME is a navigation and advocacy service. We verify insurance
          eligibility, assemble and submit the documentation your plan requires,
          coordinate with your prescribing physician, and connect you with
          licensed suppliers who fulfil and ship your equipment.
        </p>
        <p className="legal-body-copy">
          We are not a healthcare provider, and nothing on this site is medical
          advice, diagnosis, or treatment. We do not prescribe equipment and we
          cannot tell you what is clinically right for you — those decisions
          belong to you and your physician. We are also not your insurer, and we
          do not decide what your plan covers.
        </p>
        <p className="legal-body-copy">
          Equipment is supplied by independent, licensed third-party suppliers.
          They are responsible for the condition of the equipment they ship and
          for the fulfilment of your order.
        </p>
      </LegalBlock>

      <LegalBlock heading="Eligibility and Your Account">
        <p className="legal-body-copy">
          You must be at least 18 and able to enter a binding agreement to create
          an account. If you are acting for a patient as their parent, guardian,
          or authorised caregiver, you confirm you have the authority to share
          their information and to make requests on their behalf.
        </p>
        <p className="legal-body-copy">
          You are responsible for the accuracy of what you submit and for keeping
          your login credentials confidential. Tell us promptly if you believe
          someone else has accessed your account. We may suspend or close an
          account that is being used to submit false information or to misuse the
          service.
        </p>
      </LegalBlock>

      <LegalBlock heading="Coverage Requests and Verification Codes">
        <p className="legal-body-copy">
          When you submit a coverage request, our team reviews it and checks your
          benefits with your insurer. A request is not an order, and submitting
          one does not guarantee that your plan will cover the equipment.
        </p>
        <p className="legal-body-copy">
          If your request is approved, we issue a verification code tied to that
          specific item and your account. Entering the code in your cart unlocks
          checkout for that item. Codes expire 24 hours after they are issued,
          can be used once, and are not transferable. Changing the quantity of an
          item invalidates the code for that line, and the request must be
          re-verified.
        </p>
        <p className="legal-body-copy">
          We may decline a request — for example where documentation is missing,
          where the plan does not cover the item, or where the request cannot be
          substantiated. A declined request is visible in your account.
        </p>
      </LegalBlock>

      <LegalBlock heading="Prescriptions and Documentation">
        <p className="legal-body-copy">
          Most durable medical equipment requires a valid prescription. By
          submitting a prescription or clinical document, you confirm it is
          genuine, relates to you or to the patient you are authorised to act
          for, and has not been altered. Submitting falsified documentation to
          obtain equipment or insurance benefits is a serious matter and may be
          reported to the relevant authorities.
        </p>
        <p className="legal-body-copy">
          You authorise us to contact your physician and your insurer as needed
          to obtain, complete, or confirm the documentation your request
          requires.
        </p>
      </LegalBlock>

      <LegalBlock heading="Pricing, Orders, and Payment">
        <p className="legal-body-copy">
          Prices shown on the site are in US dollars and are indicative. What you
          ultimately pay depends on your plan&rsquo;s coverage determination,
          your deductible, and any co-insurance or co-payment your insurer
          applies. We tell you the expected cost before an order is confirmed.
        </p>
        <p className="legal-body-copy">
          Placing an order is an offer to purchase, which we or the fulfilling
          supplier may accept or decline. We may cancel an order where an item is
          out of stock, where a price or product description was published in
          error, where coverage is subsequently denied, or where we suspect
          fraud. If we cancel an order you have paid for, we refund it.
        </p>
        <p className="legal-body-copy">
          Stock levels and product details are kept as accurate as we can make
          them, but we do not warrant that every description, price, or
          availability indicator on the site is free of error.
        </p>
      </LegalBlock>

      <LegalBlock heading="Delivery, Returns, and Cancellations">
        <p className="legal-body-copy">
          Delivery timescales depend on the item and the supplier. Standard
          ground shipping typically arrives within 3–5 business days; freight and
          white-glove items are scheduled directly with you. Risk in the
          equipment passes to you on delivery.
        </p>
        <p className="legal-body-copy">
          You may cancel an order at no cost at any point before it ships.
          Because much of this equipment is personal medical hardware, returns
          after delivery are subject to the fulfilling supplier&rsquo;s policy
          and to applicable hygiene and safety rules; some items cannot be
          returned once opened or used. If equipment arrives damaged, defective,
          or is not what was ordered, contact us within 7 days of delivery and we
          will arrange a replacement or refund with the supplier.
        </p>
        <p className="legal-body-copy">
          Nothing here limits any statutory rights you have that cannot be
          excluded.
        </p>
      </LegalBlock>

      <LegalBlock heading="Safe Use of Equipment">
        <p className="legal-body-copy">
          Durable medical equipment must be set up and used according to the
          manufacturer&rsquo;s instructions and your clinician&rsquo;s guidance.
          Read the documentation supplied with your equipment before using it,
          and contact your clinician if anything about the fit, setup, or
          operation is unclear. If you experience a medical emergency, call 911
          or your local emergency number.
        </p>
      </LegalBlock>

      <LegalBlock heading="Acceptable Use">
        <p className="legal-body-copy">
          Please use the site only for its intended purpose. Do not attempt to
          access accounts or data that are not yours, probe or disrupt the
          service, submit false or misleading information, scrape the site, or
          copy its content for commercial use without our permission.
        </p>
      </LegalBlock>

      <LegalBlock heading="Our Content">
        <p className="legal-body-copy">
          The text, images, layout, and code of this site belong to AAA DME Inc
          or our licensors. You may use them for your own personal, non-
          commercial purposes in connection with the service. Product images and
          manufacturer names remain the property of their respective owners.
        </p>
      </LegalBlock>

      <LegalBlock heading="Disclaimers and Limits on Liability">
        <p className="legal-body-copy">
          The site is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. We do not warrant that it will be uninterrupted
          or error-free, that any coverage request will be approved, or that any
          particular outcome will follow from using the service.
        </p>
        <p className="legal-body-copy">
          To the fullest extent the law allows, AAA DME is not liable for
          indirect, incidental, or consequential losses, and our total liability
          arising out of the service is limited to the amount you paid us for the
          order the claim relates to. Nothing in these terms excludes liability
          for death or personal injury caused by our negligence, for fraud, or
          for anything else that cannot lawfully be excluded.
        </p>
      </LegalBlock>

      <LegalBlock heading="Changes to the Service and These Terms">
        <p className="legal-body-copy">
          We may change or discontinue parts of the site, and we may update these
          terms as the service or the law changes. The date at the top of this
          page shows when they were last revised. Continuing to use the site
          after a change means you accept the revised terms.
        </p>
      </LegalBlock>

      <LegalBlock heading="Governing Law">
        <p className="legal-body-copy">
          These terms are governed by the laws of the State of New York, and the
          state and federal courts located in Kings County, New York have
          jurisdiction over any dispute arising from them.
        </p>
      </LegalBlock>

      <LegalBlock heading="Contact Us">
        <p className="legal-body-copy">
          Questions about these terms, an order, or a coverage request:
        </p>
        <ul className="legal-contact-list">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:aaadmeinc@gmail.com" className="legal-inline-link">
              aaadmeinc@gmail.com
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a href="tel:+13475990043" className="legal-inline-link">
              (347) 599 0043
            </a>
          </li>
          <li>
            <strong>Post:</strong> AAA DME Inc, 25 Elm Pl #401, Brooklyn, NY
            11201, USA
          </li>
        </ul>
      </LegalBlock>
    </LegalLayout>
  );
}
