/* Nabla — widgets/couleur-synthese.js
   « Mélanger les lumières » : trois lampes rouge/vert/bleu sur une scène
   noire (synthèse additive) ou trois filtres cyan/magenta/jaune devant un
   écran blanc (synthèse soustractive). L'élève allume, superpose, et lit
   la couleur obtenue — chaque zone de recouvrement est peinte de sa vraie
   couleur (régions découpées par clipPath, aucun mode de fusion).
   Les couleurs « physiques » viennent des tokens --lum-* (tokens.css).
   Spec : premiere/physique-chimie/lentilles-couleurs/README.md. */

import { el } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Position des trois disques (viewBox 640 × 280) et rayon commun. */
const R = 88;
const CENTRES = [[320, 105], [258, 188], [382, 188]];

/* nom affiché de chaque couleur-résultat (clé = classe lum-*) */
const NOMS = {
  rouge: 'rouge', vert: 'vert', bleu: 'bleu', cyan: 'cyan',
  magenta: 'magenta', jaune: 'jaune', blanc: 'blanc', noir: 'noir',
};

/* résultat par combinaison (clés triées) — additive puis soustractive */
const RES_ADD = {
  '': 'noir', r: 'rouge', v: 'vert', b: 'bleu',
  rv: 'jaune', br: 'magenta', bv: 'cyan', brv: 'blanc',
};
const RES_SOUS = {
  '': 'blanc', c: 'cyan', m: 'magenta', j: 'jaune',
  cm: 'bleu', cj: 'vert', jm: 'rouge', cjm: 'noir',
};

