export const DISCOVER_TAGLINE =
  "DISCOVER WHAT YOUR BODY HAS BEEN COMMUNICATING TO YOU.";

interface Props {
  /** The emerald variant is used on dark backgrounds. */
  emerald?: boolean;
  children?: React.ReactNode;
}

/** The asterisk + eyebrow label that heads most sections of the theme. */
export default function DiscoverTag({ emerald = false, children }: Props) {
  return (
    <div className={`discover-tag${emerald ? " text-emerald" : ""}`}>
      <svg
        className="asterisk-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span>{children ?? DISCOVER_TAGLINE}</span>
    </div>
  );
}
