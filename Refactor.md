# Refactor Notes

## High Impact

### 1. `<html lang="en">` hardcoded

`src/layouts/Layout.astro:48` — Chinese pages are served with `lang="en"`, breaking screen readers and search engine language detection. Should use the actual language from `getLangFromUrl()`.

### 2. Route duplication — every page exists twice

Each route is duplicated between `src/pages/` (default lang) and `src/pages/[lang]/` (non-default). Templates are nearly identical — only the language detection differs. ~50% unnecessary code in the pages directory. The standard Astro i18n pattern is a single `[lang]/` dynamic route that includes all languages in `getStaticPaths()`.

### 3. Tag links don't use translated paths

`src/components/ArticleDetail.astro:88` hardcodes `/tags/${tag}` without `useTranslatedPath()`. Tags on English pages (`/en/posts/...`) link back to `/tags/...` (Chinese), breaking navigation for non-default languages.

## Medium Impact

### 4. Repeated draft+lang filter in `get-contents.ts`

The pattern `import.meta.env.PROD ? data.draft !== true : true` + `id.startsWith(`${lang}/`)` appears 6 times. A shared filter helper would reduce this to one place.

### 5. `lang: string` instead of `lang: Lang`

`get-contents.ts:36,52` — `getPostsByCategory` and `getPostsByTag` accept `string` instead of the `Lang` type used everywhere else. Loses type safety.

### 6. `siteConfig` dual export

`src/site.config.ts` exports both `siteConfig` (raw) and `getSiteConfig(lang)` (locale-merged). Some consumers use the wrong one — e.g., `og-image.tsx` uses `siteConfig` directly (no locale data), while `Layout.astro` correctly uses `getSiteConfig(lang)`.

### 7. `console.log` in production

`src/components/Header.astro:231,256,273` — three debug log statements in the menu toggle/resize handler ship to production.

## Low Impact

### 8. `highlight-code.ts` package manager mapping

Repetitive if/else chain for npm→pnpm→yarn→bun command transformations. Could be data-driven.

### 9. `getArchives` inconsistency

Filters by lang after `getCollection` instead of inside the filter callback like the other functions. Works but inconsistent.

### 10. Missing `tsc --noEmit` script

No type-checking command in package.json. Relies on IDE/build to catch type errors.
