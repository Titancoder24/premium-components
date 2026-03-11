"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface MegaMenuItem {
  label: string
  href: string
  description?: string
}

export interface MegaMenuColumn {
  title: string
  items: MegaMenuItem[]
}

export interface MegaMenuProps {
  trigger: React.ReactNode
  columns: MegaMenuColumn[]
  featured?: React.ReactNode
  onNavigate?: (href: string) => void
  className?: string
}

export function MegaMenu({
  trigger,
  columns,
  featured,
  onNavigate,
  className,
}: MegaMenuProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <div className="cursor-pointer">{trigger}</div>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-xl border border-border bg-popover shadow-xl"
          >
            <div className="flex p-4 gap-6">
              {/* Columns */}
              {columns.map((column, colIndex) => (
                <motion.div
                  key={column.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: colIndex * 0.05 }}
                  className="min-w-48"
                >
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {column.title}
                  </p>
                  <div className="space-y-0.5">
                    {column.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          if (onNavigate) {
                            e.preventDefault()
                            onNavigate(item.href)
                          }
                          setOpen(false)
                        }}
                        className="block rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Featured section */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: columns.length * 0.05 }}
                  className="min-w-52 border-l border-border pl-6"
                >
                  {featured}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
