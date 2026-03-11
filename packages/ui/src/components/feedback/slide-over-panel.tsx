'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SlideOverSide = 'left' | 'right';
export type SlideOverWidth = 'sm' | 'md' | 'lg';

export interface SlideOverPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  side?: SlideOverSide;
  width?: SlideOverWidth;
  className?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const widthClasses: Record<SlideOverWidth, string> = {
  sm: 'w-80',
  md: 'w-[28rem]',
  lg: 'w-[36rem]',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlideOverPanel({
  open,
  onClose,
  title,
  children,
  side = 'right',
  width = 'md',
  className,
}: SlideOverPanelProps) {
  const isRight = side === 'right';

  // Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const offscreenX = isRight ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9990] flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ x: offscreenX }}
            animate={{
              x: 0,
              transition: { type: 'spring', stiffness: 400, damping: 35, duration: 0.3 },
            }}
            exit={{
              x: offscreenX,
              transition: { duration: 0.2, ease: 'easeIn' },
            }}
            className={cn(
              'relative z-10 flex h-full flex-col border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] shadow-xl',
              isRight ? 'ml-auto border-l' : 'mr-auto border-r',
              widthClasses[width],
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border,#e5e7eb)] px-6 py-4">
              {title && (
                <h2 className="text-lg font-semibold text-[var(--color-foreground,#111827)]">
                  {title}
                </h2>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-[var(--color-muted-foreground,#6b7280)] hover:bg-[var(--color-muted,#f3f4f6)] hover:text-[var(--color-foreground,#111827)]"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content with delayed fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.1, duration: 0.2 },
              }}
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
