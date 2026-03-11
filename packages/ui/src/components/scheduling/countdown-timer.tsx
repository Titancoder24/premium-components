'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---- Types ----

export interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
  label?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ---- Helpers ----

function calcTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// ---- Flip digit component ----

const FlipDigit: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative flex h-16 w-14 items-center justify-center overflow-hidden rounded-lg bg-[hsl(var(--secondary))] shadow-inner">
      {/* Divider line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-[hsl(var(--border))] opacity-40" />

      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="text-2xl font-bold tabular-nums text-[hsl(var(--foreground))]"
          style={{ perspective: 200 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
      {label}
    </span>
  </div>
);

// ---- Separator ----

const Separator: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-1.5 pb-5">
    <span className="block h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted-foreground))]" />
    <span className="block h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted-foreground))]" />
  </div>
);

// ---- Component ----

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  label,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));
  const completedRef = useRef(false);

  const tick = useCallback(() => {
    const tl = calcTimeLeft(targetDate);
    setTimeLeft(tl);
    if (
      !completedRef.current &&
      tl.days === 0 &&
      tl.hours === 0 &&
      tl.minutes === 0 &&
      tl.seconds === 0
    ) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [targetDate, onComplete]);

  useEffect(() => {
    completedRef.current = false;
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const isComplete =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'inline-flex flex-col items-center gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-5 shadow-sm',
        className,
      )}
    >
      {label && (
        <div className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--foreground))]">
          <Timer className="h-4 w-4 text-[hsl(var(--primary))]" />
          {label}
        </div>
      )}

      {isComplete ? (
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-semibold text-[hsl(var(--primary))]"
        >
          Time&apos;s up!
        </motion.p>
      ) : (
        <div className="flex items-center gap-2">
          <FlipDigit value={pad(timeLeft.days)} label="Days" />
          <Separator />
          <FlipDigit value={pad(timeLeft.hours)} label="Hours" />
          <Separator />
          <FlipDigit value={pad(timeLeft.minutes)} label="Min" />
          <Separator />
          <FlipDigit value={pad(timeLeft.seconds)} label="Sec" />
        </div>
      )}
    </motion.div>
  );
};

CountdownTimer.displayName = 'CountdownTimer';
