/* Nabla — widgets/va-simulation.js
   « Joue, rejoue, et regarde la moyenne » : l'élève joue à la roue de la
   kermesse (X ∈ {−2, 0, 3}, p = 0,5/0,3/0,2) une, dix ou cent parties à la
   fois ; la courbe du gain moyen par partie se stabilise sur E(X) = −0,40 €.
   C'est l'interprétation officielle de l'espérance, jouée à la main.
   La fenêtre s'élargit de 100 à 1 000 parties quand on dépasse 100.
   Spec de l'instance : premiere/maths/variables-aleatoires/README.md. */

import { el, creerVue, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const ESPERANCE = -0.4;
const N_MAX = 1000;
const Y_MIN = -2.6;
const Y_MAX = 3.4;

/* Un tirage de la roue : 5 secteurs « −2 € », 3 « 0 € », 2 « +3 € ». */
function tirage() {
  const r = Math.random();
  return r < 0.5 ? -2 : r < 0.8 ? 0 : 3;
}

function initSimulation(fig) {
  const svg = fig.querySelector('svg');
  const moyennes = [];        // gain moyen après chaque partie
  const comptes = { m2: 0, z: 0, p3: 0 };
  let total = 0;
  let xMax = 100;
  let vue = creerVue(svg, { xMin: 0, xMax, yMin: Y_MIN, yMax: Y_MAX });

  /* --- décor (reconstruit quand la fenêtre change) --- */
  const grille = el('path', { class: 'g-grid' }, svg);
  const axe = el('path', { class: 'g-axis' }, svg);
  const groupeTicks = el('g', {}, svg);
  const ligneE = el('path', { class: 'g-guide-accent' }, svg);
  const etiqE = el('text', { class: 'pop-dim pop-dim--accent', 'text-anchor': 'end' }, svg);
  etiqE.textContent = 'E(X) = −0,40 €';
  const courbe = el('path', { class: 'g-courbe-derivee', fill: 'none' }, svg);
  const point = el('circle', { class: 'pt-point', r: 5, display: 'none' }, svg);

  function dessinerDecor() {
    vue = creerVue(svg, { xMin: 0, xMax, yMin: Y_MIN, yMax: Y_MAX });
    const seg = [];
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
      if (y === 0) continue;
      seg.push(`M0 ${vue.yPx(y).toFixed(1)}L${vue.largeur} ${vue.yPx(y).toFixed(1)}`);
    }
    const pasX = xMax / 5;
    groupeTicks.textContent = '';
    for (let x = pasX; x <= xMax; x += pasX) {
      seg.push(`M${vue.xPx(x).toFixed(1)} ${vue.hauteur}L${vue.xPx(x).toFixed(1)} 0`);
      const t = el('text', {
        class: 'pop-dim', x: vue.xPx(x) - 5, y: vue.yPx(0) - 6, 'text-anchor': 'end',
      }, groupeTicks);
      t.textContent = String(x);
    }
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
      if (y === 0) continue;
      const t = el('text', { class: 'pop-dim', x: 6, y: vue.yPx(y) - 4 }, groupeTicks);
      t.textContent = `${fmt(y, 0)} €`;
    }
    const tParties = el('text', {
      class: 'pop-dim', x: vue.largeur - 6, y: vue.yPx(0) + 16, 'text-anchor': 'end',
    }, groupeTicks);
    tParties.textContent = 'parties jouées →';
    grille.setAttribute('d', seg.join(''));
    axe.setAttribute('d', `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}`);
    ligneE.setAttribute('d', `M0 ${vue.yPx(ESPERANCE).toFixed(1)}L${vue.largeur} ${vue.yPx(ESPERANCE).toFixed(1)}`);
    etiqE.setAttribute('x', vue.largeur - 8);
    etiqE.setAttribute('y', vue.yPx(ESPERANCE) + 18);
  }

  /* --- lectures HTML --- */
  const lectN = fig.querySelector('.js-n');
  const lectTotal = fig.querySelector('.js-total');
  const lectMoyenne = fig.querySelector('.js-moyenne');
  const ligneComptes = fig.querySelector('.js-comptes');
  const legende = fig.querySelector('.js-legende');
  const boutonsJouer = [...fig.querySelectorAll('[data-parties]')];

  function rendre() {
    const n = moyennes.length;
    if (n > 100 && xMax === 100) { xMax = N_MAX; dessinerDecor(); }

    if (n === 0) {
      courbe.setAttribute('d', '');
      point.setAttribute('display', 'none');
    } else {
      const pts = [];
      for (let i = 0; i < n; i++) {
        pts.push(`${vue.xPx(i + 1).toFixed(1)} ${vue.yPx(moyennes[i]).toFixed(1)}`);
      }
      courbe.setAttribute('d', 'M' + pts.join('L'));
      point.setAttribute('display', '');
      point.setAttribute('cx', vue.xPx(n).toFixed(1));
      point.setAttribute('cy', vue.yPx(moyennes[n - 1]).toFixed(1));
    }

    lectN.textContent = String(n);
    lectTotal.textContent = `${fmt(total, 0)} €`;
    lectMoyenne.textContent = n === 0 ? '—' : `${fmt(total / n)} €`;
    ligneComptes.textContent = n === 0
      ? 'Personne n’a encore joué. Lance une partie !'
      : `perdu (−2 €) : ${comptes.m2} fois · remboursé (0 €) : ${comptes.z} fois · gagné (+3 €) : ${comptes.p3} fois — gain moyen : ${fmt(total / n)} €`;

    legende.hidden = n < 300;
    for (const b of boutonsJouer) b.disabled = n >= N_MAX;
  }

  function jouer(k) {
    for (let i = 0; i < k && moyennes.length < N_MAX; i++) {
      const gain = tirage();
      total += gain;
      comptes[gain === -2 ? 'm2' : gain === 0 ? 'z' : 'p3'] += 1;
      moyennes.push(total / (moyennes.length + 1));
    }
    track('widget_interact', { widget: 'simulation', chapitre });
    rendre();
  }

  for (const b of boutonsJouer) {
    b.addEventListener('click', () => jouer(parseInt(b.dataset.parties, 10)));
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    moyennes.length = 0;
    total = 0;
    comptes.m2 = comptes.z = comptes.p3 = 0;
    if (xMax !== 100) { xMax = 100; dessinerDecor(); }
    rendre();
  });

  dessinerDecor();
  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="va-simulation"]')) initSimulation(fig);
