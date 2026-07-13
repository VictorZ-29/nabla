# CLAUDE.md — Nabla

Nabla is a free interactive learning site for French lycée students — Première & Terminale, spé maths and spé physique-chimie. It replaces static PDF fiches with chapter pages where students manipulate the maths itself: understand a concept properly, work through corrected exercises, come back whenever they want. Built and maintained by one person (Victor, a professional tutor). Free, no accounts, no ads. French only. The audience is 16–18-year-olds, mostly on phones.

## Sources of truth

- **The Claude Design handoff** (designs and context attached to the session) is canonical for **look, layout, theming, design tokens, and French copy**. It defines the homepage and the chapter pages.
  - The handoff is only attached to the current session. As part of setup, commit a copy of the received design exports into `design-reference/` so future sessions retain the spec. That folder is read-only reference from then on: never ship, serve, or link its files; strip all Claude Design machinery (`x-dc`, `sc-if`, `DCLogic`, `support.js`, template placeholders) when converting to production pages.
  - On first setup, extract the complete design system — both theme palettes, per-theme SVG stroke widths, typography, spacing patterns — from the designs into `assets/css/tokens.css`. From then on `tokens.css` is the single source of truth for the codebase; if Victor sends an updated design handoff, re-derive tokens from it rather than patching values by hand.
  - The component vocabulary in the designs — DÉFINITION, PROPRIÉTÉ, MÉTHODE, À RETENIR, LES PIÈGES CLASSIQUES blocks, exercise units with corrigé reveals, the banded « VERS LE BAC » exercise, widget frames (INTERACTIF pill, preset/reset controls, chip readouts), tables (dérivées usuelles, opérations, tableau de variations), "bientôt" cards, and the CHAPITRE SUIVANT chapter footer — must each be implemented **once** as a reusable CSS/HTML pattern and reused across all chapters.
- **`CLAUDE.md`** (this file) is canonical for **architecture, engineering standards, conventions, and workflow**.
- **Each chapter folder gets a `README.md`**, canonical for **that chapter's content structure, widgets, and configuration**. You author it (see Chapter READMEs below); Victor reviews it.

If the designs and this file appear to conflict, the designs win on appearance and copy; this file wins on engineering. Flag any conflict in your summary.

## Non-negotiable principles

1. **Pedagogy is the product.** Chapter narrative order (concrete hook → picture → manipulation → formal definition) is deliberate; never reorder it. The formal definition of the derivative must appear only after the secant widget. Never rewrite explanatory French copy on your own initiative; if a passage must change for technical reasons, flag it for Victor's review.
2. **Design fidelity.** Match the designs closely in both themes. Where they mock interactive behaviour with hardcoded values or preset states, implement the real behaviour they imply, and document that behaviour in the chapter README.
3. **No framework creep.** Hand-rolled static site by choice: zero build step, zero runtime npm dependencies, vanilla HTML/CSS/JS. No React, no bundlers, no CSS frameworks, no site generators. If a task seems to need one, it's scoped wrong — say so.
4. **Mobile first.** Design and test at 375 px before desktop.
5. **Boring, fast, durable.** GitHub Pages must serve this for years with no maintenance. Prefer the dumb solution.

## Chapter READMEs — you write them

Every chapter folder contains a `README.md` that you author when building the chapter, derived from the design handoff. It must document: the chapter's purpose and narrative through-line; its section structure; the reference function(s); one spec per widget instance (what is fixed, what is draggable, readouts, presets, guards, captions and their trigger conditions, reset state); analytics props; and a "Review flags for Victor" section listing every behavioural interpretation you inferred from static design states plus any copy you had to touch. Where the design shows multiple mocked states of one widget (e.g. preset values, an end-state caption), treat them as keyframes of one behaviour and specify the behaviour that connects them. Read the chapter README in full before any later work on that chapter; keep it updated when behaviour changes.

## Tech stack

- Plain HTML pages (one folder per chapter for clean URLs), shared CSS, vanilla JS modules (`type="module"`).
- **Maths rendering: KaTeX** via CDN (css + js + auto-render, `defer`). Author maths as LaTeX: `\( … \)` inline, `$$ … $$` display. Replace the hand-styled HTML maths from the designs with KaTeX equivalents. Reserve heights on display-math containers to avoid layout shift.
- **Fonts:** Google Fonts as specified by the designs, `display=swap`, preconnect. (Self-hosting later, not now.)
- **Analytics: Plausible** (`data-domain` placeholder `NABLA_DOMAIN`) + custom events — see Analytics.
- **Hosting: GitHub Pages** from `main`: `.nojekyll`, `404.html`, `robots.txt`, `sitemap.xml`.

## Repository structure

```
/
├── index.html                                  # homepage
├── premiere/maths/derivation/
│   ├── index.html                              # chapter page
│   └── README.md                               # chapter spec — authored by you
├── assets/
│   ├── css/tokens.css                          # extracted from the designs — single source of truth
│   ├── css/base.css                            # reset, typography, header/footer, homepage
│   ├── css/chapitre.css                        # chapter layout + reusable block components
│   └── js/
│       ├── theme.js                            # theme toggle
│       ├── sommaire.js                         # scroll-spy + smooth scroll + mobile collapse
│       ├── corrige.js                          # exercise reveal toggles
│       ├── analytics.js                        # throttled Plausible event helper (see Analytics)
│       ├── nabla-graph.js                      # shared SVG graph helper (see Widgets)
│       └── widgets/                            # one module per widget TYPE, reused across chapters
├── mentions-legales/index.html                 # minimal placeholder, Victor fills in
├── design-reference/                           # committed copy of the design handoff — READ-ONLY
├── 404.html, robots.txt, sitemap.xml, .nojekyll
└── CLAUDE.md
```

