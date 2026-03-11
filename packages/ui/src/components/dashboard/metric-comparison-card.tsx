'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonMetric {
  label: string;
  value: number;
  color: string;
}

export interface MetricComparisonCardProps {
  metricA: ComparisonMetric;
  metricB: ComparisonMetric;
  comparisonType?: 'bar' | 'ring' | 'delta';
  className?: string;
}

// ---------------------------------------------------------------------------
// Sub-visualisations
// ---------------------------------------------------------------------------

function BarComparison({ metricA, metricB }: { metricA: ComparisonMetric; metricB: ComparisonMetric }) {
  const total = metricA.value + metricB.value || 1;
  const pctA = (metricA.value / total) * 100;
  const pctB = (metricB.value / total) * 100;

  return (
    <div className="space-y-3">
      {[
        { metric: metricA, pct: pctA },
        { metric: metricB, pct: pctB },
      ].map(({ metric, pct }, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-semibold text-foreground">
              {metric.value.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: metric.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RingComparison({ metricA, metricB }: { metricA: ComparisonMetric; metricB: ComparisonMetric }) {
  const total = metricA.value + metricB.value || 1;
  const pctA = metricA.value / total;
  const r = 40;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center justify-center gap-6">
      <svg width={100} height={100} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke={metricB.color} strokeWidth="10" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={metricA.color}
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pctA) }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="space-y-2 text-sm">
        {[metricA, metricB].map((m, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-semibold text-foreground">{m.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeltaComparison({ metricA, metricB }: { metricA: ComparisonMetric; metricB: ComparisonMetric }) {
  const diff = metricA.value - metricB.value;
  const pctDiff = metricB.value !== 0 ? (diff / metricB.value) * 100 : 0;
  const isPositive = diff >= 0;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex items-baseline gap-4">
        <div>
          <div className="text-2xl font-bold" style={{ color: metricA.color }}>
            {metricA.value.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{metricA.label}</div>
        </div>
        <span className="text-lg text-muted-foreground">vs</span>
        <div>
          <div className="text-2xl font-bold" style={{ color: metricB.color }}>
            {metricB.value.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{metricB.label}</div>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={cn(
          'rounded-full px-3 py-1 text-sm font-semibold',
          isPositive
            ? 'bg-emerald-500/10 text-emerald-600'
            : 'bg-rose-500/10 text-rose-600',
        )}
      >
        {isPositive ? '+' : ''}
        {diff.toLocaleString()} ({pctDiff.toFixed(1)}%)
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MetricComparisonCard
// ---------------------------------------------------------------------------

export const MetricComparisonCard: React.FC<MetricComparisonCardProps> = ({
  metricA,
  metricB,
  comparisonType = 'bar',
  className,
}) => {
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
      {comparisonType === 'bar' && <BarComparison metricA={metricA} metricB={metricB} />}
      {comparisonType === 'ring' && <RingComparison metricA={metricA} metricB={metricB} />}
      {comparisonType === 'delta' && <DeltaComparison metricA={metricA} metricB={metricB} />}
    </motion.div>
  );
};

MetricComparisonCard.displayName = 'MetricComparisonCard';
