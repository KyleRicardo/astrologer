import type { Lang } from '@/i18n/utils'
import { useTranslatedPath } from '@/i18n/utils'
import { getPostsByLang, getProjectsByLang } from '@/utils/get-contents'
import { render } from 'astro:content'

export interface SearchDocument {
  kind: 'page' | 'heading'
  type: 'post' | 'project'
  url: string
  pageTitle: string
  heading: string
  description: string
  excerpt: string
  sectionText: string
  body: string
  tags: string
  category: string
  date: string
}

interface HeadingInfo {
  depth: number
  slug: string
  text: string
}

interface Section {
  slug: string
  heading: string
  content: string
}

/**
 * Strip markdown syntax to plain searchable text.
 *
 * Order matters: fenced code blocks must be removed first
 * (before inline code processing), and whitespace compression
 * runs last.
 */
export function cleanMarkdown(raw: string): string {
  return (
    raw
      // 1. Remove fenced code blocks entirely (```...```)
      .replace(/^```[\s\S]*?^```/gm, '')
      // 2. Remove MDX import/export statements (top-level only)
      .replace(/^import\s.+$/gm, '')
      .replace(/^export\s.+$/gm, '')
      // 3. Remove HTML/JSX self-closing and paired tags
      .replace(/<\/?[a-zA-Z][^>]*\/?>/g, '')
      // 4. Remove images: ![alt](url) → alt
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 5. Convert links: [text](url) → text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 6. Remove heading markers (## Heading → Heading)
      .replace(/^#{1,6}\s+/gm, '')
      // 7. Remove bold/italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
      // 8. Remove inline code backticks but keep text
      .replace(/`([^`]+)`/g, '$1')
      // 9. Remove blockquote markers
      .replace(/^>\s?/gm, '')
      // 10. Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // 11. Remove list markers
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // 12. Compress whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/**
 * Split raw markdown by h2/h3 headings into sections.
 *
 * Important: operates on RAW markdown (before cleaning) because
 * we need ## markers for the heading regex. Each section's body
 * text is cleaned individually.
 *
 * Heading slugs come from render() headings — the authoritative
 * source that matches what appears on the actual page. We match
 * by normalizing heading text from both sources and comparing.
 */
export function splitSections(
  raw: string,
  headings: HeadingInfo[],
): Section[] {
  // Strip frontmatter if present (shouldn't be in entry.body,
  // but guard anyway)
  const body = raw.replace(/^---[\s\S]*?---\n*/, '')

  // Remove fenced code blocks before splitting — headings inside
  // code blocks are not real headings
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, '')

  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const matches: Array<{ text: string; index: number }> = []
  let m: RegExpExecArray | null
  while ((m = headingRegex.exec(withoutCode)) !== null) {
    matches.push({ text: m[2].trim(), index: m.index })
  }

  if (matches.length === 0) return []

  // Normalize text for matching against render() headings.
  // render() headings have prepended "# " from
  // rehype-autolink-headings — strip that, plus markdown formatting.
  const normalize = (s: string) =>
    s
      .replace(/^#\s*/, '')
      .replace(/\*{1,3}|_{1,3}/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
      .toLowerCase()

  // Build slug map from render() headings (authoritative source)
  const slugMap = new Map(
    headings
      .filter((h) => h.depth >= 2 && h.depth <= 3)
      .map((h) => [normalize(h.text), h.slug]),
  )

  const sections: Section[] = []

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const nextIndex = i + 1 < matches.length
      ? matches[i + 1].index
      : withoutCode.length
    const headingLineEnd = withoutCode.indexOf('\n', match.index)
    if (headingLineEnd === -1) continue

    const rawContent = withoutCode.slice(headingLineEnd + 1, nextIndex)
    const content = cleanMarkdown(rawContent)
    if (!content) continue

    const slug = slugMap.get(normalize(match.text))
    if (!slug) continue

    sections.push({
      slug,
      heading: match.text.replace(/\*{1,3}|_{1,3}/g, '').replace(
        /`([^`]+)`/g,
        '$1',
      ),
      content,
    })
  }

  return sections
}

