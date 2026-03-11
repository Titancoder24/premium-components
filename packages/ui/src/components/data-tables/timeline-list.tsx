"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Circle } from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimelineEvent {
  id: string
  date: string | Date
  title: string
  description?: string
  type: string
  icon?: React.ReactNode
}

export interface TimelineListProps {
  /** Chronological events to display. */
  events: TimelineEvent[]
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ---------------------------------------------------------------------------
// Type-based color mapping
// ---------------------------------------------------------------------------

const typeColors: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-destructive",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  default: "bg-primary",
}

function getTypeColor(type: string): string {
  return typeColors[type] ?? typeColors.default
}

// ---------------------------------------------------------------------------
// TimelineList Component
// ---------------------------------------------------------------------------

export function TimelineList({ events, className }: TimelineListProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Animated timeline line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute left-[19px] top-0 h-full w-0.5 origin-top bg-border"
      />

      <div className="relative flex flex-col gap-0">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: index * 0.1 + 0.15,
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-background shadow-sm",
                  getTypeColor(event.type)
                )}
              >
                {event.icon ?? (
                  <Circle className="h-4 w-4 fill-current text-white" />
                )}
              </motion.div>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + 0.2,
              }}
              className="flex-1 pt-1"
            >
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {event.title}
                </h4>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {event.type}
                </span>
              </div>
              <time className="mt-0.5 block text-xs text-muted-foreground">
                {formatDate(event.date)}
              </time>
              {event.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

TimelineList.displayName = "TimelineList"
