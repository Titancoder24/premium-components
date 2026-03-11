"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VirtualListProps<T = unknown> {
  /** Items to render. */
  items: T[]
  /** Render a single item. */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Fixed height of each item in pixels. */
  itemHeight: number
  /** Number of extra items to render outside the viewport. @default 5 */
  overscan?: number
  /** Height of the scrollable container (CSS value). @default "400px" */
  height?: string | number
  /** Extra class name on the scroll container. */
  className?: string
}

// ---------------------------------------------------------------------------
// VirtualList Component
// ---------------------------------------------------------------------------

export function VirtualList<T = unknown>({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
  height = "400px",
  className,
}: VirtualListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)

  // Measure container
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerHeight(entry.contentRect.height)
    })
    observer.observe(container)
    setContainerHeight(container.clientHeight)

    return () => observer.disconnect()
  }, [])

  const handleScroll = React.useCallback(() => {
    const container = containerRef.current
    if (container) setScrollTop(container.scrollTop)
  }, [])

  // Calculate visible range
  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  )
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = React.useMemo(() => {
    const result: { item: T; index: number }[] = []
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({ item: items[i]!, index: i })
    }
    return result
  }, [items, startIndex, endIndex])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "overflow-auto rounded-lg border border-border bg-card",
        className
      )}
      style={{ height }}
    >
      <div
        className="relative w-full"
        style={{ height: totalHeight }}
      >
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            className="absolute left-0 w-full"
            style={{
              height: itemHeight,
              top: index * itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

VirtualList.displayName = "VirtualList"
