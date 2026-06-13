# donaldlee.xyz — portfolio v4

A sleek, white, single-page portfolio built around one idea: the site *is* a
rendered markdown file. It opens with a chatbot "render donald.md" animation,
then flows through a 3D Mii of Donald, his work, projects, and side quests.

Live at [donaldlee.xyz](https://donaldlee.xyz).

## Stack

- **Next.js 15** (App Router) with `output: "export"` for static GitHub Pages
- **react-three-fiber + drei** — the procedural Mii character (no external model)
- **Framer Motion** — entrances, the loader, micro-interactions
- **Lenis** — smooth scroll
- **Tailwind CSS v4** — design tokens in `src/app/globals.css` (OKLCH)
- **Geist + Geist Mono + Bricolage Grotesque** via `next/font`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

Add `?static` to the URL to disable smooth scroll while debugging layout.

## Build

```bash
npm run build    # static export → ./out
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
static export and publishes it to GitHub Pages. **One-time setup:** in the repo
settings, set *Pages → Build and deployment → Source* to **GitHub Actions**.
The `CNAME` (donaldlee.xyz) and `.nojekyll` are carried through from `public/`.

## Structure

```
src/
  app/            layout, globals.css (tokens), page.tsx
  components/     Hero, About, Experience, Projects, SideQuests, Footer,
                  Nav, LoadingScreen, SmoothScroll, Reveal
  components/mii/ Mii.tsx (the model), MiiScene.tsx (canvas + lights)
  data/content.ts all copy: projects, experience, side quests
legacy/           the previous static HTML site, archived
```
