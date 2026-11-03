# Jose Basanta — Portfolio

Personal UI/UX & product design portfolio. Astro + Tailwind CSS v4 + Motion, statically
generated.

## Stack

- **[Astro](https://docs.astro.build)** — static-first framework, TypeScript strict mode.
- **[Tailwind CSS v4](https://tailwindcss.com)** — via `@tailwindcss/vite`, CSS-first config
  (`@theme` in `src/styles/tokens.css`). No `tailwind.config.js`.
- **[Motion](https://motion.dev)** (`motion`, formerly Framer Motion) — used two ways:
  - **Vanilla**, inside `<script>` tags in `.astro` components (`animate`, `inView`, `scroll`)
    for lightweight, JS-framework-free animation.
  - **React**, via `@astrojs/react` + `motion/react`, for interactive islands that need
    local state (e.g. mouse tracking).
- **[@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)** — case
  studies are an Astro Content Collection, written in MDX.
- **npm** as the package manager. (pnpm would save disk/install time via its shared store,
  but isn't worth the extra tool for a single-maintainer portfolio repo — every static host
  auto-detects npm with zero config.)

All animated components check `prefers-reduced-motion` and render fully visible/static when
it's set — nothing depends on JS running to become visible.

## Structure

```text
src/
├── components/
│   ├── ui/          # Static, dependency-free primitives (Button, Container)
│   ├── sections/    # Page sections (Header, Footer, Hero, ProjectCard)
│   └── motion/      # Animation components — Reveal, ScrollProgress (vanilla),
│                     # MagneticButton (React island)
├── content/
│   └── projects/    # One .mdx file per case study (see "Adding a case study" below)
├── content.config.ts # Content Collection schema for `projects`
├── layouts/
│   └── BaseLayout.astro  # <head>, meta tags, SEO, Open Graph/Twitter cards
├── pages/
│   ├── index.astro       # Hero + featured work grid
│   ├── about.astro
│   ├── playground.astro  # Live demo of every motion primitive
│   └── work/
│       └── [slug].astro  # Case study template, one route per collection entry
└── styles/
    ├── tokens.css   # Design tokens as CSS variables, wired into Tailwind via @theme
    └── global.css   # @import "tailwindcss", base layer, reduced-motion safety net
public/
├── fonts/           # Drop font files here, @font-face them in global.css
└── og-default.png   # Placeholder Open Graph image — replace with a real one
```

Import alias: `@/*` resolves to `src/*` (see `tsconfig.json`).

## Commands

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm run dev`          | Start the dev server at `localhost:4321`           |
| `npm run build`        | Type-check (`astro check`) then build to `./dist/` |
| `npm run preview`      | Preview the production build locally               |
| `npm run lint`         | Lint with ESLint                                   |
| `npm run lint:fix`     | Lint and auto-fix                                  |
| `npm run format`       | Format with Prettier                               |
| `npm run format:check` | Check formatting without writing                   |

## Adding a new case study

1. Create `src/content/projects/your-project-slug.mdx`.
2. Add a cover image next to it (e.g. `./cover.jpg`) and fill in the frontmatter:

   ```md
   ---
   title: 'Project name'
   client: 'Client name'
   role: 'Your role'
   year: 2026
   tags: ['Tag one', 'Tag two']
   cover: './cover.jpg'
   summary: 'One or two sentences — shown on the project card and as the page description.'
   featured: true
   order: 2
   ---
   ```

   - `cover` is validated and optimized by Astro's image pipeline — it must point at a real
     image file relative to the `.mdx` file.
   - `featured` controls whether it shows on the homepage; `order` controls sort position
     among featured projects (lower first).

3. Write the case study body in Markdown/MDX below the frontmatter.
4. It's live at `/work/your-project-slug` automatically — no routing code to touch.

See `src/content/projects/nimbus-expense-tracker.mdx` for a full example.

## Before deploying

- [ ] Replace the placeholder `site` URL in `astro.config.mjs` with your real domain.
- [ ] Replace `public/og-default.png` with a real Open Graph image (1200×630).
- [ ] Replace the `mailto:`/LinkedIn placeholders in `Footer.astro` and `about.astro`.
- [ ] Add real fonts to `public/fonts/` and wire them into `src/styles/global.css` (currently
      `--font-sans` falls back to the system font stack).
