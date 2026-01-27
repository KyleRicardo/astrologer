import { getCollection, type CollectionEntry } from "astro:content";

export interface Category {
  name: string;
  count: number;
  slug: string;
  href: string;
}

/**
 * Get info for a single category (used by article card/page)
 */
export function getCategoryInfo(category: string | undefined): Category | null {
  if (!category) return null;
  
  return {
    name: category,
    count: 0, // Count not needed for individual display
    slug: category,
    href: `/categories/${category}`,
  };
}

/**
 * Get all unique categories with post counts
 */
export async function getCategories(): Promise<Category[]> {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  
  // Count posts per category
  const categoryMap = new Map<string, number>();
  
  for (const post of posts) {
    const category = post.data.category;
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  }
  
  // Convert to array and sort by count (descending), then name (ascending)
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name,
      href: `/categories/${name}`,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Generate all category slugs for static paths
 */
export async function generateCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map(c => c.slug);
}
