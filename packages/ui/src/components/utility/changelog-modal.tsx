'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Bug, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChangelogEntryType = 'feature' | 'fix' | 'improvement';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangelogEntryType;
}

export interface ChangelogModalProps {
  /** Changelog entries, newest first. */
  entries: ChangelogEntry[];
  /** Called when the modal is dismissed. */
  onDismiss: () => void;
  /** Whether the modal is visible. */
  open?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeConfig: Record<
  ChangelogEntryType,
  { label: string; icon: React.ElementType; className: string }
> = {
  feature: {
    label: 'Feature',
    icon: Sparkles,
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  fix: {
    label: 'Bug Fix',
    icon: Bug,
    className: 'bg-red-500/15 text-red-600 dark:text-red-400',
  },
  improvement: {
    label: 'Improvement',
    icon: Zap,
    className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.18 },
  },
};

const listVariants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChangelogModal({
  entries,
  onDismiss,
  open = true,
  className,
}: ChangelogModalProps) {
  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onDismiss]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Changelog"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative z-10 w-full max-w-lg rounded-2xl',
              'border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-xl',
              'max-h-[80vh] overflow-hidden flex flex-col',
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                What&apos;s New
              </h2>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-lg p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Entries */}
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[var(--color-border)] overflow-y-auto px-6"
            >
              {entries.map((entry, idx) => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;
                const isNew = idx === 0;

                return (
                  <motion.li
                    key={`${entry.version}-${idx}`}
                    variants={itemVariants}
                    className="py-4"
                  >
                    <div className="flex items-center gap-2">
                      {/* Type badge */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          config.className,
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>

                      {/* New badge */}
                      {isNew && (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                        >
                          New
                        </motion.span>
                      )}

                      <span className="ml-auto text-xs text-[var(--color-text-tertiary)]">
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                      {entry.title}
                      <span className="ml-2 text-xs font-normal text-[var(--color-text-tertiary)]">
                        v{entry.version}
                      </span>
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {entry.description}
                    </p>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

ChangelogModal.displayName = 'ChangelogModal';
