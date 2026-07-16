# Chapitre — La fonction exponentielle (Première · Spé Maths)

Spec of this chapter's content structure, widgets and configuration.
No Claude Design mock exists for this chapter: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to new
content, reusing every block component and widget convention. Built as the
validation dry-run of the `nabla-topic` skill
(`.claude/skills/nabla-topic/`). Read this file in full before any later
work on the chapter; keep it updated when behaviour changes.

## Purpose & narrative through-line

Replace the static PDF fiche on the exponential with a page where the
student *sees and manipulates* the chapter's one big idea — a function whose
growth speed IS its value — before any formalism. Narrative order (concrete
hook → picture → manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — a bacteria culture: the more there are, the
   faster it grows; « vitesse proportionnelle à la quantité » translates to
   f′ = f via the dérivation chapter. Static figure: the exp curve with its
   tangent at A(1 ; e) — pente = hauteur, and the tangent crosses the x-axis
   exactly 1 unit left of A (here: at the origin).
2. **Manipulation, then definition** (§2) — the **exp-pente** widget: drag A,
   watch the « hauteur » and « pente » chips stay equal; **only after** comes
   the admitted definition (unique f with f′ = f, f(0) = 1), positivity and
   strict growth, the dériver-avec-eˣ méthode and the famous tangent y = x+1.
3. **Le nombre e et les règles** (§3) — the **exp-decale** widget makes the
   functional equation physical: shifting the curve by a = multiplying it by
   eᵃ. Then the rules (e^(a+b), e^(−a), (e^a)ⁿ), the simplification méthode,
   and equations/inequations via strict growth.
4. **e^(kx)** (§4) — the **exp-mondes** widget: slider k, three worlds
   (explose / constante / fond), all curves through (0 ; 1), the derivative
   k·e^(kx) shown live; bridge to geometric sequences (uₙ = e^(kn), raison
   e^k) — the suites chapter's « ça s'emballe / ça fond » worlds recur.
5. **Étude de fonctions** (§5) — eye-training first (**exp-courbes**, 4
   rounds: match the drawn curve to its formula, always reading f(0) first),
   then the produit-avec-exponentielle méthode (factorise, e^… > 0 doesn't
   weigh on the sign) and the full worked study of x·eˣ.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés, Vers le Bac (étude complète de (x+2)e^(−x), inequality via the
   global maximum).

One story runs through: the bacteria of §1 return in exercise 14
(N′ = 0,3 N, hourly factor e^0,3); the dérivation chapter is leaned on
explicitly (tangent equation, g(ax+b) rule, sign-of-f′ rule), and the suites
chapter in §4 and ex 09. All ideas beyond the Première programme (limits)
stay qualitative (« fond vers 0 sans jamais l'atteindre »).

## Reference function & view windows

- Registry key **`exp`** added to `FONCTIONS` in `assets/js/nabla-graph.js`:
  f = fp = Math.exp (analytic, no numeric differentiation).
- **§1 static figure & exp-pente widget**: viewBox 640×400,
  x ∈ [−2,5 ; 2,5], y ∈ [−1,5 ; 8,5] (non-square units: 128 px/unit in x,
  40 in y). Curve drawn on the drag domain [−2,4 ; 2,1] (e^2,1 ≈ 8,17 stays
  inside). A starts at a = 1 → f(a) = f′(a) = e ≈ 2,72, and the tangent
  crosses the x-axis at the origin (a − 1 = 0) — the figure and the widget's
  initial state are the same picture.
- **exp-decale**: viewBox 640×400, x ∈ [−2,5 ; 2,5], y ∈ [−0,5 ; 6].
  Chalk curve e^x and accent curve e^(x+a), both truncated at the top edge
  (x ≤ ln(yMax) − a). a ∈ [−1,5 ; 1,5] step 0,1, init 0,7
  (e^0,7 ≈ 2,01 — a visibly-doubled curve).
- **exp-mondes**: viewBox 640×400, x ∈ [−3,2 ; 3,2], y ∈ [−0,5 ; 6].
  Curve e^(kx) truncated at the top edge on the appropriate side.
  k ∈ [−1,5 ; 1,5] step 0,05, init 0,8; static point marker at (0 ; 1).
- **exp-courbes**: viewBox 640×400, x ∈ [−3,2 ; 3,2], y window per round
  (JSON). Round registry `COURBES` in the module: `exp`, `exp-moins`
  (e^(−x)), `x-exp` (x·e^x), `3exp-moins` (3e^(−x)).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Plus il y en a, plus ça pousse | hook prose (bactéries ; vitesse ∝ quantité, renvoi dérivation) · vitrine f′ = f · prose lecture · static figure (exp + tangente en A, sous-tangente 1) |
| `s2` | 2. La courbe qui est sa propre pente | **widget exp-pente** · POURQUOI ? (existence/unicité admises ; f(0) = 1 cale l'échelle) · DÉFINITION · vitrine (exp′ = exp ; exp(0) = 1) · PROPRIÉTÉ (positivité, croissance) + prose (la règle du signe se mord la queue) · MÉTHODE (dériver avec eˣ) · EXEMPLE (tangente en 0 : y = x + 1) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le nombre e et les règles | prose (e = exp(1), notation) · **widget exp-decale** · PROPRIÉTÉ (relation fonctionnelle + conséquences) · POURQUOI ? (e^a·e^(−a) = 1 ; re-preuve de non-nullité) · MÉTHODE (simplifier) · EXEMPLES (2) · prose + PROPRIÉTÉ (même exposant) · EXEMPLE (équation + inéquation) · **quiz s3** (3 q.) |
| `s4` | 4. Croître ou fondre : eᵏˣ | hook (modélisation, k règle la vitesse) · **widget exp-mondes** · PROPRIÉTÉ (dérivée k·e^(kx)) · POURQUOI ? (ligne g(ax+b) du chapitre dérivation) · EXEMPLES (2) · prose + PROPRIÉTÉ (suite des valeurs géométrique de raison e^k) · prose recoupement mondes/suites · **quiz s4** (3 q.) |
| `s5` | 5. Étudier une fonction avec exp | prose réflexe (e^… > 0 : ne pèse pas sur le signe) · **widget exp-courbes** (4 manches) · MÉTHODE (produit : dérive, factorise, signe du facteur, tableau) · EXEMPLE (étude complète de x·eˣ, min −1/e en −1) · À RETENIR · **quiz s5** (4 q.) |
| `pieges` | Les pièges classiques | 5 pièges (dériver eˣ en x·e^(x−1) · e^(a+b) = e^a + e^b · e^(−x) négatif · oublier le k · résoudre e^x = 0) |
| `essentiel` | L'essentiel en 5 lignes | DÉFINITION · SIGNE & SENS · RÈGLES · DÉRIVÉES · ÉTUDE |
| `ex` | Exercices — 15 corrigés | course order: définition 01 · dériver 02 · tangente 03 · règles 04–05 · équations 06 · inéquations 07 · e^(kx) 08 · suites 09 · produit 10 · variations 11–13 · problème 14 (bactéries) · **VERS LE BAC** (ex. 15, `#bac`, (x+2)e^(−x), SANS CALCULATRICE) |

Niveau distribution: n1 = 01, 02, 04, 08 · n2 = 03, 05, 06, 07, 09, 10, 11 ·
n3 = 12, 13, 14.

### Components introduced by this chapter

**None.** The whole page is built from existing chapitre.css components and
existing SVG classes (g-courbe/g-courbe-derivee for craie/accent curves,
pt-point/pt-fixe, curseur-ligne, segmente, chips, lecture-formule,
widget-legende, widget-note, quiz styles). No CSS was touched, so the
`?v=6` version is unchanged. One `FONCTIONS` entry (`exp`) added to
nabla-graph.js.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `exp-pente` — « La pente, c'est la hauteur » (flagship, §2)

Module `assets/js/widgets/exp-pente.js`, instance
`data-fn="exp" data-a-init="1" data-xmin="-2.5" data-xmax="2.5"
data-ymin="-1.5" data-ymax="8.5" data-domaine="-2.4,2.1"`.

- **Draggable**: A on the curve (pointer + `role="slider"` keyboard, arrows
  ±0,05, Shift ±0,01, Home/End = domain ends). Archetype A.
- **Follows A**: full-width tangent; dashed height segment from the x-axis
  to A labelled with f(a); a small `pt-fixe` dot on the x-axis at a − 1
  (where the tangent always crosses); « 1 » label centred under the unit
  base. The sub-tangent triangle makes pente = hauteur ÷ 1 visible.
- **Readouts** (chips): a · hauteur f(a) · pente f′(a) (accent) — the two
  numbers are always equal, that is the widget's lesson; a static
  widget-note spells out the sous-tangente reading.
- **Hint**: « glisse-moi » near A, hidden at first interaction.
- **Reset**: « ↺ réinitialiser » → a = 1.

### 2. `exp-decale` — « Décaler, c'est multiplier » (§3)

Module `assets/js/widgets/exp-decale.js`, instance
`data-a-init="0.7" data-xmin="-2.5" data-xmax="2.5" data-ymin="-0.5"
data-ymax="6"`. Archetype B (native slider), renders coalesced by rAF.

- **Control**: slider a ∈ [−1,5 ; 1,5] step 0,1.
- **Drawing**: chalk e^x (static) + accent e^(x+a), both truncated at the
  top edge; accent point + dashed guide at x = 0 reading the factor e^a on
  the y-axis, labelled `e^a = <val>`.
- **Readouts**: mono line (`.js-ligne`, composed as plain text) —
  « e^(x + 0,7) = e^(0,7) × e^x ≈ 2,01 × e^x », signs handled for a < 0;
  chips a · facteur e^a · state chip (aria-live): a > 0 « la courbe
  s'élève » (good) / a < 0 « la courbe s'écrase » (bad) / a = 0 « les deux
  courbes se confondent » (accent); dynamic légende (aria-live) narrating
  décaler=multiplier in both directions.
- **Reset**: header button → a = 0,7.

### 3. `exp-mondes` — « Le coefficient k change le monde » (§4)

Module `assets/js/widgets/exp-mondes.js`, instance
`data-k-init="0.8" data-xmin="-3.2" data-xmax="3.2" data-ymin="-0.5"
data-ymax="6"`. Archetype B + animated presets.

- **Controls**: header `segmente` presets k = 1 / 0 / −1 (animated via
  `animerValeur`, instant under reduced motion, `aria-pressed` only on
  exact match); slider k ∈ [−1,5 ; 1,5] step 0,05 with the reset button
  beside it (header slot taken by presets — the geometrique convention).
- **Drawing**: accent curve e^(kx) truncated at the top edge (right side
  for k > 0, left for k < 0); static `pt-fixe` at (0 ; 1) labelled (0 ; 1).
- **Readouts**: mono derivative line « (e^(0,8x))′ = 0,8 × e^(0,8x) »
  (special-cased for |k| = 1 → e^x / e^(−x), and k = 0); chips k · state
  chip: k > 0 « ça explose » (good) / k < 0 « ça fond vers 0 » (bad) /
  k = 0 « constante » (accent); dynamic légende narrating the three worlds
  plus « la courbe crève le plafond » when truncated. The suites chapter's
  vocabulary on purpose.
- **Reset**: → k = 0,8.

### 4. `exp-courbes` — « À chaque courbe sa formule » (§5)

Module `assets/js/widgets/exp-courbes.js`. Archetype D (rounds). Rounds
from `<script type="application/json">`:
`{courbe (clé du registre COURBES), ymin, ymax, bonne (1-based)}`.
Buttons AND explanations are **static HTML per round** (`.js-manche` /
`.js-expl` groups toggled by `hidden`) because they contain KaTeX — the
lecture.js text-only approach would break maths rendering.

- **Rounds**: ① e^x (distractors e^(−x), x²) ② e^(−x) (distractors −e^x,
  e^x — the « minus in the exponent » trap) ③ x·e^x (distractors e^x − 1
  and x·e^(−x), all three through (0 ; 0) — the creux-en-−1 signature
  decides) ④ 3e^(−x) (distractors e^(−3x), 3 − e^x — read f(0) = 3).
- **Flow**: wrong → marked + disabled + relance (lis f(0), monte ou
  descend, sous l'axe ?), retry; right → all locked, explanation, accent
  « Courbe suivante (i/4) ▸ »; after round 4 « Terminé : x/4 du premier
  coup » + « ↺ recommencer ». Progress chip « COURBE i/4 ». Curves are
  truncated at the top edge by an end-scan before sampling.
- No dragging: keyboard/touch free via buttons.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total (3+3+3+4), same markup and
behaviour as the other chapters. Distractors are the chapter's pièges:
x·e^(x−1), e^a + e^b, « e^(−3) négatif », the forgotten k, « e^x = 0 »,
u′v′, plus the sens-vs-signe confusion imported from dérivation.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: exp-pente \| exp-decale \| exp-mondes \| exp-courbes \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: exponentielle` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: exponentielle` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="exponentielle">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock
and no pre-existing copy. Please read as author. Specific decisions:

1. **All four widgets are my design** (no mock): stories, windows,
   thresholds, captions documented above. Visual language transposed from
   the existing chapters (craie = référence, accent = ce qui répond au
   geste, good/bad = monte/descend).
2. **The sous-tangente reading** (tangent crosses the x-axis exactly 1 left
   of A) carries both the §1 figure and the flagship widget. It's true,
   simple to draw, and makes « pente = hauteur » checkable on the grid —
   but it's not an explicit programme item; say the word if you'd rather
   drop it to a remark.
3. **Existence/unicity admises** (POURQUOI ? in §2) with the 2f argument
   for why f(0) = 1 pins the scale — my framing of the programme's
   « admis ».
4. **Équations/inéquations placed in §3** (with the rules) rather than in a
   separate section — they lean on strict growth stated in §2.
5. **§4 presets k = 1 / 0 / −1**: k = 0 is deliberately included as « la
   frontière entre les deux mondes ».
6. **exp-courbes round 3 is the hardest** (three curves through the
   origin, decided by the creux); the relance coaches the f(0)-first
   reflex. Tell me if it's too hard for a first pass.
7. **Exercise stories**: the bacteria problem (ex 14) closes the §1 loop
   (N′ = 0,3 N) and ends on the model's honesty (« aucune boîte n'est
   infinie »). Every corrigé's arithmetic checked by hand: ex 03 y = ex ·
   ex 05a = e · ex 06b x = ±2 · ex 09 raison e^0,2 ≈ 1,22 · ex 12 min = 1
   → e^x > x · ex 13 max 1/e en 1 · ex 14 facteur e^0,3 ≈ 1,35 · ex 15
   max = e en −1.
8. **Vers le Bac B.3** proves an inequality from a global maximum — same
   move as ex 12, one notch above routine but standard on bac subjects.
9. **No ln anywhere** (Terminale): every equation is engineered to resolve
   by matching exponents; limits stay qualitative (« fond vers 0 sans
   jamais l'atteindre », « crève le plafond »).
10. **Sommaire label uses Unicode superscripts** (« eᵏˣ ») because KaTeX
    isn't wanted inside nav links; the h2 uses real KaTeX. Precedent: the
    suites README's « 0,8ⁿ ».
11. **No CSS added, `?v=6` unchanged** — the page is built entirely from
    existing components (a good sign for the design system's coverage).
12. **JS budget**: 35,0 KB first-party on this page (ceiling 50 KB) —
    theme, sommaire, corrige, quiz, analytics, nabla-graph + the four
    exp-* widgets. Measured with `wc -c`.
13. **Homepage**: the exponentielle « bientôt » card became CHAPITRE 04
    (motif: the exp curve + tangent + point, echoing the sous-tangente
    picture); probabilités' footer now links here; this page's footer
    announces « Le produit scalaire — BIENTÔT ». Sitemap updated
    (lastmod 2026-07-16 on /, probas, exponentielle).
14. **« mis à jour juillet 2026 »** hand-maintained, as everywhere.
15. **Built as the `nabla-topic` skill dry-run** — gaps found in the skill
    while building are logged in
    `.claude/skills/nabla-topic/references/audit.md` §10.
