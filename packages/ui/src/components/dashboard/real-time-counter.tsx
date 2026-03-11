'use client';

import * as React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RealTimeCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  animationDuration?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedDigits – renders the current number with a spring transition
// ---------------------------------------------------------------------------

function AnimatedValue({
  value,
  duration,
  prefix,
  suffix,
}: {
  value: number;
  duration: number;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20,
    duration: duration / 1000,
  });

  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  React.useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums">
      {prefix && (
        <span className="text-muted-foreground">{prefix}</span>
      )}
      <motion.span>{display}</motion.span>
      {suffix && (
        <span className="text-lg text-muted-foreground">{suffix}</span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// RealTimeCounter
// ---------------------------------------------------------------------------

export const RealTimeCounter: React.FC<RealTimeCounterProps> = ({
  value,
  label,
  prefix,
  suffix,
  animationDuration = 600,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card p-6 text-center',
        className,
      )}
    >
      <div className="text-3xl font-bold tracking-tight text-foreground">
        <AnimatedValue
          value={value}
          duration={animationDuration}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
};

RealTimeCounter.displayName = 'RealTimeCounter';
