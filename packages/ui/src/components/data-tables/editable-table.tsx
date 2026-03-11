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
  X,
  Pencil,
} from "lucide-react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EditableColumn<T = Record<string, unknown>> {
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

export interface CellValidationResult {
  valid: boolean
  message?: string
}

export interface EditableTableProps<T = Record<string, unknown>> {
  /** Column definitions. */
  columns: EditableColumn<T>[]
  /** Row data. */
  data: T[]
  /** Rows per page. @default 10 */
  pageSize?: number
  /** Columns that can be inline-edited (by key). */
  editableColumns?: string[]
  /** Callback when a cell value is committed. */
  onCellEdit?: (rowIndex: number, columnKey: string, value: string) => void
  /** Validate before committing a cell edit. Return { valid, message }. */
  validation?: (
    rowIndex: number,
    columnKey: string,
    value: string
  ) => CellValidationResult
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
  /** Extra class name on wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc != null && typeof acc === "object")
      return (acc as Record<string, unknown>)[part]
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
    return (
      <ArrowUpDown className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground/50" />
    )
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
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </td>
      ))}
    </motion.tr>
  )
}

// ---------------------------------------------------------------------------
// Editable Cell
// ---------------------------------------------------------------------------

interface EditableCellProps {
  value: unknown
  rowIndex: number
  columnKey: string
  editable: boolean
  onCellEdit?: (rowIndex: number, columnKey: string, value: string) => void
  validation?: (
    rowIndex: number,
    columnKey: string,
    value: string
  ) => CellValidationResult
  render?: (value: unknown) => React.ReactNode
}

function EditableCell({
  value,
  rowIndex,
  columnKey,
  editable,
  onCellEdit,
  validation,
  render,
}: EditableCellProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const startEdit = () => {
    if (!editable) return
    setDraft(String(value ?? ""))
    setError(null)
    setEditing(true)
  }

  React.useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    if (validation) {
      const result = validation(rowIndex, columnKey, draft)
      if (!result.valid) {
        setError(result.message ?? "Invalid value")
        return
      }
    }
    onCellEdit?.(rowIndex, columnKey, draft)
    setEditing(false)
    setError(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 1200)
  }

  const cancel = () => {
    setEditing(false)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit()
    if (e.key === "Escape") cancel()
  }

  if (editing) {
    return (
      <div className="relative">
        <motion.div
          initial={{ borderColor: "transparent" }}
          animate={
            error
              ? {
                  x: [0, -4, 4, -4, 4, 0],
                  borderColor: "var(--destructive, #ef4444)",
                }
              : { borderColor: "var(--primary, #3b82f6)" }
          }
          transition={error ? { duration: 0.4 } : { duration: 0.2 }}
          className="flex items-center gap-1 rounded-md border-2 bg-background px-1"
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            className="h-7 flex-1 bg-transparent text-sm text-foreground outline-none"
          />
          <button
            type="button"
            onClick={commit}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-primary hover:bg-primary/10"
            aria-label="Save edit"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={cancel}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Cancel edit"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 top-full mt-1 text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative flex items-center",
        editable && "cursor-pointer"
      )}
      onClick={(e) => {
        e.stopPropagation()
        startEdit()
      }}
    >
      <span className="truncate">
        {render ? render(value) : String(value ?? "")}
      </span>
      {editable && (
        <Pencil className="ml-2 h-3 w-3 flex-shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
      )}
      <AnimatePresence>
        {showSuccess && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="ml-2 inline-flex text-primary"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EditableTable Component
// ---------------------------------------------------------------------------

export function EditableTable<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  columns,
  data,
  pageSize = 10,
  editableColumns = [],
  onCellEdit,
  validation,
  onRowClick,
  loading = false,
  emptyState,
  sort: controlledSort,
  onSortChange,
  className,
}: EditableTableProps<T>) {
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

  // Pagination
  const [page, setPage] = React.useState(0)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  React.useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  // Sorted + paginated
  const sortedData = React.useMemo(() => {
    if (!sort) return data
    return [...data].sort((a, b) => {
      const cmp = defaultCompare(
        getNestedValue(a, sort.key),
        getNestedValue(b, sort.key)
      )
      return sort.direction === "asc" ? cmp : -cmp
    })
  }, [data, sort])

  const pageData = React.useMemo(
    () => sortedData.slice(page * pageSize, (page + 1) * pageSize),
    [sortedData, page, pageSize]
  )

  const handleSort = (col: EditableColumn<T>) => {
    if (!col.sortable) return
    if (sort && sort.key === col.key) {
      setSort(sort.direction === "asc" ? { key: col.key, direction: "desc" } : null)
    } else {
      setSort({ key: col.key, direction: "asc" })
    }
  }

  const editableSet = React.useMemo(
    () => new Set(editableColumns),
    [editableColumns]
  )

  const colCount = columns.length

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    col.sortable &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={
                          sort?.key === col.key ? sort.direction : undefined
                        }
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
                <td
                  colSpan={colCount}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyState ?? "No data available."}
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {pageData.map((row, i) => {
                  const globalIndex = page * pageSize + i
                  return (
                    <motion.tr
                      key={globalIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      onClick={() => onRowClick?.(row, globalIndex)}
                      className={cn(
                        "border-b border-border transition-colors hover:bg-muted/50",
                        onRowClick && "cursor-pointer"
                      )}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-foreground">
                          <EditableCell
                            value={getNestedValue(row, col.key)}
                            rowIndex={globalIndex}
                            columnKey={col.key}
                            editable={editableSet.has(col.key)}
                            onCellEdit={onCellEdit}
                            validation={validation}
                            render={
                              col.render
                                ? (v) => col.render!(v, row, globalIndex)
                                : undefined
                            }
                          />
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

EditableTable.displayName = "EditableTable"
