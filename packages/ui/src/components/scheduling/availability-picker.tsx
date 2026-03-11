'use client';

import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface AvailabilitySlot {
  day: number;
  hour: number;
  available: boolean;
}

export interface AvailabilityPickerProps {
  slots: AvailabilitySlot[];
  onToggle?: (day: number, hour: number) => void;
  selectedSlots?: Array<{ day: number; hour: number }>;
  className?: string;
}

// ---- Helpers ----

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DISPLAY_HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM - 7 PM

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function isSelected(
  sel: Array<{ day: number; hour: number }>,
  day: number,
  hour: number,
): boolean {
  return sel.some((s) => s.day === day && s.hour === hour);
}

// ---- Component ----

export const AvailabilityPicker: React.FC<AvailabilityPickerProps> = ({
  slots,
  onToggle,
  selectedSlots = [],
  className,
}) => {
  const slotMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    slots.forEach((s) => {
      m[`${s.day}-${s.hour}`] = s.available;
    });
    return m;
  }, [slots]);

  const handleClick = useCallback(
    (day: number, hour: number) => {
      const key = `${day}-${hour}`;
      if (slotMap[key] === false) return; // unavailable
      onToggle?.(day, hour);
    },
    [slotMap, onToggle],
  );

  const selectedCount = selectedSlots.length;

  return (
    <div className={cn('w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
          Select Availability
        </h3>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">
          {selectedCount} slot{selectedCount !== 1 ? 's' : ''} selected
        </span>
      </div>

      {/* Legend */}
      <div className="mb-3 flex items-center gap-4 text-[10px] text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-[hsl(var(--primary))]" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-[hsl(var(--muted))]" />
          Unavailable
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[56px_repeat(7,1fr)] gap-1">
          {/* Column headers */}
          <div />
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] font-medium text-[hsl(var(--muted-foreground))]"
            >
              {label}
            </div>
          ))}

          {/* Rows */}
          {DISPLAY_HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="flex items-center justify-end pr-1.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                {formatHour(hour)}
              </div>
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const key = `${dayIdx}-${hour}`;
                const available = slotMap[key] !== false;
                const selected = isSelected(selectedSlots, dayIdx, hour);

                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.85 }}
                    animate={selected ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleClick(dayIdx, hour)}
                    disabled={!available}
                    className={cn(
                      'flex h-8 items-center justify-center rounded-md text-xs transition-colors',
                      !available && 'cursor-not-allowed bg-[hsl(var(--muted))]',
                      available && !selected && 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))]',
                      selected && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </motion.button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

AvailabilityPicker.displayName = 'AvailabilityPicker';
