/* Nabla — widgets/ps-signe.js
   « Positif, négatif ou nul ? » : quatre paires de vecteurs à coordonnées
   entières, l'élève décide du signe du produit scalaire — au coup d'œil
   quand l'angle est franc, par le calcul xx′ + yy′ quand l'œil hésite
   (la manche 4 ressemble à la manche 2, mais n'est pas orthogonale).
   Manches en JSON dans la page ({u, v, bonne}) ; les trois boutons-réponses
   sont les mêmes à chaque manche (HTML statique), les explications sont
   statiques par manche (KaTeX rendu au chargement — le JS ne fait que
   masquer/démasquer). Relance sur erreur, score « du premier coup ».
   Spec de l'instance : premiere/maths/produit-scalaire/README.md. */

import {
  el, creerVue, grilleUnite, axes, creerVecteur, etiquetteVecteur, clamp,
} from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initPsSigne(fig) {
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
    const vue = creerVue(svg, { xMin: -8, xMax: 8, yMin: -5, yMax: 5 });
    const ox = vue.xPx(0);
    const oy = vue.yPx(0);

    svg.textContent = '';
    el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
    el('path', { class: 'g-axis', d: axes(vue) }, svg);

    for (const [nom, coords] of [['u', m.u], ['v', m.v]]) {
      const accent = nom === 'v';
      const px = vue.xPx(coords[0]);
      const py = vue.yPx(coords[1]);
      const vec = creerVecteur(svg, accent
        ? { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' }
        : { classeTrait: 'g-courbe', classePointe: 'vec-pointe' });
      vec.maj(ox, oy, px, py);
      const L = Math.hypot(px - ox, py - oy) || 1;
      const lab = etiquetteVecteur(svg, nom, accent ? 'accent' : '');
      lab.maj(clamp(px + ((px - ox) / L) * 26, 14, vue.largeur - 14),
              clamp(py + ((py - oy) / L) * 26 + 6, 30, vue.hauteur - 8));
      /* coordonnées affichées à côté de la pointe : le calcul est possible */
      const negX = coords[0] < 0 ? `−${-coords[0]}` : `${coords[0]}`;
      const negY = coords[1] < 0 ? `−${-coords[1]}` : `${coords[1]}`;
      const t = el('text', {
        class: `etiquette-mono ${accent ? 'etiquette-math--accent' : 'etiquette-math--muted'}`,
        'font-size': 12.5, 'text-anchor': 'middle',
        x: clamp(px + ((px - ox) / L) * 26, 40, vue.largeur - 40),
        y: clamp(py + ((py - oy) / L) * 26 + 26, 44, vue.hauteur - 8),
      }, svg);
      t.textContent = `(${negX} ; ${negY})`;
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
    progression.textContent = `PAIRE ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, k) {
    track('widget_interact', { widget: 'ps-signe', chapitre });
    const m = manches[i];
    if (k === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of boutons) b.disabled = true;
      relance.hidden = true;
      explications[i].hidden = false;
      if (!fauteManche) sansFaute += 1;
      if (i + 1 < manches.length) {
        suivant.textContent = `Paire suivante (${i + 2}/${manches.length}) ▸`;
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

for (const fig of document.querySelectorAll('[data-widget="ps-signe"]')) initPsSigne(fig);
