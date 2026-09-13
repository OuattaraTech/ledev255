import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { contact } from '../data/content'
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

            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              className="relative h-7 w-7 fill-white sm:h-8 sm:w-8"
            >
              <path d="M16.04 3.2c-7.08 0-12.83 5.75-12.83 12.83 0 2.26.6 4.47 1.73 6.42L3.2 28.8l6.52-1.7a12.78 12.78 0 0 0 6.32 1.65h.01c7.07 0 12.82-5.75 12.83-12.83 0-3.43-1.33-6.65-3.76-9.07a12.74 12.74 0 0 0-9.08-3.65Zm0 23.16h-.01a10.65 10.65 0 0 1-5.43-1.49l-.39-.23-4.03 1.05 1.08-3.93-.25-.4a10.62 10.62 0 0 1-1.63-5.68c0-5.88 4.79-10.66 10.67-10.66 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 0 1 3.12 7.54c-.01 5.88-4.79 10.67-10.66 10.67Zm5.85-7.99c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.59-.95-.85-1.6-1.9-1.79-2.22-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
            </svg>

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
