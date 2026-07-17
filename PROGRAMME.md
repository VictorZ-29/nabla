# PROGRAMME.md — Programmes officiels de Première & couverture Nabla

Référentiel de ce que le site doit couvrir pour la Première (spé maths et
spé physique-chimie), et état d'avancement chapitre par chapitre.

**Règles d'usage :**

- Avant de créer un nouveau chapitre (skill `nabla-topic`, étape « Gather »),
  lire la ligne correspondante ici : elle donne le périmètre officiel du
  chapitre et ce qui est explicitement hors programme.
- Quand un chapitre est mis en ligne, passer son statut à ✅ avec le chemin
  du dossier, dans le même commit.
- Si un programme officiel change, mettre à jour ce fichier depuis le BO
  (liens ci-dessous) plutôt que de retoucher les lignes à la main.
- Le texte intégral de l'annexe officielle spé maths Première 2026
  (contenus, capacités attendues, démonstrations exemplaires, algorithmes,
  approfondissements) est archivé dans
  `references/annexe-spe-maths-premiere-2026.txt` — le consulter pour
  scoper finement un chapitre.

**Dernière vérification en ligne : 17 juillet 2026.**
**Annexe officielle du programme 2026 de spé maths Première : vérifiée le
17 juillet 2026 sur le PDF du BO fourni par Victor — la section
Mathématiques ci-dessous en est directement dérivée (intitulés, contenus,
capacités, démonstrations exemplaires).**

---

## ⚠️ Réforme 2026 — le contexte à connaître

- **Maths Première spé : nouveau programme** fixé par l'arrêté du
  26 février 2026 (BO n°14 du 2 avril 2026), applicable à la **rentrée
  2026-2027**. Il remplace le programme de 2019. Les élèves qui entrent en
  Première en septembre 2026 suivent le nouveau programme → **Nabla cible le
  programme 2026** pour les maths de Première.
  Texte officiel : https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602917A
  (Légifrance : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053723235)
- **Maths Terminale spé : nouveau programme aussi publié** (BO n°14 du
  2 avril 2026), applicable seulement à la **rentrée 2027-2028**. En
  2026-2027, les Terminales restent sur le programme 2019.
  https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602919A
- **Épreuve anticipée de mathématiques** en fin de Première (générale et
  technologique) : écrit de 2 h, **entièrement sans calculatrice**, première
  partie « automatismes » notée sur 6 points. Première session : juin 2026.
  À partir de juin 2027 elle portera sur le programme 2026. Conséquence pour
  Nabla : les automatismes et le calcul sans calculatrice méritent une vraie
  place dans les exercices.
- **Physique-chimie Première spé : programme inchangé** — c'est toujours
  celui du BO spécial n°1 du 22 janvier 2019. La réforme 2026 ne touche que
  les maths.
  Texte officiel : https://www.education.gouv.fr/bo/19/Special1/MENE1901635A.htm

### Ce que le programme 2026 change en Première spé maths (vs 2019)

Vérifié sur l'annexe officielle (arrêté du 26 février 2026, BO n°14 du
2 avril 2026).

