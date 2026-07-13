/* Nabla — widgets/univers.js
   « Sachant, ça change quoi ? » : l'univers des 40 élèves. Le remplissage
   accent marque ceux qui jouent d'un instrument (M), le cadre pointillé
   regroupe ceux qui font du théâtre (T). Trois modes : univers entier,
   sachant théâtre, sachant musique — restreindre l'univers = effacer les
   autres points. Les effectifs étant fixes, toutes les lignes de lecture
   (question, fraction, chips, légende) sont du HTML statique dans la page :
   le JS ne fait que masquer/démasquer et griser des points.
   Spec de l'instance : premiere/maths/probabilites-conditionnelles/README.md. */

import { el } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Géométrie partagée avec la figure statique du §1 et le widget indépendance :
   bloc théâtre 2 × 5 à gauche (cadre pointillé), les 30 autres 6 × 5 à droite. */
export const POP = {
  pas: 56,
  r: 10,
  colsT: [96, 152],
  colsO: [260, 316, 372, 428, 484, 540],
  rangs: [60, 116, 172, 228, 284],
  cadre: { x: 70, y: 34, w: 108, h: 276, rx: 12 },
  yEtiquettes: 342,
};

/* Qui joue d'un instrument (indices ligne par ligne dans chaque bloc). */
const M_DANS_T = new Set([0, 3, 4, 6, 7, 9]);
const M_HORS_T = new Set([2, 9, 13, 17, 22, 28]);

/* Dessine la population dans un SVG ; renvoie la liste des points avec leurs
   appartenances. Réutilisé par le widget indépendance. */
export function dessinerPopulation(svg) {
  el('rect', {
    class: 'cadre-univers',
    x: POP.cadre.x, y: POP.cadre.y, width: POP.cadre.w, height: POP.cadre.h, rx: POP.cadre.rx,
  }, svg);
  const points = [];
  const bloc = (cols, dansT, musiciens) => {
    for (let rang = 0; rang < POP.rangs.length; rang++) {
      for (let c = 0; c < cols.length; c++) {
        const idx = rang * cols.length + c;
        const musique = musiciens.has(idx);
        const pt = el('circle', {
          class: musique ? 'pt-pop pt-pop--b' : 'pt-pop',
          r: POP.r, cx: cols[c], cy: POP.rangs[rang],
        }, svg);
        points.push({ el: pt, theatre: dansT, musique });
      }
    }
  };
  bloc(POP.colsT, true, M_DANS_T);
  bloc(POP.colsO, false, M_HORS_T);
  const etiqT = el('text', {
    class: 'pop-dim pop-dim--accent', x: 124, y: POP.yEtiquettes, 'text-anchor': 'middle',
  }, svg);
  etiqT.textContent = 'théâtre — 10 élèves';
  const etiqO = el('text', {
    class: 'pop-dim', x: 400, y: POP.yEtiquettes, 'text-anchor': 'middle',
  }, svg);
  etiqO.textContent = 'les autres — 30 élèves';
  return points;
}

function initUnivers(fig) {
  const svg = fig.querySelector('svg');
  const points = dessinerPopulation(svg);
  const modes = [...fig.querySelectorAll('.segmente button')];
  const lignes = {
    tout: fig.querySelectorAll('.js-mode-tout'),
    theatre: fig.querySelectorAll('.js-mode-theatre'),
    musique: fig.querySelectorAll('.js-mode-musique'),
  };

  function appliquer(mode) {
    for (const p of points) {
      const visible = mode === 'tout' || (mode === 'theatre' ? p.theatre : p.musique);
      p.el.classList.toggle('pt-efface', !visible);
    }
    for (const [cle, els] of Object.entries(lignes)) {
      for (const e of els) e.hidden = cle !== mode;
    }
    for (const btn of modes) {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode));
    }
  }

  for (const btn of modes) {
    btn.addEventListener('click', () => {
      track('widget_interact', { widget: 'univers', chapitre });
      appliquer(btn.dataset.mode);
    });
  }

  appliquer('tout');
}

for (const fig of document.querySelectorAll('[data-widget="univers"]')) initUnivers(fig);
