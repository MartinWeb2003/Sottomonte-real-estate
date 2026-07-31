import { cn } from '@/lib/utils';

/**
 * Removable gold-outline chip — used for active filters on the grid page.
 */
export function Chip({
  children,
  onRemove,
  className,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border border-gold px-3 py-1 text-xs font-medium text-navy',
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove filter"
          className="ml-0.5 text-muted transition-colors hover:text-navy"
        >
          ×
        </button>
      )}
    </span>
  );
}
