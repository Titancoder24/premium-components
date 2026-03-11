"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface MobileBottomNavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
}

export interface MobileBottomNavProps {
  items: MobileBottomNavItem[]
  activeItem: string
  onNavigate?: (href: string) => void
  className?: string
}

const springTransition = { type: "spring" as const, stiffness: 400, damping: 30 }

export function MobileBottomNav({
  items,
  activeItem,
  onNavigate,
  className,
}: MobileBottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md safe-area-inset-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const isActive = activeItem === item.href

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate(item.href)
                }
              }}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1 h-0.5 w-8 rounded-full bg-primary"
                  transition={springTransition}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={springTransition}
                className={cn(
                  "relative flex h-6 w-6 items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.icon}

                {/* Badge */}
                {item.badge != null && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springTransition}
                    className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {item.badge}
                    </motion.span>
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
