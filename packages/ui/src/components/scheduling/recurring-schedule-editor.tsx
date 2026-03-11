'use client';

import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrencePattern {
  frequency: RecurrenceFrequency;
  interval: number;
  days?: number[];
  endDate?: string;
}

export interface RecurringScheduleEditorProps {
  pattern: RecurrencePattern;
  onChange?: (pattern: RecurrencePattern) => void;
  className?: string;
}

// ---- Helpers ----

const FREQUENCIES: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildSummary(p: RecurrencePattern): string {
  const freq = p.frequency;
  const interval = p.interval;
  if (freq === 'daily') {
    return interval === 1 ? 'Every day' : `Every ${interval} days`;
  }
  if (freq === 'weekly') {
    const dayNames = (p.days || []).map((d) => DAY_LABELS[d]).join(', ');
    const base = interval === 1 ? 'Every week' : `Every ${interval} weeks`;
    return dayNames ? `${base} on ${dayNames}` : base;
  }
  return interval === 1 ? 'Every month' : `Every ${interval} months`;
}

const sectionVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: 'auto', marginTop: 12 },
};

// ---- Component ----

export const RecurringScheduleEditor: React.FC<RecurringScheduleEditorProps> = ({
  pattern,
  onChange,
  className,
}) => {
  const update = useCallback(
    (partial: Partial<RecurrencePattern>) => {
      onChange?.({ ...pattern, ...partial });
    },
    [pattern, onChange],
  );

  const toggleDay = useCallback(
    (day: number) => {
      const current = new Set(pattern.days || []);
      if (current.has(day)) {
        current.delete(day);
      } else {
        current.add(day);
      }
      update({ days: Array.from(current).sort() });
    },
    [pattern.days, update],
  );

  const summary = useMemo(() => buildSummary(pattern), [pattern]);

  return (
    <div
      className={cn(
        'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm',
        className,
      )}
    >
      {/* Title */}
      <div className="mb-4 flex items-center gap-2">
        <Repeat className="h-4 w-4 text-[hsl(var(--primary))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Recurring Schedule</h3>
      </div>

      {/* Frequency selector */}
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        Frequency
      </label>
      <div className="flex gap-1.5">
        {FREQUENCIES.map((f) => (
          <button
            key={f.value}
            onClick={() => update({ frequency: f.value })}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              pattern.frequency === f.value
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Interval */}
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        className="mt-3"
      >
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Repeat every
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={99}
            value={pattern.interval}
            onChange={(e) => update({ interval: Math.max(1, parseInt(e.target.value, 10) || 1) })}
            className="w-16 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-2 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {pattern.frequency === 'daily' ? 'day(s)' : pattern.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
          </span>
        </div>
      </motion.div>

      {/* Day checkboxes (weekly only) */}
      <AnimatePresence>
        {pattern.frequency === 'weekly' && (
          <motion.div
            key="days"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              On days
            </label>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, idx) => {
                const isActive = (pattern.days || []).includes(idx);
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleDay(idx)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-medium transition-colors',
                      isActive
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]',
                    )}
                  >
                    {label.charAt(0)}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End date */}
      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          End date (optional)
        </label>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
          <input
            type="date"
            value={pattern.endDate || ''}
            onChange={(e) => update({ endDate: e.target.value || undefined })}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-2 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-lg bg-[hsl(var(--muted))] px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Summary</p>
        <p className="mt-0.5 text-xs font-medium text-[hsl(var(--foreground))]">{summary}</p>
      </div>
    </div>
  );
};

RecurringScheduleEditor.displayName = 'RecurringScheduleEditor';
