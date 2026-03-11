'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps {
  planName: string;
  price: number;
  period: 'monthly' | 'annually';
  features: PricingFeature[];
  highlighted?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// PricingCard
// ---------------------------------------------------------------------------

export const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  period,
  features,
  highlighted = false,
  ctaLabel = 'Get Started',
  onSelect,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm',
        highlighted && 'border-primary/50 shadow-lg',
        className,
      )}
    >
      {/* Pulsing border glow for highlighted */}
      {highlighted && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary/40"
          animate={{
            boxShadow: [
              '0 0 0 0 hsl(var(--primary) / 0)',
              '0 0 16px 4px hsl(var(--primary) / 0.15)',
              '0 0 0 0 hsl(var(--primary) / 0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{planName}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold tracking-tight text-foreground"
          >
            ${price}
          </motion.span>
          <span className="text-sm text-muted-foreground">
            /{period === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, i) => (
          <motion.li
            key={feature.text}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            className="flex items-start gap-2.5 text-sm"
          >
            {feature.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
            )}
            <span
              className={cn(
                'text-foreground',
                !feature.included && 'text-muted-foreground line-through',
              )}
            >
              {feature.text}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        onClick={onSelect}
        whileHover={{
          scale: 1.02,
          backgroundPosition: '100% 50%',
        }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
          highlighted
            ? 'bg-gradient-to-r from-primary to-primary/80 bg-[length:200%_100%] bg-left text-primary-foreground shadow-md'
            : 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
        )}
      >
        {ctaLabel}
      </motion.button>
    </motion.div>
  );
};

PricingCard.displayName = 'PricingCard';
