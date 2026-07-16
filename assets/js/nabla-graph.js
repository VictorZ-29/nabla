/* Nabla — nabla-graph.js
   Aide SVG partagée par tous les widgets : repère maths ↔ pixels, grille et
   axes dérivés des tokens (via classes CSS), échantillonnage de fonctions en
   polylignes, formatage français, aides au drag et aux animations.
   Toutes les maths sont analytiques : f et f′ viennent du registre FONCTIONS,
   jamais d'une dérivation numérique. */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Registre des fonctions de référence. Un widget est instancié avec
   data-fn="<clé>" ; ajouter une entrée ici suffit pour un nouveau chapitre. */
export const FONCTIONS = {
  'x3-3x': {
    f: (x) => x * x * x - 3 * x,
    fp: (x) => 3 * x * x - 3,
  },
  /* Lecture graphique de f′(a) (§3) — A et le triangle tombent sur des
     nœuds du quadrillage : f(a) et f′(a) entiers pour chaque manche */
  'x2-x': { f: (x) => x * x - x, fp: (x) => 2 * x - 1 },
  'x2-2': { f: (x) => x * x - 2, fp: (x) => 2 * x },
  'x2-1': { f: (x) => x * x - 1, fp: (x) => 2 * x },
  '1-x2s4': { f: (x) => 1 - x * x / 4, fp: (x) => -x / 2 },
  '2-x2': { f: (x) => 2 - x * x, fp: (x) => -2 * x },
  /* Association f ↔ f′ (§4) — 'x2-1' sert aussi de fonction du haut */
  'x3s3-x': { f: (x) => x * x * x / 3 - x, fp: (x) => x * x - 1 },
  '1-x2s2': { f: (x) => 1 - x * x / 2, fp: (x) => -x },
  /* La fonction exponentielle (chapitre 04) — sa propre dérivée */
  'exp': { f: Math.exp, fp: Math.exp },
};

/* Crée un élément SVG avec attributs, et l'ajoute à parent s'il est fourni. */
export function el(nom, attrs = {}, parent) {
  const e = document.createElementNS(SVG_NS, nom);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

/* Repère : transforme maths ↔ pixels d'après le viewBox du SVG. */
export function creerVue(svg, { xMin, xMax, yMin, yMax }) {
  const vb = svg.viewBox.baseVal;
  const largeur = vb.width;
  const hauteur = vb.height;
  const pxParX = largeur / (xMax - xMin);
  const pxParY = hauteur / (yMax - yMin);
  const vue = {
    svg, largeur, hauteur, xMin, xMax, yMin, yMax, pxParX, pxParY,
    xPx: (x) => (x - xMin) * pxParX,
    yPx: (y) => (yMax - y) * pxParY,
    xDe: (px) => xMin + px / pxParX,
    /* Abscisse maths sous le pointeur (le SVG est redimensionné par CSS). */
    xDePointeur(evt) {
      const r = svg.getBoundingClientRect();
      return vue.xDe(((evt.clientX - r.left) / r.width) * largeur);
    },
  };
  return vue;
}

const arrondi = (v) => Math.round(v * 10) / 10;

/* Échantillonne f en polyligne (≥ 120 points par défaut). */
export function cheminCourbe(vue, f, x0, x1, n = 140) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push(`${arrondi(vue.xPx(x))} ${arrondi(vue.yPx(f(x)))}`);
  }
  return 'M' + pts.join('L');
}

/* Grille unitaire (un trait par unité maths, axes exclus). */
export function grilleUnite(vue) {
  const seg = [];
  for (let x = Math.ceil(vue.xMin); x <= Math.floor(vue.xMax); x++) {
    if (x === 0) continue;
    const px = arrondi(vue.xPx(x));
    seg.push(`M${px} ${vue.hauteur}L${px} 0`);
  }
  for (let y = Math.ceil(vue.yMin); y <= Math.floor(vue.yMax); y++) {
    if (y === 0) continue;
    const py = arrondi(vue.yPx(y));
    seg.push(`M0 ${py}L${vue.largeur} ${py}`);
  }
  return seg.join('');
}

