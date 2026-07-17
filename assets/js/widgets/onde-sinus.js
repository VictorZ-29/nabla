/* Nabla — widgets/onde-sinus.js
   « La photo et le film » : on secoue la corde en cadence. Deux graphiques
   presque identiques et pourtant differents : la PHOTO montre toute la
   corde à l'instant t (axe en mètres — on y mesure λ), le FILM suit un
   seul bouchon au fil du temps (axe en secondes — on y mesure T). Le
   curseur règle t ; le même bouchon est marqué en accent sur les deux
   graphiques, à la même hauteur. Les crochets de mesure λ et T sont
   dessinés entre deux crêtes de chaque graphique.
   Spec : premiere/physique-chimie/ondes-mecaniques/README.md. */

import { el, creerVue, clamp, fmt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* 1 décimale quand la valeur tombe juste au dixième (« 4,0 »), 2 sinon */
const fmtPhys = (x) => fmt(x, Math.abs(x * 10 - Math.round(x * 10)) < 1e-9 ? 1 : 2);

function initOndeSinus(fig) {
  const d = fig.dataset;
  const T = parseFloat(d.periode);
  const lam = parseFloat(d.lambda);
  const A = parseFloat(d.amplitude || '0.3');
  const tMax = parseFloat(d.tMax);
  const positions = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  const v = lam / T;
  let idx = parseInt(d.posInit || '0', 10);
  let t = 0;
  let animation = null;

  const [svgPhoto, svgFilm] = fig.querySelectorAll('svg.widget-graph');
  const XMAX = 12;
  const vueP = creerVue(svgPhoto, { xMin: -0.55, xMax: 12.85, yMin: -0.52, yMax: 0.74 });
  /* xMin du film choisi pour que t = 0 tombe au même pixel que x = 0 en haut */
  const vueF = creerVue(svgFilm, { xMin: -0.375, xMax: 8.75, yMin: -0.52, yMax: 0.74 });

  const yOnde = (x, tt) => A * Math.cos(2 * Math.PI * (tt / T - x / lam));

  /* --- décor commun : grille, axe, graduations, titre ---------------------- */
  function decor(vue, svg, pasGrille, gradMax, unite, titre) {
    let dG = '';
    for (let g = pasGrille; g <= gradMax + 0.01; g += pasGrille) {
      dG += `M${vue.xPx(g).toFixed(1)} 0L${vue.xPx(g).toFixed(1)} ${vue.hauteur}`;
    }
    el('path', { class: 'g-grid', d: dG }, svg);
    el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, svg);
    for (const gx of [0, gradMax / 2, gradMax]) {
      const lab = el('text', {
        class: 'avc-candidat', x: vue.xPx(gx).toFixed(1), y: (vue.yPx(0) + 18).toFixed(1),
        'text-anchor': gx === gradMax ? 'end' : 'middle',
      }, svg);
      lab.textContent = gx === gradMax ? `${gx} ${unite}` : String(gx);
    }
    const titreEl = el('text', { class: 'avc-candidat', x: 8, y: 15 }, svg);
    titreEl.textContent = titre;
    return titreEl;
  }
  decor(vueP, svgPhoto, 1, XMAX, 'm', `LA PHOTO — toute la corde, à l'instant t`);
  const titreFilm = decor(vueF, svgFilm, 1, 8, 's', '');

  /* --- photo : courbe, rail du bouchon, point, crochet λ ------------------- */
  const courbeP = el('path', { class: 'g-courbe' }, svgPhoto);
  const railP = el('path', { class: 'g-guide', 'stroke-dasharray': '3 4' }, svgPhoto);
  const mesureL = el('path', { class: 'ond-mesure' }, svgPhoto);
  const mesureLTxt = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svgPhoto);
  mesureLTxt.textContent = `λ = ${fmtPhys(lam)} m`;
  const haloP = el('circle', { class: 'pt-halo', r: 12 }, svgPhoto);
  const ptP = el('circle', { class: 'pt-point', r: 5.5 }, svgPhoto);

  /* --- film : courbe (statique par bouchon), curseur, point, crochet T ----- */
  const courbeF = el('path', { class: 'g-courbe' }, svgFilm);
  const curseurF = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svgFilm);
  const mesureT = el('path', { class: 'ond-mesure' }, svgFilm);
  const mesureTTxt = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svgFilm);
  mesureTTxt.textContent = `T = ${fmtPhys(T)} s`;
  const haloF = el('circle', { class: 'pt-halo', r: 12 }, svgFilm);
  const ptF = el('circle', { class: 'pt-point', r: 5.5 }, svgFilm);

  /* crochet de mesure : trait horizontal + serifs aux deux bouts */
  function crochet(vue, x1, x2, yM) {
    const a = vue.xPx(x1).toFixed(1);
    const b = vue.xPx(x2).toFixed(1);
    const py = vue.yPx(yM).toFixed(1);
    const h = 5;
    return `M${a} ${(+py - h).toFixed(1)}L${a} ${(+py + h).toFixed(1)}M${a} ${py}L${b} ${py}M${b} ${(+py - h).toFixed(1)}L${b} ${(+py + h).toFixed(1)}`;
  }

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectT = fig.querySelector('.js-t');
  const ligne = fig.querySelector('.js-ligne');
  const boutons = [...fig.querySelectorAll('.js-bouchon')];
  const legDebut = fig.querySelector('.js-leg-debut');
  const legCours = fig.querySelector('.js-leg-cours');
  const legTour = fig.querySelector('.js-leg-tour');
  const btnDefiler = fig.querySelector('.js-defiler');

  /* le film ne dépend que du bouchon choisi : recalculé à la sélection */
  function poserFilm() {
    const x0 = positions[idx];
    const pts = [];
    for (let i = 0; i <= 220; i++) {
      const tt = (8 * i) / 220;
      pts.push(`${vueF.xPx(tt).toFixed(1)} ${vueF.yPx(yOnde(x0, tt)).toFixed(1)}`);
    }
    courbeF.setAttribute('d', 'M' + pts.join('L'));
    const tc = ((x0 / v) % T + T) % T;
    mesureT.setAttribute('d', crochet(vueF, tc, tc + T, A + 0.22));
    mesureTTxt.setAttribute('x', vueF.xPx(tc + T / 2).toFixed(1));
    mesureTTxt.setAttribute('y', (vueF.yPx(A + 0.22) - 8).toFixed(1));
    titreFilm.textContent = `LE FILM — le bouchon à ${fmtPhys(x0)} m, au fil du temps`;
    railP.setAttribute('d',
      `M${vueP.xPx(x0).toFixed(1)} ${vueP.yPx(A + 0.1).toFixed(1)}L${vueP.xPx(x0).toFixed(1)} ${vueP.yPx(-(A + 0.14)).toFixed(1)}`);
    for (const [i, b] of boutons.entries()) b.setAttribute('aria-pressed', String(i === idx));
  }

  function rendre() {
    const tAff = Math.round(t * 100) / 100;
    const x0 = positions[idx];

    /* la photo, rééchantillonnée */
    const pts = [];
    for (let i = 0; i <= 260; i++) {
      const x = (XMAX * i) / 260;
      pts.push(`${vueP.xPx(x).toFixed(1)} ${vueP.yPx(yOnde(x, t)).toFixed(1)}`);
    }
    courbeP.setAttribute('d', 'M' + pts.join('L'));

    /* crochet λ : entre deux crêtes (la crête gauche vit dans [0 ; λ[) */
    const c0 = ((v * t) % lam + lam) % lam;
    mesureL.setAttribute('d', crochet(vueP, c0, c0 + lam, A + 0.22));
    mesureLTxt.setAttribute('x', vueP.xPx(c0 + lam / 2).toFixed(1));
    mesureLTxt.setAttribute('y', (vueP.yPx(A + 0.22) - 8).toFixed(1));

    /* le même bouchon, sur les deux graphiques */
    const yB = yOnde(x0, t);
    haloP.setAttribute('cx', vueP.xPx(x0).toFixed(1)); haloP.setAttribute('cy', vueP.yPx(yB).toFixed(1));
    ptP.setAttribute('cx', vueP.xPx(x0).toFixed(1)); ptP.setAttribute('cy', vueP.yPx(yB).toFixed(1));
    curseurF.setAttribute('d',
      `M${vueF.xPx(t).toFixed(1)} ${vueF.yPx(A + 0.1).toFixed(1)}L${vueF.xPx(t).toFixed(1)} ${vueF.yPx(-(A + 0.14)).toFixed(1)}`);
    haloF.setAttribute('cx', vueF.xPx(t).toFixed(1)); haloF.setAttribute('cy', vueF.yPx(yB).toFixed(1));
    ptF.setAttribute('cx', vueF.xPx(t).toFixed(1)); ptF.setAttribute('cy', vueF.yPx(yB).toFixed(1));

    /* lecture : la hauteur commune (= si l'affichage 2 décimales est exact, ≈ sinon) */
    const yAff = yOnde(x0, tAff);
    const egal = Math.abs(yAff - Math.round(yAff * 100) / 100) < 1e-9 ? '=' : '≈';
    lectT.textContent = fmt(tAff);
    ligne.textContent =
      `à t = ${fmt(tAff)} s, le bouchon (x = ${fmtPhys(x0)} m) est à y ${egal} ${fmt(yAff)} m — la même hauteur sur les deux graphiques`;

    legDebut.hidden = !(t <= 1e-9);
    legTour.hidden = !(t >= T - 1e-9);
    legCours.hidden = !(t > 1e-9 && t < T - 1e-9);

    if (parseFloat(curseur.value) !== t) curseur.value = String(t);
    curseur.style.setProperty('--pos', ((t / tMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext', `t = ${fmt(tAff)} seconde`);
  }

  function interaction() {
    track('widget_interact', { widget: d.nom || 'photo-film', chapitre });
  }

  let renduPlanifie = 0;
  function planifierRendu() {
    if (!renduPlanifie) renduPlanifie = requestAnimationFrame(() => { renduPlanifie = 0; rendre(); });
  }

  curseur.addEventListener('input', () => {
    if (animation) { animation.stop(); animation = null; }
    t = clamp(parseFloat(curseur.value), 0, tMax);
    interaction();
    planifierRendu();
  });

  for (const [i, b] of boutons.entries()) {
    b.addEventListener('click', () => {
      idx = i;
      interaction();
      poserFilm();
      rendre();
    });
  }

  btnDefiler.addEventListener('click', () => {
    if (animation) animation.stop();
    interaction();
    if (t >= tMax - 1e-9) { t = 0; rendre(); }
    animation = animerValeur({
      de: t, vers: tMax, duree: (tMax - t) * 450,
      surFrame: (val) => { t = val; rendre(); },
      surFin: () => { t = tMax; animation = null; rendre(); },
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    t = 0;
    idx = parseInt(d.posInit || '0', 10);
    poserFilm();
    rendre();
  });

  poserFilm();
  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="onde-sinus"]')) initOndeSinus(fig);
