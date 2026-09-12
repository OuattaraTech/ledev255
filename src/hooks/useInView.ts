import { useEffect, useRef, useState } from 'react'

/** Monte / démonte du contenu lourd (canvas 3D) selon la visibilité. */
export function useInView<T extends HTMLElement>(
  { rootMargin = '250px', once = false, threshold = 0 } = {},
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, once, threshold])

  return { ref, inView }
}
