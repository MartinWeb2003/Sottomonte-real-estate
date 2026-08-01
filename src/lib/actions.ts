'use server';

import { z } from 'zod';
import { Resend } from 'resend';

/**
 * Four server actions, all → Resend email to the agency.
 * Every form carries a honeypot field ("website") and a GDPR consent
 * checkbox. Honeypot hits return success silently — bots learn nothing.
 *
 * Env: RESEND_API_KEY (required in production), AGENCY_EMAIL (recipient),
 * RESEND_FROM (sender, must be on a Resend-verified domain).
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
});

/**
 * The honeypot is checked separately rather than as a schema field. As part of
 * the schema a bot hit failed validation and returned an error, which both
 * contradicts the "bots learn nothing" intent and tells the bot it was caught.
 * Here it returns the normal success state and simply never sends.
 */
function isBot(formData: FormData) {
  return String(formData.get('website') ?? '').length > 0;
}

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

/** Lead text goes into an HTML email, so it has to be escaped on the way in. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sends one lead to the agency inbox.
 *
 * Throws on every path where the mail did not go out, so the caller reports an
 * error and the visitor is told to phone instead. That matters more than it
 * looks: this used to return normally both when RESEND_API_KEY was missing and
 * when Resend rejected the message, so a misconfigured key meant every lead was
 * silently dropped while the form said "thank you".
 *
 * `replyTo` is the lead's own address, so the agency can just hit Reply.
 */
async function sendToAgency(
  subject: string,
  lines: Array<[string, string | undefined]>,
  replyTo?: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.AGENCY_EMAIL || 'info@sottomonte.hr';
  // Must be an address on a domain verified in Resend, or every send is rejected.
  const from = process.env.RESEND_FROM || 'Sottomonte Web <web@sottomonte.hr>';

  const rows = lines.filter(([, value]) => value && value.trim().length > 0) as Array<
    [string, string]
  >;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = rows
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value).replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'RESEND_API_KEY is not set. Refusing to report success for a lead that was never sent.'
      );
    }
    console.info(`[forms] no RESEND_API_KEY, logging instead\nTo: ${to}\nSubject: ${subject}\n${text}`);
    return;
  }

  const resend = new Resend(apiKey);
  // The SDK resolves with { data, error } and does NOT throw on API errors, so
  // an unverified sending domain or a bad key looks like success unless the
  // error object is checked explicitly.
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    html,
    text,
  });

  if (error) {
    // Resend does not always populate `name`, so fall back to the raw object
    // rather than logging "undefined — ..." and losing the useful detail.
    const detail =
      [error.name, error.message].filter(Boolean).join(' — ') || JSON.stringify(error);
    throw new Error(`Resend rejected the message: ${detail}`);
  }

  // Message id goes in the server log so a lead someone swears never arrived
  // can be traced in the Resend dashboard.
  console.info(`[forms] sent "${subject}" to ${to} (resend id ${data?.id})`);
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
  // A filled honeypot gets the same success state a human sees.
  if (isBot(formData)) return { status: 'success', messageKey: 'success' };

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
    ], d.email);
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
  // A filled honeypot gets the same success state a human sees.
  if (isBot(formData)) return { status: 'success', messageKey: 'success' };

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
    ], d.email);
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
  // A filled honeypot gets the same success state a human sees.
  if (isBot(formData)) return { status: 'success', messageKey: 'success' };

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
    ], d.email);
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
  // A filled honeypot gets the same success state a human sees.
  if (isBot(formData)) return { status: 'success', messageKey: 'success' };

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
    ], d.email);
    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    console.error('[forms] submitContact failed:', error);
    return { status: 'error', messageKey: 'error' };
  }
}
