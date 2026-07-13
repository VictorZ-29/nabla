/* Nabla — widgets/somme.js
   « L'astuce de Gauss, en images » : un escalier de colonnes de 1, 2, …, n
   cases (la somme 1 + 2 + ⋯ + n), et un bouton qui pose dessus la copie
   retournée de l'escalier : ensemble ils remplissent exactement un
   rectangle de n lignes sur (n + 1) colonnes. D'où n(n+1)/2. Curseur n,
   lecture en direct, étiquettes des dimensions quand la copie est posée.
   Spec de l'instance : premiere/maths/suites/README.md. */

import { el } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initSomme(fig) {
  const d = fig.dataset;
  const nInit = parseInt(d.nInit, 10);
  let n = nInit;
  let copieVisible = false;

  const svg = fig.querySelector('svg');
  const vb = svg.viewBox.baseVal;

  const gEscalier = el('g', {}, svg);
  const gCopie = el('g', { class: 'som-copie' }, svg);
  const gNums = el('g', {}, svg);
  const labBas = el('text', { class: 'som-dim', 'text-anchor': 'middle' }, svg);
  const labGauche = el('text', { class: 'som-dim', 'text-anchor': 'middle' }, svg);

  const lecture = fig.querySelector('.js-lecture');
  const elN = fig.querySelector('.js-n-chip');
  const elSomme = fig.querySelector('.js-somme');
  const curseur = fig.querySelector('.js-curseur');
  const toggle = fig.querySelector('.js-copie');

  function dessiner() {
    /* cases carrées, dimensionnées pour que le rectangle n × (n+1) tienne */
    const cote = Math.min(44, Math.floor(520 / (n + 1)), Math.floor(250 / n));
    const largeur = (n + 1) * cote;
    const hauteur = n * cote;
    const x0 = (vb.width - largeur) / 2;
    const y0 = (vb.height - hauteur) / 2 - 10;
    const yBase = y0 + hauteur;

    gEscalier.textContent = '';
    gCopie.textContent = '';
    gNums.textContent = '';

    const case_ = (parent, col, rang) => el('rect', {
      class: 'som-case',
      x: x0 + col * cote + 1, y: yBase - (rang + 1) * cote + 1,
      width: cote - 2, height: cote - 2, rx: 2,
    }, parent);

    /* escalier : colonne c (0 … n−1) de hauteur c+1 ; copie : le complément
       du rectangle n × (n+1), y compris la dernière colonne, pleine */
    for (let c = 0; c < n; c++) {
      for (let rang = 0; rang <= c; rang++) case_(gEscalier, c, rang);
      for (let rang = c + 1; rang < n; rang++) case_(gCopie, c, rang);
      const num = el('text', {
        class: 'som-num', x: x0 + c * cote + cote / 2, y: yBase + 16, 'text-anchor': 'middle',
      }, gNums);
      num.textContent = String(c + 1);
    }
    for (let rang = 0; rang < n; rang++) case_(gCopie, n, rang);

    labBas.setAttribute('x', x0 + largeur / 2);
    labBas.setAttribute('y', yBase + 34);
    labBas.textContent = `n + 1 = ${n + 1} colonnes`;
    labGauche.setAttribute('transform', `rotate(-90 ${x0 - 16} ${y0 + hauteur / 2})`);
    labGauche.setAttribute('x', x0 - 16);
    labGauche.setAttribute('y', y0 + hauteur / 2 + 4);
    labGauche.textContent = `n = ${n} lignes`;

    rendreEtat();
  }

  function rendreEtat() {
    const somme = (n * (n + 1)) / 2;
    gCopie.classList.toggle('visible', copieVisible);
    labBas.style.display = copieVisible ? '' : 'none';
    labGauche.style.display = copieVisible ? '' : 'none';
    toggle.textContent = copieVisible ? '↺ enlève la copie' : '▸ pose la copie retournée';
    toggle.setAttribute('aria-pressed', String(copieVisible));
    if (copieVisible) {
      lecture.textContent = `deux escaliers = un rectangle de ${n} × ${n + 1} = ${n * (n + 1)} cases, donc 1 + 2 + … + ${n} = ${n * (n + 1)} ÷ 2 = ${somme}`;
    } else {
      lecture.textContent = `1 + 2 + … + ${n} = ? — compter les cases une à une, non merci. Essaie le bouton.`;
    }
    elN.textContent = String(n);
    elSomme.textContent = copieVisible ? String(somme) : '?';
    if (parseFloat(curseur.value) !== n) curseur.value = String(n);
    const min = parseFloat(curseur.min);
    const max = parseFloat(curseur.max);
    curseur.style.setProperty('--pos', (((n - min) / (max - min)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `n = ${n}, somme = ${somme}`);
  }

  function interaction() {
    track('widget_interact', { widget: 'somme', chapitre });
  }

  curseur.addEventListener('input', () => {
    n = parseInt(curseur.value, 10);
    interaction();
    dessiner();
  });

  toggle.addEventListener('click', () => {
    copieVisible = !copieVisible;
    interaction();
    rendreEtat();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    n = nInit;
    copieVisible = false;
    dessiner();
  });

  dessiner();
}

for (const fig of document.querySelectorAll('[data-widget="somme"]')) initSomme(fig);
