import { COMPANY } from "@/lib/company";

interface Props {
  /** Omit the ", USA" suffix — used in running prose. */
  short?: boolean;
  className?: string;
}

/**
 * The office address, always linked to the Google Maps listing. Used everywhere
 * the address appears so it stays clickable and consistent site-wide.
 */
export default function AddressLink({ short = false, className }: Props) {
  return (
    <a
      href={COMPANY.address.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`Open ${COMPANY.address.display} in Google Maps`}
    >
      {short ? COMPANY.address.short : COMPANY.address.display}
    </a>
  );
}
