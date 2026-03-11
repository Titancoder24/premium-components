'use client';

import * as React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  connected: boolean;
}

export interface IntegrationsGridProps {
  /** Available integrations. */
  integrations: Integration[];
  /** Called when a connection toggle is flipped. */
  onToggle: (id: string) => void;
  /** Available category filters. */
  categories: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IntegrationsGrid({
  integrations,
  onToggle,
  categories,
  className,
}: IntegrationsGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const filtered = activeCategory
    ? integrations.filter((i) => i.category === activeCategory)
    : integrations;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            activeCategory === null
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === cat
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((integration) => (
              <motion.div
                key={integration.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  'flex flex-col rounded-xl border border-[var(--color-border)]',
                  'bg-[var(--color-bg-primary)] p-5 shadow-sm',
                  'hover:shadow-md transition-shadow',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)]">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {integration.name}
                      </h3>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        {integration.category}
                      </span>
                    </div>
                  </div>

                  {/* Connection toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={integration.connected}
                    onClick={() => onToggle(integration.id)}
                    className={cn(
                      'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                      integration.connected
                        ? 'bg-emerald-500'
                        : 'bg-[var(--color-bg-tertiary)]',
                    )}
                  >
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm',
                        integration.connected ? 'left-[calc(100%-1.375rem)]' : 'left-0.5',
                      )}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {integration.description}
                </p>

                {/* Status badge */}
                <div className="mt-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      integration.connected
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        integration.connected ? 'bg-emerald-500' : 'bg-[var(--color-text-tertiary)]',
                      )}
                    />
                    {integration.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}

IntegrationsGrid.displayName = 'IntegrationsGrid';
