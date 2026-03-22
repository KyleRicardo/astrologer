import type { Lang } from '@/i18n/utils'
import { getSiteConfig, siteConfig } from '@/site.config'

export function getAuthorSchema(lang: Lang) {
  const config = getSiteConfig(lang)
  return {
    '@type': 'Person' as const,
    name: config.author,
    ...(siteConfig.authorUrl ? { url: siteConfig.authorUrl } : {}),
  }
}
