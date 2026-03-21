import type { CommentsConfig } from '@/data/comments'

export const commentsConfig: CommentsConfig = {
  provider: 'giscus',
  giscus: {
    // 在 https://giscus.app 获取以下配置
    repo: 'KyleRicardo/astrologer',
    repoId: 'R_kgDOOJE0AA',
    category: 'Comments',
    categoryId: 'DIC_kwDOOJE0AM4C495J',
    mapping: 'pathname',
    reactionsEnabled: true,
    inputPosition: 'bottom',
    strict: true,
  },
}
