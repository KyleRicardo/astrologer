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

// ─── 友链数据 ───────────────────────────────────
// 按此格式添加你的朋友们：
//
//   {
//     name: 'Alice',              // 或 { zh: '爱丽丝', en: 'Alice' }
//     bio: 'Frontend developer',  // 可选
//     avatar: 'https://github.com/alice.png',
//     href: 'https://alice.dev',
//   },
//
export const friends: Friend[] = [
  {
    name: 'sxzz',
    bio:
      'Full-time open source developer. February & February February February February February February February February.',
    avatar: 'https://github.com/sxzz.png',
    href: 'https://sxzz.dev',
  },
  {
    name: 'Anthony Fu',
    bio: 'A fanatical open sourceror.',
    avatar: 'https://github.com/antfu.png',
    href: 'https://antfu.me',
  },
  {
    name: { zh: '云游君', en: 'YunYouJun' },
    bio: {
      zh: '希望能成为一个有趣的人',
      en: 'Hope to be an interesting person',
    },
    avatar: 'https://github.com/YunYouJun.png',
    href: 'https://www.yunyoujun.cn',
  },
  {
    name: { zh: '云芙芙', en: 'Bess Croft' },
    bio: '希望能够通过编程，帮助他人和创造一些有意思的东西',
    avatar: 'https://github.com/BessCroft.png',
    href: 'https://besscroft.com',
  },
]
