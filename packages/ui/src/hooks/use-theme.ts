import { useCallback, useEffect, useState } from 'react'

/** Available theme names in the library */
export type ThemeName =
  | 'ocean' | 'sky' | 'cobalt' | 'sapphire' | 'steel' | 'arctic'
  | 'forest' | 'mint' | 'sage' | 'emerald' | 'lime' | 'pine'
  | 'teal' | 'cyan' | 'aqua' | 'turquoise' | 'verdigris'
  | 'violet' | 'lavender' | 'grape' | 'amethyst' | 'plum' | 'indigo'
  | 'rose' | 'crimson' | 'coral' | 'ruby' | 'blush' | 'cherry'
  | 'amber' | 'tangerine' | 'peach' | 'copper' | 'honey'
  | 'gold' | 'sunflower' | 'canary' | 'saffron'
  | 'slate' | 'zinc' | 'stone' | 'graphite' | 'silver' | 'charcoal'
  | 'neon' | 'synthwave' | 'sunset' | 'aurora' | 'monochrome'
  | 'earth' | 'midnight' | 'frost' | 'sand' | 'terminal' | 'paper'

/** Color mode for the current theme */
export type ColorMode = 'light' | 'dark' | 'system'

/** Theme context state */
export interface ThemeState {
  /** Current active theme */
  theme: ThemeName
  /** Current color mode */
  mode: ColorMode
  /** Resolved mode (light or dark, system resolved) */
  resolvedMode: 'light' | 'dark'
  /** Set the active theme */
  setTheme: (theme: ThemeName) => void
  /** Set the color mode */
  setMode: (mode: ColorMode) => void
}

/**
 * Hook for managing theme and color mode state.
 * Applies data-theme and class attributes to the document root.
 */
export function useTheme(
  defaultTheme: ThemeName = 'slate',
  defaultMode: ColorMode = 'system',
): ThemeState {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mode, setModeState] = useState<ColorMode>(defaultMode)
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light')

  const resolveMode = useCallback((m: ColorMode): 'light' | 'dark' => {
    if (m === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return 'light'
    }
    return m
  }, [])

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t)
    }
  }, [])

  const setMode = useCallback(
    (m: ColorMode) => {
      setModeState(m)
      const resolved = resolveMode(m)
      setResolvedMode(resolved)
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolved)
      }
    },
    [resolveMode],
  )

  useEffect(() => {
    setTheme(theme)
    setMode(mode)
  }, [theme, mode, setTheme, setMode])

  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedMode(resolved)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [mode])

  return { theme, mode, resolvedMode, setTheme, setMode }
}
