# Design

## Theme
Sleek modern white. A bright, near-white studio with one electric-blue accent
carried over from the previous site's `#3988FF` identity. Restrained color
strategy: white surface, near-black ink, blue used sparingly for emphasis and
the markdown markers. Personality comes from the 3D Mii and motion, not color.

## Color (OKLCH)
Defined as Tailwind v4 `@theme` tokens in `src/app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `oklch(0.992 0.002 255)` | page background |
| `--color-surface` | `oklch(0.972 0.003 255)` | panels, pills |
| `--color-surface-2` | `oklch(0.952 0.004 255)` | deeper surface |
| `--color-line` | `oklch(0.915 0.005 258)` | hairline borders |
| `--color-line-strong` | `oklch(0.85 0.006 258)` | stronger borders |
| `--color-ink` | `oklch(0.19 0.012 262)` | headings, primary text |
| `--color-ink-soft` | `oklch(0.32 0.012 262)` | body text |
| `--color-muted` | `oklch(0.455 0.013 262)` | secondary (AA on white) |
| `--color-accent` | `oklch(0.605 0.196 256)` | electric blue accent |
| `--color-accent-strong` | `oklch(0.52 0.2 257)` | accent on wash |
| `--color-accent-wash` | `oklch(0.95 0.03 256)` | accent chip background |

## Typography
- **Display:** Bricolage Grotesque (headings; characterful, not on the AI-reflex list).
- **Body:** Geist.
- **Mono:** Geist Mono (markdown markers, labels, the chatbot loader, `currently` line).
- Display headings: `clamp()`, weight 700–800, letter-spacing -0.03 to -0.04em,
  `text-wrap: balance`. Hero max ~5rem.

## Components
- **LoadingScreen** — chatbot "render donaldlee.xyz" exchange with a streaming render
  log, then a blur-fade reveal. Plays once per session; skippable; reduced-motion safe.
- **Nav** — fixed, transparent → white hairline + blur on scroll. Mono links.
- **Hero** — copy + rotating `currently →` line beside the interactive Mii.
- **Mii** (`components/mii/`) — procedural r3f character: middle-part hair, blue
  quarter-zip, follows the pointer, blinks, waves on tap. Large on the hero,
  compact in the footer.
- **About** — portrait + intro, 2×2 hairline-divided stack grid (mono pills).
- **Experience** — single-open accordion grouped by org.
- **Projects** — featured projects as flowing alternating rows (numbered as a
  real sequence) + a filterable grid for the rest.
- **SideQuests** — horizontal "memory wall" of tilted polaroids showing real
  photos (`public/images/sidequests/<slug>`); mixed vertical / square /
  horizontal frames, auto-scrolls and loops seamlessly in both directions.
- **Footer** — waving compact Mii, email CTA, socials. Shares its opening
  colour with the side-quests wash so the two read as one closing scene.
- **SideRails** — fixed left social glyphs + right vertical email (≥1180px).

## Layout & Motion
- Max content width ~6xl, fluid `clamp()` spacing, generous section padding.
- Semantic z-index scale (`--z-sticky` → `--z-loader`) in tokens.
- Easing: `ease-out-expo` / quint (cubic-bezier 0.16,1,0.3,1). No bounce.
- Native scroll (no smooth-scroll library, kept snappy on purpose). The
  featured carousel redirects horizontal wheel + click-drag into page scroll,
  so every gesture moves the page forward; if the visitor idles on the pinned
  stage ~4.5s it gently advances one card to teach the interaction.
- Every reveal enhances already-rendered, SEO-visible content.
