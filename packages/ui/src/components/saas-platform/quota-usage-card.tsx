'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  Gauge,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Quota {
  id: string;
  name: string;
  current: number;
  limit: number;
  unit: string;
  icon?: React.ReactNode;
}

export interface QuotaUsageCardProps {
  quotas: Quota[];
  onUpgrade?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPercentage(current: number, limit: number): number {
  return limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
}

function getColor(pct: number): {
  bar: string;
  text: string;
  ring: string;
} {
  if (pct > 85)
    return {
      bar: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      ring: 'stroke-red-500',
    };
  if (pct > 60)
    return {
      bar: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'stroke-amber-500',
    };
  return {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'stroke-emerald-500',
  };
}

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 800;
    const start = Date.now();
    const startVal = display;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularProgress({
  percentage,
  color,
  size = 64,
  strokeWidth = 5,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={color}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quota Item
// ---------------------------------------------------------------------------

function QuotaItem({
  quota,
  index,
  showUpgrade,
  onUpgrade,
}: {
  quota: Quota;
  index: number;
  showUpgrade: boolean;
  onUpgrade?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const pct = getPercentage(quota.current, quota.limit);
  const colors = getColor(pct);
  const isOverage = pct >= 100;
  const isNearLimit = pct > 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Overage badge */}
      <AnimatePresence>
        {isOverage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -right-2 -top-2"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow"
            >
              <AlertTriangle className="h-3 w-3" />
              Over
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular progress */}
      <div className="relative">
        <CircularProgress percentage={pct} color={colors.ring} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-sm font-bold', colors.text)}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{quota.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <AnimatedNumber value={quota.current} /> / {quota.limit.toLocaleString()} {quota.unit}
        </p>
      </div>

      {/* Usage bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn('h-full rounded-full', colors.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
        />
      </div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
          >
            {quota.current.toLocaleString()} of {quota.limit.toLocaleString()} {quota.unit} used
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade button */}
      {showUpgrade && isNearLimit && onUpgrade && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpgrade}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          <Zap className="h-3 w-3" />
          Upgrade
        </motion.button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuotaUsageCard({
  quotas,
  onUpgrade,
  className,
}: QuotaUsageCardProps) {
  const hasNearLimit = quotas.some((q) => getPercentage(q.current, q.limit) > 85);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Resource Usage</h2>
        </div>
        {hasNearLimit && onUpgrade && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            <ArrowUpRight className="h-4 w-4" />
            Upgrade Plan
          </motion.button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotas.map((quota, i) => (
          <QuotaItem
            key={quota.id}
            quota={quota}
            index={i}
            showUpgrade={false}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>
    </motion.div>
  );
}

QuotaUsageCard.displayName = 'QuotaUsageCard';
