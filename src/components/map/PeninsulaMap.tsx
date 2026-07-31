'use client';

import { useEffect, useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';

/**
 * Small office / coverage map (contact page). Navy style, gold marker.
 */
export function PeninsulaMap({
  lat = 42.9758,
  lng = 17.1786, // Orebić
  zoom = 10,
  className = 'h-64 w-full',
}: {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const container = containerRef.current;
    if (!key || !container) return;

    let map: import('@maptiler/sdk').Map | undefined;
    let cancelled = false;

    (async () => {
      const maptiler = await import('@maptiler/sdk');
      if (cancelled) return;
      maptiler.config.apiKey = key;
      map = new maptiler.Map({
        container,
        style: maptiler.MapStyle.DATAVIZ.DARK,
        center: [lng, lat],
        zoom,
        navigationControl: false,
        geolocateControl: false,
      });
      map.on('load', () => {
        if (!map) return;
        const el = document.createElement('div');
        el.style.cssText =
          'width:14px;height:14px;border-radius:50%;background:#C9A96A;border:2px solid #FDFDFB;';
        new maptiler.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, zoom]);

  const hasKey = Boolean(process.env.NEXT_PUBLIC_MAPTILER_KEY);

  return (
    <div ref={containerRef} className={`${className} bg-navy-soft`}>
      {!hasKey && (
        <div className="flex h-full items-center justify-center text-sm text-white/50">
          Map (set NEXT_PUBLIC_MAPTILER_KEY)
        </div>
      )}
    </div>
  );
}
