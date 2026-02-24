import rss from '@astrojs/rss'
import { getSiteConfig } from '@/site.config'
import { languages, defaultLang } from '@/i18n/ui'
import { getLocaleFromLang, useTranslatedPath, type Lang } from '@/i18n/utils'
import { getPostsByLang } from '@/utils/get-contents'
import type { APIContext } from 'astro'

export async function getStaticPaths() {
  return Object.keys(languages)
    .filter((l) => l !== defaultLang)
    .map((l) => ({ params: { lang: l } }))
}

export async function GET({ params, site }: APIContext) {
  const lang = params.lang as Lang
  const posts = await getPostsByLang(lang)
  const siteConfig = getSiteConfig(lang)
  const translatePath = useTranslatedPath(lang)

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: site ?? siteConfig.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: translatePath(`/posts/${post.slug}`),
    })),
    customData: `<language>${getLocaleFromLang(lang)}</language>`,
  })
}
