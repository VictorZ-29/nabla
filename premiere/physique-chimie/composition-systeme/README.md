# Chapitre — La composition d'un système chimique (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Second physique-chimie chapter of the site, placed FIRST in course order
(chapitre 01) because it is the direct prerequisite of « La réaction
chimique et l'avancement », which becomes chapitre 02. No Claude Design
mock exists for it: the page transposes the dérivation design system
(`design-reference/`, `assets/css/*`) to chemistry content, reusing every
block component and widget convention, following the `nabla-topic` skill
(`.claude/skills/nabla-topic/`). Read this file in full before any later
work on the chapter; keep it updated when behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as author,
> starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — vérifié)

« Détermination de la composition du système initial à l'aide de grandeurs
physiques » : masse molaire atomique, masse molaire d'une espèce ;
quantité de matière n = m/M · concentration en quantité de matière
c = n/V, solutions par dissolution et par dilution · volume molaire d'un
gaz, n = V/V_m · absorbance, loi de Beer-Lambert, dosage par étalonnage.
Capacités : déterminer M à partir des masses molaires atomiques ;
déterminer n d'un corps pur pesé ; concevoir/mettre en œuvre dissolution
et dilution ; déterminer n d'un soluté via c et V ; utiliser V_m ;
déterminer une concentration à partir de données d'absorbance.
La mole et N_A (N = n × N_A) sont des rappels de Seconde, traités au §1.
Mesure & incertitudes (transversal) : nod en B.4 du Vers le Bac (écart de
5 % comparé à la précision de la méthode). L'équation d'état des gaz
parfaits, la conductimétrie et le spectre d'absorption quantitatif sont
hors programme de Première — non traités.

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs* the
chapter's one big gesture — turning any measurable quantity (grams,
millilitres, litres of gas, light) into moles — before any formal
definition. Narrative order (concrete hook → picture → manipulation →
formal definition), never to be reordered:

1. **Concrete hook** (§1) — la tirelire à la banque : la machine compte
   les pièces en les pesant (une pièce de 10 centimes = 4,10 g, vrai).
   Le chimiste a le même problème en pire ; son paquet s'appelle la mole
   (rappel Seconde : N = n × N_A). Mission annoncée : compter les
   molécules de colorant d'un verre de menthe à l'eau avec une lampe.
   Static figure = the flagship widget's initial state (four one-mole
   piles, four different masses).
2. **Manipulation, then definition** (§2) — the **pesee** widget: one
   slider drives the *count* n of four piles (eau, aluminium, sel,
   cuivre); same number of entities everywhere, four different masses —
   « la balance ne compte pas ». Only after the gesture come the
   DÉFINITION of M, the central vitrine n = m/M, the méthode and the
   exemple (34,2 g de saccharose → 0,100 mol).
3. **Concentration et dilution** (§3) — the **dilution** widget: pouring
   water into the sirop; n pinned at 0,040 mol (chip), colour fades,
   c = n/V falls. Then DÉFINITION c, pont C_m = c × M (Seconde),
   PROPRIÉTÉ dilution (c₀V₀ = c_fV_f), méthode pipette/fiole, exemple.
