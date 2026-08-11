import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { TheDifference } from '@/components/sections/TheDifference';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { PeninsulaSection } from '@/components/sections/PeninsulaSection';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { GuidesTeaser } from '@/components/sections/GuidesTeaser';
import { Testimonials } from '@/components/sections/Testimonials';
import { OffMarketTeaser } from '@/components/sections/OffMarketTeaser';
import { FinalCTA } from '@/components/sections/FinalCTA';
import {
  getFeaturedProperties,
  getLocations,
  getTestimonials,
} from '@sanity-config/lib/queries';
import { buildMetadata } from '@/lib/seo';
import type { Locale } from '@/types';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('description'),
    route: '/',
  });
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  const [featured, locations, testimonials] = await Promise.all([
    getFeaturedProperties(),
    getLocations(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* Inventory directly after the hero: proof of portfolio IS the trust
          argument. TheDifference carries the (merged) single philosophy block. */}
      <Hero />
      <FeaturedProperties properties={featured} />
      <TheDifference />
      <PeninsulaSection locations={locations} />
      <HowWeWork />
      {/* Process, then the depth behind it, then the social proof. Also the
          homepage's only link into the guides, which is why it is here at all
          and not left to the footer. */}
      <GuidesTeaser locale={locale} />
      <Testimonials testimonials={testimonials} />
      <OffMarketTeaser />
      <FinalCTA />
    </>
  );
}
