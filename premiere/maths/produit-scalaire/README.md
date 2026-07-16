# Chapitre — Le produit scalaire (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention, following the
`nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file in full
before any later work on the chapter; keep it updated when behaviour
changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as author,
> starting with the review flags at the bottom.

## Purpose & narrative through-line

Replace the static PDF fiche on the produit scalaire with a page where the
student *performs* the chapter's one big gesture — projecting one vector
onto another and reading the signed shadow — before any formula. Narrative
order (concrete hook → picture → manipulation → formal definition), never
to be reordered:

1. **Concrete hook** (§1) — la valise à roulettes tirée sur le quai : la
   poignée est inclinée, seule la part du geste dans le sens de la marche
   fait avancer la valise. Deux grandeurs fléchées (la force, le
   déplacement) et une question : combien de l'une agit dans le sens de
   l'autre ? Static figure = the flagship widget's initial state dressed as
   the suitcase picture (déplacement horizontal en craie, force à 60° en
   accent, ombre épaisse sur l'axe).
2. **Manipulation, then definition** (§2) — the **ps-projection** widget:
   turn \(\vec v\) around O against a fixed \(\vec u\), watch the shadow
   stretch, vanish at 90°, flip sign beyond; **only after** comes the
   DÉFINITION by projection, the central formula
   ‖u⃗‖ ‖v⃗‖ cos(u⃗ ; v⃗), the sign discussion and the
   normes-et-angle méthode.
3. **Les coordonnées** (§3) — the **ps-coordonnees** widget (two grid-
   snapped vectors, live xx′ + yy′, challenge « rends le produit nul »),
   then the xx′ + yy′ property, carré scalaire, identités remarquables and
   the norms-only (polarisation) expression, and the calculer-un-angle
   méthode.
4. **L'orthogonalité** (§4) — the **ps-signe** game (positif, nul ou
   négatif ? — including the twin pair (−1 ; 3) orthogonale vs (−1 ; 2)
   pas), then u⃗·v⃗ = 0 ⟺ orthogonaux and the démontrer-une-
   perpendicularité méthode. La valise revient : tirer à 90° ne sert à
   rien.
5. **Al-Kashi** (§5) — the **ps-alkashi** widget: b = AC = 6 and c = AB = 8
   fixed, turn Â and watch a² = b² + c² − 2bc cos Â correct Pythagoras
   live; at 90° the correction dies and the 6-8-10 triangle appears. Then
   the theorem, its three-line proof (BC⃗ = AC⃗ − AB⃗ squared), and the two
   méthodes (find a side / find an angle).
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = la valise, travail d'une force), Vers le Bac
   (triangle 3-8-60° sans calculatrice + repère orthonormé, cercle de
   Thalès).

One story runs through: la valise du §1 revient au §4 et à l'exercice 14 ;
la dérivation n'est pas sollicitée (chapitre de géométrie), mais Pythagore,
la trigonométrie de Seconde (cos) et les coordonnées de vecteurs de Seconde
sont rappelés quand ils servent. Rien n'utilise la géométrie repérée
(équations de droites/cercles) qui fera l'objet d'un chapitre ultérieur —
l'exercice 13 obtient le cercle de Thalès par pur produit scalaire
(MI² − IA²), sans équation de cercle.

## Reference data & view windows

No `FONCTIONS` entry (no curves — vector geometry). All four widgets use
**square units** (same px-per-unit on x and y, mandatory for angles to look
right), on the shared 640 × 400 viewBox:

- **§1 static figure & ps-projection**: 40 px/unit — x ∈ [−6 ; 10],
  y ∈ [−3 ; 7]. O at the origin, u⃗ fixed = 4 units along +x, v⃗ = 3 units
  at angle θ ∈ [0° ; 180°] (upper half-plane), init θ = 60°.
  Chosen so u⃗·v⃗ = 12 cos θ lands exactly on 6 / 0 / −6 at the presets
  60° / 90° / 120°, and the shadow OH̄ = 3 cos θ on 1,50 / 0 / −1,50.
- **ps-coordonnees**: 40 px/unit — x ∈ [−8 ; 8], y ∈ [−5 ; 5]. Grid-node
  snapping keeps every displayed number an integer. Init u⃗ = (3 ; 1),
  v⃗ = (2 ; 3) → u⃗·v⃗ = 9. The challenge « rends le produit nul » has
  many reachable solutions (e.g. v⃗ = (−1 ; 3), (1 ; −3), (−2 ; 6)).
- **ps-signe**: 40 px/unit — x ∈ [−8 ; 8], y ∈ [−5 ; 5]. Four pairs, all
  integer, all with |u⃗·v⃗| computable head-on: (4 ; 1)·(2 ; 3) = 11 ;
  (3 ; 1)·(−1 ; 3) = 0 ; (3 ; 2)·(−4 ; −1) = −14 ; (3 ; 1)·(−1 ; 2) = −1
  (the trap round: looks orthogonal, is not).
- **ps-alkashi**: 32 px/unit — x ∈ [−9 ; 11], y ∈ [−3,5 ; 9]. A at the
  origin, B = (8 ; 0), C on the circle of radius 6 around A,
  Â ∈ [15° ; 165°], init 75°. b = 6 and c = 8 chosen so that Â = 90° gives
  a² = 100, a = 10 — the famous 6-8-10 right triangle — while
  60° / 120° give a² = 52 / 148 (× 2bc = 96, cos = ±0,5 → ∓48 exact).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Tirer dans le bon sens | hook prose (la valise ; deux flèches, une question) · vitrine (la question en mots) · static figure (déplacement, force à 60°, ombre) — no widget, no definition |
| `s2` | 2. L'ombre d'un vecteur | **widget ps-projection** · POURQUOI ? (pourquoi multiplier par ‖u⃗‖) · DÉFINITION (par projection) · vitrine --grande (‖u⃗‖ ‖v⃗‖ cos) · PROPRIÉTÉ (signe selon l'angle, symétrie) · MÉTHODE (calculer avec normes et angle) · EXEMPLE RÉSOLU · À RETENIR (un nombre, pas un vecteur) · **quiz s2** (3 q.) |
| `s3` | 3. Avec des coordonnées | prose (le rapporteur ne suit pas) · **widget ps-coordonnees** · PROPRIÉTÉ (xx′ + yy′) · POURQUOI ? (décomposition sur i⃗, j⃗) · PROPRIÉTÉ (carré scalaire, développement, identités) + vitrine (polarisation) · MÉTHODE (calculer un angle) · EXEMPLES (2) · **quiz s3** (3 q.) |
| `s4` | 4. L'orthogonalité | hook (la valise à 90°) · **widget ps-signe** (4 manches) · DÉFINITION + PROPRIÉTÉ (u⃗·v⃗ = 0 ⟺ ⟂) · MÉTHODE (démontrer une perpendicularité) · EXEMPLES (2 : trouver t ; démonstration dans le carré) · **quiz s4** (3 q.) |
| `s5` | 5. Al-Kashi | hook (Pythagore hors angle droit) · **widget ps-alkashi** · PROPRIÉTÉ (théorème d'Al-Kashi) · POURQUOI ? (démo par BC⃗ = AC⃗ − AB⃗) · MÉTHODE (trouver un côté) + EXEMPLE · MÉTHODE (trouver un angle) + EXEMPLE · À RETENIR · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (produit = nombre · coordonnées croisées · produit nul sans facteur nul · ‖u⃗+v⃗‖ ≠ ‖u⃗‖+‖v⃗‖ · Al-Kashi : le −2bc cos et l'angle opposé) |
| `essentiel` | L'essentiel en 5 lignes | DÉFINITION · PROJECTION · COORDONNÉES · ORTHOGONALITÉ · AL-KASHI |
| `ex` | Exercices — 15 corrigés | course order: normes & angle 01 · projection 02 · retrouver l'angle 03 · coordonnées 04 · angle par coordonnées 05 · carré scalaire & normes 06 · orthogonaux ? 07 · trouver t 08 · triangle rectangle 09 · démonstration (le carré) 10 · Al-Kashi côté 11 · Al-Kashi angle 12 · cercle de Thalès 13 · problème (la valise) 14 · **VERS LE BAC** (ex 15, `#bac`, SANS CALCULATRICE) |

