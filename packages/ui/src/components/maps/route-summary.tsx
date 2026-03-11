'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Route, Car, Footprints, Train, ChevronDown, Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface RouteStep {
  instruction: string
  distance: string
}

export interface RouteSummaryProps {
  origin: string
  destination: string
  distance: string
  duration: string
  mode?: 'driving' | 'walking' | 'transit'
  steps?: RouteStep[]
  className?: string
}

const modeConfig = {
  driving: { icon: Car, label: 'Driving' },
  walking: { icon: Footprints, label: 'Walking' },
  transit: { icon: Train, label: 'Transit' },
}

const RouteSummary: React.FC<RouteSummaryProps> = ({
  origin,
  destination,
  distance,
  duration,
  mode = 'driving',
  steps = [],
  className,
}) => {
  const [stepsExpanded, setStepsExpanded] = useState(false)
  const ModeIcon = modeConfig[mode].icon

  return (
    <div
      className={cn(
        'rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
            <ModeIcon className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
          <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
            {modeConfig[mode].label}
          </span>
        </div>

        <div className="relative flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <Circle className="h-3 w-3 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
            <div className="my-1 h-8 w-px border-l-2 border-dashed border-[hsl(var(--border))]" />
            <MapPin className="h-3.5 w-3.5 text-[hsl(var(--destructive))] fill-[hsl(var(--destructive))]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="pb-2">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">From</p>
              <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                {origin}
              </p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">To</p>
              <p className="truncate text-sm font-medium text-[hsl(var(--foreground))]">
                {destination}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-4 rounded-md bg-[hsl(var(--muted))] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{duration}</span>
          </div>
        </div>
      </div>

      {steps.length > 0 && (
        <>
          <button
            onClick={() => setStepsExpanded(!stepsExpanded)}
            className="flex w-full items-center justify-between border-t border-[hsl(var(--border))] px-4 py-2.5 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <span>{steps.length} steps</span>
            <motion.div animate={{ rotate: stepsExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
          <AnimatePresence>
            {stepsExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[hsl(var(--border))] px-4 py-2">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 py-2"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[hsl(var(--foreground))]">{step.instruction}</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{step.distance}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

RouteSummary.displayName = 'RouteSummary'

export { RouteSummary }
