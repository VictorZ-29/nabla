/* Nabla — widgets/parabole-formes.js
   « À chaque parabole son écriture » : quatre manches ; à chaque manche une
   parabole est tracée, l'élève choisit l'écriture qui lui correspond parmi
   trois. Les réflexes travaillés : lire le signe de a (haut ou bas), lire
   les racines sur l'axe (attention au signe des facteurs), lire le sommet
   (attention au signe de α). Manches en JSON dans la page ; les
   boutons-réponses et les explications sont du HTML statique par manche
   (KaTeX rendu au chargement — même doctrine que exp-courbes.js).
   Spec de l'instance : premiere/maths/second-degre/README.md. */

import { el, creerVue, cheminCourbe, grilleUnite, axes } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Registre des paraboles des manches — tout analytique. */
const COURBES = {
  'fact-m1-3': (x) => (x + 1) * (x - 3),
  'canon-neg-1-4': (x) => -(x - 1) * (x - 1) + 4,
  'double-2': (x) => (x - 2) * (x - 2),
  'canon-m1-2': (x) => (x + 1) * (x + 1) + 2,
};

function initParaboleFormes(fig) {
  const manches = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const svg = fig.querySelector('svg');
  const groupes = [...fig.querySelectorAll('.js-manche')];
  const explications = [...fig.querySelectorAll('.js-expl')];
  const relance = fig.querySelector('.js-relance');
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
    const f = COURBES[m.courbe];
    const vue = creerVue(svg, { xMin: -5, xMax: 5, yMin: m.ymin, yMax: m.ymax });

    svg.textContent = '';
    el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
    el('path', { class: 'g-axis', d: axes(vue) }, svg);
    /* tronque la parabole là où elle sort de la fenêtre (haut ou bas) */
    let x0 = vue.xMin;
    let x1 = vue.xMax;
    const pasBalayage = (vue.xMax - vue.xMin) / 640;
    while (x0 < x1 && (f(x0) > vue.yMax || f(x0) < vue.yMin)) x0 += pasBalayage;
    while (x1 > x0 && (f(x1) > vue.yMax || f(x1) < vue.yMin)) x1 -= pasBalayage;
    el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, x0, x1) }, svg);

    for (const [j, g] of groupes.entries()) {
      g.hidden = j !== i;
      if (j === i) {
        for (const b of g.querySelectorAll('.quiz-reponse')) {
          b.disabled = false;
          delete b.dataset.etat;
        }
      }
    }
    for (const e of explications) e.hidden = true;
    relance.hidden = true;
    final.hidden = true;
    suivant.hidden = true;
    recommencer.hidden = true;
    fauteManche = false;
    progression.textContent = `PARABOLE ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, kChoix) {
    track('widget_interact', { widget: 'parabole-formes', chapitre });
    const m = manches[i];
    if (kChoix === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of groupes[i].querySelectorAll('.quiz-reponse')) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < manches.length) {
        suivant.textContent = `Parabole suivante (${i + 2}/${manches.length}) ▸`;
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

  for (const [j, g] of groupes.entries()) {
    g.querySelectorAll('.quiz-reponse').forEach((b, kChoix) => {
      b.addEventListener('click', () => {
        if (j !== i) return;
        repondre(b, kChoix + 1);
      });
    });
  }

  suivant.addEventListener('click', () => { i += 1; dessiner(); });
  recommencer.addEventListener('click', () => { i = 0; sansFaute = 0; dessiner(); });
  dessiner();
}

for (const fig of document.querySelectorAll('[data-widget="parabole-formes"]')) initParaboleFormes(fig);