Niveau distribution: n1 = 01, 02, 04, 07 · n2 = 03, 05, 06, 08, 09, 11,
12 · n3 = 10, 13, 14.

### Components introduced by this chapter

- **nabla-graph.js** : two exported helpers, `creerVecteur` (arrow = shaft
  path + triangular tip path, `maj(x1, y1, x2, y2)` in pixels) and
  `etiquetteVecteur` (italic letter + small arrow path drawn above — no
  Unicode combining arrow in SVG, per the typography rule). Used by all
  four widget modules and by no earlier chapter.
- **chapitre.css** (end-of-file banner « Produit scalaire ») :
  `.vec-pointe(--accent)` arrow-tip fills, `.arc-angle` (angle arc),
  `.marque-droit` (right-angle square). Strokes/fills token-only; vector
  shafts reuse `.g-courbe` / `.g-courbe-derivee`, the shadow segment
  reuses `.g-courbe-derivee`, H reuses `.pt-derivee`.
- CSS changed → `?v=6` bumped to `?v=7` on every page in the same commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `ps-projection` — « L'ombre qui fait le produit » (flagship, §2)

Module `assets/js/widgets/ps-projection.js`, instance
`data-nu="4" data-nv="3" data-theta-init="60"
data-xmin="-6" data-xmax="10" data-ymin="-3" data-ymax="7"`.

