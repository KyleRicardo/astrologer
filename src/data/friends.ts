import type { Lang } from '@/i18n/utils'
import { defaultLang } from '@/i18n/ui'

type Localized<T> = Partial<Record<Lang, T>>
type LocalizedString = string | Localized<string>

export interface Friend {
  /** 名称，支持 i18n */
  name: LocalizedString
  /** 简介 */
  bio?: LocalizedString
  /** 头像 URL（推荐 GitHub: https://github.com/xxx.png） */
  avatar: string
  /** 主页链接 */
  href: string
}

/** 解析 LocalizedString，优先使用指定语言，回退到默认语言 */
export function localize(
  value: LocalizedString | undefined,
  lang: Lang,
): string {
  if (value === undefined) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value[defaultLang] ?? ''
}
