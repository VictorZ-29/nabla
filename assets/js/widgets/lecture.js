/* Nabla — widgets/lecture.js
   « Lis f′(a) sur le graphique » : la tangente est déjà tracée, l'élève lit
   la pente sur le quadrillage unité (avance de 1 en x, compte en y, attention
   au sens). Manches définies en JSON dans la page ; réponses par boutons
   (styles quiz), relance sur erreur, score « du premier coup » à la fin.
   Spec de l'instance : premiere/maths/derivation/README.md. */

import { FONCTIONS, el, creerVue, cheminCourbe, grilleUnite, axes, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';
/* « 1,00 » → « 1 », « 0,50 » → « 0,5 » : les pentes lues sont des valeurs rondes */
const joli = (v) => fmt(v).replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');

function initLecture(fig) {
  const manches = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -3.2, xMax: 3.2, yMin: -2.2, yMax: 2.2 });
  const reponses = fig.querySelector('.js-reponses');
  const retour = fig.querySelector('.js-retour');
  const progression = fig.querySelector('.js-progression');
  const suivant = fig.querySelector('.js-suivant');
  const recommencer = fig.querySelector('.js-recommencer');

  let i = 0;
  let sansFaute = 0;
  let fauteManche = false;

  function dessiner() {
    const m = manches[i];
    const { f, fp } = FONCTIONS[m.fn];
    const fa = f(m.a);
    const pente = fp(m.a);

    svg.textContent = '';
    el('path', { class: 'g-grid', d: grilleUnite(vue) }, svg);
    el('path', { class: 'g-axis', d: axes(vue) }, svg);
    el('path', { class: 'g-courbe', d: cheminCourbe(vue, f, vue.xMin, vue.xMax) }, svg);
    const y0 = fa + pente * (vue.xMin - m.a);
    const y1 = fa + pente * (vue.xMax - m.a);
    el('path', { class: 'g-tangente', d: `M0 ${vue.yPx(y0)}L${vue.largeur} ${vue.yPx(y1)}` }, svg);

    /* triangle de lecture : de A, +1 en x (pointillé), puis en y jusqu'à la tangente */
    const ax = vue.xPx(m.a);
    const ay = vue.yPx(fa);
    const bx = vue.xPx(m.a + 1);
    const by = vue.yPx(fa + pente);
    el('path', { class: 'g-guide', 'stroke-dasharray': '4 4', d: `M${ax} ${ay}L${bx} ${ay}L${bx} ${by}` }, svg);
    const labPlus = el('text', {
      class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
      x: (ax + bx) / 2, y: pente >= 0 ? ay + 20 : ay - 10, 'text-anchor': 'middle',
    }, svg);
    labPlus.textContent = '+1';
    const bord = bx > vue.largeur - 60;
    const labQ = el('text', {
      class: 'etiquette-math etiquette-math--accent js-mystere', 'font-size': 16,
      x: bord ? bx - 10 : bx + 10, y: (ay + by) / 2 + 5,
      'text-anchor': bord ? 'end' : 'start',
    }, svg);
    labQ.textContent = '?';
    el('circle', { class: 'pt-fixe pt-fixe--surface', cx: ax, cy: ay, r: 5 }, svg);
    const labA = el('text', { class: 'etiquette-math', 'font-size': 17, x: ax - 22, y: ay - 12 }, svg);
    labA.textContent = 'A';

    reponses.textContent = '';
    m.choix.forEach((c, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-reponse';
      b.textContent = c;
      b.addEventListener('click', () => repondre(b, k + 1));
      reponses.appendChild(b);
    });

    retour.hidden = true;
    suivant.hidden = true;
    recommencer.hidden = true;
    fauteManche = false;
    progression.textContent = `POINT ${i + 1}/${manches.length}`;
  }

  function repondre(bouton, k) {
    track('widget_interact', { widget: 'lecture', chapitre });
    const m = manches[i];
    if (k === m.bonne) {
      bouton.dataset.etat = 'bonne';
      for (const b of reponses.children) b.disabled = true;
      const pente = FONCTIONS[m.fn].fp(m.a);
      if (!fauteManche) sansFaute += 1;
      fig.querySelector('.js-mystere').textContent = joli(pente);
      retour.innerHTML = `<span class="verdict verdict--bonne">EXACT —</span> depuis A, avance de 1 en x : la tangente ${pente > 0 ? 'monte' : 'descend'} de ${joli(Math.abs(pente))}. Donc f′(a) = ${joli(pente)}.`;
      if (i + 1 < manches.length) {
        suivant.textContent = `Point suivant (${i + 2}/${manches.length}) ▸`;
        suivant.hidden = false;
      } else {
        retour.innerHTML += ` <strong>Terminé : ${sansFaute}/${manches.length} du premier coup.</strong>`;
        recommencer.hidden = false;
      }
    } else {
      fauteManche = true;
      bouton.dataset.etat = 'fausse';
      bouton.disabled = true;
      retour.innerHTML = '<span class="verdict verdict--fausse">PAS ENCORE —</span> compte sur le quadrillage : +1 en x, combien en y ? Et vérifie le sens : la tangente monte-t-elle, ou descend-elle ?';
    }
    retour.hidden = false;
  }

  suivant.addEventListener('click', () => { i += 1; dessiner(); });
  recommencer.addEventListener('click', () => { i = 0; sansFaute = 0; dessiner(); });
  dessiner();
}

for (const fig of document.querySelectorAll('[data-widget="lecture"]')) initLecture(fig);
