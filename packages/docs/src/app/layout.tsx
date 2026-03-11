'use client'

import './globals.css'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const themes = [
  { name: 'slate', label: 'Slate', color: '#64748b' },
  { name: 'ocean', label: 'Ocean', color: '#0ea5e9' },
  { name: 'sky', label: 'Sky', color: '#38bdf8' },
  { name: 'cobalt', label: 'Cobalt', color: '#3b82f6' },
  { name: 'sapphire', label: 'Sapphire', color: '#6366f1' },
  { name: 'steel', label: 'Steel', color: '#78716c' },
  { name: 'arctic', label: 'Arctic', color: '#94a3b8' },
  { name: 'forest', label: 'Forest', color: '#16a34a' },
  { name: 'emerald', label: 'Emerald', color: '#10b981' },
  { name: 'violet', label: 'Violet', color: '#8b5cf6' },
  { name: 'rose', label: 'Rose', color: '#f43f5e' },
  { name: 'amber', label: 'Amber', color: '#f59e0b' },
  { name: 'neon', label: 'Neon', color: '#22d3ee' },
  { name: 'terminal', label: 'Terminal', color: '#22c55e' },
  { name: 'monochrome', label: 'Mono', color: '#a1a1aa' },
  { name: 'paper', label: 'Paper', color: '#d6d3d1' },
  { name: 'mint', label: 'Mint', color: '#34d399' },
  { name: 'teal', label: 'Teal', color: '#14b8a6' },
  { name: 'crimson', label: 'Crimson', color: '#dc2626' },
  { name: 'gold', label: 'Gold', color: '#eab308' },
  { name: 'synthwave', label: 'Synthwave', color: '#e879f9' },
  { name: 'midnight', label: 'Midnight', color: '#1e3a5f' },
]

function ThemePickerButton() {
  const [open, setOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('midnight')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchTheme = (name: string) => {
    setCurrentTheme(name)
    document.documentElement.setAttribute('data-theme', name)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-all hover:border-primary/30 hover:text-foreground"
      >
        <span
          className="h-3 w-3 rounded-full ring-1 ring-white/20"
          style={{ background: themes.find(t => t.name === currentTheme)?.color }}
        />
        <span className="hidden sm:inline">{themes.find(t => t.name === currentTheme)?.label}</span>
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border/50 bg-card/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Themes
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => switchTheme(t.name)}
                  className={`group flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] transition-all hover:bg-muted/50 ${
                    currentTheme === t.name ? 'bg-muted ring-1 ring-primary/50' : ''
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full ring-1 ring-white/10 transition-transform group-hover:scale-110"
                    style={{ background: t.color }}
                  />
                  <span className="text-muted-foreground">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DarkModeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-muted-foreground backdrop-blur transition-all hover:border-primary/30 hover:text-foreground"
      aria-label="Toggle dark mode"
    >
      <motion.div
        key={dark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {dark ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.div>
    </button>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="midnight" className="dark" suppressHydrationWarning>
      <head>
        <title>Premium UI — Production-Grade Component Library</title>
        <meta name="description" content="200+ premium React components with motion animations, 22 themes, and full TypeScript support." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased custom-scrollbar" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/20 group-hover:ring-primary/40">
                  <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                </div>
                <span className="text-sm font-bold tracking-tight text-foreground">
                  Premium<span className="text-primary">UI</span>
                </span>
              </Link>
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href="/components"
                  className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  Components
                </Link>
                <Link
                  href="/getting-started"
                  className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  Docs
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemePickerButton />
              <DarkModeToggle />
              <div className="ml-2 hidden items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur sm:flex">
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">npx</kbd>
                <span>premiumui add</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
