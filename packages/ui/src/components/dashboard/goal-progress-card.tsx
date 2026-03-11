'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoalProgressCardProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  deadline?: Date;
  variant?: 'circular' | 'linear';
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDeadline(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  if (days < 30) return `${days} days left`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month left' : `${months} months left`;
}

// ---------------------------------------------------------------------------
// Circular variant
// ---------------------------------------------------------------------------

function CircularProgress({
  percentage,
  current,
  target,
  unit,
}: {
  percentage: number;
  current: number;
  target: number;
  unit?: string;
}) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const clampedPct = Math.min(percentage, 100);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={140} height={140} viewBox="0 0 140 140" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            className="stroke-muted"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <motion.circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            className="stroke-primary"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - clampedPct / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round(clampedPct)}%
          </span>
          <span className="text-[11px] text-muted-foreground">
            {current.toLocaleString()}{unit ? ` ${unit}` : ''} / {target.toLocaleString()}{unit ? ` ${unit}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Linear variant
// ---------------------------------------------------------------------------

function LinearProgress({
  percentage,
  current,
  target,
  unit,
}: {
  percentage: number;
  current: number;
  target: number;
  unit?: string;
}) {
  const clampedPct = Math.min(percentage, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {current.toLocaleString()}{unit ? ` ${unit}` : ''}
        </span>
        <span className="font-semibold text-foreground">
          {Math.round(clampedPct)}%
        </span>
        <span className="text-muted-foreground">
          {target.toLocaleString()}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GoalProgressCard
// ---------------------------------------------------------------------------

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  current,
  target,
  label,
  unit,
  deadline,
  variant = 'linear',
  className,
}) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        {deadline && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-medium',
              deadline.getTime() < Date.now()
                ? 'bg-rose-500/10 text-rose-600'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {formatDeadline(deadline)}
          </span>
        )}
      </div>

      {variant === 'circular' ? (
        <CircularProgress
          percentage={percentage}
          current={current}
          target={target}
          unit={unit}
        />
      ) : (
        <LinearProgress
          percentage={percentage}
          current={current}
          target={target}
          unit={unit}
        />
      )}
    </motion.div>
  );
};

GoalProgressCard.displayName = 'GoalProgressCard';
