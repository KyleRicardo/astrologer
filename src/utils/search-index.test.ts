import { describe, expect, it } from 'vitest'

import { cleanMarkdown, generateAliases, splitSections } from './search-index'

describe('cleanMarkdown', () => {
  it('removes fenced code blocks entirely', () => {
    const input = 'before\n```js\nconst x = 1\n```\nafter'
    expect(cleanMarkdown(input)).toBe('before\n\nafter')
  })

  it('removes fenced code blocks with language tag', () => {
    const input = 'text\n```typescript\ninterface Foo {}\n```\nmore'
    expect(cleanMarkdown(input)).toBe('text\n\nmore')
  })

  it('keeps inline code text but strips backticks', () => {
    expect(cleanMarkdown('use `pnpm dev` here')).toBe('use pnpm dev here')
  })

  it('preserves searchable code-style terms', () => {
    const result = cleanMarkdown('install `@astrojs/mdx` package')
    expect(result).toContain('@astrojs/mdx')
  })

  it('converts image syntax to alt text', () => {
    expect(cleanMarkdown('![logo](https://x.com/i.png)')).toBe('logo')
  })

  it('converts link syntax to text', () => {
    expect(cleanMarkdown('[Astro](https://astro.build)')).toBe('Astro')
  })

  it('strips HTML tags but keeps text', () => {
    expect(cleanMarkdown('<div class="foo">text</div>')).toBe('text')
  })

  it('removes self-closing HTML/JSX tags', () => {
    expect(cleanMarkdown('before<br/>after')).toBe('beforeafter')
  })

  it('removes heading markers', () => {
    expect(cleanMarkdown('## Hello\n### World')).toBe('Hello\nWorld')
  })

  it('strips bold markers', () => {
    expect(cleanMarkdown('**bold** text')).toBe('bold text')
  })

  it('strips italic markers', () => {
    expect(cleanMarkdown('*italic* text')).toBe('italic text')
  })

  it('removes blockquote markers', () => {
    expect(cleanMarkdown('> quoted text')).toBe('quoted text')
  })

  it('removes list markers', () => {
    expect(cleanMarkdown('- item one\n- item two')).toBe(
      'item one\nitem two',
    )
  })

  it('removes numbered list markers', () => {
    expect(cleanMarkdown('1. first\n2. second')).toBe('first\nsecond')
  })

  it('compresses multiple newlines', () => {
    expect(cleanMarkdown('a\n\n\n\nb')).toBe('a\n\nb')
  })

  it('strips MDX import statements', () => {
    expect(cleanMarkdown('import { Foo } from "bar"\nsome text')).toBe(
      'some text',
    )
  })

  it('strips MDX export statements', () => {
    expect(cleanMarkdown('export const meta = {}\nsome text')).toBe(
      'some text',
    )
  })

  it('removes horizontal rules', () => {
    expect(cleanMarkdown('above\n---\nbelow')).toBe('above\n\nbelow')
  })
})

describe('splitSections', () => {
  it('splits markdown into heading-based sections', () => {
    const raw =
      '# Top\n\nIntro\n\n## First\n\nContent 1\n\n## Second\n\nContent 2'
    const headings = [
      { depth: 2, slug: 'first', text: '# First' },
      { depth: 2, slug: 'second', text: '# Second' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections).toHaveLength(2)
    expect(sections[0].slug).toBe('first')
    expect(sections[0].content).toContain('Content 1')
    expect(sections[1].slug).toBe('second')
    expect(sections[1].content).toContain('Content 2')
  })

  it('handles h3 nested under h2', () => {
    const raw = '## Parent\n\nParent text\n\n### Child\n\nChild text'
    const headings = [
      { depth: 2, slug: 'parent', text: '# Parent' },
      { depth: 3, slug: 'child', text: '# Child' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections).toHaveLength(2)
    expect(sections[0].slug).toBe('parent')
    expect(sections[1].slug).toBe('child')
    expect(sections[1].content).toContain('Child text')
  })

  it('ignores headings inside code blocks', () => {
    const raw =
      '## Real\n\nText\n\n```md\n## Fake\n\nNot a heading\n```\n\n## Also Real\n\nMore text'
    const headings = [
      { depth: 2, slug: 'real', text: '# Real' },
      { depth: 2, slug: 'also-real', text: '# Also Real' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections).toHaveLength(2)
    expect(sections[0].slug).toBe('real')
    expect(sections[1].slug).toBe('also-real')
  })

  it('returns empty array when no h2/h3 found', () => {
    const raw = '# Only H1\n\nSome text'
    const headings = [
      { depth: 1, slug: 'only-h1', text: '# Only H1' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections).toHaveLength(0)
  })

  it('skips headings with no matching slug', () => {
    const raw = '## Orphan\n\nText'
    // No headings array match
    const headings: Array<{ depth: number; slug: string; text: string }> = []
    const sections = splitSections(raw, headings)
    expect(sections).toHaveLength(0)
  })

  it('cleans section content text', () => {
    const raw = '## Section\n\n**bold** and `code` and [link](url)'
    const headings = [
      { depth: 2, slug: 'section', text: '# Section' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections[0].content).toBe('bold and code and link')
  })

  it('strips heading text formatting', () => {
    const raw = '## **Bold** Heading\n\nContent'
    const headings = [
      { depth: 2, slug: 'bold-heading', text: '# **Bold** Heading' },
    ]
    const sections = splitSections(raw, headings)
    expect(sections[0].heading).toBe('Bold Heading')
  })
})

describe('generateAliases', () => {
  it('adds unscoped form of @scope/package', () => {
    const result = generateAliases('use @astrojs/mdx for MDX')
    expect(result).toContain('astrojs mdx')
    expect(result).toContain('@astrojs/mdx')
  })

  it('handles multiple packages', () => {
    const result = generateAliases('@orama/orama and @orama/tokenizers')
    expect(result).toContain('orama orama')
    expect(result).toContain('orama tokenizers')
  })

  it('splits dotted filenames', () => {
    const result = generateAliases('edit astro.config.mjs')
    expect(result).toContain('astro config mjs')
  })

  it('strips leading dot from extensions', () => {
    const result = generateAliases('a .astro file')
    expect(result).toContain('astro')
  })

  it('returns original text when no aliases found', () => {
    const input = 'just normal text'
    expect(generateAliases(input)).toBe(input)
  })
})
