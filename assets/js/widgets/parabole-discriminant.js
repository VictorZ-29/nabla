/* Nabla — widgets/parabole-discriminant.js
   « Monte et descends la parabole » : f(x) = x² − 2x + c, pilotée par le
   curseur c. En glissant la parabole verticalement, l'élève voit les
   racines se rapprocher, fusionner (Δ = 0, le sommet se pose sur l'axe)
   puis disparaître (Δ < 0). Δ = 4 − 4c reste un entier pour tout pas du
   curseur ; les préréglages tombent sur les trois mondes exacts.
   Spec de l'instance : premiere/maths/second-degre/README.md. */

import {
  el, creerVue, cheminCourbe, grilleUnite, axes, clamp, fmt, fmtCourt,
  animerValeur,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initParaboleDiscriminant(fig) {
  const d = fig.dataset;
  const cInit = parseFloat(d.cInit);
  let c = cInit;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  const f = (x) => x * x - 2 * x + c;

  /* --- décor statique : grille, axes, axe de symétrie x = 1 ----------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const px1 = vue.xPx(1);
  el('path', { class: 'g-guide', 'stroke-dasharray': '4 4', d: `M${px1} ${vue.hauteur}L${px1} 0` }, svg);
  const labAxe = el('text', {
    class: 'etiquette-mono etiquette-math--muted', 'font-size': 12, x: px1 + 6, y: 14,
  }, svg);
  labAxe.textContent = 'x = 1';
  const labF = el('text', {
    class: 'etiquette-mono etiquette-math--accent', 'font-size': 12, x: 10, y: 20,
  }, svg);
  labF.textContent = 'y = x² − 2x + c';

  /* --- éléments dynamiques -------------------------------------------------- */
  const courbe = el('path', { class: 'g-courbe-derivee' }, svg);
  const pt1 = el('circle', { class: 'pt-point', r: 5 }, svg);
  const pt2 = el('circle', { class: 'pt-point', r: 5 }, svg);
  const lab1 = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 14, 'text-anchor': 'middle' }, svg);
  const lab2 = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 14, 'text-anchor': 'middle' }, svg);

  /* --- lectures et contrôles ------------------------------------------------ */
  const ligne = fig.querySelector('.js-ligne');
  const elC = fig.querySelector('.js-c');
  const elDelta = fig.querySelector('.js-delta');
  const elEtat = fig.querySelector('.js-etat');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');
  const presets = [...fig.querySelectorAll('.segmente button')];

  /* « = −1 » quand la racine est exacte à 2 décimales, « ≈ 0,29 » sinon */
  function lectureRacine(v) {
    const exacte = Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;
    return `${exacte ? '=' : '≈'} ${fmt(v)}`;
  }

  function rendre() {
    const delta = 4 - 4 * c;
    const y0 = vue.yPx(0);

    /* parabole tronquée au plafond : (x − 1)² ≤ yMax − (c − 1) */
    const demi = Math.sqrt(vue.yMax - (c - 1));
    const x0 = Math.max(vue.xMin, 1 - demi);
    const x1 = Math.min(vue.xMax, 1 + demi);
    courbe.setAttribute('d', cheminCourbe(vue, f, x0, x1));

    /* racines marquées sur l'axe des abscisses */
    if (delta > 0) {
      const s = Math.sqrt(1 - c);
      pt1.style.display = ''; pt2.style.display = '';
      lab1.style.display = ''; lab2.style.display = '';
      pt1.setAttribute('cx', vue.xPx(1 - s)); pt1.setAttribute('cy', y0);
      pt2.setAttribute('cx', vue.xPx(1 + s)); pt2.setAttribute('cy', y0);
      lab1.setAttribute('x', vue.xPx(1 - s)); lab1.setAttribute('y', y0 + 22);
      lab2.setAttribute('x', vue.xPx(1 + s)); lab2.setAttribute('y', y0 + 22);
      lab1.textContent = 'x₁';
      lab2.textContent = 'x₂';
      elEtat.textContent = 'Δ > 0 — deux racines';
      legende.textContent = `La parabole traverse l’axe des abscisses en deux points : x₁ ${lectureRacine(1 - s)} et x₂ ${lectureRacine(1 + s)}. L’équation f(x) = 0 a deux solutions.`;
    } else if (delta === 0) {
      pt1.style.display = ''; pt2.style.display = 'none';
      lab1.style.display = ''; lab2.style.display = 'none';
      pt1.setAttribute('cx', vue.xPx(1)); pt1.setAttribute('cy', y0);
      lab1.setAttribute('x', vue.xPx(1)); lab1.setAttribute('y', y0 + 22);
      lab1.textContent = 'x₀';
      elEtat.textContent = 'Δ = 0 — une racine double';
      legende.textContent = 'La parabole pose son sommet exactement sur l’axe : une seule solution, x₀ = 1, dite racine double. Les deux racines ont fusionné.';
    } else {
      pt1.style.display = 'none'; pt2.style.display = 'none';
      lab1.style.display = 'none'; lab2.style.display = 'none';
      elEtat.textContent = 'Δ < 0 — aucune racine';
      legende.textContent = 'La parabole flotte entièrement au-dessus de l’axe, sans jamais le toucher : l’équation f(x) = 0 n’a aucune solution.';
    }

    ligne.textContent = `Δ = b² − 4ac = 4 − 4 × ${c < 0 ? `(−${fmtCourt(-c)})` : fmtCourt(c)} = ${fmtCourt(delta)}`;
    elC.textContent = fmtCourt(c);
    elDelta.textContent = fmtCourt(delta);

    if (parseFloat(curseur.value) !== c) curseur.value = String(c);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((c - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `c = ${fmtCourt(c)}, discriminant = ${fmtCourt(4 - 4 * c)}`);
    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(parseFloat(btn.dataset.c) === c));
    }
  }

  function interaction() {
    track('widget_interact', { widget: 'parabole-discriminant', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  let animation = null;
  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    c = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    planifierRendu();
  });
  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: c, vers: parseFloat(btn.dataset.c),
        surFrame(v) { c = v; rendre(); },
        surFin() { c = parseFloat(btn.dataset.c); animation = null; rendre(); },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    c = cInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="parabole-discriminant"]')) initParaboleDiscriminant(fig);
