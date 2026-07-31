'use client';

import { useFormState } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { Input, Textarea } from '@/components/ui/Input';
import {
  ConsentCheckbox,
  FormStatusMessage,
  Honeypot,
  SubmitButton,
} from './FormBits';
import { TrustStrip } from './TrustStrip';
import { submitBuyerWishlist, type FormState } from '@/lib/actions';

const initialState: FormState = { status: 'idle' };

/**
 * The highest-value lead element on the site — short buyer wishlist,
 * shown under the properties grid ("most of our portfolio is off-market").
 */
export function BuyerWishlistForm() {
  const locale = useLocale();
  const t = useTranslations('properties.bottomCta');
  const tForms = useTranslations('forms');
  const [state, formAction] = useFormState(submitBuyerWishlist, initialState);

  if (state.status === 'success') {
    return <FormStatusMessage state={state} />;
  }

  return (
    <form action={formAction} className="relative space-y-5">
      <Honeypot />
      <Textarea
        name="lookingFor"
        label={t('lookingFor')}
        placeholder={t('lookingForPlaceholder')}
        rows={3}
        required
      />
      <div className="grid gap-5 md:grid-cols-3">
        <Input name="budget" label={t('budget')} inputMode="numeric" />
        <Input name="name" label={tForms('name')} required autoComplete="name" />
        <Input name="email" type="email" label={tForms('email')} required autoComplete="email" />
      </div>
      <Input name="phone" type="tel" label={tForms('phone')} autoComplete="tel" className="md:max-w-xs" />
      <ConsentCheckbox privacyHref={`/${locale}/privacy`} />
      <FormStatusMessage state={state} />
      <TrustStrip />
      <SubmitButton label={t('submit')} variant="navy" />
    </form>
  );
}
