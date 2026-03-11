"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, SkipForward } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FormStep {
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Step content rendered inside the wizard */
  content: React.ReactNode;
  /** Optional validation function; return true if step is valid */
  validate?: () => boolean;
}

export interface MultiStepFormProps {
  /** Array of step definitions */
  steps: FormStep[];
  /** Callback fired when the final step is completed */
  onComplete: () => void;
  /** Callback fired when the active step changes */
  onStepChange?: (step: number) => void;
  /** Whether steps can be skipped */
  allowSkip?: boolean;
  /** Additional class names */
  className?: string;
}

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

export function MultiStepForm({
  steps,
  onComplete,
  onStepChange,
  allowSkip = false,
  className,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const step = steps[currentStep];

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSteps) return;
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
      onStepChange?.(index);
    },
    [currentStep, totalSteps, onStepChange]
  );

  const next = useCallback(() => {
    if (step?.validate && !step.validate()) return;
    if (isLastStep) {
      onComplete();
    } else {
      goTo(currentStep + 1);
    }
  }, [currentStep, goTo, isLastStep, onComplete, step]);

  const prev = useCallback(() => {
    goTo(currentStep - 1);
  }, [currentStep, goTo]);

  const skip = useCallback(() => {
    if (!isLastStep) goTo(currentStep + 1);
  }, [currentStep, goTo, isLastStep]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-2xl border border-border bg-card shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Progress bar */}
      <div className="h-1 w-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 px-8 pt-6">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button
              type="button"
              onClick={() => i < currentStep && goTo(i)}
              disabled={i > currentStep}
              className="flex items-center gap-2"
            >
              <motion.div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                  i < currentStep &&
                    "bg-primary text-primary-foreground",
                  i === currentStep &&
                    "border-2 border-primary text-primary bg-primary/10",
                  i > currentStep &&
                    "border-2 border-muted-foreground/30 text-muted-foreground"
                )}
                animate={{
                  scale: i === currentStep ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  i === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors duration-300",
                  i < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden px-8 py-6" style={{ minHeight: 200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step?.description && (
              <p className="mb-4 text-sm text-muted-foreground">
                {step.description}
              </p>
            )}
            {step?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border px-8 py-4">
        <motion.button
          type="button"
          onClick={prev}
          disabled={isFirstStep}
          whileHover={{ scale: isFirstStep ? 1 : 1.02 }}
          whileTap={{ scale: isFirstStep ? 1 : 0.98 }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-foreground",
            "hover:bg-accent transition-colors duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </motion.button>

        <div className="flex items-center gap-2">
          {allowSkip && !isLastStep && (
            <motion.button
              type="button"
              onClick={skip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
              <SkipForward className="h-4 w-4" />
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={next}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-1 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground",
              "transition-opacity duration-200"
            )}
          >
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
