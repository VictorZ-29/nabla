/* Nabla — quiz.js
   Mini-quiz « Teste-toi » : questions à choix, feedback immédiat.
   Mauvaise réponse : le bouton est marqué et désactivé, on peut réessayer
   (les autres restent actifs). Bonne réponse : la question se verrouille et
   l'explication se révèle. Compteur x/n dans l'en-tête. Aucune persistance —
   recharger remet à zéro.

   Le JS ne fabrique aucun HTML : la relance (.js-relance) et l'explication
   (.js-explication) sont rédigées dans la page et simplement démasquées —
   indispensable pour que leurs maths soient rendues par KaTeX au chargement.

   Marquage attendu :
     <div class="widget quiz" data-quiz="s2"> … <span class="js-quiz-score">
       <div class="quiz-question" data-bonne="2">
         boutons .quiz-reponse (ordre = index 1…n),
         .quiz-retour.js-relance[hidden], .quiz-retour.js-explication[hidden]

   Analytics : widget_interact (widget: quiz-<id>) à la première interaction,
   throttlé par analytics.js. */

import { track } from './analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initQuiz(bloc) {
  const questions = bloc.querySelectorAll('.quiz-question');
  const score = bloc.querySelector('.js-quiz-score');
  let reussies = 0;

  const interaction = () => {
    track('widget_interact', { widget: `quiz-${bloc.dataset.quiz}`, chapitre });
  };

  for (const question of questions) {
    const bonne = parseInt(question.dataset.bonne, 10);
    const boutons = question.querySelectorAll('.quiz-reponse');
    const relance = question.querySelector('.js-relance');
    const explication = question.querySelector('.js-explication');

    boutons.forEach((bouton, i) => {
      bouton.addEventListener('click', () => {
        interaction();
        if (i + 1 === bonne) {
          bouton.dataset.etat = 'bonne';
          for (const b of boutons) b.disabled = true;
          relance.hidden = true;
          explication.hidden = false;
          reussies += 1;
          if (score) {
            score.textContent = `${reussies}/${questions.length}`;
            score.hidden = false;
          }
        } else {
          bouton.dataset.etat = 'fausse';
          bouton.disabled = true;
          relance.hidden = false;
        }
      });
    });
  }
}

for (const bloc of document.querySelectorAll('[data-quiz]')) initQuiz(bloc);
