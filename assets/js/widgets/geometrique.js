/* Nabla — widgets/geometrique.js
   « La raison q change tout » : les points (n ; u_n) d'une suite géométrique
   de premier terme u0 fixé, pilotés par un curseur q et trois préréglages
   animés (×2, ×1, ×0,7). Tiges pointillées vers l'axe pour lire la hauteur
   de chaque terme ; les points qui dépassent le cadre sont masqués et la
   légende le raconte. Lectures : formule explicite instanciée, chips q /
   u_nMax / état, légende dynamique (explose, constante, fond vers 0).
   Spec de l'instance : premiere/maths/suites/README.md. */

import { el, creerVue, grilleUnite, axes, clamp, fmtCourt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initGeometrique(fig) {
  const d = fig.dataset;
  const nMax = parseInt(d.n, 10);
  const u0 = parseFloat(d.u0);
  const qInit = parseFloat(d.qInit);
  let q = qInit;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, {
    xMin: +d.xmin, xMax: +d.xmax, yMin: +d.ymin, yMax: +d.ymax,
  });

  /* --- décor statique ----------------------------------------------------- */
  el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const labN = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.largeur - 12, y: vue.yPx(0) + 20, 'text-anchor': 'end',
  }, svg);
  labN.textContent = 'n';
  const labU = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(0) + 8, y: 18,
  }, svg);
  labU.textContent = 'u';
  const labUInd = el('tspan', { dy: 4, 'font-size': 11 }, labU);
  labUInd.textContent = 'n';

  /* --- éléments dynamiques -------------------------------------------------- */
  const tiges = el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg);
  const points = [];
  for (let k = 0; k <= nMax; k++) points.push(el('circle', { class: 'pt-suite', r: 5 }, svg));

  /* --- lectures ------------------------------------------------------------ */
  const elQ = fig.querySelector('.js-q');
  const elEtat = fig.querySelector('.js-etat');
  const fQ = fig.querySelector('.js-f-q');
  const fUn = fig.querySelector('.js-f-un');
  const legende = fig.querySelector('.js-legende');
  const curseur = fig.querySelector('.js-curseur');
  const presets = [...fig.querySelectorAll('.segmente button')];

  /* u_nMax peut devenir grand (q = 2 → 256) : entier au-delà de 100 */
  function fmtTerme(v) {
    return v >= 100 ? fmtCourt(Math.round(v), 0) : fmtCourt(v);
  }

  function rendre() {
    const u = (k) => u0 * Math.pow(q, k);

    let dTiges = '';
    let caches = 0;
    points.forEach((pt, k) => {
      const y = u(k);
      const x = vue.xPx(k);
      dTiges += `M${x} ${vue.yPx(0)}L${x} ${vue.yPx(Math.min(y, vue.yMax))}`;
      if (y <= vue.yMax + 0.2) {
        pt.style.display = '';
        pt.setAttribute('cx', x);
        pt.setAttribute('cy', vue.yPx(y));
      } else {
        pt.style.display = 'none';
        caches += 1;
      }
    });
    tiges.setAttribute('d', dTiges);

    elQ.textContent = fmtCourt(q);
    fQ.textContent = fmtCourt(q);
    fUn.textContent = fmtTerme(u(nMax));

    if (q > 1 + 1e-9) {
      elEtat.textContent = 'q > 1 — ça s’emballe';
      elEtat.className = 'chip chip--good js-etat';
      legende.textContent = `Multiplier par ${fmtCourt(q)} encore et encore : les premiers pas ont l’air sages, puis la croissance s’emballe. C’est ça, une croissance exponentielle.`
        + (caches > 0 ? ' Les derniers points crèvent déjà le plafond du graphique.' : '');
    } else if (q < 1 - 1e-9) {
      elEtat.textContent = 'q < 1 — ça fond vers 0';
      elEtat.className = 'chip chip--bad js-etat';
      legende.textContent = `À chaque pas, il ne reste que ${fmtCourt(q * 100, 0)} % du terme précédent : la suite fond vers 0, sans jamais devenir négative.`;
    } else {
      elEtat.textContent = 'q = 1 — constante';
      elEtat.className = 'chip chip--accent js-etat';
      legende.textContent = 'Multiplier par 1, c’est ne rien changer : la suite reste clouée à son premier terme. C’est la frontière exacte entre les deux mondes.';
    }

    if (parseFloat(curseur.value) !== q) curseur.value = String(q);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((q - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `q = ${fmtCourt(q)}`);

    for (const btn of presets) {
      btn.setAttribute('aria-pressed', String(Math.abs(parseFloat(btn.dataset.q) - q) < 1e-9));
    }
  }

  function interaction() {
    track('widget_interact', { widget: 'geometrique', chapitre });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    q = clamp(parseFloat(curseur.value), parseFloat(curseur.min), parseFloat(curseur.max));
    interaction();
    rendre();
  });

  for (const btn of presets) {
    btn.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: q, vers: parseFloat(btn.dataset.q),
        surFrame(v) { q = v; rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    q = qInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="geometrique"]')) initGeometrique(fig);
