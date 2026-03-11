'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface WeekEvent {
  day: number;
  startHour: number;
  endHour: number;
  title: string;
  color: string;
}

export interface WeekPlannerProps {
  weekStart: string;
  events?: WeekEvent[];
  onSlotClick?: (day: number, hour: number) => void;
  className?: string;
}

// ---- Helpers ----

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function addDays(dateStr: string, n: number): Date {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d;
}

function shortDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ---- Component ----

export const WeekPlanner: React.FC<WeekPlannerProps> = ({
  weekStart,
  events = [],
  onSlotClick,
  className,
}) => {
  const dayDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const eventsByDayHour = useMemo(() => {
    const map: Record<string, WeekEvent[]> = {};
    events.forEach((e) => {
      for (let h = e.startHour; h < e.endHour; h++) {
        const key = `${e.day}-${h}`;
        (map[key] ||= []).push(e);
      }
    });
    return map;
  }, [events]);

  const spanningEvents = useMemo(() => {
    return events.map((e) => ({
      ...e,
      span: e.endHour - e.startHour,
    }));
  }, [events]);

  return (
    <div className={cn('w-full overflow-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm', className)}>
      {/* Header row */}
      <div className="sticky top-0 z-10 grid grid-cols-[60px_repeat(7,1fr)] border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-center justify-center p-2">
          <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        {dayDates.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="flex flex-col items-center border-l border-[hsl(var(--border))] py-2"
          >
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{DAY_LABELS[i]}</span>
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{shortDate(d)}</span>
          </motion.div>
        ))}
      </div>

      {/* Time grid */}
      <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
        {HOURS.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour label */}
            <div className="flex h-12 items-start justify-end border-t border-[hsl(var(--border))] pr-2 pt-0.5">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{formatHour(hour)}</span>
            </div>

            {/* Day cells */}
            {Array.from({ length: 7 }, (_, dayIdx) => {
              const key = `${dayIdx}-${hour}`;
              const cellEvents = eventsByDayHour[key] || [];

              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (dayIdx + hour) * 0.005, duration: 0.2 }}
                  onClick={() => onSlotClick?.(dayIdx, hour)}
                  className={cn(
                    'relative h-12 border-l border-t border-[hsl(var(--border))] transition-colors',
                    'hover:bg-[hsl(var(--accent))]',
                    cellEvents.length > 0 && 'bg-[hsl(var(--accent))]/30',
                  )}
                >
                  {/* Show event block only at start hour */}
                  {spanningEvents
                    .filter((e) => e.day === dayIdx && e.startHour === hour)
                    .map((e, i) => (
                      <div
                        key={i}
                        className="absolute inset-x-0.5 z-[5] overflow-hidden rounded-md px-1 py-0.5 text-left text-[10px] font-medium text-white"
                        style={{
                          backgroundColor: e.color,
                          top: 0,
                          height: `${e.span * 48}px`,
                        }}
                      >
                        {e.title}
                      </div>
                    ))}
                </motion.button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

WeekPlanner.displayName = 'WeekPlanner';
