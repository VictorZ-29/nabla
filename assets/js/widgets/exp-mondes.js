/* Nabla — widgets/exp-mondes.js
   « Le coefficient k change le monde » : la courbe de x ↦ e^(kx), pilotée
   par le curseur k (préréglages animés k = 1 / 0 / −1). Trois mondes :
   k > 0 ça explose, k = 0 constante, k < 0 ça fond vers 0 — mais toutes
   les courbes passent par (0 ; 1), et la dérivée instanciée montre le k
   qui descend en facteur : (e^(kx))′ = k e^(kx).
   Spec de l'instance : premiere/maths/exponentielle/README.md. */

import {
  el, creerVue, cheminCourbe, grilleUnite, axes, clamp, fmt, fmtCourt, animerValeur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initExpMondes(fig) {
  const d = fig.dataset;
  const kInit = parseFloat(d.kInit);
  let k = kInit;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  /* le point de passage commun (0 ; 1), toujours là */
  el('circle', { class: 'pt-fixe', r: 4.5, cx: vue.xPx(0), cy: vue.yPx(1) }, svg);
  const labPassage = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 13,
    x: vue.xPx(0) + 9, y: vue.yPx(1) + 20,
  }, svg);
  labPassage.textContent = '(0 ; 1)';

  /* --- éléments dynamiques -------------------------------------------------- */
  const courbe = el('path', { class: 'g-courbe-derivee' }, svg);

  /* --- lectures et contrôles -------------------------------------------------- */
  const elK = fig.querySelector('.js-k');
  const ligne = fig.querySelector('.js-ligne');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');
  const presets = [...fig.querySelectorAll('.segmente button')];

  function rendre() {
    /* courbe tronquée au plafond : e^(kx) ≤ yMax ⟺ kx ≤ ln(yMax) */
    let x0 = vue.xMin;
    let x1 = vue.xMax;
    let creve = false;
    if (k > 1e-9) {
      const lim = Math.log(vue.yMax) / k;
      if (lim < x1) { x1 = lim; creve = true; }
    } else if (k < -1e-9) {
      const lim = Math.log(vue.yMax) / k;
      if (lim > x0) { x0 = lim; creve = true; }
    }
    courbe.setAttribute('d', cheminCourbe(vue, (x) => Math.exp(k * x), x0, x1));

    elK.textContent = fmtCourt(k);
    /* dérivée instanciée : le k descend en facteur */
    const kTxt = fmtCourt(k);
    const kx = Math.abs(Math.abs(k) - 1) < 1e-9 ? (k < 0 ? '−x' : 'x') : `${kTxt}x`;
    ligne.textContent = Math.abs(k) < 1e-9
      ? 'dérivée : (e⁰ˣ)′ = 0 — une constante ne bouge pas'
      : `dérivée : (e^(${kx}))′ = ${kTxt} × e^(${kx})`;

    if (k > 1e-9) {
      elEtat.textContent = 'k > 0 — ça explose';
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = `Croissance exponentielle : chaque pas de 1 vers la droite multiplie la hauteur par e^${fmtCourt(k)} ≈ ${fmt(Math.exp(k))}.` +
        (creve ? ' La courbe crève déjà le plafond du graphique.' : '');
    } else if (k < -1e-9) {
      elEtat.textContent = 'k < 0 — ça fond vers 0';
      elEtat.className = 'chip chip--bad js-etat';
      legende.textContent = `Décroissance exponentielle : la courbe fond vers 0 sans jamais l'atteindre — e^(${fmtCourt(k)}x) reste strictement positif.` +
        (creve ? ' À gauche, elle crève le plafond du graphique.' : '');
    } else {
      elEtat.textContent = 'k = 0 — constante';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'e⁰ˣ = e⁰ = 1 : la frontière entre les deux mondes est une droite horizontale.';
    }

    if (parseFloat(curseur.value) !== k) curseur.value = String(k);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((k - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `k = ${fmtCourt(k)}`);

    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(Math.abs(parseFloat(btn.dataset.k) - k) < 1e-9));
    }
  }

  function interaction() {
    track('widget_interact', { widget: 'exp-mondes', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    k = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    planifierRendu();
  });

  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: k, vers: parseFloat(btn.dataset.k),
        surFrame(v) { k = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    k = kInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="exp-mondes"]')) initExpMondes(fig);