4. **Le volume molaire** (§4) — the **matiere-jeu** game (rounds module
   reused from the avancement chapter): four duels « quel échantillon est
   le plus riche ? » that kill, in order, « la balance compte », « le plus
   gros gagne », « le gaz volumineux est riche », and reveal Avogadro
   (1,2 L de H₂ = 1,2 L de O₂). Then PROPRIÉTÉ V_m (24 L·mol⁻¹ pour tous
   les gaz), POURQUOI (un gaz est du vide), the « trois portes » table,
   exemple (ballon d'hélium : 0,50 g).
5. **Doser avec la lumière** (§5) — the **etalonnage** widget: the
   calibration line A = k·c through five étalons; the student drags the
   measured absorbance and the accent guides perform the reading gesture;
   preset « ta mesure : A = 0,54 » → 7,2 µmol/L, the chapter's payoff.
   Then DÉFINITION/PROPRIÉTÉ Beer-Lambert, méthode du dosage, exemple.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = le verre de menthe à l'eau, la promesse du §1
   tenue), Vers le Bac (le diiode d'un antiseptique, Parties A/B).

One story runs through: **le sirop de menthe** — peser le sucre (§2),
allonger le sirop (§3), les bulles du soda (§4, exercices), doser le
colorant (§5, ex 14). The banque/pièces hook of §1 returns in §2's
POURQUOI (le sac de 410 g = 100 pièces). Forward-links to the avancement
chapter: its §5 méthode (grammes → moles → grammes) consumes exactly this
chapter's three conversion formulas; its page now links back here.

## Reference species & datasets (all displayed numbers exact — see flag 4)

No `FONCTIONS` entry (no curves of functions — bars, a straight line and
guides drawn from module-local data).

- **§1 figure & flagship pesee (s2)** : eau (H₂O, M = 18) · aluminium
  (Al, 27) · sel (NaCl, 58,5) · cuivre (Cu, 63,5). Slider n ∈ [0 ; 1,00]
  step 0,10, init 1,00 (the figure's frame). Every mass n × M is exact at
  2 decimals because each M is a multiple of 0,5 and each n of 0,1
  (58,5 × 0,3 = 17,55 ; 63,5 × 0,7 = 44,45…). M values span 18 → 63,5 so
  all four bars stay visible on one linear scale (saccharose's 342 would
  crush it — kept for the exemples and the game instead). SVG 640 × 330,
  scale : 63,5 g = full height (242 px).
- **dilution (s3)** : n = 0,040 mol de saccharose (2,0 mol·L⁻¹ dans la
  dose de 20 mL). Slider V ∈ [20 ; 200] mL step 20. c = 0,040/(V/1000) :
  exact at the landmark stops (20 → 2,0 ; 40 → 1,0 ; 80 → 0,50 ;
  100 → 0,40 ; 160 → 0,25 ; 200 → 0,20), displayed with « ≈ » at the
  four stops where 2 decimals round (60, 120, 140, 180 — e.g. ≈ 0,33).
  Liquid height ∝ V, fill-opacity 0,12 + 0,68 × (c/2,0) — colour from
  tokens, only opacity varies. Preset accent « verser jusqu'à 200 mL »
  animated by `animerValeur` (instant under reduced motion).
- **matiere-jeu (s4)** : ① 9,0 g d'eau (0,50 mol) vs 12,7 g de cuivre
  (0,200 mol) → l'eau ② 50 mL à 0,10 mol/L (0,0050 mol) vs 3,42 g de
  saccharose (0,0100 mol) → la cuillerée ③ ballon 2,4 L de O₂ (0,10 mol)
  vs cuillère 3,6 g d'eau (0,20 mol) → la cuillère ④ 1,2 L de H₂ vs
  1,2 L de O₂ (0,050 mol chacun) → égalité (Avogadro). Réponses
  `[1, 2, 2, 3]`. Le « 24 L » nécessaire aux manches ③④ est donné dans
  la note du widget et le hook — la PROPRIÉTÉ ne vient qu'après le jeu.
- **etalonnage (s5)** : gamme c = 2/4/6/8/10 µmol·L⁻¹, k = 0,075 par
  µmol·L⁻¹ → A = 0,15/0,30/0,45/0,60/0,75 (exacts). Slider A ∈ [0 ; 0,75]
  step 0,03 : le pas de 0,03 en A est un pas de 0,4 en c — tout affichage
  exact. Init A = 0,30 (pile sur l'étalon 2 : caption « pile sur la
  gamme » au chargement). Mesure du sirop A = 0,54 → c = 7,2. View :
  c ∈ [−0,7 ; 11,5], A ∈ [−0,075 ; 0,87], viewBox 640 × 360 ; ligne
  pleine sur la gamme, pointillée au-delà (hors gamme) ; cuve en haut à
  droite dont l'opacité suit c.
- **Exercices** : 0,25 mol → 1,5 × 10²³ (ex 01) · M = 44/342/58,5
  (ex 02) · 9,0/18, 8,1/27, 17,1/342 (ex 03) · 11,7 g ; aspirine
  C₉H₈O₄ M = 180, 0,500 g → ≈ 2,8 mmol (ex 04) · 0,040/0,250 = 0,16
  (ex 05) · soda 0,35 × 1,5 = 0,525 mol → ≈ 180 g ≈ 30 morceaux (ex 06) ·
  90/180 = 0,50 ; 0,10 × 342 = 34,2 (ex 07) · V₀ = 10 mL, F = 10
  (ex 08) · widget rejoué : 0,40 mol/L à 100 mL, 160 mL pour 0,25
  (ex 09) · 6,0/24 = 0,25 mol → 11 g (ex 10) · 2,4 L → 0,10 mol,
  0,40 g He vs 4,4 g CO₂ (ex 11) · tri 0,10/0,075/0,15 mol, m_C = 4,8 g
  (ex 12) · k = 0,075, A = 0,51 → 6,8 ; A = 0,90 hors gamme (ex 13) ·
  sirop dilué 20× : 7,2 → 144 µmol/L, verre 10 mL → 1,44 µmol
  → ≈ 8,7 × 10¹⁷ molécules (ex 14) · bac : M(I₂) = 254, 1,27 g →
  c₀ = 5,0 mmol/L ; étalon 10,0 mL/50,0 mL ; k = 0,26 ; A = 0,39 → 1,5 ;
  ×20 → 0,030 mol/L ; 7,5 mmol → ≈ 1,9 g vs 2,0 g annoncés (écart 5 %).

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. Compter l'invisible | hook prose (la tirelire à la banque, le verre de menthe) · DÉFINITION — NIVEAU SECONDE (la mole, N_A) · mission du chapitre · static figure (les 4 tas d'une mole) — no widget, no new definition |
| `s2` | 2. Mole et masse molaire | **widget pesee** · POURQUOI ? (peser = compter, les pièces) · DÉFINITION (masse molaire) · vitrine --grande (n = m/M) · MÉTHODE (compter par pesée) · EXEMPLE RÉSOLU (le sucre du sirop) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Concentration et dilution | hook (le sirop imbuvable) · **widget dilution** · DÉFINITION (c = n/V) · PROPRIÉTÉ (C_m = c × M) · PROPRIÉTÉ (dilution, c₀V₀ = c_fV_f) · MÉTHODE (préparer une dilution) · EXEMPLE RÉSOLU · À RETENIR · **quiz s3** (4 q.) |
| `s4` | 4. Le volume molaire des gaz | hook (le gaz insaisissable, l'indice des 24 L) · **widget matiere-jeu** (4 manches) · PROPRIÉTÉ (V_m) · POURQUOI ? (un gaz est du vide) · tableau (les trois portes vers la mole) · EXEMPLE RÉSOLU (le ballon d'hélium) · **quiz s4** (3 q.) |
| `s5` | 5. Doser avec la lumière | hook (l'œil qui mesure, le spectrophotomètre) · **widget etalonnage** · PROPRIÉTÉ (Beer-Lambert) · MÉTHODE (dosage par étalonnage) · EXEMPLE RÉSOLU (la grenadine) · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (masse ≠ quantité · C_m vs c · diluer ne retire rien · V_m gaz seulement · les millilitres) |
| `essentiel` | L'essentiel en 5 lignes | MOLE · PESÉE · SOLUTION · GAZ · LUMIÈRE |
| `ex` | Exercices — 15 corrigés | course order : compter par paquets 01 · masse molaire 02 · n = m/M 03 · pesée à rebours 04 · c = n/V 05 · n = c × V 06 · C_m et c 07 · dilution 08 · le graphique rejoué 09 · compter un gaz 10 · Avogadro-Ampère 11 · tri des échantillons 12 · droite d'étalonnage 13 · problème (la menthe à l'eau) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 05 · n2 = 04, 06, 07, 08, 09, 10,
11, 13 · n3 = 12, 14.

### Components introduced by this chapter

- **stoechio-jeu.js generalised** (not forked): the rounds-game module now
  reads three optional data-attributes — `data-nom` (analytics widget
  name), `data-progression` (header word, default MÉLANGE),
  `data-suivant` (next-button word, default « Mélange suivant ») — so the
  avancement instance is byte-for-byte unchanged in behaviour and this
  chapter instantiates the same module as `matiere-jeu`/MANCHE/« Manche
  suivante ». Regression-tested on the avancement page (see flag 16).
- **chapitre.css** (end-of-file banner « Composition d'un système
  (physique-chimie) ») : `.dil-verre` (contour craie du verre et de la
  cuve), `.dil-liquide` (accent, seule l'opacité varie via attribut),
  `.etl-valeur` (valeur accent lue sur les axes), `.chip sup`
  (line-height 0, pendant du garde-fou `sub` existant). Everything else
  reuses `.avc-*` (barres, valeurs, noms, repères — la barre choisie
  passe en `.avc-barre-produit` accent), `.jauge-*` (probas),
  `.feuille-btn`, `.lecture-*`, quiz classes. Colours/strokes from tokens
  only. CSS changed → `?v=8` bumped to `?v=9` on every page in the same
  commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `pesee` — « La balance ne compte pas » (flagship, §2)

Module `assets/js/widgets/pesee.js`, instance `#widget-pesee`,
`data-n-init="1" data-n-max="1"`; species (formule/nom/M) in the figure's
JSON block, `choisie: 3` (le cuivre — the heaviest pile, ties the coins
story).

- **Archetype B** (native slider, keyboard/touch free). Slider = the
  shared count n, min 0, max 1,00, step 0,10; every displayed mass is an
  exact multiple of 0,05 by construction.
- **SVG (640 × 330)**: 4 bars (default craie `.avc-barre-reactif`,
  selected accent `.avc-barre-produit`), mass labels above (`fmtCourt` +
  « g »), dashed `.avc-repere` at each species' one-mole mass (the
  masse molaire made visible — it never moves), formula + everyday name
  below (`texteChimie` / `.avc-candidat`).
- **Species buttons** (`.feuille-btn .js-espece`, everyday names): the
  `.lecture-formule` line unrolls « m(Cu) = n × M = 0,60 × 63,5 =
  38,1 g » (innerHTML with `<sub>`).
- **Entity chip** (accent, aria-live): « N = 1,81 × 10²³ entités — dans
  chaque tas » (mantissa n × 6,02, normalised to 10²² below 1; « N = 0
  entité — les tas sont vides » at n = 0). The « same count everywhere »
  message lives here.
- **Captions**: three static paragraphs (début n = 1 / cours / zéro)
  toggled by `hidden` inside one aria-live wrapper.
- **Reset** (header) → n = 1,00, selection back to cuivre. Keyboard:
  native slider arrows (±0,10/cran), French `aria-valuetext`.

### 2. `dilution` — « Allonge le sirop » (§3)

Module `assets/js/widgets/dilution.js`, instance `#widget-dilution`,
`data-n="0.04" data-v-init="20" data-v-min="20" data-v-max="200"`.

- **Archetype B**, one slider (V, mL). The invariant chip
  « n(sucre) = 0,040 mol — quoi que tu verses » is static accent HTML;
  the c chip (aria-live) and the formula line recompute live.
- **SVG (640 × 330)**: glass (outline `.dil-verre`, open top, rounded
  bottom), liquid rect (height ∝ V, `fill-opacity` ∝ c), graduations
  every 50 mL (`.g-grid` ticks + `.avc-candidat` labels), and a
  concentration gauge on the right (`.jauge-fond`/`.jauge-plein`,
  height ∝ c, value label above).
- **Formula line** rule: « c = n / V = 0,040 / 0,120 ≈ 0,33 mol/L » —
  `=` when the 2-decimal display is exact, `≈` when rounded (computed by
  comparing the parsed display to the true value; `fmtAdaptatif`).
- **Preset accent** « verser jusqu'à la menthe à l'eau (200 mL) »
  (`.js-verser`, in the pied) animates V via `animerValeur` (700 ms,
  instant under reduced motion; a drag stops the animation). Captions
  début (V = 20) / cours / fin (V = 200 — the payoff, forward-references
  §5 via « la couleur suit la concentration »).
- **Reset** (header) → V = 20.

### 3. `matiere-jeu` — « Quel échantillon est le plus riche ? » (§4, game)

Module `assets/js/widgets/stoechio-jeu.js` (shared rounds engine),
instance `data-widget="stoechio-jeu" data-nom="matiere-jeu"
data-progression="MANCHE" data-suivant="Manche suivante"`. Archetype D:
per-round static groups (`.js-manche` = énoncé + 3 buttons), static
per-round explanations (KaTeX renders at load), answers `[1, 2, 2, 3]`
in the JSON block. No SVG — the point is that the eye stops sufficing
and the conversion to moles must take over.

- Rounds graded: ① equal-mass duel (kills « la balance compte » — echoes
  s2 quiz Q3 deliberately, spaced repetition) ② solution vs solid (the
  big glass loses) ③ gas vs liquid (« un gaz est du vide ») ④ gas vs gas
  (Avogadro's equality, revealed by the explanation, formalised just
  below).
- Flow: wrong → mark + disable + tailored relance (« convertis chaque
  échantillon en moles »), retry; right → explanation + « Manche
  suivante (i/4) ▸ »; end → « Terminé : x/4 du premier coup » +
  « ↺ recommencer ». Progress chip « MANCHE 1/4 ». Keyboard/touch free.

### 4. `etalonnage` — « Dose avec la lumière » (§5)

Module `assets/js/widgets/etalonnage.js`, instance `#widget-etalonnage`,
`data-k="0.075" data-a-init="0.3" data-a-max="0.75" data-a-mesure="0.54"`,
étalons `[2, 4, 6, 8, 10]` in the JSON block.

- **Archetype B**, one slider (A, step 0,03 = 0,4 µmol/L in c — exact).
  The slider range [0 ; 0,75] IS the hors-gamme guard: A cannot exceed
  the last étalon (the dashed prolongation + note + ex 13c carry the
  « hors gamme on ne lit plus » lesson).
- **SVG (640 × 360)**: fine grid (1 µmol/L × 0,1), axes, five étalon
  points (`.pt-craie`), calibration line solid on the gamme
  (`.g-courbe` craie), dashed beyond (`.g-guide`); the student's reading
  is accent — dashed guides (0,A)→(c,A)→(c,0), halo + `.pt-point`, live
  A value above the horizontal guide and c value under the axis
  (`.etl-valeur`); a cuve top-right (`.dil-verre`/`.dil-liquide`) whose
  opacity follows c — the colour the instrument actually reads.
- **Readouts**: chips « A = 0,54 » / accent « c = 7,2 µmol/L »
  (aria-live); formula line « c = A / k = 0,54 / 0,075 = 7,2 µmol/L ».
- **Captions** (JS textContent, aria-live): payoff when A = mesure
  (« le dosage est fait — sans compter une seule molécule à la main »),
  « pile sur un point de la gamme » when c lands on an étalon (true at
  load, A = 0,30), hidden otherwise.
- **Preset accent** « ta mesure : le sirop, A = 0,54 » (`.js-mesure`,
  aria-pressed on match) animates A via `animerValeur`. **Reset**
  (header) → A = 0,30.

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+4+3+3 — the 4-question quiz
on §3, the chapter's most confusable section), `data-bonne` spread 5/4/4
over the three positions. Every distractor is a piège from the pièges
section: la division à l'envers (M/m, 24/4,8, C_m/M inversé), « même
masse donc autant », « le soluté n'a pas changé donc c non plus », les
millilitres non convertis (100 mol), « grammes ou moles c'est pareil »,
V_m pour les liquides, « le CO₂ plus riche car plus lourd », « A et c
c'est pareil », « k est universel ».

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: pesee \| dilution \| matiere-jeu \| etalonnage \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: composition` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: composition` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **Chapter position and numbering.** PROGRAMME.md flags this chapter as
   the direct prerequisite of l'avancement, so it ships as **CHAPITRE 01**
   of the physique-chimie row and l'avancement's homepage card was
   renumbered to CHAPITRE 02 (its page content is untouched except one
   cross-link, flag 2). This chapter's footer links forward to
   l'avancement (real link, no « bientôt »). Title from your PROGRAMME
   row, slug `composition-systeme`, analytics key `composition`.
2. **One line of the avancement page edited**: §5's « vu au chapitre sur
   la composition d'un système » now wraps « la composition d'un
   système » in a link to this chapter. No other copy touched there.
3. **The whole chapter design is mine**: la tirelire/banque as hook (the
   4,10 g per 10-centime coin is the real Banque de France spec), « la
   balance ne compte pas » as the flagship's thesis, le sirop de menthe
   as running story, « les trois portes vers la mole » as the s4 table's
   name, the four game duels, and the étalonnage reading gesture. The
   word « porte » for the three conversions is my coinage — check you're
   happy teaching it.
4. **The « ≈ » convention** (deviation from « every displayed number
   exact »): division readouts can't all be exact on a uniform slider.
   Convention adopted: the formula line prints « = » when the rounded
   display equals the true value, « ≈ » otherwise (dilution stops 60,
   120, 140, 180 mL; corrigés 04, 06, 14d and quiz s2 Q3 use ≈ where
   honest). All *landmark* positions (widget init/preset/reset states,
   étalonnage everywhere, pesée everywhere, game everywhere) are exact by
   construction. In chemistry this mirrors real practice, but it is a
   house-rule bend — veto it and I'll re-engineer the steps.
5. **The flagship slider drives n, not m.** Dragging the *count* keeps
   every displayed mass exact (multiplication) and makes M visible as
   « la masse d'une mole » (the dashed repères); the inversion to
   n = m/M then happens in prose + vitrine, motivated by « dans la vraie
   vie tu lis m et tu cherches n ». If you'd rather the student drag the
   mass and watch n respond, the module needs a ≈-display pass instead.
6. **Species set eau/aluminium/sel/cuivre** chosen so all bars share one
   linear scale (M from 18 to 63,5) and all masses land exact; saccharose
   (M = 342) deliberately kept out of the widget (it would crush the
   scale) but starring in the exemple, the game and the exercises. Fer
   avoided everywhere (M = 55,8 — ugly); copper's 12,7 g/63,5 gives the
   game's exact 0,200 mol.
7. **V_m = 24 L·mol⁻¹ « dans les conditions de la salle » (20 °C,
   pression atmosphérique normale)**, stated as ≈ in the PROPRIÉTÉ and
   given as a donnée in every exercise needing it (avancement-chapter
   precedent). The name « loi d'Avogadro-Ampère » appears in the game's
   manche 4 explanation and quiz s4 — the manuals' usual label; cut it if
   you prefer to stay nameless.
8. **µmol·L⁻¹ for the dye** (realistic for colorants, keeps the gamme at
   2–10); k is voiced « 0,075 par µmol·L⁻¹ » to dodge the awkward
   L·µmol⁻¹ unit, and the widget-note phrases the slope as « quand c
   augmente de 1 µmol/L, A augmente de 0,075 ». Check the µ is
   acceptable at this level (the exercise restates 144 µmol/L as
   1,44 × 10⁻⁴ mol·L⁻¹ to anchor it).
9. **Beer-Lambert scope**: conditions (espèce, cuve, longueur d'onde)
   kept qualitative in the PROPRIÉTÉ; the hors-gamme rule is taught
   three times (dashed line + note, MÉTHODE step 3, ex 13c) because it's
   the real-TP reflex. No molar absorption coefficient ε, no l — the
   Première formulation A = k·c only.
10. **stoechio-jeu.js was generalised, not forked** (flag also in
    « Components »): three new optional data-attributes with defaults
    preserving the avancement instance exactly. If you'd rather keep
    modules frozen after ship, say so and I'll split the module in two.
11. **Game manche 1 deliberately repeats s2 quiz Q3's fact pattern**
    (equal masses, eau vs cuivre) — spaced repetition of the chapter's
    piège n°1, with different numbers. Flagging in case it reads as
    accidental duplication to you.
12. **M(I) given as 127 g·mol⁻¹** in the bac (table value 126,9) so that
    1,27 g → exactly 5,0 mmol; manuals round the same way. Aspirine's
    M = 180 is exact with the given table (12/1/16). The sirop's
    13,7 g note is 13,68 rounded; c₀ = 2,0 mol·L⁻¹ sucrose syrup is a
    shade above real syrup (~1,9) — chosen for clean numbers.
13. **Exercise numbers, all machine-checked** (79-assertion script) and
    hand-checked: see « Reference species & datasets » for the full list.
    Ex 09 replays the dilution widget (house habit), ex 12 replays the
    game, ex 14 closes the §1 promise (≈ 8,7 × 10¹⁷ molecules in the
    glass), bac B.4 does the mesure/incertitude nod (5 % vs méthode).
14. **JS budget: 40,5 KB** first-party unminified on this page (ceiling
    50 KB), measured with `wc -c` over the ten modules the page loads.
15. **CSS**: four new rules under the end-of-file banner; `?v=8 → ?v=9`
    bumped on all 7 served pages in the same commit (skill template left
    untouched).
16. **Verified in a real browser** (Playwright + Chromium in the build
    sandbox): 55 behavioural checks pass — pesée (masses, chip N, ligne,
    sélection, clavier, reset, légendes), dilution (=/≈, verser animé,
    opacité, reset), the full game flow (relance, désactivation,
    4 manches, score, recommencer), étalonnage (init sur étalon, mesure,
    clavier, reset, aria-pressed), quiz flow + score, corrigés + bac
    toggle, scroll-spy (aria-current), theme toggle, aria-valuetext FR,
    375 px sans débordement horizontal, tap tactile, reduced-motion
    (verser saute). KaTeX served locally (CDN blocked in sandbox):
    **247 formules, 0 erreurs, 0 vitrines qui débordent** ; regression on
    the avancement page after the module change (MÉLANGE label, flow,
    398 formules, 0 erreurs). Screenshots both themes at 1280 et 375 px.
    **A live pass on the real site (CDN KaTeX, Lighthouse, real touch)
    remains on your checklist.**
17. **One caption fires at load** (étalonnage: « pile sur un point de la
    gamme », because A init = 0,30 sits on étalon 2) — deliberate, it
    teaches the reading before any interaction. Tell me if you'd rather
    the caption zone start empty.
18. **« mis à jour juillet 2026 »** hand-maintained; sitemap lastmod
    2026-07-17 for the three touched URLs (accueil, this page,
    avancement). Homepage motif = the calibration line with craie
    étalons and the accent reading guides (echoes §5).
