import { getCollection } from 'astro:content'
import { defaultLang } from '@/i18n/ui'

export interface Category {
  name: string
  count: number
  slug: string
  href: string
}

/**
 * Get info for a single category (used by article card/page)
 */
export function getCategoryInfo(
  category: string | undefined,
  lang: string,
): Category | null {
  if (!category) return null

  const prefix = lang === defaultLang ? '' : `/${lang}`
  return {
    name: category,
    count: 0, // Count not needed for individual display
    slug: category,
    href: `${prefix}/categories/${category}`,
  }
}

/**
 * Get all unique categories with post counts
 */
export async function getCategories(lang: string): Promise<Category[]> {
  const posts = await getCollection('blog', ({ id, data }) => {
    const isProd = import.meta.env.PROD ? data.draft !== true : true
    const isLang = id.startsWith(`${lang}/`)
    return isProd && isLang
  })

  // Count posts per category
  const categoryMap = new Map<string, number>()

  for (const post of posts) {
    const category = post.data.category
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    }
  }

  // Convert to array and sort by count (descending), then name (ascending)
  return Array.from(categoryMap.entries())
    .map(([name, count]) => {
      const prefix = lang === defaultLang ? '' : `/${lang}`
      return {
        name,
        count,
        slug: name,
        href: `${prefix}/categories/${name}`,
      }
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/**
 * Generate all category slugs for static paths
 */
export async function generateCategorySlugs(lang: string): Promise<string[]> {
  const categories = await getCategories(lang)
  return categories.map(c => c.slug)
}
