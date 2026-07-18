# Chapitre — La trigonométrie (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention, via the
`nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file in full
before any later work on the chapter; keep it updated when behaviour
changes.

**Programme scope (2026).** Per `PROGRAMME.md`: cercle trigonométrique,
enroulement de la droite des réels, radian, cosinus et sinus d'un réel,
valeurs remarquables, angles associés, cos²t + sin²t = 1. **Excluded on
purpose** (moved to Terminale by the 2026 reform): the *functions*
x ↦ sin x and x ↦ cos x — no parity/periodicity-as-function, no curves, no
derivatives, no variations anywhere on the page.

## Purpose & narrative through-line

Replace the static PDF fiche on trigonometry with a page where the student
*turns the circle themselves* before any formalism. Narrative order
(concrete hook → picture → manipulation → formal definition), never to be
reordered:

1. **Concrete hook** (§1) — la grande roue: where you are on a wheel can be
   told in degrees, or as the **distance travelled along the circle**. On a
   radius-1 circle the perimeter is 2π; a quarter turn is π/2 ≈ 1,57.
   Static figure: the flagship widget's circle at its initial state
   (quarter turn, accent arc, « 90° » inside, « π/2 » outside).
2. **Manipulation, then definition** (§2) — the **trigo-enroulement**
   widget: slide the real t and watch the piece [0 ; t] of the graduated
   line wrap onto the circle from I; **only after** comes the DÉFINITION
   (cercle trigonométrique, sens direct, M(t), radian), the central
   180° = π rad, the conversion méthode, and the quiz.
3. **Cosinus et sinus** (§3) — the **trigo-cossin** widget: drag M
   anywhere, read its two projections and watch cos²t + sin²t stay glued
   to 1,00. Then DÉFINITION (coordinates of M), PROPRIÉTÉ (bounds,
   identity, periodicity), Pythagore as POURQUOI, the
   « retrouver sin t à partir de cos t » méthode, and mesure principale.
4. **Valeurs remarquables** (§4) — the table 0, π/6, π/4, π/3, π/2 with
   the √n/2 mnemonic, then the **trigo-valeurs** game (6 rounds: read the
   drawn angle, pick the exact value).
5. **Angles associés** (§5) — the **trigo-associes** widget: four
   symmetries (−t, π−t, π+t, π/2−t) as segmented modes, M draggable in the
   first quadrant, M′ mirrored live, the two cos/sin lines instantiated
   exactly on remarkable angles. Formulas as PROPRIÉTÉ *after* the
   manipulation; the POURQUOI resolves §4's « cos(π/6) = sin(π/3) »
   mystery.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés, Vers le Bac (SANS CALCULATRICE, aligned with the épreuve
   anticipée).

One story runs through: the grande roue of §1 returns as exercise 14
(rayon 20 m, axe à 22 m, h(t) = 22 − 20 cos t — heights land on 12/22/42 m
at remarkable angles). The « sans calculatrice » stake is named in §4 and
in the bac banner.

## Reference geometry & view windows

No `FONCTIONS` registry entry and **no change to `nabla-graph.js`**
(dérivation already sits at 49,8 KB of its 50 KB JS budget; adding to the
shared helper would push it over). Shared circle helpers live in
`assets/js/widgets/trigo-cercle.js` (not a widget — a module imported by
the four trigo widgets):

- `FENETRE` — all circle SVGs: viewBox 640×400, x ∈ [−2 ; 2],
  y ∈ [−1,25 ; 1,25] → **square units, 160 px/unit**, unit circle radius
  160 px, 40 px breathing room above/below.
- Angles are handled as **k twelfths of π** wherever exactness matters:
  `fmtPi(k)` prints exact strings (« 5π/6 », « −3π/4 »), and degrees are
  always the integer 15k. Exact value tables `cosExact/sinExact` cover the
  remarkable angles (k ∈ {0, ±2, ±3, ±4, ±6, ±8, ±9, ±10, ±12}); other
  π/12 multiples exist on the grid but show rounded decimals only.
- `decorCercle` (grid, axes, chalk circle, point I), `cheminArc`
  (sampled polylines along the circle — no SVG `A` commands),
  `pointeTangente` (tangential arrowheads), `angleDePointeur` (pointer →
  atan2 angle in ]−π ; π]).
- Enroulement ruban: second SVG 640×96 (`graph-scinde`), x ∈
  [−7,06 ; 7,06] (2π ≈ 6,28 plus margin), ticks every π/2, labels on π
  multiples.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Un tour de grande roue | hook prose (grande roue ; distance le long du cercle) · vitrine (tour complet = 2π ≈ 6,28) · static figure (quarter turn = flagship's initial circle) |
| `s2` | 2. Enrouler la droite sur le cercle | **widget trigo-enroulement** · POURQUOI ? (correspondance réel → point ; t + 2π) · DÉFINITION (cercle trigo, sens direct, radian) · vitrine --grande (180° = π rad) · MÉTHODE (convertir) · EXEMPLES (60° → π/3 ; 3π/4 → 135°) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Cosinus et sinus | **widget trigo-cossin** · DÉFINITION (coordonnées de M) · vitrine M(t) = (cos t ; sin t) · PROPRIÉTÉ (bornes, identité, périodicité) · POURQUOI ? (Pythagore) · prose notation cos²t · MÉTHODE (retrouver sin t) · EXEMPLE (cos t = 3/5 → sin t = −4/5) · prose + MÉTHODE (mesure principale) · EXEMPLE (17π/6 → 5π/6) · **quiz s3** (3 q.) |
| `s4` | 4. Les valeurs remarquables | prose (épreuve sans calculatrice) · tableau (0, π/6, π/4, π/3, π/2) · À RETENIR (mnémonique √n/2) · **widget trigo-valeurs** (6 manches) · MÉTHODE (retrouver une valeur) · EXEMPLE (cos π/3 + sin π/6 = 1) · **quiz s4** (3 q.) |
| `s5` | 5. Les angles associés | prose (cos 5π/6 par le reflet) · **widget trigo-associes** · PROPRIÉTÉ (les 8 formules) · POURQUOI ? (chaque formule est une symétrie) · MÉTHODE (calculer hors [0 ; π/2]) · EXEMPLES (cos 2π/3, sin(−π/4), sin 7π/6) · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (60 vs 60° · cos/sin échangés · cos(π−t) sans signe · 1/2 vs √2/2 vs √3/2 · cos distribué sur +) |
| `essentiel` | L'essentiel en 5 lignes | CERCLE · RADIAN · COS & SIN · VALEURS · ASSOCIÉS |
| `ex` | Exercices — 15 corrigés | course order: conversions 01 · placer 02 · mesure principale 03 · signes 04 · vrai/faux 05 · identité 06–07 · valeurs 08–09 · associés 10–11 · lire le cercle 12 · synthèse 13 · problème 14 (grande roue) · **VERS LE BAC** (ex. 15, `#bac`, SANS CALCULATRICE) |

