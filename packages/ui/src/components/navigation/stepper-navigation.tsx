"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

export interface StepItem {
  label: string
  description?: string
}

export interface StepperNavigationProps {
  steps: StepItem[]
  currentStep: number
  onStepClick?: (step: number) => void
  orientation?: "horizontal" | "vertical"
  allowClickPastSteps?: boolean
  className?: string
}

const springTransition = { type: "spring" as const, stiffness: 400, damping: 30 }

function StepCircle({
  index,
  currentStep,
}: {
  index: number
  currentStep: number
}) {
  const isCompleted = index < currentStep
  const isCurrent = index === currentStep

  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      {/* Pulse ring for current step */}
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary"
        />
      )}

      {/* Circle background */}
      <motion.div
        animate={{
          backgroundColor: isCompleted || isCurrent
            ? "hsl(var(--primary))"
            : "transparent",
          borderColor: isCompleted || isCurrent
            ? "hsl(var(--primary))"
            : "hsl(var(--border))",
        }}
        transition={{ duration: 0.3 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border-2"
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springTransition}
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        ) : (
          <span
            className={cn(
              "text-sm font-semibold",
              isCurrent ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {index + 1}
          </span>
        )}
      </motion.div>
    </div>
  )
}

export function StepperNavigation({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  allowClickPastSteps = false,
  className,
}: StepperNavigationProps) {
  const isHorizontal = orientation === "horizontal"

  const handleClick = (index: number) => {
    if (!onStepClick) return
    if (allowClickPastSteps || index <= currentStep) {
      onStepClick(index)
    }
  }

  return (
    <div
      className={cn(
        "flex",
        isHorizontal ? "flex-row items-start" : "flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = allowClickPastSteps || index <= currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            {/* Step */}
            <div
              role="button"
              tabIndex={isClickable ? 0 : -1}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleClick(index)
                }
              }}
              className={cn(
                "flex gap-3",
                isHorizontal ? "flex-col items-center text-center" : "items-start",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
            >
              <StepCircle index={index} currentStep={currentStep} />
              <div className={cn(isHorizontal ? "max-w-24" : "")}>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent
                      ? "text-foreground"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  "relative",
                  isHorizontal
                    ? "mx-2 mt-[18px] h-0.5 flex-1 min-w-8"
                    : "ml-[18px] my-1 w-0.5 h-8"
                )}
              >
                {/* Background track */}
                <div
                  className={cn(
                    "absolute bg-border",
                    isHorizontal ? "inset-x-0 top-0 h-full" : "inset-y-0 left-0 w-full"
                  )}
                />
                {/* Filled portion */}
                <motion.div
                  initial={false}
                  animate={{
                    [isHorizontal ? "scaleX" : "scaleY"]: isCompleted ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{
                    transformOrigin: isHorizontal ? "left" : "top",
                  }}
                  className={cn(
                    "absolute bg-primary",
                    isHorizontal ? "inset-x-0 top-0 h-full" : "inset-y-0 left-0 w-full"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
