/* Nabla — widgets/variations.js
   « Le signe de f′ pilote les variations » : un point A déplaçable sur f,
   la tangente en A colorée par le signe de f′ (vert : monte, rouge :
   descend, accent : horizontale), et un tableau de variations vivant sous
   le graphique — la colonne où se trouve A s'allume. L'abscisse affichée
   s'aimante aux zéros de f′ (|x − z| < 0,05) pour que l'état « pente
   nulle » soit atteignable au doigt.
   Spec de l'instance : premiere/maths/derivation/README.md. */

import {
  FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes,
  clamp, fmt, rendreDraggable, creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const AIMANT = 0.05; // rayon d'aimantation autour des zéros de f′

function initVariations(fig) {
  const d = fig.dataset;
  const { f, fp } = FONCTIONS[d.fn];
  const aInit = parseFloat(d.aInit);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  const zeros = d.zeros.split(',').map(Number);
  let a = aInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  for (const z of zeros) {
    const zx = vue.xPx(z);
    el('path', { class: 'g-guide', 'stroke-dasharray': '3 5', d: `M${zx} ${vue.hauteur}L${zx} 0` }, svg);
    const lab = el('text', {
      class: 'etiquette-math etiquette-math--muted', 'font-size': 13,
      x: zx + 5, y: vue.yPx(0) + 17,
    }, svg);
    lab.textContent = fmt(z, 0);
  }
  const labF = el('text', { class: 'etiquette-math', 'font-size': 18, x: 160, y: 90 }, svg);
  labF.textContent = 'f';
  el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, domMin, domMax) }, svg);

  /* --- éléments dynamiques -------------------------------------------------- */
  const tangente = el('path', { class: 'g-tangente' }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptA = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labA = el('text', { class: 'etiquette-math', 'font-size': 18 }, svg);
  labA.textContent = 'A';

  const ax0 = vue.xPx(aInit);
  const ay0 = vue.yPx(f(aInit));
  const hint = creerHint(svg, {
    x: ax0 + 22.4, y: ay0 - 59.1,
    filDe: [ax0 + 24.4, ay0 - 37.1], filVers: [ax0 + 5.4, ay0 - 6.1],
  });

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Abscisse x du point A',
    'aria-valuemin': String(domMin), 'aria-valuemax': String(domMax),
  }, svg);

  /* --- lectures, état, tableau vivant ----------------------------------------- */
  const elX = fig.querySelector('.js-x');
  const elFpx = fig.querySelector('.js-fpx');
  const elEtat = fig.querySelector('.js-etat');
  const cellules = fig.querySelectorAll('.js-tableau [data-zone]');

  /* zones : 0 = ]−∞ ; z1[, 1 = {z1}, 2 = ]z1 ; z2[, 3 = {z2}, 4 = ]z2 ; +∞[ */
  function zoneDe(x) {
    if (Math.abs(x - zeros[0]) <= AIMANT) return 1;
    if (Math.abs(x - zeros[1]) <= AIMANT) return 3;
    if (x < zeros[0]) return 0;
    if (x < zeros[1]) return 2;
    return 4;
  }

  function rendre() {
    /* aimantation d'affichage : près d'un zéro de f′, tout est rendu en z
       exactement (pente 0 visible), mais a reste libre pour le drag */
    let aff = a;
    for (const z of zeros) if (Math.abs(a - z) <= AIMANT) aff = z;

    const fa = f(aff);
    const pente = fp(aff);
    const ax = vue.xPx(aff);
    const ay = vue.yPx(fa);

    /* tangente : ± 40 px de part et d'autre de A, colorée par le signe */
    const dx = 40 / vue.pxParX;
    tangente.setAttribute('d',
      `M${vue.xPx(aff - dx)} ${vue.yPx(fa - pente * dx)}L${vue.xPx(aff + dx)} ${vue.yPx(fa + pente * dx)}`);
    const signe = pente > 0.005 ? 'pos' : pente < -0.005 ? 'neg' : 'nulle';
    tangente.setAttribute('class', `g-tangente pente-${signe}`);

    halo.setAttribute('cx', ax); halo.setAttribute('cy', ay);
    ptA.setAttribute('cx', ax); ptA.setAttribute('cy', ay);
    hit.setAttribute('cx', ax); hit.setAttribute('cy', ay);
    labA.setAttribute('x', clamp(ax + 13, 8, vue.largeur - 18));
    labA.setAttribute('y', clamp(ay + 25, 16, vue.hauteur - 6));

    elX.textContent = fmt(aff);
    elFpx.textContent = fmt(pente);
    if (signe === 'pos') {
      elEtat.textContent = 'f′(x) > 0 — f monte';
      elEtat.className = 'chip chip--good js-etat';
    } else if (signe === 'neg') {
      elEtat.textContent = 'f′(x) < 0 — f descend';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'f′(x) = 0 — tangente horizontale';
      elEtat.className = 'chip chip--accent js-etat';
    }

    const zone = String(zoneDe(aff));
    for (const cel of cellules) {
      cel.classList.toggle('zone-active', cel.dataset.zone === zone);
    }

    hit.setAttribute('aria-valuenow', String(Math.round(aff * 100) / 100));
    hit.setAttribute('aria-valuetext', `x = ${fmt(aff)}, f′(x) = ${fmt(pente)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'variations', chapitre });
  }

  rendreDraggable(hit, {
    surDebut() { fig.classList.add('drag-actif'); interaction(); },
    surDeplacement(evt) {
      a = clamp(vue.xDePointeur(evt), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 0.01 : 0.05;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = a + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = a - pas;
    else if (e.key === 'Home') cible = domMin;
    else if (e.key === 'End') cible = domMax;
    if (cible === null) return;
    e.preventDefault();
    a = clamp(cible, domMin, domMax);
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = aInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="variations"]')) initVariations(fig);
