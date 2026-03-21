export interface GiscusConfig {
  repo: `${string}/${string}`
  repoId: string
  category: string
  categoryId: string
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific'
  reactionsEnabled?: boolean
  inputPosition?: 'top' | 'bottom'
  /** 严格匹配模式：避免不同文章串评论 */
  strict?: boolean
}

export interface CommentsConfig {
  provider: 'giscus'
  giscus: GiscusConfig
}
