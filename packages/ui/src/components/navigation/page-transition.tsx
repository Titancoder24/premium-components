"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

export type TransitionDirection = "left" | "right" | "up" | "down" | "fade"

export interface PageTransitionProps {
  children: React.ReactNode
  transitionKey: string
  direction?: TransitionDirection
  duration?: number
  className?: string
}

const directionOffsets: Record<TransitionDirection, { x?: number; y?: number }> = {
  left: { x: -100 },
  right: { x: 100 },
  up: { y: -100 },
  down: { y: 100 },
  fade: {},
}

export function PageTransition({
  children,
  transitionKey,
  direction = "fade",
  duration = 300,
  className,
}: PageTransitionProps) {
  const durationSec = duration / 1000
  const offset = directionOffsets[direction]
  const enterOffset = {
    x: offset.x ? -offset.x : 0,
    y: offset.y ? -offset.y : 0,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{
          opacity: 0,
          x: enterOffset.x,
          y: enterOffset.y,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        exit={{
          opacity: 0,
          x: offset.x ?? 0,
          y: offset.y ?? 0,
        }}
        transition={{ duration: durationSec, ease: "easeInOut" }}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
