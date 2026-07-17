/* Nabla — widgets/onde-corde.js
   « La forme voyage, pas la corde » : une secousse court le long d'une
   corde à linge ; le curseur règle le temps t. Le front avance à célérité
   constante, et les pinces à linge accrochées à la corde montent puis
   redescendent SUR PLACE : la perturbation voyage, la matière reste.
   Deux instances : s2 (une pince, lecture d = v × t) et s3 (pinces A et
   B, le retard — les chips d et τ sont statiques dans la page).
   Spec : premiere/physique-chimie/ondes-mecaniques/README.md. */

import { el, creerVue, clamp, fmt, animerValeur, creerVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

function initOndeCorde(fig) {
  const d = fig.dataset;
  const v = parseFloat(d.v);                       /* célérité (m/s) */
  const L = parseFloat(d.longueur);                /* corde visible (m) */
  const tMax = parseFloat(d.tMax);
  const larg = parseFloat(d.largeur || '2');       /* largeur de la bosse (m) */
  const A = parseFloat(d.amplitude || '0.4');
  const nom = d.nom || 'corde';
  const pinces = JSON.parse(fig.querySelector('script[type="application/json"]').textContent);
  let t = 0;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -0.45, xMax: L + 0.45, yMin: -0.42, yMax: 0.75 });

  /* la bosse : cos² de largeur `larg`, front en x = v·t (nulle ailleurs) */
  function y(x, tt) {
    const u = (x - (v * tt - larg / 2)) / (larg / 2);
    return Math.abs(u) <= 1 ? A * Math.cos(Math.PI * u / 2) ** 2 : 0;
  }

  /* --- décor statique ------------------------------------------------------ */
  let dGrille = '';
  for (let gx = 1; gx <= L + 0.01; gx += 1) {
    dGrille += `M${vue.xPx(gx).toFixed(1)} 0L${vue.xPx(gx).toFixed(1)} ${vue.hauteur}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', {
    class: 'g-axis',
    d: `M0 ${vue.yPx(0).toFixed(1)}L${vue.largeur} ${vue.yPx(0).toFixed(1)}`,
  }, svg);
  for (const [gx, texte] of [[0, '0'], [L / 2, String(L / 2)], [L, `${L} m`]]) {
    const lab = el('text', {
      class: 'avc-candidat', x: vue.xPx(gx).toFixed(1), y: (vue.yPx(0) + 20).toFixed(1),
      'text-anchor': gx === L ? 'end' : 'middle',
    }, svg);
    lab.textContent = texte;
  }

  /* rails et noms des pinces (le point glisse le long de son rail) */
  for (const p of pinces) {
    el('path', {
      class: 'g-guide', 'stroke-dasharray': '3 4',
      d: `M${vue.xPx(p.x).toFixed(1)} ${vue.yPx(A + 0.06).toFixed(1)}L${vue.xPx(p.x).toFixed(1)} ${vue.yPx(-0.08).toFixed(1)}`,
    }, svg);
    const lab = el('text', {
      class: 'avc-nom', x: vue.xPx(p.x).toFixed(1), y: (vue.yPx(0) + 40).toFixed(1),
      'text-anchor': 'middle',
    }, svg);
    lab.textContent = p.nom;
  }

  /* --- éléments dynamiques ------------------------------------------------- */
  const corde = el('path', { class: 'g-courbe' }, svg);
  const front = el('path', { class: 'g-guide-accent', 'stroke-dasharray': '4 5' }, svg);
  const fleche = creerVecteur(svg, { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' });
  const flecheLab = el('text', { class: 'etl-valeur', 'text-anchor': 'middle' }, svg);
  flecheLab.textContent = `v = ${fmt(v, 1)} m/s`;
  const points = pinces.map((p) => ({
    p,
    halo: el('circle', { class: 'pt-halo', r: 12 }, svg),
    point: el('circle', { class: 'pt-point', r: 5.5 }, svg),
  }));

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectT = fig.querySelector('.js-t');
  const ligne = fig.querySelector('.js-ligne');
  const etat = fig.querySelector('.js-etat');
  const legDebut = fig.querySelector('.js-leg-debut');
  const legCours = fig.querySelector('.js-leg-cours');
  const legFin = fig.querySelector('.js-leg-fin');
  const btnLancer = fig.querySelector('.js-lancer');

  /* fenêtres de mouvement des pinces : ]x/v ; (x+larg)/v[ */
  const fenetres = pinces.map((p) => ({ p, debut: p.x / v, fin: (p.x + larg) / v }));
  const finDerniere = fenetres[fenetres.length - 1].fin;

  function poserEtat(texte, classe) {
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }

  function rendre() {
    const tAff = Math.round(t * 100) / 100;   /* affichages cohérents pendant l'animation */
    const xFront = v * t;

    /* la corde, rééchantillonnée (260 points) */
    const pts = [];
    for (let i = 0; i <= 260; i++) {
      const x = (L * i) / 260;
      pts.push(`${vue.xPx(x).toFixed(1)} ${vue.yPx(y(x, t)).toFixed(1)}`);
    }
    corde.setAttribute('d', 'M' + pts.join('L'));

    /* front pointillé (tant qu'il est sur la corde) */
    if (xFront > 0.02 && xFront <= L) {
      front.setAttribute('d',
        `M${vue.xPx(xFront).toFixed(1)} ${vue.yPx(A + 0.18).toFixed(1)}L${vue.xPx(xFront).toFixed(1)} ${vue.yPx(-0.08).toFixed(1)}`);
    } else {
      front.setAttribute('d', '');
    }

    /* flèche de célérité au-dessus de la crête */
    const crete = xFront - larg / 2;
    const flecheVisible = crete >= 0.7 && crete <= L - 0.7;
    fleche.g.style.display = flecheVisible ? '' : 'none';
    flecheLab.style.display = flecheVisible ? '' : 'none';
    if (flecheVisible) {
      const yFleche = vue.yPx(A + 0.16);
      fleche.maj(vue.xPx(crete - 0.55), yFleche, vue.xPx(crete + 0.55), yFleche, 11, 4.5);
      flecheLab.setAttribute('x', vue.xPx(crete).toFixed(1));
      flecheLab.setAttribute('y', (yFleche - 10).toFixed(1));
    }

    /* les pinces, sur leur rail */
    for (const { p, halo, point } of points) {
      const py = vue.yPx(y(p.x, t)).toFixed(1);
      const px = vue.xPx(p.x).toFixed(1);
      halo.setAttribute('cx', px); halo.setAttribute('cy', py);
      point.setAttribute('cx', px); point.setAttribute('cy', py);
    }

    /* lectures françaises */
    lectT.textContent = fmt(tAff);
    ligne.textContent = `le front a parcouru d = v × t = ${fmt(v, 1)} × ${fmt(tAff)} = ${fmt(v * tAff)} m`;

    /* chip d'état : le récit du moment */
    const enCours = fenetres.find((f) => t > f.debut && t < f.fin);
    if (t <= 1e-9) {
      poserEtat('la corde est au repos', '');
    } else if (enCours) {
      poserEtat(`${enCours.p.nom} monte et redescend — sur place`, 'chip--good');
    } else if (t >= finDerniere) {
      poserEtat(`l'onde est passée — tout est resté à sa place`, 'chip--accent');
    } else {
      const suivante = fenetres.find((f) => t <= f.debut);
      const precedente = [...fenetres].reverse().find((f) => t >= f.fin);
      poserEtat(precedente
        ? `${precedente.p.nom} a fini — l'onde court vers ${suivante.p.nom}`
        : `l'onde court vers ${suivante.p.nom} — rien n'a encore bougé`, '');
    }

    /* légendes (récit long, HTML statique) */
    legDebut.hidden = !(t <= 1e-9);
    legFin.hidden = !(t >= finDerniere);
    legCours.hidden = !(t > 1e-9 && t < finDerniere);

    if (parseFloat(curseur.value) !== t) curseur.value = String(t);
    curseur.style.setProperty('--pos', ((t / tMax) * 100) + '%');
    curseur.setAttribute('aria-valuetext',
      `t = ${fmt(tAff)} seconde — le front est à ${fmt(v * tAff)} mètres`);
  }

  function interaction() {
    track('widget_interact', { widget: nom, chapitre });
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

  btnLancer.addEventListener('click', () => {
    if (animation) animation.stop();
    interaction();
    t = 0;
    rendre();
    animation = animerValeur({
      de: 0, vers: tMax, duree: tMax * 600,
      surFrame: (val) => { t = val; rendre(); },
      surFin: () => { t = tMax; animation = null; rendre(); },
    });
  });

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    t = 0;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="onde-corde"]')) initOndeCorde(fig);
