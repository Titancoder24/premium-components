'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MiniSparklineRowProps {
  label: string;
  value: string | number;
  data: number[];
  trend?: 'up' | 'down';
  rank?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// SVG sparkline path builder
// ---------------------------------------------------------------------------

function buildSparklinePath(data: number[], width: number, height: number): string {
  if (data.length < 2) return '';

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

// ---------------------------------------------------------------------------
// MiniSparklineRow
// ---------------------------------------------------------------------------

export const MiniSparklineRow: React.FC<MiniSparklineRowProps> = ({
  label,
  value,
  data,
  trend,
  rank,
  className,
}) => {
  const sparkWidth = 64;
  const sparkHeight = 20;
  const path = buildSparklinePath(data, sparkWidth, sparkHeight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5',
        className,
      )}
    >
      {/* Optional rank badge */}
      {rank !== undefined && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
          {rank}
        </span>
      )}

      {/* Label */}
      <span className="flex-1 truncate text-sm text-muted-foreground">
        {label}
      </span>

      {/* Sparkline */}
      {data.length > 1 && (
        <svg
          viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}
          className={cn(
            'h-5 w-16 shrink-0',
            trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground',
          )}
          preserveAspectRatio="none"
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Value */}
      <span className="shrink-0 text-sm font-semibold text-foreground">
        {value}
      </span>

      {/* Trend icon */}
      {trend && (
        <span
          className={cn(
            'shrink-0',
            trend === 'up' ? 'text-emerald-500' : 'text-rose-500',
          )}
        >
          {trend === 'up' ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
        </span>
      )}
    </motion.div>
  );
};

MiniSparklineRow.displayName = 'MiniSparklineRow';
