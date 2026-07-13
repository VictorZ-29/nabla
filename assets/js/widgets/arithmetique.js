/* Nabla — widgets/arithmetique.js
   « Construis ta suite arithmétique » : les points (n ; u_n), pilotés par
   deux curseurs (premier terme u0, raison r). Entre deux points, l'escalier
   matérialise la marche +r ; la droite en pointillé montre que les points
   restent alignés, avec r pour pente. Lectures : formule explicite
   instanciée en u_nMax, chips u0 / r / état (monte, descend, constante).
   Spec de l'instance : premiere/maths/suites/README.md. */

import { el, creerVue, grilleUnite, axes, clamp, fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initArithmetique(fig) {
  const d = fig.dataset;
  const nMax = parseInt(d.n, 10);
  const u0Init = parseFloat(d.u0Init);
  const rInit = parseFloat(d.rInit);
  let u0 = u0Init;
  let r = rInit;

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
  const droite = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '5 5' }, svg);
  const paliers = el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg);
  const marches = el('path', { class: 'g-marche' }, svg);
  const labR = el('text', { class: 'etiquette-mono etiquette-math--accent', 'font-size': 13 }, svg);
  const points = [];
  for (let k = 0; k <= nMax; k++) points.push(el('circle', { class: 'pt-suite', r: 5 }, svg));

  /* --- lectures ------------------------------------------------------------ */
  const elU0 = fig.querySelector('.js-u0');
  const elR = fig.querySelector('.js-r');
  const elEtat = fig.querySelector('.js-etat');
  const fU0 = fig.querySelector('.js-f-u0');
  const fR = fig.querySelector('.js-f-r');
  const fUn = fig.querySelector('.js-f-un');
  const curseurU0 = fig.querySelector('.js-curseur-u0');
  const curseurR = fig.querySelector('.js-curseur-r');

  function majCurseur(curseur, valeur, texte) {
    if (parseFloat(curseur.value) !== valeur) curseur.value = String(valeur);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((valeur - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', texte);
  }

  function rendre() {
    const u = (k) => u0 + r * k;

    /* droite porteuse : y = u0 + r·x, prolongée sur toute la vue */
    droite.setAttribute('d',
      `M0 ${vue.yPx(u0 + r * vue.xMin)}L${vue.largeur} ${vue.yPx(u0 + r * vue.xMax)}`);

    /* escalier : palier pointillé puis marche verticale accent, à chaque rang */
    let dPaliers = '';
    let dMarches = '';
    for (let k = 0; k < nMax; k++) {
      const x1 = vue.xPx(k);
      const x2 = vue.xPx(k + 1);
      const y1 = vue.yPx(u(k));
      dPaliers += `M${x1} ${y1}L${x2} ${y1}`;
      if (Math.abs(r) > 1e-9) dMarches += `M${x2} ${y1}L${x2} ${vue.yPx(u(k + 1))}`;
    }
    paliers.setAttribute('d', dPaliers);
    marches.setAttribute('d', dMarches);

    /* étiquette de la première marche, si elle est assez haute pour être lue */
    if (Math.abs(r) >= 0.2) {
      labR.style.display = '';
      labR.setAttribute('x', vue.xPx(1) + 7);
      labR.setAttribute('y', (vue.yPx(u(0)) + vue.yPx(u(1))) / 2 + 4);
      labR.textContent = `${r > 0 ? '+' : '−'}${fmtCourt(Math.abs(r))}`;
    } else {
      labR.style.display = 'none';
    }

    /* points (n ; u_n) — masqués s'ils sortent du cadre */
    points.forEach((pt, k) => {
      const y = u(k);
      if (y >= vue.yMin - 0.2 && y <= vue.yMax + 0.2) {
        pt.style.display = '';
        pt.setAttribute('cx', vue.xPx(k));
        pt.setAttribute('cy', vue.yPx(y));
      } else {
        pt.style.display = 'none';
      }
    });

    /* lectures (nœuds texte uniquement) */
    elU0.textContent = fmtCourt(u0);
    elR.textContent = fmtCourt(r);
    fU0.textContent = fmtCourt(u0);
    fR.textContent = r < 0 ? `(${fmtCourt(r)})` : fmtCourt(r);
    fUn.textContent = fmtCourt(u(nMax));
    if (r > 1e-9) {
      elEtat.textContent = 'r > 0 — la suite monte';
      elEtat.className = 'chip chip--good js-etat';
    } else if (r < -1e-9) {
      elEtat.textContent = 'r < 0 — la suite descend';
      elEtat.className = 'chip chip--bad js-etat';
    } else {
      elEtat.textContent = 'r = 0 — la suite est constante';
      elEtat.className = 'chip chip--accent js-etat';
    }

    majCurseur(curseurU0, u0, `u0 = ${fmtCourt(u0)}`);
    majCurseur(curseurR, r, `r = ${fmtCourt(r)}`);
  }

  function interaction() {
    track('widget_interact', { widget: 'arithmetique', chapitre });
  }

  curseurU0.addEventListener('input', () => {
    u0 = clamp(parseFloat(curseurU0.value), parseFloat(curseurU0.min), parseFloat(curseurU0.max));
    interaction();
    rendre();
  });
  curseurR.addEventListener('input', () => {
    r = clamp(parseFloat(curseurR.value), parseFloat(curseurR.min), parseFloat(curseurR.max));
    interaction();
    rendre();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    u0 = u0Init;
    r = rInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="arithmetique"]')) initArithmetique(fig);
