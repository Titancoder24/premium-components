'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, User, CalendarCheck, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface BookingConfirmationProps {
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  host?: string;
  status?: BookingStatus;
  className?: string;
}

// ---- Helpers ----

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  confirmed: {
    label: 'Confirmed',
    icon: Check,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/30',
  },
  pending: {
    label: 'Pending',
    icon: AlertCircle,
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/30',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    border: 'border-red-500/30',
  },
};

// ---- Component ----

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  title,
  date,
  time,
  duration,
  location,
  host,
  status = 'confirmed',
  className,
}) => {
  const config = useMemo(() => STATUS_CONFIG[status], [status]);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm overflow-hidden',
        className,
      )}
    >
      {/* Status header */}
      <div className={cn('flex items-center gap-2 px-4 py-2.5', config.bg)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
        >
          <StatusIcon className={cn('h-4 w-4', config.text)} />
        </motion.div>
        <span className={cn('text-xs font-semibold', config.text)}>{config.label}</span>
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-4 space-y-3">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] leading-tight">
          {title}
        </h3>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--muted))] px-2.5 py-2">
            <CalendarCheck className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            <div>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Date</p>
              <p className="text-xs font-medium text-[hsl(var(--foreground))]">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--muted))] px-2.5 py-2">
            <Clock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            <div>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Time</p>
              <p className="text-xs font-medium text-[hsl(var(--foreground))]">{time}</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <Clock className="h-3.5 w-3.5" />
          <span>Duration: {duration}</span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
        )}

        {/* Host */}
        {host && (
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <User className="h-3.5 w-3.5" />
            <span>Host: {host}</span>
          </div>
        )}

        {/* Checkmark success animation for confirmed */}
        {status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center justify-center pt-2"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10"
            >
              <Check className="h-5 w-5 text-emerald-600" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

BookingConfirmation.displayName = 'BookingConfirmation';
