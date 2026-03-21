---
name: translate
description: "Translate a blog post to another language (zh↔en) with high-quality 信达雅 translation. Use when the user wants to translate, localize, or create another language version of a post. Triggers on: 'translate', 'translation', '翻译', 'localize', 'i18n', 'create English version', '翻译成英文', '翻译成中文'."
---

# Translate

Translate a blog post between Chinese and English while preserving structure, MDX syntax, and frontmatter integrity. Translation quality must meet the 信达雅 (faithfulness, expressiveness, elegance) standard.

## Project Structure

- Source: `src/content/blog/{source_lang}/{slug}.mdx`
- Target: `src/content/blog/{target_lang}/{slug}.mdx` (same slug)
- Languages: `zh` (Chinese) and `en` (English)

## Workflow

### Step 1: Identify the source article

The user may provide:

- A file path (e.g., `src/content/blog/zh/my-post.mdx`)
- A slug (e.g., `my-post`)
- A vague reference (e.g., "the Astro post", "最新的那篇")

If ambiguous, list matching files and ask the user to confirm. Use Glob to search `src/content/blog/**/*.mdx`.

### Step 2: Detect languages

- Read the source file
- Determine source language from the file path (`zh/` or `en/`)
- Target language is the other one
- Check if target file already exists — if so, warn the user and ask before overwriting

### Step 3: Translate frontmatter

Translate these fields:

- `title` — translate naturally, not literally
- `description` — translate if present; maintain similar length and tone
- `category` — **must use the target language's conventions**. Read existing posts in `src/content/blog/{target_lang}/` to find the established category names. Known mappings:
  - `教程` ↔ `Guide`
  - `技术向` ↔ `Tech`
  - `玩坏系列` ↔ `Hacking Series`
  - If no established mapping exists, create a natural translation
- `tags` — translate where appropriate. Some tags stay in English in both languages (e.g., `Astro`, `Java`, `MDX`). Translate conceptual tags (e.g., `教程` → `Tutorial`, `前端 技术` → `Technology`). Check existing tags in target language posts for consistency.

Preserve these fields unchanged:

- `date`, `updated` — keep exact same values
- `cover` — keep same URL
- `draft`, `pinned` — keep same boolean values

### Step 4: Translate content body

#### Translation Standard: 信达雅

1. **信 (Faithfulness)** — Accurately convey the original meaning. Do not add, omit, or distort information. Technical accuracy is paramount.

2. **达 (Expressiveness)** — The translation must read naturally in the target language, not like a translation. Restructure sentences when needed to match target language conventions:
   - Chinese → English: Break long compound sentences into shorter ones. Use active voice. Be direct.
   - English → Chinese: Allow more flowing sentence structure. Use four-character idioms (成语) where natural, but don't force them.

3. **雅 (Elegance)** — The translated text should match the literary quality of the original. Match the author's tone — technical precision for tech posts, conversational warmth for tutorials.

#### Content rules

- **MDX components**: Keep all component tags unchanged (`<Steps>`, `<Figure>`, `import` statements, etc.)
- **Code blocks**: Do NOT translate code. Translate comments inside code blocks only when they are explanatory (not when they are part of the code output).
- **Inline code**: Keep variable names, function names, file paths, and CLI commands unchanged. Translate surrounding text.
- **Links**: Keep URLs unchanged. Translate link text if it's descriptive.
- **Images**: Keep image paths/URLs unchanged. Translate alt text.
- **Headings**: Translate heading text. Keep heading levels identical.
- **Callouts/admonitions**: Translate the content inside callouts. Keep the callout type marker unchanged (e.g., `> [!NOTE]`).
- **HTML entities and special syntax**: Preserve as-is.
- **Paragraph structure**: Generally maintain the same paragraph breaks, but you may split or merge paragraphs when it produces more natural text in the target language.

### Step 5: Write the target file

Write the complete translated `.mdx` file to `src/content/blog/{target_lang}/{slug}.mdx`.

### Step 6: Confirm

Tell the user:

- Source → Target file paths
- Briefly note any translation decisions made (category mapping, tag choices, tricky passages)
- Suggest they review the translation and run `pnpm build` to verify

## Important

- The slug must stay the same between languages — this is how the i18n system associates translations
- If the source has local images (relative paths like `./cover/img.jpg`), the target language may need its own copy or the path adjusted. Check if the image exists relative to the target directory.
- Never machine-translate proper nouns, brand names, or technology names (Astro, React, TypeScript, etc.)
- Respect the user's communication language (respond in Chinese if they speak Chinese)
