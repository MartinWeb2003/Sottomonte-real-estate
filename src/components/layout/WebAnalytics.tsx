import Script from 'next/script';

/**
 * Cloudflare Web Analytics beacon.
 *
 * Loaded unconditionally, with no consent gate, and that is the point: the
 * beacon sets no cookies and stores no personal data, so it needs no consent
 * under GDPR/ePrivacy. The consent banner exists to gate GA4, which is a
 * different thing entirely. Measuring every visitor rather than only the ones
 * who accept a banner is the main reason to run this at all.
 *
 * `afterInteractive` keeps it off the critical path. That matters more here
 * than for most third-party scripts: this beacon reports Core Web Vitals, and
 * a measurement tool that degrades LCP on the pages it is measuring is worse
 * than no measurement.
 *
 * Renders nothing when the token is unset, so local development and any
 * environment that has not been configured stay out of the reporting.
 */
export function WebAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;

  return (
    <Script
      id="cf-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
