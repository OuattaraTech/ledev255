import { useMotionPreference } from '../hooks/useMotionPreference'

/**
 * Coupe ou rallume les animations : scènes 3D, défilement fluide,
 * apparitions au scroll et animations CSS. Le choix est mémorisé.
 */
export default function MotionToggle({ className = '' }: { className?: string }) {
  const { reduced, toggle } = useMotionPreference()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      title={reduced ? 'Réactiver les animations' : 'Réduire les animations'}
      className={`relative grid h-10 w-10 place-items-center rounded-xl glass transition-colors duration-300 hover:border-gold-400/45 ${className}`}
    >
      <span className="sr-only">
        {reduced ? 'Réactiver les animations' : 'Réduire les animations'}
      </span>

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        className={`h-[19px] w-[19px] transition-colors duration-300 ${
          reduced ? 'stroke-muted' : 'stroke-gold-300'
        }`}
      >
        {/* tracé d'activité : le mouvement */}
        <path d="M2.5 12h3.2l2.1-6.4 3.7 12.8 2.4-8 1.6 3.2h6" />
        {/* barre oblique quand les animations sont coupées */}
        <path
          d="M4 20 20 4"
          className={`transition-opacity duration-300 ${reduced ? 'opacity-100' : 'opacity-0'}`}
        />
      </svg>
    </button>
  )
}
