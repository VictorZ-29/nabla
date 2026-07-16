/* Nabla — widgets/ps-alkashi.js
   « Pythagore, corrigé par l'angle » : dans le triangle ABC, les longueurs
   b = AC et c = AB sont fixées ; on fait tourner l'angle Â en déplaçant C
   sur son cercle. Le côté opposé a = BC répond, et la ligne de lecture
   recalcule a² = b² + c² − 2bc·cos(Â) en direct : le terme de correction
   grandit, s'annule à 90° (Pythagore exact : 6² + 8² = 10², le triangle
   6-8-10), change de signe au-delà.
   Spec de l'instance : premiere/maths/produit-scalaire/README.md. */

import {
  el, creerVue, grilleUnite, clamp, fmt, animerValeur, rendreDraggable,
  creerHint,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const RAD = Math.PI / 180;

function initPsAlkashi(fig) {
  const d = fig.dataset;
  const b = parseFloat(d.b);              // AC, fixée
  const c = parseFloat(d.c);              // AB, fixée
  const angleInit = parseFloat(d.angleInit);
  const domMin = 15;                      // pas de triangle aplati
  const domMax = 165;
  let angle = angleInit;                  // Â en degrés

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });
  const ax = vue.xPx(0);                  // A à l'origine du repère de dessin
  const ay = vue.yPx(0);
  const bxPx = vue.xPx(c);                // B = (c ; 0)
  const pxU = vue.pxParX;

  /* --- décor statique : la grille seule (pas de repère dans Al-Kashi) ------ */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-courbe', d: `M${ax} ${ay}L${bxPx} ${ay}` }, svg);   // [AB]
  const ptA = el('circle', { class: 'pt-fixe', r: 4.5, cx: ax, cy: ay }, svg);
  const ptB = el('circle', { class: 'pt-fixe', r: 4.5, cx: bxPx, cy: ay }, svg);
  const labA = el('text', {
    class: 'etiquette-math', 'font-size': 17, x: ax - 16, y: ay + 22,
  }, svg);
  labA.textContent = 'A';
  const labB = el('text', {
    class: 'etiquette-math', 'font-size': 17, x: bxPx + 8, y: ay + 22,
  }, svg);
  labB.textContent = 'B';
  const labc = el('text', {
    class: 'etiquette-mono etiquette-math--muted', 'font-size': 12.5,
    x: (ax + bxPx) / 2, y: ay + 24, 'text-anchor': 'middle',
  }, svg);
  labc.textContent = `c = ${fmt(c, 0)}`;

  /* --- éléments dynamiques -------------------------------------------------- */
  const coteAC = el('path', { class: 'g-courbe' }, svg);
  const coteBC = el('path', { class: 'g-courbe-derivee' }, svg);
  const arc = el('path', { class: 'arc-angle' }, svg);
  const marqueDroit = el('path', { class: 'marque-droit' }, svg);
  const labAngle = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 12.5,
    'text-anchor': 'middle',
  }, svg);
  const labb = el('text', {
    class: 'etiquette-mono etiquette-math--muted', 'font-size': 12.5,
    'text-anchor': 'middle',
  }, svg);
  labb.textContent = `b = ${fmt(b, 0)}`;
  const laba = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 12.5,
    'text-anchor': 'middle',
  }, svg);
  const halo = el('circle', { class: 'pt-halo', r: 12 }, svg);
  const ptC = el('circle', { class: 'pt-point', r: 5.5 }, svg);
  const labC = el('text', { class: 'etiquette-math', 'font-size': 17 }, svg);
  labC.textContent = 'C';

  const cx0 = ax + b * pxU * Math.cos(angleInit * RAD);
  const cy0 = ay - b * pxU * Math.sin(angleInit * RAD);
  const hint = creerHint(svg, {
    x: cx0 + 22.4, y: cy0 - 59.1,
    filDe: [cx0 + 24.4, cy0 - 37.1], filVers: [cx0 + 5.4, cy0 - 6.1],
  });

  const hit = el('circle', {
    class: 'hit-zone', r: 42,
    tabindex: 0, role: 'slider', 'aria-orientation': 'horizontal',
    'aria-label': 'Angle du triangle au sommet A, en degrés',
    'aria-valuemin': String(domMin), 'aria-valuemax': String(domMax),
  }, svg);

  /* --- lectures ------------------------------------------------------------ */
  const ligne = fig.querySelector('.js-ligne');
  const elAngle = fig.querySelector('.js-angle');
  const elA2 = fig.querySelector('.js-a2');
  const elCote = fig.querySelector('.js-a');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const presets = [...fig.querySelectorAll('.segmente button')];

  function rendre() {
    const deg = Math.round(angle);
    const cosA = Math.cos(angle * RAD);
    const sinA = Math.sin(angle * RAD);
    /* le terme de correction est arrondi AVANT la soustraction : la ligne
       affichée est arithmétiquement cohérente (exacte à 60°, 90°, 120°) */
    const correction = Math.round(2 * b * c * cosA * 100) / 100;
    const a2 = Math.round((b * b + c * c - correction) * 100) / 100;
    const a = Math.sqrt(b * b + c * c - 2 * b * c * cosA);
    const cxPx = ax + b * pxU * cosA;
    const cyPx = ay - b * pxU * sinA;

    coteAC.setAttribute('d', `M${ax} ${ay}L${cxPx} ${cyPx}`);
    coteBC.setAttribute('d', `M${bxPx} ${ay}L${cxPx} ${cyPx}`);

    /* arc au sommet A (rayon 26 px), remplacé par la marque à 90° */
    const r = 26;
    if (deg === 90) {
      arc.style.display = 'none';
      marqueDroit.style.display = '';
      marqueDroit.setAttribute('d',
        `M${ax + 15} ${ay}L${ax + 15} ${ay - 15}L${ax} ${ay - 15}`);
    } else {
      arc.style.display = '';
      marqueDroit.style.display = 'none';
      arc.setAttribute('d',
        `M${ax + r} ${ay}A${r} ${r} 0 0 0 ${ax + r * cosA} ${ay - r * sinA}`);
    }
    labAngle.setAttribute('x', ax + 46 * Math.cos((angle / 2) * RAD));
    labAngle.setAttribute('y', ay - 46 * Math.sin((angle / 2) * RAD) + 4);
    labAngle.textContent = `${deg}°`;

    /* étiquettes des côtés mobiles : au milieu, décalées vers l'extérieur */
    labb.setAttribute('x', (ax + cxPx) / 2 - 28 * sinA);
    labb.setAttribute('y', (ay + cyPx) / 2 - 28 * cosA + 4);
    /* étiquette de a : au milieu de [BC], poussée à l'opposé de A */
    const mx = (bxPx + cxPx) / 2;
    const my = (ay + cyPx) / 2;
    const nL = Math.hypot(mx - ax, my - ay) || 1;
    laba.setAttribute('x', mx + 30 * ((mx - ax) / nL));
    laba.setAttribute('y', my + 30 * ((my - ay) / nL) + 4);
    laba.textContent = `a ≈ ${fmt(a)}`;

    halo.setAttribute('cx', cxPx); halo.setAttribute('cy', cyPx);
    ptC.setAttribute('cx', cxPx); ptC.setAttribute('cy', cyPx);
    hit.setAttribute('cx', cxPx); hit.setAttribute('cy', cyPx);
    labC.setAttribute('x', clamp(cxPx - 6, 8, vue.largeur - 20));
    labC.setAttribute('y', clamp(cyPx - 14, 16, vue.hauteur - 6));

    const exact = deg === 60 || deg === 90 || deg === 120;
    const corParen = correction < 0 ? `(${fmt(correction)})` : fmt(correction);
    ligne.textContent =
      `a² = ${fmt(b, 0)}² + ${fmt(c, 0)}² − 2×${fmt(b, 0)}×${fmt(c, 0)}×cos(${deg}°) ${exact ? '=' : '≈'} ${fmt(b * b + c * c, 0)} − ${corParen} ${exact ? '=' : '≈'} ${fmt(a2)}`;
    elAngle.textContent = `${deg}°`;
    elA2.textContent = fmt(a2);
    elCote.textContent = fmt(a);

    if (deg < 90) {
      elEtat.textContent = 'Â aigu — a² < b² + c²';
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = 'Angle aigu : le terme de correction se soustrait, le côté a est plus court que ne le dirait Pythagore.';
    } else if (deg > 90) {
      elEtat.textContent = 'Â obtus — a² > b² + c²';
      elEtat.className = 'chip chip--bad js-etat';
      legende.textContent = 'Angle obtus : cos(Â) est négatif, la « correction » s’ajoute — le côté a s’allonge au-delà de Pythagore.';
    } else {
      elEtat.textContent = 'Â droit — Pythagore exact';
      elEtat.className = 'chip chip--accent js-etat';
      const aDroit = Math.sqrt(b * b + c * c);
      const triangle = Number.isInteger(aDroit)
        ? ` Le triangle ${fmt(b, 0)}-${fmt(c, 0)}-${fmt(aDroit, 0)}.`
        : '';
      legende.textContent = `À 90°, le terme de correction disparaît : a² = ${fmt(b, 0)}² + ${fmt(c, 0)}² = ${fmt(b * b + c * c, 0)}.${triangle} Pythagore est le cas particulier d’Al-Kashi.`;
    }

    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(Math.abs(angle - parseFloat(btn.dataset.angle)) < 1e-9));
    }

    hit.setAttribute('aria-valuenow', String(deg));
    hit.setAttribute('aria-valuetext', `angle A ${deg} degrés, côté a ${fmt(a)}`);
  }

  function interaction() {
    hint.style.display = 'none';
    track('widget_interact', { widget: 'ps-alkashi', chapitre });
  }

  let animation = null;
  rendreDraggable(hit, {
    surDebut() {
      if (animation) { animation.stop(); animation = null; }
      fig.classList.add('drag-actif');
      interaction();
    },
    surDeplacement(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * vue.largeur;
      const py = ((evt.clientY - rect.top) / rect.height) * vue.hauteur;
      const x = px - ax;
      const y = Math.max(0, ay - py);
      angle = clamp(Math.round(Math.atan2(y, x) / RAD), domMin, domMax);
      rendre();
    },
    surFin() { fig.classList.remove('drag-actif'); },
  });

  hit.addEventListener('keydown', (e) => {
    const pas = e.shiftKey ? 1 : 5;
    let cible = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') cible = angle + pas;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') cible = angle - pas;
    else if (e.key === 'Home') cible = domMin;
    else if (e.key === 'End') cible = domMax;
    if (cible === null) return;
    e.preventDefault();
    if (animation) { animation.stop(); animation = null; }
    angle = clamp(Math.round(cible), domMin, domMax);
    interaction();
    rendre();
  });

  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: angle, vers: parseFloat(btn.dataset.angle),
        surFrame(v) { angle = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    angle = angleInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="ps-alkashi"]')) initPsAlkashi(fig);
