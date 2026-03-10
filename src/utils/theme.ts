export type Theme = 'light' | 'dark'

/**
 * Resolve the user's theme preference.
 *
 * NOTE: This logic is intentionally duplicated in the `is:inline` script
 * inside `src/layouts/Layout.astro` (which cannot import ES modules).
 * If you change this function, update the inline script to match.
 */
export function getThemePreference(
  stored: string | null,
  systemDark: boolean,
): Theme {
  if (stored === 'dark' || stored === 'light') return stored
  return systemDark ? 'dark' : 'light'
}

export function getNextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark'
}

/**
 * Compute the radius needed for a circular reveal animation
 * to cover the entire viewport from a given click point.
 */
export function calculateEndRadius(
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  return Math.hypot(
    Math.max(x, width - x),
    Math.max(y, height - y),
  )
}

export function supportsViewTransition(
  hasStartViewTransition: boolean,
  prefersReducedMotion: boolean,
): boolean {
  return hasStartViewTransition && !prefersReducedMotion
}
