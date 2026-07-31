'use client';

import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import type { FormState } from '@/lib/actions';

/** Hidden honeypot field — bots fill it, humans never see it. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] top-auto" aria-hidden>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** GDPR consent checkbox, required on all forms. */
export function ConsentCheckbox({ privacyHref }: { privacyHref: string }) {
  const t = useTranslations('forms');
  return (
    <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
      <input
        type="checkbox"
        name="consent"
        required
        className="mt-0.5 accent-[#C9A96A]"
      />
      <span>
        {t.rich('consent', {
          link: (chunks) => (
            <a href={privacyHref} className="underline underline-offset-2 hover:text-navy">
              {chunks}
            </a>
          ),
        })}
      </span>
    </label>
  );
}

export function SubmitButton({
  label,
  variant = 'navy',
  className,
}: {
  label: string;
  variant?: 'white' | 'navy';
  className?: string;
}) {
  const { pending } = useFormStatus();
  const t = useTranslations('forms');
  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? t('sending') : label}
    </Button>
  );
}

export function FormStatusMessage({ state }: { state: FormState }) {
  const t = useTranslations('forms');
  if (state.status === 'idle') return null;
  return (
    <p
      role="status"
      className={
        state.status === 'success'
          ? 'text-sm font-medium text-navy'
          : 'text-sm font-medium text-red-800'
      }
    >
      {t(state.messageKey ?? 'error')}
    </p>
  );
}
