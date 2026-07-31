'use server';

import { z } from 'zod';
import { Resend } from 'resend';

/**
 * Three server actions, all → Resend email to the agency.
 * Every form carries a honeypot field ("website") and a GDPR consent
 * checkbox. Honeypot hits return success silently — bots learn nothing.
 */

export interface FormState {
  status: 'idle' | 'success' | 'error';
  /** i18n message key under "forms." */
  messageKey?: string;
}

const baseSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  /** Optional free-text the visitor can add before sending. */
  note: z.string().trim().optional(),
  consent: z.literal('on'),
  website: z.string().max(0), // honeypot, must stay empty
});

const inquirySchema = baseSchema.extend({
  message: z.string().trim().min(1),
  propertyTitle: z.string(),
  propertyUrl: z.string(),
});

const sellerLeadSchema = baseSchema.extend({
  location: z.string().trim().min(1),
  propertyType: z.string().trim().min(1),
  size: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

const buyerWishlistSchema = baseSchema.extend({
  lookingFor: z.string().trim().min(5),
  budget: z.string().trim().optional(),
});

const contactSchema = baseSchema.extend({
  interest: z.enum(['buying', 'selling', 'other']),
  message: z.string().trim().min(1),
  /** Optional buyer qualification, present only when interest = buying. */
  budget: z.string().trim().optional(),
  timeline: z.string().trim().optional(),
});

async function sendToAgency(subject: string, lines: Array<[string, string | undefined]>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.AGENCY_EMAIL || 'info@sottomonte.hr';
  const body = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
    .join('');

  if (!apiKey) {
    // Dev fallback: no Resend key configured yet
    console.info(`[forms] ${subject}\n${body.replace(/<[^>]+>/g, ' ')}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: 'Sottomonte Web <web@sottomonte.hr>',
    to,
    subject,
    html: body,
  });
}

function formToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
  );
}

export async function submitInquiry(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = inquirySchema.safeParse(formToObject(formData));
  if (!parsed.success) return { status: 'error', messageKey: 'error' };

  const d = parsed.data;
  try {
    await sendToAgency(`Upit: ${d.propertyTitle}`, [
      ['Nekretnina', d.propertyTitle],
      ['URL', d.propertyUrl],
      ['Ime', d.name],
      ['E-mail', d.email],
      ['Telefon', d.phone],
      ['Poruka', d.message],
      ['Napomena', d.note],
    ]);
    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    console.error('[forms] submitInquiry failed:', error);
    return { status: 'error', messageKey: 'error' };
  }
}

export async function submitSellerLead(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = sellerLeadSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { status: 'error', messageKey: 'error' };

  const d = parsed.data;
  try {
    await sendToAgency('Novi upit prodavatelja', [
      ['Lokacija', d.location],
      ['Tip', d.propertyType],
      ['Površina', d.size],
      ['Ime', d.name],
      ['E-mail', d.email],
      ['Telefon', d.phone],
      ['Poruka', d.message],
      ['Napomena', d.note],
    ]);
    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    console.error('[forms] submitSellerLead failed:', error);
    return { status: 'error', messageKey: 'error' };
  }
}

export async function submitBuyerWishlist(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = buyerWishlistSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { status: 'error', messageKey: 'error' };

  const d = parsed.data;
  try {
    await sendToAgency('Nova lista želja kupca (off-market)', [
      ['Traži', d.lookingFor],
      ['Budžet', d.budget],
      ['Ime', d.name],
      ['E-mail', d.email],
      ['Telefon', d.phone],
      ['Napomena', d.note],
    ]);
    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    console.error('[forms] submitBuyerWishlist failed:', error);
    return { status: 'error', messageKey: 'error' };
  }
}

export async function submitContact(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = contactSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { status: 'error', messageKey: 'error' };

  const d = parsed.data;
  try {
    await sendToAgency('Nova poruka s kontakt forme', [
      ['Zanima ga/ju', d.interest],
      ['Budžet', d.budget],
      ['Vremenski okvir', d.timeline],
      ['Ime', d.name],
      ['E-mail', d.email],
      ['Telefon', d.phone],
      ['Poruka', d.message],
      ['Napomena', d.note],
    ]);
    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    console.error('[forms] submitContact failed:', error);
    return { status: 'error', messageKey: 'error' };
  }
}
