/* Nabla — analytics.js
   Aide Plausible partagée : un événement par session d'interaction.
   Chaque clé (nom + props) est limitée à un envoi par fenêtre de cooldown,
   pour que « une session d'interaction ≈ un événement ». */

const dernier = new Map();

/**
 * Envoie un événement personnalisé Plausible, throttlé par clé.
 * @param {string} nom      nom de l'événement (ex. 'widget_interact')
 * @param {object} [props]  propriétés Plausible
 * @param {number} [cooldownMs=30000] fenêtre minimale entre deux envois
 */
export function track(nom, props, cooldownMs = 30000) {
  const cle = nom + JSON.stringify(props || null);
  const maintenant = Date.now();
  const t = dernier.get(cle);
  if (t !== undefined && maintenant - t < cooldownMs) return;
  dernier.set(cle, maintenant);
  if (typeof window.plausible === 'function') {
    window.plausible(nom, props ? { props } : undefined);
  }
}
