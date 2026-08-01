'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MAP_ATTRIBUTION, collapseAttribution } from './attribution';

/**
 * MapTiler map with navy-toned style and gold marker.
 * If the exact location is not public, an approximate 400m circle is
 * drawn instead of a marker, with a note underneath.
 */
export function PropertyMap({
  lat,
  lng,
  exact,
}: {
  lat: number;
  lng: number;
  exact: boolean;
}) {
  const t = useTranslations('property');
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
        zoom: exact ? 15 : 13,
        navigationControl: 'top-right',
        geolocateControl: false,
        // See attribution.ts: the credit is required and must be passed by hand.
        forceNoAttributionControl: true,
      });
      map.addControl(
        new maptiler.AttributionControl({
          compact: true,
          customAttribution: MAP_ATTRIBUTION,
        }),
        'bottom-right'
      );
      collapseAttribution(container);

      map.on('load', () => {
        if (!map) return;
        if (exact) {
          const el = document.createElement('div');
          el.style.cssText =
            'width:18px;height:18px;border-radius:50%;background:#C9A96A;border:2px solid #FDFDFB;box-shadow:0 0 0 4px rgba(201,169,106,0.35);';
          new maptiler.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
        } else {
          // ~400m approximate circle as a GeoJSON polygon
          const radiusKm = 0.4;
          const points = 48;
          const coords: [number, number][] = [];
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const dx = (radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(angle);
            const dy = (radiusKm / 110.574) * Math.sin(angle);
            coords.push([lng + dx, lat + dy]);
          }
          map.addSource('approx', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [coords] },
            },
          });
          map.addLayer({
            id: 'approx-fill',
            type: 'fill',
            source: 'approx',
            paint: { 'fill-color': '#C9A96A', 'fill-opacity': 0.2 },
          });
          map.addLayer({
            id: 'approx-line',
            type: 'line',
            source: 'approx',
            paint: { 'line-color': '#C9A96A', 'line-width': 1.5 },
          });
        }
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, exact]);

  const hasKey = Boolean(process.env.NEXT_PUBLIC_MAPTILER_KEY);

  return (
    <div>
      <div
        ref={containerRef}
        className="h-[420px] w-full bg-navy-soft"
        aria-label="Map"
      >
        {!hasKey && (
          <div className="flex h-full items-center justify-center text-sm text-white/50">
            Map (set NEXT_PUBLIC_MAPTILER_KEY)
          </div>
        )}
      </div>
      {!exact && (
        <p className="container-site py-3 text-xs text-muted">
          {t('approximateLocation')}
        </p>
      )}
    </div>
  );
}
