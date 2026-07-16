/* Nabla — widgets/limitant.js
   « La course vers zéro » : pour 2 H₂ + O₂ → 2 H₂O, les droites n(x) des
   trois espèces en fonction de l'avancement. Deux curseurs règlent les
   quantités initiales ; chaque réactif descend à la vitesse de son
   coefficient, et la réaction s'arrête au premier qui touche l'axe :
   x_max, le plus petit des deux candidats. Au-delà, les droites continuent
   en pointillé sous zéro — des quantités négatives, impossibles. Défi dans
   la page : régler les curseurs pour que les deux droites atterrissent
   ensemble (mélange stœchiométrique, formalisé au §4).
   Spec : premiere/physique-chimie/reaction-avancement/README.md. */

import { el, texteChimie, creerVue, axes, clamp, fmt } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function htmlChimie(formule) {
  return formule.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>');
}

function initLimitant(fig) {
  const d = fig.dataset;
  let a = parseFloat(d.h2Init);   /* n₀(H₂) */
  let b = parseFloat(d.o2Init);   /* n₀(O₂) */

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -0.06, xMax: 1.16, yMin: -0.45, yMax: 2.25 });

  /* --- décor statique : grille fine (0,2 en x ; 0,5 en n), axes, légendes --- */
  let dGrille = '';
  for (let gx = 0.2; gx <= 1.01; gx += 0.2) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  for (let gn = 0.5; gn <= 2.01; gn += 0.5) {
    dGrille += `M0 ${vue.yPx(gn).toFixed(1)}L${vue.largeur} ${vue.yPx(gn).toFixed(1)}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', { class: 'g-axis', d: axes(vue) }, svg);
  const labX = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.largeur - 10, y: vue.yPx(0) + 20, 'text-anchor': 'end',
  }, svg);
  labX.textContent = 'x (mol)';
  const labN = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 15,
    x: vue.xPx(0) + 8, y: 16,
  }, svg);
  labN.textContent = 'n (mol)';
  const labImpossible = el('text', {
    class: 'etiquette-mono', 'font-size': 12, fill: 'currentColor',
    x: vue.largeur - 10, y: vue.yPx(-0.34), 'text-anchor': 'end',
  }, svg);
  labImpossible.textContent = 'n < 0 : impossible';
  labImpossible.setAttribute('class', 'etiquette-mono avc-impossible');

  /* --- éléments dynamiques : 3 droites solides + 3 prolongements pointillés,
         2 candidats sur l'axe, guide vertical à x_max, étiquettes ------------ */
  const guide = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svg);
  const fantomes = [
    el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg),
    el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg),
    el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svg),
  ];
  const droites = [
    el('path', { class: 'g-courbe' }, svg),           /* H₂ (craie) */
    el('path', { class: 'g-courbe' }, svg),           /* O₂ (craie) */
    el('path', { class: 'g-courbe-derivee' }, svg),   /* H₂O (accent) */
  ];
  const ptH2 = el('circle', { class: 'pt-fixe pt-fixe--surface', r: 4.5 }, svg);
  const ptO2 = el('circle', { class: 'pt-fixe pt-fixe--surface', r: 4.5 }, svg);
  const labCandH2 = el('text', { class: 'avc-candidat', 'text-anchor': 'middle' }, svg);
  const labCandO2 = el('text', { class: 'avc-candidat', 'text-anchor': 'middle' }, svg);
  const labH2 = texteChimie(svg, 'H2', { class: 'avc-nom', 'text-anchor': 'start' });
  const labO2 = texteChimie(svg, 'O2', { class: 'avc-nom', 'text-anchor': 'start' });
  const labH2O = texteChimie(svg, 'H2O', { class: 'avc-nom avc-nom--accent', 'text-anchor': 'middle' });

  /* --- lectures ------------------------------------------------------------ */
  const cH2 = fig.querySelector('.js-h2');
  const cO2 = fig.querySelector('.js-o2');
  const lectH2 = fig.querySelector('.js-lect-h2');
  const lectO2 = fig.querySelector('.js-lect-o2');
  const chipCandH2 = fig.querySelector('.js-cand-h2');
  const chipCandO2 = fig.querySelector('.js-cand-o2');
  const chipEtat = fig.querySelector('.js-etat');
  const ligne = fig.querySelector('.js-ligne');
  const legende = fig.querySelector('.js-legende');

  const seg = (x1, n1, x2, n2) =>
    `M${vue.xPx(x1).toFixed(1)} ${vue.yPx(n1).toFixed(1)}L${vue.xPx(x2).toFixed(1)} ${vue.yPx(n2).toFixed(1)}`;

  function rendre() {
    const candH2 = a / 2;
    const candO2 = b;
    const xm = Math.min(candH2, candO2);
    const stoechio = Math.abs(candH2 - candO2) < 1e-6;

    /* droites réelles, sur [0 ; x_max] seulement */
    droites[0].setAttribute('d', seg(0, a, xm, a - 2 * xm));
    droites[1].setAttribute('d', seg(0, b, xm, b - xm));
    droites[2].setAttribute('d', seg(0, 0, xm, 2 * xm));

    /* prolongements fictifs « si on pouvait continuer » (pointillés) */
    const finH2 = Math.min(1.12, (a + 0.4) / 2);
    const finO2 = Math.min(1.12, b + 0.4);
    const finEau = Math.min(1.12, 1.1);
    fantomes[0].setAttribute('d', finH2 > xm ? seg(xm, a - 2 * xm, finH2, a - 2 * finH2) : '');
    fantomes[1].setAttribute('d', finO2 > xm ? seg(xm, b - xm, finO2, b - finO2) : '');
    fantomes[2].setAttribute('d', finEau > xm ? seg(xm, 2 * xm, finEau, 2 * finEau) : '');

    guide.setAttribute('d', `M${vue.xPx(xm).toFixed(1)} ${vue.yPx(0).toFixed(1)}L${vue.xPx(xm).toFixed(1)} ${vue.yPx(2.2).toFixed(1)}`);

    /* candidats sur l'axe : le gagnant en accent, l'autre en craie */
    ptH2.setAttribute('cx', vue.xPx(candH2).toFixed(1));
    ptH2.setAttribute('cy', vue.yPx(0).toFixed(1));
    ptO2.setAttribute('cx', vue.xPx(candO2).toFixed(1));
    ptO2.setAttribute('cy', vue.yPx(0).toFixed(1));
    if (stoechio) {
      ptH2.setAttribute('class', 'pt-point');
      ptO2.setAttribute('class', 'pt-point');
    } else {
      ptH2.setAttribute('class', candH2 < candO2 ? 'pt-point' : 'pt-fixe pt-fixe--surface');
      ptO2.setAttribute('class', candO2 < candH2 ? 'pt-point' : 'pt-fixe pt-fixe--surface');
    }
    ptH2.setAttribute('r', candH2 <= candO2 ? 5.5 : 4.5);
    ptO2.setAttribute('r', candO2 <= candH2 ? 5.5 : 4.5);

    /* étiquettes des candidats sous l'axe (décalées si trop proches) */
    const proches = !stoechio && Math.abs(candH2 - candO2) < 0.12;
    labCandH2.setAttribute('x', vue.xPx(candH2).toFixed(1));
    labCandH2.setAttribute('y', (vue.yPx(0) + 18).toFixed(1));
    labCandH2.textContent = stoechio ? '' : fmt(candH2);
    labCandO2.setAttribute('x', vue.xPx(candO2).toFixed(1));
    labCandO2.setAttribute('y', (vue.yPx(0) + (proches ? 32 : 18)).toFixed(1));
    labCandO2.textContent = fmt(candO2);

    /* étiquettes des droites, près de leur départ (H₂ au-dessus, O₂ au-dessous) */
    labH2.setAttribute('x', (vue.xPx(0.02)).toFixed(1));
    labH2.setAttribute('y', (vue.yPx(a) - 10).toFixed(1));
    labO2.setAttribute('x', (vue.xPx(0.02)).toFixed(1));
    labO2.setAttribute('y', (vue.yPx(b) + 20).toFixed(1));
    labH2O.setAttribute('x', vue.xPx(xm * 0.62).toFixed(1));
    labH2O.setAttribute('y', (vue.yPx(2 * xm * 0.62) - 12).toFixed(1));

    lectH2.textContent = fmt(a);
    lectO2.textContent = fmt(b);
    chipCandH2.innerHTML = `H<sub>2</sub> à zéro pour x = ${fmt(candH2)}`;
    chipCandO2.innerHTML = `O<sub>2</sub> à zéro pour x = ${fmt(candO2)}`;

    const eauFinale = fmt(2 * xm);
    if (stoechio) {
      chipEtat.innerHTML = 'mélange stœchiométrique';
      chipEtat.className = 'chip chip--good js-etat';
      ligne.innerHTML = `x<sub>max</sub> = ${fmt(xm)} mol → plus rien des deux réactifs · ${eauFinale} mol de H<sub>2</sub>O`;
      legende.textContent = `Les deux droites touchent l'axe au même endroit : les deux réactifs finissent exactement ensemble, à x = ${fmt(xm)} mol. Tu viens de fabriquer un mélange stœchiométrique — la section 4 lui est consacrée.`;
    } else {
      const limitant = candH2 < candO2 ? 'H<sub>2</sub>' : 'O<sub>2</sub>';
      const excesHtml = candH2 < candO2 ? 'O<sub>2</sub>' : 'H<sub>2</sub>';
      const resteExces = candH2 < candO2 ? b - xm : a - 2 * xm;
      chipEtat.innerHTML = `limitant : ${limitant} — le premier à zéro`;
      chipEtat.className = 'chip chip--bad js-etat';
      ligne.innerHTML = `x<sub>max</sub> = ${fmt(xm)} mol → il reste ${fmt(resteExces)} mol de ${excesHtml} · il s'est formé ${eauFinale} mol de H<sub>2</sub>O`;
      legende.textContent = candH2 < candO2
        ? `Le dihydrogène descend deux fois plus vite que le dioxygène — son coefficient est 2. Il touche zéro le premier : la réaction s'arrête à x = ${fmt(xm)} mol, et le pointillé montre l'interdit — continuer donnerait une quantité négative.`
        : `Le dioxygène touche zéro le premier, et tout s'arrête à x = ${fmt(xm)} mol : sans lui, le dihydrogène restant (${fmt(a - 2 * xm)} mol) n'a plus personne avec qui réagir. Le pointillé montre l'interdit — continuer donnerait une quantité négative.`;
    }

    if (parseFloat(cH2.value) !== a) cH2.value = String(a);
    if (parseFloat(cO2.value) !== b) cO2.value = String(b);
    cH2.style.setProperty('--pos', (((a - parseFloat(cH2.min)) / (parseFloat(cH2.max) - parseFloat(cH2.min))) * 100) + '%');
    cO2.style.setProperty('--pos', (((b - parseFloat(cO2.min)) / (parseFloat(cO2.max) - parseFloat(cO2.min))) * 100) + '%');
    cH2.setAttribute('aria-valuetext', `n initial de dihydrogène ${fmt(a)} mole, avancement maximal ${fmt(xm)} mole`);
    cO2.setAttribute('aria-valuetext', `n initial de dioxygène ${fmt(b)} mole, avancement maximal ${fmt(xm)} mole`);
  }

  function interaction() {
    track('widget_interact', { widget: 'limitant', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  cH2.addEventListener('input', () => {
    a = Math.round(clamp(parseFloat(cH2.value), parseFloat(cH2.min), parseFloat(cH2.max)) * 100) / 100;
    interaction();
    planifierRendu();
  });
  cO2.addEventListener('input', () => {
    b = Math.round(clamp(parseFloat(cO2.value), parseFloat(cO2.min), parseFloat(cO2.max)) * 100) / 100;
    interaction();
    planifierRendu();
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    a = parseFloat(d.h2Init);
    b = parseFloat(d.o2Init);
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="limitant"]')) initLimitant(fig);
