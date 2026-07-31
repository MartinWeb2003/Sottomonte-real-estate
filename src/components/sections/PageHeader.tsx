import Image from 'next/image';
import { IMAGES } from '@/lib/images';

/**
 * Interior page banner (~40-50vh): photo, navy scrim, H1.
 * No breadcrumb. The BreadcrumbList JSON-LD on the properties pages still
 * ships for SEO, it just isn't rendered on screen.
 */
export function PageHeader({
  title,
  subtitle,
  image = IMAGES.hero,
  tall = false,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  tall?: boolean;
}) {
  return (
    <section
      className={`relative flex w-full items-end overflow-hidden ${
        tall ? 'h-[50vh] min-h-[420px]' : 'h-[40vh] min-h-[360px]'
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        className="photo-darken object-cover"
        sizes="100vw"
      />
      <div className="header-scrim absolute inset-0" />
      <div className="container-site relative pb-12 md:pb-16">
        <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
