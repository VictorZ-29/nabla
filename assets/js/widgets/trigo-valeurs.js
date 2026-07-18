/* Nabla — widgets/trigo-valeurs.js
   « Le cadran des valeurs exactes » : six manches ; à chaque manche un angle
   remarquable est dessiné sur le cercle, l'élève choisit la valeur exacte
   demandée (cos ou sin) parmi trois. Manches en JSON dans la page ; les
   énoncés, boutons-réponses et explications sont du HTML statique par manche
   (KaTeX rendu au chargement, le JS ne fait que masquer/démasquer — même
   doctrine que quiz.js et exp-courbes.js).
   Spec de l'instance : premiere/maths/trigonometrie/README.md. */

import { el, creerVue } from '../nabla-graph.js';
import { DOUZIEME, FENETRE, decorCercle, fmtPi, cheminArc } from './trigo-cercle.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initValeurs(fig) {
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
    const t = m.k * DOUZIEME;
    const vue = creerVue(svg, FENETRE);

    svg.textContent = '';
    decorCercle(svg, vue);
    /* rayon accent, petit arc d'angle, point M et étiquette de l'angle */
    const mx = vue.xPx(Math.cos(t));
    const my = vue.yPx(Math.sin(t));
    el('path', { class: 'g-guide-accent', d: cheminArc(vue, 0.3, 0, t) }, svg);
    el('path', { class: 'g-tangente', d: `M${vue.xPx(0)} ${vue.yPx(0)}L${mx} ${my}` }, svg);
    el('circle', { class: 'pt-point', r: 5.5, cx: mx, cy: my }, svg);
    const lab = el('text', {
      class: 'etiquette-math etiquette-math--accent', 'font-size': 17,
      x: vue.xPx(1.2 * Math.cos(t)) - 10, y: vue.yPx(1.2 * Math.sin(t)) + 6,
    }, svg);
    lab.textContent = fmtPi(m.k);

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
    progression.textContent = `ANGLE ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, kChoix) {
    track('widget_interact', { widget: 'trigo-valeurs', chapitre });
    const m = manches[i];
    if (kChoix === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of groupes[i].querySelectorAll('.quiz-reponse')) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < manches.length) {
        suivant.textContent = `Angle suivant (${i + 2}/${manches.length}) ▸`;
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

for (const fig of document.querySelectorAll('[data-widget="trigo-valeurs"]')) initValeurs(fig);
