"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
} from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExpandableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode
}

export type SortDirection = "asc" | "desc"

export interface SortState {
  key: string
  direction: SortDirection
}

export interface ExpandableRowTableProps<T = Record<string, unknown>> {
  columns: ExpandableColumn<T>[]
  data: T[]
  pageSize?: number
  selectable?: boolean
  expandable?: boolean
  onRowClick?: (row: T, index: number) => void
  loading?: boolean
  emptyState?: React.ReactNode
  renderExpandedRow: (row: T, index: number) => React.ReactNode
  sort?: SortState | null
  onSortChange?: (sort: SortState | null) => void
  selectedRows?: Set<number>
  onSelectionChange?: (selected: Set<number>) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc != null && typeof acc === "object") return (acc as Record<string, unknown>)[part]
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
// Sub-components
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
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="h-3 w-3" />
          </motion.span>
        )}
        {indeterminate && !checked && (
          <motion.span key="ind" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Minus className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

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
// ExpandableRowTable
// ---------------------------------------------------------------------------

export function ExpandableRowTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  selectable = false,
  expandable = true,
  onRowClick,
  loading = false,
  emptyState,
  renderExpandedRow,
  sort: controlledSort,
  onSortChange,
  selectedRows: controlledSelected,
  onSelectionChange,
  className,
}: ExpandableRowTableProps<T>) {
  // Sort
  const [internalSort, setInternalSort] = React.useState<SortState | null>(null)
  const sort = controlledSort !== undefined ? controlledSort : internalSort
  const setSort = React.useCallback(
    (next: SortState | null) => {
      if (onSortChange) onSortChange(next)
      else setInternalSort(next)
    },
    [onSortChange]
  )

  // Selection
  const [internalSelected, setInternalSelected] = React.useState<Set<number>>(new Set())
  const selected = controlledSelected ?? internalSelected
  const setSelected = React.useCallback(
    (next: Set<number>) => {
      if (onSelectionChange) onSelectionChange(next)
      else setInternalSelected(next)
    },
    [onSelectionChange]
  )

  // Expanded
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())

  // Pagination
  const [page, setPage] = React.useState(0)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  React.useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  // Sorted + paginated data
  const sortedData = React.useMemo(() => {
    if (!sort) return data
    return [...data].sort((a, b) => {
      const cmp = defaultCompare(getNestedValue(a, sort.key), getNestedValue(b, sort.key))
      return sort.direction === "asc" ? cmp : -cmp
    })
  }, [data, sort])

  const pageData = React.useMemo(
    () => sortedData.slice(page * pageSize, (page + 1) * pageSize),
    [sortedData, page, pageSize]
  )

  // Handlers
  const handleSort = (col: ExpandableColumn<T>) => {
    if (!col.sortable) return
    if (sort && sort.key === col.key) {
      setSort(sort.direction === "asc" ? { key: col.key, direction: "desc" } : null)
    } else {
      setSort({ key: col.key, direction: "asc" })
    }
  }

  const toggleExpand = (globalIndex: number) => {
    const next = new Set(expandedRows)
    if (next.has(globalIndex)) next.delete(globalIndex)
    else next.add(globalIndex)
    setExpandedRows(next)
  }

  const toggleRow = (localIndex: number) => {
    const gi = page * pageSize + localIndex
    const next = new Set(selected)
    if (next.has(gi)) next.delete(gi)
    else next.add(gi)
    setSelected(next)
  }

  const toggleAll = () => {
    const indices = pageData.map((_, i) => page * pageSize + i)
    const allSel = indices.every((i) => selected.has(i))
    const next = new Set(selected)
    indices.forEach((i) => (allSel ? next.delete(i) : next.add(i)))
    setSelected(next)
  }

  const pageIndices = pageData.map((_, i) => page * pageSize + i)
  const allPageSelected = pageIndices.length > 0 && pageIndices.every((i) => selected.has(i))
  const somePageSelected = !allPageSelected && pageIndices.some((i) => selected.has(i))

  const extraCols = (selectable ? 1 : 0) + (expandable ? 1 : 0)
  const colCount = columns.length + extraCols

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {expandable && <th className="w-10 px-2 py-3" />}
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
                      <SortIcon direction={sort?.key === col.key ? sort.direction : undefined} />
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
              pageData.map((row, i) => {
                const gi = page * pageSize + i
                const isExpanded = expandedRows.has(gi)
                const isSelected = selected.has(gi)

                return (
                  <React.Fragment key={gi}>
                    <motion.tr
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      onClick={() => onRowClick?.(row, gi)}
                      className={cn(
                        "border-b border-border transition-colors",
                        onRowClick && "cursor-pointer",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                      )}
                    >
                      {expandable && (
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpand(gi)
                            }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={isExpanded ? "Collapse row" : "Expand row"}
                          >
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="inline-flex"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.span>
                          </button>
                        </td>
                      )}
                      {selectable && (
                        <td className="px-4 py-3">
                          <TableCheckbox
                            checked={isSelected}
                            onChange={() => toggleRow(i)}
                            ariaLabel={`Select row ${gi + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-foreground">
                          {col.render
                            ? col.render(getNestedValue(row, col.key), row, gi)
                            : String(getNestedValue(row, col.key) ?? "")}
                        </td>
                      ))}
                    </motion.tr>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandable && isExpanded && (
                        <motion.tr
                          key={`expanded-${gi}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="border-b border-border"
                        >
                          <td colSpan={colCount} className="overflow-hidden bg-muted/30 px-4 py-4">
                            <motion.div
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.2, delay: 0.05 }}
                            >
                              {renderExpandedRow(row, gi)}
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>
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

ExpandableRowTable.displayName = "ExpandableRowTable"
