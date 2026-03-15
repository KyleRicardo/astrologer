import type { APIRoute } from 'astro'
import { languages } from '@/i18n/ui'
import type { Lang } from '@/i18n/utils'
import { buildSearchDocuments } from '@/utils/search-index'

export function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({
    params: { lang },
  }))
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang
  const documents = await buildSearchDocuments(lang)
  return new Response(JSON.stringify(documents), {
    headers: { 'Content-Type': 'application/json' },
  })
}
