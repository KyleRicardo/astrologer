import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
    description: z.string().optional(),
		// Transform string to Date object
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		excerpt: z.string().optional(),
		cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    pinned: z.boolean().optional(),
	}),
});

const project = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/project', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		cover: z.string().optional(),
    icon: image(),
		title: z.string(),
    description: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
    github: z.string().url().optional(),
    homepage: z.string().url().optional(),
    liveDemo: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    pinned: z.boolean().optional(),
	}),
});

export const collections = { blog, project };