/* Axes x et y. */
export function axes(vue) {
  return `M0 ${arrondi(vue.yPx(0))}L${vue.largeur} ${arrondi(vue.yPx(0))}` +
         `M${arrondi(vue.xPx(0))} ${vue.hauteur}L${arrondi(vue.xPx(0))} 0`;
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/* Formatage français : virgule décimale, vrai signe moins (U+2212). */
export function fmt(v, dec = 2) {
  let s = Math.abs(v) < 5e-13 ? (0).toFixed(dec) : v.toFixed(dec); // évite « −0,00 »
  return s.replace('-', '−').replace('.', ',');
}

/* Deux décimales par défaut, trois pour les très petites valeurs non nulles
   (lecture du numérateur quand h est petit, cf. design : « 0,014 »). */
export function fmtAdaptatif(v) {
  return fmt(v, Math.abs(v) > 5e-13 && Math.abs(v) < 0.1 ? 3 : 2);
}

/* « 4,00 » → « 4 », « 0,50 » → « 0,5 » : pour les réglages à pas ronds
   (curseurs u0/r/q des widgets de suites). */
export function fmtCourt(v, dec = 2) {
  return fmt(v, dec).replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');
}

export function mouvementReduit() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Anime une valeur numérique (préréglages) ; saut direct si mouvement réduit.
   Retourne une poignée avec .stop(). */
export function animerValeur({ de, vers, duree = 450, surFrame, surFin }) {
  if (mouvementReduit() || de === vers) {
    surFrame(vers);
    if (surFin) surFin();
    return { stop() {} };
  }
  let rafId = 0;
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const boucle = (t) => {
    const p = clamp((t - t0) / duree, 0, 1);
    surFrame(de + (vers - de) * ease(p));
    if (p < 1) rafId = requestAnimationFrame(boucle);
    else if (surFin) surFin();
  };
  rafId = requestAnimationFrame(boucle);
  return { stop() { cancelAnimationFrame(rafId); } };
}

/* Drag par Pointer Events, coalescé par requestAnimationFrame : le handler de
   déplacement ne fait aucun travail lourd, la mise à jour se fait une fois
   par frame. */
export function rendreDraggable(cible, { surDebut, surDeplacement, surFin }) {
  let dernierEvt = null;
  let rafId = 0;
  const tick = () => {
    rafId = 0;
    if (dernierEvt) surDeplacement(dernierEvt);
  };
  cible.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    cible.setPointerCapture(e.pointerId);
    if (surDebut) surDebut(e);
    dernierEvt = e;
    surDeplacement(e);
  });
  cible.addEventListener('pointermove', (e) => {
    if (!cible.hasPointerCapture || !cible.hasPointerCapture(e.pointerId)) return;
    dernierEvt = e;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });
  const fin = (e) => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    dernierEvt = null;
    if (surFin) surFin(e);
  };
  cible.addEventListener('pointerup', fin);
  cible.addEventListener('pointercancel', fin);
}

/* Vecteur dessiné : trait + pointe triangulaire (chapitre produit scalaire).
   Le trait porte une classe de courbe existante (g-courbe = craie,
   g-courbe-derivee = accent), la pointe une classe de remplissage
   (vec-pointe / vec-pointe--accent). maj() reçoit des PIXELS. */
