'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// useAnimatedNumber – smoothly counts from 0 to the target value
// ---------------------------------------------------------------------------

function useAnimatedNumber(target: number, duration = 600): number {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (target - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ---------------------------------------------------------------------------
// Mini sparkline rendered as an SVG polyline
// ---------------------------------------------------------------------------

interface SparklineProps {
  data: number[];
  className?: string;
}

function Sparkline({ data, className }: SparklineProps) {
  if (!data.length) return null;

  const width = 80;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-20 h-7', className)}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// KpiStatCard
// ---------------------------------------------------------------------------

export type KpiStatCardVariant = 'default' | 'compact' | 'highlighted';

export interface KpiStatCardProps {
  value: string | number;
  label: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparklineData?: number[];
  loading?: boolean;
  variant?: KpiStatCardVariant;
  className?: string;
}

const trendIcons: Record<KpiStatCardProps['trendDirection'], React.ReactNode> = {
  up: <TrendingUp className="h-3.5 w-3.5" />,
  down: <TrendingDown className="h-3.5 w-3.5" />,
  neutral: <Minus className="h-3.5 w-3.5" />,
};

const trendColors: Record<KpiStatCardProps['trendDirection'], string> = {
  up: 'text-emerald-500',
  down: 'text-rose-500',
  neutral: 'text-muted-foreground',
};

export const KpiStatCard: React.FC<KpiStatCardProps> = ({
  value,
  label,
  trend,
  trendDirection,
  icon,
  sparklineData,
  loading = false,
  variant = 'default',
  className,
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const animated = useAnimatedNumber(
    Number.isNaN(numericValue) ? 0 : numericValue,
  );

  const displayValue =
    typeof value === 'string' && Number.isNaN(numericValue)
      ? value
      : typeof value === 'string'
        ? value.replace(/[\d,.]+/, Math.round(animated).toLocaleString())
        : Math.round(animated).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      className={cn(
        'rounded-xl border border-border bg-card p-5 transition-colors',
        variant === 'highlighted' && 'border-l-4 border-l-primary',
        variant === 'compact' && 'p-3',
        className,
      )}
    >
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {icon && <span className="shrink-0">{icon}</span>}
              <span>{label}</span>
            </div>

            <p
              className={cn(
                'font-semibold tracking-tight text-foreground',
                variant === 'compact' ? 'text-xl' : 'text-2xl',
              )}
            >
              {displayValue}
            </p>

            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trendColors[trendDirection],
              )}
            >
              {trendIcons[trendDirection]}
              <span>
                {trend > 0 ? '+' : ''}
                {trend}%
              </span>
            </div>
          </div>

          {sparklineData && sparklineData.length > 1 && (
            <Sparkline
              data={sparklineData}
              className={cn(trendColors[trendDirection])}
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

KpiStatCard.displayName = 'KpiStatCard';
