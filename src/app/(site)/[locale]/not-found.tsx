import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { HairlineDivider } from '@/components/ui/HairlineDivider';

export default function NotFound() {
  const t = useTranslations('nav');

  return (
    <section className="flex min-h-[70vh] items-center bg-white pt-20">
      <div className="container-site text-center">
        <p className="font-display text-7xl text-gold">404</p>
        <HairlineDivider width="w-[60px]" className="mx-auto mt-8" />
        <h1 className="mt-8 font-display text-3xl text-navy">Sottomonte</h1>
        <div className="mt-10">
          <ButtonLink href="/" variant="navy">
            {t('home')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
