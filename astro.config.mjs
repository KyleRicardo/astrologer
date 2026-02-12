// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { remarkReadingTime } from './remark-reading-time.mjs';
import { remarkAutoExcerpt } from './remark-auto-excerpt.mjs';
import rehypeCallouts from 'rehype-callouts';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      remarkAutoExcerpt,
    ],
    rehypePlugins: [
      rehypeCallouts,
    ],
    shikiConfig: {
      themes: {
        light: 'one-light',
        dark: 'plastic',
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