Niveau distribution: n1 = 01, 02, 04, 08 · n2 = 03, 05, 06, 07, 09, 10,
11 · n3 = 12, 13, 14.

## Components introduced by this chapter

- **No new CSS component.** The page is built from existing chapitre.css
  components and SVG classes (g-courbe as the chalk circle, g-tangente for
  accent arcs/segments, g-guide(-accent), pt-point/pt-fixe/pt-b,
  vec-pointe(--accent), etiquette-math, chips, lecture-formule,
  widget-legende, graph-scinde, quiz styles).
- **One CSS fix appended to chapitre.css** (banner « Trigonométrie :
  compatibilité KaTeX ») : `.widget svg` / `.figure-graph svg`
  (height: auto) were overriding KaTeX's `.katex svg { height: inherit }`
  (same specificity, later file), flattening KaTeX's stretchy SVGs
  (\sqrt radicals, \overline bars) inside widgets — first visible here
  because this chapter puts \sqrt inside quiz-style buttons, but it also
  fixes the pre-existing flattened \overline bars in the probabilités
  quiz explanations. `?v=15` bumped on every page in the same commit.

## Widget instances

Shared engineering standards in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.
All four widgets: French number formatting (fmt), true minus, one
throttled `widget_interact` per interaction session, reduced-motion safe
(presets jump instantly), renders coalesced by rAF where slider-driven.

### 1. `trigo-enroulement` — « Enrouler la droite sur le cercle » (flagship, §2)

Module `assets/js/widgets/trigo-enroulement.js`, instance
`data-k-init="6"` (t = 6·π/12 = π/2). Archetype B (native slider).

- **Control**: slider k ∈ [−24 ; 24] step 1, i.e. **t = k·π/12 ∈
  [−2π ; 2π] by 15° steps** — every reachable position is exact in π and
  integer in degrees. Reset button beside the slider (header slot taken by
  presets). Header `segmente` presets t = π/2 / π / 2π animated via
  `animerValeur` (fractional k during animation → decimal display,
  `aria-pressed` only on exact match).
- **Drawing**: chalk circle + I + « + » sens-direct arc near the centre;
  accent arc from I to M(t) (sampled polyline, tangential arrowhead hidden
  under |t| < 0,12; at |t| = 2π the accent covers the full circle —
  deliberate « tour complet » picture); below, the graduated line
  (`graph-scinde` SVG) with the accent segment [0 ; t] and its point.
