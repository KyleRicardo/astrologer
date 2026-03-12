// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { remarkReadingTime } from './remark-reading-time.mjs';
import { remarkAutoExcerpt } from './remark-auto-excerpt.mjs';
import remarkMath from 'remark-math';
import rehypeCallouts from 'rehype-callouts';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { transformers } from './src/lib/highlight-code'

// https://astro.build/config
export default defineConfig({
  site: 'https://astrologer-theme.vercel.app',
  vite: {
    plugins: [tailwindcss()]
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
    ],
  },

  integrations: [
    icon(),
    mdx(),
    sitemap(),
  ]
});
