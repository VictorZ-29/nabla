/* Nabla — widgets/energie-rampe.js
   « La rampe du skatepark » : un skateur sur une demi-lune, et le compte
   énergie en dessous (barres Ec, Epp, Em). Deux modes sur la même rampe :
   - mode "libre" (§2) : le curseur promène le skateur le long de la rampe
     (frottements négligés) ; Epp et Ec échangent, la pile Em ne bouge pas.
   - mode "frottements" (§5) : un bouton lance une traversée après l'autre ;
     à chaque passage la moitié de la cagnotte part en chaleur, le skateur
     remonte de moins en moins haut.
   Profil : z(x) = (h/2)·(1 + cos(πx/4)), x ∈ [0 ; 8] — tout est analytique,
   les arrêts du curseur tombent sur des valeurs exactes (voir README).
   Spec : premiere/physique-chimie/energie-mecanique/README.md. */

import { el, creerVue, clamp, fmt, animerValeur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* La valeur affichée à `dec` décimales est-elle exacte ? (signe = ou ≈) */
const exactA = (v, dec) => Math.abs(Math.round(v * 10 ** dec) / 10 ** dec - v) < 1e-9;
/* Entiers avec espace fine des milliers : 1 600 (U+2009) */
const fmtJ = (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+$)/g, ' ');

/* Étiquette mono avec indice (« Ec », « Epp », « Em ») */
function etiquetteE(parent, indice, attrs) {
  const t = el('text', { class: 'avc-nom', ...attrs }, parent);
  const g = el('tspan', {}, t);
  g.textContent = 'E';
  const s = el('tspan', { dy: 4, 'font-size': '0.72em' }, t);
  s.textContent = indice;
  return t;
}

