import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import type { ComponentProps } from 'react';

/** Backgrounds are white or navy only. `white` is the solid CTA on navy
 *  surfaces, `navy` the solid CTA on white ones. */
type Variant = 'white' | 'ghost-white' | 'navy' | 'ghost-navy';

const VARIANTS: Record<Variant, string> = {
  white: 'bg-white text-navy hover:bg-white/90',
  'ghost-white':
    'border border-white/60 text-white hover:border-white hover:bg-white/10',
  navy: 'bg-navy text-white hover:bg-navy-soft',
  'ghost-navy':
    'border border-navy/30 text-navy hover:border-navy hover:bg-navy/5',
};

const BASE =
  'inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 ease-yacht disabled:opacity-50 disabled:pointer-events-none';

export function Button({
  variant = 'navy',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return (
    <button className={cn(BASE, VARIANTS[variant], className)} {...props} />
  );
}

export function ButtonLink({
  variant = 'navy',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(BASE, VARIANTS[variant], className)} {...props} />;
}
