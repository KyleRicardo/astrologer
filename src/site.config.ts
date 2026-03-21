import { defaultLang } from './i18n/ui'
import type { Lang } from './i18n/utils'
import type { Icon as IconName } from 'virtual:astro-icon'

export interface SiteConfig {
  domain: string
  // 站点部署 URL（Astro 配置与运行时共享的唯一来源）
  site: string
  // 作者主页链接（Footer 使用；留空则显示纯文本作者名）
  authorUrl?: string
  locales: Localized<LocaleConfig>
  // 网站创建时间
  createTime: string
  // 版权起始年（区别于 createTime，可能比站点创建时间更早）
  startYear: number
  // 页面标题分隔符，用于 <title>{pageTitle}{separator}{siteTitle}</title>
  titleSeparator: string
  // 是否开启作品展柜
  enableProjectsShowcase: boolean
  // 是否开启关于页面
  enableAboutMe: boolean
  // 是否开启友链页面
  enableFriendLinks: boolean
  // 是否开启文章评论
  enableComments: boolean
  // 主页是否显示最近项目
  enableRecentProjectsOnHomepage: boolean
  // 主页最近文章个数
  recentPostsCount: number
  // 主页最近项目个数
  recentProjectsCount: number
  // 社交链接
  socials: SocialLink[]
}

type Localized<T> = Record<Lang, T>

export interface HeroConfig {
  headline: string
  tagline: string
  techStack: string[]
  promo: {
    active: boolean
    label?: string
    title: string
    link: string
  }
}

interface LocaleConfig {
  title: string
  description: string
  author: string
  subtitle: string
  keywords: string[]
  hero: HeroConfig
}

export interface SocialLink {
  name: string
  url: string
  icon: IconName
  showOnHeader?: boolean
}

export const siteConfig: SiteConfig = {
  domain: 'astrologer-theme.vercel.app',
  // 站点部署 URL（Astro 配置与运行时共享的唯一来源）
  site: 'https://astrologer-theme.vercel.app',
  authorUrl: 'https://github.com/KyleRicardo',
  locales: {
    en: {
      title: "Kyle's Home",
      author: 'Kyle Ricardo',
      subtitle: 'To make the world better, and life easier.',
      description: "Kyle Ricardo's personal blog",
      keywords: [
        'Kyle Ricardo',
        'Blog',
        'Indie Hacker',
      ],
      hero: {
        headline: 'Kyle Ricardo',
        tagline: 'Creator, builder, hacker and design engineer',
        techStack: [
          'Java',
          'Go',
          'Rust',
          'Node.js',
          'React',
        ],
        promo: {
          active: true,
          label: 'New',
          title: 'Astrologer is now in beta! Try it out',
          link: 'https://github.com/KyleRicardo/astrologer',
        },
      },
    },
    zh: {
      title: '今夕何夕',
      author: '今夕何夕',
      subtitle: '让世界更美好，让生活更从容。',
      description: 'Kyle Ricardo的个人博客，分享技术、生活、创作等内容。',
      keywords: [
        'Kyle Ricardo',
        '今夕何夕',
        '博客',
        '独立开发者',
      ],
      hero: {
        headline: '今夕何夕',
        tagline: '全栈开发者 & 设计工程师',
        techStack: [
          'Java',
          'Go',
          'Rust',
          'Node.js',
          'React',
        ],
        promo: {
          active: true,
          label: 'NEW',
          title: 'Astrologer已开始beta测试！来试试吧',
          link: 'https://github.com/KyleRicardo/astrologer',
        },
      },
    },
  },
  // 网站创建时间
  createTime: '2025-03-15',
  // 版权起始年（Footer 显示 "startYear - currentYear"）
  startYear: 2018,
  // 页面标题分隔符
  titleSeparator: ' | ',
  // 是否开启作品展柜
  enableProjectsShowcase: true,
  // 是否开启关于页面
  enableAboutMe: true,
  // 是否开启友链页面
  enableFriendLinks: true,
  // 是否开启文章评论（需先在 src/config/comments.ts 填写 Giscus 配置）
  enableComments: true,
  // 主页是否显示最近项目
  enableRecentProjectsOnHomepage: true,
  // 主页最近文章个数
  recentPostsCount: 6,
  // 主页最近项目个数
  recentProjectsCount: 3,
  // 社交链接
  socials: [
    {
      name: 'Email',
      url: 'mailto:kylericardo666@gmail.com',
      icon: 'ri:mail-line',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/KyleRicardo',
      icon: 'ri:github-fill',
      showOnHeader: true,
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/KyleRicardo666',
      icon: 'ri:twitter-x-line',
      showOnHeader: true,
    },
    {
      name: 'Mastodon',
      url: 'https://mastodon.social/@KyleRicardo',
      icon: 'ri:mastodon-fill',
    },
    {
      name: 'Bluesky',
      url: 'https://bsky.app/profile/kylericardo.bsky.social',
      icon: 'ri:bluesky-line',
    },
  ],
}

export const getSiteConfig = (lang: Lang) => {
  const locale = siteConfig.locales[lang] || siteConfig.locales[defaultLang]

  return {
    ...siteConfig,
    ...locale,
  }
}