function initRampe(fig) {
  const mode = fig.dataset.mode || 'libre';
  const m = parseFloat(fig.dataset.masse || '50');
  const g = parseFloat(fig.dataset.g || '10');
  const h = parseFloat(fig.dataset.hauteur || '3.2');
  const Em0 = m * g * h;
  const zDe = (x) => (h / 2) * (1 + Math.cos(Math.PI * x / 4));
  /* abscisse du demi-tour d'altitude z, côté gauche (le profil est pair
     autour de x = 4) : x = (4/π)·arccos(2z/h − 1) */
  const xDemiTour = (z) => (4 / Math.PI) * Math.acos(clamp(2 * z / h - 1, -1, 1));

  /* --- graphique du haut : la rampe (repère orthonormé, 1 carreau = 1 m) --- */
  const svgHaut = fig.querySelector('svg.widget-graph');
  const X0 = -0.35, X1 = 8.35;
  const vbH = svgHaut.viewBox.baseVal.height;
  const yMin = -0.55;
  const vue = creerVue(svgHaut, { xMin: X0, xMax: X1, yMin, yMax: yMin + vbH * (X1 - X0) / 640 });

  let dGrille = '';
  for (let gx = 0; gx <= 8; gx++) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  for (let gy = 1; gy <= Math.floor(vue.yMax); gy++) {
    dGrille += `M0 ${vue.yPx(gy).toFixed(1)}L${vue.largeur} ${vue.yPx(gy).toFixed(1)}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svgHaut);
  el('path', { class: 'g-axis', d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}` }, svgHaut);

  let dRampe = '';
  for (let i = 0; i <= 120; i++) {
    const x = 8 * i / 120;
    dRampe += (i ? 'L' : 'M') + vue.xPx(x).toFixed(1) + ' ' + vue.yPx(zDe(x)).toFixed(1);
  }
  el('path', { class: 'g-courbe', d: dRampe }, svgHaut);

  const marques = el('g', {}, svgHaut);          /* demi-tours déjà visités (mode frottements) */
  const guideZ = el('path', { class: 'g-guide' }, svgHaut);
  const labelZ = el('text', { class: 'etl-valeur', 'text-anchor': 'start' }, svgHaut);
  const halo = el('circle', { class: 'pt-halo', r: 11 }, svgHaut);
  const point = el('circle', { class: 'pt-point', r: 5.5 }, svgHaut);

  /* --- graphique du bas : le compte énergie (pixels) ----------------------- */
  const svgBas = fig.querySelectorAll('svg.widget-graph')[1];
  const BX = 95, BL = 420, ROWS = { ec: 46, epp: 100, em: 154 };
  const H_BARRE = 20;
  const pxJ = BL / Em0;
  const titre = el('text', { class: 'avc-candidat', x: 8, y: 16 }, svgBas);
  titre.textContent = 'LE COMPTE ÉNERGIE — barre pleine : ' + fmtJ(Em0) + ' J';
  const barres = {};
  for (const [cle, y] of Object.entries(ROWS)) {
    etiquetteE(svgBas, { ec: 'c', epp: 'pp', em: 'm' }[cle], { x: 40, y: y + 15, 'text-anchor': 'start' });
    el('rect', { class: 'jauge-fond', x: BX, y, width: BL, height: H_BARRE, rx: 3 }, svgBas);
    barres[cle + 'Val'] = el('text', { class: 'etl-valeur', x: BX + BL + 10, y: y + 15, 'text-anchor': 'start' }, svgBas);
  }
  barres.ec = el('rect', { class: 'avc-barre-produit', x: BX, y: ROWS.ec, height: H_BARRE }, svgBas);
  barres.epp = el('rect', { class: 'avc-barre-reactif', x: BX, y: ROWS.epp, height: H_BARRE }, svgBas);
  /* la rangée Em est une pile : la part cinétique (accent) + la part
     potentielle (craie) — Em = Ec + Epp se lit sur le dessin même */
  barres.emEc = el('rect', { class: 'avc-barre-produit', x: BX, y: ROWS.em, height: H_BARRE }, svgBas);
  barres.emEpp = el('rect', { class: 'avc-barre-reactif', y: ROWS.em, height: H_BARRE }, svgBas);
  const dissipe = el('rect', { class: 'nrj-dissipe', y: ROWS.em, height: H_BARRE, visibility: 'hidden' }, svgBas);
  const labDissipe = el('text', {
    class: 'avc-candidat', y: ROWS.em - 7, 'text-anchor': 'end', visibility: 'hidden',
  }, svgBas);
  labDissipe.textContent = 'parti en chaleur →';
  el('path', {
    class: 'jauge-repere',
    d: `M${BX + BL} ${ROWS.em - 5}L${BX + BL} ${ROWS.em + H_BARRE + 5}`,
  }, svgBas);

  function poserBarres(ec, epp) {
    barres.ec.setAttribute('width', Math.max(0, ec * pxJ).toFixed(1));
    barres.epp.setAttribute('width', Math.max(0, epp * pxJ).toFixed(1));
    barres.emEc.setAttribute('width', Math.max(0, ec * pxJ).toFixed(1));
    barres.emEpp.setAttribute('x', (BX + ec * pxJ).toFixed(1));
    barres.emEpp.setAttribute('width', Math.max(0, epp * pxJ).toFixed(1));
    const eE = exactA(ec, 0) ? '' : '≈ ';
    const eP = exactA(epp, 0) ? '' : '≈ ';
    barres.ecVal.textContent = eE + fmtJ(ec) + ' J';
    barres.eppVal.textContent = eP + fmtJ(epp) + ' J';
    /* la somme est exacte par construction même quand ses parts sont ≈ */
    barres.emVal.textContent = (exactA(ec + epp, 0) ? '' : '≈ ') + fmtJ(ec + epp) + ' J';
    const manque = Em0 - (ec + epp);
    dissipe.setAttribute('visibility', manque > 1 ? 'visible' : 'hidden');
    labDissipe.setAttribute('visibility', manque > 1 ? 'visible' : 'hidden');
    dissipe.setAttribute('x', (BX + (ec + epp) * pxJ).toFixed(1));
    dissipe.setAttribute('width', Math.max(0, manque * pxJ).toFixed(1));
    labDissipe.setAttribute('x', (BX + BL - 4).toFixed(1));
  }

  function poserSkateur(x) {
    const px = vue.xPx(x).toFixed(1);
    const py = vue.yPx(zDe(x)).toFixed(1);
    halo.setAttribute('cx', px); halo.setAttribute('cy', py);
    point.setAttribute('cx', px); point.setAttribute('cy', py);
    guideZ.setAttribute('d', `M${px} ${py}L${px} ${vue.yPx(0).toFixed(1)}`);
    const z = zDe(x);
    labelZ.textContent = `z ${exactA(z, 2) ? '=' : '≈'} ${fmt(z, 2)} m`;
    /* étiquette à droite du guide, à mi-hauteur, rabattue à gauche au bord */
    const aDroite = x < 7;
    labelZ.setAttribute('text-anchor', aDroite ? 'start' : 'end');
    labelZ.setAttribute('x', (vue.xPx(x) + (aDroite ? 9 : -9)).toFixed(1));
    labelZ.setAttribute('y', ((py * 1 + vue.yPx(0)) / 2 + 4).toFixed(1));
    if (z < 0.18) labelZ.textContent = '';
  }

  /* --- lectures ------------------------------------------------------------ */
  const ligne = fig.querySelector('.js-ligne');
  const etat = fig.querySelector('.js-etat');
  const legendes = fig.querySelectorAll('.js-legendes .widget-legende');
  const nomLeg = ['debut', 'cours', 'fin'];
  function poserLegende(nom) {
    for (const [k, p] of [...legendes].entries()) p.hidden = nomLeg[k] !== nom;
  }
  function poserEtat(texte, classe) {
    if (!etat) return;
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }
  const interaction = () => track('widget_interact', { widget: fig.dataset.nom || 'rampe', chapitre });
  let animation = null;

  if (mode === 'libre') {
    /* ---- §2 : le curseur promène le skateur, Em ne bouge pas -------------- */
    const curseur = fig.querySelector('.js-curseur');
    const btnAller = fig.querySelector('.js-rejouer');
    const K = 48;                       /* index 0..48 → x = k/6 */
    let k = 0;
    let touche = false;
    const visites = new Set();

    function rendre() {
      const x = k / 6;
      const z = zDe(x);
      const epp = m * g * z;
      const ec = Em0 - epp;
      const v = Math.sqrt(2 * ec / m);
      poserSkateur(x);
      poserBarres(ec, epp);

      const eZ = exactA(z, 2) ? '=' : '≈';
      const eE = exactA(epp, 0) ? '=' : '≈';
      const eV = exactA(v, 1) ? '=' : '≈';
      ligne.textContent =
        `z ${eZ} ${fmt(z, 2)} m : Epp ${eE} ${fmtJ(epp)} J · Ec ${eE} ${fmtJ(ec)} J · v ${eV} ${fmt(v, 1)} m/s`;

      if (ec < 1) poserEtat('tout en potentielle — il est à l’arrêt, là-haut', '');
      else if (epp < 1) poserEtat('tout en cinétique — v maximale : 8,0 m/s', 'chip--accent');
      else if (Math.abs(ec - epp) < 1) poserEtat('mi-hauteur : Ec = Epp, moitié-moitié', 'chip--accent');
      else if (x < 4) poserEtat('sur la descente — Epp se vide dans Ec', '');
      else poserEtat('sur la remontée — Ec se reverse dans Epp', '');

      if (!touche) poserLegende('debut');
      else poserLegende(visites.size >= 4 ? 'fin' : 'cours');

      if (parseFloat(curseur.value) !== k) curseur.value = String(k);
      curseur.style.setProperty('--pos', ((k / K) * 100) + '%');
      curseur.setAttribute('aria-valuetext', `altitude z = ${fmt(z, 2)} mètre`);
    }

    curseur.addEventListener('input', () => {
      if (animation) { animation.stop(); animation = null; }
      k = clamp(Math.round(parseFloat(curseur.value)), 0, K);
      touche = true;
      visites.add(k);
      interaction();
      rendre();
    });

    btnAller.addEventListener('click', () => {
      if (animation) animation.stop();
      k = 0;
      touche = true;
      interaction();
      rendre();
      animation = animerValeur({
        de: 0, vers: K, duree: 2600,
        surFrame: (val) => {
          const kk = clamp(Math.round(val), 0, K);
          if (kk !== k) { k = kk; visites.add(k); rendre(); }
        },
        surFin: () => { k = K; animation = null; visites.add(k); rendre(); },
      });
    });

    fig.querySelector('.js-reset').addEventListener('click', () => {
      if (animation) { animation.stop(); animation = null; }
      k = 0;
      touche = false;
      visites.clear();
      rendre();
    });

    rendre();
  } else {
    /* ---- §5 : les frottements — la moitié de la cagnotte à chaque traversée */
    const btnSuivant = fig.querySelector('.js-traversee');
    const N_MAX = 4;
    let n = 0;
    let x = 0;

    /* demi-tour n : Em = Em0/2ⁿ, en alternant les côtés (départ à gauche) */
    function demiTour(nn) {
      const Em = Em0 / 2 ** nn;
      const z = Em / (m * g);
      const xg = xDemiTour(z);
      return { Em, z, x: nn % 2 === 0 ? xg : 8 - xg };
    }

    function rendre() {
      const { Em, z } = demiTour(n);
      const epp = m * g * z;            /* au demi-tour, tout est potentiel */
      poserSkateur(x);
      poserBarres(0, epp);
      if (n === 0) {
        ligne.textContent = `au départ : z = ${fmt(h, 2)} m — Em = ${fmtJ(Em0)} J, cagnotte pleine`;
        poserEtat('la cagnotte est pleine — lance-le', '');
        poserLegende('debut');
      } else {
        ligne.textContent =
          `traversée ${n} : il ne remonte qu’à z = ${fmt(z, 2)} m — ` +
          `Em = ${fmtJ(Em)} J, ${fmtJ(Em0 - Em)} J déjà partis en chaleur`;
        poserEtat('la cagnotte fuit — moitié moins à chaque traversée', 'chip--bad');
        poserLegende(n >= 2 ? 'fin' : 'cours');
      }
      btnSuivant.disabled = n >= N_MAX;
      btnSuivant.textContent = n >= N_MAX ? 'il s’endort au fond…' : '▸ traversée suivante';
    }

    btnSuivant.addEventListener('click', () => {
      if (animation || n >= N_MAX) return;
      interaction();
      const de = demiTour(n);
      n += 1;
      const vers = demiTour(n);
      /* petite marque au demi-tour quitté */
      el('circle', {
        class: 'pt-craie', r: 3,
        cx: vue.xPx(de.x).toFixed(1), cy: vue.yPx(de.z).toFixed(1),
      }, marques);
      /* barres et lectures à l'arrivée seulement ; sous mouvement réduit,
         surFin s'exécute AVANT l'affectation — le drapeau évite de garder
         une poignée déjà terminée (le bouton resterait bloqué) */
      let fini = false;
      const anim = animerValeur({
        de: de.x, vers: vers.x, duree: 900,
        surFrame: (val) => { x = val; poserSkateur(x); },
        surFin: () => { fini = true; animation = null; x = vers.x; rendre(); },
      });
      if (!fini) animation = anim;
    });

    fig.querySelector('.js-reset').addEventListener('click', () => {
      if (animation) { animation.stop(); animation = null; }
      n = 0;
      x = 0;
      marques.replaceChildren();
      rendre();
    });

    rendre();
  }
}

for (const fig of document.querySelectorAll('[data-widget="energie-rampe"]')) initRampe(fig);
