import SITE_CONFIG from '@/config';

export const languages = {
  zh: '中文',
  en: 'English',
};

export const defaultLang = 'zh';
export const showDefaultLang = false;

export const ui = {
  zh: {
    'website.title': SITE_CONFIG.title_zh,
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.archives': '归档',
    'nav.categories': '分类',
    'nav.tags': '标签',
    'nav.projects': '作品',
    'nav.about': '关于',
    'archive.posts': '篇文章',
    'categories.name': '全部分类',
    'tags.name': '全部标签',
  },
  en: {
    'website.title': SITE_CONFIG.title_en,
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.archives': 'Archives',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'archive.posts': 'posts',
    'categories.name': 'Categories',
    'tags.name': 'Tags',
  },
} as const;
