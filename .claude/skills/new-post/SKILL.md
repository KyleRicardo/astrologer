---
name: new-post
description: "Create a new blog post with correct frontmatter and file placement. Use when the user wants to create, start, or scaffold a new blog post or article. Triggers on: 'new post', 'create post', 'write a post', 'new article', '新文章', '写篇文章', '创建文章'."
---

# New Post

Create a new blog post in the Astrologer theme with correct frontmatter schema and file placement.

## Project Structure

- Blog posts live in `src/content/blog/{lang}/{slug}.mdx`
- Languages: `zh` (Chinese, default) and `en` (English)
- Slug must be kebab-case English (e.g., `my-first-post`)

## Frontmatter Schema

```yaml
---
title: "Post Title"           # required, string
description: "Brief summary"  # optional, string
date: YYYY-MM-DD              # required, date (no quotes)
category: Category Name        # optional, free-form string
tags:                          # optional, array of strings
  - Tag1
  - Tag2
cover: "https://..."           # optional, URL string
draft: true                    # optional, boolean (omit if false)
pinned: true                   # optional, boolean (omit if false)
---
```

## Workflow

### Step 1: Gather information

Use AskUserQuestion to ask the user in a single question group:

1. **Language**: `zh` (Chinese) or `en` (English)
2. **Title**: The post title
3. **Category** (optional): Suggest existing categories from the codebase. Read a few files in `src/content/blog/{lang}/` to find what categories are already in use. Common ones:
   - Chinese: `教程`, `技术向`, `玩坏系列`, `Java`, `Markup Language`
   - English: `Guide`, `Tech`, `Java`, `Markup Language`
4. **Tags** (optional): Free-form, suggest existing tags
5. **Draft?**: Whether to mark as draft

### Step 2: Generate the file

1. **Slug**: Derive from title. For Chinese titles, create a meaningful English slug (e.g., `"Astro 博客搭建"` → `building-blog-with-astro`). For English titles, kebab-case it.
2. **Date**: Use today's date in `YYYY-MM-DD` format.
3. **File path**: `src/content/blog/{lang}/{slug}.mdx`
4. Check if file already exists — if so, warn the user and ask before overwriting.

### Step 3: Write the file

Create the `.mdx` file with frontmatter. Only include optional fields that the user provided — do not include empty or false fields.

After the frontmatter, add a brief placeholder comment:

```mdx
---
title: "..."
date: YYYY-MM-DD
---

{/* Start writing here */}
```

### Step 4: Confirm

Tell the user the file path and remind them they can:

- Start writing content below the frontmatter
- Use `/translate` to create the other language version when done
- Use `/generate-excerpt` to auto-generate a description later

## Important

- Always use `.mdx` extension, not `.md`
- Date format is bare `YYYY-MM-DD` without quotes
- Title should be quoted in frontmatter (YAML string)
- Do NOT include `description` if the user didn't provide one — they can generate it later with `/generate-excerpt`
- Do NOT include `draft: false` or `pinned: false` — just omit these fields when false
- Respect the user's language for all communication (respond in Chinese if they speak Chinese)