- **Fixed**: u⃗ (craie, 4 units along +x from O), its axis line, the grid.
- **Draggable**: the tip of v⃗ (accent, 3 units), constrained to the circle
  of radius 3 — the drag parameter is the angle θ, quantised to 1°
  (displayed numbers stay consistent). Pointer positions below the axis
  clamp to θ = 0° or 180° (upper half-plane only). Archetype A.
- **Follows θ**: dashed drop from the tip of v⃗ to H, the shadow [OH]
  drawn thick accent on the axis with the H dot, the angle arc + θ label
  at O, the v⃗ label.
- **Readouts**: mono line (`.js-ligne`, plain text) —
  « u⃗·v⃗ = ‖u⃗‖ × OH = 4 × 1,50 = 6,00 » (signed OH, true minus);
  chips θ (integer degrees) · ombre OH̄ · u⃗·v⃗ (accent) · state chip
  (aria-live): aigu → « produit positif » (good) / 90° → « produit nul —
  orthogonaux » (accent) / obtus → « produit négatif » (bad); dynamic
  légende (aria-live) narrating the three regimes, the 90° one
  foreshadowing §4.
- **Presets** (header `segmente`): θ = 60° / 90° / 120°, animated via
  `animerValeur` (instant under reduced motion), `aria-pressed` on exact
  match only; reset button in the `widget-pied` (header slot taken —
  geometrique convention) → θ = 60°.
- **Keyboard**: hit-zone `role="slider"`, `aria-valuemin/max` 0/180,
  arrows ±5°, Shift ±1°, Home/End = 0°/180°. « glisse-moi » hint near the
  tip, hidden at first interaction.
- **Note**: « ‖u⃗‖ = 4 et ‖v⃗‖ = 3 sont fixées… » spelling out that only
  the angle moves.

### 2. `ps-coordonnees` — « Le produit scalaire sans rapporteur » (§3)

Module `assets/js/widgets/ps-coordonnees.js`, instance
`data-u-init="3,1" data-v-init="2,3" data-xmin="-8" data-xmax="8"
data-ymin="-5" data-ymax="5"`. Archetype A variant (grid-snapped 2D drag).

- **Draggable**: BOTH vector tips — u⃗ (craie) and v⃗ (accent) — snapped
  to integer grid nodes, clamped to [−7 ; 7] × [−4 ; 4]; the origin (0 ; 0)
  is refused (vecteur nul) : the tip keeps its previous node.
- **Readouts**: mono line composed in JS —
  « u⃗·v⃗ = 3×2 + 1×3 = 9 » (negative coordinates parenthesised, true
  minus); chips u⃗ = (3 ; 1) · v⃗ = (2 ; 3) · state chip (aria-live):
  produit > 0 « angle aigu » (good) / = 0 « orthogonaux ! » (accent) /
  < 0 « angle obtus » (bad). A `.marque-droit` right-angle square appears
  at O when the product is exactly 0, plus a revealed caption narrating
  the challenge success.
- **Challenge** in the prose above the widget: « rends le produit nul ».
- **Keyboard**: each tip is a focusable `role="slider"` whose arrow keys
  move the tip one grid unit (Left/Right = x ∓/± 1, Up/Down = y ± 1);
  `aria-valuenow` carries x, `aria-valuetext` the full pair + product.
  ARIA is bent here (a slider is 1-D; see review flag 6).
