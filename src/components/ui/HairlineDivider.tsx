import { cn } from '@/lib/utils';

/**
 * Thin 1px gold hairline — the signature accent. Used as section divider,
 * under headings, and as column top-borders.
 */
export function HairlineDivider({
  className,
  width = 'w-full',
}: {
  className?: string;
  /** e.g. "w-[60px]" for the short centered variant */
  width?: string;
}) {
  return <div aria-hidden className={cn('h-px bg-gold', width, className)} />;
}
