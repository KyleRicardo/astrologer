# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Start dev server                              |
| `pnpm build`       | Production build (static output to `dist/`)   |
| `pnpm preview`     | Preview production build                      |
| `pnpm lint`        | Run ESLint                                    |
| `pnpm lint:fix`    | Auto-fix lint issues                          |
| `pnpm format`      | Format with dprint                            |
| `pnpm generate:og` | Generate default OG/cover images to `public/` |
| `pnpm check`       | Type-check Astro + TS files via `astro check` |

| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright e2e tests |

## Code Style

- **Formatter**: dprint — single quotes, no semicolons (ASI), 80 char line width
- **Linter**: ESLint with TypeScript + Astro plugins
- **Pre-commit hooks**: lefthook runs format + lint on staged files
- **Path alias**: `@/*` maps to `./src/*`
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- This is a TypeScript project. Always use TypeScript (.ts) for new files. Use strict typing — avoid `any` where possible. The only `.tsx` file is `src/utils/og-image.tsx` (JSX for OG image generation via takumi, not React components).
- **No React / no shadcn/ui.** All UI components are pure Astro (`.astro`). Do not add React dependencies or `@astrojs/react`. The `react` package exists solely as a build-time JSX factory for `og-image.tsx`.
- When editing CSS files, preserve existing class naming conventions and check for unused styles before adding new ones.

## Architecture

**Astrologer** is a multilingual static Astro blog theme (Chinese default, English secondary).

### i18n & Routing

- Default language (`zh`) has no URL prefix; non-default (`en`) uses `/en/` prefix
- Content files are organized by language: `src/content/blog/en/`, `src/content/blog/zh/`
- Translations live in `src/i18n/ui.ts`, accessed via `useTranslations(lang)` from `src/i18n/utils.ts`
- All routes use a single `[...lang]` rest parameter (e.g., `src/pages/[...lang]/posts/[slug].astro`). `getStaticPaths` returns `lang: undefined` for the default language and `lang: 'en'` for non-default, so Astro generates both `/posts/slug` and `/en/posts/slug` from one file
- Language is extracted from content `id` via `id.split('/')[0]`

### Content Collections

Defined in `src/content.config.ts` with two collections (`z` imported from `astro/zod`):

- **blog**: posts with title, date, category, tags, draft, pinned, cover
- **project**: projects with title, description, date, icon, github/homepage URLs, tags

Content utilities in `src/utils/get-contents.ts` provide filtering by language, category, tag, and year-based grouping. Drafts are excluded in production (`import.meta.env.PROD`).

### Site Config

`src/site.config.ts` exports `siteConfig` (static) and `getSiteConfig(lang)` (language-merged). Contains author info, social links, feature flags, and per-locale metadata.

### OG Image Generation

`src/utils/og-image.tsx` uses `@takumi-rs/image-response` (takumi) to render JSX directly to PNG. The JSX here is compiled via `react/jsx-runtime` (configured in `tsconfig.json`) but is not a React component — it produces element trees for takumi's image renderer. Fonts (Outfit, Source Han Sans SC) are downloaded as TTF from CDN and cached in `node_modules/.cache/fonts`. Avatar is preloaded as a `persistentImage`. Three functions:

- `renderOgImage()` — dynamic per-post/project images (1200x630)
- `renderDefaultOg()` — site-wide OG image (1200x630)
- `renderDefaultCover()` — default cover image (1024x576)

Dynamic routes at `/og/posts/[lang]/[...slug].png` and `/og/projects/[lang]/[...slug].png` return `ImageResponse` directly.

### Styling

- Tailwind CSS v4 with inline `@theme` configuration in `src/styles/global.css`
- `@tailwindcss/typography` for prose content
- Dark mode via `.dark` class on `<html>`, persisted to localStorage
- Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- Reusable UI components in `src/components/ui/` (pure Astro, no framework dependencies)

### MDX Pipeline

Configured in `astro.config.mjs`:

- **Syntax highlighting**: rehype-pretty-code (not Astro built-in)
- **Math**: remark-math + rehype-katex
- **Callouts**: rehype-callouts
- Custom MDX components in `src/components/mdx/` (Code, Pre, Figure, Steps)

### Client Router (View Transitions)

- Uses `ClientRouter` from `astro:transitions` in Layout.astro
- **Lifecycle pattern**: `astro:page-load` to initialize, `astro:before-swap` with `{ once: true }` to clean up. See `src/scripts/scroll-reveal.ts` for the canonical example.
- **CSS in component `<script>` tags gets lost on navigation** — Astro removes the `<link>` on swap and deduplication prevents re-injection. Always import CSS that must persist in `Layout.astro` frontmatter (e.g., `medium-zoom/dist/style.css`, Fontsource fonts).
- JS libraries that attach to DOM elements (e.g., medium-zoom) must `.detach()` on `astro:before-swap` and re-initialize on `astro:page-load` to avoid stale instances.

## Design Context

### Users

Developers and engineering peers visiting for technical posts and project showcases. They arrive with intent — reading a post, evaluating a project, or assessing craft. The experience should feel credible, thoughtful, and well-made — like a well-typeset book, not a marketing site.

### Brand Personality

**Warm, precise, unhurried.** The interface communicates quiet confidence through careful typography, considered spacing, and warm color temperature. It doesn't shout — it invites close reading.

### Aesthetic Direction

- **Primary reference**: shadcn/ui — the structural design language, component patterns, spacing rhythm, and systematic token approach
- **Color warmth**: Anthropic — the oklch warm-neutral palette ("Xuan paper style", 宣纸风格) with hue 107.57 across all neutrals, never cold gray
- **Interaction quality**: Linear — clean transitions, command palette pattern, mobile menu precision
- **Anti-references**: No playful/cute aesthetics — no Notion-style illustrations, gradient blobs, candy colors, rounded bubbly shapes, or whimsical elements. The tone is serious craftsmanship, not friendly approachability.
- **Theme**: Both light and dark mode, with equal design attention to each. Dark mode targets Anthropic's warm near-black (#141413).

### Design Principles

1. **Warm minimalism over cold utility** — Every neutral carries the 107.57 hue. Zero-chroma grays are banned. Even code blocks and selections get warmth.
2. **Browser-native first** — Use `<dialog>`, `inert`, `scrollend`, `prefers-reduced-motion` before reaching for JS solutions. The platform is the framework.
3. **Systematic tokens, not ad-hoc values** — All colors, radii, and spacing flow from the `@theme inline` token system. New values must integrate with existing scales.
4. **Respect motion preferences everywhere** — Every animation, transition, and scroll effect must degrade gracefully with `prefers-reduced-motion: reduce`.
5. **Pure Astro, zero runtime** — No React components, no CSS-in-JS, no client-side framework overhead. Server-rendered Astro components with targeted `<script>` tags for interactivity.