- **Reset**: header « ↺ réinitialiser » → (3 ; 1) and (2 ; 3). Hint on v⃗.

### 3. `ps-signe` — « Positif, négatif ou nul ? » (§4, game)

Module `assets/js/widgets/ps-signe.js`. Archetype D (rounds answered by
buttons — the three answers positif/nul/négatif are the SAME each round, so
one static button set, sens.js pattern). Rounds in
`<script type="application/json">`: `{u: [x, y], v: [x, y], bonne}`.

- **Rounds**: ① u⃗(4 ; 1), v⃗(2 ; 3) → 11, franchement aigu ②
  u⃗(3 ; 1), v⃗(−1 ; 3) → 0, orthogonale pas alignée sur les axes ③
  u⃗(3 ; 2), v⃗(−4 ; −1) → −14, franchement obtus ④ u⃗(3 ; 1),
  v⃗(−1 ; 2) → −1 : la jumelle de la manche 2, l'œil ne suffit plus, le
  calcul tranche. Coordinate labels drawn next to each tip.
- **Flow**: wrong → marked + disabled + relance (« calcule xx′ + yy′,
  le signe est dedans »), retry; right → locked, per-round static
  explanation (KaTeX), accent « Paire suivante (i/4) ▸ »; after ④
  « Terminé : x/4 du premier coup » + « ↺ recommencer ». Progress chip
  « PAIRE 1/4 ». No dragging → keyboard/touch free via buttons.

### 4. `ps-alkashi` — « Pythagore, corrigé par l'angle » (§5)

Module `assets/js/widgets/ps-alkashi.js`, instance
`data-b="6" data-c="8" data-angle-init="75" data-xmin="-9" data-xmax="11"
data-ymin="-3.5" data-ymax="9"`. Archetype A (angle drag) + presets.

- **Fixed**: A (origin), B (8 ; 0), side [AB] (craie), lengths b = 6,
  c = 8.
- **Draggable**: C on the circle of radius 6 around A; parameter Â
  quantised to 1°, domain [15° ; 165°] (no degenerate triangle). [AC]
  craie, [BC] accent (the side that responds), angle arc at A.
- **Readouts**: mono line — « a² = 6² + 8² − 2×6×8×cos(75°) ≈ 100 − 24,85
  ≈ 75,15 » (the correction term is rounded first, then subtracted, so the
  displayed line is arithmetically self-consistent; exact at 60/90/120°
  where cos = ±0,5 / 0); chips Â (integer degrees) · a = BC (accent) ·
  state chip (aria-live): Â < 90° « a² < b² + c² » (good) / Â = 90°
  « Pythagore exact » (accent) / Â > 90° « a² > b² + c² » (bad); dynamic
  légende — at 90°: « Le terme de correction a disparu : 6² + 8² = 10²,
  le triangle 6-8-10. »
- **Presets** (header): Â = 60° / 90° / 120° animated; reset in the pied
  → 75°. Keyboard: `role="slider"`, arrows ±5°, Shift ±1°, Home/End =
  15°/165°.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total (3+3+3+4), same markup
and behaviour as the other chapters. Distractors are the chapter's pièges:
« un vecteur », the crossed coordinates xy′ + x′y, « u⃗ = 0 ou v⃗ = 0 »,
‖u⃗+v⃗‖² = ‖u⃗‖² + ‖v⃗‖², the lost −2bc cos and the oubli du cos.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: ps-projection \| ps-coordonnees \| ps-signe \| ps-alkashi \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: scalaire` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: scalaire` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="scalaire">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **The whole chapter design is mine**: the valise story, the
   ombre-then-cosinus order (projection presented as THE meaning of the
   produit scalaire, ‖u⃗‖‖v⃗‖cos θ derived from it via the Seconde
   cosinus), coordinates in §3 with all the calculation rules, orthogonality
   as its own §4, Al-Kashi as the §5 payoff. The programme's other
   démonstration (ensemble des points M, MA⃗·MB⃗ = 0) is exercise 13
   rather than course content — done by pure produit scalaire (MI² − IA²),
   deliberately NOT via circle equations (kept for a future géométrie
   repérée chapter).
2. **Bilinéarité is stated, not named**: « le produit scalaire se développe
   comme un produit de nombres » with the two rules and the identités
   remarquables. The word « bilinéarité » never appears — my call for
   Première readability.
