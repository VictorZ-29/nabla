/* Nabla — widgets/stoechio-jeu.js
   Jeu à manches générique : une question par manche, l'élève choisit parmi
   des boutons, mauvaise réponse → relance et nouvel essai, bonne réponse →
   explication puis manche suivante. Énoncés, boutons et explications sont
   du HTML statique par manche (KaTeX rendu au chargement, le JS ne fait
   que masquer/démasquer — doctrine exp-courbes).
   Première instance : « Qui s'épuise en premier ? » (avancement, §4) —
   quatre mélanges initiaux, l'élève désigne le réactif limitant. Réutilisé
   tel quel par « Quel échantillon est le plus riche ? » (composition, §4)
   via data-nom / data-progression / data-suivant.
   Specs : premiere/physique-chimie/<chapitre>/README.md. */

import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initStoechioJeu(fig) {
  const bonnes = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const nomWidget = fig.dataset.nom || 'stoechio-jeu';
  const motManche = fig.dataset.progression || 'MÉLANGE';
  const motSuivant = fig.dataset.suivant || 'Mélange suivant';
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
    progression.textContent = `${motManche} ${i + 1}/${bonnes.length}`;
  }

  function repondre(bouton, kChoix) {
    track('widget_interact', { widget: nomWidget, chapitre });
    if (kChoix === bonnes[i]) {
      bouton.dataset.etat = 'bonne';
      for (const b of groupes[i].querySelectorAll('.quiz-reponse')) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < bonnes.length) {
        suivant.textContent = `${motSuivant} (${i + 2}/${bonnes.length}) ▸`;
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
