# Chapitre — Les ondes mécaniques (Première · Spé Physique-Chimie)

Spec of this chapter's content structure, widgets and configuration.
Third physique-chimie chapter of the site, first of the thème 4 « Ondes et
signaux ». No Claude Design mock exists for it: the page transposes the
dérivation design system (`design-reference/`, `assets/css/*`) to physics
content, reusing every block component and widget convention, following
the `nabla-topic` skill (`.claude/skills/nabla-topic/`). Read this file in
full before any later work on the chapter; keep it updated when behaviour
changes.

> **Built without Victor in the loop** (autonomous session): the outline
> below was NOT validated before building — read the whole page as author,
> starting with the review flags at the bottom.

## Programme scope (BO spécial n°1, 22-01-2019 — vérifié)

« Ondes mécaniques » (thème « Ondes et signaux ») : ondes mécaniques
progressives, grandeurs physiques associées, retard · ondes mécaniques
progressives périodiques, ondes sinusoïdales, période, longueur d'onde,
relation entre période, longueur d'onde et célérité. Capacités : décrire
la propagation d'une perturbation mécanique d'un milieu **sans transport
de matière** ; prévoir la grandeur physique correspondant à une
perturbation en un point et à un instant donnés ; exploiter la relation
entre retard, distance et célérité ; **distinguer périodicité spatiale et
périodicité temporelle** ; justifier et exploiter la relation entre
période, longueur d'onde et célérité. Capacités expérimentales (corde,
ressort, cuve à ondes) : nourries par les exercices 11 et le bac A.
La capacité numérique Python (représenter un signal périodique) est hors
format Nabla — même traitement que le flag 14 du chapitre avancement.
Hors programme de Première, non traités : diffraction, interférences,
effet Doppler, intensité et niveau sonores (Terminale) ; la distinction
transversale/longitudinale n'est pas nommée par le BO — elle apparaît en
une phrase qualitative au §2 (le son comme onde de compressions), voir
flag 6.

## Purpose & narrative through-line

Replace the static PDF fiche with a page where the student *performs* the
chapter's one big gesture — driving time with their own hand and watching
a perturbation travel while the medium stays put — before any formal
definition. Narrative order (concrete hook → picture → manipulation →
formal definition), never to be reordered:

1. **Concrete hook** (§1) — la ola au stade : la vague fait le tour du
   stade en quelques dizaines de secondes, et pourtant aucun spectateur ne
   quitte sa place. Ce qui voyage, c'est le geste. Static figure = the
   flagship widget's picture mid-course (la secousse à t = 1,50 s, la
   pince immobile plus loin) — see flag 4.
2. **Manipulation, then definition** (§2) — the **onde-corde** widget:
   une secousse court le long d'une corde à linge, le curseur règle le
   temps, la pince à linge monte et redescend *sur place* ; only after
   the gesture come the DÉFINITION (onde mécanique progressive), the
   central vitrine v = d/Δt, the méthode and the exemple (la ola du
   Stade de France).
