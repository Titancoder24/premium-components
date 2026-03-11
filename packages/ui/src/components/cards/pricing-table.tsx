'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { PricingCard, type PricingCardProps } from './pricing-card';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PricingTableProps {
  plans: PricingCardProps[];
  defaultPeriod?: 'monthly' | 'annually';
  onPeriodChange?: (period: 'monthly' | 'annually') => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// PricingTable
// ---------------------------------------------------------------------------

export const PricingTable: React.FC<PricingTableProps> = ({
  plans,
  defaultPeriod = 'monthly',
  onPeriodChange,
  className,
}) => {
  const [period, setPeriod] = React.useState<'monthly' | 'annually'>(defaultPeriod);

  const handlePeriodChange = (newPeriod: 'monthly' | 'annually') => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  return (
    <div className={cn('flex flex-col items-center gap-10', className)}>
      {/* Period toggle */}
      <div className="relative flex items-center rounded-full border border-border bg-muted p-1">
        <motion.div
          className="absolute inset-y-1 rounded-full bg-background shadow-sm"
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            left: period === 'monthly' ? 4 : '50%',
            width: 'calc(50% - 4px)',
          }}
        />
        {(['monthly', 'annually'] as const).map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p)}
            className={cn(
              'relative z-10 rounded-full px-5 py-1.5 text-sm font-medium transition-colors',
              period === p ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {p === 'monthly' ? 'Monthly' : 'Annually'}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="wait">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.planName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            >
              <PricingCard {...plan} period={period} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

PricingTable.displayName = 'PricingTable';
