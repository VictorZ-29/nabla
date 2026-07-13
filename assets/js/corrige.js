/* Nabla — corrige.js
   Révélation des corrigés d'exercices. Chaque bouton .corrige-toggle contrôle
   le panneau désigné par aria-controls ; libellés fournis par data-voir /
   data-masquer. Événement Plausible à l'ouverture : corrige_open
   (props exercice + chapitre), ou bac_open si data-event="bac_open". */

import { track } from './analytics.js';

const chapitre = document.body.dataset.chapitre || '';

for (const bouton of document.querySelectorAll('.corrige-toggle')) {
  const panneau = document.getElementById(bouton.getAttribute('aria-controls'));
  if (!panneau) continue;
  bouton.addEventListener('click', () => {
    const ouvrir = panneau.hidden;
    panneau.hidden = !ouvrir;
    bouton.setAttribute('aria-expanded', String(ouvrir));
    bouton.textContent = ouvrir ? bouton.dataset.masquer : bouton.dataset.voir;
    if (ouvrir) {
      if (bouton.dataset.event === 'bac_open') {
        track('bac_open');
      } else {
        track('corrige_open', { exercice: bouton.dataset.exercice, chapitre });
      }
    }
  });
}
