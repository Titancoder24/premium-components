'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = React.useState(0);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    const numericTarget = typeof target === 'number' ? target : parseFloat(String(target));
    if (Number.isNaN(numericTarget)) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(numericTarget * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend: 'up' | 'down';
  className?: string;
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  trend,
  className,
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = !Number.isNaN(numericValue);
  const animated = useCountUp(isNumeric ? numericValue : 0);

  const displayValue = isNumeric
    ? typeof value === 'string'
      ? value.replace(/[\d,.]+/, Math.round(animated).toLocaleString())
      : Math.round(animated).toLocaleString()
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
      className={cn(
        'flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm',
        className,
      )}
    >
      {/* Icon with pulse */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 hsl(var(--primary) / 0)',
            '0 0 0 6px hsl(var(--primary) / 0.08)',
            '0 0 0 0 hsl(var(--primary) / 0)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
      >
        {icon}
      </motion.div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {displayValue}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

StatCard.displayName = 'StatCard';
