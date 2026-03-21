---
name: generate-excerpt
description: "Generate a high-quality description/excerpt for a blog post's frontmatter. Use when the user wants to generate, write, or improve a post's description, summary, or excerpt. Triggers on: 'generate excerpt', 'generate description', 'write summary', 'add description', '生成摘要', '写摘要', '生成描述', '补充描述'."
---

# Generate Excerpt

Generate a high-quality `description` field for a blog post's frontmatter. The description serves as the article's elevator pitch — it appears in meta tags, search results, social cards, and article list cards.

## Workflow

### Step 1: Identify the article

The user may provide:

- A file path
- A slug
- "this file" / "current file" (check recent context for which file is being discussed)
- "all posts without descriptions" (batch mode)

Use Glob to find the file in `src/content/blog/**/*.mdx` if needed.

### Step 2: Read and analyze

Read the full article content. Identify:

- **Language**: from file path (`zh/` or `en/`)
- **Topic**: what the article is about
- **Type**: tutorial, opinion piece, technical deep-dive, showcase, etc.
- **Core value**: what problem it solves or what the reader gains
- **Key terms**: important technical terms, framework names, concepts
- **Existing description**: check if one already exists in frontmatter

### Step 3: Generate the description

#### Length constraints

- **Chinese**: 80–160 characters (roughly 40–80 Chinese characters). Aim for ~120 characters.
- **English**: 120–200 characters. Aim for ~160 characters.

These lengths are optimized for: Google meta description display (~155 chars), social card previews, and the ArticleCard component's 2–3 line excerpt area.

#### Tone and style

- **Match the article's voice**. A precise technical post gets a precise description. A conversational tutorial gets a warm, inviting description.
- **No AI clichés**. Avoid: "本文将介绍...", "In this article, we will...", "深入探讨", "comprehensive guide to", "dive deep into", "一文读懂", "你需要知道的一切". These scream machine-generated.
- **No clickbait**. Avoid: "你绝对想不到", "The surprising truth about", superlatives without substance.
- **Be specific**. Bad: "介绍 Astro 框架的使用方法" → Good: "用 Astro 搭建博客的完整流程 —— 从项目初始化到 Vercel 部署，覆盖主题定制、MDX 写作和 OG 图片生成。"

#### Structure

- **Lead with the value proposition**: What does the reader get? What problem does this solve?
- **Include scope indicators**: Signal the breadth of the article (e.g., "从...到..." / "covers X, Y, and Z")
- **Don't spoil conclusions**: Tease the content, don't summarize the answer. For opinion pieces, state the question, not the position.

#### SEO

- **Naturally incorporate 1–3 key terms** that a reader would search for. Don't keyword-stuff.
- **Front-load important words** — search engines and social cards may truncate.
- The description appears in `<meta name="description">` and `og:description` — it's literally what people see in search results.

#### Language

- **Chinese articles get Chinese descriptions**. Vice versa.
- **Don't translate — write natively.** A Chinese description should read like it was written by a Chinese author, not translated from English.

### Step 4: Present for review

Show the generated description to the user. Include:

- The description text
- Character count
- Which article it's for

Ask if they want to: accept, revise, or regenerate.

### Step 5: Write to frontmatter

If the user accepts, update the article's frontmatter:

- If `description` exists, replace it
- If `description` doesn't exist, add it after `title`
- Use the Edit tool to make a precise frontmatter edit — do NOT rewrite the entire file

## Batch mode

If the user asks to generate descriptions for multiple posts (e.g., "all posts missing descriptions"):

1. Use Glob + Read to find all `.mdx` files without a `description` field in frontmatter
2. Generate descriptions for each one
3. Present them all in a table for review before writing any
4. Only write after the user approves (they may want to edit some)

## Examples of good descriptions

**Chinese (tutorial)**:

```
从零开始搭建你的 Astrologer 博客 —— 配置、自定义、写作到部署的完整指南。
```

**English (tutorial)**:

```
A complete guide to setting up, customizing, and deploying your Astrologer blog — from first clone to production.
```

**Chinese (technical)**:

```
Astro 以内容优先、零 JS 默认的架构颠覆了传统前端框架的思路。如果你需要一个加载速度快、SEO 友好的博客，这是目前最合适的选择之一。
```

## Important

- Never generate a description that repeats the title verbatim
- Never start with "本文" or "This article" — the reader already knows it's an article
- If the article already has a good description, tell the user and ask if they still want a new one
- Respect the user's communication language
