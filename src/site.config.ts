export interface SiteConfig {
  title_zh: string;
  title_en: string;
  // 访问的域名
  site: string;
  subtitle: string;
  description: string;
  keywords: string[];
  author: string;
  avatar: string;
  // Cover 网站缩略图
  cover: string;
  // 网站创建时间
  createTime: string;
  // 是否开启作品展柜
  enableProjectsShowcase: boolean;
  // 是否开启关于页面
  enableAboutMe: boolean;
  // 主页是否显示推广信息
  enablePromotionOnHomepage: boolean;
  // 主页是否显示最近项目
  enableRecentProjectsOnHomepage: boolean;
  // 主页最近文章个数
  recentPostsCount: number;
  // 主页最近项目个数
  recentProjectsCount: number;
  // 项目页面是否显示推广信息
  enablePromotionOnProjectsPage: boolean;
  // 社交链接
  socials: SocialLink[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  showOnHeader?: boolean;
}

export const siteConfig: SiteConfig = {
  title_zh: "Kyle's Blog",
  title_en: "Kyle's Blog",
  // 访问的域名
  site: 'https://kylericardo.com',
  subtitle: 'To make the world better, and life easier.',
  description: 'Kyle Ricardo的个人博客，分享技术、生活、创作等内容。',
  keywords: [
    'Kyle Ricardo',
    'Blog',
    '博客',
    'Indie Hacker',
    '独立开发者',
  ],
  author: 'Kyle Ricardo',
  avatar: '/assets/logo.svg',
  // Cover 网站缩略图
  cover: '/assets/astro.svg',
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
  enablePromotionOnProjectsPage: true,
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
