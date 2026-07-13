/* Nabla — widgets/sens.js
   « Croissante, décroissante… ou ni l'une ni l'autre ? » : quatre nuages de
   points de suites, l'élève décide du sens de variation. Manches définies en
   JSON dans la page ({suite, ymin, ymax, bonne}) ; les trois boutons-réponses
   et les explications sont du HTML statique (KaTeX rendu au chargement, le
   JS ne fait que masquer/démasquer). Relance sur erreur, score « du premier
   coup » à la fin. Spec de l'instance : premiere/maths/suites/README.md. */

import { el, creerVue, grilleUnite, axes } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const N_MAX = 8;

/* Registre des suites des manches (n ↦ u_n, analytique). */
const SUITES = {
  'lin': (n) => 0.5 * n + 0.5,
  'geo': (n) => 4 * Math.pow(0.75, n),
  'osc': (n) => 3 * Math.pow(-0.75, n),
  'par': (n) => ((n - 5) * (n - 5)) / 4 - 1,
};

function initSens(fig) {
  const manches = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const svg = fig.querySelector('svg');
  const boutons = [...fig.querySelectorAll('.js-choix')];
  const relance = fig.querySelector('.js-relance');
  const explications = [...fig.querySelectorAll('.js-expl')];
  const final = fig.querySelector('.js-final');
  const finalTxt = fig.querySelector('.js-final-txt');
  const progression = fig.querySelector('.js-progression');
  const suivant = fig.querySelector('.js-suivant');
  const recommencer = fig.querySelector('.js-recommencer');

  let i = 0;
  let sansFaute = 0;
  let fauteManche = false;

  function dessiner() {
    const m = manches[i];
    const u = SUITES[m.suite];
    const vue = creerVue(svg, { xMin: -0.7, xMax: 9.3, yMin: m.ymin, yMax: m.ymax });

    svg.textContent = '';
    el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
    el('path', { class: 'g-axis', d: axes(vue) }, svg);
    const labN = el('text', {
      class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
      x: vue.largeur - 12, y: vue.yPx(0) + 20, 'text-anchor': 'end',
    }, svg);
    labN.textContent = 'n';
    let dTiges = '';
    for (let k = 0; k <= N_MAX; k++) {
      dTiges += `M${vue.xPx(k)} ${vue.yPx(0)}L${vue.xPx(k)} ${vue.yPx(u(k))}`;
    }
    el('path', { class: 'g-guide', 'stroke-dasharray': '3 4', d: dTiges }, svg);
    for (let k = 0; k <= N_MAX; k++) {
      el('circle', { class: 'pt-suite', r: 5, cx: vue.xPx(k), cy: vue.yPx(u(k)) }, svg);
    }

    for (const b of boutons) {
      b.disabled = false;
      delete b.dataset.etat;
    }
    relance.hidden = true;
    for (const e of explications) e.hidden = true;
    final.hidden = true;
    suivant.hidden = true;
    recommencer.hidden = true;
    fauteManche = false;
    progression.textContent = `SUITE ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, k) {
    track('widget_interact', { widget: 'sens', chapitre });
    const m = manches[i];
    if (k === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of boutons) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < manches.length) {
        suivant.textContent = `Suite suivante (${i + 2}/${manches.length}) ▸`;
        suivant.hidden = false;
      } else {
        finalTxt.textContent = `Terminé : ${sansFaute}/${manches.length} du premier coup.`;
        final.hidden = false;
        recommencer.hidden = false;
      }
    } else {
      fauteManche = true;
      bouton.dataset.etat = 'fausse';
      bouton.disabled = true;
      relance.hidden = false;
    }
  }

  boutons.forEach((b, k) => b.addEventListener('click', () => repondre(b, k + 1)));
  suivant.addEventListener('click', () => { i += 1; dessiner(); });
  recommencer.addEventListener('click', () => { i = 0; sansFaute = 0; dessiner(); });
  dessiner();
}

for (const fig of document.querySelectorAll('[data-widget="sens"]')) initSens(fig);
