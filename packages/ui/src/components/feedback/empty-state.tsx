'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, SearchX, AlertCircle, ShieldOff } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'no-permission';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  className?: string;
}

// ---------------------------------------------------------------------------
// Default icons per variant
// ---------------------------------------------------------------------------

const defaultIcons: Record<EmptyStateVariant, React.ElementType> = {
  'no-data': FileQuestion,
  'no-results': SearchX,
  error: AlertCircle,
  'no-permission': ShieldOff,
};

const defaultTitles: Record<EmptyStateVariant, string> = {
  'no-data': 'No data yet',
  'no-results': 'No results found',
  error: 'Something went wrong',
  'no-permission': 'Access denied',
};

const defaultDescriptions: Record<EmptyStateVariant, string> = {
  'no-data': 'Get started by creating your first item.',
  'no-results': 'Try adjusting your search or filters.',
  error: 'An unexpected error occurred. Please try again.',
  'no-permission': 'You do not have permission to view this content.',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'no-data',
  className,
}: EmptyStateProps) {
  const DefaultIcon = defaultIcons[variant];
  const resolvedTitle = title ?? defaultTitles[variant];
  const resolvedDescription = description ?? defaultDescriptions[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted,#f3f4f6)]"
      >
        {icon ?? (
          <DefaultIcon className="h-8 w-8 text-[var(--color-muted-foreground,#6b7280)]" />
        )}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-lg font-semibold text-[var(--color-foreground,#111827)]"
      >
        {resolvedTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground,#6b7280)]"
      >
        {resolvedDescription}
      </motion.p>

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-6"
        >
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-lg bg-[var(--color-primary,#3b82f6)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-primary,#3b82f6)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#3b82f6)]/50 focus:ring-offset-2"
          >
            {action.label}
          </button>
        </motion.div>
      )}
    </div>
  );
}
