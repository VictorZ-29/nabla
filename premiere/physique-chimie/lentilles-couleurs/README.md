# Chapitre — Lentilles, images et couleurs (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Seventh physique-chimie chapter of the site, second of the thème 4
« Ondes et signaux » (sous-partie « La lumière : images et couleurs »).
No Claude Design mock exists for it: the page transposes the dérivation
design system (`design-reference/`, `assets/css/*`) to optics content,
reusing every block component and widget convention, following the
`nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file in
full before any later work on the chapter; keep it updated when
behaviour changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as
> author, starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019)

« La lumière : images et couleurs » (thème « Ondes et signaux ») :
relation de conjugaison d'une lentille mince convergente ;
grandissement ; image réelle, image virtuelle, image droite, image
renversée · couleur des objets ; synthèse additive, synthèse
soustractive ; couleurs complémentaires ; absorption, diffusion,
transmission. Capacités : construction graphique de l'image d'un objet
plan réel ; exploiter les relations de conjugaison et de grandissement ;
prévoir le résultat d'une superposition de lumières colorées ou l'effet
d'un ou plusieurs filtres ; interpréter la couleur perçue d'un objet.
Prérequis de Seconde mobilisés : lentille mince convergente, foyers,
distance focale, image réelle d'un objet réel (rappelés au §1).
Hors programme, non traités : la vergence, l'œil et ses défauts
(Seconde / enseignement scientifique), les lentilles divergentes, les
spectres et la dispersion (autre sous-partie, futur chapitre « Le photon
et les spectres »). NOTE : scope pris depuis PROGRAMME.md, dont la ligne
de ce chapitre n'a pas de mention « à vérifier » — mais l'accès au BO
était bloqué depuis la sandbox (cf. PROGRAMME.md § « À vérifier »).

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs*
the chapter's two gestures — sliding an object along an optical bench
and watching the image obey, then mixing lights and predicting colours —
before any formula. Narrative order (concrete hook → picture →
manipulation → formal definition), never to be reordered:

1. **Concrete hook** (§1) — la loupe et la fenêtre : projeter la fenêtre
   sur le mur avec une loupe de cuisine, image nette, en couleurs… et à
   l'envers. Static figure = the flagship widget's exact initial frame
   (objet à −60 cm, lentille f′ = 20 cm, trois rayons, image à +30 cm).
   Rappel de Seconde (lentille, O, F, F′, f′) en bloc « RAPPEL DE
   SECONDE » — see flag 4.
2. **Manipulation, then formalisation** (§2) — the **banc-optique**
   widget: the slider moves the object, the three construction rays and
   the image follow live; the student crosses the focal point and
   watches the image explode, vanish, then flip to virtual (la loupe).
   Only after the gesture come the MÉTHODE (les trois rayons), the
   DÉFINITION (image réelle / virtuelle) and the paper construction
   example.
3. **Les deux formules** (§3) — the same widget in « formule » mode: the
   live line 1/OA′ − 1/OA recomputes at every position and always lands
   on 0,050 = 1/f′ — the invariant is *shown* before the relation is
   named. Then mesures algébriques (DÉFINITION), relation de conjugaison
   (PROPRIÉTÉ, vitrine --grande), grandissement (PROPRIÉTÉ), méthode,
   exemple (le réglage initial du banc recalculé à la main).
4. **Les synthèses** (§4) — the **couleur-synthese** widget: three lamps
   on a black stage (additive) vs three filters on a white screen
   (soustractive), every overlap painted its true colour. Then the
   definitions, couleurs complémentaires, la méthode « choisir la bonne
   synthèse », l'exemple de l'imprimante sans encre rouge.
5. **La couleur des objets** (§5) — the **couleur-jeu** game (4 scenes:
   predict the colour of a maillot under a coloured light) as the
   section's manipulation, then absorption/diffusion/transmission
   (DÉFINITION), le POURQUOI « la couleur n'est pas dans l'objet », la
   méthode en trois étapes, l'exemple du short vert sous magenta.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = le mini-projecteur téléphone + loupe), Vers
   le Bac (Partie A l'appareil photo du téléphone, Partie B les
   projecteurs du concert).

Two stories run through and meet in the bac exercise: **la loupe** (la
fenêtre sur le mur §1, le banc §2–3, le philatéliste ex 06, le Soleil
ex 08, le mini-projecteur ex 14) and **le concert** (les projecteurs
§4, le maillot du guitariste §5 et le jeu, le bac A+B). Prérequis
mobilisés : lentille et foyers (Seconde), proportionnalité, lecture de
signes — rappelés d'une ligne quand ils servent.

## Reference lens & datasets (all displayed numbers exact — see flag 7)

No `FONCTIONS` entry (rays are straight lines — module-local geometry).
Everywhere: **f′ = 20 cm, objet AB = 6,0 cm**, view x ∈ [−75 ; 115] cm,
y ∈ [−24 ; 24] cm, SVG 640 × 300 (échelles x/y différentes, assumées —
les rayons sont calculés en espace maths). Slider OA ∈ [−70 ; −5] cm,
step 1 (integer positions only).

- **Clean landmarks** (integer OA → exact display): −60 → OA′ = +30,
  γ = −0,5 (init & §1 figure) · −40 → +40, γ = −1 · −30 → +60, γ = −2 ·
  −25 → +100, γ = −4 (ex 07) · −10 → −20, γ = +2 (la loupe) · −20 → pas
  d'image. Presets: −60 / −40 / −30 / −10.
- **Conjugation line always exact**: 1/OA′ and 1/OA are displayed with
  3 decimals; for every integer OA in the domain the two roundings
  compensate, so the displayed difference is *always* exactly 0,050
  (proved: the fractional parts of 1000/n and 50−1000/n are
  complementary, and no n in 5…70 gives a .5 tie — verified for the
  whole domain by the harness). OA′/γ readouts use 1/2 decimals with
  = or ≈ chosen by comparing the rounded display to the true value.
- **Guards**: image arrow hidden when OA′ ∉ [−73 ; 112] or |γ·h| > 23
  (caption « explosion » takes over, chips keep counting — honesty over
  clipping, precedent ondes flag 5). OA = −20 → dedicated no-image
  state everywhere (chips, lines, captions, aria-valuetext).
- **Couleurs**: résultats additive `{'': noir, R: rouge, V: vert,
  B: bleu, RV: jaune, RB: magenta, VB: cyan, RVB: blanc}`; soustractive
  `{'': blanc, C: cyan, M: magenta, J: jaune, CM: bleu, CJ: vert,
  MJ: rouge, CMJ: noir}`. Jeu : ① maillot rouge/lumière blanche → rouge
  ② rouge/bleue → noir ③ blanc/cyan → cyan ④ jaune/magenta → rouge ;
  réponses `[2, 3, 1, 3]`.
- **Exercices** : rayons (01) · construction 1/10, −30/f20 → +60, γ=−2
  (02) · natures f′=10 : −30/−15/−6 (03) · f′=12, −36 → +18, γ=−0,5,
  A′B′=−1,5 (04) · écran +36, f′=12 → −18, γ=−2 (05) · loupe f′=5,
  −3 → −7,5, γ=+2,5 (06) · f′=20, −25 → +100, γ=−4, 1,5→−6,0 cm (07) ·
  Soleil → f′=8,0 (08) · vidéoprojecteur f′=20, écran +220 → −22,
  γ=−10 (09) · sous-pixels (10) · jaune puis cyan → vert, magenta →
  rouge (11) · drapeau sous rouge → noir/rouge/rouge (12) · tee-shirt
  magenta : blanche/verte/cyan/magenta (13) · mini-projecteur f′=25,
  mur +150 → −30, γ=−5, 12 cm → 60 cm (14) · bac A : téléphone
  f′=4,0 mm, chanteur à 3,0 m → OA′ ≈ 4,01 mm, γ ≈ −1,3×10⁻³, image
  ≈ 2,4 mm · bac B : R+V+B blanc ; écharpe cyan sous jaune → verte ;
  jean bleu sous jaune → noir.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. L'image sur le mur | hook prose (la loupe, la fenêtre projetée à l'envers ; le téléphone, le vidéoprojecteur) · static figure (le banc au réglage initial) · RAPPEL DE SECONDE (lentille, O, F, F′, f′) — no widget, no new formal definition |
| `s2` | 2. Construis l'image | **widget banc-optique #1** (mode nature) · POURQUOI ? (trois rayons parmi une infinité) · MÉTHODE (construire l'image) · DÉFINITION (image réelle / virtuelle) · EXEMPLE RÉSOLU (construction papier f′=2 cm) · **quiz s2** (3 q.) |
| `s3` | 3. Conjugaison et grandissement | **widget banc-optique #2** (mode formule — l'invariant 0,050) · DÉFINITION (mesures algébriques) · PROPRIÉTÉ + vitrine --grande (conjugaison) · PROPRIÉTÉ (grandissement) · MÉTHODE (trouver l'image par le calcul) · EXEMPLE RÉSOLU (le réglage −60 recalculé) · À RETENIR · **quiz s3** (4 q.) |
| `s4` | 4. Les deux synthèses | hook (les sous-pixels, le concert) · **widget couleur-synthese** (lampes/filtres) · DÉFINITION (les deux synthèses) · PROPRIÉTÉ (couleurs complémentaires) · MÉTHODE (choisir la bonne synthèse) · EXEMPLE RÉSOLU (l'imprimante sans encre rouge) · **quiz s4** (3 q.) |
| `s5` | 5. La couleur des objets | hook (le maillot du guitariste) · **jeu couleur-jeu** (4 scènes) · DÉFINITION (absorption / diffusion / transmission) · POURQUOI ? (la couleur n'est pas dans l'objet) · MÉTHODE (prévoir la couleur perçue) · EXEMPLE RÉSOLU (le short vert sous magenta) · À RETENIR · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (OA positif oublié · γ négatif « donc plus petite » · moitié de lentille cachée · lumières vs peintures · « un objet a une couleur en soi ») |
| `essentiel` | L'essentiel en 5 lignes | RAYONS · CONJUGAISON · GRANDISSEMENT · SYNTHÈSES · COULEUR PERÇUE |
| `ex` | Exercices — 15 corrigés | course order : les trois rayons 01 · construction 02 · nature de l'image 03 · conjugaison 04 · position de l'objet 05 · la loupe 06 · taille de l'image 07 · objet à l'infini 08 · le vidéoprojecteur 09 · synthèse additive 10 · filtres 11 · couleur sous une lumière 12 · composantes 13 · problème (le mini-projecteur) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 08 · n2 = 04, 05, 06, 07, 10,
11, 12 · n3 = 09, 13, 14.

### Components introduced by this chapter

- **tokens.css** : le nuancier « physique » `--lum-*` (rouge, vert,
  bleu, cyan, magenta, jaune, blanc, noir, trace) dans `:root` —
  couleurs de CONTENU (les lampes de la synthèse), identiques dans les
  deux thèmes, jamais utilisées pour du texte. Voir flag 5.
- **chapitre.css** (end-of-file banner « Lentilles, images et
  couleurs ») : `.opt-lentille/.opt-pointe` (la lentille, craie),
  `.opt-tick` (traits des foyers), `.opt-rayon(--virtuel)` (rayons
  accent, pointillés pour les prolongements virtuels),
  `.opt-objet(-pointe)` (flèche objet, craie), `.lum-fond-noir/-blanc`
  (scènes), `.lum-contour` (lampes/filtres éteints), `.lum-<couleur>`
  (fills SVG), `.lum-puce(--<couleur>)` (pastilles HTML),
  `.lum-puce-svg`, `.lum-question` (le « ? » du maillot). L'image du
  banc réutilise `.g-courbe-derivee` + `.vec-pointe--accent` (accent).
  CSS changed → `?v=17` bumped to `?v=18` on every page in the same
  commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `banc-optique` — « Le banc optique » (flagship, §2)

Module `assets/js/widgets/banc-optique.js`, instance `#widget-banc`,
`data-widget="banc-optique" data-nom="banc" data-f="20"
data-hauteur="6" data-oa-init="-60" data-domaine="-70,-5"`.

