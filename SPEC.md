# SPEC.md — donaldlee.xyz completion spec

Implementation spec for finishing this site. Written for an AI agent (or human)
picking up the work cold. Read `PRODUCT.md` and `DESIGN.md` first; they define
the register (brand/portfolio), tokens, and voice. This document defines the
remaining work, why it matters, and exactly how to do it.

**The goal behind every item:** the site's job is to get Donald internship
interviews and make him legible as a "ships fast, builds real things" candidate
to startup founders and investors. Every task below is judged against that.

---

## 0. Ground rules for the implementer

- Stack: Next.js 15 App Router, `output: "export"` (static, no server), React 19,
  Tailwind v4 (`@theme` tokens in `src/app/globals.css`), framer-motion, R3F/three
  for the procedural Mii. Deployed to GitHub Pages via `.github/workflows/deploy.yml`,
  custom domain `donaldlee.xyz` (`public/CNAME`).
- There is **no backend**. Anything "dynamic" must be build-time (prebuild script),
  client-side, or a third-party embed. Do not add API routes; they won't export.
- Design system: white studio, one electric-blue accent, `## marker` mono kickers
  as the single named kicker system, Bricolage Grotesque display + Geist + Geist Mono.
  Every animation needs a `prefers-reduced-motion` path (see `Reveal.tsx`,
  `LoadingScreen.tsx` for the pattern).
- Verify in a real browser at 375 / 768 / 1280 widths after every visual change,
  plus `npx tsc --noEmit` and `npm run build` before calling anything done.
- Images ship unoptimized (`images.unoptimized: true`). Any image added must be
  pre-sized to ≤2x its largest display size and compressed (target <200 KB).

---

## 1. P0 — correctness and content bugs (do first)

### 1.1 Legacy project links will 404 after deploy
`src/data/content.ts` still points two projects at old-site pages that will not
exist once this build replaces the user site:

- `RickGPT` → `https://donaldklee.github.io/rickgpt` (line ~84)
- `Google Memes` → `https://donaldlee.xyz/Google-Memes/` (line ~93)

The old HTML lives in `legacy/` at the repo root (not deployed; `out/` is the
only thing published). Fix, in order of preference per project:
1. Write internal write-ups (add `slug` + entry in `src/data/writeups.ts`), or
2. Point `href` at the project's GitHub repo, or
3. Copy the legacy page into `public/` so the old URL keeps working.

Acceptance: click every card on the shelf on the deployed preview; zero 404s.

### 1.2 Side-quest photos are missing
`public/images/sidequests/` contains one file (`presntres.jpeg`) but
`sideQuests` in `content.ts` lists 12 entries whose `slug` doubles as the
filename. Every other card renders the gray placeholder.

- Get the real photos from Donald (blocker: content, not code). Resize to
  ≤1200px long edge, JPEG quality ~80.
- Rename the data field from `slug` to `photo` (it is a filename with
  extension, not a slug) and update `SideQuests.tsx` accordingly.
- Each entry needs real `alt` text (currently `alt={quest.title}`, acceptable,
  but verify titles describe the image).

Acceptance: rail shows 12 real photos, mixed orientations, no placeholders.

### 1.3 Diagnose the dev-only "1 Issue" indicator
Next dev tools intermittently reports 1 issue; console, server logs, and prod
build are all clean. Reproduce with `npm run dev`, open the indicator's Issues
panel by hand (it lives in a closed shadow DOM; a human click works), and fix
whatever it names. Suspects: a hydration diff React recovers from silently.
Not release-blocking; is trust-blocking (a portfolio for engineers should run
clean in dev).

---

## 2. P0 — the internship layer (highest-leverage missing feature)

The site never hands a recruiter the two things they actually need:

### 2.1 Resume
- Add `public/resume.pdf` (content from Donald; blocker).
- Add a `resume` link in `Nav.tsx` (desktop row + mobile sheet) and a second
  entry point near the hero CTAs. Label it `resume`, mono, same treatment as
  other nav links. `target="_blank"`.
