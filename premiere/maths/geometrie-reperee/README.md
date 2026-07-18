# Chapitre — La géométrie repérée (Première · Spé Maths)

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

Cover the « géométrie repérée » row of the 2026 Première programme
(PROGRAMME.md): vecteur normal à une droite, équations de droites, projeté
orthogonal d'un point sur une droite, équation d'un cercle (centre, rayon),
cercle de diamètre [AB]. The chapter is built as the direct sequel to the
produit scalaire: its through-line is that **the angle-droit detector
(u⃗·v⃗ = 0) writes geometry as equations**. Narrative order (concrete hook
→ picture → manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — le plan de la ville sur le téléphone : « vous
   êtes à 350 m de l'avenue », « réseau à moins de 2 km de l'antenne ».
   The phone sees only coordinates: how does it hold a whole street, a
   whole coverage zone, in numbers? Static figure = the flagship widget's
   initial state dressed as the street picture (rue en craie through A,
   n⃗ accent, équerre). Seconde recall: the distance formula (vitrine).
2. **Manipulation, then definition** (§2) — the **geo-normale** widget:
   turn n⃗ around a fixed A, the perpendicular line follows and its
   cartesian equation rewrites live; **only after** come the DÉFINITION
   (vecteur normal), the central correspondence ax + by + c = 0 ↔ n⃗(a ; b),
   the POURQUOI (n⃗ · AM⃗ = 0 developed), the lecture PROPRIÉTÉ (normal +
   directeur, parallèles/perpendiculaires) and the point+normale méthode.
3. **Le projeté orthogonal** (§3) — the **geo-projete** widget (drag M,
   H and MH follow, with the tempting-but-always-longer vertical distance
   as a counter-example), then the definition of H, «H = point le plus
   proche» (proof by Pythagoras), and the système méthode for computing H.
4. **L'équation du cercle** (§4) — the **geo-cercle** widget (drag center,
   radius slider, live equation, challenge « fais passer le cercle par
   P »), then (x − a)² + (y − b)² = r², and the forme-canonique méthode
   for recognising a circle (cercle / point / vide).
5. **Le cercle de diamètre [AB]** (§5) — the **geo-diametre** widget: hunt
   the grid nodes where MA⃗ · MB⃗ = 0; each find is marked, three finds
   reveal the circle. Then the characterization MA⃗·MB⃗ = 0, its 3-line
   proof (MI² − IA²), and the milieu+rayon méthode.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = l'antenne et la route ; 12–13 = la tangente au
   cercle par deux chemins), Vers le Bac sans calculatrice (hauteur d'un
   triangle + cercle de diamètre [AB]).

One story runs through: le plan de la ville (§1) revient au §3 (« à 350 m
de l'avenue ») et au §4 (l'antenne), puis dans l'exercice 14 (l'antenne et
la route). Le produit scalaire du chapitre précédent est l'outil-moteur des
§2 et §5 — the chapter never re-derives it, it *uses* it. Ex 13 (tangente)
closes the loop with §2 (point + vecteur normal = le rayon).

## Reference data & view windows

No `FONCTIONS` entry (no curves — analytic geometry on grids). All four
widgets use **square units** (same px-per-unit on x and y, mandatory for
right angles and circles to look right), on the shared 640 × 400 viewBox:

- **§1 static figure & geo-normale**: 40 px/unit — x ∈ [−7 ; 9],
  y ∈ [−4 ; 6]. A(1 ; 1) sits exactly at pixel (320 ; 200), the view
  centre. n⃗ init (2 ; 1), tip domain [−5 ; 5] × [−4 ; 4] around A minus
  the null vector. Equation coefficients are the integer coordinates of
  n⃗; c = −(a·1 + b·1) is integer by construction.
- **geo-projete**: 40 px/unit — x ∈ [−5 ; 11], y ∈ [−4 ; 6].
  d : 3x + 4y − 12 = 0 fixed (normal 3-4-5 → a² + b² = 25), M init (5 ; 4),
  M domain [−4 ; 9] × [−3 ; 5] (chosen so H and the vertical foot stay in
  view for every M). For integer M: H has exact 2-decimal coordinates
  (denominator 25), MH = |3x₀+4y₀−12|/5 exact to 1 decimal, vertical
  distance = |…|/4 exact to 2 decimals. Init: H(2,72 ; 0,96), MH = 3,80,
  verticale = 4,75. On-line nodes reachable: (0 ; 3), (4 ; 0), (8 ; −3).
