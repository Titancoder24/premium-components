"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KanbanCardItem {
  id: string
  title: string
  description?: string
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  items: KanbanCardItem[]
}

export interface KanbanBoardProps {
  /** Column definitions with their cards. */
  columns: KanbanColumn[]
  /** Called when a card is moved. */
  onCardMove?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number
  ) => void
  /** Custom card renderer. Falls back to default card if not provided. */
  renderCard?: (card: KanbanCardItem, columnId: string) => React.ReactNode
  /** Extra class name on the board wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Default Card
// ---------------------------------------------------------------------------

function DefaultCard({ card }: { card: KanbanCardItem }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{card.title}</p>
      {card.description && (
        <p className="text-xs text-muted-foreground">{card.description}</p>
      )}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Draggable Card
// ---------------------------------------------------------------------------

interface DraggableCardProps {
  card: KanbanCardItem
  columnId: string
  renderCard?: (card: KanbanCardItem, columnId: string) => React.ReactNode
  onDragStart: (cardId: string, columnId: string) => void
  onDragEnd: () => void
}

function DraggableCard({
  card,
  columnId,
  renderCard,
  onDragStart,
  onDragEnd,
}: DraggableCardProps) {
  return (
    <motion.div
      layout
      layoutId={card.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{
        scale: 1.04,
        boxShadow:
          "0 12px 32px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 100,
        cursor: "grabbing",
      }}
      whileHover={{ scale: 1.01 }}
      drag
      dragSnapToOrigin
      onDragStart={() => onDragStart(card.id, columnId)}
      onDragEnd={onDragEnd}
      transition={{
        layout: { type: "spring", stiffness: 350, damping: 30 },
      }}
      className="cursor-grab rounded-lg border border-border bg-card p-3 active:cursor-grabbing"
    >
      {renderCard ? renderCard(card, columnId) : <DefaultCard card={card} />}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Drop Zone (Column)
// ---------------------------------------------------------------------------

interface KanbanColumnZoneProps {
  column: KanbanColumn
  renderCard?: (card: KanbanCardItem, columnId: string) => React.ReactNode
  dragState: { cardId: string; fromColumnId: string } | null
  onDragStart: (cardId: string, columnId: string) => void
  onDragEnd: () => void
  onDrop: (toColumnId: string, toIndex: number) => void
}

function KanbanColumnZone({
  column,
  renderCard,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
}: KanbanColumnZoneProps) {
  const isDropTarget =
    dragState !== null && dragState.fromColumnId !== column.id

  return (
    <div
      className={cn(
        "flex w-72 flex-shrink-0 flex-col rounded-xl border border-border bg-muted/30 transition-colors",
        isDropTarget && "border-primary/50 bg-primary/5"
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        if (dragState) {
          onDrop(column.id, column.items.length)
        }
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {column.title}
          </h3>
          <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {column.items.length}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Add card to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
        <AnimatePresence mode="popLayout">
          {column.items.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              columnId={column.id}
              renderCard={renderCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </AnimatePresence>

        {/* Drop placeholder when empty */}
        {column.items.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground">
            Drop items here
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// KanbanBoard Component
// ---------------------------------------------------------------------------

export function KanbanBoard({
  columns,
  onCardMove,
  renderCard,
  className,
}: KanbanBoardProps) {
  const [dragState, setDragState] = React.useState<{
    cardId: string
    fromColumnId: string
  } | null>(null)

  const handleDragStart = (cardId: string, fromColumnId: string) => {
    setDragState({ cardId, fromColumnId })
  }

  const handleDragEnd = () => {
    setDragState(null)
  }

  const handleDrop = (toColumnId: string, toIndex: number) => {
    if (!dragState) return
    const { cardId, fromColumnId } = dragState
    if (fromColumnId !== toColumnId) {
      onCardMove?.(cardId, fromColumnId, toColumnId, toIndex)
    }
    setDragState(null)
  }

  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto pb-4",
        className
      )}
    >
      {columns.map((column) => (
        <KanbanColumnZone
          key={column.id}
          column={column}
          renderCard={renderCard}
          dragState={dragState}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}

KanbanBoard.displayName = "KanbanBoard"
