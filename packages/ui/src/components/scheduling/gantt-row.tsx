'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface GanttRowProps {
  task: string;
  startDate: string;
  endDate: string;
  progress?: number;
  color?: string;
  totalSpan: { start: string; end: string };
  className?: string;
}

// ---- Helpers ----

function toMs(dateStr: string): number {
  return new Date(dateStr).getTime();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysBetween(a: string, b: string): number {
  return Math.max(1, Math.round((toMs(b) - toMs(a)) / 86400000));
}

// ---- Component ----

export const GanttRow: React.FC<GanttRowProps> = ({
  task,
  startDate,
  endDate,
  progress = 0,
  color = 'hsl(var(--primary))',
  totalSpan,
  className,
}) => {
  const safeProgress = clamp(progress, 0, 100);
  const isComplete = safeProgress >= 100;

  const { leftPercent, widthPercent } = useMemo(() => {
    const spanStart = toMs(totalSpan.start);
    const spanEnd = toMs(totalSpan.end);
    const spanRange = spanEnd - spanStart;
    if (spanRange <= 0) return { leftPercent: 0, widthPercent: 100 };

    const taskStart = toMs(startDate);
    const taskEnd = toMs(endDate);

    const left = clamp(((taskStart - spanStart) / spanRange) * 100, 0, 100);
    const right = clamp(((taskEnd - spanStart) / spanRange) * 100, 0, 100);
    return { leftPercent: left, widthPercent: Math.max(2, right - left) };
  }, [startDate, endDate, totalSpan]);

  const durationDays = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2.5 shadow-sm',
        className,
      )}
    >
      {/* Drag handle */}
      <GripVertical className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] opacity-40" />

      {/* Task info */}
      <div className="w-36 shrink-0">
        <div className="flex items-center gap-1.5">
          {isComplete && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
          <span className="truncate text-xs font-medium text-[hsl(var(--foreground))]">{task}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
          {formatShortDate(startDate)} - {formatShortDate(endDate)} ({durationDays}d)
        </p>
      </div>

      {/* Bar area */}
      <div className="relative flex-1">
        {/* Background track */}
        <div className="h-7 w-full rounded-md bg-[hsl(var(--muted))]">
          {/* Tick marks */}
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 h-full w-px bg-[hsl(var(--border))] opacity-40"
              style={{ left: `${pct}%` }}
            />
          ))}

          {/* Task bar */}
          <motion.div
            className="absolute top-0.5 h-6 rounded-md"
            style={{ left: `${leftPercent}%`, backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${widthPercent}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Progress fill overlay */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-md opacity-30"
              style={{ backgroundColor: '#000' }}
              initial={{ width: 0 }}
              animate={{ width: `${100 - safeProgress}%` }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            />
            {/* Progress text */}
            {widthPercent > 8 && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                {safeProgress}%
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress badge */}
      <div
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
          isComplete
            ? 'bg-emerald-500/10 text-emerald-600'
            : safeProgress > 0
              ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
        )}
      >
        {isComplete ? 'Done' : `${safeProgress}%`}
      </div>
    </div>
  );
};

GanttRow.displayName = 'GanttRow';
