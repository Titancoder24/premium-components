'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, X, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AppliedPromo {
  code: string;
  discount: string;
}

export interface PromoCodeInputProps {
  onApply: (code: string) => void;
  applied?: AppliedPromo | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

// ---------------------------------------------------------------------------
// Shake animation
// ---------------------------------------------------------------------------

const shakeVariants = {
  initial: {},
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PromoCodeInput({
  onApply,
  applied = null,
  loading = false,
  error = null,
  className,
}: PromoCodeInputProps) {
  const [code, setCode] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);

  const prevApplied = React.useRef(applied);
  React.useEffect(() => {
    if (applied && !prevApplied.current) {
      setShowSuccess(true);
      setCode('');
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
    prevApplied.current = applied;
  }, [applied]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed && !loading) {
      onApply(trimmed);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Applied code tag */}
      <AnimatePresence>
        {applied && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span className="flex-1 text-sm font-medium text-emerald-700">
                {applied.code}
              </span>
              <span className="text-sm text-emerald-600">
                -{applied.discount}
              </span>
              <button
                type="button"
                onClick={() => onApply('')}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-emerald-500 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
                aria-label="Remove promo code"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      {!applied && (
        <motion.form
          onSubmit={handleSubmit}
          variants={shakeVariants}
          initial="initial"
          animate={error ? 'shake' : 'initial'}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Promo code"
              disabled={loading}
              className={cn(
                'h-10 w-full rounded-lg border bg-[var(--color-surface,#ffffff)] px-3 text-sm text-[var(--color-foreground,#111827)] placeholder:text-[var(--color-muted-foreground,#6b7280)] outline-none transition-colors focus:ring-2 focus:ring-[var(--color-primary,#3b82f6)]/30',
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-[var(--color-border,#e5e7eb)] focus:border-[var(--color-primary,#3b82f6)]',
              )}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!code.trim() || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-10 min-w-[5rem] items-center justify-center rounded-lg bg-[var(--color-primary,#3b82f6)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary,#3b82f6)]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.span>
              ) : showSuccess ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Apply
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && !applied && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

PromoCodeInput.displayName = 'PromoCodeInput';
