import type { Lang } from '@/i18n/utils'
import { getCollection, type CollectionEntry } from 'astro:content'

interface GroupedPosts {
  year: number
  posts: CollectionEntry<'blog'>[]
}

// Format article list by year
const groupPostsByYear = (posts: CollectionEntry<'blog'>[]): GroupedPosts[] => {
  // Group posts by year
  const groupedByYear = posts.reduce<Record<number, CollectionEntry<'blog'>[]>>(
    (acc, post) => {
      const year = post.data.date.getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(post)
      return acc
    },
    {},
  )

  // Convert to array and sort years in descending order
  return Object.entries(groupedByYear)
    .map(([year, posts]) => ({
      year: Number.parseInt(year),
      posts,
    }))
    .sort((a, b) => b.year - a.year)
}

// 获取分类下的文章列表
const getPostsByCategory = async (
  category: string,
  lang: string,
): Promise<GroupedPosts[]> => {
  const posts = await getCollection('blog', ({ id, data }) => {
    const isProd = import.meta.env.PROD ? data.draft !== true : true
    const isLang = id.startsWith(`${lang}/`)
    return isProd && isLang
  })
  const filteredPosts = posts
    .filter((post) => post.data.category === category)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  return groupPostsByYear(filteredPosts)
}

// 获取标签下的文章列表
const getPostsByTag = async (
  tag: string,
  lang: string,
): Promise<GroupedPosts[]> => {
  const posts = await getCollection('blog', ({ id, data }) => {
    const isProd = import.meta.env.PROD ? data.draft !== true : true
    const isLang = id.startsWith(`${lang}/`)
    return isProd && isLang
  })
  const filteredPosts = posts.filter((i) => i.data.tags?.includes(tag)).sort((
    a,
    b,
  ) => b.data.date.valueOf() - a.data.date.valueOf())
  return groupPostsByYear(filteredPosts)
}

// 获取归档列表
const getArchives = async (lang: Lang): Promise<GroupedPosts[]> => {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  const sortedPosts = posts
    .filter((post) => post.id.startsWith(`${lang}/`))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
  return groupPostsByYear(sortedPosts)
}

export function getSlugById(id: string) {
  return id.split('/').slice(1).join('/')
}

export const DEFAULT_COVER_PATH = '/og/default-cover.png'

function getPostOgImagePath(id: string) {
  const [lang, ...rest] = id.split('/')
  const slug = rest.join('/')
  return `/og/posts/${lang}/${slug}.png`
}

export async function getPostPaths(lang: Lang) {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  return posts
    .filter((post) => post.id.startsWith(`${lang}/`))
    .map((post) => ({
      params: { slug: getSlugById(post.id) },
      props: post,
    }))
}

export async function getPostsByLang(lang: Lang) {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  return posts
    .filter((post) => post.id.startsWith(`${lang}/`))
    .map((post) => ({
      ...post,
      slug: getSlugById(post.id),
    }))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getProjectOgImagePath(id: string) {
  const [lang, ...rest] = id.split('/')
  const slug = rest.join('/')
  return `/og/projects/${lang}/${slug}.png`
}

export async function getProjectPaths(lang: Lang) {
  const projects = await getCollection('project', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  return projects
    .filter((project) => project.id.startsWith(`${lang}/`))
    .map((project) => ({
      params: { slug: getSlugById(project.id) },
      props: project,
    }))
}

export function sanitizeSlug(slug: string) {
  return slug.toLowerCase().replaceAll(/[^a-z0-9_-]+/g, '-').replaceAll(
    /^-+|-+$/g,
    '',
  )
}

export async function getProjectsByLang(lang: Lang) {
  const projects = await getCollection('project', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  return projects
    .filter((project) => project.id.startsWith(`${lang}/`))
    .map((project) => ({
      ...project,
      slug: getSlugById(project.id),
    }))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export {
  getArchives,
  getPostOgImagePath,
  getPostsByCategory,
  getPostsByTag,
  type GroupedPosts,
}
