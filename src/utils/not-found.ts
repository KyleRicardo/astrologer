import { defaultLang, languages } from '@/i18n/ui'
import type { Lang } from '@/i18n/utils'

export function get404LangFromPathname(pathname: string): Lang {
  const [, maybeLang = ''] = pathname.split('/')

  return maybeLang in languages ? (maybeLang as Lang) : defaultLang
}
