'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TagItem {
  label: string;
  color?: string;
  count?: number;
}

export interface TagCollectionProps {
  /** Available tags. */
  tags: TagItem[];
  /** Currently selected tag labels. */
  selected: string[];
  /** Called when a tag is toggled. */
  onToggle: (label: string) => void;
  /** Visual variant. */
  variant?: 'pill' | 'badge';
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TagCollection({
  tags,
  selected,
  onToggle,
  variant = 'pill',
  className,
}: TagCollectionProps) {
  const isPill = variant === 'pill';

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => {
        const isSelected = selected.includes(tag.label);
        const color = tag.color ?? 'var(--color-accent)';

        return (
          <motion.button
            key={tag.label}
            type="button"
            onClick={() => onToggle(tag.label)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative inline-flex items-center gap-1.5 overflow-hidden',
              'border text-sm font-medium transition-colors',
              isPill ? 'rounded-full px-3.5 py-1.5' : 'rounded-md px-2.5 py-1',
              isSelected
                ? 'border-transparent text-white'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]',
            )}
            aria-pressed={isSelected}
          >
            {/* Animated background fill */}
            <motion.span
              className="absolute inset-0 z-0"
              initial={false}
              animate={{
                scaleX: isSelected ? 1 : 0,
                opacity: isSelected ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                backgroundColor: color,
                transformOrigin: 'left center',
              }}
            />

            <span className="relative z-10">{tag.label}</span>

            {tag.count !== undefined && (
              <span
                className={cn(
                  'relative z-10 text-xs',
                  isSelected ? 'text-white/80' : 'text-[var(--color-text-tertiary)]',
                )}
              >
                {tag.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

TagCollection.displayName = 'TagCollection';
