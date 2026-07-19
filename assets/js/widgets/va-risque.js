/* Nabla — widgets/va-risque.js
   « Deux roues, même espérance » : la roue sage (σ = 1,20 €) et la roue
   folle (σ = 4,80 €) ont toutes deux E(X) = −0,40 €. On rejoue 100 parties
   d'un clic : les deux gains cumulés suivent le même cap moyen (−0,40 € par
   partie) mais pas du tout le même film — l'écart type, c'est ça.
   Lois (10 secteurs équiprobables) :
     sage  : −2 € (3 sect.), 0 € (6 sect.), +2 € (1 sect.)
     folle : −2 € (9 sect.), +14 € (1 sect.)
   Spec de l'instance : premiere/maths/variables-aleatoires/README.md. */

import { el, clamp, creerVue, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const N = 100;
const Y_MIN = -160;
const Y_MAX = 80;

const tirageSage = () => { const r = Math.random(); return r < 0.3 ? -2 : r < 0.9 ? 0 : 2; };
const tirageFolle = () => (Math.random() < 0.9 ? -2 : 14);

function initRisque(fig) {
  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: 0, xMax: N, yMin: Y_MIN, yMax: Y_MAX });

  /* --- décor fixe --- */
  const seg = [];
  for (let y = Y_MIN; y <= Y_MAX; y += 40) {
    if (y === 0) continue;
    seg.push(`M0 ${vue.yPx(y).toFixed(1)}L${vue.largeur} ${vue.yPx(y).toFixed(1)}`);
  }
  for (let x = 20; x <= N; x += 20) {
    seg.push(`M${vue.xPx(x).toFixed(1)} ${vue.hauteur}L${vue.xPx(x).toFixed(1)} 0`);
  }
  el('path', { class: 'g-grid', d: seg.join('') }, svg);
  el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, svg);
  /* étiquettes seulement sous l'axe : le coin haut-gauche sert de légende */
  for (let y = Y_MIN; y < 0; y += 40) {
    const t = el('text', { class: 'pop-dim', x: 6, y: vue.yPx(y) - 4 }, svg);
    t.textContent = `${fmt(y, 0)} €`;
  }
  const tX = el('text', { class: 'pop-dim', x: vue.largeur - 6, y: vue.yPx(0) - 6, 'text-anchor': 'end' }, svg);
  tX.textContent = 'parties jouées →';

  /* cap espérance : de (0 ; 0) à (100 ; −40) */
  el('path', {
    class: 'g-guide-accent',
    d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(-40).toFixed(1)}`,
  }, svg);

  /* légende en haut à gauche (zone > +38 €, jamais visitée en pratique) */
  el('path', { class: 'g-courbe-derivee', d: 'M14 20L44 20' }, svg);
  const lSage = el('text', { class: 'pop-dim', x: 50, y: 24 }, svg);
  lSage.textContent = 'roue sage';
  el('path', { class: 'g-courbe', d: 'M14 42L44 42' }, svg);
  const lFolle = el('text', { class: 'pop-dim', x: 50, y: 46 }, svg);
  lFolle.textContent = 'roue folle';
  el('path', { class: 'g-guide-accent', d: 'M14 64L44 64' }, svg);
  const lCap = el('text', { class: 'pop-dim pop-dim--accent', x: 50, y: 68 }, svg);
  lCap.textContent = 'cap espérance : −0,40 € par partie';

  const traceFolle = el('path', { class: 'g-courbe', fill: 'none' }, svg);
  const traceSage = el('path', { class: 'g-courbe-derivee', fill: 'none' }, svg);

  const ligneBilan = fig.querySelector('.js-bilan');

  function simuler(tirer) {
    let capital = 0;
    const pts = [`0 ${vue.yPx(0).toFixed(1)}`];
    for (let i = 1; i <= N; i++) {
      capital += tirer();
      pts.push(`${vue.xPx(i).toFixed(1)} ${vue.yPx(clamp(capital, Y_MIN, Y_MAX)).toFixed(1)}`);
    }
    return { capital, d: 'M' + pts.join('L') };
  }

  function rejouer() {
    const sage = simuler(tirageSage);
    const folle = simuler(tirageFolle);
    traceSage.setAttribute('d', sage.d);
    traceFolle.setAttribute('d', folle.d);
    ligneBilan.textContent =
      `après 100 parties — roue sage : ${fmt(sage.capital, 0)} € · roue folle : ${fmt(folle.capital, 0)} €`;
  }

  fig.querySelector('.js-rejouer').addEventListener('click', () => {
    track('widget_interact', { widget: 'risque', chapitre });
    rejouer();
  });

  rejouer();
}

for (const fig of document.querySelectorAll('[data-widget="va-risque"]')) initRisque(fig);
