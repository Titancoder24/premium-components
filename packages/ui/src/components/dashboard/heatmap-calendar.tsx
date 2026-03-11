'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeatmapDataItem {
  date: string;
  value: number;
}

export interface HeatmapCalendarProps {
  data: HeatmapDataItem[];
  colorScale?: string[];
  startDate?: string;
  endDate?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CELL_SIZE = 14;
const CELL_GAP = 3;

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getColor(
  value: number,
  max: number,
  scale: string[],
): string {
  if (value === 0 || max === 0) return scale[0];
  const idx = Math.min(
    Math.floor((value / max) * (scale.length - 1)) + 1,
    scale.length - 1,
  );
  return scale[idx];
}

// ---------------------------------------------------------------------------
// HeatmapCalendar
// ---------------------------------------------------------------------------

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  colorScale = [
    'hsl(var(--muted))',
    'hsl(142 40% 70%)',
    'hsl(142 50% 55%)',
    'hsl(142 60% 40%)',
    'hsl(142 70% 28%)',
  ],
  startDate,
  endDate,
  className,
}) => {
  // Build lookup map
  const valueMap = React.useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(d.date, d.value));
    return map;
  }, [data]);

  // Determine date range
  const { start, end, maxValue } = React.useMemo(() => {
    const today = new Date();
    const e = endDate ? parseDate(endDate) : today;
    const s = startDate ? parseDate(startDate) : addDays(e, -364);
    const max = data.reduce((acc, d) => Math.max(acc, d.value), 0);
    return { start: getMonday(s), end: e, maxValue: max };
  }, [data, startDate, endDate]);

  // Generate weeks
  const weeks = React.useMemo(() => {
    const result: { date: Date; key: string; value: number }[][] = [];
    let current = new Date(start);
    let week: { date: Date; key: string; value: number }[] = [];

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday=0

      if (idx === 0 && week.length > 0) {
        result.push(week);
        week = [];
      }

      const key = formatDateKey(current);
      week.push({ date: new Date(current), key, value: valueMap.get(key) ?? 0 });
      current = addDays(current, 1);
    }

    if (week.length > 0) result.push(week);
    return result;
  }, [start, end, valueMap]);

  // Month labels
  const monthLabels = React.useMemo(() => {
    const labels: { label: string; weekIdx: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: firstDay.date.toLocaleString('en-US', { month: 'short' }),
          weekIdx,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const totalWidth = weeks.length * (CELL_SIZE + CELL_GAP) + 30;
  const totalHeight = 7 * (CELL_SIZE + CELL_GAP) + 24;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'overflow-x-auto rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      <svg width={totalWidth} height={totalHeight} className="block">
        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={30 + m.weekIdx * (CELL_SIZE + CELL_GAP)}
            y={10}
            className="fill-muted-foreground"
            fontSize={10}
          >
            {m.label}
          </text>
        ))}

        {/* Day-of-week labels */}
        {DAY_LABELS.map((label, i) => (
          <text
            key={i}
            x={0}
            y={24 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 2}
            className="fill-muted-foreground"
            fontSize={9}
          >
            {label}
          </text>
        ))}

        {/* Cells */}
        {weeks.map((week, weekIdx) =>
          week.map((day) => {
            const dayOfWeek = day.date.getDay();
            const rowIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const x = 30 + weekIdx * (CELL_SIZE + CELL_GAP);
            const y = 18 + rowIdx * (CELL_SIZE + CELL_GAP);

            return (
              <motion.rect
                key={day.key}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                fill={getColor(day.value, maxValue, colorScale)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: weekIdx * 0.005 }}
              >
                <title>
                  {day.key}: {day.value}
                </title>
              </motion.rect>
            );
          }),
        )}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {colorScale.map((color, i) => (
          <span
            key={i}
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
};

HeatmapCalendar.displayName = 'HeatmapCalendar';
