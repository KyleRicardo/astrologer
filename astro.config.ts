import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCallouts from 'rehype-callouts'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'

import { remarkAutoExcerpt } from './remark-auto-excerpt.mjs'
import { remarkReadingTime } from './remark-reading-time.mjs'
import { rehypeImageSize } from './rehype-image-size'
import { transformers } from './src/lib/highlight-code'
import { siteConfig } from './src/site.config'

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    optimizeDeps: {
      include: ['astro/toolbar'],
    },
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkAutoExcerpt,
    ],
    rehypePlugins: [
      [rehypePrettyCode, {
        defaultLang: {
          block: 'plaintext',
        },
        theme: {
          dark: 'dark-plus',
          light: 'github-light-default',
        },
        transformers,
      }],
      rehypeCallouts,
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'prepend',
        properties: {
          className: ['heading-anchor'],
          ariaLabel: 'Link to this section',
        },
        content: {
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['heading-anchor-icon'],
            ariaHidden: 'true',
          },
          children: [{ type: 'text', value: '#' }],
        },
      }],
      rehypeImageSize,
    ],
  },
  integrations: [
    icon(),
    mdx(),
    sitemap(),
  ],
})
