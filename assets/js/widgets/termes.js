/* Nabla — widgets/termes.js
   « Explicite ou récurrence : deux machines » : deux panneaux côte à côte.
   Machine 1 (formule explicite) : un curseur n, le terme se calcule d'un
   coup, quel que soit n. Machine 2 (récurrence) : un seul bouton « terme
   suivant », la chaîne des termes se construit ligne à ligne — impossible
   de sauter une marche. Le contraste des contrôles EST la leçon.
   Spec de l'instance : premiere/maths/suites/README.md. */

import { fmtCourt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Registre des règles ; une entrée par clé data-exp / data-rec. */
const EXPLICITES = {
  'n2-2n': { f: (n) => n * n - 2 * n },
};
const RECURRENCES = {
  '2v-1': { v0: 2, nMax: 10, f: (v) => 2 * v - 1, calcul: (v) => `2 × ${entier(v)} − 1` },
};

/* Entiers à la française : vrai moins, groupes de trois (espace fine insécable). */
function entier(v) {
  const s = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + s;
}

function initTermes(fig) {
  const exp = EXPLICITES[fig.dataset.exp];
  const rec = RECURRENCES[fig.dataset.rec];

  const curseur = fig.querySelector('.js-n');
  const cn1 = fig.querySelector('.js-cn1');
  const cn2 = fig.querySelector('.js-cn2');
  const cn3 = fig.querySelector('.js-cn3');
  const cres = fig.querySelector('.js-cres');
  const suivant = fig.querySelector('.js-suivant');
  const chaine = fig.querySelector('.js-chaine');
  const note = fig.querySelector('.js-note');
  const reset = fig.querySelector('.js-reset');

  const nInit = parseInt(curseur.value, 10);
  let n = nInit;
  let rang = 0;           // dernier rang calculé par la machine 2
  let valeur = rec.v0;    // sa valeur

  function interaction() {
    track('widget_interact', { widget: 'termes', chapitre });
  }

  function rendreExplicite() {
    cn1.textContent = String(n);
    cn2.textContent = String(n);
    cn3.textContent = String(n);
    cres.textContent = entier(exp.f(n));
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((n - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `n = ${n}, u de ${n} = ${entier(exp.f(n))}`);
  }

  function ligneDepart() {
    chaine.textContent = '';
    const li = document.createElement('li');
    li.innerHTML = `v<sub>0</sub> = ${entier(rec.v0)} <span class="machine-donne">(donné)</span>`;
    chaine.appendChild(li);
  }

  function rendreNote() {
    if (rang === 0) {
      note.textContent = 'Pour l’instant, tu ne connais que le premier terme. Les suivants se méritent.';
    } else if (rang < rec.nMax) {
      note.innerHTML = `${rang} calcul${rang > 1 ? 's' : ''} pour arriver à v<sub>${rang}</sub>. Et toujours pas moyen de sauter une marche.`;
    } else {
      note.innerHTML = `${rec.nMax} calculs pour v<sub>${rec.nMax}</sub>. Pour v<sub>50</sub>, il en faudrait 50 : la récurrence fait tout le chemin à pied.`;
    }
  }

  /* les événements input peuvent dépasser la cadence d'affichage pendant un
     drag : au plus un rendu par frame */
  let renduPlanifie = 0;
  curseur.addEventListener('input', () => {
    n = parseInt(curseur.value, 10);
    interaction();
    if (!renduPlanifie) {
      renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendreExplicite(); });
    }
  });

  suivant.addEventListener('click', () => {
    if (rang >= rec.nMax) return;
    interaction();
    const precedente = valeur;
    valeur = rec.f(valeur);
    rang += 1;
    const li = document.createElement('li');
    li.innerHTML = `v<sub>${rang}</sub> = ${rec.calcul(precedente)} = <strong>${entier(valeur)}</strong>`;
    chaine.appendChild(li);
    suivant.disabled = rang >= rec.nMax;
    rendreNote();
  });

  reset.addEventListener('click', () => {
    n = nInit;
    curseur.value = String(nInit);
    rang = 0;
    valeur = rec.v0;
    suivant.disabled = false;
    ligneDepart();
    rendreNote();
    rendreExplicite();
  });

  ligneDepart();
  rendreNote();
  rendreExplicite();
}

for (const fig of document.querySelectorAll('[data-widget="termes"]')) initTermes(fig);
