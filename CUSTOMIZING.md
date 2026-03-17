# Customizing Astrologer

Chinese version: [CUSTOMIZING.zh.md](./CUSTOMIZING.zh.md)

This guide explains the intended customization entry points and the theme-owned files, so you can customize with less upgrade friction. These boundaries reduce merge pain, but customized files may still need manual conflict resolution when upstream changes overlap.

## User-Owned Files

These files are the primary places to put your personal data and configuration. They are designed to minimize upgrade conflicts, but they can still require manual merging if upstream changes touch the same areas.

### Configuration

| File                      | Purpose                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| `src/site.config.ts`      | Site metadata, deployment URL, author link, feature flags, hero content  |
| `src/config/friends.ts`   | Friend links data                                                        |
| `src/styles/fonts.ts`     | Font package imports used by the site                                    |
| `src/styles/tokens.css`   | Color palette, font stacks, border radius                                |
| `src/config/og-colors.ts` | OG image colors (hex equivalents of `tokens.css` — update both together) |

### Content

| File                     | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `src/content/blog/`      | Blog posts (subdirectories per language: `zh/`, `en/`) |
| `src/content/project/`   | Project showcases (same structure)                     |
| `src/pages/about.mdx`    | Chinese about page                                     |
| `src/pages/en/about.mdx` | English about page                                     |

### Assets

| File                           | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `src/assets/avatar.jpg`        | Your avatar (used in Hero and OG images)                   |
| `public/favicon.svg`           | Site favicon                                               |
| `public/og-default.png`        | Default OG image (regenerate with `pnpm generate:og`)      |
| `src/assets/default-cover.png` | Default article cover (regenerate with `pnpm generate:og`) |

## Theme-Owned Files

These files are part of the theme engine. They will be updated on theme upgrades. Avoid editing them directly — if you need to customize behavior, open an issue to discuss adding a configuration option.

- `src/components/` — All Astro components
- `src/layouts/` — Layout templates
- `src/styles/global.css` — Base styles, prose overrides, code block styles
- `src/utils/` — Utility functions
- `src/scripts/` — Client-side scripts
- `src/data/` — Type definitions and utilities (e.g., `Friend` interface)
- `src/lib/` — Internal libraries
- `astro.config.ts` — Build configuration and plugin pipeline

## Partially User-Owned Files

These files may need manual merging on upgrade if you have customized them.

| File              | What you might change                            |
| ----------------- | ------------------------------------------------ |
| `src/i18n/ui.ts`  | Adding custom translation keys or a new language |
| `astro.config.ts` | Adding custom integrations or plugins            |

## Changing the Color Palette

1. Edit `src/styles/tokens.css` — change oklch values in `:root` (light) and `.dark` (dark) blocks
2. Edit `src/config/og-colors.ts` — update hex equivalents to match (OG images can't use CSS variables)
3. Run `pnpm generate:og` to regenerate default OG/cover images

If you change `author`, `authorUrl`, `subtitle`, `domain`, or `src/assets/avatar.jpg`, also rerun `pnpm generate:og` so the generated default OG image and cover stay in sync.

The key design parameter is the **hue** value (default: `107.57` — warm "Xuan paper" neutral). Changing this single number across all tokens shifts the entire color temperature.

## Changing Fonts

Font changes require edits in three places:

1. `package.json` — install the Fontsource package (e.g., `@fontsource-variable/your-font`)
2. `src/styles/fonts.ts` — update the Fontsource imports
3. `src/styles/tokens.css` — update `--font-sans` or `--font-mono` in the `@theme inline` block

`src/layouts/Layout.astro` stays theme-owned and only imports `src/styles/fonts.ts`, so most font customization no longer requires editing the layout directly.

## Feature Flags

Feature flags in `src/site.config.ts` control both navigation visibility and route generation:

| Flag                             | Controls                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| `enableProjectsShowcase`         | Projects page + individual project pages + OG routes + homepage Recent Projects availability |
| `enableAboutMe`                  | About page navigation link (page is always built — delete the `.mdx` file to fully remove)   |
| `enableFriendLinks`              | Friend links page                                                                            |
| `enableRecentProjectsOnHomepage` | Recent Projects section on homepage, but only when `enableProjectsShowcase` is also `true`   |

## Site URL

`src/site.config.ts` is the single source of truth for the deployed site URL. `astro.config.ts` reads `siteConfig.site` directly, so you only need to change the URL in one place.

## Adding a New Language

Adding a language requires coordinated edits across multiple files:

1. `src/i18n/ui.ts` — add to `languages`, add translation strings in `ui`, add locale mapping in `localeByLang`
2. `src/site.config.ts` — add locale config in `locales` (title, author, description, keywords, hero)
3. Create content directories: `src/content/blog/{lang}/`, `src/content/project/{lang}/`
4. Create about page: `src/pages/{lang}/about.mdx`

## Upgrading the Theme

```bash
# Add upstream if not already done
git remote add upstream https://github.com/KyleRicardo/astrologer.git

# Fetch and merge
git fetch upstream
git merge upstream/main
```

Conflicts are most likely in files you customized directly. Theme-owned files should still be easier to upgrade, but clean merges are not guaranteed if upstream refactors touch the same code paths.
