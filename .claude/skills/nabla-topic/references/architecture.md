# NABLA — Architecture & stack

Derived from the repo as of July 2026 (commit c173388). Cross-check with
`CLAUDE.md` (engineering source of truth) before trusting anything here that
might have drifted.

## Stack — what it is and what it is not

- **Hand-rolled static site.** Plain HTML, vanilla CSS, vanilla ES modules.
  **No build step, no package.json, no npm dependencies, no framework, no
  bundler, no site generator.** This is a deliberate CLAUDE.md non-negotiable
  ("no framework creep"): if a task seems to need one, the task is scoped
  wrong.
- **Maths renderer: KaTeX 0.16.11 via jsdelivr CDN** (css + js + auto-render,
  all `defer`). Author maths as LaTeX: `\( … \)` inline, `$$ … $$` display.
  Auto-render is invoked by an inline `onload` snippet that renders **block by
  block, one requestAnimationFrame per direct child of each `.chap-section`,
  then a final pass on `<body>`** — a measured perf fix (worst main-thread
  task ÷4). Copy that snippet verbatim from an existing chapter head and
  VERIFY it byte-identical afterwards
  (`diff <(grep -o 'onload="[^"]*"' <old>) <(grep -o 'onload="[^"]*"' <new>)`
  must be empty) — one dropped character is a silent SyntaxError and no
  maths renders at all (audit.md §10.8).
- **Fonts: Google Fonts** with preconnect + `display=swap`:
  Spectral (serif body), IBM Plex Mono (labels/chips/UI), STIX Two Text
  (maths inside SVG only — HTML maths is KaTeX's own font).
- **Analytics: Plausible** (`data-domain="NABLA_DOMAIN"` placeholder) +
  4 custom events via `assets/js/analytics.js` (throttled). See CLAUDE.md.
- **Hosting: GitHub Pages from `main`**, `.nojekyll`, `404.html`,
  `robots.txt`, hand-maintained `sitemap.xml`. Commit and push directly to
  `main` without asking — no feature branches.

## Commands

- Preview: `python3 -m http.server` from the repo root (or `python -m
  http.server` on Windows), then open `http://localhost:8000/`.
- Deploy: `git push` to `main` (GitHub Pages picks it up).
- No build, no test runner, no lint. Verification is manual/browser-based
  (both themes, 375 px + desktop, keyboard-only, touch emulation).

## Repository layout

```
/
├── index.html                       # homepage (hero, chapter cards, bientôt grid)
├── premiere/maths/<chapitre>/       # one folder per chapter = clean URL
│   ├── index.html                   # the whole chapter is ONE page
│   └── README.md                    # chapter spec, authored with the chapter
├── assets/
│   ├── css/tokens.css               # design tokens — single source of truth
│   ├── css/base.css                 # reset, typography, header/footer, homepage
│   ├── css/chapitre.css             # chapter layout + ALL reusable block components
│   ├── img/favicon.svg, favicon-32.png
│   └── js/
│       ├── theme.js  sommaire.js  corrige.js  quiz.js  analytics.js
│       ├── nabla-graph.js           # shared SVG helper + FONCTIONS registry
│       └── widgets/<type>.js        # one module per widget TYPE
├── mentions-legales/index.html
├── design-reference/                # committed design handoff — READ-ONLY, never link
├── 404.html  robots.txt  sitemap.xml  .nojekyll  CLAUDE.md
```

Future levels follow the same pattern: `premiere/physique-chimie/<chapitre>/`,
`terminale/maths/<chapitre>/`.

## How a chapter is wired in (registration checklist)

A new chapter touches exactly these files:

1. **`premiere/maths/<slug>/index.html`** — the page. Slug is lowercase,
   hyphenated, no accents (`derivation`, `suites`,
   `probabilites-conditionnelles`).
2. **`premiere/maths/<slug>/README.md`** — the chapter spec (you author it;
   see content-and-pedagogy.md for the required sections).
3. **`index.html` (homepage)** — promote the chapter's « bientôt » card (if it
   exists) to a full `.carte-chapitre` with `CHAPITRE NN` status, title,
   `carte-desc` (themes separated by « · », ending « · 15 exercices
   corrigés »), « Ouvrir le chapitre → », and a small `carte-motif` SVG
   (viewBox `0 0 80 56`) evoking the chapter's key picture. Cards are ordered;
   `grille-bientot` follows the real cards.
4. **The PREVIOUS chapter's `pied-chapitre`** — its « CHAPITRE SUIVANT » block
   changes from `pastille-bientot` (dashed pill « BIENTÔT ») to a real link:
   `<div class="suivant-titre"><a href="../<slug>/">Titre <span aria-hidden="true">→</span></a></div>`.
   The NEW chapter's own footer announces the next upcoming chapter with the
   `pastille-bientot` form.
5. **`sitemap.xml`** — add a `<url>` with `https://NABLA_DOMAIN/premiere/maths/<slug>/`
   and today's `<lastmod>`; refresh `<lastmod>` on pages you touched.
6. **`assets/js/nabla-graph.js`** — only if the chapter's widgets use curve
   registry keys: add `FONCTIONS` entries (f and f′ analytic, never numeric).
7. **New widget modules** in `assets/js/widgets/` — one per widget TYPE.
8. **CSS** — new chapter-specific component classes go at the END of
   `chapitre.css` under a `/* --- <Chapitre> : … --- */` banner comment.
   **If any CSS file changes, bump the `?v=N` query on EVERY page in the same
   commit** (GitHub Pages caches ~10 min):
   `sed -i 's/css?v=6/css?v=7/g' $(grep -rl 'css?v=' --include='*.html' . | grep -v design-reference)`
   JS is deliberately NOT versioned.

## Page-level boilerplate (copy from an existing chapter, then adapt)

- Inline no-flash theme snippet first in `<head>` (localStorage
  `nabla-theme` === 'light' → light, else dark default).
- `<title>` pattern: `Le/La <sujet> — Première Spé Maths | Nabla`.
- Meta description written for a student's real search query; canonical +
  OG + Twitter tags on `https://NABLA_DOMAIN/...`; `og:image` placeholder
  `/assets/og/nabla-og.png`.
- JSON-LD `LearningResource` (name, description, url, inLanguage fr,
  isAccessibleForFree, learningResourceType « fiche de révision interactive »,
  educationalLevel, teaches, audience student, provider Nabla).
- Google Fonts preconnect + one stylesheet link (Spectral, IBM Plex Mono,
  STIX Two Text).
- KaTeX css/js/auto-render with the block-by-block onload snippet.
- Favicons, then the three first-party CSS files **with the current `?v=N`**.
- `<script type="module">` (no `defer` needed — modules defer natively):
  theme.js, sommaire.js, corrige.js, quiz.js, then one line per widget module
  actually used on the page. Plausible script last.
- `<body data-chapitre="<court>">` — a SHORT analytics key (`derivation`,
  `suites`, `probabilites`), not necessarily the folder slug.
- Internal links are relative (`../../../assets/...`, `../suites/`) and
  never include `.html`.

## Budgets & invariants

- Total first-party JS **< 50 KB unminified per chapter page** (dérivation
  sits at 49,8 KB; suites 38,2; probas 38,9). Check with
  `wc -c` over the modules the page imports. If tight: trim or lazy-load.
- Lighthouse mobile ≥ 95 performance and accessibility; WCAG AA in both
  themes; no layout shift from fonts or maths (reserve `min-height` on
  `.math-vitrine` — already in the CSS).
- KaTeX auto-render must never run per-frame; live readouts are plain DOM
  text nodes.
- `design-reference/` is read-only: never ship, serve, or link its files.
