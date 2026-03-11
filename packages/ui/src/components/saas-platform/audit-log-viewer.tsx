'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  Edit,
  UserCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditActionType = 'create' | 'update' | 'delete' | 'access';

export interface AuditEntry {
  id: string;
  actor: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  action: AuditActionType;
  target: string;
  description?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, string>;
}

export interface AuditLogViewerProps {
  entries: AuditEntry[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  onExport?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

const actionConfig: Record<
  AuditActionType,
  { color: string; bgColor: string; icon: React.ElementType }
> = {
  create: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    icon: Plus,
  },
  update: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: Edit,
  },
  delete: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    icon: Trash2,
  },
  access: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-500/10',
    icon: Eye,
  },
};

// ---------------------------------------------------------------------------
// AuditLogViewer
// ---------------------------------------------------------------------------

export function AuditLogViewer({
  entries,
  onLoadMore,
  hasMore,
  loading,
  onExport,
  className,
}: AuditLogViewerProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [filterAction, setFilterAction] = React.useState<
    AuditActionType | 'all'
  >('all');
  const [filterActor, setFilterActor] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const filteredEntries = entries.filter((entry) => {
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (
      filterActor &&
      !entry.actor.name.toLowerCase().includes(filterActor.toLowerCase()) &&
      !entry.actor.email.toLowerCase().includes(filterActor.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Audit Log</h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50',
              showFilters
                ? 'bg-muted/50 text-foreground'
                : 'text-muted-foreground',
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </motion.button>
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Action
                </label>
                <select
                  value={filterAction}
                  onChange={(e) =>
                    setFilterAction(e.target.value as AuditActionType | 'all')
                  }
                  className="rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="access">Access</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Actor
                </label>
                <input
                  type="text"
                  value={filterActor}
                  onChange={(e) => setFilterActor(e.target.value)}
                  placeholder="Name or email"
                  className="rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline entries */}
      <div className="relative space-y-0">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-border" />

        {filteredEntries.map((entry, i) => {
          const config = actionConfig[entry.action];
          const isExpanded = expandedId === entry.id;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="relative pb-4 pl-12"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-2.5 top-1 flex h-[14px] w-[14px] items-center justify-center rounded-full',
                  config.bgColor,
                )}
              >
                <div
                  className={cn('h-2 w-2 rounded-full', {
                    'bg-emerald-500': entry.action === 'create',
                    'bg-blue-500': entry.action === 'update',
                    'bg-red-500': entry.action === 'delete',
                    'bg-gray-500': entry.action === 'access',
                  })}
                />
              </div>

              {/* Entry card */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : entry.id)
                }
                className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/30"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  {entry.actor.avatarUrl ? (
                    <img
                      src={entry.actor.avatarUrl}
                      alt={entry.actor.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{entry.actor.name}</span>{' '}
                    <span className={cn('font-medium', config.color)}>
                      {entry.action}d
                    </span>{' '}
                    <span className="font-medium">{entry.target}</span>
                  </p>
                  {entry.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {entry.description}
                    </p>
                  )}
                </div>

                {/* Timestamp & expand */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    {relativeTime(entry.timestamp)}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              {/* Expandable detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-11 mt-1 space-y-1.5 rounded-lg border border-border bg-muted/20 p-3">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">
                          Action:{' '}
                          <span className={cn('font-medium', config.color)}>
                            {entry.action}
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          Time:{' '}
                          <span className="font-medium text-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      {entry.ip && (
                        <p className="text-xs text-muted-foreground">
                          IP:{' '}
                          <span className="font-medium text-foreground">
                            {entry.ip}
                          </span>
                        </p>
                      )}
                      {entry.userAgent && (
                        <p className="truncate text-xs text-muted-foreground">
                          User Agent:{' '}
                          <span className="font-medium text-foreground">
                            {entry.userAgent}
                          </span>
                        </p>
                      )}
                      {entry.metadata &&
                        Object.entries(entry.metadata).map(([key, val]) => (
                          <p
                            key={key}
                            className="text-xs text-muted-foreground"
                          >
                            {key}:{' '}
                            <span className="font-medium text-foreground">
                              {val}
                            </span>
                          </p>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredEntries.length === 0 && !loading && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No audit entries found.
        </div>
      )}

      {/* Load more */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? 'Loading...' : 'Load More'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

AuditLogViewer.displayName = 'AuditLogViewer';
