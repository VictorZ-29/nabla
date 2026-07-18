/* Nabla — widgets/geo-diametre.js
   « Trois angles droits, un cercle » : A et B sont fixés, l'élève promène M
   de nœud en nœud et lit MA⃗·MB⃗ en direct. Chaque position où le produit
   s'annule est marquée d'un point ; à partir de trois angles droits trouvés,
   la figure qu'ils dessinent se révèle — le cercle de diamètre [AB]. Le jeu
   remplace le widget-jeu à manches des autres chapitres. Données choisies
   pour que le cercle (centre (0 ; 2), rayon 5) passe par dix nœuds entiers
   hors A et B ; le produit est entier partout.
   Spec de l'instance : premiere/maths/geometrie-reperee/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, rendreDraggable, creerHint,
  creerVecteur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const ent = (n) => (n < 0 ? `−${-n}` : `${n}`);
const parenthese = (n) => (n < 0 ? `(−${-n})` : `${n}`);
const SEUIL = 3;                          // angles droits avant la révélation

function initGeoDiametre(fig) {
  const d = fig.dataset;
  const A = d.a.split(',').map(Number);
  const B = d.b.split(',').map(Number);
  const mInit = d.mInit.split(',').map(Number);
  const M = mInit.slice();
  const [mxMin, mxMax] = d.xdom.split(',').map(Number);
  const [myMin, myMax] = d.ydom.split(',').map(Number);
  const I = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const rayon = Math.hypot(B[0] - I[0], B[1] - I[1]);

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  el('path', {
    class: 'g-guide', 'stroke-dasharray': '4 4',
    d: `M${vue.xPx(A[0])} ${vue.yPx(A[1])}L${vue.xPx(B[0])} ${vue.yPx(B[1])}`,
  }, svg);

  /* le cercle caché, révélé après SEUIL angles droits trouvés */
  const cercle = el('circle', {
    class: 'g-courbe', cx: vue.xPx(I[0]), cy: vue.yPx(I[1]), r: rayon * vue.pxParX,
  }, svg);
  cercle.style.display = 'none';

  const traces = el('g', {}, svg);        // les nœuds « angle droit » trouvés

  for (const [pt2, nom] of [[A, 'A'], [B, 'B']]) {
    el('circle', { class: 'pt-fixe', cx: vue.xPx(pt2[0]), cy: vue.yPx(pt2[1]), r: 5 }, svg);
    const lab = el('text', {
      class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
      x: vue.xPx(pt2[0]) + (pt2 === A ? -16 : 16), y: vue.yPx(pt2[1]) - 10,
      'text-anchor': 'middle',
    }, svg);
    lab.textContent = nom;
  }

  /* --- éléments dynamiques -------------------------------------------------- */
  const vecMA = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  const vecMB = creerVecteur(svg, { classeTrait: 'g-tangente', classePointe: 'vec-pointe--accent' });
  const marqueDroit = el('path', { class: 'marque-droit' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const pt = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labM = el('text', {
    class: 'etiquette-math etiquette-math--accent', 'font-size': 15, 'text-anchor': 'middle',
  }, svg);
  labM.textContent = 'M';
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Le point M — flèches gauche et droite pour l’abscisse, haut et bas pour l’ordonnée',
    'aria-valuemin': String(mxMin), 'aria-valuemax': String(mxMax),
  }, svg);

  const mx0 = vue.xPx(mInit[0]);
  const my0 = vue.yPx(mInit[1]);
  const hint = creerHint(svg, {
    x: mx0 + 22.4, y: my0 - 59.1,
    filDe: [mx0 + 24.4, my0 - 37.1], filVers: [mx0 + 5.4, my0 - 6.1],
  });

  /* --- lectures ------------------------------------------------------------ */
  const ligne = fig.querySelector('.js-ligne');
  const elMa = fig.querySelector('.js-ma');
  const elMb = fig.querySelector('.js-mb');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');

  const trouves = new Set();

  function rendre() {
    const ma = [A[0] - M[0], A[1] - M[1]];
    const mb = [B[0] - M[0], B[1] - M[1]];
    const produit = ma[0] * mb[0] + ma[1] * mb[1];

    const mPx = [vue.xPx(M[0]), vue.yPx(M[1])];
    halo.setAttribute('cx', mPx[0]); halo.setAttribute('cy', mPx[1]);
    pt.setAttribute('cx', mPx[0]); pt.setAttribute('cy', mPx[1]);
    hit.setAttribute('cx', mPx[0]); hit.setAttribute('cy', mPx[1]);
    vecMA.maj(mPx[0], mPx[1], vue.xPx(A[0]), vue.yPx(A[1]));
    vecMB.maj(mPx[0], mPx[1], vue.xPx(B[0]), vue.yPx(B[1]));
    /* étiquette M à l'opposé du milieu de [AB] */
    const L = Math.hypot(mPx[0] - vue.xPx(I[0]), mPx[1] - vue.yPx(I[1])) || 1;
    labM.setAttribute('x', clamp(mPx[0] + ((mPx[0] - vue.xPx(I[0])) / L) * 26, 14, vue.largeur - 14));
    labM.setAttribute('y', clamp(mPx[1] + ((mPx[1] - vue.yPx(I[1])) / L) * 26 + 6, 20, vue.hauteur - 8));

    if (produit === 0) {
      /* équerre en M, entre MA⃗ et MB⃗ */
      const la = Math.hypot(ma[0], ma[1]);
      const lb = Math.hypot(mb[0], mb[1]);
      const q = 12;
      const ax = (ma[0] / la) * q;
      const ay = (-ma[1] / la) * q;
      const bx = (mb[0] / lb) * q;
      const by = (-mb[1] / lb) * q;
      marqueDroit.setAttribute('d',
        `M${mPx[0] + ax} ${mPx[1] + ay}` +
        `L${mPx[0] + ax + bx} ${mPx[1] + ay + by}` +
        `L${mPx[0] + bx} ${mPx[1] + by}`);
      marqueDroit.style.display = '';

      const cle = `${M[0]},${M[1]}`;
      if (!trouves.has(cle)) {
        trouves.add(cle);
        el('circle', { class: 'pt-point', cx: mPx[0], cy: mPx[1], r: 3.5 }, traces);
      }
      if (trouves.size >= SEUIL) cercle.style.display = '';
    } else {
      marqueDroit.style.display = 'none';
    }

    ligne.textContent =
      `MA·MB = ${parenthese(ma[0])}×${parenthese(mb[0])} + ${parenthese(ma[1])}×${parenthese(mb[1])} = ${ent(produit)}`;
    elMa.textContent = `(${ent(ma[0])} ; ${ent(ma[1])})`;
    elMb.textContent = `(${ent(mb[0])} ; ${ent(mb[1])})`;

    if (produit > 0) {
      elEtat.textContent = 'produit > 0 — angle aigu';
      elEtat.className = 'chip chip--good js-etat';
    } else if (produit < 0) {
      elEtat.textContent = 'produit < 0 — angle obtus';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'produit nul — angle droit !';
      elEtat.className = 'chip chip--accent js-etat';
    }

    legende.textContent = trouves.size >= SEUIL
      ? 'Les points qui voient [AB] sous un angle droit dessinent un cercle : le cercle de diamètre [AB], centré au milieu de [AB]. A et B en font partie aussi.'
      : trouves.size > 0
        ? `${trouves.size === 1 ? 'Un angle droit trouvé' : 'Deux angles droits trouvés'} — encore ${SEUIL - trouves.size} pour deviner la figure qu'ils dessinent.`
        : 'Promène M et cherche les positions d’où l’on voit [AB] sous un angle droit : produit nul. Il y en a plus d’une.';

    hit.setAttribute('aria-valuenow', String(M[0]));
    hit.setAttribute('aria-valuetext',
      `M = (${ent(M[0])} ; ${ent(M[1])}), produit scalaire MA·MB = ${ent(produit)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'geo-diametre', chapitre });
  }

  /* Aimantation ; M ne peut pas se poser sur A ni sur B (vecteur nul). */
  function poser(x, y) {
    x = clamp(Math.round(x), mxMin, mxMax);
    y = clamp(Math.round(y), myMin, myMax);
    if ((x === A[0] && y === A[1]) || (x === B[0] && y === B[1])) return;
    M[0] = x;
    M[1] = y;
    rendre();
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
      const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
      poser(vue.xDe(px), vue.yMax - py / vue.pxParY);
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowRight') dx = 1;
    else if (e.key === 'ArrowLeft') dx = -1;
    else if (e.key === 'ArrowUp') dy = 1;
    else if (e.key === 'ArrowDown') dy = -1;
    else return;
    e.preventDefault();
    interaction();
    poser(M[0] + dx, M[1] + dy);
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    M[0] = mInit[0];
    M[1] = mInit[1];
    trouves.clear();
    while (traces.firstChild) traces.removeChild(traces.firstChild);
    cercle.style.display = 'none';
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="geo-diametre"]')) initGeoDiametre(fig);
