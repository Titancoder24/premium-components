'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  category?: string;
  color?: string;
}

export interface AgendaListProps {
  events?: AgendaEvent[];
  date?: string;
  className?: string;
}

// ---- Helpers ----

function groupByHour(events: AgendaEvent[]): Record<string, AgendaEvent[]> {
  const groups: Record<string, AgendaEvent[]> = {};
  events.forEach((ev) => {
    const hourKey = ev.time.split(':')[0] || ev.time;
    (groups[hourKey] ||= []).push(ev);
  });
  return groups;
}

function formatHourLabel(hourKey: string): string {
  const h = parseInt(hourKey, 10);
  if (isNaN(h)) return hourKey;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

function formatDateHeading(dateStr?: string): string {
  if (!dateStr) return 'Today';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

// ---- Component ----

export const AgendaList: React.FC<AgendaListProps> = ({
  events = [],
  date,
  className,
}) => {
  const sorted = useMemo(
    () => [...events].sort((a, b) => a.time.localeCompare(b.time)),
    [events],
  );

  const grouped = useMemo(() => groupByHour(sorted), [sorted]);
  const hourKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const dateHeading = formatDateHeading(date);
  let globalIndex = 0;

  return (
    <div
      className={cn(
        'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-4 py-3">
        <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{dateHeading}</h3>
        <span className="ml-auto text-[10px] text-[hsl(var(--muted-foreground))]">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-[hsl(var(--muted-foreground))]">
          <Calendar className="mb-2 h-8 w-8 opacity-40" />
          <p className="text-sm">No events scheduled</p>
        </div>
      )}

      {/* Grouped event list */}
      <div className="divide-y divide-[hsl(var(--border))]">
        {hourKeys.map((hourKey) => {
          const items = grouped[hourKey]!;
          return (
            <div key={hourKey} className="px-4 py-3">
              {/* Hour label */}
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {formatHourLabel(hourKey)}
              </p>

              {/* Events in this hour */}
              <div className="space-y-2">
                {items.map((ev) => {
                  const idx = globalIndex++;
                  return (
                    <motion.div
                      key={ev.id}
                      custom={idx}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[hsl(var(--accent))]"
                    >
                      {/* Color dot */}
                      <Circle
                        className="mt-0.5 h-3 w-3 shrink-0"
                        style={{ color: ev.color || 'hsl(var(--primary))', fill: ev.color || 'hsl(var(--primary))' }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
                          {ev.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {ev.time}
                          </span>
                          <span>{ev.duration}</span>
                          {ev.category && (
                            <span className="rounded-full bg-[hsl(var(--muted))] px-1.5 py-0.5">
                              {ev.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

AgendaList.displayName = 'AgendaList';
