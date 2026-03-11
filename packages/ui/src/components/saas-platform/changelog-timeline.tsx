'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bug,
  Zap,
  AlertTriangle,
  ChevronDown,
  Search,
  Tag,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChangelogEntry {
  id: string;
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
  title: string;
  description: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  entries: ChangelogEntry[];
  isLatest?: boolean;
}

export interface ChangelogTimelineProps {
  versions: ChangelogVersion[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string; badge: string; label: string }
> = {
  feature: {
    icon: Sparkles,
    color: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    label: 'Feature',
  },
  fix: {
    icon: Bug,
    color: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    label: 'Fix',
  },
  improvement: {
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    label: 'Improvement',
  },
  breaking: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    label: 'Breaking',
  },
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Entry Component
// ---------------------------------------------------------------------------

function EntryItem({
  entry,
  index,
  isNew,
}: {
  entry: ChangelogEntry;
  index: number;
  isNew: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const config = typeConfig[entry.type] || typeConfig.feature;
  const Icon = config.icon;
  const isLong = entry.description.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex gap-3"
    >
      <div className={cn('mt-1 shrink-0', config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', config.badge)}>
            {config.label}
          </span>
          {isNew && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
            >
              New
            </motion.span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">{entry.title}</p>
        <div className="mt-1">
          <AnimatePresence initial={false}>
            <motion.div
              initial={false}
              animate={{ height: expanded || !isLong ? 'auto' : 48 }}
              className="overflow-hidden"
            >
              <p className="text-xs leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            </motion.div>
          </AnimatePresence>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 flex items-center gap-0.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              {expanded ? 'Show less' : 'Read more'}
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Version Node
// ---------------------------------------------------------------------------

function VersionNode({
  version,
  index,
  isFirst,
}: {
  version: ChangelogVersion;
  index: number;
  isFirst: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8"
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />

      {/* Timeline node */}
      <div className="absolute left-0 top-1">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: index * 0.1 }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full border-2',
            isFirst
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-muted-foreground',
          )}
        >
          <Tag className="h-3 w-3" />
        </motion.div>
      </div>

      {/* Version header */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <h3 className="text-base font-bold text-foreground">v{version.version}</h3>
        <span className="text-xs text-muted-foreground">{formatDate(version.date)}</span>
        {version.isLatest && (
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
          >
            Latest
          </motion.span>
        )}
      </div>

      {/* Entries */}
      <div className="mb-8 space-y-4">
        {version.entries.map((entry, ei) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            index={ei}
            isNew={!!version.isLatest}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChangelogTimeline({
  versions,
  className,
}: ChangelogTimelineProps) {
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const filtered = versions
    .map((v) => ({
      ...v,
      entries: v.entries.filter((e) => {
        const matchesQuery =
          !query ||
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.description.toLowerCase().includes(query.toLowerCase()) ||
          v.version.includes(query);
        const matchesType = !typeFilter || e.type === typeFilter;
        return matchesQuery && matchesType;
      }),
    }))
    .filter((v) => v.entries.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full', className)}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Changelog</h2>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search changelog..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter(null)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              !typeFilter
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted/50',
            )}
          >
            All
          </button>
          {Object.entries(typeConfig).map(([key, conf]) => {
            const Icon = conf.icon;
            return (
              <button
                key={key}
                onClick={() => setTypeFilter(typeFilter === key ? null : key)}
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  typeFilter === key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted/50',
                )}
              >
                <Icon className="h-3 w-3" />
                {conf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-sm text-muted-foreground"
          >
            No changelog entries found
          </motion.div>
        ) : (
          filtered.map((version, i) => (
            <VersionNode
              key={version.version}
              version={version}
              index={i}
              isFirst={i === 0}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

ChangelogTimeline.displayName = 'ChangelogTimeline';
