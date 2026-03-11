'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConfirmationVariant = 'danger' | 'warning';

export interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: ConfirmationVariant;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const variantStyles: Record<
  ConfirmationVariant,
  { iconBg: string; iconColor: string; buttonBg: string; buttonHover: string }
> = {
  danger: {
    iconBg: 'bg-[var(--color-error-bg,#fef2f2)]',
    iconColor: 'text-[var(--color-error,#ef4444)]',
    buttonBg: 'bg-[var(--color-error,#ef4444)]',
    buttonHover: 'hover:bg-[var(--color-error,#ef4444)]/90',
  },
  warning: {
    iconBg: 'bg-[var(--color-warning-bg,#fffbeb)]',
    iconColor: 'text-[var(--color-warning,#f59e0b)]',
    buttonBg: 'bg-[var(--color-warning,#f59e0b)]',
    buttonHover: 'hover:bg-[var(--color-warning,#f59e0b)]/90',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  variant = 'danger',
  className,
}: ConfirmationDialogProps) {
  const styles = variantStyles[variant];

  // Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  // Lock body scroll
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onCancel}
            aria-hidden
          />

          {/* Dialog */}
          <motion.div
            role="alertdialog"
            aria-modal
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={cn(
              'relative z-10 w-full max-w-md rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-6 shadow-2xl',
              className,
            )}
          >
            <div className="flex gap-4">
              {/* Warning icon with bounce scale */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { type: 'spring', stiffness: 500, damping: 15, delay: 0.1 },
                }}
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  styles.iconBg,
                )}
              >
                <AlertTriangle className={cn('h-5 w-5', styles.iconColor)} />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--color-foreground,#111827)]">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground,#6b7280)]">
                    {description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] px-4 py-2 text-sm font-medium text-[var(--color-foreground,#111827)] hover:bg-[var(--color-muted,#f3f4f6)]"
                  >
                    Cancel
                  </button>

                  {/* Confirm button with pulse animation */}
                  <motion.button
                    type="button"
                    onClick={onConfirm}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0px rgba(239,68,68,0)',
                        '0 0 0 4px rgba(239,68,68,0.2)',
                        '0 0 0 0px rgba(239,68,68,0)',
                      ],
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium text-white',
                      styles.buttonBg,
                      styles.buttonHover,
                    )}
                  >
                    {confirmLabel}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onCancel}
              className="absolute right-3 top-3 rounded-md p-1 text-[var(--color-muted-foreground,#6b7280)] hover:bg-[var(--color-muted,#f3f4f6)]"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
