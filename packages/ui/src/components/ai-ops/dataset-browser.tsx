'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ColumnType = 'text' | 'number' | 'date' | 'boolean';

export interface DataColumn {
  key: string;
  label: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  nullCount?: number;
  uniqueCount?: number;
}

export interface DataRow {
  id: string;
  [key: string]: unknown;
}

export interface DatasetBrowserProps {
  data: DataRow[];
  columns: DataColumn[];
  totalRows: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (column: string, value: string) => void;
  loading?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLUMN_TYPE_ICONS: Record<ColumnType, React.FC<{ className?: string }>> = {
  text: Type,
  number: Hash,
  date: Calendar,
  boolean: ToggleLeft,
};

const AnimatedCounter: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const [displayed, setDisplayed] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const from = displayed;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (value - from) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{displayed.toLocaleString()}</span>;
};

// ---------------------------------------------------------------------------
// DatasetBrowser
// ---------------------------------------------------------------------------

export const DatasetBrowser: React.FC<DatasetBrowserProps> = ({
  data,
  columns,
  totalRows,
  onPageChange,
  onSort,
  onFilter,
  loading = false,
  className,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [showStats, setShowStats] = React.useState(false);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const handleSort = (col: DataColumn) => {
    if (!col.sortable || !onSort) return;
    let dir: 'asc' | 'desc' = 'asc';
    if (sortColumn === col.key) {
      dir = sortDir === 'asc' ? 'desc' : 'asc';
    }
    setSortColumn(col.key);
    setSortDir(dir);
    onSort(col.key, dir);
  };

  const handleFilter = (colKey: string, value: string) => {
    const next = { ...filters, [colKey]: value };
    if (!value) delete next[colKey];
    setFilters(next);
    onFilter?.(colKey, value);
  };

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setPage(clamped);
    onPageChange(clamped, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
    onPageChange(1, size);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((r) => r.id)));
    }
  };

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return '--';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Dataset</h2>
          <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs text-[hsl(var(--muted-foreground))]">
            <AnimatedCounter value={totalRows} className="font-medium text-[hsl(var(--foreground))]" />
            <span>rows</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowStats((v) => !v)}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              showStats
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
            )}
          >
            Stats
          </motion.button>
          {selectedRows.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Download className="h-3.5 w-3.5" />
              Export ({selectedRows.size})
            </motion.button>
          )}
        </div>
      </div>

      {/* Column stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {columns.map((col) => {
                const Icon = COLUMN_TYPE_ICONS[col.type];
                return (
                  <motion.div
                    key={col.key}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5"
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      <Icon className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      <span className="truncate text-xs font-medium text-[hsl(var(--foreground))]">{col.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <span>{col.type}</span>
                      {col.nullCount != null && <span>nulls: {col.nullCount}</span>}
                      {col.uniqueCount != null && <span>unique: {col.uniqueCount}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="mb-4 overflow-hidden rounded-lg border border-[hsl(var(--border))]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                <th className="w-8 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.size === data.length}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))]"
                  />
                </th>
                {columns.map((col) => {
                  const Icon = COLUMN_TYPE_ICONS[col.type];
                  const isSorted = sortColumn === col.key;
                  return (
                    <th key={col.key} className="px-3 py-2 text-left">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleSort(col)}
                          disabled={!col.sortable}
                          className={cn(
                            'flex items-center gap-1 text-left font-medium',
                            col.sortable
                              ? 'cursor-pointer text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]'
                              : 'cursor-default text-[hsl(var(--muted-foreground))]',
                          )}
                        >
                          <Icon className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                          {col.label}
                          {isSorted && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              {sortDir === 'asc' ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </motion.span>
                          )}
                        </button>
                        {col.filterable && onFilter && (
                          <div className="relative">
                            <Search className="absolute left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <input
                              type="text"
                              value={filters[col.key] ?? ''}
                              onChange={(e) => handleFilter(col.key, e.target.value)}
                              onFocus={() => setActiveFilter(col.key)}
                              onBlur={() => setActiveFilter(null)}
                              placeholder="Filter..."
                              className={cn(
                                'w-full rounded border bg-[hsl(var(--background))] py-0.5 pl-5 pr-1.5 text-[10px] font-normal text-[hsl(var(--foreground))] outline-none transition-colors',
                                activeFilter === col.key
                                  ? 'border-[hsl(var(--ring))]'
                                  : 'border-transparent hover:border-[hsl(var(--border))]',
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: pageSize }, (_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-[hsl(var(--border))] last:border-0">
                    <td className="px-2 py-2.5">
                      <div className="h-3.5 w-3.5 animate-pulse rounded bg-[hsl(var(--muted))]" />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-2.5">
                        <motion.div
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="h-3 w-3/4 rounded bg-[hsl(var(--muted))]"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    No data available
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {data.map((row) => {
                    const isSelected = selectedRows.has(row.id);
                    const isExpanded = expandedRow === row.id;
                    return (
                      <React.Fragment key={row.id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                          className={cn(
                            'cursor-pointer border-b border-[hsl(var(--border))] transition-colors last:border-0',
                            isSelected ? 'bg-[hsl(var(--primary))]/5' : 'hover:bg-[hsl(var(--muted))]/50',
                          )}
                        >
                          <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRowSelection(row.id)}
                              className="h-3.5 w-3.5 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))]"
                            />
                          </td>
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className="max-w-[200px] truncate px-3 py-2.5 text-[hsl(var(--foreground))]"
                            >
                              {formatCellValue(row[col.key])}
                            </td>
                          ))}
                        </motion.tr>
                        {/* Expanded row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td colSpan={columns.length + 1} className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    {columns.map((col) => (
                                      <div key={col.key} className="space-y-0.5">
                                        <span className="text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                                          {col.label}
                                        </span>
                                        <p className="whitespace-pre-wrap break-all text-xs text-[hsl(var(--foreground))]">
                                          {formatCellValue(row[col.key])}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
            className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-1.5 py-1 text-xs text-[hsl(var(--foreground))] outline-none"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs text-[hsl(var(--muted-foreground))]">
            Page {page} of {totalPages}
          </span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              page > 1 ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              page > 1 ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              page < totalPages ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePageChange(totalPages)}
            disabled={page >= totalPages}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              page < totalPages ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]' : 'text-[hsl(var(--muted-foreground))] opacity-40',
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

DatasetBrowser.displayName = 'DatasetBrowser';
