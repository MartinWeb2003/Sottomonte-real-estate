import { AGENCY } from '@/lib/utils';

/**
 * Renders the `<link>` chunk in the "coming for viewings" strings as an
 * outbound link to the apartment site.
 *
 * `noopener noreferrer` because it leaves the domain, and deliberately NOT
 * nofollow: this is a genuine related business, not paid placement, so
 * marking it up as untrusted would be wrong.
 */
export function apartmentLink(chunks: React.ReactNode) {
  return (
    <a
      href={AGENCY.apartmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="border-b border-gold text-navy transition-colors hover:border-navy"
    >
      {chunks}
    </a>
  );
}
