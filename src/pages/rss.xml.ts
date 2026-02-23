import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '@/site.config'
import { defaultLang } from '@/i18n/ui'
import { getLocaleFromLang } from '@/i18n/utils'
import { getSlugById } from '@/utils/getPosts'
import type { APIContext } from 'astro'

export async function GET({ site }: APIContext) {
  const blog = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })

  return rss({
    title: siteConfig.title_zh,
    description: siteConfig.description,
    site: site ?? siteConfig.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/posts/${getSlugById(post.id)}/`,
    })),
    customData: `<language>${getLocaleFromLang(defaultLang)}</language>`,
  })
}
