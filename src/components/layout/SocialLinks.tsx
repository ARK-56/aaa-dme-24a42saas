interface Social {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export const SOCIALS: Social[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/aaadmesupply",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/AAA-DME-Medical-Supply/61563190737229/",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/aaadmeinc",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

interface Props {
  /** Class for the wrapping row, so each surface controls its own layout. */
  className?: string;
  /** Class for each icon anchor. */
  linkClassName?: string;
  size?: number;
}

/**
 * The three social profiles. Shared so the site footer and the mobile
 * navigation overlay cannot drift apart.
 */
export default function SocialLinks({
  className,
  linkClassName,
  size = 18,
}: Props) {
  return (
    <div className={className}>
      {SOCIALS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener"
          className={linkClassName}
          aria-label={social.name}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {social.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
