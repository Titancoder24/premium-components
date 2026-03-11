'use client';

import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface CalendarEvent {
  date: string;
  title: string;
  color: string;
}

export interface MonthCalendarProps {
  year: number;
  month: number;
  events?: CalendarEvent[];
  onDateSelect?: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
}

// ---- Helpers ----

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ---- Component ----

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  month,
  events = [],
  onDateSelect,
  onMonthChange,
  className,
}) => {
  const today = useMemo(() => {
    const d = new Date();
    return formatDate(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      (map[e.date] ||= []).push(e);
    });
    return map;
  }, [events]);

  const handlePrev = useCallback(() => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    onMonthChange?.(y, m);
  }, [year, month, onMonthChange]);

  const handleNext = useCallback(() => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    onMonthChange?.(y, m);
  }, [year, month, onMonthChange]);

  const cells: (number | null)[] = useMemo(() => {
    const arr: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [firstDay, daysInMonth]);

  return (
    <div className={cn('w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={handleNext}
          className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-[hsl(var(--muted-foreground))]">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="grid grid-cols-7 gap-px"
        >
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }
            const dateStr = formatDate(year, month, day);
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect?.(dateStr)}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-start rounded-lg p-1 text-sm transition-colors',
                  'hover:bg-[hsl(var(--accent))]',
                  isToday && 'font-bold text-[hsl(var(--primary))]',
                  !isToday && 'text-[hsl(var(--foreground))]',
                )}
              >
                <span className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  isToday && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                )}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: ev.color }}
                        title={ev.title}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

MonthCalendar.displayName = 'MonthCalendar';
