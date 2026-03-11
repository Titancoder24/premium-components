'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CtaBannerGradient {
  from: string;
  to: string;
}

export interface CtaBannerCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onAction?: () => void;
  onDismiss?: () => void;
  gradient?: CtaBannerGradient;
  className?: string;
}

// ---------------------------------------------------------------------------
// CtaBannerCard
// ---------------------------------------------------------------------------

export const CtaBannerCard: React.FC<CtaBannerCardProps> = ({
  title,
  description,
  ctaLabel,
  onAction,
  onDismiss,
  gradient = { from: 'hsl(var(--primary))', to: 'hsl(var(--primary) / 0.7)' },
  className,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn(
            'relative overflow-hidden rounded-2xl p-6 shadow-lg md:p-8',
            className,
          )}
          style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          }}
        >
          {/* Animated gradient overlay for subtle shift */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: [
                `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                `linear-gradient(225deg, ${gradient.from}, ${gradient.to})`,
                `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white md:text-xl">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                {description}
              </p>
            </div>

            <motion.button
              onClick={onAction}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255,255,255,0.3)',
              }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-md transition-colors hover:bg-white/90"
            >
              {ctaLabel}
            </motion.button>
          </div>

          {/* Dismiss button */}
          {onDismiss && (
            <motion.button
              onClick={handleDismiss}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CtaBannerCard.displayName = 'CtaBannerCard';