- **Readouts**: mono line « t = 7π/12 ≈ 1,83 rad = 105° »; chips degrés ·
  longueur d'arc (accent) · state chip (aria-live): t > 0 « sens direct »
  (good) / t < 0 « sens des aiguilles » (bad) / t = 0 and |t| = 2π
  (accent). Legende (aria-live) narrates quart de tour / demi-tour / tour
  complet / generic enroulement, and asks to land on a graduation when k
  is fractional mid-animation.
- No dragging → keyboard free via the slider.

### 2. `trigo-cossin` — « Les deux coordonnées de M » (§3)

Module `assets/js/widgets/trigo-cossin.js`, instance `data-k-init="4"`
(t = π/3). Archetype A (drag on the circle).

- **Draggable**: M anywhere on the circle — pointer angle via atan2
  (`angleDePointeur`), plus `role="slider"` keyboard (arrows ±0,05, Shift
  ±0,01, Home/End = −π/π; t clamped to [−π ; π]).
- **Display magnet**: within 0,04 rad of a k·π/12 the *rendered* state
  snaps to it (drag stays free — variations.js precedent). On the magnet,
  the t chip shows the exact « π/3 »; on a *remarkable* angle the legende
  gives the exact cos/sin (« cos(π/3) = 1/2 et sin(π/3) = √3/2 »),
  otherwise it names the quadrant and the signs.
- **Follows M**: dashed guides to both axes, accent segments on the axes
  labelled cos t / sin t (label sides flip with the quadrant), radius
  labelled « 1 », halo + hit ≥ 44 px, « glisse-moi » hint hidden at first
  interaction.
- **Readouts** (chips): t (exact or decimal) · cos t (accent) · sin t
  (accent) · **cos²t + sin²t = 1,00 recomputed live** (the invariant is
  shown, not asserted).
- **Reset**: header → t = π/3.

### 3. `trigo-valeurs` — « Le cadran des valeurs exactes » (§4)

Module `assets/js/widgets/trigo-valeurs.js`. Archetype D (rounds), same
flow as exp-courbes. Rounds in `<script type="application/json">`:
`{k (douzièmes de π), bonne (1-based)}`. Questions, answer buttons AND
explanations are **static HTML per round** (`.js-manche` / `.js-expl`
toggled by `hidden`) because they contain KaTeX fractions/radicals.

- **Rounds**: ① cos π/6 ② sin π/6 ③ cos π/4 ④ sin π/3 ⑤ cos π/2 ⑥ cos π
  (`data-bonne` spread 2/3/1/3/2/3). Explanations coach the
  read-the-circle reflex (haut/bas ↔ grand/petit) and the π/6 ↔ π/3
  exchange; the shared relance sends back to the drawing.
- **Drawing per round**: chalk circle + accent radius + small accent
  angle arc + accent exact label (fmtPi) near M.
- **Flow**: wrong → marked + disabled + relance, retry; right →
  explanation + « Angle suivant (i/6) ▸ »; end → « Terminé : x/6 du
  premier coup. » + « ↺ recommencer ». Progress chip « ANGLE i/6 ».
- No dragging: keyboard/touch free via buttons.

### 4. `trigo-associes` — « Quatre symétries, huit formules » (§5)

Module `assets/js/widgets/trigo-associes.js`, instance `data-k-init="2"`
(t = π/6) `data-mode-init="oppose"`. Archetype A + segmented mode switch.

- **Modes** (header `segmente`): −t (axe Ox) · π − t (axe Oy) · π + t
  (centre O) · π/2 − t (diagonale y = x). Each mode draws its dashed
  accent symmetry axis (or the M–M′ diameter for the central symmetry)
  and a dashed link M → M′.
- **Draggable**: M in the first quadrant, domain t ∈ [0,06 ; π/2 − 0,06]
  (endpoints excluded so M and M′ never merge); same keyboard contract as
  trigo-cossin; same 0,04 display magnet.
- **Readouts**: two mono lines instantiating the formulas —
  « cos(5π/6) = −cos(π/6) = −√3/2 » exact on remarkable angles, decimals
  elsewhere; chips t · angle associé (accent, exact via k arithmetic even
  beyond π, e.g. « 7π/6 ») · state chip naming the symmetry; legende
  narrates what is kept and what flips sign.
