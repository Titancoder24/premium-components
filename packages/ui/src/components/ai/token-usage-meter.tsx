'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenBreakdown {
  model: string;
  count: number;
}

export interface TokenUsageMeterProps {
  used: number;
  limit: number;
  breakdown?: TokenBreakdown[];
  billingPeriod?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMeterColor(ratio: number): string {
  if (ratio < 0.6) return 'bg-emerald-500';
  if (ratio < 0.85) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMeterTextColor(ratio: number): string {
  if (ratio < 0.6) return 'text-emerald-500';
  if (ratio < 0.85) return 'text-amber-500';
  return 'text-red-500';
}

function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// AnimatedNumber
// ---------------------------------------------------------------------------

const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  const [displayed, setDisplayed] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return <span className={className}>{formatTokenCount(displayed)}</span>;
};

// ---------------------------------------------------------------------------
// TokenUsageMeter
// ---------------------------------------------------------------------------

export const TokenUsageMeter: React.FC<TokenUsageMeterProps> = ({
  used,
  limit,
  breakdown = [],
  billingPeriod,
  className,
}) => {
  const ratio = limit > 0 ? Math.min(used / limit, 1) : 0;
  const maxBreakdown = breakdown.length > 0
    ? Math.max(...breakdown.map((b) => b.count))
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Token Usage
          </span>
        </div>
        {billingPeriod && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {billingPeriod}
          </span>
        )}
      </div>

      {/* Main meter */}
      <div className="mb-2">
        <div className="mb-1.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={used}
              className={cn('text-2xl font-bold', getMeterTextColor(ratio))}
            />
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              / {formatTokenCount(limit)}
            </span>
          </div>
          <span
            className={cn(
              'text-sm font-medium',
              getMeterTextColor(ratio),
            )}
          >
            {Math.round(ratio * 100)}%
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', getMeterColor(ratio))}
          />
        </div>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            <Zap className="h-3 w-3" />
            Usage by model
          </div>
          {breakdown.map((item, i) => (
            <div key={item.model} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--foreground))]">{item.model}</span>
                <span className="text-[hsl(var(--muted-foreground))]">
                  {formatTokenCount(item.count)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(item.count / maxBreakdown) * 100}%`,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.1,
                    ease: 'easeOut',
                  }}
                  className="h-full rounded-full bg-[hsl(var(--primary))]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

TokenUsageMeter.displayName = 'TokenUsageMeter';
