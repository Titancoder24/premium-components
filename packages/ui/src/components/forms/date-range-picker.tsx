"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangePickerProps {
  /** Current date range value */
  value: DateRange;
  /** Callback fired when date range changes */
  onChange: (range: DateRange) => void;
  /** Preset date ranges */
  presets?: DateRangePreset[];
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class names */
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = day.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Pad start
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, -firstDay.getDay() + i + 1);
    days.push(d);
  }

  // Days of month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Pad end
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function DateRangePicker({
  value,
  onChange,
  presets = [],
  minDate,
  maxDate,
  placeholder = "Select date range",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    () => value.start ?? new Date()
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const navigateMonth = useCallback(
    (delta: number) => {
      setDirection(delta);
      setCurrentMonth(new Date(year, month + delta, 1));
    },
    [year, month]
  );

  const isDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      if (isDisabled(date)) return;

      if (selecting === "start") {
        onChange({ start: date, end: null });
        setSelecting("end");
      } else {
        if (value.start && date < value.start) {
          onChange({ start: date, end: value.start });
        } else {
          onChange({ start: value.start, end: date });
        }
        setSelecting("start");
      }
    },
    [selecting, value.start, onChange, isDisabled]
  );

  const displayRange = useMemo(() => {
    if (value.start && value.end) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`;
    }
    if (value.start) {
      return formatDate(value.start);
    }
    return "";
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 min-w-[260px] items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm",
          "outline-none transition-all duration-200",
          "hover:border-primary/50",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          displayRange ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {displayRange || placeholder}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-border bg-card p-4 shadow-lg"
          >
            <div className="flex gap-4">
              {/* Presets */}
              {presets.length > 0 && (
                <div className="border-r border-border pr-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Presets
                  </p>
                  <div className="space-y-1">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          onChange(preset.range);
                          setSelecting("start");
                        }}
                        className={cn(
                          "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                          "hover:bg-accent text-foreground"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="w-[280px]">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="rounded-md p-1 hover:bg-accent transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-foreground" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    {MONTHS[month]} {year}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="rounded-md p-1 hover:bg-accent transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-foreground" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-0">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {d}
                    </div>
                  ))}

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={`${year}-${month}`}
                      custom={direction}
                      initial={{ x: direction * 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction * -40, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="col-span-7 grid grid-cols-7 gap-0"
                    >
                      {days.map((day, i) => {
                        const isCurrentMonth = day.getMonth() === month;
                        const disabled = isDisabled(day);
                        const isStart =
                          value.start && isSameDay(day, value.start);
                        const isEnd =
                          value.end && isSameDay(day, value.end);
                        const inRange = isInRange(
                          day,
                          value.start,
                          selecting === "end" && hoverDate
                            ? hoverDate
                            : value.end
                        );
                        const isToday = isSameDay(day, new Date());

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDayClick(day)}
                            onMouseEnter={() => setHoverDate(day)}
                            onMouseLeave={() => setHoverDate(null)}
                            className={cn(
                              "relative flex h-8 w-full items-center justify-center text-xs transition-colors duration-100",
                              !isCurrentMonth && "text-muted-foreground/40",
                              isCurrentMonth &&
                                !isStart &&
                                !isEnd &&
                                "text-foreground",
                              disabled && "opacity-30 cursor-not-allowed",
                              inRange && !isStart && !isEnd && "bg-primary/10",
                              isToday &&
                                !isStart &&
                                !isEnd &&
                                "font-bold",
                              (isStart || isEnd) &&
                                "bg-primary text-primary-foreground rounded-md font-semibold",
                              !disabled &&
                                !isStart &&
                                !isEnd &&
                                "hover:bg-accent rounded-md"
                            )}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
