/* Nabla — widgets/banc-optique.js
   « Le banc optique » : une flèche lumineuse AB glisse le long de l'axe
   optique (curseur = position OA) ; les trois rayons de construction et
   l'image A′B′ suivent en direct. L'élève voit l'image reculer, exploser
   près du foyer, puis passer virtuelle (la loupe) — avant toute formule.
   Deux instances : s2 (mode « nature » — chips OA′, γ et nature de
   l'image) et s3 (mode « formule » — lignes 1/OA′ − 1/OA = 1/f′ et
   γ = OA′/OA instanciées en direct, exactes par construction).
   Toutes les mesures sont algébriques (axe orienté vers la droite,
   origine O) ; f′ et les positions viennent des data-*.
   Spec : premiere/physique-chimie/lentilles-couleurs/README.md. */

import { el, creerVue, clamp, fmt, animerValeur, creerVecteur } from '../nabla-graph.js';
import { track } from '../analytics.js';

const chapitre = document.body.dataset.chapitre || '';

/* Valeur affichée à `dec` décimales + exactitude de cet affichage
   (pour choisir = ou ≈, politique « nombres honnêtes » du chapitre). */
function affiche(v, dec) {
  const arrondi = Math.round(v * 10 ** dec) / 10 ** dec;
  return { txt: fmt(arrondi, dec), exact: Math.abs(arrondi - v) < 1e-9 };
}

/* « (−60) » : les valeurs négatives sont parenthésées dans les lignes de
   calcul (précédent : lignes instanciées des suites). */
const paren = (txt) => (txt.startsWith('−') ? `(${txt})` : txt);