3. **The projection definition** uses the two-case formulation
   (OA × OH / −OA × OH with H on either side of O) rather than mesures
   algébriques (not assumed known). The essentiel line uses the
   \(\overline{OH}\) overline notation once, KaTeX-rendered.
4. **Mono readouts write « u·v » without vector arrows** (combining U+20D7
   renders unreliably in IBM Plex Mono / Spectral). Proper arrows appear in
   all KaTeX maths. Same choice for JS-composed captions.
5. **ps-projection allows only the upper half-plane** (θ ∈ [0° ; 180°],
   pointer below the axis clamps to 0°/180°) — the angle between vectors is
   non-oriented, and this avoids duplicated states. Angles are quantised to
   whole degrees so readouts stay consistent.
6. **ARIA is bent in ps-coordonnees**: a 2-D draggable grid point is
   exposed as `role="slider"` (1-D by spec) with arrows moving both axes
   and `aria-valuetext` carrying the full pair + product. No better
   standard role exists; tell me if you'd rather have four sliders.
7. **ps-alkashi's displayed line rounds the correction term first** then
   subtracts, so the shown arithmetic is always self-consistent (and exact
   at 60/90/120°); the chip a = BC uses the exact value. The a² chip and
   the a chip can therefore differ in the third decimal — invisible at
   2 decimals.
8. **Drag widgets use arrows ±5°, Shift ±1°** (previous chapters: ±0,05 /
   ±0,01 in maths units) — degrees needed a bigger default step to cross
   180° in a reasonable number of presses.
9. **Exercise stories & numbers, all hand-checked**: ex 01 = the widget's
   presets (6/−6/0) · ex 03 cos = −0,5 → 120° · ex 05 → 45° exact ·
   ex 06 → √11, √15, −5 · ex 08b t² = 16 (two solutions) · ex 09 aire = 15
   exact · ex 10 le carré (repère à poser soi-même) · ex 11 = 120° so the
   double negative gives +15 (BC = 7) · ex 12 cos = −2/7 → 106,6° ·
   ex 13 = the programme démonstration · ex 14 travail 4 000 J vs
   4 000√3 ≈ 6 920 J (√3 ≈ 1,73 given) · bac A: 12, BC = 7,
   cos B̂ = −1/7 (obtus, no calculator) · bac B: rectangle en A,
   I(3 ; 2), IA² = IB² = IC² = 10 → circle of radius √10 (A lies on the
   circle of diameter [BC] — closes the loop with ex 13).
10. **Ex 14 uses the physics word « travail » (joules)** and presents
    W = F⃗·d⃗ as the official formula — a deliberate spé-physique bridge.
    Check the framing (the « travail utile » reading at fixed force
    intensity).
11. **The next chapter is announced as « La géométrie repérée »** (this
    page's footer + a new homepage « bientôt » card with a line+circle
    motif). Pure guess on my part — rename if your roadmap differs.
12. **New shared code**: `creerVecteur` and `etiquetteVecteur` exported
    from nabla-graph.js (used by all 4 widgets); chapitre.css gained one
    banner section (arrow-tip fills, angle arc, right-angle mark, label
    arrow strokes) — tokens only, `?v=6 → ?v=7` bumped on every page in
    the same commit.
13. **JS budget: 48,6 KB** first-party unminified on this page (ceiling
    50 KB) — the heaviest chapter so far; measured with `wc -c`. If a
    fifth widget is ever added, something must be trimmed.
14. **Verified in a real browser** (Playwright + Chromium in the build
    sandbox): 36 behavioural checks pass — drags (mouse + touch), keyboard
    paths (arrows/Shift/Home/End), presets & resets, the ps-signe game
    flow, quiz + corrigés, scroll-spy, internal links; KaTeX rendered
    served-locally (437 formulas, 0 errors — the CDN is blocked in the
    sandbox); CLS = 0,0000 at 375 px with maths rendered; reduced-motion
    presets jump instantly. Screenshots taken in both themes at 375 px and
    1280 px. **A live pass on the real site (CDN KaTeX, Lighthouse, real
    touch) remains on your checklist.**
15. **« mis à jour juillet 2026 »** hand-maintained, as everywhere.
    Sitemap lastmod 2026-07-16 on /, exponentielle, produit-scalaire.