- Optional stretch: `/resume` HTML page generated from a typed data file so the
  PDF and the page never drift (single source in `src/data/resume.ts`).

### 2.2 Contact affordances
- `mailto:` is the only channel. Add a Calendly (or cal.com) link next to the
  email button in `Footer.tsx` ("book 15 min") — founders and recruiters book
  calls, they don't write cold emails.

Acceptance: from any viewport, a recruiter reaches the resume in one click from
the hero, and can book a call from the footer.

---

## 3. P1 — proof-of-cracked features (positioning for startups/funding)

These make velocity and depth visible. Build in this order.

### 3.1 Ship log ("## changelog")
A dated, terse list of things shipped (site features, hackathon entries, side
projects, internship milestones). This is the single strongest "ships
constantly" signal a static site can carry.
- Data: `src/data/changelog.ts`, `{ date: string; entry: string; href?: string }[]`.
- UI: a compact section between Projects and Side-quests, styled like a git
  log: mono dates, one line each, newest first, show ~8 with a "view all"
  expander. No cards. Kicker: `## changelog`.
- Voice: specific verbs ("shipped RickGPT voice mode", "won StormHacks 2023"),
  no adjectives.

### 3.2 Write-ups for the remaining flagships
`writeups.ts` covers 11 projects; the two headliners without stories are
`Globe with Data` and `Provent` (a Startup category item with real users —
the strongest founder-signal on the site). Provent's write-up should include
user numbers, retention anecdotes, and what he'd do differently: that is the
"thinks like a founder" evidence. Follow the existing `Writeup` shape
(`summary`, `sections`, `stack`, `links`).

### 3.3 Quantified proof, embedded in prose (not a metric strip)
Per the design system's bans, no big-number hero stats. Instead, weave numbers
into `About` and write-up copy: hackathons entered/won, Provent installs,
GitHub repos/stars, years shipping. Numbers in sentences read as facts;
numbers in giant type read as marketing.

### 3.4 Demo videos
`Writeup` already supports a `video` embed field. Record 30–60s screen
captures for the top 4 projects (Loom/YouTube unlisted), fill the field.
A moving demo outperforms any copy. (Content blocker: Donald records.)

### 3.5 "ask donaldlee.xyz" easter egg (the memorable one)
Extend the loading-screen chat conceit: a small chat button in the footer that
opens the same bubble UI and answers a fixed set of questions ("what's your
stack?", "what are you building now?", "why should we interview you?") from
canned, typed answers in `src/data/faq.ts`, rendered with the loader's
typing/step animation. No LLM, no backend, instant, always correct. Recruiters
remember the site that talked back. Keep it under 200 lines; reuse the
LoadingScreen bubble styles. Reduced-motion: answers appear instantly.

### 3.6 GitHub activity at build time
A prebuild script (`scripts/fetch-github.mjs`, run in the deploy workflow
before `npm run build`) hits the public GitHub API for pinned repos + last-90d
commit count and writes `src/data/github.json`. Render a one-line fact in
About ("1,240 commits in the last year across N repos"). Fails soft: if the
fetch errors, keep the last committed JSON. No tokens needed for public data
at this volume.

### 3.7 Notes/blog (SEO + depth signal)
A `/notes` list of short technical posts (MCP servers, AI agent tooling,
hackathon build logs) reusing the `Writeup` renderer with a leaner header.
Two posts minimum at launch or don't ship the section (an empty blog is worse
than none). This is what makes "Donald Lee MCP" searchable by the exact people
he wants to reach.

### 3.8 Custom 404
`src/app/not-found.tsx`: compact Mii (the `compact` MiiScene) + "## 404 — page
not found in donaldlee.xyz" + link home. On-brand, 30 minutes of work, and
recruiters do hit dead links.

---

## 4. UX/UI refinements (P1–P2)

