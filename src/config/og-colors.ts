/**
 * OG Image Colors — hex equivalents of the dark-mode oklch design tokens.
 *
 * OG images are rendered to PNG by @takumi-rs/image-response (not in a
 * browser), so they cannot use CSS custom properties. When you change
 * the color palette in src/styles/tokens.css, update these hex values
 * to match.
 *
 * Mapping to tokens.css .dark {} block:
 *
 *   Token                   oklch                        Hex
 *   ─────────────────────── ──────────────────────────── ───────
 *   --background            oklch(0.175 0.006 107.57)    #161611
 *   --muted                 oklch(0.27 0.008 107.57)     #292924
 *   --foreground            oklch(0.90 0.01 107.57)      #dedfd7
 *   --muted-foreground      oklch(0.70 0.01 107.57)      #909089
 *   --accent-foreground     oklch(0.95 0.008 107.57)     #e6e4d9
 *   (subtitle)              oklch(~0.58 0.01 107.57)     #878580
 *   (domain text)           oklch(~0.75 0.008 107.57)    #b7b5ac
 */
export const ogColors = {
  /** Dark background — maps to --background in dark mode */
  background: '#161611',
  /** Gradient end / badge background — maps to --muted in dark mode */
  muted: '#292924',
  /** Primary text — maps to --foreground in dark mode */
  foreground: '#dedfd7',
  /** Secondary text — maps to --muted-foreground in dark mode */
  mutedForeground: '#909089',
  /** Bright text (author name on covers) — maps to --accent-foreground in dark mode */
  accentForeground: '#e6e4d9',
  /** Subtitle text */
  subtitle: '#878580',
  /** Domain / tertiary text */
  domain: '#b7b5ac',
  /** Semi-transparent warm border */
  border: 'rgba(236, 236, 228, 0.2)',
} as const
