import type { Variants, Transition } from 'framer-motion'

// ─── Spring Presets ─────────────────────────────────────────────

/** Snappy spring for UI interactions */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

/** Gentle spring for layout shifts */
export const springGentle: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
}

/** Bouncy spring for playful elements */
export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
}

/** Heavy spring for large elements */
export const springHeavy: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
}

// ─── Fade Variants ──────────────────────────────────────────────

/** Simple fade in/out */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/** Fade up from below */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

/** Fade down from above */
export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 15, transition: { duration: 0.2 } },
}

// ─── Scale Variants ─────────────────────────────────────────────

/** Scale in from smaller */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

/** Scale in with bounce */
export const scaleInBounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
}

// ─── Slide Variants ─────────────────────────────────────────────

/** Slide in from right */
export const slideRightVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
}

/** Slide in from left */
export const slideLeftVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.3 } },
}

/** Slide up from bottom */
export const slideUpVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
}

// ─── Stagger Container ─────────────────────────────────────────

/** Container that staggers children animations */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.05,
    },
  },
}

/** Container with faster stagger */
export const staggerFastVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

// ─── Hover Presets ──────────────────────────────────────────────

/** Card lift on hover */
export const hoverLiftProps = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } },
}

/** Button press effect */
export const hoverPressProps = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
}

// ─── Overlay Variants ───────────────────────────────────────────

/** Backdrop fade for modals/dialogs */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

/** Modal entrance */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

// ─── Utility ────────────────────────────────────────────────────

/**
 * Create stagger children variants with custom delay.
 */
export function createStaggerVariants(
  staggerDelay = 0.075,
  childDelay = 0.05,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
  }
}

/**
 * Get empty variants when reduced motion is preferred.
 * Components use this to disable all animations.
 */
export const reducedMotionVariants: Variants = {
  hidden: {},
  visible: {},
  exit: {},
}
