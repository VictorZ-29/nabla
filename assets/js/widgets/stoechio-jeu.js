/* Nabla — widgets/stoechio-jeu.js
   « Qui s'épuise en premier ? » : quatre mélanges initiaux, l'élève désigne
   le réactif limitant — ou déclare le mélange stœchiométrique. Les manches
   sont graduées : coefficients égaux (le raccourci « plus petit tas »
   marche encore), coefficients différents (il meurt), mélange exact, puis
   photo-finish où seul le calcul des candidats n₀/coef tranche. Énoncés,
   boutons et explications sont du HTML statique par manche (KaTeX rendu au
   chargement, le JS ne fait que masquer/démasquer — doctrine exp-courbes).
   Spec : premiere/physique-chimie/reaction-avancement/README.md. */

import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initStoechioJeu(fig) {
  const bonnes = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
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
    progression.textContent = `MÉLANGE ${i + 1}/${bonnes.length}`;
  }

  function repondre(bouton, kChoix) {
    track('widget_interact', { widget: 'stoechio-jeu', chapitre });
    if (kChoix === bonnes[i]) {
      bouton.dataset.etat = 'bonne';
      for (const b of groupes[i].querySelectorAll('.quiz-reponse')) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < bonnes.length) {
        suivant.textContent = `Mélange suivant (${i + 2}/${bonnes.length}) ▸`;
        suivant.hidden = false;
      } else {
        finalTxt.textContent = `Terminé : ${sansFaute}/${bonnes.length} du premier coup.`;
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

for (const fig of document.querySelectorAll('[data-widget="stoechio-jeu"]')) initStoechioJeu(fig);
