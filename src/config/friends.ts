import type { Friend } from '@/data/friends'

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
    name: 'Sakura',
    bio: '',
    avatar: 'https://github.com/rikkayoru.png',
    href: 'https://yoru.me',
  },
  {
    name: { zh: '云芙芙', en: 'Bess Croft' },
    bio: '希望能够通过编程，帮助他人和创造一些有意思的东西',
    avatar: 'https://github.com/BessCroft.png',
    href: 'https://besscroft.com',
  },
]
