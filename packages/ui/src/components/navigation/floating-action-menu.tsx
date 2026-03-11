"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface FloatingAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export interface FloatingActionMenuProps {
  actions: FloatingAction[]
  icon: React.ReactNode
  position?: "bottom-right" | "bottom-left"
  className?: string
}

const springTransition = { type: "spring" as const, stiffness: 400, damping: 25 }

export function FloatingActionMenu({
  actions,
  icon,
  position = "bottom-right",
  className,
}: FloatingActionMenuProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const positionClasses = position === "bottom-right"
    ? "bottom-6 right-6"
    : "bottom-6 left-6"

  const labelSide = position === "bottom-right" ? "right-full mr-3" : "left-full ml-3"

  return (
    <div
      ref={containerRef}
      className={cn("fixed z-50", positionClasses, className)}
    >
      {/* Action items */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 -z-10 bg-black/20"
              onClick={() => setOpen(false)}
            />

            {/* Action buttons */}
            <div className="absolute bottom-16 flex flex-col-reverse gap-3">
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, y: 20 }}
                  transition={{
                    ...springTransition,
                    delay: index * 0.05,
                  }}
                  className="relative flex items-center"
                >
                  {/* Tooltip label */}
                  <div
                    className={cn(
                      "absolute whitespace-nowrap rounded-md bg-popover px-2.5 py-1.5 text-sm font-medium text-popover-foreground shadow-md border border-border",
                      labelSide
                    )}
                  >
                    {action.label}
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      action.onClick()
                      setOpen(false)
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-foreground shadow-lg border border-border hover:bg-accent transition-colors"
                  >
                    {action.icon}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        animate={{ rotate: open ? 45 : 0 }}
        transition={springTransition}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {icon}
      </motion.button>
    </div>
  )
}
