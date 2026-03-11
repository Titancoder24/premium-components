'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProgressVariant = 'linear' | 'circular';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressIndicatorProps {
  value?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  indeterminate?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const linearSizes: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const circularSizes: Record<ProgressSize, { size: number; stroke: number }> = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
};

const labelSizes: Record<ProgressSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

// ---------------------------------------------------------------------------
// Indeterminate shimmer (injected once)
// ---------------------------------------------------------------------------

const INDETERMINATE_STYLE_ID = 'pui-progress-indeterminate';

function ensureIndeterminateStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(INDETERMINATE_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = INDETERMINATE_STYLE_ID;
  style.textContent = `
    @keyframes pui-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Color helper
// ---------------------------------------------------------------------------

function getProgressColor(value: number): string {
  if (value >= 100) return 'var(--color-success,#22c55e)';
  if (value >= 80) return 'var(--color-warning,#f59e0b)';
  return 'var(--color-primary,#3b82f6)';
}

// ---------------------------------------------------------------------------
// Linear Progress
// ---------------------------------------------------------------------------

function LinearProgress({
  value = 0,
  size = 'md',
  showLabel = false,
  indeterminate = false,
  className,
}: ProgressIndicatorProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  React.useEffect(() => {
    if (indeterminate) ensureIndeterminateStyles();
  }, [indeterminate]);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && !indeterminate && (
        <div className="mb-1 flex justify-between">
          <span
            className={cn(
              'font-medium text-[var(--color-foreground,#111827)]',
              labelSizes[size],
            )}
          >
            Progress
          </span>
          <span
            className={cn(
              'text-[var(--color-muted-foreground,#6b7280)]',
              labelSizes[size],
            )}
          >
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-[var(--color-muted,#f3f4f6)]',
          linearSizes[size],
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {indeterminate ? (
          <div
            className="h-full w-1/3 rounded-full"
            style={{
              backgroundColor: 'var(--color-primary,#3b82f6)',
              animation: 'pui-indeterminate 1.5s infinite ease-in-out',
            }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full"
            initial={false}
            animate={{
              width: `${clampedValue}%`,
              backgroundColor: getProgressColor(clampedValue),
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularProgress({
  value = 0,
  size = 'md',
  showLabel = false,
  indeterminate = false,
  className,
}: ProgressIndicatorProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const config = circularSizes[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={config.size}
        height={config.size}
        className={indeterminate ? 'animate-spin' : undefined}
        style={indeterminate ? { animationDuration: '1.4s' } : undefined}
      >
        {/* Background track */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted,#f3f4f6)"
          strokeWidth={config.stroke}
        />

        {/* Progress arc */}
        {indeterminate ? (
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-primary,#3b82f6)"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            transform={`rotate(-90 ${config.size / 2} ${config.size / 2})`}
          />
        ) : (
          <motion.circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{
              strokeDashoffset: offset,
              stroke: getProgressColor(clampedValue),
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
            transform={`rotate(-90 ${config.size / 2} ${config.size / 2})`}
          />
        )}
      </svg>

      {showLabel && !indeterminate && (
        <span
          className={cn(
            'absolute font-semibold text-[var(--color-foreground,#111827)]',
            labelSizes[size],
          )}
        >
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ProgressIndicator({
  variant = 'linear',
  ...props
}: ProgressIndicatorProps) {
  if (variant === 'circular') {
    return <CircularProgress variant={variant} {...props} />;
  }
  return <LinearProgress variant={variant} {...props} />;
}
