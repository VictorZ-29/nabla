/* Nabla — recherche-data.js
   Index de recherche de l'accueil, maintenu À LA MAIN : une entrée par
   chapitre en ligne + une entrée par section de cours (s1–s5).
   À mettre à jour dans le même commit que la mise en ligne d'un chapitre
   (étape « Register » du skill nabla-topic).

   `mots` : mots-clés de recherche invisibles (synonymes, notations, termes
   du programme). Pas besoin d'accents ni de casse cohérents — la recherche
   normalise — mais on écrit en français correct pour rester lisible. */

export const CHAPITRES = [

  /* ---------------- Première · Spé Maths ---------------- */

  {
    titre: 'Les suites numériques',
    url: 'premiere/maths/suites/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'suite terme rang indice récurrence arithmétique géométrique raison somme sens de variation exercices corrigés',
    sections: [
      { id: 's1', titre: 'Une liste de nombres numérotés', mots: 'suite terme indice rang notation u indice n' },
      { id: 's2', titre: 'Deux façons de fabriquer une suite', mots: 'forme explicite relation de récurrence u(n+1) premier terme' },
      { id: 's3', titre: 'Les suites arithmétiques', mots: 'arithmétique raison r terme général somme des termes 1+2+…+n' },
      { id: 's4', titre: 'Les suites géométriques', mots: 'géométrique raison q terme général somme des puissances' },
      { id: 's5', titre: 'Le sens de variation', mots: 'croissante décroissante monotone signe de u(n+1)−u(n)' },
    ],
  },
  {
    titre: 'Le second degré',
    url: 'premiere/maths/second-degre/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'trinôme polynôme parabole forme canonique sommet discriminant delta racines factorisation signe inéquation exercices corrigés',
    sections: [
      { id: 's1', titre: 'La courbe du ballon', mots: 'parabole fonction polynôme du second degré ax²+bx+c allure' },
      { id: 's2', titre: 'Attrape le sommet', mots: 'sommet forme canonique alpha bêta axe de symétrie variations extremum' },
      { id: 's3', titre: 'Le discriminant', mots: 'discriminant delta b²−4ac racines équation du second degré solutions' },
      { id: 's4', titre: 'Factoriser, lire le signe', mots: 'forme factorisée factorisation signe du trinôme tableau de signes' },
      { id: 's5', titre: 'Les inéquations', mots: 'inéquation du second degré résoudre signe' },
    ],
  },
  {
    titre: 'La dérivation',
    url: 'premiere/maths/derivation/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'dérivée nombre dérivé tangente taux de variation sécante pente variations extremum fonction dérivée exercices corrigés',
    sections: [
      { id: 's1', titre: 'À quelle vitesse, exactement ?', mots: 'taux de variation vitesse moyenne accroissement corde' },
      { id: 's2', titre: 'Resserre les deux points', mots: 'sécante h tend vers 0 limite nombre dérivé f′(a)' },
      { id: 's3', titre: 'La tangente à une courbe', mots: 'tangente équation de la tangente y = f′(a)(x−a)+f(a) pente' },
      { id: 's4', titre: 'Dérivées usuelles et opérations', mots: 'dérivées usuelles tableau somme produit quotient inverse x² racine carrée' },
      { id: 's5', titre: 'Signe de f′ et variations', mots: 'signe de la dérivée tableau de variations croissante décroissante extremum minimum maximum' },
    ],
  },
  {
    titre: 'La fonction exponentielle',
    url: 'premiere/maths/exponentielle/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'exponentielle exp nombre e croissance décroissance équation inéquation dérivée exercices corrigés',
    sections: [
      { id: 's1', titre: 'Plus il y en a, plus ça pousse', mots: 'croissance multiplicative doublement modèle' },
      { id: 's2', titre: 'La courbe qui est sa propre pente', mots: 'définition f′ = f exp(0) = 1 pente tangente' },
      { id: 's3', titre: 'Le nombre e et les règles', mots: 'nombre e 2,718 règles de calcul exp(a+b) propriétés algébriques puissances' },
      { id: 's4', titre: 'Croître ou fondre : eᵏˣ', mots: 'e^(kx) k positif négatif croissance décroissance modélisation' },
      { id: 's5', titre: 'Étudier une fonction avec exp', mots: 'étude de fonction dérivée variations équations inéquations avec exponentielle' },
    ],
  },
  {
    titre: 'La trigonométrie',
    url: 'premiere/maths/trigonometrie/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'trigonométrie cercle trigonométrique radian degré cosinus sinus cos sin valeurs remarquables angles associés mesure principale exercices corrigés',
    sections: [
      { id: 's1', titre: 'Un tour de grande roue', mots: 'grande roue cercle de rayon 1 distance parcourue arc périmètre 2π' },
      { id: 's2', titre: 'Enrouler la droite sur le cercle', mots: 'enroulement droite des réels cercle trigonométrique sens direct radian conversion degrés 180° = π rad' },
      { id: 's3', titre: 'Cosinus et sinus', mots: 'cosinus sinus coordonnées abscisse ordonnée cos²t + sin²t = 1 identité signes quadrants périodicité mesure principale' },
      { id: 's4', titre: 'Les valeurs remarquables', mots: 'valeurs exactes remarquables π/6 π/4 π/3 racine de 2 sur 2 racine de 3 sur 2 tableau' },
      { id: 's5', titre: 'Les angles associés', mots: 'angles associés opposé −t π−t π+t π/2−t symétries signes complémentaires' },
    ],
  },
  {
    titre: 'Le produit scalaire',
    url: 'premiere/maths/produit-scalaire/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'produit scalaire vecteur norme angle cosinus projeté orthogonal orthogonalité Al-Kashi coordonnées exercices corrigés',
    sections: [
      { id: 's1', titre: 'Tirer dans le bon sens', mots: 'travail force direction intuition définition' },
      { id: 's2', titre: 'L’ombre d’un vecteur', mots: 'projeté orthogonal projection norme angle cosinus u·v' },
      { id: 's3', titre: 'Avec des coordonnées', mots: 'coordonnées base orthonormée xx′+yy′ norme d’un vecteur' },
      { id: 's4', titre: 'L’orthogonalité', mots: 'vecteurs orthogonaux produit scalaire nul perpendiculaire' },
      { id: 's5', titre: 'Al-Kashi', mots: 'théorème d’Al-Kashi triangle quelconque angle généralisation de Pythagore' },
    ],
  },
  {
    titre: 'La géométrie repérée',
    url: 'premiere/maths/geometrie-reperee/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'géométrie repérée vecteur normal équation de droite équation cartésienne projeté orthogonal distance point droite équation de cercle centre rayon cercle de diamètre exercices corrigés',
    sections: [
      { id: 's1', titre: 'La ville en coordonnées', mots: 'repère orthonormé coordonnées distance entre deux points formule racine' },
      { id: 's2', titre: 'Le vecteur normal', mots: 'vecteur normal directeur équation cartésienne ax+by+c=0 droites parallèles perpendiculaires' },
      { id: 's3', titre: 'Le projeté orthogonal', mots: 'projeté orthogonal pied de la perpendiculaire distance d’un point à une droite système' },
      { id: 's4', titre: 'L’équation du cercle', mots: 'équation de cercle centre rayon forme canonique reconnaître appartenance' },
      { id: 's5', titre: 'Le cercle de diamètre [AB]', mots: 'cercle de diamètre MA·MB=0 angle droit triangle rectangle inscrit milieu' },
    ],
  },
  {
    titre: 'Les probabilités conditionnelles',
    url: 'premiere/maths/probabilites-conditionnelles/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'probabilité conditionnelle sachant arbre pondéré tableau croisé probabilités totales indépendance exercices corrigés',
    sections: [
      { id: 's1', titre: 'L’information change les chances', mots: 'conditionnement information probabilité' },
      { id: 's2', titre: '« Sachant que » : l’univers rétrécit', mots: 'probabilité conditionnelle P_A(B) sachant univers restreint' },
      { id: 's3', titre: 'L’arbre pondéré', mots: 'arbre pondéré branches multiplication des probabilités' },
      { id: 's4', titre: 'Les probabilités totales', mots: 'formule des probabilités totales partition chemins' },
      { id: 's5', titre: 'L’indépendance', mots: 'événements indépendants indépendance P(A∩B) = P(A)×P(B)' },
    ],
  },
  {
    titre: 'Les variables aléatoires',
    url: 'premiere/maths/variables-aleatoires/',
    niveau: 'Première',
    matiere: 'Spé Maths',
    mots: 'variable aléatoire loi de probabilité espérance variance écart type gain jeu Bernoulli épreuve répétée exercices corrigés',
    sections: [
      { id: 's1', titre: 'La roue de la kermesse', mots: 'jeu de hasard gain net mise issues équiprobables' },
      { id: 's2', titre: 'La loi de probabilité', mots: 'variable aléatoire loi de probabilité P(X=x) tableau somme des probabilités égale 1' },
      { id: 's3', titre: 'L’espérance', mots: 'espérance E(X) moyenne pondérée gain moyen jeu équitable favorable défavorable simulation' },
      { id: 's4', titre: 'Variance et écart type', mots: 'variance V(X) écart type sigma dispersion risque E(X²) moins E(X)²' },
      { id: 's5', titre: 'Répéter une épreuve', mots: 'épreuve de Bernoulli succès échec répétition indépendante arbre nombre de succès au moins un' },
    ],
  },

  /* ---------------- Première · Spé Physique-Chimie ---------------- */

  {
    titre: 'La composition d’un système chimique',
    url: 'premiere/physique-chimie/composition-systeme/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'mole masse molaire quantité de matière concentration dilution volume molaire gaz absorbance Beer-Lambert dosage étalonnage exercices corrigés',
    sections: [
      { id: 's1', titre: 'Compter l’invisible', mots: 'quantité de matière mole constante d’Avogadro entités' },
      { id: 's2', titre: 'Mole et masse molaire', mots: 'masse molaire M n = m/M grammes par mole' },
      { id: 's3', titre: 'Concentration et dilution', mots: 'concentration c = n/V dilution solution mère facteur de dilution' },
      { id: 's4', titre: 'Le volume molaire des gaz', mots: 'volume molaire Vm n = V/Vm gaz' },
      { id: 's5', titre: 'Doser avec la lumière', mots: 'absorbance spectrophotométrie loi de Beer-Lambert dosage par étalonnage droite d’étalonnage' },
    ],
  },
  {
    titre: 'La réaction chimique et l’avancement',
    url: 'premiere/physique-chimie/reaction-avancement/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'réaction chimique équation avancement tableau réactif limitant stœchiométrie mélange stœchiométrique bilan de matière exercices corrigés',
    sections: [
      { id: 's1', titre: 'La recette de cuisine', mots: 'équation de réaction coefficients stœchiométriques ajuster réactifs produits' },
      { id: 's2', titre: 'L’avancement x', mots: 'avancement tableau d’avancement état initial intermédiaire final' },
      { id: 's3', titre: 'Le réactif limitant', mots: 'réactif limitant x_max en excès' },
      { id: 's4', titre: 'Le mélange stœchiométrique', mots: 'mélange stœchiométrique proportions des réactifs' },
      { id: 's5', titre: 'Le bilan de matière', mots: 'bilan de matière quantités finales composition du système' },
    ],
  },
  {
    titre: 'L’oxydoréduction et les titrages',
    url: 'premiere/physique-chimie/oxydoreduction-titrages/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'oxydoréduction redox oxydant réducteur couple demi-équation électronique transfert d’électrons titrage colorimétrique équivalence burette exercices corrigés',
    sections: [
      { id: 's1', titre: 'Un clou dans le bleu', mots: 'clou de fer sulfate de cuivre dépôt rouge couleur qui pâlit' },
      { id: 's2', titre: 'Le transfert d’électrons', mots: 'oxydant réducteur couple oxydation réduction gain perte d’électrons Ox/Red' },
      { id: 's3', titre: 'Les demi-équations', mots: 'demi-équation électronique ajuster H+ H2O électrons milieu acide permanganate' },
      { id: 's4', titre: 'L’équation d’oxydoréduction', mots: 'équation d’oxydoréduction combiner demi-équations égaliser les électrons multiplicateurs' },
      { id: 's5', titre: 'Le titrage colorimétrique', mots: 'titrage équivalence burette changement de couleur réactif limitant relation à l’équivalence volume équivalent concentration' },
    ],
  },
  {
    titre: 'Le mouvement d’un système',
    url: 'premiere/physique-chimie/mouvement-systeme/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'mouvement vecteur vitesse variation de vitesse chronophotographie somme des forces inertie masse Newton exercices corrigés',
    sections: [
      { id: 's1', titre: 'Le lancer au ralenti', mots: 'chronophotographie positions intervalle de temps trajectoire' },
      { id: 's2', titre: 'Le vecteur vitesse', mots: 'vecteur vitesse direction sens norme v = d/Δt' },
      { id: 's3', titre: 'La variation de vitesse', mots: 'vecteur variation de vitesse Δv delta v construction' },
      { id: 's4', titre: 'Le lien avec les forces', mots: 'somme des forces ΣF lien avec Δv deuxième loi de Newton' },
      { id: 's5', titre: 'Le rôle de la masse', mots: 'masse inertie même force effet différent' },
    ],
  },
  {
    titre: 'L’énergie mécanique',
    url: 'premiere/physique-chimie/energie-mecanique/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'énergie cinétique potentielle pesanteur mécanique travail d’une force théorème conservation frottements exercices corrigés',
    sections: [
      { id: 's1', titre: 'La rampe du skatepark', mots: 'hauteur vitesse transformation d’énergie' },
      { id: 's2', titre: 'Cinétique et potentielle', mots: 'énergie cinétique Ec = ½mv² énergie potentielle de pesanteur Epp = mgh' },
      { id: 's3', titre: 'Le travail d’une force', mots: 'travail W = F·d·cos moteur résistant travail du poids' },
      { id: 's4', titre: 'Le théorème de l’énergie cinétique', mots: 'théorème de l’énergie cinétique ΔEc somme des travaux' },
      { id: 's5', titre: 'Conservation… et fuite', mots: 'énergie mécanique Em conservation frottements dissipation' },
    ],
  },
  {
    titre: 'Les ondes mécaniques',
    url: 'premiere/physique-chimie/ondes-mecaniques/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'onde mécanique progressive périodique célérité retard période fréquence longueur d’onde lambda signal exercices corrigés',
    sections: [
      { id: 's1', titre: 'La ola du stade', mots: 'onde perturbation propagation sans transport de matière' },
      { id: 's2', titre: 'L’onde et la célérité', mots: 'célérité v = d/t vitesse de propagation onde progressive' },
      { id: 's3', titre: 'Le retard', mots: 'retard τ = d/v tau' },
      { id: 's4', titre: 'La photo et le film', mots: 'période T fréquence f longueur d’onde λ double périodicité' },
      { id: 's5', titre: 'La relation λ = v × T', mots: 'λ = vT longueur d’onde célérité période lambda' },
    ],
  },
  {
    titre: 'Lentilles, images et couleurs',
    url: 'premiere/physique-chimie/lentilles-couleurs/',
    niveau: 'Première',
    matiere: 'Spé Physique-Chimie',
    mots: 'lentille mince convergente image relation de conjugaison grandissement gamma foyer distance focale loupe synthèse additive soustractive couleur des objets lumière exercices corrigés',
    sections: [
      { id: 's1', titre: 'L’image sur le mur', mots: 'lentille convergente loupe image foyer F F’ distance focale axe optique' },
      { id: 's2', titre: 'Construis l’image', mots: 'construction rayons centre optique image réelle virtuelle droite renversée' },
      { id: 's3', titre: 'Conjugaison et grandissement', mots: 'relation de conjugaison 1/OA’ − 1/OA = 1/f’ grandissement gamma mesures algébriques' },
      { id: 's4', titre: 'Les deux synthèses', mots: 'synthèse additive soustractive rouge vert bleu cyan magenta jaune filtres couleurs complémentaires blanc' },
      { id: 's5', titre: 'La couleur des objets', mots: 'couleur perçue absorption diffusion transmission objet éclairé lumière colorée' },
    ],
  },
];
