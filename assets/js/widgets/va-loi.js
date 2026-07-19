/* Nabla — widgets/va-loi.js
   « Regroupe les issues » : la roue de la kermesse est figée (10 secteurs
   équiprobables) ; l'élève choisit une valeur de X et voit s'allumer les
   secteurs qui la produisent — regrouper les issues par valeur, c'est
   exactement construire la loi de probabilité. Tous les nombres étant
   fixes, les lectures sont du HTML statique (KaTeX rendu au chargement) ;
   le JS ne fait que basculer des classes et des `hidden`.
   Spec de l'instance : premiere/maths/variables-aleatoires/README.md. */

import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initLoi(fig) {
  const secteurs = [...fig.querySelectorAll('.js-sect, .js-sect-txt')];
  const boutons = [...fig.querySelectorAll('.segmente button')];
  const lectures = [...fig.querySelectorAll('.js-mode')];

  function rendre(mode) {
    for (const b of boutons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    for (const s of secteurs) {
      s.classList.toggle('roue-hors', mode !== 'tout' && s.dataset.net !== mode);
    }
    for (const l of lectures) l.hidden = l.dataset.mode !== mode;
  }

  for (const b of boutons) {
    b.addEventListener('click', () => {
      track('widget_interact', { widget: 'loi', chapitre });
      rendre(b.dataset.mode);
    });
  }

  rendre('tout');
}

for (const fig of document.querySelectorAll('[data-widget="va-loi"]')) initLoi(fig);
