import { defaultLang } from './i18n/ui'
import type { Lang } from './i18n/utils'

export interface SiteConfig {
  domain: string
  // 访问的URL
  site: string
  subtitle: string
  author: string
  locales: Localized<LocaleConfig>
  // 网站创建时间
  createTime: string
  // 是否开启作品展柜
  enableProjectsShowcase: boolean
  // 是否开启关于页面
  enableAboutMe: boolean
  // 主页是否显示推广信息
  enablePromotionOnHomepage: boolean
  // 主页是否显示最近项目
  enableRecentProjectsOnHomepage: boolean
  // 主页最近文章个数
  recentPostsCount: number
  // 主页最近项目个数
  recentProjectsCount: number
  // 项目页面是否显示推广信息
  enablePromotionOnProjectsPage: boolean
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
  keywords: string[]
  hero: HeroConfig
}

export interface SocialLink {
  name: string
  url: string
  icon: string
  showOnHeader?: boolean
}

export const siteConfig: SiteConfig = {
  domain: 'kylericardo.com',
  // 访问的URL
  site: 'https://kylericardo.com',
  subtitle: 'To make the world better, and life easier.',
  author: 'Kyle Ricardo',
  locales: {
    en: {
      title: "Kyle's Home",
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
  // 是否开启作品展柜
  enableProjectsShowcase: true,
  // 是否开启关于页面
  enableAboutMe: true,
  // 主页是否显示推广信息
  enablePromotionOnHomepage: true,
  // 主页是否显示最近项目
  enableRecentProjectsOnHomepage: true,
  // 主页最近文章个数
  recentPostsCount: 6,
  // 主页最近项目个数
  recentProjectsCount: 3,
  // 项目页面是否显示推广信息
  enablePromotionOnProjectsPage: false,
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
