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

export const collections = { blog };
