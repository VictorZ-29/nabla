# Chapitre — La réaction chimique et l'avancement (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
First physique-chimie chapter of the site. No Claude Design mock exists for
it: the page transposes the dérivation design system (`design-reference/`,
`assets/css/*`) to chemistry content, reusing every block component and
widget convention, following the `nabla-topic` skill
(`.claude/skills/nabla-topic/`). Read this file in full before any later
work on the chapter; keep it updated when behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as author,
> starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — vérifié)

« Suivi et modélisation de l'évolution d'un système chimique » :
évolution des quantités de matière lors d'une transformation · état
initial, notion d'avancement (mol), tableau d'avancement, réactif
limitant, état final · avancement final, avancement maximal ·
transformations totale et non totale · mélanges stœchiométriques.
Capacités : établir le tableau d'avancement à partir de l'équation et des
quantités initiales ; déterminer la composition de l'état final pour une
transformation considérée comme totale ; déterminer l'avancement final à
partir de la description de l'état final et le comparer à l'avancement
maximal. Capacité mathématique : la proportionnalité. Écrire/ajuster une
équation est une révision de Seconde (traitée au §1). Le taux
d'avancement, l'avancement volumique et les équilibres sont Terminale —
la « transformation non totale » n'apparaît ici que qualitativement
(§5 + exercice 13), comme le programme le permet. La capacité numérique
Python (composition de l'état final par programme) n'est pas traitée sur
la page — hors format Nabla (flag 14).

## Purpose & narrative through-line

Replace the static PDF fiche on l'avancement with a page where the student
*performs* the chapter's one big gesture — pushing the avancement x forward
with their own hand and watching the quantities of matter respond — before
any formal definition. Narrative order (concrete hook → picture →
manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — la soirée crêpes : une recette (2 œufs +
   250 g de farine + 50 cL de lait → 8 crêpes), un placard qui n'a pas les
   ingrédients dans les bonnes proportions, et la question « combien de
   fournées avant la panne ? ». L'équation de réaction est présentée comme
   la recette de la chimie (révision Seconde : nombres stœchiométriques =
   proportions, conservation des éléments, ajustement). Static figure =
   the flagship widget's initial state (four species bars at x = 0).
2. **Manipulation, then definition** (§2) — the **avancement** widget:
   la combustion du méthane de la gazinière (CH₄ + 2 O₂ → CO₂ + 2 H₂O),
   a slider on x drives four bars and a LIVE tableau d'avancement; only
   after the gesture come the DÉFINITION of x (mol), the central formulas
   n = n₀ − a·x / n₀ + b·x, the tableau d'avancement and its méthode.
3. **Le réactif limitant** (§3) — the **limitant** widget: les réservoirs
   d'une fusée (2 H₂ + O₂ → 2 H₂O), n(x) lines racing down to zero, two
   sliders on the initial amounts; then DÉFINITION (limitant, x_max),
   méthode des candidats (n₀ − coef·x = 0, le plus petit x gagne).
4. **Le mélange stœchiométrique** (§4) — the **stoechio-jeu** game
   (4 manches « qui s'épuise en premier ? », one being stœchiométrique,
   one a close race that the eye can't call); then the PROPRIÉTÉ
   n₁/a = n₂/b and the méthode (vérifier / rendre stœchiométrique).
5. **Le bilan de matière** (§5) — the **avancement** widget again,
   config-only (combustion de l'éthanol dans une cheminée d'appoint),
   masses displayed under the moles and a live Lavoisier chip (total mass
   constant at 33,2 g); transformation totale (x_f = x_max, non-totale
   qualitative); MÉTHODE grammes → moles → tableau → moles → grammes.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = l'airbag), Vers le Bac (Partie A synthèse de
   l'ammoniac, Partie B le bus à hydrogène).

One story runs through: la cuisine. La recette des crêpes (§1) revient au
§2 (« x compte les fournées »), au §4 (« la recette sans restes ») et au
§5 (« la balance ne compte pas en fournées ») ; la gazinière du §2 est
celle de la soirée crêpes. Prérequis mobilisés : quantité de matière,
n = m/M, c = n/V et V_m (chapitre « composition d'un système » fait en
classe avant celui-ci) — rappelés d'une ligne quand ils servent.

## Reference reactions & datasets (all numbers land clean)

No `FONCTIONS` entry (no curves of functions — bar charts and straight
lines drawn from module-local data).

- **§1 figure & flagship avancement (s2)** : CH₄ + 2 O₂ → CO₂ + 2 H₂O,
  n₀ = 0,60 / 1,00 / 0 / 0 mol. Slider x ∈ [0 ; 0,50] step 0,05 (every
  displayed n is a clean 2-décimales multiple of 0,05). x_max = 0,50 —
  **O₂ runs out first although it is the bigger pile** (1,00 > 0,60):
  deliberately feeds piège n°1 before §3 names it. État final :
  0,10 / 0 / 0,50 / 1,00 mol. SVG bars viewBox 640 × 330, n-scale
  220 px per mol.
- **limitant (s3)** : 2 H₂ + O₂ → 2 H₂O. Sliders n₀(H₂) ∈ [0,20 ; 2,00]
  step 0,10 and n₀(O₂) ∈ [0,10 ; 1,00] step 0,05 ; init 1,20 / 0,40
  (O₂ limitant, 0,40 mol de H₂ restant). Candidates x = n₀(H₂)/2 and
  x = n₀(O₂) are exact multiples of 0,05. Stœchiométrie reachable on many
  settings (n(H₂) = 2 n(O₂)), e.g. 0,80/0,40. Graph: x ∈ [0 ; 1,1],
  n ∈ [0 ; 2,1], viewBox 640 × 360.
- **stoechio-jeu (s4)** : ① Fe + S → FeS, 0,25/0,20 → S limitant
  (coefficients égaux : le plus petit tas limite — le raccourci marche
  encore) ② CH₄ + 2 O₂, 0,30/0,50 → O₂ limitant (0,30 vs 0,25 — le
  raccourci meurt) ③ N₂ + 3 H₂ → 2 NH₃, 0,20/0,60 → stœchiométrique
  (0,20 = 0,20) ④ C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O, 0,08/0,45 → propane
  limitant (0,08 vs 0,09 : la photo-finish, l'œil ne suffit plus).
- **avancement #2 (s5)** : C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O,
  n₀ = 0,20 / 0,75 mol ; M = 46 / 32 / 44 / 18 g·mol⁻¹. Slider x ∈
  [0 ; 0,20] step 0,05. Éthanol limitant (0,20 < 0,25). Toutes les masses
  affichées sont exactes à une décimale (9,2/6,9/4,6/2,3/0 g …) et la
  masse totale vaut 33,2 g pour tout x (chip Lavoisier vivant).
- **Exercices** : Al (5,4 g → 0,20 mol) + O₂ 0,12 mol → x_max 0,04,
  m(Al₂O₃) = 8,16 g (ex 11) · CaCO₃ 2,0 g + HCl 0,030 mol → HCl limitant,
  V(CO₂) = 360 mL avec V_m = 24 L·mol⁻¹ (ex 12) · NH₃ état final
  0,30 mol sans H₂ ni annulation (ex 13, transformation non totale) ·
  airbag 2 NaN₃ → 2 Na + 3 N₂, 72 L de N₂ → m(NaN₃) = 130 g (ex 14) ·
  bac A : N₂ 0,40 + H₂ 0,90 → H₂ limitant, x_max 0,30 · bac B : bus à
  hydrogène, 5,0 kg de H₂ → 2 500 mol, O₂ 1 250 mol, V(air) = 150 m³,
  m(H₂O) = 45 kg.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La recette de cuisine | hook prose (la soirée crêpes) · tableau (la recette et le placard) · DÉFINITION niveau Seconde (équation de réaction, nombres stœchiométriques) · MÉTHODE (ajuster une équation — révision Seconde, voir flag 4) · static figure (les 4 barres à l'état initial) — no widget, no new definition |
| `s2` | 2. L'avancement x | **widget avancement** (gazinière) · POURQUOI ? (x = le compteur de fournées) · DÉFINITION (avancement) · vitrine --grande (n₀ − a x / n₀ + b x) · tableau d'avancement générique (.tableau) · MÉTHODE (établir un tableau) · EXEMPLE RÉSOLU (N₂ + 3 H₂) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le réactif limitant | hook (les réservoirs de la fusée) · **widget limitant** · DÉFINITION (limitant, x_max) · POURQUOI ? (pourquoi le min des candidats) · MÉTHODE (déterminer le limitant) · EXEMPLE RÉSOLU · **quiz s3** (4 q.) |
| `s4` | 4. Le mélange stœchiométrique | hook (la recette sans restes) · **widget stoechio-jeu** (4 manches) · DÉFINITION + PROPRIÉTÉ (n₁/a = n₂/b) · MÉTHODE (vérifier / rendre stœchiométrique) · EXEMPLE RÉSOLU · **quiz s4** (3 q.) |
| `s5` | 5. Le bilan de matière | hook (la balance pèse des grammes) · **widget avancement #2** (éthanol, masses, Lavoisier) · PROPRIÉTÉ (transformation totale : x_f = x_max ; non totale qualitative) · MÉTHODE (le bilan complet) · EXEMPLE RÉSOLU · À RETENIR · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (le plus petit tas · coefficients oubliés dans le tableau · l'équation ne donne pas les quantités · x n'est pas n(produit) · comparer des grammes) |
| `essentiel` | L'essentiel en 5 lignes | AVANCEMENT · TABLEAU · LIMITANT · STŒCHIOMÉTRIE · BILAN |
| `ex` | Exercices — 15 corrigés | course order : ajuster 01 · la recette 02 · tableau à compléter 03 · expressions n(x) 04 · limitant 05 · limitant contre-intuitif 06 · état final complet 07 · stœchiométrique ? 08 · le graphique rejoué 09 · lecture d'expressions 10 · bilan masses 11 · détartrage + volume 12 · état final → quantités initiales (non totale) 13 · problème (l'airbag) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 10 · n2 = 04, 05, 06, 07, 08, 09,
11 · n3 = 12, 13, 14.

### Components introduced by this chapter

- **nabla-graph.js**: one exported helper, `texteChimie(parent, formule,
  attrs)` — SVG `<text>` whose digits following a letter become subscripts
  (smaller `tspan`, `dy` shifted, cumulative-dy tracked). No Unicode
  subscript characters anywhere (font coverage is unreliable); in HTML the
  same job is done with `<sub>` (static markup, and `innerHTML` for
  JS-composed readouts — precedent: depistage.js).
- **chapitre.css** (end-of-file banner « Avancement (physique-chimie) ») :
  `.avc-barre-reactif` (chip fill + chalk stroke) / `.avc-barre-produit`
  (accTint2 + accent) — same craie/accent role split as courbe/tangente ;
  `.avc-repere` (n₀ dashed ghost), `.avc-fleche(-pointe)` (drawn reaction
  arrow — no glyph), `.avc-valeur`, `.avc-nom(--accent)`, `.avc-candidat`,
  `.avc-impossible` (SVG text styles) ; `.avc-tableau` (live tableau
  d'avancement, mono, `overflow-x: auto`, accent `.ligne-vive`) ;
  `.especes-boutons` (row) — the buttons themselves reuse `.feuille-btn` ;
  a `sub { line-height: 0 }` guard for chips/buttons/readouts ; and a
  shared-component fix, `.tableau .defile { position: relative }` (see
  flag 9). Colours/strokes from tokens only. CSS changed → `?v=7` bumped
  to `?v=8` on every page in the same commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `avancement` — « Fais avancer la réaction » (flagship, §2)

Module `assets/js/widgets/avancement.js`, instance `#widget-avancement`,
`data-nom="avancement" data-x-init="0" data-x-max="0.5" data-echelle="1"`;
species (formule/coef/role/n₀) in the figure's JSON block, `choisie: 1`
(O₂ selected at load — the coefficient-2 species is the teaching point).

- **Archetype B** (native slider, keyboard/touch free). Slider = the
  avancement x, min 0, max 0,50 = x_max, step 0,05 — **the guard against
  negative quantities is the slider range itself**; every displayed n is
  an exact multiple of 0,05.
- **SVG (640 × 330)**: 4 bars (reactants craie-outline, products accent),
  value labels above each bar, `texteChimie` names below (coefficient
  prefixed: « 2 O₂ »), dashed n₀ ghost lines on reactants, drawn arrow
  between the reactant and product groups. Static décor once; `rendre()`
  only updates y/height/textContent, ≤ 1 render per frame (rAF-coalesced).
- **Live tableau d'avancement** (`.avc-tableau`): rows état initial
  (static) · expressions littérales (static, true minus U+2212) · « ici :
  x = … » (live accent row). This IS the lesson artifact.
- **Species buttons** (`.feuille-btn .js-espece`, aria-pressed): the
  `.lecture-formule` line unrolls the selected computation —
  « n(O₂) = 1,00 − 2 × 0,25 = 0,50 mol » (innerHTML with `<sub>`).
- **State chip** (aria-live): x = 0 « état initial » (accent) / « la
  réaction avance » (neutral) / « O₂ épuisé — état final » (bad) — the
  exhausted reactant computed as min(n₀/coef), i.e. O₂ although it is the
  BIGGER pile (feeds piège 1 before §3 names it).
- **Captions**: three static `.widget-legende` paragraphs (début/cours/fin)
  toggled by `hidden` inside one aria-live wrapper (univers.js doctrine —
  KaTeX/`<sub>` safe). The « fin » caption forward-references §3.
- **Reset** (header) → x = 0, selection back to O₂. Keyboard: native
  slider arrows (±0,05/cran). `aria-valuetext` in French.

### 2. `avancement` — « Le bilan, en moles et en grammes » (§5, config-only reuse)

Instance `#widget-bilan`, `data-nom="bilan" data-x-max="0.2"
data-echelle="0.75"`, éthanol config with `M` per species — the presence
of `M` on every species switches the module into masses mode:

- extra live table row « en grammes (m = n × M) » (1 decimal, exact at
  every step by dataset construction) and a second formula line
  « m(CO₂) = 0,40 × 44 = 17,6 g » for the selected species;
- live « masse totale » chip recomputed each frame — the Lavoisier
  invariant is *shown* (33,2 g at every x), never asserted;
- `choisie: 2` (CO₂) so the mass line demonstrates a product growing.
- Éthanol is the limiting reagent (0,20 < 0,25) — the SMALLER pile this
  time, balancing §2's counter-example.

### 3. `limitant` — « La course vers zéro » (§3)

Module `assets/js/widgets/limitant.js`, instance
`data-h2-init="1.2" data-o2-init="0.4"`. Archetype B, two sliders.

- **SVG (640 × 360)**: view x ∈ [−0,06 ; 1,16], n ∈ [−0,45 ; 2,25],
  custom fine grid (0,2 in x, 0,5 in n), axes through 0, labels « x (mol) »
  / « n (mol) ». Three n(x) lines drawn **solid on [0 ; x_max] only**
  (H₂ and O₂ craie, H₂O accent), then dashed ghost prolongations past
  x_max — the losing reactant's ghost dives below the axis into the
  « n < 0 : impossible » corner label: negative stocks are the visual
  proof of « le plus petit candidat gagne ».
- **Candidates on the axis**: a dot per reactant at its n₀/coef (winner =
  accent `pt-point` r 5,5, loser = `pt-fixe--surface` r 4,5, both accent
  at stœchiométrie), value labels under the axis (staggered when closer
  than 0,12), vertical accent guide at x_max.
- **Sliders**: n₀(H₂) ∈ [0,20 ; 2,00] step 0,10 ; n₀(O₂) ∈ [0,10 ; 1,00]
  step 0,05 (candidates always exact multiples of 0,05; slider values
  rounded to 2 decimals before compute, stœchio compare at ε = 10⁻⁶).
- **Readouts**: two candidate chips ; state chip (aria-live) « limitant :
  O₂ — le premier à zéro » (bad) / « mélange stœchiométrique » (good) ;
  formula line « x_max = 0,40 mol → il reste 0,40 mol de H₂ · il s'est
  formé 0,80 mol de H₂O » ; JS-composed caption narrating the regime
  (words only, no formulas — textContent-safe). The stœchio caption
  congratulates the challenge from the prose (« fais atterrir les deux
  droites ensemble ») and forward-references §4.
- **Reset** (header) → 1,20 / 0,40.

### 4. `stoechio-jeu` — « Qui s'épuise en premier ? » (§4, game)

Module `assets/js/widgets/stoechio-jeu.js`. Archetype D, exp-courbes
pattern: per-round static groups (`.js-manche` = énoncé + 3 buttons),
static per-round explanations (KaTeX renders at load), answers key
`[2, 2, 3, 1]` in the JSON block. No SVG — the whole point of the game is
that the eye stops sufficing and the candidate calculation must take over.

- Rounds graded: ① Fe + S (equal coefficients — the small-pile shortcut
  still works, and the explanation says it's the last time) ② CH₄ + 2 O₂
  (echo of §2 — the shortcut dies) ③ N₂ + 3 H₂ stœchiométrique ④
  C₃H₈ + 5 O₂ photo-finish 0,08 vs 0,09.
- Flow: wrong → mark + disable + tailored relance (« calcule les deux
  candidats »), retry; right → explanation + « Mélange suivant (i/4) ▸ »;
  end → « Terminé : x/4 du premier coup » + « ↺ recommencer ». Progress
  chip « MÉLANGE 1/4 ». Keyboard/touch free (buttons only).

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+4+3+3 — the 4-question quiz
on §3, the chapter's richest section), `data-bonne` spread 5/4/4 over the
three positions. Every distractor is a piège from the pièges section:
x = quantité de produit, coefficient oublié (0,80), le plus petit tas,
« autant de chaque » = stœchiométrique, totale = tout consommé, comparer
des grammes, la masse qui « diminue » quand un gaz s'échappe.

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: avancement \| bilan \| limitant \| stoechio-jeu \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: avancement` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: avancement` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

The two `avancement` instances report distinct `widget` props
(`data-nom`: `avancement` / `bilan`) so the launch question « do students
manipulate? » can tell them apart.

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **Title and slug.** Your homepage « bientôt » card said « Transformation
   chimique et avancement »; the request said « réaction chimique et
   avancement ». I titled the chapter **« La réaction chimique et
   l'avancement »** and used the transformation/réaction distinction as
   course content (§1: la transformation est le phénomène, la réaction le
   modèle). Slug `reaction-avancement`, analytics key `avancement`.
   Rename if you prefer the bientôt wording.
2. **The whole chapter design is mine**: the crêpes recipe as the running
   story, « x = le compteur de fournées », the candidates method
   (n₀/coef, « le plus petit gagne ») taught as THE limitant method, the
   n(x)-lines graph in §3 with dashed « impossible » prolongations, the
   grams→moles→grams chain as §5. The word « candidat » is my coinage for
   n₀/coef — manuals say « hypothèse » or nothing; check you're happy
   teaching it.
3. **§1 contains a MÉTHODE block** (ajuster une équation) — a deviation
   from the house anatomy (s1 normally has no méthode). It's Seconde
   revision and an explicit Première capacité, so I kept it in the hook
   section rather than delaying it. Also §1's DÉFINITION is tagged
   « DÉFINITION — NIVEAU SECONDE » (new tag wording).
4. **Flagship dataset is deliberately counter-intuitive**: 1,00 mol of O₂
   (the bigger pile) runs out before 0,60 mol of CH₄, *before* the
   limitant concept is named — §2's caption plants it, §3 names it, piège
   1 nails it, ex 06 and the game replay it. This is the chapter's main
   misconception kill.
5. **The slider IS the guard**: in both `avancement` instances the slider
   max equals x_max, so negative quantities are unreachable; the « why
   can't I go further » story is carried by the fin caption (§2) and by
   the §3 graph's below-zero ghosts. An alternative (slider overshooting
   with a clamp) felt more confusing than instructive.
6. **Transformation non totale**: the programme lists « transformations
   totale et non totale » and « avancement final » — I kept the course
   PROPRIÉTÉ (§5) qualitative (x_f = x_max for totale; non-totale =
   Terminale teaser) and put the quantitative capacité (x_f from the état
   final, compare to x_max) in exercise 13 only. Check the weight feels
   right.
7. **Chemistry notation**: formulas in KaTeX `\mathrm{}` in prose/maths;
   `<sub>` in HTML labels/buttons/tables; `texteChimie` tspans in SVG —
   **no Unicode subscript characters anywhere** (font coverage). Molar
   masses written « 46 g·mol⁻¹ » (middle dot + superscript minus-one, nbsp
   before the unit). Vm = 24 L·mol⁻¹ given in every exercise that needs it.
8. **Reactions chosen**: méthane (gazinière — links the crêpes story),
   2 H₂ + O₂ (fusée §3, bus à hydrogène bac B), N₂ + 3 H₂ (exemples, ex 08,
   ex 13, bac A), éthanol (cheminée §5), Fe + S / C₃H₈ (game), Mg (ex 11,
   the TP ribbon), CaCO₃ + HCl (ex 12 détartrant — the only ionic-ish
   equation, written molecular as detartrant labels do), NaN₃ airbag
   (ex 14, with the honest aside about metallic sodium). No redox
   vocabulary is used anywhere (separate chapter).
9. **Shared-component fix in chapitre.css**: KaTeX's absolutely-positioned
   MathML copy inside a `.tableau` cell escaped the (non-positioned)
   `.defile` scroll wrapper and widened the page by 57 px at 375 px.
   `.tableau .defile { position: relative }` pins it — this affects the
   maths chapters' tables too (no visual change expected, but worth a
   glance at the dérivation tables after deploy).
10. **Buttons reuse `.feuille-btn`** (probas arbre style) for the species
    selectors — chemistry markup uses the probas class directly rather
    than forking it (« reuse, never fork »). Flagging in case you'd rather
    have a renamed alias.
11. **Exercise numbers, all hand-checked**: ex 01 (5 O₂/3 CO₂/4 H₂O ·
    4-3-2 · 1-3-2) · ex 04 x = 0,20 → HCl 0,40 · ex 05 x_max 0,20, reste
    0,10 H₂ · ex 06 equal piles 0,60/0,60 → Al limitant (0,15 < 0,20) ·
    ex 07 propane: reste 0,20 O₂, 0,60 CO₂, 0,80 H₂O · ex 08 stœchio
    0,40/1,20, then +0,20 N₂ → H₂ limitant, add 0,60 H₂ · ex 09 = the
    widget's init (O₂ limitant, x_max 0,40) · ex 10 reverse-reads
    3 A + B → 2 C, x_max 0,15 · ex 11 Mg 4,8 g: O₂ limitant, 2,4 g Mg +
    4,0 g MgO = 6,4 g conserved · ex 12 HCl limitant (0,015 < 0,020),
    V(CO₂) = 0,36 L, 0,5 g de tartre restant · ex 13 x_f = 0,10 <
    x_max = 0,15 → non totale · ex 14 airbag 72 L → x = 1,0 → 130 g NaN₃
    (M = 65) · bac A x_max 0,30, 10,2 g NH₃, 1,20 mol H₂ stœchio · bac B
    2 500 mol H₂, 150 m³ d'air, 45 kg d'eau.
12. **JS budget: 38,8 KB** first-party unminified on this page (ceiling
    50 KB), measured with `wc -c` — the lightest chapter so far.
13. **Verified in a real browser** (Playwright + Chromium in the build
    sandbox): 52 behavioural checks pass — both `avancement` instances
    (cells, masses, Lavoisier chip, captions, species buttons, keyboard,
    reset), limitant (candidates, stœchio detection, reset), the full
    game flow, quiz flow, corrigés + bac toggle, scroll-spy
    (aria-current), theme toggle, all internal links, no horizontal
    overflow at 375 px, touch taps (slider + buttons) in a mobile
    emulated context, reduced-motion context. KaTeX served locally
    (398 formulas, 0 errors — CDN blocked in the sandbox). Screenshots
    taken in both themes at 375/1100/1280 px. **A live pass on the real
    site (CDN KaTeX, Lighthouse, real touch) remains on your checklist.**
14. **Capacité numérique Python** (déterminer l'état final par programme)
    is not on the page — out of Nabla's format. If you want it, a small
    « pour aller plus loin » exercise could show the 5-line loop.
15. **The next chapter is announced as « Mouvement et deuxième loi de
    Newton »** (this page's footer) — picked because it's the first
    remaining « bientôt » card in your physique-chimie row. Rename if
    your roadmap differs. « mis à jour juillet 2026 » hand-maintained;
    sitemap lastmod 2026-07-16.
