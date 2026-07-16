/* Nabla — widgets/ps-coordonnees.js
   « Le produit scalaire sans rapporteur » : deux vecteurs dont les
   extrémités s'aimantent aux nœuds de la grille (coordonnées entières).
   La ligne de lecture recalcule xx′ + yy′ en direct ; le défi de la page
   est d'amener le produit à zéro — l'angle droit apparaît alors sur la
   grille, marqué au sommet. Tous les nombres affichés sont des entiers
   exacts par construction (aimantation).
   Spec de l'instance : premiere/maths/produit-scalaire/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, rendreDraggable, creerHint,
  creerVecteur, etiquetteVecteur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Entier affiché : vrai moins, parenthèses sur les négatifs dans un calcul. */
const ent = (n) => (n < 0 ? `−${-n}` : `${n}`);
const parenthese = (n) => (n < 0 ? `(−${-n})` : `${n}`);

function initPsCoordonnees(fig) {
  const d = fig.dataset;
  const uInit = d.uInit.split(',').map(Number);
  const vInit = d.vInit.split(',').map(Number);
  const u = uInit.slice();               // l'état vivant : deux couples entiers
  const v = vInit.slice();

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });
  const ox = vue.xPx(0);
  const oy = vue.yPx(0);
  const xMaxDom = vue.xMax - 1;          // les extrémités restent à 1 unité du bord
  const yMaxDom = vue.yMax - 1;

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);

  /* --- éléments dynamiques -------------------------------------------------- */
  const marqueDroit = el('path', { class: 'marque-droit' }, svg);
  const vecU = creerVecteur(svg, { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
  const vecV = creerVecteur(svg, { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' });
  const labU = etiquetteVecteur(svg, 'u');
  const labV = etiquetteVecteur(svg, 'v', 'accent');

  const boutU = { vec: u, hint: null };
  const boutV = { vec: v, hint: null };
  for (const bout of [boutU, boutV]) {
    const accent = bout === boutV;
    bout.halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
    bout.pt = el('circle', { class: accent ? 'pt-point' : 'pt-fixe', r: 5.5 }, svg);
    bout.hit = el('circle', {
      class: 'hit-zone', r: 42,
      tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
      'aria-label': accent
        ? 'Extrémité du vecteur v — flèches gauche et droite pour la première coordonnée, haut et bas pour la seconde'
        : 'Extrémité du vecteur u — flèches gauche et droite pour la première coordonnée, haut et bas pour la seconde',
      'aria-valuemin': String(vue.xMin + 1), 'aria-valuemax': String(xMaxDom),
    }, svg);
  }

  const vx0 = vue.xPx(vInit[0]);
  const vy0 = vue.yPx(vInit[1]);
  const hint = creerHint(svg, {
    x: vx0 + 22.4, y: vy0 - 59.1,
    filDe: [vx0 + 24.4, vy0 - 37.1], filVers: [vx0 + 5.4, vy0 - 6.1],
  });

  /* --- lectures ------------------------------------------------------------ */
  const ligne = fig.querySelector('.js-ligne');
  const elU = fig.querySelector('.js-u');
  const elV = fig.querySelector('.js-v');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');

  function rendre() {
    const produit = u[0] * v[0] + u[1] * v[1];

    for (const bout of [boutU, boutV]) {
      const [x, y] = bout.vec;
      const px = vue.xPx(x);
      const py = vue.yPx(y);
      bout.halo.setAttribute('cx', px); bout.halo.setAttribute('cy', py);
      bout.pt.setAttribute('cx', px); bout.pt.setAttribute('cy', py);
      bout.hit.setAttribute('cx', px); bout.hit.setAttribute('cy', py);
      /* étiquette au-delà de la pointe, ramenée dans la vue */
      const L = Math.hypot(px - ox, py - oy) || 1;
      const lx = clamp(px + ((px - ox) / L) * 26, 14, vue.largeur - 14);
      const ly = clamp(py + ((py - oy) / L) * 26 + 6, 30, vue.hauteur - 8);
      (bout === boutU ? labU : labV).maj(lx, ly);
      bout.hit.setAttribute('aria-valuenow', String(bout.vec[0]));
      bout.hit.setAttribute('aria-valuetext',
        `${bout === boutU ? 'u' : 'v'} = (${ent(bout.vec[0])} ; ${ent(bout.vec[1])}), produit scalaire ${ent(produit)}`);
    }
    vecU.maj(ox, oy, vue.xPx(u[0]), vue.yPx(u[1]));
    vecV.maj(ox, oy, vue.xPx(v[0]), vue.yPx(v[1]));

    ligne.textContent =
      `u·v = ${parenthese(u[0])}×${parenthese(v[0])} + ${parenthese(u[1])}×${parenthese(v[1])} = ${ent(produit)}`;
    elU.textContent = `(${ent(u[0])} ; ${ent(u[1])})`;
    elV.textContent = `(${ent(v[0])} ; ${ent(v[1])})`;

    if (produit > 0) {
      elEtat.textContent = 'produit > 0 — angle aigu';
      elEtat.className = 'chip chip--good js-etat';
      legende.hidden = true;
    } else if (produit < 0) {
      elEtat.textContent = 'produit < 0 — angle obtus';
      elEtat.className = 'chip chip--bad js-etat';
      legende.hidden = true;
    } else {
      elEtat.textContent = 'produit = 0 — orthogonaux !';
      elEtat.className = 'chip chip--accent js-etat';
      legende.hidden = false;
    }

    /* marque d'angle droit au sommet quand le produit s'annule */
    if (produit === 0) {
      const nU = Math.hypot(u[0], u[1]);
      const nV = Math.hypot(v[0], v[1]);
      const c = 14;                       // côté de la marque, en px
      const ux = (vue.xPx(u[0]) - ox) / (nU * vue.pxParX) * c;
      const uy = (vue.yPx(u[1]) - oy) / (nU * vue.pxParX) * c;
      const wx = (vue.xPx(v[0]) - ox) / (nV * vue.pxParX) * c;
      const wy = (vue.yPx(v[1]) - oy) / (nV * vue.pxParX) * c;
      marqueDroit.setAttribute('d',
        `M${ox + ux} ${oy + uy}L${ox + ux + wx} ${oy + uy + wy}L${ox + wx} ${oy + wy}`);
      marqueDroit.style.display = '';
    } else {
      marqueDroit.style.display = 'none';
    }
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'ps-coordonnees', chapitre });
  }

  /* Aimantation au nœud de grille le plus proche ; (0 ; 0) est refusé. */
  function poser(bout, x, y) {
    x = clamp(Math.round(x), vue.xMin + 1, xMaxDom);
    y = clamp(Math.round(y), vue.yMin + 1, yMaxDom);
    if (x === 0 && y === 0) return;      // pas de vecteur nul : on ne bouge pas
    bout.vec[0] = x;
    bout.vec[1] = y;
    rendre();
  }

  for (const bout of [boutU, boutV]) {
    rendreDraggable(bout.hit, {
      surDebut() { fig.classList.add('drag-actif'); interaction(); },
      surDeplacement(evt) {
        const rect = svg.getBoundingClientRect();
        const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
        const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
        poser(bout, vue.xDe(px), vue.yMax - py / vue.pxParY);
      },
      surFin() { fig.classList.remove('drag-actif'); },
    });

    /* clavier : une unité de grille par appui de flèche */
    bout.hit.addEventListener('keydown', (e) => {
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowRight') dx = 1;
      else if (e.key === 'ArrowLeft') dx = -1;
      else if (e.key === 'ArrowUp') dy = 1;
      else if (e.key === 'ArrowDown') dy = -1;
      else return;
      e.preventDefault();
      interaction();
      poser(bout, bout.vec[0] + dx, bout.vec[1] + dy);
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    u[0] = uInit[0]; u[1] = uInit[1];
    v[0] = vInit[0]; v[1] = vInit[1];
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="ps-coordonnees"]')) initPsCoordonnees(fig);
