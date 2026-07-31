import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const FIELD_BASE =
  'w-full border-b border-navy/20 bg-transparent px-0 py-2.5 text-sm text-navy placeholder:text-muted/70 transition-colors duration-300 focus:border-gold focus:outline-none';

export function Input({
  label,
  className,
  id,
  ...props
}: ComponentProps<'input'> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      )}
      <input id={id} className={cn(FIELD_BASE, className)} {...props} />
    </label>
  );
}

export function Textarea({
  label,
  className,
  id,
  ...props
}: ComponentProps<'textarea'> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      )}
      <textarea
        id={id}
        rows={4}
        className={cn(FIELD_BASE, 'resize-none', className)}
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  className,
  id,
  children,
  ...props
}: ComponentProps<'select'> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      )}
      {/* appearance-none strips the native select chrome, which otherwise
          draws a full box around the field and breaks the hairline-underline
          look every other field in the form uses. The chevron is redrawn by
          hand because removing the appearance removes that too. */}
      <div className="relative">
        <select
          id={id}
          className={cn(FIELD_BASE, 'cursor-pointer appearance-none pr-6', className)}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-0 top-1/2 h-2 w-3 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1.5 6 6.5 11 1.5" />
        </svg>
      </div>
    </label>
  );
}
