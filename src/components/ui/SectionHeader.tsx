import { cn } from '@/lib/utils';

/**
 * Section heading, left-aligned by default (editorial, not centered).
 * Every section heading on the site goes through this component.
 * Section-name eyebrows were removed sitewide, so there is no eyebrow slot.
 */
export function SectionHeader({
  title,
  subtitle,
  align = 'left',
  dark = false,
  className,
}: {
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <h2
        className={cn(
          'font-display text-3xl leading-tight md:text-[40px] md:leading-[1.15]',
          dark ? 'text-white' : 'text-navy'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed md:text-lg',
            dark ? 'text-white/70' : 'text-muted'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
