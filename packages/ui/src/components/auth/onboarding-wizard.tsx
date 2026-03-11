'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OnboardingStep {
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Optional illustration rendered above the content */
  illustration?: React.ReactNode;
  /** Main step content */
  content: React.ReactNode;
}

export interface OnboardingWizardProps {
  /** Array of onboarding steps */
  steps: OnboardingStep[];
  /** Callback fired when all steps are completed */
  onComplete: () => void;
  /** Optional per-step skip callback; receives current step index */
  onSkip?: (stepIndex: number) => void;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Slide variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OnboardingWizard({
  steps,
  onComplete,
  onSkip,
  className,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [completed, setCompleted] = React.useState(false);

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep]!;

  const goNext = () => {
    if (isLastStep) {
      setCompleted(true);
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSkip = () => {
    onSkip?.(currentStep);
    goNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-lg',
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {completed ? (
          /* Celebration */
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="flex flex-col items-center gap-4 p-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.6,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
            >
              <CheckCircle2 className="h-20 w-20 text-[var(--color-success,#22c55e)]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-foreground"
            >
              You&apos;re all set!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              Your setup is complete. Let&apos;s get started.
            </motion.p>
          </motion.div>
        ) : (
          /* Step content */
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="p-8"
          >
            {/* Illustration */}
            {step.illustration && (
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="mb-6 flex justify-center"
              >
                {step.illustration}
              </motion.div>
            )}

            {/* Text */}
            <div className="mb-6 space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Step content */}
            <div className="mb-8">{step.content}</div>

            {/* Progress dots */}
            <div className="mb-6 flex justify-center gap-2">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    'h-2 rounded-full transition-colors duration-300',
                    i <= currentStep ? 'bg-primary' : 'bg-muted',
                  )}
                  animate={{
                    width: i === currentStep ? 24 : 8,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 0 && (
                  <motion.button
                    type="button"
                    onClick={goPrev}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </motion.button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {onSkip && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip
                  </button>
                )}

                <motion.button
                  type="button"
                  onClick={goNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
                    'transition-opacity duration-200',
                  )}
                >
                  {isLastStep ? 'Finish' : 'Continue'}
                  {!isLastStep && <ChevronRight className="h-4 w-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