3. **Le retard** (§3) — the **onde-corde** widget again, config-only
   (deux pinces A et B) : B refait le geste de A, τ = d/v plus tard.
   Hook = l'orage (l'éclair arrive tout de suite, le tonnerre après).
   DÉFINITION retard, MÉTHODE « localiser une source » (orage, sonar),
   EXEMPLE (compter les secondes après l'éclair).
4. **La double périodicité** (§4) — the **onde-sinus** widget: on secoue
   la corde en cadence ; deux graphiques presque identiques, la PHOTO
   (toute la corde à l'instant t, axe en mètres → λ) et le FILM (un seul
   bouchon au fil du temps, axe en secondes → T). Le piège central du
   chapitre est tué ici : l'axe des abscisses décide de ce qu'on lit.
   DÉFINITIONS onde périodique, T, f = 1/T, λ.
5. **La relation λ = v·T** (§5) — the **onde-relation** widget: pendant
   une période exactement, une crête marquée avance de v × T = λ, sous
   les yeux de l'élève, pour tout réglage de v et T. PROPRIÉTÉ λ = vT,
   POURQUOI (la justification du programme), MÉTHODE, EXEMPLE, puis le
   jeu **ondes-lecture** (quatre lectures graphiques, dont le piège du
   bac : lire λ sur un axe en secondes) — see flag 7 for its placement.
6. **Consolidation** — 5 pièges, l'essentiel en 5 lignes, 15 exercices
   corrigés (problème 14 = « l'orage approche-t-il ? »), Vers le Bac
   (Partie A la cuve à ondes, Partie B le sonar du chalutier).

One story runs through: **la ola et la corde à linge**. La ola ouvre le
chapitre (§1), fournit l'exemple résolu du §2 et revient dans les pièges
et l'exercice 02 ; la corde à linge est le décor des trois premiers
widgets (la pince à linge = le point du milieu qu'on surveille) ; l'orage
du §3 revient en problème final (ex 14). La houle et le bouchon du
pêcheur portent la partie périodique (§4, §5, exercices 07, 09, 13).
Prérequis mobilisés : vitesse = distance/durée (Seconde), lecture
graphique, conversions d'unités — rappelés d'une ligne quand ils servent.

## Reference waves & datasets (all displayed numbers exact — see flag 9)

No `FONCTIONS` entry (waves are functions of x *and* t — module-local).
Everywhere: la corde transmet à **v = 2,0 m/s** (une célérité de corde
réaliste et un multiplicateur trivial), perturbation de largeur 2,0 m,
amplitude 0,40 m (pulses) / 0,30 m (sinusoïdes).

- **§1 figure & flagship onde-corde (s2)** : corde de 10 m, v = 2,0 m/s,
  pince à x = 6,0 m. Slider t ∈ [0 ; 5,0 s] step 0,25 → le front
  d = v × t avance par pas de 0,50 m : toute lecture est exacte à deux
  décimales (d = 2 × t). La pince bouge pour t ∈ ]3,0 ; 4,0[ s. SVG
  640 × 300, vue x ∈ [−0,45 ; 10,45], y ∈ [−0,42 ; 0,75].
- **onde-corde #2 (s3)** : même corde, pinces A (x = 2,0 m) et
  B (x = 8,0 m), d(A→B) = 6,0 m → τ = 6,0/2,0 = **3,0 s** (chips
  statiques, exacts par construction). Slider t ∈ [0 ; 6,0 s] step 0,25.
  A bouge sur ]1,0 ; 2,0[ s, B sur ]4,0 ; 5,0[ s.
- **onde-sinus (s4)** : T = 2,0 s, λ = 4,0 m (donc v = λ/T = 2,0 m/s —
  la même corde qu'aux §2–3, secouée en cadence). Bouchons proposés :
  x₀ = 3,0 m (init) et 5,0 m. Slider t ∈ [0 ; 8,0 s] step 0,25 (quatre
  périodes). Photo x ∈ [0 ; 12 m] (trois longueurs d'onde) ; film
  t ∈ [0 ; 8 s]. Crochets de mesure : λ entre deux crêtes de la photo
  (fenêtre garantie : la crête gauche vit dans [0 ; λ[), T entre deux
  crêtes du film (t_c = (x₀/v) mod T ∈ [0 ; T[). La hauteur y du bouchon
  est une *lecture* affichée avec = ou ≈ selon exactitude (flag 9).
- **onde-relation (s5)** : curseurs v ∈ [0,5 ; 3,0] step 0,5 (« le
  milieu ») et T ∈ [1,0 ; 4,0] step 0,5 (« la source ») → λ = v × T ∈
  [0,5 ; 12] m, toujours exact à deux décimales (produit de deux pas de
  0,5). Init v = 2,0, T = 2,0 → λ = 4,0 m (écho du §4). La crête marquée
  part de x = 0,5 m ; vue x ∈ [−0,6 ; 13,6] : même λ = 12 m, l'arrivée
  (12,5 m) reste dans le cadre.
- **ondes-lecture (jeu, s5)** : ① photo, crêtes à 1/5/9 m → λ = 4,0 m
  ② film, crêtes à 0,5/2,0/3,5/5,0 s → T = 1,5 s ③ photo λ = 6,0 m +
  film T = 3,0 s → v = 2,0 m/s ④ film seul, crêtes espacées de 2,0 s →
  on ne peut PAS y lire λ. Réponses `[2, 1, 2, 3]`.
- **Exercices** : ola 800 m en 64 s → 12,5 m/s (ex 02) · corde à linge
  5,0 m à 2,0 m/s → 2,5 s (ex 03) · orage 6,0 s × 340 = 2 040 m ≈ 2,0 km
  (ex 04) · front à 3,0 m, M à 7,0 m, v = 2,0 → M bouge à 2,0 s pendant
  0,50 s (ex 05) · sonar 0,30 s aller-retour × 1 500 → 225 m (ex 06) ·
  bouchon 3 oscillations en 6,0 s → T = 2,0 s, f = 0,50 Hz, 30/min
  (ex 07) · photo 6,0 m + film 3,0 s → λ, T lues sur le bon document,
  v = 2,0 m/s en conclusion (ex 08) · houle T = 8,0 s, v = 1,5 m/s →
  λ = 12 m (ex 09) · son grave 85 Hz → λ = 340/85 = 4,0 m, T ≈ 0,012 s,
  aigu 170 Hz → 2,0 m (ex 10 ; l'exemple résolu du §5 garde le 425 Hz →
  0,80 m) · cuve : 5 crêtes sur 8,0 cm → λ = 2,0 cm,
  f = 20 Hz → v = 0,40 m/s (ex 11) · séisme P 6,0 km/s / S 4,0 km/s,
  écart 20 s → d = 240 km (ex 12) · houle T = 4,0 s + v = 3,0 m/s →
  λ = 12 m, jamais lue sur le graphique temporel, et deux bouées à
  6,0 m = λ/2 → retard 2,0 s = T/2, en opposition (ex 13) · orage :
  9,0 s puis 6,0 s cinq minutes après → 3 060 m puis 2 040 m, il
  approche à 3,4 m/s ≈ 12 km/h (ex 14) · bac A : cuve, f = 25 Hz,
  6 crêtes sur 10,0 cm → λ = 2,0 cm, v = λ × f = 0,50 m/s, f double →
  λ moitié · bac B : sonar 50 kHz, v = 1 500 m/s → λ = 3,0 cm ; fond
  0,20 s → 150 m ; banc 0,12 s → 90 m.

## Section structure

| id | Sommaire label | Contents |
|---|---|---|
| `s1` | 1. La ola du stade | hook prose (la ola, le tour du stade sans qu'un seul spectateur bouge) · static figure (la secousse sur la corde à linge, la pince qui attend) — no widget, no formal definition |
| `s2` | 2. L'onde et la célérité | **widget onde-corde** (une pince) · POURQUOI ? (chaque point refait le geste du voisin, le son = la ola de l'air) · DÉFINITION (onde mécanique progressive) · vitrine --grande (v = d/Δt) · MÉTHODE (mesurer une célérité) · EXEMPLE RÉSOLU (la ola du Stade de France) · À RETENIR · **quiz s2** (3 q.) |
| `s3` | 3. Le retard | hook (l'éclair puis le tonnerre) · **widget onde-corde #2** (pinces A et B) · DÉFINITION (retard τ = d/v) · MÉTHODE (localiser une source) · EXEMPLE RÉSOLU (l'orage) · **quiz s3** (3 q.) |
| `s4` | 4. La photo et le film | hook (secouer en cadence, la houle) · **widget onde-sinus** (photo + film) · DÉFINITION (onde périodique, T et f) · DÉFINITION (longueur d'onde λ) · MÉTHODE (lire T et λ — l'axe décide) · EXEMPLE RÉSOLU (le bouchon du pêcheur) · **quiz s4** (4 q.) |
| `s5` | 5. La relation λ = v × T | hook (que fait l'onde pendant une période ?) · **widget onde-relation** · PROPRIÉTÉ (λ = vT, λ = v/f) · POURQUOI ? (la justification) · MÉTHODE (exploiter λ = vT) · EXEMPLE RÉSOLU (le buzzer) · **jeu ondes-lecture** (4 graphiques) · À RETENIR · **quiz s5** (3 q.) |
| `pieges` | Les pièges classiques | 5 pièges (l'onde transporte la matière · λ sur un axe en secondes · crête→creux = λ/2 · unités mélangées · secouer plus vite n'accélère pas l'onde) |
| `essentiel` | L'essentiel en 5 lignes | ONDE · CÉLÉRITÉ · RETARD · PÉRIODES · RELATION |
| `ex` | Exercices — 15 corrigés | course order (themes as printed) : onde ou pas ? 01 · la célérité 02 · le retard 03 · l'orage 04 · prévoir un point 05 · le sonar 06 · T et f 07 · photo et film 08 · λ = v × T 09 · le son 10 · la cuve à ondes 11 · le séisme 12 · la houle piégée 13 · problème (l'orage approche-t-il ?) 14 · **VERS LE BAC** (ex 15, `#bac`, CALCULATRICE UTILE) |

Niveau distribution : n1 = 01, 02, 03, 04 · n2 = 05, 06, 07, 08, 09, 10,
11 · n3 = 12, 13, 14.

### Components introduced by this chapter

- **chapitre.css** (end-of-file banner « Ondes mécaniques
  (physique-chimie) ») : `.ond-mesure` (crochet de mesure accent — λ, T,
  distance d'avance — trait accent épaisseur --sw-tan) et le correctif
  partagé `.pt-craie` (fill craie, contour surface — la classe était
  utilisée par etalonnage.js sans exister dans chapitre.css : les cinq
  étalons du chapitre composition étaient noirs, donc invisibles en thème
  sombre, voir flag 12). Tout le reste réutilise l'existant : `.g-courbe`
  (la corde, craie), `.g-guide(-accent)`, `.pt-halo/.pt-point` (la pince,
  accent), `.vec-pointe--accent` + `.g-courbe-derivee` (flèche de
  célérité via `creerVecteur`), `.etiquette-mono`, `.etl-valeur`,
  `.avc-candidat` (petites légendes mono), `.feuille-btn` (choix du
  bouchon), quiz classes pour le jeu. CSS changed → `?v=9` bumped to
  `?v=10` on every page in the same commit.

## Widget instances

Shared engineering standards are in CLAUDE.md; doctrine in
`.claude/skills/nabla-topic/references/interactive-patterns.md`.

### 1. `onde-corde` — « La forme voyage, pas la corde » (flagship, §2)

Module `assets/js/widgets/onde-corde.js`, instance `#widget-corde`,
`data-widget="onde-corde" data-nom="corde" data-v="2" data-longueur="10"
data-t-max="5" data-largeur="2" data-amplitude="0.4"`; pinces in the
figure's JSON block: `[{"x": 6, "nom": "la pince"}]`.

- **Archetype B** (native slider, keyboard/touch free). Slider = le temps
  t, min 0, max 5,0 s, step 0,25 — d = v × t avance par pas de 0,50 m,
  affichages exacts (d est calculé sur t arrondi à 2 décimales, pour que
  la ligne « 2,0 × 1,25 = 2,50 m » soit cohérente même pendant
  l'animation).
- **SVG (640 × 300)** : grille verticale au mètre, axe horizontal (la
  ligne de repos de la corde), graduations mono 0 / 5 / 10 m ; la corde =
  `.g-courbe` (craie) rééchantillonnée à chaque rendu (260 points) ; la
  perturbation est une bosse en cos² de largeur 2,0 m ; front = trait
  accent pointillé vertical (visible tant qu'il est sur la corde) ;
  flèche de célérité accent (creerVecteur) au-dessus de la crête, avec
  l'étiquette mono « v = 2,0 m/s » ; chaque pince = rail pointillé
  vertical (`.g-guide`) + halo + point accent glissant sur le rail, nom
  mono sous l'axe.
- **Readouts** : ligne de lecture composée en JS (`.js-ligne`,
  textContent) « le front a parcouru d = v × t = 2,0 × 1,50 = 3,00 m » ;
  chip d'état (aria-live) : « la corde est au repos » (t = 0, neutre) /
  « l'onde court vers la pince — rien n'a encore bougé » (neutre) /
  « la pince monte et redescend — sur place » (good) / « l'onde est
  passée — tout est resté à sa place » (accent).
- **Captions** : trois paragraphes statiques (début / cours / fin)
  toggled by `hidden` inside one aria-live wrapper. La caption de fin est
  le payoff (« la pince est exactement là où elle a toujours été ») et
  la légende du début invite au geste.
- **Bouton accent « ▸ lance l'onde »** (`.js-lancer`, dans la ligne de
  contrôles) : remet t à 0 puis anime t jusqu'à t_max via `animerValeur`
  (600 ms par seconde simulée ; saut direct sous reduced motion — le
  curseur garde toute la manipulation). Un input du curseur stoppe
  l'animation. **Reset** (header) → t = 0.
- Keyboard : native slider arrows (±0,25 s/cran), `aria-valuetext`
  français (« t = 1,50 seconde — le front est à 3,00 mètres »).

### 2. `onde-corde` — « Le retard de B sur A » (§3, config-only reuse)

Instance `#widget-retard`, `data-nom="retard" data-t-max="6"`, pinces
`[{"x": 2, "nom": "A"}, {"x": 8, "nom": "B"}]` — same module, the marker
list is the only real difference:

- chips statiques (exacts par construction, dans la page) :
  « d(A→B) = 6,0 m » (neutre) et « retard : τ = d/v = 3,0 s » (accent) ;
- la chip d'état généralise le récit à deux pinces : « l'onde court vers
  A… » / « A monte et redescend — sur place » / « A a fini — l'onde
  court vers B » / « B monte et redescend — sur place » / « l'onde est
  passée — tout est resté à sa place » ;
- la caption de fin porte la leçon : « B a refait exactement le geste de
  A, 3,0 s plus tard — c'est le retard. »

### 3. `onde-sinus` — « La photo et le film » (§4)

Module `assets/js/widgets/onde-sinus.js`, instance `#widget-photofilm`,
`data-widget="onde-sinus" data-nom="photo-film" data-periode="2"
data-lambda="4" data-amplitude="0.3" data-t-max="8" data-pos-init="0"`,
positions des bouchons `[3, 5]` in the JSON block.

- **Archetype B**, deux SVG empilés (`.graph-scinde`, précédent :
  derivee.js) : en haut **LA PHOTO** (toute la corde à l'instant t,
  x ∈ [0 ; 12 m], 640 × 230), en bas **LE FILM** (le bouchon choisi au
  fil du temps, t ∈ [0 ; 8 s], 640 × 230). Titres mono en haut à gauche
  de chaque graphique ; le titre du film suit le bouchon choisi.
- **Crochets de mesure accent** (`.ond-mesure` + `.etl-valeur`) :
  « λ = 4,0 m » entre deux crêtes de la photo (il suit les crêtes quand
  t avance) ; « T = 2,0 s » entre deux crêtes du film (recalculé au
  changement de bouchon). Les deux valeurs sont aussi des chips
  statiques qui nomment l'axe : « λ = 4,0 m — sur la photo (axe en
  mètres) » / « T = 2,0 s — sur le film (axe en secondes) ».
- **Le même bouchon sur les deux graphiques** : point accent + halo sur
  la photo (à x₀, rail pointillé) et sur le film (au temps t, curseur
  pointillé accent) ; la ligne de lecture composée en JS affiche la
  hauteur commune : « à t = 1,25 s, le bouchon (x = 3,0 m) est à
  y ≈ −0,21 m — la même hauteur sur les deux graphiques » (= quand la
  valeur à deux décimales est exacte, ≈ sinon, flag 9).
- **Boutons bouchon** (`.feuille-btn`, aria-pressed) : « bouchon à
  3,0 m » / « bouchon à 5,0 m » — changent la courbe du film, son
  crochet T, le rail de la photo et le titre du film.
- **Bouton accent « ▸ fais défiler le temps »** (`.js-defiler`) : anime
  t jusqu'à 8,0 s (reprend où on en est ; repart de 0 si on est au
  bout) ; slider input stops it. **Reset** (header) → t = 0, bouchon
  3,0 m.
- **Captions** (début / cours / payoff à t ≥ T) statiques : la payoff
  verbalise la double périodicité et annonce le §5.
- Slider t step 0,25 s ; aria-valuetext « t = 1,25 seconde ».

### 4. `onde-relation` — « Une période, une longueur d'onde » (§5)

Module `assets/js/widgets/onde-relation.js`, instance `#widget-relation`,
`data-widget="onde-relation" data-nom="relation" data-v-init="2"
data-periode-init="2" data-amplitude="0.3"`.

- **Archetype B**, deux curseurs dont les légendes portent la leçon :
  « célérité v — fixée par le milieu : 2,0 m/s » (0,5 → 3,0, step 0,5)
  et « période T — choisie par la source : 2,0 s » (1,0 → 4,0,
  step 0,5). λ = v × T est donc toujours exact à deux décimales.
- **SVG (640 × 300)** : sinusoïde (craie) avec une crête marquée (halo +
  point accent) partie de la ligne de départ x = 0,5 m (guide pointillé
  fixe) ; pendant l'animation un point craie marque le départ et un
  crochet accent grandit sous la crête (« d = 1,40 m » puis, à
  l'arrivée, « v × T = 4,0 m = λ ») ; un second crochet mesure λ entre
  la crête marquée et la suivante. Ligne de lecture : « λ = v × T =
  2,0 × 2,0 = 4,0 m » ; chip accent « λ = 4,0 m ».
- **Bouton accent « ▸ avance d'une période »** (`.js-avancer`) : remet
  la crête sur la ligne de départ puis anime son avance pendant
  exactement une période (1 400 ms, saut direct sous reduced motion —
  la caption payoff reste le récit). Caption (JS, texte pur,
  aria-live) : début « pendant une période, chaque crête avance
  d'exactement v × T — vérifie-le », payoff « … la crête a avancé de
  v × T = 4,0 m : c'est la longueur d'onde. Et la corde est revenue
  exactement dans sa position de départ. »
- Bouger un curseur remet l'avance à zéro (la crête repart de la ligne
  de départ) et stoppe l'animation. **Reset** (header) → v = 2,0,
  T = 2,0, crête au départ.
- Affichages : 1 décimale quand la valeur tombe juste au dixième,
  2 sinon (« 3,75 m ») — helper local fmtPhys, voir flag 9.

### 5. `ondes-lecture` — « Lis les graphiques » (§5, jeu)

Module `assets/js/widgets/stoechio-jeu.js` (shared rounds engine, déjà
généralisé par le chapitre composition), instance
`data-widget="stoechio-jeu" data-nom="ondes-lecture"
data-progression="GRAPHIQUE" data-suivant="Graphique suivant"`.
Archetype D : per-round static groups (`.js-manche` = un SVG statique
hand-authored + question + 3 boutons), static per-round explanations,
answers `[2, 1, 2, 3]` in the JSON block.

- Rounds graded: ① une photo (axe en mètres) → lire λ = 4,0 m
  (distracteurs : 2,0 m = crête→creux, 4,0 s = la mauvaise unité)
  ② un film (axe en secondes) → lire T = 1,5 s (distracteurs : 3,0 s =
  deux motifs mal comptés, 0,75 s = crête→creux) ③ photo + film →
  v = λ/T = 2,0 m/s (distracteurs : 0,50 = division à l'envers, 18 =
  produit λ × T) ④ **le piège du bac** : un film seul, « peut-on y lire
  λ ? » → non, l'axe est en secondes (distracteurs : λ = 2,0 m « ça se
  lit pareil », λ = 2,0 s « avec l'unité du graphique »).
- Flow: wrong → mark + disable + tailored relance (« regarde l'axe des
  abscisses avant de mesurer »), retry; right → explanation +
  « Graphique suivant (i/4) ▸ »; end → « Terminé : x/4 du premier
  coup » + « ↺ recommencer ». Progress chip « GRAPHIQUE 1/4 ».
  Keyboard/touch free (buttons only).

## Quiz « Teste-toi » (reuses assets/js/quiz.js)

Four quizzes (s2/s3/s4/s5), 13 questions (3+3+4+3 — the 4-question quiz
on §4, the chapter's most confusable section), `data-bonne` spread over
the three positions. Every distractor is a piège from the pièges
section : la matière voyage avec l'onde, la division à l'envers (v/d,
T/λ), l'aller simple du sonar, λ lue en secondes, crête→creux = T ou λ,
« secouer plus vite accélère l'onde », « la lumière met du temps
visible ».

## Analytics (Plausible, throttled ≈ 1 event / interaction session)

| Event | Props | Fired |
|---|---|---|
| `widget_interact` | `widget: corde \| retard \| photo-film \| relation \| ondes-lecture \| quiz-s2 \| quiz-s3 \| quiz-s4 \| quiz-s5`, `chapitre: ondes` | first interaction, then ≤ 1 / 30 s per key |
| `corrige_open` | `exercice: 01 … 14`, `chapitre: ondes` | when a corrigé is opened |
| `bac_open` | — | when the Vers le Bac corrigé is opened |

The two `onde-corde` instances report distinct `widget` props
(`data-nom`: `corde` / `retard`).

## Review flags for Victor

Everything on this page is new authorship in your voice — no design mock,
no pre-existing copy, and **no outline validation before building** (the
session ran autonomously). Please read as author. Specific decisions:

1. **Chapter choice and sequencing.** Your homepage row had three
   « bientôt » cards ; PROGRAMME.md notes the « Mouvement » one needs a
   title recadrage that felt like your call, so I shipped **« Les ondes
   mécaniques »** (its card title needed none) as CHAPITRE 03. The
   avancement chapter's footer now links here instead of announcing
   « Mouvement et deuxième loi de Newton » ; this page's own footer
   announces « Le mouvement d'un système » (the PROGRAMME.md wording,
   NOT the homepage card's wording — align whichever you prefer).
2. **The whole chapter design is mine** : la ola as hook and running
   story, la corde à linge et ses pinces as the flagship setting, « la
   photo et le film » as the name of the two representations (manuals
   say « représentation spatiale/temporelle » — my words are on the page,
   the manual's words are given in the DÉFINITION and MÉTHODE so the
   student knows both), the « le milieu décide de v, la source décide de
   T » framing, and the game's rounds. Check especially « la photo » /
   « le film » — it's the chapter's central vocabulary.
3. **v = d/Δt is taught in §2** (with the flagship widget) and the
   vitrine --grande is v = d/Δt rather than a §2-specific formula ; §3
   is entirely dedicated to the retard τ = d/v. The BO lists célérité
   and retard together ; splitting them gives each section one concept
   (house rule). Flag if you'd rather group them.
4. **§1's static figure is the flagship mid-gesture** (t = 1,50 s, la
   secousse en vol, la pince encore immobile), not the widget's t = 0
   state (a flat rope tells no story). Precedent bent : avancement's §1
   figure was its widget's exact initial state.
5. **The rope is infinite in spirit** : in §3 the slider runs to 6,0 s,
   so the front leaves the 10 m view at 5,0 s and the d = v × t line
   keeps counting (12,00 m) while the front guide disappears. I judged
   this more honest than capping t ; the caption narrates the wave
   leaving. Tell me if you'd rather cap.
6. **Transversale/longitudinale is one qualitative sentence** in §2's
   prose (la ola verticale, le son = compressions qui se propagent) —
   the BO doesn't name the distinction in Première, so no DÉFINITION
   block ; the words « transversale » and « longitudinale » do NOT
   appear. Add them if you teach them.
7. **The game sits AFTER the méthode in §5** (deviation from « game
   before formalisation ») : it *tests* the full graph-reading skill
   built across §4 + §5, like a mini-bac. The manipulation-first rule is
   still honoured by the onde-relation widget at the top of the section.
8. **Le son appears as an example** (§2 prose, §3 orage, ex 10 buzzer,
   bac B sonar) with v(son) = 340 m/s given every time. Sound IS a
   mechanical wave and the BO's own examples include it ; but the
   quantitative sound chapter (intensity, level) is Terminale — nothing
   beyond v = d/Δt and λ = v/f is used.
9. **Number-exactness policy** (house-rule bend, precedent composition
   flag 4) : every *setting* is exact by construction (steps of 0,25 s /
   0,5 m/s), and the only ≈ on the page are (a) the sinus widget's live
   y reading (cos values — displayed with =/≈ chosen by comparing the
   2-decimal display to the true value) and (b) corrigés where the
   physics rounds honestly (340 × 6 = 2 040 m ≈ 2,0 km ; 3,4 m/s ≈
   12 km/h). Physics number style : one decimal when the value lands on
   a tenth (« 4,0 m »), two otherwise (« 3,75 m ») — helper fmtPhys in
   onde-relation/onde-sinus ; the corde instances keep uniform 2
   decimals for t and d (« 1,50 s », « 3,00 m »).
10. **Ex 05 and ex 08 are text-described graphs** (« la photo montre des
    crêtes séparées de… ») rather than embedded SVG figures — the game
    already provides real graph-reading with SVGs ; embedding four more
    figures in the exercise list felt heavy. Say the word and I'll draw
    them.
11. **Le séisme (ex 12)** uses simplified celerities (P 6,0 km/s,
    S 4,0 km/s) chosen for the clean Δτ = d/12 → d = 240 km ; real
    crustal values are ~6–7 and ~3,5–4 km/s. The statement says
    « valeurs simplifiées ».
12. **Shared fix : `.pt-craie` now exists in chapitre.css** (fill craie,
    contour surface, comme `.pt-suite`). etalonnage.js (chapitre
    composition) used the class but no rule defined it, so the five
    étalon points rendered black — invisible on the dark theme. Worth a
    glance at the composition page after deploy.
13. **JS budget : 47,7 KB** first-party unminified on this page
    (ceiling 50 KB), measured with `wc -c` over the ten modules the page
    loads (theme, sommaire, corrige, quiz, analytics, nabla-graph,
    stoechio-jeu, onde-corde, onde-sinus, onde-relation). The heaviest
    chapter so far — three new modules — but under budget.
14. **Verified headless (jsdom harness, 70 checks pass)** — the sandbox
    has no browser : the harness drives both onde-corde instances
    (formula line, state-chip machine incl. the A→B narration, captions,
    pin never moves horizontally, « lance l'onde » animation, reset,
    aria-valuetext), onde-sinus (λ/T crochets, same-height accent point
    on both graphs, =/≈ display logic, bouchon switch, défiler, reset),
    onde-relation (exact λ line at every setting, advance-bracket payoff
    at τ = T, slider-resets-crest, reset), the full game flow (wrong →
    relance, 4 rounds, score, recommencer), quiz flow, corrigé + bac
    toggles, page structure (1 h1, 8 sections, 14+1 exercises,
    13 questions 3+3+4+3 with data-bonne spread 4/4/5, 5 pièges,
    5 essentiel lines, 9 sommaire links), no ↗/↘, « widget » absent from
    prose. All 156 KaTeX formulas render with 0 errors (katex npm) ; the
    KaTeX onload snippet is byte-identical to the composition page's ;
    every internal link and anchor on the three touched pages resolves.
    **The two-theme visual pass, real touch, and Lighthouse remain on
    your checklist.**
15. **« mis à jour juillet 2026 »** hand-maintained ; sitemap lastmod
    2026-07-17 (this page, accueil, avancement). Homepage motif = two
    periods of a sinusoid (craie) + accent point on a crest + dashed
    crest-to-crest measure — echoes §4/§5.
