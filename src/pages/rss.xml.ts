import rss from '@astrojs/rss'
import { getSiteConfig } from '@/site.config'
import { defaultLang } from '@/i18n/ui'
import { getLocaleFromLang } from '@/i18n/utils'
import { getPostsByLang } from '@/utils/get-contents'
import type { APIContext } from 'astro'

export async function GET({ site }: APIContext) {
  const posts = await getPostsByLang(defaultLang)

  const siteConfig = getSiteConfig(defaultLang)

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: site ?? siteConfig.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/posts/${post.slug}`,
    })),
    customData: `<language>${getLocaleFromLang(defaultLang)}</language>`,
  })
}