| Sujet | Changement 2026 (annexe vérifiée) |
|---|---|
| Second degré | **Conservé intégralement en spé** (discriminant, racines, signe) ; la forme factorisée passe en premier (avec somme et produit des racines), la forme canonique se travaille par complétion du carré sur des cas simples — son calcul dans le cas général **n'est plus un attendu**. |
| Suites | Stables (arithmétiques, géométriques, sommes 1+2+…+n et 1+q+…+qⁿ) ; introduction intuitive de la notion de limite explicitement au programme (sans formalisation). |
| Dérivation | + **approximation linéaire** (fonction affine tangente, f(a+h) ≈ f(a) + f′(a)h — le terme officiel est « approximation linéaire ») ; + **fonction valeur absolue : étude de la dérivabilité en 0** ; dérivée de xⁿ pour n ∈ ℤ. |
| Variations et courbes | + **fonctions paires et impaires** (représentation algébrique et graphique) en spé Première. |
| Trigonométrie | Cercle trigonométrique, longueur d'arc, radian, enroulement, cos/sin d'un réel, valeurs remarquables et angles associés **restent** ; les **fonctions x ↦ sin x et x ↦ cos x partent en Terminale**. |
| Exponentielle | Reste en Première (définition par f′ = f et f(0) = 1, admise). |
| Produit scalaire, géométrie repérée | Conservés ; s'ajoutent : coordonnées dans une base orthonormée lues comme produits scalaires avec la base ; projection orthogonale d'un point sur une droite (coordonnées du projeté). |
| Probabilités | Les conditionnelles elles-mêmes sont désormais **initiées en Seconde** et entretenues en automatismes ; la Première formalise : indépendance, **partition de l'univers + probabilités totales**, **succession de deux épreuves indépendantes (arbre ou tableau)**, **répétition de n ≤ 4 épreuves de Bernoulli indépendantes et identiques** (arbre, calculs — sans loi binomiale). |
| Variables aléatoires | + **linéarité de l'espérance** et **formule de König-Huygens** (descendues de Terminale). |
| Statistiques | **Pas de chapitre de statistiques en spé** (le « regroupement par classes / statistiques bivariées » annoncé par des sources secondaires concerne la voie technologique) : en spé, les statistiques vivent dans les automatismes (lectures de graphiques, indicateurs — entretien de Seconde) et dans la partie finale « **Expérimentations** » (simulation d'échantillons, écart moyenne/espérance, seuil 2σ/√n). |
| Transversal | Automatismes officiels en 5 blocs (voir Transversal ci-dessous) ; vocabulaire ensembliste enrichi (**couple, produit cartésien, Card(A)**) ; algorithmique : la liste Python comme seule nouveauté ; démonstrations exemplaires listées chapitre par chapitre. |

---

## Mathématiques — Première spécialité (programme 2026)

**Bilan : 5 chapitres en ligne (à jour du programme 2026) · 4 à faire ·
1 complément partiel (parité et position relative de deux courbes, à caser
dans l'orbite de la dérivation).**

### Algèbre

| Chapitre Nabla | Contenus du programme (annexe 2026) | Statut |
|---|---|---|
| Les suites numériques | « Suites numériques, modèles discrets » : modes de génération (explicite, récurrence, algorithme, motifs géométriques), notations ; suites arithmétiques (terme général, évolutions à accroissements constants, lien fonctions affines, somme 1 + 2 + … + n) ; suites géométriques (terme général, évolutions à taux constant, lien exponentielle, somme 1 + q + … + qⁿ) ; sens de variation ; introduction intuitive de la limite (toute formalisation exclue). Démos exemplaires : termes généraux, les deux sommes. | ✅ `premiere/maths/suites/` |
| Le second degré | « Équations, fonctions polynômes du second degré » : forme factorisée d'abord (racines, signe, somme et produit des racines) ; forme canonique par complétion du carré sur des cas simples (le calcul général n'est PAS un attendu) ; discriminant, résolution, factorisation éventuelle, signe ; choisir la forme adaptée (équation, inéquation, optimisation, variations) ; stratégies de factorisation directe (racine évidente, somme/produit, coefficient de x nul). Démo exemplaire : résolution de l'équation du second degré. | ⬜ À faire |

### Analyse

| Chapitre Nabla | Contenus du programme (annexe 2026) | Statut |
|---|---|---|
| La dérivation | « Dérivation » — point de vue local : taux de variation, sécantes ; nombre dérivé comme limite du taux (perception intuitive, pas de définition formelle) ; tangente, pente, équation y = f(a) + f′(a)(x − a) ; **approximation linéaire** (fonction affine tangente ; f(a + h) ≈ f(a) + f′(a)h ; capacité « calculer une valeur approchée de f(a+h) »). Point de vue global : fonction dérivée ; dérivées de carré, cube, inverse, racine carrée ; opérations (somme, produit, inverse, quotient) ; xⁿ pour n ∈ ℤ ; **valeur absolue : étude de la dérivabilité en 0**. Démos : équation de la tangente, √ non dérivable en 0, dérivées de x² et 1/x, dérivée d'un produit. | ✅ `premiere/maths/derivation/` — approximation linéaire ajoutée au §3 le 17-07-2026 ; la non-dérivabilité de \|x\| en 0 est traitée en piège (une étude complète en exercice reste possible, à voir avec Victor) |
| Variations et courbes des fonctions | « Variations et courbes représentatives des fonctions » : lien signe de f′ ↔ sens de variation, caractérisation des fonctions constantes ; nombre dérivé en un extrémum, tangente horizontale ; optimisation ; **fonctions paires et impaires** (représentations algébrique et graphique, traduction géométrique) ; inégalités et position relative de deux courbes via les variations ; second degré revisité par la dérivation. | ◐ Partiel — variations, extremums et optimisation sont traités dans le chapitre dérivation (§5 + ex 11–14) ; **manquent : la parité et la position relative de deux courbes** (compléments à caser dans dérivation ou second degré) |
| La fonction exponentielle | « Fonction exponentielle » : définition comme unique fonction dérivable avec f′ = f et f(0) = 1 (existence/unicité admises) ; propriétés algébriques, nombre e, notation eˣ ; signe, sens de variation, courbe ; lien avec les suites géométriques ; dérivée de t ↦ e^(at) ; représentation de e^(kt) et e^(−kt) ; modélisations (capital, décroissance radioactive). | ✅ `premiere/maths/exponentielle/` |
| La trigonométrie | « Trigonométrie » : cercle trigonométrique, longueur d'arc, radian ; enroulement de la droite, image d'un réel ; cosinus et sinus d'un réel, lien avec le triangle rectangle, valeurs remarquables ; angles associés par lecture du cercle. Démo exemplaire : cos et sin de π/4 et π/3. **Les fonctions x ↦ sin x et x ↦ cos x ne sont plus au programme de Première (Terminale).** | ⬜ À faire |

### Géométrie

| Chapitre Nabla | Contenus du programme (annexe 2026) | Statut |
|---|---|---|
| Le produit scalaire | « Calcul vectoriel et produit scalaire » : produit scalaire par la projection orthogonale et par la formule au cosinus ; caractérisation de l'orthogonalité ; bilinéarité, symétrie ; en base orthonormée : expression du produit scalaire et de la norme, critère d'orthogonalité, coordonnées lues comme produits scalaires avec les vecteurs de la base ; développement de ‖u⃗ + v⃗‖² et ‖u⃗ − v⃗‖² ; formule d'Al-Kashi ; transformation de MA⃗·MB⃗. Démos : Al-Kashi, ensemble des M tels que MA⃗·MB⃗ = 0. Une pratique du calcul vectoriel en géométrie NON repérée doit être conservée. | ✅ `premiere/maths/produit-scalaire/` |
| La géométrie repérée | « Géométrie repérée » (plan rapporté à un repère orthonormé) : vecteur normal à une droite — (a ; b) est normal à la droite ax + by + c = 0 ; projection orthogonale d'un point sur une droite (coordonnées du projeté) ; équation de cercle (déterminer par centre et rayon, reconnaitre, retrouver centre et rayon) ; utiliser un repère pour étudier une configuration. Approfondissement facultatif : intersections avec une parabole y = ax² + bx + c. | ⬜ À faire — carte « BIENTÔT » déjà sur l'accueil |

### Probabilités et statistiques

| Chapitre Nabla | Contenus du programme (annexe 2026) | Statut |
|---|---|---|
| Les probabilités conditionnelles | « Probabilités conditionnelles et indépendance ». Les conditionnelles elles-mêmes (P_A(B), tableaux croisés, arbres pondérés, distinguer P(A∩B)/P_A(B)/P_B(A)) sont initiées en Seconde et entretenues en automatismes — le chapitre Nabla les enseigne de zéro, ce qui couvre à la fois la révision et le nouveau. Contenus de Première : indépendance de deux évènements (utiliser, justifier) ; partition de l'univers (systèmes complets d'évènements), formule des probabilités totales ; succession de deux épreuves indépendantes (représentation par un arbre ou un tableau) ; **pour n ≤ 4, répétition de n épreuves de Bernoulli indépendantes et identiques** (représenter l'arbre pour calculer des probabilités). | ✅ `premiere/maths/probabilites-conditionnelles/` — Bernoulli n ≤ 4 ajouté en §6 le 17-07-2026. Compléments possibles : vocabulaire « partition/système complet » au-delà de {A, Ā} ; représentation en tableau d'une succession de deux épreuves |
| Les variables aléatoires | « Variables aléatoires réelles » (univers finis uniquement) : VA comme fonction définie sur l'univers, modélisation d'un résultat numérique ; loi d'une VA ; espérance, variance, écart type ; **linéarité de l'espérance** ; **formule de König-Huygens** ; notations {X = a}, {X ⩽ a}, P(X = a), P(X ⩽ a) ; espérance en résolution de problème (mise pour un jeu équitable). Lien statistiques ↔ probabilités (tirage équiprobable dans une population : moyenne ↔ espérance, fréquences conditionnelles ↔ conditionnelles). | ⬜ À faire |

### Transversal (pas de chapitre dédié — à tisser dans les chapitres)

- **Vocabulaire ensembliste et logique** : ensembles (∈, ⊂, ∩, ∪, ∅,
  complémentaire Ā ou E\A), **couple et produit cartésien, Card(A)** ;
  connecteurs et/ou, contre-exemple, implication, équivalence, réciproque,
  contraposée, condition nécessaire/suffisante, quantificateurs (∀ et ∃
  non exigibles), raisonnements par disjonction des cas, par l'absurde,
  par contraposée. Au fil des chapitres.
- **Algorithmique et programmation** : consolidation (variables,
  conditions, boucles, fonctions) ; seule nouveauté : la **notion de
  liste** (générer en extension/compréhension, manipuler, parcourir,
  itérer). Le format Nabla ne fait pas tourner de Python : traiter en
  lecture de code dans les exercices quand le programme le demande
  (cf. flag 14 du chapitre avancement, même logique).
- **Automatismes** (annexe, 5 blocs — matière première idéale pour les
  quiz, les exercices n1 et l'épreuve anticipée sans calculatrice) :
  1. évolutions et variations (appliquer/calculer un taux, évolutions
  successives, taux réciproque) ; 2. calcul numérique et algébrique
  (équation produit nul, signe du 1ᵉʳ degré et du 2ᵈ degré factorisé,
  développer/factoriser/réduire) ; 3. fonctions et représentations
  (résolutions graphiques f(x) = k / f(x) < k, signe et variations lus
  graphiquement, droites : tracer, lire, coefficient directeur) ;
  4. statistiques (lire graphiques/histogrammes/boites, indicateurs) ;
  5. probabilités (conditionnelles sur tableau croisé ou arbre,
  distinguer P(A∩B), P_A(B), P_B(A)). S'y ajoute l'entretien des
  automatismes de Seconde. Envisager à terme une page d'entrainement
  dédiée.
- **Expérimentations** (partie finale de l'annexe) : simulation
  d'échantillons d'une variable aléatoire (Python/tableur), moyenne d'un
  échantillon vs espérance, proportion des écarts ⩽ 2σ/√n sur N
  échantillons. Largement hors format Nabla (simulation) — à évoquer
  qualitativement dans le futur chapitre variables aléatoires.

---

## Physique-chimie — Première spécialité (programme 2019, toujours en vigueur)

**Bilan : 1 chapitre en ligne · 15 à faire.** Découpage proposé : un
chapitre Nabla par sous-partie officielle (des regroupements restent
possibles, notés ci-dessous — à arbitrer par Victor chapitre par chapitre).

### Thème 1 — Constitution et transformations de la matière

| Chapitre Nabla | Sous-partie officielle & contenus | Statut |
|---|---|---|
| La composition d'un système chimique | « Détermination de la composition du système initial à l'aide de grandeurs physiques » : masse molaire, quantité de matière n = m/M ; concentration en quantité de matière c = n/V ; volume molaire des gaz ; absorbance, loi de Beer-Lambert, dosage par étalonnage. | ⬜ À faire — prérequis direct du chapitre avancement (qui le suppose « fait en classe ») |
| La réaction chimique et l'avancement | « Suivi et modélisation de l'évolution d'un système siège d'une transformation chimique » : avancement x, tableau d'avancement, réactif limitant, x_max/x_f, transformations totale et non totale, mélange stœchiométrique. | ✅ `premiere/physique-chimie/reaction-avancement/` |
| L'oxydoréduction et les titrages | « Détermination d'une quantité de matière grâce à une transformation chimique » : couples oxydant/réducteur, demi-équations électroniques, réactions d'oxydoréduction ; titrage colorimétrique, équivalence. | ⬜ À faire |
| La polarité des entités | « De la structure à la polarité d'une entité » : schéma de Lewis, géométrie des entités, électronégativité, polarisation des liaisons, polarité d'une molécule. | ⬜ À faire |
| Cohésion et solubilité | « De la structure des entités à la cohésion et à la solubilité/miscibilité d'espèces chimiques » : interactions de Van der Waals, liaison hydrogène ; dissolution des solides ioniques ; solubilité, miscibilité ; extraction par solvant ; hydrophile/lipophile, savons. | ⬜ À faire — regroupable avec la polarité en un seul gros chapitre si besoin |
| Les molécules organiques | « Structure des entités organiques » : squelette carboné, formules brutes et semi-développées ; groupes caractéristiques et familles fonctionnelles (alcool, aldéhyde, cétone, acide carboxylique) ; nomenclature limitée ; spectroscopie infrarouge. | ⬜ À faire |
| La synthèse organique | « Synthèses d'espèces chimiques organiques » : étapes d'un protocole (transformation, isolement, purification, identification) ; rendement d'une synthèse. | ⬜ À faire |
| Les combustions | « Conversions de l'énergie stockée dans la matière organique » : combustion, énergie molaire de combustion, pouvoir calorifique ; applications et enjeux (énergie, environnement). | ⬜ À faire — regroupable avec la synthèse organique |

### Thème 2 — Mouvement et interactions

| Chapitre Nabla | Sous-partie officielle & contenus | Statut |
|---|---|---|
| Interactions et champs | « Interactions fondamentales et introduction à la notion de champ » : électrisation, loi de Coulomb ; champ électrostatique E = F/q ; champ de gravitation ; cartes de champ. | ⬜ À faire |
| Les fluides au repos | « Description d'un fluide au repos » : modèle microscopique, pression, force pressante ; loi de Mariotte ; loi fondamentale de la statique des fluides. | ⬜ À faire |
| Le mouvement d'un système | « Mouvement d'un système » : vecteur vitesse, vecteur variation de vitesse entre deux instants voisins ; lien qualitatif entre ΣF⃗ et Δv⃗ (préfiguration de la 2ᵉ loi de Newton — la loi complète est en Terminale). | ⬜ À faire — carte « BIENTÔT » sur l'accueil (« Mouvement et deuxième loi de Newton » — titre à recadrer : en Première c'est le lien ΣF⃗ ↔ Δv⃗, pas la loi complète) |

### Thème 3 — L'énergie : conversions et transferts

| Chapitre Nabla | Sous-partie officielle & contenus | Statut |
|---|---|---|
| L'énergie électrique | « Aspects énergétiques des phénomènes électriques » : porteurs de charge, intensité ; source réelle de tension, caractéristique, point de fonctionnement ; puissance, énergie, effet Joule ; rendement d'un convertisseur. | ⬜ À faire |
| L'énergie mécanique | « Aspects énergétiques des phénomènes mécaniques » : énergie cinétique, théorème de l'énergie cinétique ; travail d'une force, travail du poids ; forces conservatives, énergie potentielle de pesanteur ; énergie mécanique, conservation et non-conservation. | ⬜ À faire — carte « BIENTÔT » sur l'accueil |

### Thème 4 — Ondes et signaux

| Chapitre Nabla | Sous-partie officielle & contenus | Statut |
|---|---|---|
| Les ondes mécaniques | « Ondes mécaniques » : onde progressive, célérité, retard ; ondes périodiques, période, longueur d'onde, relation λ = v·T. | ⬜ À faire — carte « BIENTÔT » sur l'accueil |
| Lentilles, images et couleurs | « La lumière : images et couleurs » : lentille mince convergente, relation de conjugaison, grandissement, image réelle/virtuelle ; couleur des objets, synthèses additive et soustractive, couleurs complémentaires. | ⬜ À faire |
| Le photon et les spectres | « Modèles ondulatoire et particulaire de la lumière » : domaines du spectre électromagnétique ; le photon, E = h·ν ; interaction lumière-matière (absorption, émission), quantification des niveaux d'énergie, spectres. | ⬜ À faire |

### Transversal

- **Mesure et incertitudes** : variabilité, incertitude-type, écriture d'un
  résultat, comparaison à une valeur de référence — à tisser dans les
  exercices expérimentaux des chapitres, pas de chapitre dédié.
- **Capacités numériques Python** du programme : hors format Nabla (site
  statique) — même traitement que le flag 14 du chapitre avancement
  (mentionner, ne pas simuler).

---

## Vérifications

1. ✅ **Annexe officielle du programme 2026 de spé maths de Première :
   vérifiée le 17-07-2026** sur le PDF du BO fourni par Victor. La section
   Mathématiques ci-dessus en est directement dérivée. Corrections
   apportées à cette occasion par rapport à la synthèse initiale (sources
   secondaires) : le terme officiel est « approximation **linéaire** »
   (pas « affine ») ; il n'existe **pas** de chapitre de statistiques en
   spé (le « regroupement par classes / statistiques bivariées » relevait
   de la voie technologique) — remplacé par les automatismes et la partie
   « Expérimentations » ; ajouts repérés : fonctions paires/impaires,
   valeur absolue (dérivabilité en 0), linéarité de l'espérance,
   König-Huygens, partition de l'univers, succession de deux épreuves
   (arbre ou tableau), vocabulaire ensembliste enrichi (couple, produit
   cartésien, Card).
2. ⬜ Confirmer qu'**aucun nouvel arrêté physique-chimie** n'est paru pour
   la Première après le BO spécial n°1 du 22-01-2019 (recherches de
   juillet 2026 : rien trouvé ; la réforme 2026 publiée au BO n°14 est
   maths uniquement).
3. ⬜ Au moment d'attaquer la Terminale : vérifier l'annexe du **programme
   de Terminale spé maths 2026** (applicable rentrée 2027) de la même
   façon, sur le texte officiel.
4. Reporter ici toute correction, avec la date de vérification en tête de
   fichier.
