'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  Settings,
  FileText,
  Trash2,
  Plus,
  Edit,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuditEntry {
  id: string;
  action: string;
  category: 'auth' | 'user' | 'settings' | 'data' | 'billing' | 'security';
  actor: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  target?: string;
  timestamp: string;
  metadata?: Record<string, string>;
  severity?: 'info' | 'warning' | 'critical';
}

export interface AuditLogViewerProps {
  entries: AuditEntry[];
  onLoadMore?: () => void;
  onExport?: () => void;
  pageSize?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryIcons: Record<string, React.ReactNode> = {
  auth: <Shield className="h-3.5 w-3.5" />,
  user: <User className="h-3.5 w-3.5" />,
  settings: <Settings className="h-3.5 w-3.5" />,
  data: <FileText className="h-3.5 w-3.5" />,
  billing: <FileText className="h-3.5 w-3.5" />,
  security: <Shield className="h-3.5 w-3.5" />,
};

const severityColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AuditLogViewer({
  entries,
  onLoadMore,
  onExport,
  pageSize = 10,
  className,
}: AuditLogViewerProps) {
  const [query, setQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const filtered = entries.filter((e) => {
    const matchesQuery =
      !query ||
      e.action.toLowerCase().includes(query.toLowerCase()) ||
      e.actor.name.toLowerCase().includes(query.toLowerCase()) ||
      e.actor.email.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !categoryFilter || e.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const categories = Array.from(new Set(entries.map((e) => e.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full rounded-xl border border-border bg-card shadow-sm', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Audit Log</h2>
        </div>
        {onExport && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            <FileText className="h-3.5 w-3.5" />
            Export
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search audit logs..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              categoryFilter
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            {categoryFilter ? categoryFilter : 'Filter'}
            <ChevronDown className="h-3 w-3" />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                <button
                  onClick={() => { setCategoryFilter(null); setFilterOpen(false); setPage(0); }}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-xs transition-colors hover:bg-muted/50',
                    !categoryFilter ? 'font-medium text-primary' : 'text-foreground',
                  )}
                >
                  All categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryFilter(cat); setFilterOpen(false); setPage(0); }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-xs capitalize transition-colors hover:bg-muted/50',
                      categoryFilter === cat ? 'font-medium text-primary' : 'text-foreground',
                    )}
                  >
                    {categoryIcons[cat]}
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-border">
        <AnimatePresence>
          {paginated.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="px-5 py-3"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  entry.severity === 'critical'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : entry.severity === 'warning'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-muted text-muted-foreground',
                )}>
                  {categoryIcons[entry.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{entry.action}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.actor.name} {entry.target && <span>&middot; {entry.target}</span>}
                  </p>
                </div>
                {entry.severity && entry.severity !== 'info' && (
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', severityColors[entry.severity])}>
                    {entry.severity}
                  </span>
                )}
                <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(entry.timestamp)}</span>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedId === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-11 mt-2 space-y-1.5 rounded-lg bg-muted/30 p-3 text-xs">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Time:</span>{' '}
                        {formatTimestamp(entry.timestamp)}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Actor:</span>{' '}
                        {entry.actor.name} ({entry.actor.email})
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Category:</span>{' '}
                        <span className="capitalize">{entry.category}</span>
                      </p>
                      {entry.metadata && Object.entries(entry.metadata).map(([key, val]) => (
                        <p key={key} className="text-muted-foreground">
                          <span className="font-medium text-foreground capitalize">{key}:</span> {val}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        {paginated.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No audit entries found</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-foreground">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

AuditLogViewer.displayName = 'AuditLogViewer';
