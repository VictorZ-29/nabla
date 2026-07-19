/* Nabla — widgets/redox-equation.js
   « Fais les comptes d'électrons » : deux demi-équations (une oxydation qui
   cède eOx électrons, une réduction qui en capte eRed), deux multiplicateurs
   que l'élève règle par boutons − / +. Tant que les comptes ne tombent pas
   d'accord, l'équation refuse de s'écrire ; dès que cédés = captés, les
   électrons s'annulent et l'équation d'oxydoréduction s'assemble. Les
   équations résultat sont des blocs statiques de la page (KaTeX rendu au
   chargement) que le module ne fait que masquer/démasquer : accord minimal
   (2 ; 3), accord double (4 ; 6) — avec la morale « garde les plus petits
   entiers ». Spec : premiere/physique-chimie/oxydoreduction-titrages/README.md. */

import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);

function initEquation(fig) {
  const d = fig.dataset;
  const eOx = parseInt(d.eOx, 10);    /* e⁻ cédés par la demi-équation d'oxydation */
  const eRed = parseInt(d.eRed, 10);  /* e⁻ captés par la demi-équation de réduction */
  const mMax = parseInt(d.mMax, 10) || 6;
  let mOx = 1;
  let mRed = 1;

  /* le plus petit accord possible : (eRed/g ; eOx/g) */
  const g = pgcd(eOx, eRed);
  const minOx = eRed / g;
  const minRed = eOx / g;

  const affMOx = fig.querySelector('.js-m-ox');
  const affMRed = fig.querySelector('.js-m-red');
  const calcOx = fig.querySelector('.js-calc-ox');
  const calcRed = fig.querySelector('.js-calc-red');
  const chipEtat = fig.querySelector('.js-etat');
  const attente = fig.querySelector('.js-eq-attente');
  const simple = fig.querySelector('.js-eq-simple');
  const double = fig.querySelector('.js-eq-double');
  const btns = {
    oxMoins: fig.querySelector('.js-ox-moins'),
    oxPlus: fig.querySelector('.js-ox-plus'),
    redMoins: fig.querySelector('.js-red-moins'),
    redPlus: fig.querySelector('.js-red-plus'),
  };

  function rendre() {
    const cedes = eOx * mOx;
    const captes = eRed * mRed;
    const accord = cedes === captes;

    affMOx.textContent = String(mOx);
    affMRed.textContent = String(mRed);
    calcOx.textContent = `${mOx} × ${eOx} = ${cedes}`;
    calcRed.textContent = `${mRed} × ${eRed} = ${captes}`;

    if (accord) {
      chipEtat.innerHTML = `${cedes} e<sup>−</sup> cédés = ${captes} e<sup>−</sup> captés — ils s’annulent`;
      chipEtat.className = 'chip chip--good js-etat';
    } else {
      chipEtat.innerHTML = `${cedes} e<sup>−</sup> cédés ≠ ${captes} e<sup>−</sup> captés`;
      chipEtat.className = 'chip chip--bad js-etat';
    }

    const minimal = accord && mOx === minOx && mRed === minRed;
    attente.hidden = accord;
    simple.hidden = !minimal;
    double.hidden = !(accord && !minimal);

    btns.oxMoins.disabled = mOx <= 1;
    btns.oxPlus.disabled = mOx >= mMax;
    btns.redMoins.disabled = mRed <= 1;
    btns.redPlus.disabled = mRed >= mMax;
  }

  function interaction() {
    track('widget_interact', { widget: 'redox-equation', chapitre });
  }

  const pas = (quoi, delta) => () => {
    if (quoi === 'ox') mOx = Math.min(mMax, Math.max(1, mOx + delta));
    else mRed = Math.min(mMax, Math.max(1, mRed + delta));
    interaction();
    rendre();
  };
  btns.oxMoins.addEventListener('click', pas('ox', -1));
  btns.oxPlus.addEventListener('click', pas('ox', 1));
  btns.redMoins.addEventListener('click', pas('red', -1));
  btns.redPlus.addEventListener('click', pas('red', 1));

  fig.querySelector('.js-reset').addEventListener('click', () => {
    mOx = 1;
    mRed = 1;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="redox-equation"]')) initEquation(fig);
