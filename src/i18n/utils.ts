import { ui, defaultLang, showDefaultLang, localeByLang } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t<K extends keyof typeof ui[typeof defaultLang]>(
    key: K,
    // 这里的魔法是：
    // 1. 获取对应 Key 的值类型
    // 2. 如果是函数，提取它的参数类型 (Parameters<T>)
    // 3. 如果是字符串，则不需要参数 ([])
    ...args: typeof ui[typeof defaultLang][K] extends (...args: any[]) => any
      ? Parameters<typeof ui[typeof defaultLang][K]>
      : []
  ) {
    const dict = ui[lang] || ui[defaultLang];
    const value = dict[key];

    if (typeof value === 'function') {
      // @ts-ignore: TS 在这种复杂动态类型推断上有时会犯傻，但在外部调用时是安全的
      return value(...args);
    }
    
    return value;
  }
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
  }
}

export function getLocaleFromLang(lang: Lang) {
  return localeByLang[lang] ?? localeByLang[defaultLang]
}