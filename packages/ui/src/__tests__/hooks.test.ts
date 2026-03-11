import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/use-theme'
import { useReducedMotion } from '../hooks/use-reduced-motion'

// ─── useTheme ──────────────────────────────────────────────

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('light', 'dark')
  })

  it('returns default theme state', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('slate')
    expect(result.current.mode).toBe('system')
  })

  it('accepts custom defaults', () => {
    const { result } = renderHook(() => useTheme('ocean', 'dark'))
    expect(result.current.theme).toBe('ocean')
    expect(result.current.mode).toBe('dark')
  })

  it('sets data-theme attribute on document', () => {
    renderHook(() => useTheme('ocean'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean')
  })

  it('setTheme updates theme and data-theme attribute', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('forest')
    })

    expect(result.current.theme).toBe('forest')
    expect(document.documentElement.getAttribute('data-theme')).toBe('forest')
  })

  it('setMode updates mode and document class', () => {
    const { result } = renderHook(() => useTheme('slate', 'light'))

    act(() => {
      result.current.setMode('dark')
    })

    expect(result.current.mode).toBe('dark')
    expect(result.current.resolvedMode).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('resolves system mode to light by default', () => {
    const { result } = renderHook(() => useTheme('slate', 'system'))
    // matchMedia mock returns matches: false by default
    expect(result.current.resolvedMode).toBe('light')
  })

  it('resolves system mode to dark when prefers-color-scheme is dark', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useTheme('slate', 'system'))
    expect(result.current.resolvedMode).toBe('dark')
  })
})

// ─── useReducedMotion ──────────────────────────────────────

describe('useReducedMotion', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion matches', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
})
