/* Nabla — widgets/exp-courbes.js
   « À chaque courbe sa formule » : quatre manches ; à chaque manche une
   courbe est tracée, l'élève choisit la formule qui lui correspond parmi
   trois. Les réflexes travaillés : lire f(0), lire le sens de variation,
   repérer un creux (produit x·e^x). Manches en JSON dans la page ; les
   boutons-réponses et les explications sont du HTML statique par manche
   (KaTeX rendu au chargement, le JS ne fait que masquer/démasquer — même
   doctrine que quiz.js et sens.js).
   Spec de l'instance : premiere/maths/exponentielle/README.md. */

import { el, creerVue, cheminCourbe, grilleUnite, axes } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Registre des courbes des manches — tout analytique. */
const COURBES = {
  'exp': (x) => Math.exp(x),
  'exp-moins': (x) => Math.exp(-x),
  'x-exp': (x) => x * Math.exp(x),
  '3exp-moins': (x) => 3 * Math.exp(-x),
};

function initExpCourbes(fig) {
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
    const vue = creerVue(svg, { xMin: -3.2, xMax: 3.2, yMin: m.ymin, yMax: m.ymax });

    svg.textContent = '';
    el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
    el('path', { class: 'g-axis', d: axes(vue) }, svg);
    /* tronque la courbe là où elle sort de la fenêtre par le haut */
    let x0 = vue.xMin;
    let x1 = vue.xMax;
    const pasBalayage = (vue.xMax - vue.xMin) / 640;
    while (x0 < x1 && f(x0) > vue.yMax) x0 += pasBalayage;
    while (x1 > x0 && f(x1) > vue.yMax) x1 -= pasBalayage;
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
    progression.textContent = `COURBE ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, kChoix) {
    track('widget_interact', { widget: 'exp-courbes', chapitre });
    const m = manches[i];
    if (kChoix === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of groupes[i].querySelectorAll('.quiz-reponse')) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < manches.length) {
        suivant.textContent = `Courbe suivante (${i + 2}/${manches.length}) ▸`;
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

for (const fig of document.querySelectorAll('[data-widget="exp-courbes"]')) initExpCourbes(fig);
