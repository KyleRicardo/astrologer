# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro site. Route entrypoints live in `src/pages`, with shared UI in `src/components` and page shells in `src/layouts`. Typed content collections are defined in `src/content.config.ts`; authored content lives under `src/content/blog/{en,zh}` and `src/content/project/{en,zh}`. Utilities and client scripts are in `src/utils`, `src/lib`, and `src/scripts`. Store processed assets in `src/assets` or `src/icons`, and static files in `public`. End-to-end tests live in `e2e`; generated output such as `dist`, `playwright-report`, and `test-results` should not be edited.

## Build, Test, and Development Commands

Use `pnpm` for local work because the repo ships with `pnpm-lock.yaml`.

- `pnpm dev`: start the Astro dev server at `http://localhost:4321`.
- `pnpm build`: produce a production build in `dist/`.
- `pnpm preview`: serve the built site locally.
- `pnpm check`: run Astro type and content checks.
- `pnpm lint` / `pnpm lint:fix`: run ESLint, or fix what it can.
- `pnpm format`: format supported files with `dprint`.
- `pnpm test`: run Vitest unit tests.
- `pnpm test:e2e`: run Playwright browser tests.
- `pnpm generate:og`: regenerate default Open Graph assets.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF, 2-space indentation, final newline. `dprint` enforces an 80-column target, single quotes, trailing commas on multiline lists, and no semicolons. Astro components and layouts use `PascalCase.astro`; utility modules use descriptive lowercase or kebab-case file names such as `theme.ts` and `get-tags.ts`. Prefix intentionally unused variables with `_` to satisfy ESLint.

## Testing Guidelines

Write unit tests as `src/**/*.test.ts` and browser tests as `e2e/*.test.ts`. Keep tests close to the feature when possible, as in `src/utils/theme.test.ts`. Run `pnpm test` for logic changes and `pnpm test:e2e` for routing, theming, or interaction changes. No coverage gate is configured, so add tests for every bug fix and for new behavior with user-visible risk.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes like `refactor:`, `test:`, and `docs:`; keep that format with an imperative summary. Pull requests should explain the change, list the verification commands you ran, link related issues, and include screenshots for UI, theme, or content presentation changes. If you change collection schemas or bilingual content, call that out explicitly in the PR description.
