"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandPaletteItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
}

export interface CommandPaletteGroup {
  label: string
  items: CommandPaletteItem[]
}

export interface CommandPaletteListProps {
  /** Groups of command items. */
  groups: CommandPaletteGroup[]
  /** Index of the currently active (highlighted) item across all groups. */
  activeIndex: number
  /** Called when an item is selected. */
  onSelect: (item: CommandPaletteItem) => void
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// CommandPaletteList Component
// ---------------------------------------------------------------------------

export function CommandPaletteList({
  groups,
  activeIndex,
  onSelect,
  className,
}: CommandPaletteListProps) {
  const listRef = React.useRef<HTMLDivElement>(null)

  // Flatten items to map activeIndex to a specific item
  const flatItems = React.useMemo(() => {
    const result: { item: CommandPaletteItem; groupLabel: string }[] = []
    for (const group of groups) {
      for (const item of group.items) {
        result.push({ item, groupLabel: group.label })
      }
    }
    return result
  }, [groups])

  // Scroll active item into view
  React.useEffect(() => {
    const container = listRef.current
    if (!container) return
    const activeEl = container.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement | null
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" })
    }
  }, [activeIndex])

  let globalIndex = 0

  return (
    <div
      ref={listRef}
      className={cn(
        "w-full overflow-y-auto rounded-lg border border-border bg-card py-2",
        className
      )}
      role="listbox"
    >
      {groups.map((group) => {
        if (group.items.length === 0) return null

        return (
          <div key={group.label} className="mb-1 last:mb-0">
            {/* Group label */}
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {group.label}
            </div>

            {/* Items */}
            {group.items.map((item) => {
              const itemIndex = globalIndex
              globalIndex++
              const isActive = itemIndex === activeIndex

              return (
                <div
                  key={item.id}
                  data-index={itemIndex}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onSelect(item)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="relative cursor-pointer px-2"
                >
                  {/* Animated highlight background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="command-palette-highlight"
                        className="absolute inset-x-2 inset-y-0 rounded-md bg-primary/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "relative z-10 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {/* Icon */}
                    {item.icon && (
                      <span className="flex-shrink-0 text-muted-foreground">
                        {item.icon}
                      </span>
                    )}

                    {/* Label */}
                    <span className="flex-1 truncate">{item.label}</span>

                    {/* Shortcut */}
                    {item.shortcut && (
                      <kbd className="ml-auto flex-shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {flatItems.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No results found.
        </div>
      )}
    </div>
  )
}

CommandPaletteList.displayName = "CommandPaletteList"
