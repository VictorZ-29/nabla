/* Nabla — widgets/associe.js
   « Associe chaque f à sa dérivée » : trois cartes de fonctions en haut,
   leurs dérivées mélangées en bas. On touche une carte de chaque rangée ;
   paire juste : les deux cartes se verrouillent en vert ; paire fausse :
   marquage bref et on réessaie. Le jeu de cartes vient d'un JSON dans la
   page. Piège volontaire : la dérivée du cube (x² − 1) a la même tête
   qu'une fonction du haut, pour punir l'association « même forme ».
   Spec de l'instance : premiere/maths/derivation/README.md. */

import { FONCTIONS, el, creerVue, cheminCourbe } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
const LETTRES = ['A', 'B', 'C', 'D'];

function initAssocie(fig) {
  const paires = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const rangF = fig.querySelector('.js-rang-f');
  const rangFp = fig.querySelector('.js-rang-fp');
  const retour = fig.querySelector('.js-retour');

  let choixF = null;   // carte sélectionnée en haut
  let choixFp = null;  // carte sélectionnée en bas
  let associees = 0;

  function carte(paire, etiquette, estDerivee) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'associe-carte';
    b.dataset.paire = String(paire.id);
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', estDerivee
      ? `Proposition ${etiquette} pour f prime`
      : `Fonction ${etiquette}`);
    const lab = document.createElement('span');
    lab.className = 'associe-etiquette';
    lab.textContent = etiquette;
    b.appendChild(lab);
    const svg = el('svg', { viewBox: '0 0 200 120', 'aria-hidden': 'true' }, b);
    const [yMin, yMax] = estDerivee ? paire.yfp : paire.yf;
    const vue = creerVue(svg, { xMin: -2.5, xMax: 2.5, yMin, yMax });
    el('path', { class: 'g-axe-mini', d: `M0 ${vue.yPx(0)}L${vue.largeur} ${vue.yPx(0)}M${vue.xPx(0)} ${vue.hauteur}L${vue.xPx(0)} 0` }, svg);
    const fonc = FONCTIONS[paire.fn];
    el('path', {
      class: estDerivee ? 'g-courbe-mini g-courbe-mini--derivee' : 'g-courbe-mini',
      d: cheminCourbe(vue, estDerivee ? fonc.fp : fonc.f, -2.5, 2.5),
    }, svg);
    return b;
  }

  function selectionner(b, rang) {
    const courant = rang === 'f' ? choixF : choixFp;
    if (courant) courant.setAttribute('aria-pressed', 'false');
    const nouveau = courant === b ? null : b;
    if (nouveau) nouveau.setAttribute('aria-pressed', 'true');
    if (rang === 'f') choixF = nouveau; else choixFp = nouveau;
    if (choixF && choixFp) verifier();
  }

  function verifier() {
    track('widget_interact', { widget: 'associe', chapitre });
    const bas = choixFp;
    const haut = choixF;
    choixF = null;
    choixFp = null;
    haut.setAttribute('aria-pressed', 'false');
    bas.setAttribute('aria-pressed', 'false');
    if (haut.dataset.paire === bas.dataset.paire) {
      /* la carte du bas reprend le numéro de sa fonction : la paire se lit */
      const num = haut.querySelector('.associe-etiquette').textContent;
      haut.querySelector('.associe-etiquette').textContent = `${num} ✓`;
      bas.querySelector('.associe-etiquette').textContent = `✓ f′ de ${num}`;
      bas.setAttribute('aria-label', `Associée à la fonction ${num}`);
      for (const b of [haut, bas]) {
        b.classList.add('est-associee');
        b.disabled = true;
      }
      associees += 1;
      retour.innerHTML = associees === paires.length
        ? '<span class="verdict verdict--bonne">TERMINÉ —</span> 3 sur 3. Les sommets de f tombent exactement sur les zéros de f′ : c\'est le réflexe à garder.'
        : '<span class="verdict verdict--bonne">EXACT —</span> sommet de f, zéro de f′ : même abscisse.';
    } else {
      for (const b of [haut, bas]) b.dataset.etat = 'fausse';
      setTimeout(() => { for (const b of [haut, bas]) delete b.dataset.etat; }, 700);
      retour.innerHTML = '<span class="verdict verdict--fausse">PAS ENCORE —</span> cherche les sommets de la courbe du haut : f′ doit couper l\'axe des abscisses aux mêmes x. Et méfie-toi des sosies : même forme ne veut pas dire même rôle.';
    }
    retour.hidden = false;
  }

  function distribuer() {
    choixF = null;
    choixFp = null;
    associees = 0;
    retour.hidden = true;
    rangF.textContent = '';
    rangFp.textContent = '';
    const melange = [...paires].sort(() => Math.random() - 0.5);
    paires.forEach((p, k) => {
      const b = carte(p, String(k + 1), false);
      b.addEventListener('click', () => selectionner(b, 'f'));
      rangF.appendChild(b);
    });
    melange.forEach((p, k) => {
      const b = carte(p, LETTRES[k], true);
      b.addEventListener('click', () => selectionner(b, 'fp'));
      rangFp.appendChild(b);
    });
  }

  paires.forEach((p, k) => { p.id = k; });
  fig.querySelector('.js-reset').addEventListener('click', distribuer);
  distribuer();
}

for (const fig of document.querySelectorAll('[data-widget="associe"]')) initAssocie(fig);
