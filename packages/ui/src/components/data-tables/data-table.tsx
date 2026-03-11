"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Loader2,
} from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataTableColumn<T = Record<string, unknown>> {
  /** Unique key that maps to a field on the row data object. */
  key: string
  /** Display header label. */
  header: string
  /** Allow sorting by this column. */
  sortable?: boolean
  /** Allow filtering by this column (reserved for future filter UI). */
  filterable?: boolean
  /** Fixed width (CSS value). */
  width?: string
  /** Optional custom cell renderer. */
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode
}

export type SortDirection = "asc" | "desc"

export interface SortState {
  key: string
  direction: SortDirection
}

export interface DataTableProps<T = Record<string, unknown>> {
  /** Column definitions. */
  columns: DataTableColumn<T>[]
  /** Row data. */
  data: T[]
  /** Rows per page. @default 10 */
  pageSize?: number
  /** Enable row selection checkboxes. */
  selectable?: boolean
  /** Row click handler. */
  onRowClick?: (row: T, index: number) => void
  /** Show loading skeleton. */
  loading?: boolean
  /** Custom empty state node. */
  emptyState?: React.ReactNode
  /** Controlled sort state. */
  sort?: SortState | null
  /** Sort change callback. */
  onSortChange?: (sort: SortState | null) => void
  /** Controlled selection state (row indices). */
  selectedRows?: Set<number>
  /** Selection change callback. */
  onSelectionChange?: (selected: Set<number>) => void
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc != null && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b))
}

// ---------------------------------------------------------------------------
// Skeleton row
// ---------------------------------------------------------------------------

function SkeletonRow({ cols, index }: { cols: number; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-border"
    >
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <motion.div
            className="h-4 rounded bg-muted"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </td>
      ))}
    </motion.tr>
  )
}

// ---------------------------------------------------------------------------
// Sort icon
// ---------------------------------------------------------------------------

function SortIcon({ direction }: { direction?: SortDirection }) {
  if (!direction) {
    return <ArrowUpDown className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground/50" />
  }

  return (
    <motion.span
      key={direction}
      initial={{ rotate: direction === "asc" ? 180 : 0, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="ml-1 inline-flex"
    >
      {direction === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5 text-foreground" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5 text-foreground" />
      )}
    </motion.span>
  )
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

function TableCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
        checked || indeterminate
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background"
      )}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check className="h-3 w-3" />
          </motion.span>
        )}
        {indeterminate && !checked && (
          <motion.span
            key="indeterminate"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Minus className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ---------------------------------------------------------------------------
// DataTable Component
// ---------------------------------------------------------------------------

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  selectable = false,
  onRowClick,
  loading = false,
  emptyState,
  sort: controlledSort,
  onSortChange,
  selectedRows: controlledSelected,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  // -- Sort state -----------------------------------------------------------
  const [internalSort, setInternalSort] = React.useState<SortState | null>(null)
  const sort = controlledSort !== undefined ? controlledSort : internalSort
  const setSort = React.useCallback(
    (next: SortState | null) => {
      if (onSortChange) onSortChange(next)
      else setInternalSort(next)
    },
    [onSortChange]
  )

  // -- Selection state ------------------------------------------------------
  const [internalSelected, setInternalSelected] = React.useState<Set<number>>(new Set())
  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected
  const setSelected = React.useCallback(
    (next: Set<number>) => {
      if (onSelectionChange) onSelectionChange(next)
      else setInternalSelected(next)
    },
    [onSelectionChange]
  )

  // -- Pagination -----------------------------------------------------------
  const [page, setPage] = React.useState(0)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  // Reset page if data shrinks
  React.useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  // -- Sorted data ----------------------------------------------------------
  const sortedData = React.useMemo(() => {
    if (!sort) return data
    const { key, direction } = sort
    return [...data].sort((a, b) => {
      const cmp = defaultCompare(getNestedValue(a, key), getNestedValue(b, key))
      return direction === "asc" ? cmp : -cmp
    })
  }, [data, sort])

  // -- Paginated slice ------------------------------------------------------
  const pageData = React.useMemo(
    () => sortedData.slice(page * pageSize, (page + 1) * pageSize),
    [sortedData, page, pageSize]
  )

  // -- Handlers -------------------------------------------------------------
  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return
    if (sort && sort.key === col.key) {
      if (sort.direction === "asc") {
        setSort({ key: col.key, direction: "desc" })
      } else {
        setSort(null)
      }
    } else {
      setSort({ key: col.key, direction: "asc" })
    }
  }

  const toggleRow = (index: number) => {
    const globalIndex = page * pageSize + index
    const next = new Set(selected)
    if (next.has(globalIndex)) next.delete(globalIndex)
    else next.add(globalIndex)
    setSelected(next)
  }

  const toggleAll = () => {
    const pageIndices = pageData.map((_, i) => page * pageSize + i)
    const allSelected = pageIndices.every((i) => selected.has(i))
    const next = new Set(selected)
    if (allSelected) {
      pageIndices.forEach((i) => next.delete(i))
    } else {
      pageIndices.forEach((i) => next.add(i))
    }
    setSelected(next)
  }

  const pageIndices = pageData.map((_, i) => page * pageSize + i)
  const allPageSelected = pageIndices.length > 0 && pageIndices.every((i) => selected.has(i))
  const somePageSelected = !allPageSelected && pageIndices.some((i) => selected.has(i))

  // -- Render ---------------------------------------------------------------
  const colCount = columns.length + (selectable ? 1 : 0)

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {selectable && (
                <th className="w-10 px-4 py-3 text-left">
                  <TableCheckbox
                    checked={allPageSelected}
                    indeterminate={somePageSelected}
                    onChange={toggleAll}
                    ariaLabel="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    col.sortable && "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={sort?.key === col.key ? sort.direction : undefined}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} cols={colCount} index={i} />
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyState ?? "No data available."}
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {pageData.map((row, i) => {
                  const globalIndex = page * pageSize + i
                  const isSelected = selected.has(globalIndex)

                  return (
                    <motion.tr
                      key={globalIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      onClick={() => onRowClick?.(row, globalIndex)}
                      className={cn(
                        "border-b border-border transition-colors",
                        onRowClick && "cursor-pointer",
                        isSelected
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() => toggleRow(i)}
                            ariaLabel={`Select row ${globalIndex + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-foreground">
                          {col.render
                            ? col.render(getNestedValue(row, col.key), row, globalIndex)
                            : String(getNestedValue(row, col.key) ?? "")}
                        </td>
                      ))}
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>
            {selectable && selected.size > 0
              ? `${selected.size} selected \u00b7 `
              : ""}
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

DataTable.displayName = "DataTable"
