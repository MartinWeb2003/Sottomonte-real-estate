/**
 * Map credit, shared by both map components.
 *
 * Supplied explicitly rather than left to the style metadata. Disabling the
 * SDK's own attribution control (`forceNoAttributionControl`) so it can be
 * replaced with a compact one also strips the attribution strings the
 * replacement would have read, which silently produced an EMPTY credit box.
 *
 * This is not decoration: the tiles are OpenStreetMap data under ODbL, which
 * requires visible attribution, and MapTiler's terms require theirs. Both stay
 * on screen, just collapsed behind an ⓘ toggle.
 */
export const MAP_ATTRIBUTION = [
  '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener noreferrer">&copy; MapTiler</a>',
  '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">&copy; OpenStreetMap contributors</a>',
].join(' ');

/**
 * Start the compact attribution collapsed.
 *
 * MapLibre's `compact: true` only collapses once the user pans, and nobody
 * pans a static office map, so on its own it renders the full text strip
 * forever. The control is a <details>, so closing it gives the ⓘ toggle from
 * first paint. One click still opens the full credit.
 */
export function collapseAttribution(container: HTMLElement) {
  const details = container.querySelector('details.maplibregl-ctrl-attrib');
  if (details instanceof HTMLDetailsElement) details.open = false;
}
