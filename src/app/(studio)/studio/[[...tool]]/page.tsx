'use client';

/**
 * Embedded Sanity Studio at /studio. Everything under this route is
 * client-rendered by the Studio itself.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