- **Archetype B** (native slider, keyboard/touch free). Slider = OA,
  min −70, max −5, step 1 ; le JS force les positions entières
  (Math.round), donc tous les jalons propres sont atteignables au
  clavier. `aria-valuetext` français (« OA = −60 centimètres — image à
  OA′ = 30,0 centimètres » / « l'objet est au foyer, pas d'image »).
- **SVG (640 × 300)** : grille verticale tous les 10 cm, axe optique,
  lentille craie (trait + pointes en pixels), foyers F/F′ (ticks +
  étiquettes STIX), étiquettes A/B (craie) et A′/B′ (accent) qui
  suivent leurs flèches. Objet = flèche craie (creerVecteur) ; image =
  flèche accent, **pointillée quand elle est virtuelle** ; trois rayons
  accent fins (par O ; parallèle→F′ ; par F→parallèle — celui-ci
  supprimé quand l'objet est au foyer, il serait vertical) prolongés
  jusqu'au bord droit (ils continuent de se croiser SUR B′) ;
  prolongements virtuels pointillés jusqu'à B′ quand OA > −f.
- **Readouts (mode nature)** : chips « OA′ = 30,0 cm » (accent, = / ≈
  selon exactitude de l'affichage à 1 décimale), « γ = −0,50 » (2
  décimales, = / ≈), chip d'état (aria-live) : « image réelle,
  renversée, réduite/agrandie/même taille » (neutre) / « image
  virtuelle, droite, agrandie » (accent) / « objet au foyer — pas
  d'image » (accent).
- **Captions** (aria-live, statiques, toggled) : réelle (défaut, avec
  l'invitation) / explosion (image hors cadre, les nombres continuent) /
  focale / loupe (payoff virtuel).
- **Presets** `.segmente` (header) : « loin » (−60), « à 2F » (−40),
  « entre 2F et F » (−30), « tout près » (−10), animés par
  `animerValeur` (650 ms, saut direct sous reduced motion),
  `aria-pressed` sur correspondance exacte seulement. **Reset** dans le
  pied (header occupé par les presets, convention divergence #1) →
  OA = −60.

### 2. `banc-optique` — « Une différence qui ne bouge jamais » (§3, config-only reuse)

Instance `#widget-formule`, `data-nom="formule"`, same data otherwise;
presets labelled by value (« −60 » … « −10 »). The page markup carries
two extra hooks the module fills when present:

- `.js-ligne1` (lecture-formule, composée en JS, texte pur) :
  « 1/OA′ − 1/OA = 0,033 − (−0,017) = 0,050 = 1/f′ » — exacte à toute
  position (voir datasets) ; au foyer : « 1/OA′ = 1/f′ + 1/OA = 0,050 +
  (−0,050) = 0 → pas d'image ».
- `.js-ligne2` : « γ = OA′/OA = 30,0 / (−60) = −0,50 » (valeurs
  négatives parenthésées, = / ≈ selon exactitude).
- chips : « 1/f′ = 0,050 cm⁻¹ » (statique, accent) + OA′ + γ + état.
- Captions dédiées : l'invariant (défaut) / la limite près du foyer /
  le zéro au foyer / les signes côté loupe.

### 3. `couleur-synthese` — « Lampes ou filtres » (§4)

Module `assets/js/widgets/couleur-synthese.js`, instance
`#widget-syntheses`, `data-widget="couleur-synthese"
data-nom="syntheses"`.

- **Archetype B/C hybrid** : boutons uniquement (a11y gratuite). Mode
  segmente header « LAMPES / FILTRES » ; 3 toggles `.feuille-btn` par
  mode (aria-pressed), chacun avec sa pastille `.lum-puce`.
- **SVG (640 × 280)** : deux scènes superposées (toggle `display`).
  Additive : rect noir + 3 disques R/V/B (r = 88, centres (320,105),
  (258,188), (382,188)) ; soustractive : rect blanc + disques C/M/J.
  Chaque zone de recouvrement est un VRAI chemin découpé par clipPath
  (disque j clippé par i ; centre = double clip), peinte de sa couleur
  exacte — aucun mode de fusion, aucun dégradé. Lampes/filtres éteints =
  contour pointillé `--lum-trace`. 10 clipPaths au total.
- **Readouts** : ligne composée en JS (texte pur) « lumières rouge +
  verte → jaune » / « lumière blanche − filtre cyan − filtre jaune →
  vert » ; chip accent avec pastille dynamique « on voit : jaune » ;
  2 captions payoff statiques (blanc / noir).
- **États initiaux** : mode LAMPES, rouge seul ; côté FILTRES, cyan
  seul (mémorisé par mode). **Reset** (pied) → les deux états initiaux
  + mode LAMPES.

### 4. `couleur-jeu` — « De quelle couleur est le maillot ? » (§5, jeu)

Module partagé `assets/js/widgets/stoechio-jeu.js` (rounds engine),
instance `#widget-couleur-jeu`, `data-nom="couleur-jeu"
data-progression="SCÈNE" data-suivant="Scène suivante"`, réponses
`[2, 3, 1, 3]` dans le bloc JSON. Archetype D, per-round static groups
(`.js-manche` = scène SVG hand-authored + question + 3 boutons),
explications statiques avec pastille de la couleur-réponse.

- Chaque scène : rect noir, faisceau de projecteur dans la couleur de
  la lampe (chemin plat, tokens `--lum-*`), maillot en contour
  pointillé + « ? » (sa couleur est LA question), et sous la scène la
  pastille-témoin « ce maillot, en lumière blanche » + le nom de la
  lumière (étiquettes mono standard, hors scène pour le contraste AA).
- Flow stoechio-jeu : mauvaise réponse → relance sur-mesure
  (« décompose la lumière en R/V/B… »), retry ; bonne → explication +
  « Scène suivante (i/4) ▸ » ; fin → « Terminé : x/4 du premier coup »
  + « ↺ recommencer ». Progress chip « SCÈNE 1/4 ».

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+4+3+3 — the 4-question quiz
on §3, the chapter's heaviest section), `data-bonne` spread 5/4/4 over
the three positions. Every distractor is a piège from the pièges
section : le +40 sans signe, l'inverse additionné (7,5), γ<0 lu comme
« plus petite », la moitié d'image perdue, le marron de la peinture, le
filtre qui « ajoute » sa couleur, le maillot qui « reste rouge », le
mélange objet+lampe (violet, jaune).

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: banc \| formule \| syntheses \| couleur-jeu \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: lentilles` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: lentilles` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

The two `banc-optique` instances report distinct `widget` props
(`data-nom`: `banc` / `formule`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design
mock, no pre-existing copy, and **no outline validation before
building** (the session ran autonomously). Please read as author.
Specific decisions:

1. **Chapter choice.** PROGRAMME.md left one maths chapter
   (statistiques — explicitly blocked pending the annexe officielle)
   and ten physique-chimie ones. I picked « Lentilles, images et
   couleurs » as the most widget-shaped of the ten (a draggable optical
   bench + real colour mixing) and the natural continuation of thème 4
   after les ondes. Card CHAPITRE 07 on the homepage under « Ondes et
   signaux ».
2. **Reading-chain rewiring.** The energie-mecanique footer promised
   « L'énergie électrique — BIENTÔT »; it now links here instead
   (precedent: ondes flag 1). This page's own footer re-announces
   « L'énergie électrique » BIENTÔT, matching the existing homepage
   bientôt card; I also added a « Le photon et les spectres » bientôt
   card in thème 4. Rewire differently if you'd rather ship l'énergie
   électrique next.
3. **The whole chapter design is mine** : la loupe et la fenêtre as
   hook, « le banc optique » as flagship setting, the two-instance
   trick (geometry in §2, the 0,050 invariant in §3), « lampes ou
   filtres » as the synthesis scene, le concert (guitariste/maillots)
   as the colour story, and the game's four scenes. Check especially
   the s3 framing « une différence qui ne bouge jamais » — the student
   sees the invariant before the relation is named.
4. **§1's closing block is « RAPPEL DE SECONDE »**, not a DÉFINITION —
   the lens vocabulary (O, F, F′, f′) is Seconde material, and the
   narrative law forbids a *new* definition in §1. The bloc-definition
   component is reused with a different tag text; flag if you'd rather
   keep the DÉFINITION label.
5. **Physical colour tokens.** The synthesis widgets need real
   red/green/blue/…: I added a `--lum-*` palette to tokens.css
   (content colours, identical in both themes, never used for text —
   labels sit outside the black/white stages to keep AA contrast).
   Values are my choice (#E23B3B, #35A853, #3563E9, #2BB8C9, #C93BC0,
   #E9C53B, #F5F2E9, #101010, trace #8A8677) — adjust to taste, one
   place to edit. This bends the letter of « tokens are derived from
   the design handoff » while keeping its spirit (zero hardcoded
   colours outside tokens.css).
6. **Sign conventions & notation.** I teach the relation as
   1/OA′ − 1/OA = 1/f′ with overlines in KaTeX (\overline{OA}) and
   plain « OA » in chips/JS lines (plain-text idiom). Mesures
   algébriques get their own DÉFINITION and the pièges lead. If your
   classes use the 1/OA′ = 1/OA + 1/f′ variant or the vergence, say so.
7. **Number-exactness policy** (house rule, precedent ondes flag 9):
   settings are integers; OA′ and γ are displayed at 1–2 decimals with
   = or ≈ chosen by comparing the display to the true value; the
   3-decimal conjugation line is provably exact at every position (the
   two roundings always compensate — no .5 tie exists in the domain;
   verified exhaustively by the harness). The bac's ≈ values
   (4,01 mm ; −1,3×10⁻³ ; 2,4 mm) round honestly.
8. **The image explodes off-frame near F** (OA ∈ [−24;−21] and
   [−19;−15]) : the arrow hides, an « explosion » caption narrates, and
   the chips keep counting (OA′ = 220 cm…). Same honesty-over-clipping
   choice as the ondes rope; tell me if you'd rather clamp the slider
   away from F.
9. **The ray-through-F is dropped when the object sits exactly on F**
   (it would be vertical); the two remaining rays exit parallel, and
   the caption says why there is no image. Physically standard, but
   worth a glance in the browser.
10. **Non-square scales** : the bench SVG stretches y (×1,9 vs x) so a
    6 cm object stays readable across a 190 cm axis — textbook practice,
    but angles are therefore not true; rays are computed in maths space
    so all intersections are exact. The lens arrowheads and vector
    heads are sized in pixels to stay undistorted.
11. **Games and quizzes reuse existing misconception distractors**;
    game scene SVGs put the shirt as a dashed « ? » silhouette (its
    colour IS the question) with a white-on-black « ? » glyph
    (.lum-question — always on the black stage, theme-safe). The
    two-theme visual pass on these scenes is on your checklist.
12. **Exercise set is fully mine** ; ex 09 (vidéoprojecteur) is the
    only n3 before the colours block — it deliberately chains 05+07.
    Ex 14's projector build is real DIY physics (f′ = 25 cm loupe);
    the two réglages in c. (retourner le téléphone, éteindre la pièce —
    surface ×25) are qualitative by design.
13. **JS budget : 39,3 KB** first-party unminified on this page
    (ceiling 50 KB), measured with `wc -c` over the nine modules the
    page loads (theme, sommaire, corrige, quiz, analytics, nabla-graph,
    stoechio-jeu, banc-optique, couleur-synthese).
14. **Verified headless (jsdom harness, 56 checks pass)** — the sandbox
    has no browser: the harness drives both banc instances (init state,
    −40 « même taille », focal no-image state, loupe −20/γ=+2, hors-
    cadre à −22, preset animation + aria-pressed, reset, the
    conjugation line's exactness at ALL 66 slider positions, the
    instantiated γ line), couleur-synthese (R→R+V jaune→blanc payoff,
    V+B cyan, filtres cyan/vert/noir payoff, chip, reset, 10 clipPaths),
    the full game flow (wrong→relance, 4 scenes, 3/4 score,
    recommencer), quiz flow, corrigé + bac toggles, page structure
    (1 h1, 8 sections, 14+1 exercices, 13 questions 3+4+3+3 with
    data-bonne spread 5/4/4, 5 pièges, 5 essentiel lines, 9 sommaire
    links), no ↗/↘, « widget » absent from prose, nbsp before
    punctuation and inside guillemets. All 94 KaTeX formulas render
    with 0 errors (katex npm); the KaTeX onload snippet is
    byte-identical to the ondes page's; every internal link and anchor
    on the three touched pages resolves. **The two-theme visual pass,
    real touch, 375 px layout (the 4-button segmente wraps under the
    title — check it), and Lighthouse remain on your checklist.**
15. **« mis à jour juillet 2026 »** hand-maintained; sitemap lastmod
    2026-07-22 (this page, accueil, énergie mécanique). Homepage motif =
    mini banc optique (axe pointillé, lentille à double pointe, objet
    debout, deux rayons accent croisés sur l'image renversée, point
    accent sur B′).
