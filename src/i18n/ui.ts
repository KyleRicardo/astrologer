import { siteConfig } from '@/site.config'

export const languages = {
  zh: '中文',
  en: 'English',
} as const

export const defaultLang = 'zh'
export const showDefaultLang = false

export const ui = {
  zh: {
    'website.title': siteConfig.title_zh,
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.about': '关于',
    'nav.posts': '文章',
    'nav.archives': '归档',
    'nav.categories': '分类',
    'nav.tags': '标签',
    'nav.projects': '作品',
    'home.recentPosts': '最近文章',
    'home.recentProjects': '最近作品',
    'home.morePosts': '更多文章',
    'home.moreProjects': '更多作品',
    'archive.posts': '篇文章',
    'categories.title': '全部分类',
    'tags.title': '全部标签',
    'projects.title': '作品',
    'projects.description': '我创作的一些有趣的项目或开源作品',
    'toc.title': '目录',
    'post.readingMinutes': ({ minutes }: { minutes: number }) =>
      `阅读约需${minutes}分钟`,
    'og.label.post': '文章',
    'og.label.project': '作品',
    '404.title': '页面未找到',
    '404.description': '抱歉，您访问的页面不存在。',
    '404.backHome': '返回首页',
  },
  en: {
    'website.title': siteConfig.title_en,
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.posts': 'Posts',
    'nav.archives': 'Archives',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'nav.projects': 'Projects',
    'home.recentPosts': 'Recent Posts',
    'home.recentProjects': 'Recent Projects',
    'home.morePosts': 'More Posts',
    'home.moreProjects': 'More Projects',
    'archive.posts': 'posts',
    'categories.title': 'Categories',
    'tags.title': 'Tags',
    'projects.title': 'Projects',
    'projects.description':
      'Interesting works or open source projects I created',
    'toc.title': 'Table of Contents',
    'post.readingMinutes': ({ minutes }: { minutes: number }) =>
      `${minutes} min read`,
    'og.label.post': 'Post',
    'og.label.project': 'Project',
    '404.title': 'Page Not Found',
    '404.description': "Sorry, the page you're looking for doesn't exist.",
    '404.backHome': 'Back to Home',
  },
} as const

export const localeByLang = {
  en: 'en-US',
  zh: 'zh-CN',
} as const
