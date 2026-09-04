import LegalLayout, { LegalBlock } from "@/components/legal/LegalLayout";

/**
 * Privacy policy written for AAA DME's actual business: an insurance-navigation
 * service that collects health information through the intake form.
 *
 * NOT LEGAL ADVICE. This needs review by a healthcare attorney before launch —
 * in particular the HIPAA business-associate position and the state-law rights
 * section, which depend on facts only AAA DME knows.
 */
export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      tagline="AAA DME Inc handles medical and insurance information every day. This policy explains what we collect, why we need it, who we share it with, and the choices you have."
      lastUpdated="September 5, 2026"
    >
      <LegalBlock heading="Who We Are">
        <p className="legal-body-copy">
          AAA DME Inc (&ldquo;AAA DME&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
          is a durable medical equipment navigation service based at 25 Elm Pl
          #401, Brooklyn, NY 11201. We help patients determine whether their
          insurance covers prescribed equipment, coordinate the paperwork with
          their physician and insurer, and connect them with licensed suppliers
          who fulfil the order.
        </p>
        <p className="legal-body-copy">
          This policy covers aaadmeinc.com and the services offered through it.
          It does not cover the practices of the physicians, insurers, or
          equipment suppliers we coordinate with, each of whom maintains its own
          privacy policy.
        </p>
      </LegalBlock>

      <LegalBlock heading="Information You Give Us Directly">
        <p className="legal-body-copy">
          Most of what we hold is information you type into a form. Depending on
          which parts of the service you use, that includes:
        </p>
        <ul className="legal-bullet-list">
          <li>
            <strong>Account details</strong> — your name, email address, and a
            password, created when you register.
          </li>
          <li>
            <strong>Coverage request details</strong> — the information on our
            medical intake form: your full name, date of birth, phone number,
            street address and ZIP code, Medicare or insurance ID, the equipment
            you are requesting, and any physician instructions you choose to add.
          </li>
          <li>
            <strong>Prescription documents</strong> — any prescription or
            clinical document you attach to a coverage request.
          </li>
          <li>
            <strong>Order and delivery details</strong> — the name, contact
            details, and shipping address you enter at checkout, and the record
            of what was ordered.
          </li>
          <li>
            <strong>Messages</strong> — anything you send us through the contact
            form, by email, or by phone.
          </li>
        </ul>
        <p className="legal-body-copy">
          Some of this is health information. We ask for it only where it is
          genuinely needed to check your eligibility or to complete a request,
          and you are never required to provide it in order to browse the site.
        </p>
      </LegalBlock>

      <LegalBlock heading="Information Collected Automatically">
        <p className="legal-body-copy">
          When you visit aaadmeinc.com we receive standard technical information
          that your browser sends: IP address, browser type and version, device
          and operating system, time zone, referring page, and the pages you view
          on our site. We use this to keep the site working, to diagnose faults,
          and to understand which pages people find useful. We do not use it to
          build advertising profiles.
        </p>
        <p className="legal-body-copy">
          Your cart, your signed-in session, and a local copy of the catalogue
          are stored in your own browser so the site works between visits. You
          can clear these at any time through your browser settings; doing so
          signs you out and empties your cart.
        </p>
      </LegalBlock>

      <LegalBlock heading="Why We Process Your Information">
        <p className="legal-body-copy">
          We use the information above to verify insurance eligibility and
          benefits; to obtain, complete, and submit the documentation your
          insurer requires; to coordinate with your prescribing physician; to
          pass a confirmed order to a licensed supplier for fulfilment; to keep
          you updated on the status of a request or delivery; to answer your
          questions; and to meet our own legal, tax, and record-keeping
          obligations.
        </p>
        <p className="legal-body-copy">
          We do not sell your personal information, and we do not share it with
          advertisers or data brokers.
        </p>
      </LegalBlock>

      <LegalBlock heading="Who We Share It With">
        <p className="legal-body-copy">
          We share only what is necessary, only with parties who need it to
          deliver the service you asked for:
        </p>
        <ul className="legal-bullet-list">
          <li>
            <strong>Your physician or their office</strong>, to obtain or confirm
            a prescription and supporting documentation.
          </li>
          <li>
            <strong>Your insurer</strong> — Medicare, Medicaid, or a private plan
            — to verify benefits and submit prior authorisation.
          </li>
          <li>
            <strong>The licensed supplier</strong> fulfilling your order, who
            needs your delivery details and the equipment specification.
          </li>
          <li>
            <strong>Service providers</strong> who operate parts of our
            infrastructure on our behalf, such as hosting and email delivery, and
            who are permitted to use the information only to provide that service
            to us.
          </li>
          <li>
            <strong>Legal recipients</strong>, where we are required or permitted
            by law to disclose information — for example in response to a
            subpoena or lawful government request, or to investigate fraud or
            protect someone&rsquo;s safety.
          </li>
        </ul>
      </LegalBlock>

      <LegalBlock heading="Health Information and HIPAA">
        <p className="legal-body-copy">
          Where AAA DME handles protected health information on behalf of a
          covered entity, we act as a business associate and handle that
          information in line with the HIPAA Privacy and Security Rules and the
          terms of the applicable business associate agreement.
        </p>
        <p className="legal-body-copy">
          Not every interaction with our site creates that relationship. Where it
          does not, we still apply the same handling standards described in this
          policy to any health information you give us.
        </p>
      </LegalBlock>

      <LegalBlock heading="How Long We Keep It">
        <p className="legal-body-copy">
          We keep coverage requests, orders, and the documents attached to them
          for as long as needed to provide the service and to satisfy the
          record-keeping periods that apply to healthcare and insurance records.
          Account details are kept while your account is open. When information
          is no longer needed for either purpose, we delete it or remove the
          details that identify you.
        </p>
      </LegalBlock>

      <LegalBlock heading="How We Protect It">
        <p className="legal-body-copy">
          Information is held on access-controlled servers, and we maintain
          administrative, technical, and physical safeguards intended to protect
          it against unauthorised access, use, alteration, and disclosure. Access
          within AAA DME is limited to staff who need it to do their job.
        </p>
        <p className="legal-body-copy">
          No method of transmission or storage is completely secure, and we
          cannot guarantee absolute security. If a breach affects your
          information, we will notify you and the relevant authorities as
          required by law.
        </p>
      </LegalBlock>

      <LegalBlock heading="Your Choices and Rights">
        <p className="legal-body-copy">
          You can ask us to give you a copy of the information we hold about you,
          correct anything inaccurate, delete information we no longer need to
          keep, or stop sending you non-essential email. To make a request,
          contact us using the details below; we may need to verify your identity
          before we act, particularly where health information is involved.
        </p>
        <p className="legal-body-copy">
          Depending on where you live, you may have additional rights under state
          privacy law. We honour those rights where they apply and will not treat
          you differently for exercising them.
        </p>
      </LegalBlock>

      <LegalBlock heading="Children">
        <p className="legal-body-copy">
          Our site is not directed to children under 13, and we do not knowingly
          collect their information from them directly. Where equipment is
          prescribed for a minor, we expect a parent or legal guardian to make
          the request and provide the information on their behalf.
        </p>
      </LegalBlock>

      <LegalBlock heading="Links to Other Websites">
        <p className="legal-body-copy">
          Our site links to sites we do not own or control, including supplier
          and insurer websites. We are not responsible for their privacy
          practices, and we encourage you to read the privacy statement of any
          site you visit from ours.
        </p>
      </LegalBlock>

      <LegalBlock heading="Changes to This Policy">
        <p className="legal-body-copy">
          We may update this policy as our service changes or as the law
          requires. The date at the top of this page shows when it was last
          revised, and material changes will be highlighted on the site.
        </p>
      </LegalBlock>

      <LegalBlock heading="Contact Us">
        <p className="legal-body-copy">
          For questions about this policy, or to exercise any of the rights
          described above, reach us at:
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
