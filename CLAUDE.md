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

No test framework is configured.

## Code Style

- **Formatter**: dprint — single quotes, no semicolons (ASI), 80 char line width
- **Linter**: ESLint with TypeScript + Astro plugins
- **Pre-commit hooks**: lefthook runs format + lint on staged files
- **Path alias**: `@/*` maps to `./src/*`

## Architecture

**Astrologer** is a multilingual static Astro blog theme (Chinese default, English secondary).

### i18n & Routing

- Default language (`zh`) has no URL prefix; non-default (`en`) uses `/en/` prefix
- Content files are organized by language: `src/content/blog/en/`, `src/content/blog/zh/`
- Translations live in `src/i18n/ui.ts`, accessed via `useTranslations(lang)` from `src/i18n/utils.ts`
- Routes are duplicated: `/posts/[slug]` (default lang) and `/[lang]/posts/[slug]` (other langs)
- Language is extracted from content `id` via `id.split('/')[0]`

### Content Collections

Defined in `src/content.config.ts` with two collections:

- **blog**: posts with title, date, category, tags, draft, pinned, cover
- **project**: projects with title, description, date, icon, github/homepage URLs, tags

Content utilities in `src/utils/get-contents.ts` provide filtering by language, category, tag, and year-based grouping. Drafts are excluded in production (`import.meta.env.PROD`).

### Site Config

`src/site.config.ts` exports `siteConfig` (static) and `getSiteConfig(lang)` (language-merged). Contains author info, social links, feature flags, and per-locale metadata.

### OG Image Generation

`src/utils/og-image.tsx` uses `@takumi-rs/image-response` (takumi) to render JSX directly to PNG. Fonts (Outfit, Source Han Sans SC) are downloaded as TTF from CDN and cached in `node_modules/.cache/fonts`. Avatar is preloaded as a `persistentImage`. Three functions:

- `renderOgImage()` — dynamic per-post/project images (1200x630)
- `renderDefaultOg()` — site-wide OG image (1200x630)
- `renderDefaultCover()` — default cover image (1024x576)

Dynamic routes at `/og/posts/[lang]/[...slug].png` and `/og/projects/[lang]/[...slug].png` return `ImageResponse` directly.

### Styling

- Tailwind CSS v4 with inline `@theme` configuration in `src/styles/global.css`
- `@tailwindcss/typography` for prose content
- Dark mode via `.dark` class on `<html>`, persisted to localStorage
- shadcn/ui component patterns (configured in `components.json`, base color: zinc)
- Utility: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)

### MDX Pipeline

Configured in `astro.config.mjs`:

- **Syntax highlighting**: rehype-pretty-code (not Astro built-in)
- **Math**: remark-math + rehype-katex
- **Callouts**: rehype-callouts
- Custom MDX components in `src/components/mdx/` (Code, Pre, Figure, Steps)
