'use client'

import React, { useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Maximize2, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

// ---- Types ----

export interface MediaGridItem {
  id: string
  src: string
  alt?: string
  width: number
  height: number
}

export interface MediaGridProps {
  items: MediaGridItem[]
  columns?: 2 | 3 | 4
  onSelect?: (item: MediaGridItem) => void
  className?: string
}

// ---- Component ----

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
} as const

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  columns = 3,
  onSelect,
  className,
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const columnGroups = useMemo(() => {
    const groups: MediaGridItem[][] = Array.from({ length: columns }, () => [])
    const heights = Array(columns).fill(0)
    items.forEach((item) => {
      const shortest = heights.indexOf(Math.min(...heights))
      groups[shortest]!.push(item)
      heights[shortest] += item.height / item.width
    })
    return groups
  }, [items, columns])

  const handleSelect = useCallback(
    (item: MediaGridItem) => {
      setSelectedId((prev) => (prev === item.id ? null : item.id))
      onSelect?.(item)
    },
    [onSelect],
  )

  return (
    <div className={cn('rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-medium text-[hsl(var(--card-foreground))]">
            Media Gallery
          </span>
          <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
            {items.length}
          </span>
        </div>
        {selectedId && (
          <span className="text-xs text-[hsl(var(--primary))]">1 selected</span>
        )}
      </div>

      <div className={cn('grid gap-3', COLUMN_CLASSES[columns])}>
        {columnGroups.map((group, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3">
            <AnimatePresence>
              {group.map((item, itemIdx) => {
                const isSelected = selectedId === item.id
                const aspectRatio = item.width / item.height
                const delay = colIdx * 0.05 + itemIdx * 0.05

                return (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ delay, duration: 0.3, ease: 'easeOut' }}
                    className={cn(
                      'group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors',
                      isSelected
                        ? 'border-[hsl(var(--primary))]'
                        : 'border-transparent hover:border-[hsl(var(--accent))]',
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <div
                      className="relative bg-[hsl(var(--muted))]"
                      style={{ aspectRatio }}
                    >
                      <img
                        src={item.src}
                        alt={item.alt || ''}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex gap-1">
                          <button className="rounded-md bg-black/50 p-1 text-white hover:bg-black/70">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--primary))]"
                        >
                          <Check className="h-3 w-3 text-[hsl(var(--primary-foreground))]" />
                        </motion.div>
                      )}
                    </div>

                    {item.alt && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate text-xs text-white">{item.alt}</p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
          <Image className="mb-2 h-8 w-8" />
          <p className="text-sm">No media items</p>
        </div>
      )}
    </div>
  )
}

MediaGrid.displayName = 'MediaGrid'
