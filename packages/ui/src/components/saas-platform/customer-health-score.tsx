'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Activity,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HealthFactor {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  weight?: number;
}

export interface CustomerHealthScoreProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  factors: HealthFactor[];
  sparklineData?: number[];
  lastUpdated?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHealthColor(score: number): {
  ring: string;
  text: string;
  bg: string;
  label: string;
} {
  if (score >= 70)
    return {
      ring: 'stroke-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
      label: 'Healthy',
    };
  if (score >= 40)
    return {
      ring: 'stroke-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      label: 'At Risk',
    };
  return {
    ring: 'stroke-red-500',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500',
    label: 'Churning',
  };
}

function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Animated Score Counter
// ---------------------------------------------------------------------------

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const startVal = 0;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

// ---------------------------------------------------------------------------
// Health Ring
// ---------------------------------------------------------------------------

function HealthRing({ score }: { score: number }) {
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = getHealthColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
          className={colors.ring}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (score / 100) * circumference,
          }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-4xl font-bold tabular-nums', colors.text)}>
          <AnimatedScore value={score} />
        </span>
        <span className="text-xs font-medium text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 200;
  const height = 40;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.polyline
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
        points={points.join(' ')}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
    </motion.svg>
  );
}

// ---------------------------------------------------------------------------
// Trend Badge
// ---------------------------------------------------------------------------

function TrendBadge({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  const config = {
    up: {
      icon: TrendingUp,
      label: 'Improving',
      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    down: {
      icon: TrendingDown,
      label: 'Declining',
      cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    },
    stable: {
      icon: Minus,
      label: 'Stable',
      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
  };
  const { icon: Icon, label, cls } = config[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', cls)}
    >
      <motion.div
        animate={trend !== 'stable' ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="h-3.5 w-3.5" />
      </motion.div>
      {label}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Factor Row
// ---------------------------------------------------------------------------

function FactorRow({ factor, index }: { factor: HealthFactor; index: number }) {
  const pct = factor.maxScore > 0 ? (factor.score / factor.maxScore) * 100 : 0;
  const colors = getHealthColor(pct);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{factor.label}</span>
        <span className={cn('text-sm font-semibold tabular-nums', colors.text)}>
          {factor.score}/{factor.maxScore}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn('h-full rounded-full', colors.bg)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.08, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CustomerHealthScore({
  score,
  trend,
  factors,
  sparklineData,
  lastUpdated,
  className,
}: CustomerHealthScoreProps) {
  const colors = getHealthColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full rounded-xl border border-border bg-card p-6 shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Health Score</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', colors.text, `${colors.bg}/10`)}>
            {colors.label}
          </span>
          <TrendBadge trend={trend} />
        </div>
      </div>

      {/* Score ring & sparkline */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
        <HealthRing score={score} />
        <div className="flex flex-1 flex-col gap-4">
          {/* Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Trend (last 30 days)</p>
              <Sparkline data={sparklineData} color={colors.ring} />
            </div>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Clock className="h-3 w-3" />
              Updated {formatRelativeTime(lastUpdated)}
            </motion.div>
          )}
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Breakdown</h3>
        {factors.map((factor, i) => (
          <FactorRow key={factor.id} factor={factor} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

CustomerHealthScore.displayName = 'CustomerHealthScore';
