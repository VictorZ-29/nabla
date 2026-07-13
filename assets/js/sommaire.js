/* Nabla — sommaire.js
   Scroll-spy + défilement doux + repli du sommaire mobile.
   Comportement repris du design : la section active est la dernière dont le
   haut est au-dessus de 170 px ; le défilement cible la section avec un
   décalage de 84 px, sans animation si prefers-reduced-motion. */

const SEUIL_ACTIF = 170;
const DECALAGE = 84;

const navs = document.querySelectorAll('.js-sommaire-liens');
if (navs.length) {
  const liens = [];
  for (const nav of navs) {
    for (const a of nav.querySelectorAll('a[href^="#"]')) liens.push(a);
  }
  const ids = [...new Set(liens.map((a) => a.getAttribute('href').slice(1)))];

  const majActif = () => {
    let actif = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= SEUIL_ACTIF) actif = id;
    }
    for (const a of liens) {
      const estActif = a.getAttribute('href') === '#' + actif;
      if (estActif) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  let enAttente = false;
  window.addEventListener('scroll', () => {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(() => { majActif(); enAttente = false; });
  }, { passive: true });
  majActif();

  for (const a of liens) {
    a.addEventListener('click', (e) => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - DECALAGE,
        behavior: reduit ? 'auto' : 'smooth',
      });
      const details = a.closest('details');
      if (details) details.open = false;
    });
  }
}