- **geo-cercle**: 40 px/unit — x ∈ [−6 ; 10], y ∈ [−4 ; 6]. Ω init
  (−1 ; 1), domain [−5 ; 9] × [−3 ; 5]; r ∈ {1…5} (integer slider);
  P(3 ; 2) fixed. ΩP² and r² are integers → the dessus/dedans/dehors
  comparison is exact. The challenge has many solutions (e.g. Ω(4 ; 0)
  r 3, Ω(0 ; 6) r 5, Ω(6 ; −2) r 5…). Big circles near the edge may
  partially overflow the view (SVG clips) — accepted.
- **geo-diametre**: 32 px/unit — x ∈ [−10 ; 10], y ∈ [−4 ; 8,5].
  A(−4 ; −1), B(4 ; 5) → circle centre I(0 ; 2), r = 5, r² = 25. M init
  (3 ; 1), domain [−8 ; 8] × [−3 ; 7], A and B refused (null vector).
  MA⃗·MB⃗ = x² + (y − 2)² − 25 on integers → integer everywhere; the
  10 on-circle grid nodes findable besides A and B: (±3 ; 6), (±3 ; −2),
  (4 ; −1), (−4 ; 5), (±5 ; 2), (0 ; 7), (0 ; −3).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La ville en coordonnées | hook prose (le plan du téléphone ; décrire une figure entière par une équation) · static figure (la rue, A, n⃗, équerre) · Seconde recall + vitrine (formule de distance) — no widget, no definition |
