"use client"

import * as React from "react"
import { motion, Reorder, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SortableItem {
  id: string
  content: React.ReactNode
}

export interface SortableListProps {
  /** List items with unique ids. */
  items: SortableItem[]
  /** Called when items are reordered. */
  onReorder: (items: SortableItem[]) => void
  /** Show a drag handle instead of the whole row being draggable. @default false */
  handle?: boolean
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Sortable Item Row
// ---------------------------------------------------------------------------

function SortableRow({
  item,
  handle,
}: {
  item: SortableItem
  handle: boolean
}) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={!handle}
      dragControls={handle ? dragControls : undefined}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileDrag={{
        scale: 1.02,
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 50,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-foreground",
        !handle && "cursor-grab active:cursor-grabbing"
      )}
    >
      {handle && (
        <motion.button
          type="button"
          className="flex-shrink-0 cursor-grab touch-none text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </motion.button>
      )}
      <div className="flex-1">{item.content}</div>
    </Reorder.Item>
  )
}

// ---------------------------------------------------------------------------
// SortableList Component
// ---------------------------------------------------------------------------

export function SortableList({
  items,
  onReorder,
  handle = false,
  className,
}: SortableListProps) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn("flex flex-col gap-2", className)}
    >
      {items.map((item) => (
        <SortableRow key={item.id} item={item} handle={handle} />
      ))}
    </Reorder.Group>
  )
}

SortableList.displayName = "SortableList"
