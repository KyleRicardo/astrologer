import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		excerpt: z.string().optional(),
		cover: z.string().optional(),
    categories: z.union([z.string(), z.array(z.union([z.string(), z.array(z.string())]))]).optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    pinned: z.boolean().optional(),
	}),
});

const project = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/project', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		cover: image(),
    icon: image(),
		title: z.string(),
    description: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
    github: z.string().optional(),
    homepage: z.string().optional(),
    liveDemo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    pinned: z.boolean().optional(),
	}),
});

const promo = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/promo', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		cover: image(),
    icon: image(),
		title: z.string(),
    description: z.string(),
    linkText: z.string().optional(),
    linkTarget: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
    github: z.string().optional(),
    homepage: z.string().optional(),
    liveDemo: z.string().optional(),
	}),
});

const banner = defineCollection({
  loader: glob({ base: './src/content/banner', pattern: '**/*.{md,mdx}'}),
  schema: z.object({
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    link: z.string().optional(),
  })
})

export const collections = { blog, project, banner, promo };
