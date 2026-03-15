import type { SearchDocument } from '@/utils/search-index'

// Orama types
type OramaDB = ReturnType<typeof import('@orama/orama').create>

// Singleton cache — survives View Transitions navigation
// because ES module scope persists across client-side nav
const dbCache = new Map<string, OramaDB>()

const schema = {
  kind: 'string',
  type: 'string',
  url: 'string',
  pageTitle: 'string',
  heading: 'string',
  description: 'string',
  excerpt: 'string',
  sectionText: 'string',
  body: 'string',
  tags: 'string',
  category: 'string',
  date: 'string',
} as const

export interface SearchHit {
  kind: 'page' | 'heading'
  type: 'post' | 'project'
  url: string
  pageTitle: string
  heading: string
  description: string
  excerpt: string
  score: number
}

export type FilterType = 'all' | 'post' | 'project'

async function loadIndex(lang: string): Promise<OramaDB> {
  if (dbCache.has(lang)) return dbCache.get(lang)!

  // Dynamic imports — code-split Orama into its own chunk.
  // Chinese tokenizer only loads for zh pages.
  const [{ create, insertMultiple }, tokenizer] = await Promise.all([
    import('@orama/orama'),
    lang === 'zh'
      ? Promise.all([
        import('@orama/tokenizers/mandarin'),
        import('@orama/stopwords/mandarin'),
      ]).then(([{ createTokenizer }, { stopwords }]) =>
        createTokenizer({ language: 'mandarin', stopWords: stopwords })
      )
      : Promise.resolve(undefined),
  ])

  const db = create({
    schema,
    ...(tokenizer ? { components: { tokenizer } } : {}),
  })

  const res = await fetch(`/search-index/${lang}.json`)
  const documents: SearchDocument[] = await res.json()
  insertMultiple(db, documents)

  dbCache.set(lang, db)
  return db
}

export async function performSearch(
  lang: string,
  term: string,
  filter: FilterType = 'all',
  limit = 20,
): Promise<SearchHit[]> {
  if (!term.trim()) return []

  const { search } = await import('@orama/orama')
  const db = await loadIndex(lang)

  const where = filter !== 'all' ? { type: filter } : undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = await search(db as any, {
    term,
    properties: '*',
    boost: {
      pageTitle: 5,
      heading: 3,
      tags: 2,
      category: 2,
      description: 2,
      excerpt: 1.5,
      sectionText: 1,
      body: 1,
    },
    where,
    limit,
    threshold: 0,
  })

  // Dedup: max 2 hits per page URL (strip #hash)
  const pageHitCount = new Map<string, number>()
  const hits: SearchHit[] = []

  for (const hit of results.hits) {
    const doc = hit.document as unknown as SearchDocument
    const pageUrl = doc.url.split('#')[0]
    const count = pageHitCount.get(pageUrl) ?? 0
    if (count >= 2) continue
    pageHitCount.set(pageUrl, count + 1)

    hits.push({
      kind: doc.kind,
      type: doc.type,
      url: doc.url,
      pageTitle: doc.pageTitle,
      heading: doc.heading,
      description: doc.description,
      excerpt: doc.excerpt,
      score: hit.score,
    })
  }

  return hits
}