- **Featured carousel, keyboard path**: the cylinder advances only by scroll.
  Add left/right arrow-key handling on the focused stage and visible prev/next
  hit targets inside the progress pill. Acceptance: reach and open every card
  with keyboard only.
- **Experience section**: `group.logo` is supported but most entries render the
  short-text fallback; add the logos already sitting in `public/images/logos/`.
- **Mobile menu**: add a soft shadow or stronger bottom border to the open
  sheet; it currently blends into the hero content below it.
- **Sleep-mode timing**: `getMiiStatus` puts Donald asleep until 8am Vancouver;
  most recruiter traffic is 9–5 in *their* timezone. Consider capping sleep to
  0:00–7:00 or showing a cheeky "up late shipping" variant so early-morning
  visitors don't always meet a sleeping site. Product call: ask Donald.
- **Focus states audit**: tab through all pages; the global focus ring exists
  (`globals.css`), verify it's visible on dark pills (`bg-ink` buttons) and on
  cards inside the whiteboard section.
- **Side-quest rail on touch**: `pointerup` unpauses even mid-momentum; test on
  a real phone; if it stutters, pause auto-scroll for 2s after any touch.

---

## 5. Security & platform hardening

The attack surface is small (static site, no forms, no secrets). Remaining:

1. **Pin GitHub Actions to commit SHAs** in `deploy.yml` (`actions/checkout@v4`
   → `@<sha>`), and add `dependabot.yml` for npm + actions weekly updates.
   Supply chain is the only real vector this site has.
2. **External links**: all `target="_blank"` anchors already carry
   `rel="noopener noreferrer"` — keep it that way; add a lint rule
   (`eslint-plugin-react` `jsx-no-target-blank`) once ESLint is configured
   (see §6.4).
3. **YouTube embed** (`Writeup.tsx`): switch `src` to the
   `youtube-nocookie.com` domain and add `referrerPolicy="strict-origin-when-cross-origin"`.
4. **JSON-LD**: the Person schema in `layout.tsx` is serialized from a local
   literal only. If any of it ever becomes data-driven, escape `<` (
   `JSON.stringify(...).replace(/</g, "\\u003c")`).
5. **No secrets in repo**: keep it true; the GitHub-activity script (§3.6) must
   use unauthenticated public endpoints or a workflow-scoped token, never a
   committed PAT.

---

## 6. Code health & scalability

1. **Split `src/data/content.ts` (449 lines)** into `src/data/projects.ts`,
   `experience.ts`, `sidequests.ts`, `site.ts` (EMAIL, socials, currentlyDoing).
   Pure mechanical move; update imports.
2. **Repo hygiene**: `legacy/`, `certificates/`, root `images/`, and the root
   `CNAME` are pre-redesign leftovers that don't deploy. After 1.1 resolves the
   legacy links, delete them from the branch (they remain in git history).
   Also delete `.DS_Store` files and add them to `.gitignore`.
3. **Shared card pieces**: `PinnedCard` (Projects), `CarouselCard`, and the
   `MetaTooltip` each re-implement the name/tagline/category block. Extract a
   `ProjectMeta` component; keep layout wrappers separate. Do not force the
   three cards into one component; they are intentionally different shapes.
4. **Tooling**: ESLint isn't configured (`npm run lint` prompts interactively).
   Add `eslint.config.mjs` with `next/core-web-vitals`, fix fallout, and add a
   CI job (`.github/workflows/ci.yml`) running `tsc --noEmit`, `eslint`, and
   `next build` on PRs.
5. **Smoke test**: one Playwright spec: home renders, hero canvas mounts,
   nav anchors scroll, one write-up opens, no console errors. Run in CI against
   `npx serve out`.
6. **Mii file size**: `Mii.tsx` is ~700 lines. If it grows again, split the
   scene props (Bed, PokeBowl, Laptop, etc.) into `mii/props.tsx`. Don't split
   preemptively; it's cohesive today.

---

## 7. Performance (remaining wins; budget: LCP < 2.0s on 4G)

