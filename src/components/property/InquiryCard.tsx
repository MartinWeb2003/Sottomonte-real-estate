'use client';

import Image from 'next/image';
import { useFormState } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { imageUrl } from '@sanity-config/lib/image';
import { Input, Textarea } from '@/components/ui/Input';
import {
  ConsentCheckbox,
  FormStatusMessage,
  Honeypot,
  SubmitButton,
} from '@/components/forms/FormBits';
import { TrustStrip } from '@/components/forms/TrustStrip';
import { submitInquiry, type FormState } from '@/lib/actions';
import { pickLocale, whatsappHref, AGENCY } from '@/lib/utils';
import type { Locale, TeamMember } from '@/types';

const initialState: FormState = { status: 'idle' };

/**
 * Sticky sidebar card on the property detail page: real agent photo +
 * name, direct phone, WhatsApp (green allowed), pre-filled inquiry form.
 */
export function InquiryCard({
  agent,
  propertyTitle,
  propertyUrl,
}: {
  agent: TeamMember | null;
  propertyTitle: string;
  propertyUrl: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('property');
  const tForms = useTranslations('forms');
  const [state, formAction] = useFormState(submitInquiry, initialState);

  const phone = agent?.phone || AGENCY.phone;
  const prefill = t('inquiryPlaceholder', { title: propertyTitle });

  return (
    <aside className="border border-navy/10 bg-white p-7">
      <div className="flex items-center gap-4">
        {agent?.photo ? (
          <Image
            src={imageUrl(agent.photo, { width: 112, height: 112 })}
            alt={agent.name}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 font-display text-xl text-navy">
            S
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {t('yourAgent')}
          </p>
          <p className="font-display text-lg text-navy">
            {agent?.name ?? 'Sottomonte'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 text-sm">
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="font-medium text-navy transition-colors hover:text-gold"
        >
          {phone}
        </a>
        <a
          href={whatsappHref(phone, prefill)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t('whatsapp')}
        </a>
      </div>

      {state.status === 'success' ? (
        <div className="mt-6 border-t border-navy/10 pt-6">
          <FormStatusMessage state={state} />
        </div>
      ) : (
        <form action={formAction} className="relative mt-6 space-y-5 border-t border-navy/10 pt-6">
          <Honeypot />
          <input type="hidden" name="propertyTitle" value={propertyTitle} />
          <input type="hidden" name="propertyUrl" value={propertyUrl} />
          <Input name="name" label={tForms('name')} required autoComplete="name" />
          <Input name="email" type="email" label={tForms('email')} required autoComplete="email" />
          <Input name="phone" type="tel" label={tForms('phone')} autoComplete="tel" />
          <Textarea name="message" label={tForms('message')} defaultValue={prefill} required />
          <Textarea
            name="note"
            label={tForms('note')}
            placeholder={tForms('notePlaceholder')}
            rows={3}
          />
          <ConsentCheckbox privacyHref={`/${locale}/privacy`} />
          <FormStatusMessage state={state} />
          <TrustStrip />
          <SubmitButton label={t('inquire')} className="w-full" />
        </form>
      )}

      <p className="mt-5 text-center text-xs text-muted">{t('weSpeak')}</p>
    </aside>
  );
}
