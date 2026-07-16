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

- **chapitre.css** (end-of-file banner « Avancement (physique-chimie) ») :
  `.avc-barre-fond/-reactif/-produit` (species bars), `.avc-repere`
  (n₀ ghost line), `.avc-tableau` (live tableau d'avancement),
  `.especes-boutons/.espece-btn` (species selector chips),
  `.g-droite-produit` (ascending product line). Colours/strokes from
  tokens only. CSS changed → `?v=7` bumped to `?v=8` on every page in the
  same commit.
- No change to `nabla-graph.js` (module-local data; helpers reused:
  `el`, `creerVue`, `grilleUnite`, `axes`, `clamp`, `fmt`, `fmtCourt`,
  `animerValeur`).

## Widget instances

(Detailed per-instance specs — fixed/controls/readouts/guards/captions/
reset/keyboard — completed with the build; see the sections below.)

## Review flags for Victor

(Completed at the end of the build — see final section of this file.)
