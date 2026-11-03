import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      role: z.string(),
      year: z.number().int(),
      tags: z.array(z.string()).default([]),
      cover: image(),
      summary: z.string(),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
    }),
});

export const collections = { projects };
