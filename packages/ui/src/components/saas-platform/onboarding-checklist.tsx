'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  X,
  SkipForward,
  PartyPopper,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnboardingStep {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  completed?: boolean;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: (stepId: string) => void;
  onDismiss?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Confetti Particle
// ---------------------------------------------------------------------------

function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
  const color = colors[index % colors.length];
  const xEnd = (Math.random() - 0.5) * 300;
  const yEnd = -(Math.random() * 200 + 100);
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-0 h-2 w-2 rounded-sm"
      style={{ backgroundColor: color }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: xEnd,
        y: [0, yEnd, yEnd + 200],
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.5],
        rotate: rotation,
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    />
  );
}

// ---------------------------------------------------------------------------
// Animated Counter
// ---------------------------------------------------------------------------

function AnimatedPercentage({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 600;
    const start = display;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(start + (value - start) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}%</span>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OnboardingChecklist({
  steps,
  onComplete,
  onSkip,
  onDismiss,
  className,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [celebrating, setCelebrating] = React.useState(false);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = completedCount === totalCount && totalCount > 0;

  React.useEffect(() => {
    if (allComplete && !celebrating) {
      setCelebrating(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [allComplete, celebrating, onComplete]);

  // Auto-expand first incomplete step
  React.useEffect(() => {
    if (!expandedId) {
      const firstIncomplete = steps.find((s) => !s.completed);
      if (firstIncomplete) setExpandedId(firstIncomplete.id);
    }
  }, [steps, expandedId]);

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'relative overflow-hidden rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900',
            className,
          )}
        >
          {/* Confetti */}
          {celebrating && (
            <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
              {Array.from({ length: 24 }).map((_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </div>
          )}

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {celebrating && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <PartyPopper className="h-5 w-5 text-amber-500" />
                </motion.div>
              )}
              <h3 className="text-sm font-semibold text-[var(--color-foreground,#111827)] dark:text-gray-100">
                {celebrating ? 'All done!' : 'Getting Started'}
              </h3>
              <span className="text-xs text-[var(--color-muted-foreground,#6b7280)] dark:text-gray-400">
                {completedCount}/{totalCount}
              </span>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)] dark:hover:bg-gray-800"
                aria-label="Dismiss checklist"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-[var(--color-foreground,#111827)] dark:text-gray-200">
                Progress
              </span>
              <span className="font-medium text-[var(--color-primary,#3b82f6)]">
                <AnimatedPercentage value={percentage} />
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted,#f3f4f6)] dark:bg-gray-800">
              <motion.div
                className="h-full rounded-full bg-[var(--color-primary,#3b82f6)]"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isCurrent = !step.completed && expandedId === step.id;
              const isExpanded = expandedId === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={cn(
                    'rounded-lg border transition-colors',
                    step.completed
                      ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30'
                      : isCurrent
                        ? 'border-[var(--color-primary,#3b82f6)] bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30'
                        : 'border-[var(--color-border,#e5e7eb)] bg-transparent dark:border-gray-700',
                  )}
                >
                  {/* Step header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : step.id)}
                    className="flex w-full items-center gap-3 p-3 text-left"
                  >
                    {/* Status icon */}
                    <div className="relative flex-shrink-0">
                      <AnimatePresence mode="wait">
                        {step.completed ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-medium',
                              isCurrent
                                ? 'border-[var(--color-primary,#3b82f6)] text-[var(--color-primary,#3b82f6)]'
                                : 'border-[var(--color-border,#e5e7eb)] text-[var(--color-muted-foreground,#6b7280)] dark:border-gray-600 dark:text-gray-500',
                            )}
                          >
                            {step.icon || index + 1}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isCurrent && (
                        <motion.div
                          className="absolute -inset-1 rounded-full border-2 border-[var(--color-primary,#3b82f6)]"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Title */}
                    <span
                      className={cn(
                        'flex-1 text-sm font-medium',
                        step.completed
                          ? 'text-green-700 line-through dark:text-green-400'
                          : 'text-[var(--color-foreground,#111827)] dark:text-gray-100',
                      )}
                    >
                      {step.title}
                    </span>

                    {!step.completed && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground,#6b7280)]" />
                      </motion.div>
                    )}
                  </button>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {isExpanded && !step.completed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pl-12">
                          <p className="mb-3 text-xs text-[var(--color-muted-foreground,#6b7280)] dark:text-gray-400">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {step.actionLabel && step.onAction && (
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={step.onAction}
                                className="rounded-md bg-[var(--color-primary,#3b82f6)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                              >
                                {step.actionLabel}
                              </motion.button>
                            )}
                            {onSkip && (
                              <button
                                type="button"
                                onClick={() => onSkip(step.id)}
                                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-[var(--color-muted-foreground,#6b7280)] transition-colors hover:bg-[var(--color-muted,#f3f4f6)] dark:hover:bg-gray-800"
                              >
                                <SkipForward className="h-3 w-3" />
                                Skip
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

OnboardingChecklist.displayName = 'OnboardingChecklist';