- **Reset** (in the pied — header slot taken by the modes): t = π/6, mode
  −t.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions (3+3+3+4 — the 4-question quiz
closes §5, the sign-trap section). `data-bonne` spread over the page
(games included): 4× position 1, 6× position 2, 3× position 3.
Distractors are the pièges: le réel 60 pris pour 60°, π = tour complet,
sens direct horaire, cos/sin échangés, cos t = 1,4 possible, l'oubli des
carrés dans l'identité, √3/2 pour cos π/3, cos(π − t) sans le signe,
sin(−t) = sin t, les signes du troisième quadrant.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: trigo-enroulement \| trigo-cossin \| trigo-valeurs \| trigo-associes \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: trigonometrie` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: trigonometrie` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="trigonometrie">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock
and no pre-existing copy. Please read as author. Specific decisions:

1. **Chapter choice and outline were not confirmed live** — you were away,
   so per the skill's fallback I chose the next topic (trigonométrie was
   the last ⬜ Analyse chapter, well-scoped in PROGRAMME.md, and its
   homepage « bientôt » card already existed) and built to the outline at
   the top of this file. Veto anything.
2. **The grande roue story** (§1, ex 14) is mine. Ex 14's
   h(t) = 22 − 20 cos t is *given* to show, bac-style; heights land clean
   (12 m, 22 m, 42 m).
3. **2026 scope respected**: no sin/cos *functions* anywhere. I kept
   **mesure principale** (§3) and the **π/2 − t complémentaires** (§5) —
   both classic Première content — but the official 2026 annexe couldn't
   be fetched from this sandbox (PROGRAMME.md « À vérifier »): confirm
   neither moved.
4. **Ex 12** solves cos t = 1/2 and sin t = −√2/2 *by reading the
   circle* (« à l'aide du cercle trigonométrique ») — formal trig
   equations are not in the programme, but circle-reading is; drop it if
   you find it early.
5. **The π/12 slider step** (enroulement) is the load-bearing exactness
   decision: every position is exact in π and integer in degrees. The
   widget-note tells the student so.
6. **Display magnet 0,04 rad** on trigo-cossin and trigo-associes: the
   drag is free but the rendered state snaps to π/12 multiples, so
   remarkable angles are actually reachable by hand. Keyboard steps of
   0,05 land inside the magnet for every remarkable angle.
7. **State-chip colours** on enroulement map good/bad to sens
   direct/indirect (not to correct/wrong). Tell me if you'd rather keep
   both neutral.
8. **CSS fix `.katex svg`** (see Components above): one appended rule in
   chapitre.css, `?v=15` bumped on all 45 page links. It changes rendering
   on other chapters only where KaTeX stretchy SVGs were already broken
   (probas quiz \overline bars — verified fixed in browser).
9. **JS budget: 48,9 KB** on this page (ceiling 50) — theme, sommaire,
   corrige, quiz, analytics, nabla-graph + trigo-cercle + 4 widgets.
   `nabla-graph.js` deliberately untouched (dérivation is at 49,8).
   Measured with `wc -c`.
10. **§1 figure** is the flagship's *circle* at t = π/2; the widget's
    second SVG (the graduated line) is not previewed in §1 — the caption
    carries the two-languages idea instead.
11. **Homepage renumbering**: trigonométrie takes CHAPITRE 05 (Analyse,
    display order), pushing produit scalaire → 06, géométrie repérée → 07,
    probabilités → 08. A « Les variables aléatoires » bientôt card was
    added under Probabilités et statistiques, and this page's footer
    announces it — that presumes variables aléatoires is the next maths
    chapter.
12. **Bac banner « SANS CALCULATRICE »** and the §4 framing lean on the
    épreuve anticipée; B.3 (développer (cos t + sin t)²) is one notch
    above routine but standard.
13. **Arithmetic hand-checked**: ex 03 (17π/4 → π/4 ; −7π/6 → 5π/6) ·
    ex 06 (−0,8) · ex 07 (−2√2/3) · ex 09 (1 ; 3/4 ; 3/4) · ex 11 (−1/2 ;
    1/2 ; 1/2 ; −√3/2) · ex 12 (±π/3 ; −π/4 et −3π/4) · ex 13 (5π/6 ;
    1/2 ; −1/2 ; √3/2) · ex 14 (40π ≈ 125,7 m ; π/3 ; 12 m ; 42 m) ·
    ex 15 (−√2/2 ; √2/2 ; 5π/6 ; 4/5 ; −4/5 ; −3/5 ; 49/25).
14. **Verification done here**: jsdom harness (all four widgets by
    keyboard/clicks, quiz, corrigés — 70 assertions green), KaTeX 506
    formulas / 0 errors (jsdom **and** real Chromium), Playwright
    screenshots in both themes at 1280 px and 375 px reviewed. Lighthouse
    was not run (no browser audit tooling in the sandbox) — worth a pass
    on your machine.
15. **« mis à jour juillet 2026 »** hand-maintained, as everywhere.