export function creerVecteur(parent, { classeTrait = 'g-courbe', classePointe = 'vec-pointe' } = {}) {
  const g = el('g', {}, parent);
  const trait = el('path', { class: classeTrait }, g);
  const pointe = el('path', { class: classePointe }, g);
  return {
    g, trait, pointe,
    maj(x1, y1, x2, y2, long = 13, demiLarg = 5) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const L = Math.hypot(dx, dy) || 1;
      const ux = dx / L;
      const uy = dy / L;
      const bx = x2 - ux * long;   // base de la pointe
      const by = y2 - uy * long;
      trait.setAttribute('d', `M${arrondi(x1)} ${arrondi(y1)}L${arrondi(bx)} ${arrondi(by)}`);
      pointe.setAttribute('d',
        `M${arrondi(x2)} ${arrondi(y2)}` +
        `L${arrondi(bx - uy * demiLarg)} ${arrondi(by + ux * demiLarg)}` +
        `L${arrondi(bx + uy * demiLarg)} ${arrondi(by - ux * demiLarg)}Z`);
    },
  };
}

/* Étiquette de vecteur : lettre italique + petite flèche tracée au-dessus
   (pas de caractère combinant U+20D7 dans le SVG — rendu inégal).
   variante : '' | 'accent' | 'muted' (couleurs des classes etiquette-*). */
export function etiquetteVecteur(parent, lettre, variante = '') {
  const suffixe = variante ? `--${variante}` : '';
  const g = el('g', {}, parent);
  const texte = el('text', {
    class: `etiquette-math${variante ? ` etiquette-math${suffixe}` : ''}`,
    'font-size': 17, 'text-anchor': 'middle',
  }, g);
  texte.textContent = lettre;
  const fleche = el('path', {
    class: `etiquette-vec-fleche${variante ? ` etiquette-vec-fleche${suffixe}` : ''}`,
  }, g);
  return {
    g,
    maj(x, y) {
      texte.setAttribute('x', x);
      texte.setAttribute('y', y);
      /* flèche de 12 px au-dessus de la lettre, pointe à droite */
      const fy = y - 15;
      fleche.setAttribute('d',
        `M${arrondi(x - 6)} ${arrondi(fy)}L${arrondi(x + 6)} ${arrondi(fy)}` +
        `M${arrondi(x + 2.6)} ${arrondi(fy - 2.6)}L${arrondi(x + 6)} ${arrondi(fy)}L${arrondi(x + 2.6)} ${arrondi(fy + 2.6)}`);
    },
  };
}

/* Texte de formule chimique dans un SVG : les chiffres qui suivent une
   lettre deviennent des indices (tspan abaissé, corps réduit) — pas de
   caractères Unicode indice, couverture de police inégale. « 2 H2O » :
   le 2 de tête reste plein corps, celui de H2 descend. (chapitre
   avancement, physique-chimie). */
export function texteChimie(parent, formule, attrs = {}) {
  const t = el('text', attrs, parent);
  let precedent = '';
  let abaisse = false;
  for (const m of formule.matchAll(/\d+|\D+/g)) {
    const seg = m[0];
    const indice = /^\d+$/.test(seg) && /[A-Za-z)]$/.test(precedent);
    const attrsTspan = {};
    if (indice) {
      attrsTspan['font-size'] = '0.72em';
      if (!abaisse) attrsTspan.dy = 4;
    } else if (abaisse) {
      attrsTspan.dy = -4;
    }
    const ts = el('tspan', attrsTspan, t);
    ts.textContent = seg;
    abaisse = indice;
    precedent = seg;
  }
  return t;
}

/* Étiquette « glisse-moi » (indice de première interaction). */
export function creerHint(parent, { x, y, filDe, filVers }) {
  const g = el('g', { class: 'hint-tag', 'aria-hidden': 'true' }, parent);
  el('path', { class: 'hint-fil', d: `M${filDe[0]} ${filDe[1]}L${filVers[0]} ${filVers[1]}` }, g);
  el('rect', { class: 'hint-fond', x, y, width: 82, height: 22, rx: 5 }, g);
  const t = el('text', { class: 'hint-texte', x: x + 41, y: y + 15, 'text-anchor': 'middle' }, g);
  t.textContent = 'glisse-moi';
  return g;
}
