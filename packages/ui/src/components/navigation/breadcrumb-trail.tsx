"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbTrailProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxVisible?: number
  onNavigate?: (href: string) => void
  className?: string
}

export function BreadcrumbTrail({
  items,
  separator,
  maxVisible = 3,
  onNavigate,
  className,
}: BreadcrumbTrailProps) {
  const [ellipsisOpen, setEllipsisOpen] = React.useState(false)
  const ellipsisRef = React.useRef<HTMLDivElement>(null)

  const shouldCollapse = items.length > maxVisible + 1
  const visibleItems = shouldCollapse
    ? [items[0], ...items.slice(-(maxVisible))]
    : items
  const hiddenItems = shouldCollapse ? items.slice(1, items.length - maxVisible) : []

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ellipsisRef.current && !ellipsisRef.current.contains(e.target as Node)) {
        setEllipsisOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const separatorNode = separator ?? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const content = item.href && !isLast ? (
      <a
        href={item.href}
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault()
            onNavigate(item.href!)
          }
        }}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {item.label}
      </a>
    ) : (
      <span
        className={cn(
          "text-sm",
          isLast ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    )

    return (
      <motion.li
        key={`${item.label}-${index}`}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className="flex items-center gap-2"
      >
        {index > 0 && <span className="flex items-center">{separatorNode}</span>}
        {content}
      </motion.li>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("relative", className)}>
      <ol className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => {
            const isLast = shouldCollapse
              ? index === visibleItems.length - 1
              : index === items.length - 1

            // After the first item, insert ellipsis if collapsing
            if (shouldCollapse && index === 1) {
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <motion.li
                    key="ellipsis"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex items-center">{separatorNode}</span>
                    <div className="relative" ref={ellipsisRef}>
                      <button
                        onClick={() => setEllipsisOpen((prev) => !prev)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label="Show more breadcrumbs"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {ellipsisOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full z-50 mt-1 min-w-36 rounded-lg border border-border bg-popover p-1 shadow-lg"
                          >
                            {hiddenItems.map((hidden, hIdx) => (
                              <a
                                key={hIdx}
                                href={hidden.href ?? "#"}
                                onClick={(e) => {
                                  if (onNavigate && hidden.href) {
                                    e.preventDefault()
                                    onNavigate(hidden.href)
                                  }
                                  setEllipsisOpen(false)
                                }}
                                className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                {hidden.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                  {renderItem(item, index + 1, isLast)}
                </React.Fragment>
              )
            }

            return renderItem(item, shouldCollapse && index > 1 ? index + 1 : index, isLast)
          })}
        </AnimatePresence>
      </ol>
    </nav>
  )
}
