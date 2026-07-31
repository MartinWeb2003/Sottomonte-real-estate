'use client';

import { useState } from 'react';
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
import { submitContact, type FormState } from '@/lib/actions';

const initialState: FormState = { status: 'idle' };

const BUDGET_KEYS = [0, 1, 2, 3] as const;
const TIMELINE_KEYS = [0, 1, 2, 3] as const;

export function ContactForm() {
  const locale = useLocale();
  const t = useTranslations('contact');
  const tForms = useTranslations('forms');
  const [state, formAction] = useFormState(submitContact, initialState);
  const [interest, setInterest] = useState('buying');

  if (state.status === 'success') {
    return (
      <p className="text-base font-medium leading-relaxed text-navy" role="status">
        {t('success')}
      </p>
    );
  }

  return (
    <form action={formAction} className="relative space-y-6">
      <Honeypot />
      <Input name="name" label={tForms('name')} required autoComplete="name" />
      <div className="grid gap-6 md:grid-cols-2">
        <Input name="email" type="email" label={tForms('email')} required autoComplete="email" />
        <Input name="phone" type="tel" label={tForms('phone')} autoComplete="tel" />
      </div>
      <Select
        name="interest"
        label={t('interest')}
        defaultValue="buying"
        onChange={(e) => setInterest(e.target.value)}
      >
        <option value="buying">{t('interestBuying')}</option>
        <option value="selling">{t('interestSelling')}</option>
        <option value="other">{t('interestOther')}</option>
      </Select>

      {/* Lead qualification, only when the visitor is buying. Both optional:
          they save the first two emails of every exchange without adding
          required friction. */}
      {interest === 'buying' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Select name="budget" label={t('budget')} defaultValue="">
            <option value="">{t('optional')}</option>
            {BUDGET_KEYS.map((i) => (
              <option key={i} value={t(`budgetOptions.${i}`)}>
                {t(`budgetOptions.${i}`)}
              </option>
            ))}
          </Select>
          <Select name="timeline" label={t('timeline')} defaultValue="">
            <option value="">{t('optional')}</option>
            {TIMELINE_KEYS.map((i) => (
              <option key={i} value={t(`timelineOptions.${i}`)}>
                {t(`timelineOptions.${i}`)}
              </option>
            ))}
          </Select>
        </div>
      )}

      <Textarea name="message" label={tForms('message')} rows={5} required />
      <ConsentCheckbox privacyHref={`/${locale}/privacy`} />
      <FormStatusMessage state={state} />
      <TrustStrip />
      <SubmitButton label={tForms('submit')} />
    </form>
  );
}
