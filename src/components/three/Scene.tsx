import { Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { deviceTier, maxDpr, webglAvailable, type Tier } from '../../lib/perf'
import { useInView } from '../../hooks/useInView'
import ErrorBoundary from '../ErrorBoundary'
import { useReducedMotion } from '../../hooks/useMediaQuery'

type Props = {
  children: (tier: Tier) => ReactNode
  className?: string
  fallback?: ReactNode
  camera?: CanvasProps['camera']
  /** garde la scène montée une fois affichée (hero) */
  once?: boolean
  rootMargin?: string
  eventSource?: CanvasProps['eventSource']
  /** désactive la capture des events pointeur (scènes purement décoratives) */
  inert?: boolean
}

export default function Scene({
  children,
  className = '',
  fallback = null,
  camera = { position: [0, 0, 8], fov: 45 },
  once = false,
  rootMargin = '300px',
  inert = true,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin, once })
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(true)
  const [tier, setTier] = useState<Tier>('mid')
  const [dprFactor, setDprFactor] = useState(1)

  useEffect(() => {
    setSupported(webglAvailable())
    setTier(deviceTier())
    setMounted(true)
  }, [])

  const dpr = useMemo(() => {
    const [lo, hi] = maxDpr(tier)
    return [lo, Math.max(lo, hi * dprFactor)] as [number, number]
  }, [tier, dprFactor])

  const show = mounted && supported && inView && !reduced

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {show ? (
        <ErrorBoundary fallback={fallback}>
        <Canvas
          dpr={dpr}
          camera={camera}
          gl={{
            antialias: tier !== 'low',
            alpha: true,
            powerPreference: tier === 'low' ? 'default' : 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{ pointerEvents: inert ? 'none' : 'auto' }}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 120 } }}
        >
          <PerformanceMonitor
            onDecline={() => setDprFactor((f) => Math.max(0.55, f - 0.2))}
            onIncline={() => setDprFactor((f) => Math.min(1, f + 0.1))}
            flipflops={3}
          />
          <Suspense fallback={null}>{children(tier)}</Suspense>
        </Canvas>
        </ErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