New chapters follow the same pattern: `premiere/physique-chimie/<chapitre>/`, `terminale/maths/<chapitre>/`, each with `index.html` + `README.md`.

## Theming

Theme set via `data-theme="dark|light"` on `<html>`; dark is the brand default. A tiny inline `<head>` snippet resolves the theme before first paint (localStorage `nabla-theme` → `prefers-color-scheme` → dark) to avoid flash; the toggle button logic loads deferred and persists the choice. All colours flow from `tokens.css` — zero hardcoded colours anywhere else, SVG included (CSS variables / `currentColor`). SVG stroke widths differ per theme (thicker on dark, per the designs) — expose them as custom properties too.

## Widgets — global engineering standards

Chapter READMEs define **what** each widget shows; this section defines **how** every widget is built. Widgets are typed, reusable modules in `assets/js/widgets/` — a chapter page instantiates them declaratively via `data-` attributes (function, domain, initial values, labels), so a widget type written for one chapter is configuration-only for the next.

All widgets share `nabla-graph.js`: SVG coordinate system with maths-space ↔ pixel-space transforms, grid/axes drawn from tokens, function sampling into polylines (≥120 samples), helpers for points, lines, and guides.

Every widget must satisfy:

- **Pointer Events** (mouse + touch), `touch-action: none` on the drag surface, drag hit-targets ≥ 44×44 px (invisible enlarged hit circle around the visible point).
- Draggable points constrained to the curve: clamp pointer x to domain, compute y = f(x). All maths analytic (f and f′ supplied in config) — no numeric differentiation.
- **Keyboard accessible**: draggable points focusable, `role="slider"` with `aria-valuenow`, arrow keys move them (Shift = fine step).
- **`prefers-reduced-motion`**: no draw-on or transition animations; full functionality preserved.
- Reset control restoring the initial state.
- **French number formatting**: decimal comma (`f′(a) = 1,32`), U+2032 prime for `′`, true minus U+2212. Two decimals by default; readout values with 0 < |v| < 0,1 get three (the designs show `0,014` for the small-h numerator).
- KaTeX only for static formula shells; live numeric readouts are plain DOM text nodes — never re-render KaTeX per animation frame.
- One throttled Plausible event per interaction session (see Analytics).
- Drag handlers do no allocation-heavy work; batch updates with `requestAnimationFrame` if dense.

## Content & voice rules

- French, tutoiement, the direct voice of a tutor — never marketing filler. Victor owns the copy: transcribe it faithfully from the designs; flag anything you must alter and why.
- French typography: espace insécable before `: ; ! ?` and inside « guillemets » ; decimal commas.
- `lang="fr"`, semantic HTML: one `<h1>` per page, `<section>`/`<article>`/`<figure>` structure as in the designs, real `<button>`s for anything clickable.

## SEO & meta

Per page: unique `<title>` (pattern: `La dérivation — Première Spé Maths | Nabla`), meta description written for a student's actual search query, canonical URL, Open Graph + Twitter tags (og:image placeholder path acceptable for now), JSON-LD `LearningResource` on chapter pages. Maintain `sitemap.xml` manually. Clean folder URLs, no `.html` in internal links.

## Analytics (Plausible)

Custom events, throttled so one interaction session ≈ one event: `theme_toggle` (props: to), `widget_interact` (props: widget, chapitre), `corrige_open` (props: exercice, chapitre), `bac_open`. These answer the launch question: do students actually manipulate the widgets or only read? Nothing else — no cookies, no fingerprinting. Mention Plausible in the mentions-legales placeholder.

## Accessibility & performance budget

WCAG AA contrast in both themes. Visible `:focus-visible` outlines everywhere; sommaire and corrigé toggles keyboard-operable. Total first-party JS < 50 KB unminified per chapter page. No layout shift from fonts or maths. Target Lighthouse mobile ≥ 95 on performance and accessibility.

## Workflow conventions

- Verify locally with `python3 -m http.server`; test both themes, 375 px and desktop, keyboard-only, and touch emulation. If a browser tool (e.g. Playwright) is available, screenshot both themes at both widths and compare against the designs before declaring done.
- Small conventional commits (`feat:`, `fix:`, `content:`); never commit generated junk.
- End every session with a short summary: what changed, decisions taken, and an explicit list needing Victor's review (chapter README inferences, copy changes, mentions légales, domain/Plausible config, anything pedagogical).

## Definition of done — chapter page

Both themes checked against the designs · 375 px clean · every widget in the chapter README works by mouse, touch, and keyboard · KaTeX renders with no layout shift · sommaire scroll-spy works desktop + mobile · all corrigés toggle · internal links valid · meta/OG/sitemap updated · JS and Lighthouse budgets met · analytics events verified · chapter README written · session summary written.
