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

**Dernière vérification en ligne : 17 juillet 2026.**

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

Synthèse recoupée de plusieurs sources secondaires (blogs académiques et
enseignants, éditeurs) — l'annexe officielle PDF n'était pas accessible
depuis cet environnement, voir « À vérifier » en bas de fichier.

| Sujet | Changement 2026 |
|---|---|
| Second degré | **Conservé intégralement en spé** (discriminant, racines, signe). C'est le tronc commun (maths intégrées à l'enseignement scientifique) qui perd le discriminant, pas la spé. |
| Suites | Stables (arithmétiques, géométriques). |
| Dérivation | Enrichie de l'**approximation affine (locale)** de f près d'un point. |
| Trigonométrie | Le cercle trigonométrique, le radian, cosinus et sinus d'un réel **restent en Première** ; l'étude des **fonctions x ↦ sin x et x ↦ cos x** (parité, périodicité, courbes, dérivées, variations) **part en Terminale**. |
| Exponentielle | Reste en Première. |
| Produit scalaire, géométrie repérée | Conservés (projeté orthogonal maintenu ; expression dans une base orthonormée reliée au développement de ‖u⃗+v⃗‖²). |
| Probabilités | Conditionnelles et indépendance stables ; **ajout : succession de n ≤ 4 épreuves de Bernoulli indépendantes et identiques** (arbres), sans formaliser la loi binomiale. |
| Statistiques / données | Place renforcée des données : regroupement par classes, statistiques bivariées (contour exact à vérifier dans l'annexe). |
| Transversal | Plus d'automatismes (liste officielle au BO), du raisonnement, de l'algorithmique (Python, listes), du calcul sans calculatrice. |

---

## Mathématiques — Première spécialité (programme 2026)

**Bilan : 5 chapitres en ligne · 5 à faire · 2 compléments 2026 à apporter
aux chapitres existants.**

### Algèbre

| Chapitre Nabla | Contenus du programme | Statut |
|---|---|---|
| Les suites numériques | Modèles discrets ; suites explicites et récurrentes ; suites arithmétiques et géométriques (terme général, sommes) ; sens de variation. | ✅ `premiere/maths/suites/` |
| Le second degré | Fonction polynôme du second degré : forme canonique, allure, symétrie, variations ; équation du second degré, discriminant, racines ; factorisation ; signe du trinôme ; inéquations. | ⬜ À faire |

### Analyse

| Chapitre Nabla | Contenus du programme | Statut |
|---|---|---|
| La dérivation | Taux de variation, nombre dérivé, tangente ; fonctions dérivées des fonctions usuelles ; opérations (somme, produit, quotient…) ; signe de f′ → variations et extremums ; tableaux de signes et de variations. | ✅ `premiere/maths/derivation/` — **complément 2026 à ajouter : approximation affine locale** |
| La fonction exponentielle | Définition (f′ = f, f(0) = 1) ; propriétés algébriques ; variations, courbe ; suites géométriques exp(na) ; équations et inéquations. | ✅ `premiere/maths/exponentielle/` |
| La trigonométrie | Cercle trigonométrique, enroulement de la droite des réels, radian ; cosinus et sinus d'un réel ; valeurs remarquables ; angles associés ; cos²+sin² = 1. **Hors programme Première depuis 2026 : les fonctions x ↦ sin x, x ↦ cos x (parité, périodicité, courbes, dérivées, variations) — parties en Terminale.** | ⬜ À faire |

### Géométrie

| Chapitre Nabla | Contenus du programme | Statut |
|---|---|---|
| Le produit scalaire | Définitions (norme/angle, projeté orthogonal, bilinéarité, base orthonormée) ; orthogonalité ; identités de polarisation ; Al-Kashi ; travail d'une force. | ✅ `premiere/maths/produit-scalaire/` |
| La géométrie repérée | Vecteur normal à une droite, équations de droites ; équation d'un cercle (centre, rayon) ; cercle de diamètre [AB] ; projeté orthogonal d'un point sur une droite. | ⬜ À faire — carte « BIENTÔT » déjà sur l'accueil |

### Probabilités et statistiques

| Chapitre Nabla | Contenus du programme | Statut |
|---|---|---|
| Les probabilités conditionnelles | P_A(B), arbres pondérés, tableaux ; formule des probabilités totales ; renversement ; indépendance de deux événements. | ✅ `premiere/maths/probabilites-conditionnelles/` — **complément 2026 à évaluer : succession de n ≤ 4 épreuves de Bernoulli (arbres, sans loi binomiale) — ici ou dans le chapitre variables aléatoires** |
| Les variables aléatoires | Variable aléatoire réelle, loi de probabilité ; espérance, variance, écart type ; interprétation (moyenne des valeurs sur un grand nombre de répétitions). | ⬜ À faire |
| Statistiques — analyse de données | Nouveauté 2026 : place renforcée des données — regroupement par classes, statistiques bivariées (nuages de points). **Contour exact à vérifier dans l'annexe officielle avant de scoper le chapitre.** | ⬜ À faire |

### Transversal (pas de chapitre dédié — à tisser dans les chapitres)

- **Algorithmique et programmation** (Python, notion de liste) : le format
  Nabla ne fait pas tourner de Python ; traiter en lecture de code dans les
  exercices quand le programme le demande (cf. flag 14 du chapitre
  avancement, même logique).
- **Vocabulaire ensembliste et logique** : au fil des chapitres.
- **Automatismes** (liste officielle au BO, pilier de l'épreuve anticipée) :
  irriguer quiz et exercices n1 ; envisager à terme une page d'entraînement
  dédiée.

---

## Physique-chimie — Première spécialité (programme 2019, toujours en vigueur)

**Bilan : 2 chapitres en ligne · 14 à faire.** Découpage proposé : un
chapitre Nabla par sous-partie officielle (des regroupements restent
possibles, notés ci-dessous — à arbitrer par Victor chapitre par chapitre).

### Thème 1 — Constitution et transformations de la matière

| Chapitre Nabla | Sous-partie officielle & contenus | Statut |
|---|---|---|
| La composition d'un système chimique | « Détermination de la composition du système initial à l'aide de grandeurs physiques » : masse molaire, quantité de matière n = m/M ; concentration en quantité de matière c = n/V ; volume molaire des gaz ; absorbance, loi de Beer-Lambert, dosage par étalonnage. | ✅ `premiere/physique-chimie/composition-systeme/` |
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

## À vérifier (accès aux textes officiels bloqué depuis cet environnement)

Les sites education.gouv.fr, eduscol et Légifrance étaient inaccessibles
depuis la sandbox (politique réseau) ; la synthèse maths 2026 ci-dessus est
recoupée de plusieurs sources secondaires concordantes. À la première
session avec accès (ou par Victor) :

1. Télécharger l'**annexe officielle du programme 2026 de spé maths de
   Première** (PDF ~346 Ko sur la page MENE2602917A) et vérifier :
   le contour exact de la partie **statistiques/données** ; la liste
   officielle des **automatismes** ; la formulation exacte de
   l'**approximation affine** et de la **succession d'épreuves de
   Bernoulli** ; qu'aucun autre contenu n'a bougé (notamment variables
   aléatoires et géométrie repérée, confirmés seulement par sources
   secondaires).
2. Confirmer qu'**aucun nouvel arrêté physique-chimie** n'est paru pour la
   Première après le BO spécial n°1 du 22-01-2019 (rien trouvé en juillet
   2026).
3. Reporter ici toute correction, avec la date de vérification en tête de
   fichier.
