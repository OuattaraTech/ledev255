import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { contact } from '../data/content'
import { WhatsAppIcon } from './icons'
import { useReducedMotion } from '../hooks/useMediaQuery'

/** Numéro au format attendu par wa.me : chiffres uniquement. */
const digits = contact.phone.replace(/\D/g, '')
const href = `https://wa.me/${digits}?text=${encodeURIComponent(contact.whatsappText)}`

/**
 * Bouton flottant WhatsApp.
 * Il n'apparaît qu'une fois l'accueil dépassé, pour ne pas couvrir le
 * portrait. Placé sous le menu mobile et sous les fenêtres modales.
 */
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
          className="fixed right-5 z-30 sm:right-7"
          style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Discuter sur WhatsApp"
            data-cursor="grow"
            className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366]
                       shadow-[0_10px_34px_-8px_rgba(37,211,102,0.75)] transition-transform duration-300
                       hover:scale-105 active:scale-95 sm:h-[3.75rem] sm:w-[3.75rem]"
          >
            {/* onde qui pulse */}
            {!reduced && (
              <span className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/50" />
            )}

            <WhatsAppIcon className="relative h-7 w-7 fill-white sm:h-8 sm:w-8" />

            {/* libellé au survol, desktop uniquement */}
            <span
              className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full
                         glass-strong px-3 py-1.5 font-display text-[13px] text-chalk opacity-0
                         transition-opacity duration-300 group-hover:opacity-100 lg:block"
            >
              Discutons sur WhatsApp
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
