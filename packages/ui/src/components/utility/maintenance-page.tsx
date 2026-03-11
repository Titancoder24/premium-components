'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Mail, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MaintenancePageProps {
  /** Main heading. */
  title: string;
  /** Descriptive paragraph. */
  description: string;
  /** ISO date string for when the site comes back. */
  launchDate?: string;
  /** Called when a user signs up for email notification. */
  onEmailSignup?: (email: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Countdown helpers
// ---------------------------------------------------------------------------

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// ---------------------------------------------------------------------------
// FlipDigit sub-component
// ---------------------------------------------------------------------------

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-3 py-2 sm:px-4 sm:py-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -24, opacity: 0, rotateX: -45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 24, opacity: 0, rotateX: 45 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="block text-2xl font-bold tabular-nums text-[var(--color-text-primary)] sm:text-4xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MaintenancePage({
  title,
  description,
  launchDate,
  onEmailSignup,
  className,
}: MaintenancePageProps) {
  const targetDate = React.useMemo(
    () => (launchDate ? new Date(launchDate) : null),
    [launchDate],
  );

  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(() =>
    targetDate ? calcTimeLeft(targetDate) : null,
  );

  const [email, setEmail] = React.useState('');
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);

  // Countdown tick
  React.useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onEmailSignup?.(email);
    setEmailSubmitted(true);
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16',
        className,
      )}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{
          background: [
            'linear-gradient(135deg, var(--color-accent) 0%, transparent 50%, var(--color-accent) 100%)',
            'linear-gradient(225deg, var(--color-accent) 0%, transparent 50%, var(--color-accent) 100%)',
            'linear-gradient(315deg, var(--color-accent) 0%, transparent 50%, var(--color-accent) 100%)',
            'linear-gradient(135deg, var(--color-accent) 0%, transparent 50%, var(--color-accent) 100%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-sm"
      >
        <Wrench className="h-8 w-8 text-[var(--color-text-tertiary)]" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-4 max-w-md text-center text-[var(--color-text-secondary)]"
      >
        {description}
      </motion.p>

      {/* Countdown */}
      {timeLeft && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex items-center gap-3 sm:gap-5"
        >
          <FlipDigit value={timeLeft.days} label="Days" />
          <span className="text-2xl font-bold text-[var(--color-text-tertiary)] sm:text-3xl">:</span>
          <FlipDigit value={timeLeft.hours} label="Hours" />
          <span className="text-2xl font-bold text-[var(--color-text-tertiary)] sm:text-3xl">:</span>
          <FlipDigit value={timeLeft.minutes} label="Minutes" />
          <span className="text-2xl font-bold text-[var(--color-text-tertiary)] sm:text-3xl">:</span>
          <FlipDigit value={timeLeft.seconds} label="Seconds" />
        </motion.div>
      )}

      {/* Email signup */}
      {onEmailSignup && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {emailSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </motion.div>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  We&apos;ll notify you when we&apos;re back!
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={handleEmailSubmit}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={cn(
                      'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
                      'py-2.5 pl-10 pr-3 text-sm text-[var(--color-text-primary)]',
                      'placeholder:text-[var(--color-text-tertiary)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40',
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    'shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium',
                    'bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity',
                  )}
                >
                  Notify Me
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

MaintenancePage.displayName = 'MaintenancePage';
