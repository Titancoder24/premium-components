'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface Attendee {
  name: string;
  avatar?: string;
}

export interface EventCardProps {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: Attendee[];
  color?: string;
  className?: string;
}

// ---- Helpers ----

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function timeDiff(start: string, end: string): string {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const mins = Math.round((e - s) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ---- Component ----

export const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  startTime,
  endTime,
  location,
  attendees = [],
  color = 'hsl(var(--primary))',
  className,
}) => {
  const duration = timeDiff(startTime, endTime);
  const visibleAttendees = attendees.slice(0, 5);
  const overflow = attendees.length - visibleAttendees.length;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm',
        className,
      )}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: color }}
      />

      {/* Title */}
      <h3 className="ml-2 text-sm font-semibold text-[hsl(var(--foreground))]">{title}</h3>

      {description && (
        <p className="ml-2 mt-1 text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
          {description}
        </p>
      )}

      {/* Time */}
      <div className="ml-2 mt-3 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {formatTime(startTime)} &ndash; {formatTime(endTime)}
        </span>
        <span className="ml-1 rounded-full bg-[hsl(var(--accent))] px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--accent-foreground))]">
          {duration}
        </span>
      </div>

      {/* Location */}
      {location && (
        <div className="ml-2 mt-2 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>
      )}

      {/* Attendees */}
      {attendees.length > 0 && (
        <div className="ml-2 mt-3 flex items-center gap-1">
          <Users className="mr-1 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
          <div className="flex -space-x-2">
            {visibleAttendees.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-[hsl(var(--card))]"
                title={a.name}
              >
                {a.avatar ? (
                  <img src={a.avatar} alt={a.name} className="h-full w-full object-cover" />
                ) : (
                  <span
                    className="flex h-full w-full items-center justify-center text-[9px] font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {getInitials(a.name)}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          {overflow > 0 && (
            <span className="ml-1 text-[10px] text-[hsl(var(--muted-foreground))]">
              +{overflow}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

EventCard.displayName = 'EventCard';