Done already: images cut 10 MB → 4.9 MB, three.js code-split (first load
173 kB), Mii chunk pre-warmed, procedural model (no GLTF fetch).

1. `public/images/projects/home/hakotenfruits.png` (460 KB) and `global.png`
   (484 KB) are the last heavy assets: convert to JPEG/WebP like
   `fragments.jpg` was (update `content.ts` paths).
2. `SEO_BG.PNG` (376 KB) → JPEG ~120 KB; update `layout.tsx` OG path (mind the
   case-sensitivity lesson: reference must match the filename exactly).
3. Sitemap: generate `public/sitemap.xml` at build (a 20-line prebuild script
   over `writeupSlugs` beats adding `next-sitemap`), then append
   `Sitemap: https://donaldlee.xyz/sitemap.xml` to `public/robots.txt`.
4. Font loading: three Google font families load via `next/font` (good). Do not
   add more families.
5. Lighthouse pass (mobile) after the above; record scores in this file.

---

## 8. SEO & discoverability (mostly done, finish the tail)

Done: metadata + OG (case-fixed), Twitter card, JSON-LD Person, robots.txt.

1. Sitemap (§7.3).
2. Per-write-up OG images: the write-up hero is used today (fine); optional
   polish is a 1200×630 composed card (title + screenshot) per project,
   pre-rendered by a script into `public/og/`.
3. Verify `donaldlee.xyz` in Google Search Console after deploy; submit the
   sitemap. (Human task; note for Donald.)

---

## 9. Action plan (sequenced, with effort)

| # | Task | Spec | Effort | Blocked on |
|---|------|------|--------|-----------|
| 1 | Fix legacy 404 links | §1.1 | 1–2 h | — |
| 2 | Resume link + PDF | §2.1 | 1 h code | PDF from Donald |
| 3 | Side-quest photos + `photo` field rename | §1.2 | 1 h code | photos from Donald |
| 4 | Analytics (GoatCounter or Plausible script tag in `layout.tsx`) | — | 30 min | account choice |
| 5 | Ship log section | §3.1 | 3 h | seed entries from Donald |
| 6 | Provent + Globe write-ups | §3.2 | 2 h each | facts from Donald |
| 7 | Custom 404 | §3.8 | 30 min | — |
| 8 | Remaining image conversions + sitemap | §7 | 1 h | — |
| 9 | ESLint + CI + Playwright smoke | §6.4–6.5 | 3 h | — |
| 10 | Calendly in footer | §2.2 | 15 min | Calendly URL |
| 11 | Demo videos embedded | §3.4 | 1 h code | recordings |
| 12 | ask donaldlee.xyz easter egg | §3.5 | 4–6 h | FAQ answers |
| 13 | GitHub activity prebuild | §3.6 | 2 h | — |
| 14 | Notes/blog (2 posts min) | §3.7 | 4 h + writing | posts |
| 15 | Carousel keyboard support | §4 | 2 h | — |
| 16 | Actions SHA-pinning + dependabot | §5.1 | 30 min | — |
| 17 | content.ts split + repo cleanup | §6.1–6.2 | 2 h | after #1 |

Suggested weekly cut: week 1 = #1–8 (site is "recruiter-complete");
week 2 = #9–13 (credibility + delight); week 3 = #14–17 (depth + hygiene).

---

## 10. Definition of done (whole project)

- `npx tsc --noEmit`, `eslint`, and `npm run build` all clean; CI enforces it.
- Zero 404s from any internal link or project card on the deployed site.
- Every image ≤ 200 KB; Lighthouse mobile ≥ 90 perf, ≥ 95 a11y/SEO.
- Keyboard-only walkthrough completes: skip link → nav → carousel → cards →
  footer, visible focus everywhere, mobile menu inert when closed.
- Reduced-motion pass: loader, reveals, carousel, Mii float all have a
  non-animated path (test with OS setting, not just DevTools emulation).
- A recruiter reaching the hero can, within one viewport and one click each:
  read who Donald is, open the resume, see a real project, and start an email
  or booking.
