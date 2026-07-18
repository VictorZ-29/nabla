/* Nabla — widgets/geo-normale.js
   « La droite au bout de la flèche » : A est fixé, l'élève fait tourner le
   vecteur normal n (aimanté aux nœuds de la grille) et la droite passant
   par A perpendiculaire à n suit ; l'équation ax + by + c = 0 se réécrit en
   direct — les coefficients de x et de y SONT les coordonnées de n. Tous
   les nombres affichés sont entiers par construction (aimantation).
   Spec de l'instance : premiere/maths/geometrie-reperee/README.md. */

import {
  el, creerVue, grilleUnite, axes, clamp, rendreDraggable, creerHint,
  creerVecteur, etiquetteVecteur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const ent = (n) => (n < 0 ? `−${-n}` : `${n}`);
const parenthese = (n) => (n < 0 ? `(−${-n})` : `${n}`);

/* Un terme de « ax + by + c = 0 » : coefficient 1 muet, terme nul omis. */
function terme(coef, lettre, premier) {
  if (coef === 0) return '';
  const abs = Math.abs(coef);
  const corps = lettre ? (abs === 1 ? lettre : `${abs}${lettre}`) : String(abs);
  if (premier) return (coef < 0 ? '−' : '') + corps;
  return (coef < 0 ? ' − ' : ' + ') + corps;
}

function initGeoNormale(fig) {
  const d = fig.dataset;
  const A = [+d.ax, +d.ay];
  const nInit = d.nInit.split(',').map(Number);
  const n = nInit.slice();               // l'état vivant : n = (a ; b) entiers

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });
  const axPx = vue.xPx(A[0]);
  const ayPx = vue.yPx(A[1]);
  const [nxMin, nxMax] = d.nxDom.split(',').map(Number);
  const [nyMin, nyMax] = d.nyDom.split(',').map(Number);

  /* --- décor statique ------------------------------------------------------ */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);

  /* --- éléments dynamiques -------------------------------------------------- */
  const droite = el('path', { class: 'g-courbe' }, svg);
  const marqueDroit = el('path', { class: 'marque-droit' }, svg);
  const vecN = creerVecteur(svg, { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' });
  const labN = etiquetteVecteur(svg, 'n', 'accent');
  el('circle', { class: 'pt-fixe', cx: axPx, cy: ayPx, r: 5 }, svg);
  const labA = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: axPx - 10, y: ayPx + 22, 'text-anchor': 'middle',
  }, svg);
  labA.textContent = 'A';

  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const pt = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Extrémité du vecteur normal n — flèches gauche et droite pour la première coordonnée, haut et bas pour la seconde',
    'aria-valuemin': String(nxMin), 'aria-valuemax': String(nxMax),
  }, svg);

  const tx0 = vue.xPx(A[0] + nInit[0]);
  const ty0 = vue.yPx(A[1] + nInit[1]);
  const hint = creerHint(svg, {
    x: tx0 + 22.4, y: ty0 - 59.1,
    filDe: [tx0 + 24.4, ty0 - 37.1], filVers: [tx0 + 5.4, ty0 - 6.1],
  });

  /* --- lectures ------------------------------------------------------------ */
  const ligne1 = fig.querySelector('.js-ligne1');
  const ligne2 = fig.querySelector('.js-ligne2');
  const elN = fig.querySelector('.js-n');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');

  function rendre() {
    const [a, b] = n;
    const c = -(a * A[0] + b * A[1]);
    const L = Math.hypot(a, b);
    /* directions unitaires en pixels : n et la droite (perpendiculaire) */
    const nx = a / L;
    const ny = -b / L;                   // y écran inversé
    const ux = -b / L;
    const uy = -a / L;

    const tipX = vue.xPx(A[0] + a);
    const tipY = vue.yPx(A[1] + b);
    vecN.maj(axPx, ayPx, tipX, tipY);
    halo.setAttribute('cx', tipX); halo.setAttribute('cy', tipY);
    pt.setAttribute('cx', tipX); pt.setAttribute('cy', tipY);
    hit.setAttribute('cx', tipX); hit.setAttribute('cy', tipY);
    const lx = clamp(tipX + nx * 26, 14, vue.largeur - 14);
    const ly = clamp(tipY + ny * 26 + 6, 30, vue.hauteur - 8);
    labN.maj(lx, ly);

    /* la droite : A ± 25 unités le long de la direction (le SVG rogne) */
    const T = 25 * vue.pxParX;
    droite.setAttribute('d',
      `M${axPx - ux * T} ${ayPx - uy * T}L${axPx + ux * T} ${ayPx + uy * T}`);

    /* petite équerre entre n et la droite, au point A */
    const q = 12;
    marqueDroit.setAttribute('d',
      `M${axPx + nx * q} ${ayPx + ny * q}` +
      `L${axPx + (nx + ux) * q} ${ayPx + (ny + uy) * q}` +
      `L${axPx + ux * q} ${ayPx + uy * q}`);

    const eq = `${terme(a, 'x', true)}${terme(b, 'y', !a)}${terme(c, '', false)} = 0`;
    ligne1.textContent = `d : ${eq}`;
    ligne2.textContent =
      `${parenthese(a)}×${ent(A[0])} + ${parenthese(b)}×${ent(A[1])}` +
      `${c ? (c < 0 ? ` − ${-c}` : ` + ${c}`) : ''} = 0 — A est bien sur d`;
    elN.textContent = `(${ent(a)} ; ${ent(b)})`;

    if (b === 0) {
      elEtat.textContent = 'équation sans y — droite verticale';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'Plus de y dans l’équation : la droite est verticale. Impossible à écrire en y = mx + p, naturel en équation cartésienne.';
    } else if (a === 0) {
      elEtat.textContent = 'équation sans x — droite horizontale';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'Plus de x dans l’équation : la droite est horizontale, à hauteur constante.';
    } else {
      elEtat.textContent = 'équation complète — droite oblique';
      elEtat.className = 'chip js-etat';
      legende.textContent = 'Les coefficients de x et de y, lus dans l’ordre, sont exactement les coordonnées de n. Tourne n : l’équation suit.';
    }

    hit.setAttribute('aria-valuenow', String(a));
    hit.setAttribute('aria-valuetext', `n = (${ent(a)} ; ${ent(b)}), droite d : ${eq}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'geo-normale', chapitre });
  }

  /* Aimantation au nœud le plus proche ; le vecteur nul est refusé. */
  function poser(x, y) {
    x = clamp(Math.round(x), nxMin, nxMax);
    y = clamp(Math.round(y), nyMin, nyMax);
    if (x === 0 && y === 0) return;
    n[0] = x;
    n[1] = y;
    rendre();
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
      const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
      poser(vue.xDe(px) - A[0], vue.yMax - py / vue.pxParY - A[1]);
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
    poser(n[0] + dx, n[1] + dy);
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    n[0] = nInit[0];
    n[1] = nInit[1];
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="geo-normale"]')) initGeoNormale(fig);
