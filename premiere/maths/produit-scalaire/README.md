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

(To be completed at the end of the build.)