function initSynthese(fig) {
  const nom = fig.dataset.nom || 'syntheses';
  const svg = fig.querySelector('svg');
  const idBase = fig.id || 'synthese';
  let mode = 'add';
  const allume = { r: true, v: false, b: false };     /* lampes (additive) */
  const pose = { c: true, m: false, j: false };       /* filtres (soustractive) */

  /* --- construction d'une scène : fond + 3 contours + 7 régions ------------ */
  const defs = el('defs', {}, svg);
  function clip(idc, i) {
    const c = el('clipPath', { id: idc }, defs);
    el('circle', { cx: CENTRES[i][0], cy: CENTRES[i][1], r: R }, c);
    return `url(#${idc})`;
  }

  function scene(prefixe, fondClasse, couleurs, paires, triple) {
    const g = el('g', {}, svg);
    el('rect', { class: fondClasse, x: 30, y: 8, width: 580, height: 264, rx: 10 }, g);
    const contours = CENTRES.map(([cx, cy]) =>
      el('circle', { class: 'lum-contour', cx, cy, r: R }, g));
    /* disques simples */
    const simples = couleurs.map((coul, i) =>
      el('circle', { class: `lum-${coul}`, cx: CENTRES[i][0], cy: CENTRES[i][1], r: R }, g));
    /* recouvrements deux à deux : disque j découpé par le disque i */
    const doubles = paires.map(([i, j, coul], k) => {
      const gp = el('g', { 'clip-path': clip(`${idBase}-${prefixe}-p${k}`, i) }, g);
      el('circle', { class: `lum-${coul}`, cx: CENTRES[j][0], cy: CENTRES[j][1], r: R }, gp);
      return gp;
    });
    /* recouvrement des trois : disque 2 découpé par 0 puis par 1 */
    const gt1 = el('g', { 'clip-path': clip(`${idBase}-${prefixe}-t0`, 0) }, g);
    const gt2 = el('g', { 'clip-path': clip(`${idBase}-${prefixe}-t1`, 1) }, gt1);
    el('circle', { class: `lum-${triple}`, cx: CENTRES[2][0], cy: CENTRES[2][1], r: R }, gt2);
    return { g, contours, simples, doubles, gTriple: gt1 };
  }

  /* additive : R(0) V(1) B(2) — R∩V jaune, R∩B magenta, V∩B cyan, centre blanc */
  const scAdd = scene('add', 'lum-fond-noir', ['rouge', 'vert', 'bleu'],
    [[0, 1, 'jaune'], [0, 2, 'magenta'], [1, 2, 'cyan']], 'blanc');
  /* soustractive : C(0) M(1) J(2) — C∩M bleu, C∩J vert, M∩J rouge, centre noir */
  const scSous = scene('sous', 'lum-fond-blanc', ['cyan', 'magenta', 'jaune'],
    [[0, 1, 'bleu'], [0, 2, 'vert'], [1, 2, 'rouge']], 'noir');

  /* --- lectures et contrôles ----------------------------------------------- */
  const modes = [...fig.querySelectorAll('.js-mode')];
  const lampes = [...fig.querySelectorAll('.js-lampe')];
  const filtres = [...fig.querySelectorAll('.js-filtre')];
  const grpAdd = fig.querySelector('.js-controles-add');
  const grpSous = fig.querySelector('.js-controles-sous');
  const resultat = fig.querySelector('.js-resultat');
  const chip = fig.querySelector('.js-chip');
  const puce = fig.querySelector('.js-puce');
  const legBlanc = fig.querySelector('.js-leg-blanc');
  const legNoir = fig.querySelector('.js-leg-noir');

  function rendre() {
    const add = mode === 'add';
    scAdd.g.style.display = add ? '' : 'none';
    scSous.g.style.display = add ? 'none' : '';
    grpAdd.hidden = !add;
    grpSous.hidden = add;
    for (const b of modes) b.setAttribute('aria-pressed', String((b.dataset.mode === 'add') === add));

    const sc = add ? scAdd : scSous;
    const etat = add ? allume : pose;
    const cles = add ? ['r', 'v', 'b'] : ['c', 'm', 'j'];
    const on = cles.map((k) => etat[k]);

    for (const [i, s] of sc.simples.entries()) s.style.display = on[i] ? '' : 'none';
    sc.doubles[0].style.display = on[0] && on[1] ? '' : 'none';
    sc.doubles[1].style.display = on[0] && on[2] ? '' : 'none';
    sc.doubles[2].style.display = on[1] && on[2] ? '' : 'none';
    sc.gTriple.style.display = on[0] && on[1] && on[2] ? '' : 'none';
    for (const [i, c] of sc.contours.entries()) c.style.display = on[i] ? 'none' : '';

    for (const b of (add ? lampes : filtres)) {
      b.setAttribute('aria-pressed', String(etat[b.dataset.c]));
    }

    /* ligne de résultat + chip colorée */
    const nomsOn = (add ? lampes : filtres)
      .filter((b) => etat[b.dataset.c])
      .map((b) => b.dataset.couleur);
    const cle = cles.filter((k) => etat[k]).sort().join('');
    const res = add ? RES_ADD[cle] : RES_SOUS[cle];
    if (add) {
      resultat.textContent = nomsOn.length === 0
        ? 'aucune lampe allumée → la scène reste noire'
        : `lumières ${nomsOn.join(' + ')} → ${NOMS[res]}`;
    } else {
      resultat.textContent = nomsOn.length === 0
        ? 'aucun filtre posé → l’écran reste blanc'
        : `lumière blanche − filtre ${nomsOn.join(' − filtre ')} → ${NOMS[res]}`;
    }
    chip.textContent = `on voit : ${NOMS[res]}`;
    puce.className = `lum-puce lum-puce--${res} js-puce`;

    legBlanc.hidden = !(add && res === 'blanc');
    legNoir.hidden = !(!add && res === 'noir');
  }

  function interaction() {
    track('widget_interact', { widget: nom, chapitre });
  }

  for (const b of modes) {
    b.addEventListener('click', () => {
      mode = b.dataset.mode;
      interaction();
      rendre();
    });
  }
  for (const b of lampes) {
    b.addEventListener('click', () => {
      allume[b.dataset.c] = !allume[b.dataset.c];
      interaction();
      rendre();
    });
  }
  for (const b of filtres) {
    b.addEventListener('click', () => {
      pose[b.dataset.c] = !pose[b.dataset.c];
      interaction();
      rendre();
    });
  }
  fig.querySelector('.js-reset').addEventListener('click', () => {
    mode = 'add';
    Object.assign(allume, { r: true, v: false, b: false });
    Object.assign(pose, { c: true, m: false, j: false });
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="couleur-synthese"]')) initSynthese(fig);
