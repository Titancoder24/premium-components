import { describe, it, expect } from 'vitest'
import {
  springSnappy,
  springGentle,
  springBouncy,
  springHeavy,
  fadeVariants,
  fadeUpVariants,
  fadeDownVariants,
  scaleInVariants,
  scaleInBounceVariants,
  slideRightVariants,
  slideLeftVariants,
  slideUpVariants,
  staggerContainerVariants,
  staggerFastVariants,
  hoverLiftProps,
  hoverPressProps,
  backdropVariants,
  modalVariants,
  reducedMotionVariants,
  createStaggerVariants,
} from '../animations'

// ─── Spring Presets ─────────────────────────────────────────

describe('Spring Presets', () => {
  it('springSnappy has correct type and stiffness', () => {
    expect((springSnappy as any).type).toBe('spring')
    expect((springSnappy as any).stiffness).toBe(300)
    expect((springSnappy as any).damping).toBe(30)
  })

  it('springGentle has lower stiffness', () => {
    expect((springGentle as any).stiffness).toBe(150)
    expect((springGentle as any).damping).toBe(25)
  })

  it('springBouncy has high stiffness and low damping', () => {
    expect((springBouncy as any).stiffness).toBe(400)
    expect((springBouncy as any).damping).toBe(20)
  })

  it('springHeavy has low stiffness', () => {
    expect((springHeavy as any).stiffness).toBe(100)
    expect((springHeavy as any).damping).toBe(30)
  })
})

// ─── Fade Variants ──────────────────────────────────────────

describe('Fade Variants', () => {
  it('fadeVariants has hidden, visible, and exit states', () => {
    expect(fadeVariants).toHaveProperty('hidden')
    expect(fadeVariants).toHaveProperty('visible')
    expect(fadeVariants).toHaveProperty('exit')
  })

  it('fadeUpVariants starts below and moves to 0', () => {
    expect((fadeUpVariants.hidden as Record<string, number>).y).toBe(15)
    expect((fadeUpVariants.visible as Record<string, number>).y).toBe(0)
  })

  it('fadeDownVariants starts above and moves to 0', () => {
    expect((fadeDownVariants.hidden as Record<string, number>).y).toBe(-15)
    expect((fadeDownVariants.visible as Record<string, number>).y).toBe(0)
  })
})

// ─── Scale Variants ─────────────────────────────────────────

describe('Scale Variants', () => {
  it('scaleInVariants scales from 0.95', () => {
    expect((scaleInVariants.hidden as Record<string, number>).scale).toBe(0.95)
    expect((scaleInVariants.visible as Record<string, number>).scale).toBe(1)
  })

  it('scaleInBounceVariants scales from 0.8', () => {
    expect((scaleInBounceVariants.hidden as Record<string, number>).scale).toBe(0.8)
  })
})

// ─── Slide Variants ─────────────────────────────────────────

describe('Slide Variants', () => {
  it('slideRightVariants slides from right', () => {
    expect((slideRightVariants.hidden as Record<string, string>).x).toBe('100%')
  })

  it('slideLeftVariants slides from left', () => {
    expect((slideLeftVariants.hidden as Record<string, string>).x).toBe('-100%')
  })

  it('slideUpVariants slides from bottom', () => {
    expect((slideUpVariants.hidden as Record<string, string>).y).toBe('100%')
  })
})

// ─── Stagger Variants ───────────────────────────────────────

describe('Stagger Variants', () => {
  it('staggerContainerVariants has staggerChildren', () => {
    const visible = staggerContainerVariants.visible as Record<string, unknown>
    const transition = visible.transition as Record<string, number>
    expect(transition.staggerChildren).toBe(0.075)
  })

  it('staggerFastVariants has faster stagger', () => {
    const visible = staggerFastVariants.visible as Record<string, unknown>
    const transition = visible.transition as Record<string, number>
    expect(transition.staggerChildren).toBe(0.05)
  })
})

// ─── Hover Presets ──────────────────────────────────────────

describe('Hover Presets', () => {
  it('hoverLiftProps lifts on hover', () => {
    expect(hoverLiftProps.whileHover.y).toBe(-2)
  })

  it('hoverPressProps scales on hover', () => {
    expect(hoverPressProps.whileHover.scale).toBe(1.02)
    expect(hoverPressProps.whileTap.scale).toBe(0.97)
  })
})

// ─── Overlay Variants ───────────────────────────────────────

describe('Overlay Variants', () => {
  it('backdropVariants fades in/out', () => {
    expect(backdropVariants).toHaveProperty('hidden')
    expect(backdropVariants).toHaveProperty('visible')
    expect(backdropVariants).toHaveProperty('exit')
  })

  it('modalVariants scales and fades', () => {
    expect((modalVariants.hidden as Record<string, number>).scale).toBe(0.95)
    expect((modalVariants.visible as Record<string, number>).scale).toBe(1)
  })
})

// ─── Reduced Motion ────────────────────────────────────────

describe('Reduced Motion Variants', () => {
  it('reducedMotionVariants has empty states', () => {
    expect(reducedMotionVariants.hidden).toEqual({})
    expect(reducedMotionVariants.visible).toEqual({})
    expect(reducedMotionVariants.exit).toEqual({})
  })
})

// ─── createStaggerVariants ──────────────────────────────────

describe('createStaggerVariants', () => {
  it('creates variants with default delay', () => {
    const variants = createStaggerVariants()
    const visible = variants.visible as Record<string, unknown>
    const transition = visible.transition as Record<string, number>
    expect(transition.staggerChildren).toBe(0.075)
    expect(transition.delayChildren).toBe(0.05)
  })

  it('creates variants with custom delay', () => {
    const variants = createStaggerVariants(0.1, 0.2)
    const visible = variants.visible as Record<string, unknown>
    const transition = visible.transition as Record<string, number>
    expect(transition.staggerChildren).toBe(0.1)
    expect(transition.delayChildren).toBe(0.2)
  })
})