function initBanc(fig) {
  const d = fig.dataset;
  const f = parseFloat(d.f);                       /* distance focale f′ (cm) */
  const h = parseFloat(d.hauteur || '6');          /* taille de l'objet AB (cm) */
  const oaInit = parseFloat(d.oaInit);
  const [domMin, domMax] = d.domaine.split(',').map(Number);
  const nom = d.nom || 'banc';
  let oa = oaInit;
  let animation = null;

  const svg = fig.querySelector('svg');
  const vue = creerVue(svg, { xMin: -75, xMax: 115, yMin: -24, yMax: 24 });
  const X = (x) => vue.xPx(x).toFixed(1);
  const Y = (y) => vue.yPx(y).toFixed(1);

  /* --- décor statique ------------------------------------------------------ */
  let dGrille = '';
  for (let gx = -70; gx <= 110; gx += 10) {
    if (gx === 0) continue;
    dGrille += `M${X(gx)} 0L${X(gx)} ${vue.hauteur}`;
  }
  el('path', { class: 'g-grid', d: dGrille }, svg);
  el('path', { class: 'g-axis', d: `M0 ${Y(0)}L${vue.largeur} ${Y(0)}` }, svg);

  /* la lentille : trait vertical + pointes de flèche aux deux bouts
     (pointes dimensionnées en pixels — l'échelle verticale est étirée) */
  const xL = vue.xPx(0);
  const yHaut = vue.yPx(21);
  const yBas = vue.yPx(-21);
  el('path', { class: 'opt-lentille', d: `M${X(0)} ${Y(21)}L${X(0)} ${Y(-21)}` }, svg);
  el('path', { class: 'opt-pointe', d: `M${xL.toFixed(1)} ${(yHaut - 9).toFixed(1)}L${(xL - 7).toFixed(1)} ${(yHaut + 5).toFixed(1)}L${(xL + 7).toFixed(1)} ${(yHaut + 5).toFixed(1)}Z` }, svg);
  el('path', { class: 'opt-pointe', d: `M${xL.toFixed(1)} ${(yBas + 9).toFixed(1)}L${(xL - 7).toFixed(1)} ${(yBas - 5).toFixed(1)}L${(xL + 7).toFixed(1)} ${(yBas - 5).toFixed(1)}Z` }, svg);

  /* foyers : petits traits + étiquettes maths */
  for (const [fx, texte] of [[-f, 'F'], [f, 'F′']]) {
    el('path', { class: 'opt-tick', d: `M${X(fx)} ${Y(1.6)}L${X(fx)} ${Y(-1.6)}` }, svg);
    const lab = el('text', {
      class: 'etiquette-math', 'font-size': 16, x: X(fx), y: Y(-4.6), 'text-anchor': 'middle',
    }, svg);
    lab.textContent = texte;
  }
  const labO = el('text', {
    class: 'etiquette-math etiquette-math--muted', 'font-size': 16,
    x: vue.xPx(0) + 9, y: Y(-4.6),
  }, svg);
  labO.textContent = 'O';

  /* --- éléments dynamiques ------------------------------------------------- */
  const rayons = [1, 2, 3].map(() => el('path', { class: 'opt-rayon' }, svg));
  const virtuels = [1, 2, 3].map(() => el('path', { class: 'opt-rayon opt-rayon--virtuel' }, svg));
  const objet = creerVecteur(svg, { classeTrait: 'opt-objet', classePointe: 'opt-objet-pointe' });
  const image = creerVecteur(svg, { classeTrait: 'g-courbe-derivee', classePointe: 'vec-pointe--accent' });
  const labA = el('text', { class: 'etiquette-math', 'font-size': 15, 'text-anchor': 'middle' }, svg);
  labA.textContent = 'A';
  const labB = el('text', { class: 'etiquette-math', 'font-size': 15, 'text-anchor': 'middle' }, svg);
  labB.textContent = 'B';
  const labA2 = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 15, 'text-anchor': 'middle' }, svg);
  labA2.textContent = 'A′';
  const labB2 = el('text', { class: 'etiquette-math etiquette-math--accent', 'font-size': 15, 'text-anchor': 'middle' }, svg);
  labB2.textContent = 'B′';

  /* --- lectures ------------------------------------------------------------ */
  const curseur = fig.querySelector('.js-curseur');
  const lectOA = fig.querySelector('.js-oa');
  const chipOAp = fig.querySelector('.js-oap');
  const chipGamma = fig.querySelector('.js-gamma');
  const etat = fig.querySelector('.js-etat');
  const ligne1 = fig.querySelector('.js-ligne1');
  const ligne2 = fig.querySelector('.js-ligne2');
  const legendes = {
    reelle: fig.querySelector('.js-leg-reelle'),
    explosion: fig.querySelector('.js-leg-explosion'),
    focale: fig.querySelector('.js-leg-focale'),
    loupe: fig.querySelector('.js-leg-loupe'),
  };
  const presets = [...fig.querySelectorAll('.segmente button')];

  function poserEtat(texte, classe) {
    etat.textContent = texte;
    etat.className = `chip${classe ? ` ${classe}` : ''} js-etat`;
  }

  function montrerLegende(cle) {
    for (const [k, p] of Object.entries(legendes)) p.hidden = k !== cle;
  }

  function rendre() {
    const focale = oa === -f;
    const oap = focale ? null : (f * oa) / (oa + f);
    const gamma = focale ? null : oap / oa;
    const hi = focale ? null : gamma * h;

    /* l'objet (craie) et ses étiquettes */
    objet.maj(vue.xPx(oa), vue.yPx(0), vue.xPx(oa), vue.yPx(h), 11, 4.5);
    labA.setAttribute('x', X(oa)); labA.setAttribute('y', Y(-3.4));
    labB.setAttribute('x', X(oa)); labB.setAttribute('y', Y(h + 2.2));

    /* les trois rayons de construction (accent). Au foyer, le rayon
       passant par F serait vertical : on ne trace que les deux autres. */
    const yLoin1 = (h / oa) * 115;                       /* rayon par O, non dévié */
    rayons[0].setAttribute('d', `M${X(oa)} ${Y(h)}L${X(115)} ${Y(yLoin1)}`);
    const yLoin2 = h - (h / f) * 115;                    /* parallèle → ressort par F′ */
    rayons[1].setAttribute('d', `M${X(oa)} ${Y(h)}L${X(0)} ${Y(h)}L${X(115)} ${Y(yLoin2)}`);
    if (focale) {
      rayons[2].setAttribute('d', '');
    } else {
      const y3 = (f * h) / (oa + f);                     /* par F → ressort parallèle */
      rayons[2].setAttribute('d', `M${X(oa)} ${Y(h)}L${X(0)} ${Y(y3)}L${X(115)} ${Y(y3)}`);
    }

    /* prolongements virtuels (pointillés) quand l'image est virtuelle */
    const virtuelle = !focale && oap < 0;
    if (virtuelle) {
      virtuels[0].setAttribute('d', `M${X(oap)} ${Y(hi)}L${X(oa)} ${Y(h)}`);
      virtuels[1].setAttribute('d', `M${X(oap)} ${Y(hi)}L${X(0)} ${Y(h)}`);
      virtuels[2].setAttribute('d', `M${X(oap)} ${Y(hi)}L${X(0)} ${Y(hi)}`);
    } else {
      for (const p of virtuels) p.setAttribute('d', '');
    }

    /* l'image (accent), si elle tient dans le cadre */
    const enVue = !focale && oap <= 112 && oap >= -73 && Math.abs(hi) <= 23;
    image.g.style.display = enVue ? '' : 'none';
    image.trait.setAttribute('stroke-dasharray', virtuelle ? '5 5' : '');
    labA2.style.display = enVue ? '' : 'none';
    labB2.style.display = enVue ? '' : 'none';
    if (enVue) {
      image.maj(vue.xPx(oap), vue.yPx(0), vue.xPx(oap), vue.yPx(hi), 11, 4.5);
      labA2.setAttribute('x', X(oap)); labA2.setAttribute('y', Y(hi < 0 ? 3.2 : -4.2));
      labB2.setAttribute('x', X(oap)); labB2.setAttribute('y', Y(hi < 0 ? hi - 4 : hi + 2.2));
    }

    /* lectures : curseur + chips/lignes selon le mode */
    lectOA.textContent = fmt(oa, 0);
    const aOAp = focale ? null : affiche(oap, 1);
    const aGamma = focale ? null : affiche(gamma, 2);
    if (chipOAp) chipOAp.textContent = focale ? 'OA′ : pas d’image' : `OA′ ${aOAp.exact ? '=' : '≈'} ${aOAp.txt} cm`;
    if (chipGamma) chipGamma.textContent = focale ? 'γ : —' : `γ ${aGamma.exact ? '=' : '≈'} ${aGamma.txt}`;
    if (ligne1) {
      if (focale) {
        ligne1.textContent = `1/OA′ = 1/f′ + 1/OA = 0,050 + (−0,050) = 0 → pas d’image`;
      } else {
        /* arrondis à 3 décimales : la somme affichée retombe toujours
           exactement sur 1/f′ (voir README, choix du pas de 1 cm) */
        ligne1.textContent = `1/OA′ − 1/OA = ${fmt(1 / oap, 3)} − ${paren(fmt(1 / oa, 3))} = ${fmt(1 / f, 3)} = 1/f′`;
      }
    }
    if (ligne2) {
      ligne2.textContent = focale
        ? `γ = OA′/OA : pas d’image à mesurer`
        : `γ = OA′/OA = ${aOAp.txt} / ${paren(fmt(oa, 0))} ${aOAp.exact && aGamma.exact ? '=' : '≈'} ${aGamma.txt}`;
    }

    /* chip d'état + légende : le récit du moment */
    if (focale) {
      poserEtat('objet au foyer — pas d’image', 'chip--accent');
      montrerLegende('focale');
    } else if (virtuelle) {
      poserEtat('image virtuelle, droite, agrandie', 'chip--accent');
      montrerLegende(enVue ? 'loupe' : 'explosion');
    } else {
      const taille = Math.abs(Math.abs(gamma) - 1) < 1e-9 ? 'même taille'
        : (Math.abs(gamma) > 1 ? 'agrandie' : 'réduite');
      poserEtat(`image réelle, renversée, ${taille}`, '');
      montrerLegende(enVue ? 'reelle' : 'explosion');
    }

    /* préréglages : enfoncé seulement sur correspondance exacte */
    for (const b of presets) {
      b.setAttribute('aria-pressed', String(parseFloat(b.dataset.oa) === oa));
    }

    if (parseFloat(curseur.value) !== oa) curseur.value = String(oa);
    curseur.style.setProperty('--pos', (((oa - domMin) / (domMax - domMin)) * 100) + '%');
    curseur.setAttribute('aria-valuetext', focale
      ? `OA = ${fmt(oa, 0)} centimètres — l’objet est au foyer, pas d’image`
      : `OA = ${fmt(oa, 0)} centimètres — image à OA′ ${aOAp.exact ? '=' : '≈'} ${aOAp.txt} centimètres`);
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
    oa = clamp(Math.round(parseFloat(curseur.value)), domMin, domMax);
    interaction();
    planifierRendu();
  });

  for (const b of presets) {
    b.addEventListener('click', () => {
      if (animation) animation.stop();
      interaction();
      animation = animerValeur({
        de: oa, vers: parseFloat(b.dataset.oa), duree: 650,
        surFrame(v) { oa = Math.round(v); rendre(); },
        surFin() { animation = null; },
      });
    });
  }

  fig.querySelector('.js-reset').addEventListener('click', () => {
    if (animation) { animation.stop(); animation = null; }
    oa = oaInit;
    rendre();
  });

  rendre();
}

for (const fig of document.querySelectorAll('[data-widget="banc-optique"]')) initBanc(fig);