| `s2` | 2. Le vecteur normal | **widget geo-normale** · DÉFINITION (vecteur normal) · vitrine --grande (ax + by + c = 0 ↔ n⃗(a ; b)) · POURQUOI ? (n⃗·AM⃗ = 0 développé) · PROPRIÉTÉ (lire une équation : normal, directeur ; parallèles/perpendiculaires) · MÉTHODE (point + vecteur normal) · EXEMPLE RÉSOLU · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le projeté orthogonal | hook (350 m comment ?) · **widget geo-projete** · DÉFINITION (projeté orthogonal) · PROPRIÉTÉ (le point le plus proche) · POURQUOI ? (Pythagore) · MÉTHODE (H par système) · EXEMPLE RÉSOLU · **quiz s3** (3 q.) |
| `s4` | 4. L'équation du cercle | hook (l'antenne) · **widget geo-cercle** · PROPRIÉTÉ + vitrine ((x−a)²+(y−b)² = r²) · POURQUOI ? (élever au carré) · MÉTHODE (reconnaître : forme canonique, 3 issues) · EXEMPLE RÉSOLU · À RETENIR (signes inversés, racine) · **quiz s4** (4 q.) |
| `s5` | 5. Le cercle de diamètre [AB] | hook (le photographe à 90°) · **widget geo-diametre** · PROPRIÉTÉ + vitrine (MA⃗·MB⃗ = 0) · POURQUOI ? (MI² − IA², signe dedans/dehors) · MÉTHODE (milieu + rayon ; route développée) · EXEMPLES (2 : équation ; triangle rectangle gratuit) · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (normal vs directeur · signes du centre · r vs r² · distance mesurée verticalement · x²+y²+… pas toujours un cercle) |
| `essentiel` | L'essentiel en 5 lignes | VECTEUR NORMAL · DROITE PAR A ET n · PROJETÉ · CERCLE · DIAMÈTRE [AB] |
| `ex` | Exercices — 15 corrigés | course order: lire un vecteur normal 01 · équation point+normale 02 · perpendiculaire 03 · droite par deux points 04 · projeté 05 · distance (replay du widget) 06 · équation de cercle 07 · centre et rayon 08 · cercle ou pas ? 09 · cercle de diamètre 10 · angle droit détecté 11 · droite et cercle 12 · tangente 13 · problème (l'antenne et la route) 14 · **VERS LE BAC** (ex 15, `#bac`, SANS CALCULATRICE) |

Niveau distribution: n1 = 01, 02, 07, 11 · n2 = 03, 04, 05, 06, 08, 09,
10, 12 · n3 = 13, 14.

### Components introduced by this chapter

None. All four widget modules reuse the existing shared vocabulary —
`creerVecteur`/`etiquetteVecteur` (nabla-graph, introduced by the produit
scalaire), `.marque-droit`, `.vec-pointe--accent`, `.g-guide(-accent)`,
`.pt-fixe/.pt-point/.pt-derivee/.pt-craie`, `.curseur-ligne` — and zero new
CSS was added, so **the `?v=14` cache version is unchanged** on every page.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `geo-normale` — « La droite au bout de la flèche » (flagship, §2)

Module `assets/js/widgets/geo-normale.js`, instance
`data-ax="1" data-ay="1" data-n-init="2,1" data-nx-dom="-5,5"
data-ny-dom="-4,4" data-xmin="-7" data-xmax="9" data-ymin="-4"
data-ymax="6"`. Archetype A variant (grid-snapped 2D drag, ps-coordonnees
pattern).

- **Fixed**: A(1 ; 1) (pt-fixe + label), the grid.
- **Draggable**: the tip of n⃗ (accent), anchored at A, snapped to integer
  offsets in [−5 ; 5] × [−4 ; 4]; (0 ; 0) refused (vecteur nul). The line
  through A perpendicular to n⃗ (craie, drawn ±25 units, SVG clips) and
  the équerre at A follow.
- **Readouts**: ligne 1 (`.js-ligne1`, plain text) — the live equation
  « d : 2x + y − 3 = 0 » (coefficient 1 muet, termes nuls omis, vrai
  moins) ; ligne 2 (`.js-ligne2`) — the shown invariant: A's coordinates
  substituted, always landing on 0 (« 2×1 + 1×1 − 3 = 0 — A est bien sur
  d ») ; chips A (static) · n⃗ (accent) · state chip (aria-live) : oblique
  (plain chip) / « équation sans y — droite verticale » (accent) /
  « équation sans x — droite horizontale » (accent) ; legende (aria-live)
  narrating the three regimes — the vertical one is the y = mx + p payoff.
- **Reset** (header) → n⃗ = (2 ; 1). « glisse-moi » hint on the tip,
  hidden at first interaction.
- **Keyboard**: hit-zone `role="slider"`, arrows move the tip one grid
  unit (Left/Right = a ∓/± 1, Up/Down = b ± 1), `aria-valuetext` = n⃗ +
  full equation. Same ARIA bending as ps-coordonnees (see flag 6 there).

### 2. `geo-projete` — « La distance la plus courte » (§3)

Module `assets/js/widgets/geo-projete.js`, instance
`data-da="3" data-db="4" data-dc="-12" data-m-init="5,4"
data-xdom="-4,9" data-ydom="-3,5" data-xmin="-5" data-xmax="11"
data-ymin="-4" data-ymax="6"`. Archetype A variant (grid-snapped 2D drag).

- **Fixed**: d : 3x + 4y − 12 = 0 (craie, labelled d), the grid.
- **Draggable**: M (accent), snapped to grid nodes in the domain.
- **Follows M**: H = projeté orthogonal (pt-derivee dot + label), dashed
  accent [MH], dashed muted vertical from M to d, équerre at H (oriented
  toward M's side), labels clamped into view. All three hidden when M is
  exactly on d.
- **Readouts**: ligne 1 — « H = (2,72 ; 0,96) » ; ligne 2 — « distance de
  M à d : MH = 3,80 » ; chips M · MH (chip--good — the right way to
  measure) · verticale (chip--bad — the classic error, always longer) ;
  legende (aria-live): the payoff sentence, or « M est sur d… » when the
  student lands on the line.
- **Reset** (header) → M(5 ; 4). Hint on M. Keyboard: 2D arrows, one grid
  unit; `aria-valuetext` carries M, H and the distance.

### 3. `geo-cercle` — « Fais passer le cercle par P » (§4)

Module `assets/js/widgets/geo-cercle.js`, instance
`data-omega-init="-1,1" data-r-init="2" data-p="3,2" data-xdom="-5,9"
data-ydom="-3,5" data-xmin="-6" data-xmax="10" data-ymin="-4"
data-ymax="6"`. Archetype A (grid-snapped centre drag) + B (native radius
slider, integer 1–5, `--pos` fill updated).

- **Fixed**: P(3 ; 2) (pt-craie + label), the grid.
- **Controls**: drag Ω (accent point, snapped); radius slider in the pied.
- **Readouts**: ligne 1 — the live equation « (x + 1)² + (y − 1)² = 4 »
  (signs flip into the parentheses; x²/y² when a or b is 0) ; ligne 2 —
  « ΩP² = 4² + 1² = 17 » (negatives parenthesised) ; chips Ω · r (accent)
  · state chip (aria-live): « P est sur le cercle ! » (good) when
  ΩP² = r², plain chips « P est dehors » / « P est dedans » otherwise
  (with the actual comparison values) ; legende narrating the regime and
  nudging the challenge.
- **Reset** (header) → Ω(−1 ; 1), r = 2. Hint on Ω. Keyboard: 2D arrows
  for Ω; the slider is natively accessible for r.

### 4. `geo-diametre` — « Trois angles droits, un cercle » (§5)

Module `assets/js/widgets/geo-diametre.js`, instance
`data-a="-4,-1" data-b="4,5" data-m-init="3,1" data-xdom="-8,8"
data-ydom="-3,7" data-xmin="-10" data-xmax="10" data-ymin="-4"
data-ymax="8.5"`. Archetype A variant with a **discovery-game mechanic**
(replaces the round-based game widget of other chapters — see flag 4).

- **Fixed**: A and B (pt-fixe + labels), dashed segment [AB], the grid.
- **Draggable**: M (accent), snapped; landing on A or B refused.
- **Follows M**: vectors MA⃗ and MB⃗ (accent thin, arrowheads), équerre
  at M when the product is 0, label M pushed away from I.
- **Game state**: each node where MA⃗·MB⃗ = 0 gets a persistent accent
  dot (`trouves` set); at 3 distinct finds the full circle (craie) is
  revealed and stays. Reset clears the trace and hides the circle.
- **Readouts**: ligne — « MA·MB = (−7)×1 + (−2)×4 = −15 » (composed in
  JS) ; chips MA⃗ · MB⃗ · state chip (aria-live): produit > 0 « angle
  aigu » (good) / < 0 « angle obtus » (bad) / = 0 « angle droit ! »
  (accent) — same colour mapping as the produit scalaire chapter ; legende
  (aria-live) = the game narrator (0 found → invitation, 1–2 → count +
  encouragement, ≥ 3 → the payoff sentence naming the circle).
- **Reset** (header) → M(3 ; 1), trace cleared. Hint on M. Keyboard: 2D
  arrows; `aria-valuetext` = M + produit.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (`s2/s3/s4/s5`), 13 questions total (3+3+4+3 — the
4-question quiz is on §4, the richest section), same markup and behaviour
as the other chapters. `data-bonne` spread: 5×position 1, 5×position 2,
3×position 3 (s4 Q4 is a genuine oui/non with 2 answers). Distractors are
the chapter's pièges: the directeur read as normal, the sign-flipped
centre, r² read as r, the vertical distance, « ça ressemble à un cercle ».

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: geo-normale \| geo-projete \| geo-cercle \| geo-diametre \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: reperee` | first interaction, then ≤ 1 / 30 s per widget/quiz |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: reperee` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

`chapitre` read from `<body data-chapitre="reperee">`.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **The whole chapter design is mine**: the phone-map story (l'avenue,
   l'antenne), the normal-vector-first order (équation cartésienne derived
   from n⃗·AM⃗ = 0, presented as the produit scalaire writing geometry),
   projeté in §3, circle in §4, cercle de diamètre as the §5 payoff. The
   2026 annexe was not readable from this environment (see PROGRAMME.md
   « À vérifier ») — scope was taken from PROGRAMME.md's row; if the
   annexe words anything differently (notably whether « distance d'un
   point à une droite » is named as such), the copy may need a touch.
2. **The magic distance formula |ax₀+by₀+c|/√(a²+b²) is deliberately NOT
   taught** — distance is always computed via H (système), which is the
   programme's capacité. The widget displays MH values consistent with it.
   Tell me if you want the formula mentioned as a remark.
3. **Parallèles/perpendiculaires via vecteurs normaux** (s2 PROPRIÉTÉ,
   second paragraph) is a small extension beyond the strict row wording —
   standard in every manual for this chapter, and exercise 03 uses it.
4. **No round-based game widget in this chapter** (the other chapters have
   one, e.g. ps-signe). The JS budget would not fit a fifth module; the
   discovery mechanic of geo-diametre (find 3 right angles → the circle
   reveals itself) carries the game role instead. Flagged as a deliberate
   divergence from the house pattern.
5. **geo-normale's state chip is plain (uncoloured) in the oblique case**,
   accent only for the vertical/horizontal special states; same asymmetry
   in geo-cercle (good on success, plain for dedans/dehors). The
   good/bad semantic pair is reserved for geo-projete (right vs wrong way
   to measure) and geo-diametre (sign of the produit, matching the produit
   scalaire chapter's mapping).
6. **geo-projete shows the « vertical distance » as an explicit rival**
   (grey dashed + chip--bad). It exists to kill piège n°4 (measuring
   vertically); on this d (slope −3/4) the vertical is always 25 % longer.
   If you find the double readout noisy, it can be dropped without
   touching the rest.
7. **Ex 12–13 (intersection droite/cercle, tangente au cercle)** go
   slightly beyond the row's letter — no new theory, pure applications of
   §2 + §4 (substitution and point+normale), and classic bac-style
   material. Ex 13 states the tangent-⊥-radius fact in the énoncé rather
   than assuming it known.
8. **The bac subject** (A(−1 ; 1), B(7 ; 5), C(3 ; 8)) is engineered
   clean: H(5 ; 4), CH = 2√5, AB = 4√5, aire 20, Γ : (x−3)²+(y−3)² = 20,
   C at 25 ≠ 20 (not rectangle), D(−1 ; 5) on Γ (rectangle en D). All
   hand-checked, no calculator needed anywhere.
9. **Exercise numbers all hand-checked**: 02 → 3x + y − 5 = 0, B dessus ·
   03 → x + 2y − 9 = 0 · 04 → 2x − y = 0 · 05 → H(2 ; 3), √5 · 06 = the
   widget's numbers (H(2,72 ; 0,96), 3,8) · 07 → 9 / 8 · 08 → (1 ; 3),
   r 2 · 09 → vide / point (1 ; −1) / cercle (1 ; 2) r 3 · 10 → (x−2)²+
   (y−3)² = 10 both routes · 11 → produit 0 · 12 → (4 ; 6), (4 ; −2),
   tangente en (6 ; 2) · 13 → 3x + 4y − 36 = 0, et x = 6 retrouvée ·
   14 → H(4,4 ; 6,2), 4 km, tangente, corde 6 km.
10. **The next chapter is announced as « La trigonométrie »** (this page's
    footer + a new homepage « bientôt » card under Analyse, circle+radian
    motif). My pick from PROGRAMME.md's remaining rows — rename if your
    roadmap differs (variables aléatoires and statistiques are the other
    candidates).
11. **Homepage renumbering**: the géométrie repérée card takes CHAPITRE 06
    (display order under Géométrie), pushing Les probabilités
    conditionnelles to CHAPITRE 07 — card numbers follow homepage display
    order, as when the second degré shipped.
12. **JS budget: 48,4 KB** first-party unminified on this page (ceiling
    50 KB): 17,2 KB shared (theme, sommaire, corrige, quiz, analytics,
    nabla-graph) + 31,2 KB for the four widget modules. Measured with
    `wc -c`. No room for a fifth widget module.
13. **No CSS change, no cache-bust**: the page ships on `?v=14` like the
    rest of the site; nothing to bump.
14. **Verification**: behavioural checks ran in a headless harness (see
    session summary): drags (pointer), keyboard paths, resets, the
    geo-diametre discovery flow, slider, quiz and corrigé toggles, KaTeX
    render with 0 errors, internal links. **A live two-theme visual pass
    (375 px + desktop) on the real site remains on your checklist.**
15. **« mis à jour juillet 2026 »** hand-maintained, as everywhere.
    Sitemap entry added with lastmod 2026-07-18.
