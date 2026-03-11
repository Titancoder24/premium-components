'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ThemeOption {
  name: string;
  label: string;
  primary: string;
}

export interface ThemeSwitcherProps {
  /** Currently active theme name. */
  currentTheme: string;
  /** Called when the user selects a different theme. */
  onThemeChange: (theme: string) => void;
  /** Available theme options. */
  themes: ThemeOption[];
  /** Show a light/dark mode toggle alongside the theme grid. */
  showMode?: boolean;
  /** Current mode – only relevant when `showMode` is true. */
  mode?: 'light' | 'dark';
  /** Called when the mode toggle is clicked. */
  onModeChange?: (mode: 'light' | 'dark') => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  themes,
  showMode = false,
  mode = 'light',
  onModeChange,
  className,
}: ThemeSwitcherProps) {
  const isDark = mode === 'dark';

  const handleModeToggle = () => {
    onModeChange?.(isDark ? 'light' : 'dark');
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 shadow-sm',
        className,
      )}
    >
      {/* Mode toggle */}
      {showMode && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            Appearance
          </span>

          <button
            type="button"
            onClick={handleModeToggle}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-full',
              'bg-[var(--color-bg-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)]',
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <Moon className="h-5 w-5 text-[var(--color-text-primary)]" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <Sun className="h-5 w-5 text-[var(--color-text-primary)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}

      {/* Theme grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {themes.map((theme) => {
          const isSelected = theme.name === currentTheme;

          return (
            <button
              key={theme.name}
              type="button"
              onClick={() => onThemeChange(theme.name)}
              className={cn(
                'group relative flex flex-col items-center gap-2 rounded-lg p-3',
                'transition-colors hover:bg-[var(--color-bg-secondary)]',
              )}
              aria-pressed={isSelected}
            >
              {/* Swatch */}
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span
                  className="h-8 w-8 rounded-full shadow-inner"
                  style={{ backgroundColor: theme.primary }}
                />

                {/* Animated ring */}
                {isSelected && (
                  <motion.span
                    layoutId="theme-ring"
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: theme.primary }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  'text-xs font-medium',
                  isSelected
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-tertiary)]',
                )}
              >
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';
