'use client';

import { useFormState } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { Input, Select, Textarea } from '@/components/ui/Input';
import {
  ConsentCheckbox,
  FormStatusMessage,
  Honeypot,
  SubmitButton,
} from './FormBits';
import { TrustStrip } from './TrustStrip';
import { submitSellerLead, type FormState } from '@/lib/actions';

const initialState: FormState = { status: 'idle' };
const TYPES = ['house', 'apartment', 'land', 'stone-ruin'] as const;

export function SellerLeadForm() {
  const locale = useLocale();
  const t = useTranslations('selling');
  const tForms = useTranslations('forms');
  const tTypes = useTranslations('properties.types');
  const [state, formAction] = useFormState(submitSellerLead, initialState);

  if (state.status === 'success') {
    return <FormStatusMessage state={state} />;
  }

  return (
    <form action={formAction} className="relative space-y-6">
      <Honeypot />
      <div className="grid gap-6 md:grid-cols-3">
        <Input name="location" label={t('formLocation')} required />
        <Select name="propertyType" label={t('formType')} required defaultValue="">
          <option value="" disabled />
          {TYPES.map((value) => (
            <option key={value} value={value}>
              {tTypes(value)}
            </option>
          ))}
        </Select>
        <Input name="size" label={t('formSize')} inputMode="numeric" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Input name="name" label={tForms('name')} required autoComplete="name" />
        <Input name="email" type="email" label={tForms('email')} required autoComplete="email" />
        <Input name="phone" type="tel" label={tForms('phone')} autoComplete="tel" />
      </div>
      <Textarea name="message" label={t('formMessage')} rows={4} />
      <Textarea
        name="note"
        label={tForms('note')}
        placeholder={tForms('notePlaceholder')}
        rows={3}
      />
      <ConsentCheckbox privacyHref={`/${locale}/privacy`} />
      <FormStatusMessage state={state} />
      <TrustStrip />
      <SubmitButton label={tForms('submit')} />
    </form>
  );
}
