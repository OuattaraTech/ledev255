/**
 * Verrou de défilement.
 *
 * Le chat en plein écran doit immobiliser la page derrière lui. Lenis
 * pilote le défilement depuis `SmoothScroll`, qui écoute cet événement :
 * lui seul sait arrêter puis relancer proprement l'instance.
 */

export const VERROU_DEFILEMENT = 'dev225:verrou-defilement'

export function verrouillerPage(actif: boolean) {
  window.dispatchEvent(new CustomEvent(VERROU_DEFILEMENT, { detail: actif }))
}
