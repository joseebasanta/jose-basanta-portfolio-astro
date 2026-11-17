// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://jose-basanta-portfolio-astro.vercel.app',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
