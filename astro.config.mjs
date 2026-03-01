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

import react from '@astrojs/react';

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
          dark: 'github-dark',
          light: 'github-light-default',
        }
      }],
      rehypeCallouts,
      rehypeKatex,
    ],
  },

  integrations: [
    icon(),
    mdx(),
    sitemap(),
    react(),
  ]
});
