"use client"

import * as React from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardListViewProps<T = unknown> {
  /** Items to render. */
  items: T[]
  /** Render an item as a card (grid mode). */
  renderCard: (item: T, index: number) => React.ReactNode
  /** Render an item as a list row. */
  renderListItem: (item: T, index: number) => React.ReactNode
  /** Initial view mode. @default "grid" */
  defaultView?: "grid" | "list"
  /** Number of grid columns. @default 3 */
  columns?: number
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// CardListView Component
// ---------------------------------------------------------------------------

export function CardListView<T = unknown>({
  items,
  renderCard,
  renderListItem,
  defaultView = "grid",
  columns = 3,
  className,
}: CardListViewProps<T>) {
  const [view, setView] = React.useState<"grid" | "list">(defaultView)

  return (
    <div className={cn("w-full", className)}>
      {/* Toggle */}
      <div className="mb-4 flex items-center justify-end">
        <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  layoutId={`item-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                >
                  {renderCard(item, index)}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  layoutId={`item-${index}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                >
                  {renderListItem(item, index)}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

CardListView.displayName = "CardListView"
