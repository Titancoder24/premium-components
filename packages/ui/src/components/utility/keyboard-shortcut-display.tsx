'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShortcutItem {
  label: string;
  keys: string[];
}

export interface ShortcutCategory {
  category: string;
  items: ShortcutItem[];
}

export interface KeyboardShortcutDisplayProps {
  /** Grouped shortcut definitions. */
  shortcuts: ShortcutCategory[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Key Cap sub-component
// ---------------------------------------------------------------------------

function KeyCap({ label }: { label: string }) {
  return (
    <motion.kbd
      whileTap={{ y: 2, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
      className={cn(
        'inline-flex min-w-[1.75rem] items-center justify-center rounded-md px-2 py-1',
        'border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
        'text-xs font-semibold text-[var(--color-text-primary)]',
        'shadow-[0_2px_0_var(--color-border)]',
        'transition-shadow active:shadow-[0_0_0_var(--color-border)]',
        'active:translate-y-[2px]',
        'select-none cursor-default',
      )}
    >
      {label}
    </motion.kbd>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KeyboardShortcutDisplay({
  shortcuts,
  className,
}: KeyboardShortcutDisplayProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      {shortcuts.map((group) => (
        <motion.div key={group.category} variants={groupVariants}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {group.category}
          </h3>

          <div className="space-y-2">
            {group.items.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2',
                  'hover:bg-[var(--color-bg-secondary)] transition-colors',
                )}
              >
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {item.label}
                </span>

                <span className="flex items-center gap-1">
                  {item.keys.map((key, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <span className="mx-0.5 text-xs text-[var(--color-text-tertiary)]">
                          +
                        </span>
                      )}
                      <KeyCap label={key} />
                    </React.Fragment>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

KeyboardShortcutDisplay.displayName = 'KeyboardShortcutDisplay';
