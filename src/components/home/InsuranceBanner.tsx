import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function InsuranceBanner() {
  return (
    <section className="insurance-banner-section">
      <div className="container">
        <div className="insurance-banner-inner">
          <div className="banner-column-left">
            <h2 className="banner-main-title">
              Not Sure If You Qualify? <br />
              We&apos;ll Help You Check <br /> without any hastle.
            </h2>

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
            <h3 className="banner-right-heading">
              Choose What You Need,
              <br />
              When You Need It
            </h3>

            <div className="banner-static-pills">
              <span className="insurance-tag-pill">Mobility Equipment</span>
              <span className="insurance-tag-pill">Self-Care Devices</span>
              <span className="insurance-tag-pill">Medical Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