/**
 * Generate search-friendly aliases for code-style terms.
 *
 * - `@astrojs/mdx` → also indexes `astrojs mdx`
 * - `astro.config.mjs` → also indexes `astro config mjs`
 * - `.astro` → also indexes `astro`
 */
export function generateAliases(text: string): string {
  const aliases = new Set<string>()

  // @scope/package → scope package
  for (const m of text.matchAll(/@([\w-]+)\/([\w-]+)/g)) {
    aliases.add(`${m[1]} ${m[2]}`)
  }

  // dotted filenames: foo.bar.baz → foo bar baz
  for (const m of text.matchAll(/\b([\w-]+(?:\.[\w-]+){1,})\b/g)) {
    aliases.add(m[1].replace(/\./g, ' '))
  }

  // .extension at word boundary → extension
  for (const m of text.matchAll(/(?<!\w)\.([\w-]+)\b/g)) {
    aliases.add(m[1])
  }

  if (aliases.size > 0) {
    return text + ' ' + [...aliases].join(' ')
  }
  return text
}

/**
 * Build all search documents for a given language.
 *
 * Processes both blog and project collections, generating:
 * - One page-level document per entry (full body text)
 * - One heading-level document per h2/h3 section (anchor-linked)
 */
export async function buildSearchDocuments(
  lang: Lang,
): Promise<SearchDocument[]> {
  const docs: SearchDocument[] = []
  const translatePath = useTranslatedPath(lang)

  // Process blog posts
  const posts = await getPostsByLang(lang)
  for (const post of posts) {
    const { headings, remarkPluginFrontmatter } = await render(post)
    const excerpt = (remarkPluginFrontmatter.excerpt as string) ?? ''
    const rawBody = post.body ?? ''
    const cleanedBody = cleanMarkdown(rawBody)
    const bodyWithAliases = generateAliases(cleanedBody)
    const url = translatePath(`/posts/${post.slug}`)
    const tags = post.data.tags?.join(', ') ?? ''
    const category = post.data.category ?? ''

    // Page-level document
    docs.push({
      kind: 'page',
      type: 'post',
      url,
      pageTitle: post.data.title,
      heading: '',
      description: post.data.description ?? '',
      excerpt,
      sectionText: '',
      body: bodyWithAliases,
      tags,
      category,
      date: post.data.date.toISOString(),
    })

    // Heading-level documents (h2/h3 sections)
    const sections = splitSections(rawBody, headings)
    for (const section of sections) {
      docs.push({
        kind: 'heading',
        type: 'post',
        url: `${url}#${section.slug}`,
        pageTitle: post.data.title,
        heading: section.heading,
        description: '',
        excerpt: '',
        sectionText: generateAliases(section.content),
        body: '',
        tags,
        category,
        date: post.data.date.toISOString(),
      })
    }
  }

  // Process projects
  const projects = await getProjectsByLang(lang)
  for (const project of projects) {
    const { headings, remarkPluginFrontmatter } = await render(project)
    const excerpt = (remarkPluginFrontmatter.excerpt as string) ?? ''
    const rawBody = project.body ?? ''
    const cleanedBody = cleanMarkdown(rawBody)
    const url = translatePath(`/projects/${project.slug}`)
    const tags = project.data.tags?.join(', ') ?? ''

    // Page-level document
    docs.push({
      kind: 'page',
      type: 'project',
      url,
      pageTitle: project.data.title,
      heading: '',
      description: project.data.description,
      excerpt,
      sectionText: '',
      body: generateAliases(cleanedBody),
      tags,
      category: '',
      date: project.data.date.toISOString(),
    })

    // Heading-level documents
    const sections = splitSections(rawBody, headings)
    for (const section of sections) {
      docs.push({
        kind: 'heading',
        type: 'project',
        url: `${url}#${section.slug}`,
        pageTitle: project.data.title,
        heading: section.heading,
        description: '',
        excerpt: '',
        sectionText: generateAliases(section.content),
        body: '',
        tags,
        category: '',
        date: project.data.date.toISOString(),
      })
    }
  }

  return docs
}
