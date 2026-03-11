import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Hook that animates a number from one value to another using spring physics.
 * Returns the current display value that smoothly transitions.
 */
export function useAnimatedNumber(
  target: number,
  options: {
    /** Spring stiffness (default: 100) */
    stiffness?: number
    /** Spring damping (default: 30) */
    damping?: number
    /** Duration override in ms (default: uses spring physics) */
    duration?: number
  } = {},
): number {
  const { stiffness = 100, damping = 30, duration = 600 } = options
  const prefersReduced = useReducedMotion()
  const [display, setDisplay] = useState(target)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(target)
      return
    }

    const start = display
    const diff = target - start
    if (Math.abs(diff) < 0.01) {
      setDisplay(target)
      return
    }

    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Critically damped spring approximation
      const springProgress =
        1 - Math.exp(-stiffness * progress / damping) * (1 - progress)

      setDisplay(start + diff * springProgress)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [target, duration, stiffness, damping, prefersReduced])

  return display
}
