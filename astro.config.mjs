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


import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkAutoExcerpt,
    ],
    rehypePlugins: [
      rehypeCallouts,
      rehypeKatex,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  integrations: [
    icon(),
    mdx(),
    sitemap(),
    react(),
  ]
});
