'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Pause,
  Play,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  source?: string;
  details?: string;
}

export interface LogViewerProps {
  logs: LogEntry[];
  onClear?: () => void;
  autoScroll?: boolean;
  maxEntries?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const levelConfig: Record<LogLevel, { icon: React.ReactNode; badge: string; glow: string }> = {
  error: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    glow: 'shadow-[0_0_6px_rgba(244,63,94,0.3)]',
  },
  warn: {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    glow: 'shadow-[0_0_6px_rgba(245,158,11,0.3)]',
  },
  info: {
    icon: <Info className="h-3.5 w-3.5" />,
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_6px_rgba(59,130,246,0.25)]',
  },
  debug: {
    icon: <Bug className="h-3.5 w-3.5" />,
    badge: 'bg-gray-500/15 text-gray-500 dark:text-gray-400',
    glow: '',
  },
};

const allLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];

const entryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.15 } },
};

const clearVariants = {
  exit: (i: number) => ({
    opacity: 0,
    x: -40,
    transition: { duration: 0.15, delay: i * 0.03 },
  }),
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-300/40 dark:bg-yellow-500/30 text-inherit rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// ---------------------------------------------------------------------------
// LogViewer
// ---------------------------------------------------------------------------

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  onClear,
  autoScroll: autoScrollProp = true,
  maxEntries = 500,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [activeLevels, setActiveLevels] = React.useState<Set<LogLevel>>(new Set(allLevels));
  const [paused, setPaused] = React.useState(!autoScrollProp);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const toggleLevel = (level: LogLevel) => {
    setActiveLevels((prev) => {
      const s = new Set(prev);
      if (s.has(level)) s.delete(level);
      else s.add(level);
      return s;
    });
  };

  const filtered = React.useMemo(() => {
    const trimmed = logs.slice(-maxEntries);
    return trimmed.filter((log) => {
      if (!activeLevels.has(log.level)) return false;
      if (search.trim() && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [logs, maxEntries, activeLevels, search]);

  const matchCount = search.trim()
    ? logs.filter((l) => l.message.toLowerCase().includes(search.toLowerCase())).length
    : 0;

  // Auto-scroll
  React.useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [filtered.length, paused]);

  return (
    <div className={cn('rounded-xl border border-border bg-card flex flex-col', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full rounded-md border border-border bg-muted/30 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
          />
          {search.trim() && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
              {matchCount} match{matchCount !== 1 && 'es'}
            </span>
          )}
        </div>

        {/* Level toggles */}
        <div className="flex gap-1">
          <AnimatePresence initial={false}>
            {allLevels.map((level) => (
              <motion.button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                layout
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors',
                  activeLevels.has(level)
                    ? levelConfig[level].badge
                    : 'bg-muted/50 text-muted-foreground/50',
                )}
              >
                {level.toUpperCase()}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={paused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
            aria-label="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-[200px] max-h-[500px]"
      >
        <AnimatePresence initial={false} custom={0}>
          {filtered.map((log, i) => (
            <motion.div
              key={log.id}
              variants={entryVariants}
              initial="hidden"
              animate="visible"
              exit={clearVariants.exit(i)}
              layout
              className={cn(
                'group flex flex-col border-b border-border/50 px-4 py-2 hover:bg-muted/30 transition-colors cursor-pointer',
              )}
              onClick={() => log.details && setExpandedId(expandedId === log.id ? null : log.id)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    levelConfig[log.level].badge,
                    levelConfig[log.level].glow,
                  )}
                >
                  {levelConfig[log.level].icon}
                  {log.level.toUpperCase()}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                  {log.timestamp}
                </span>
                {log.source && (
                  <span className="text-[10px] text-muted-foreground truncate">
                    {log.source}
                  </span>
                )}
                <span className="flex-1 text-xs text-foreground truncate">
                  {highlightText(log.message, search)}
                </span>
                {log.details && (
                  <motion.span
                    animate={{ rotate: expandedId === log.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </motion.span>
                )}
              </div>

              <AnimatePresence>
                {expandedId === log.id && log.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    className="overflow-hidden"
                  >
                    <pre className="mt-2 rounded-md bg-muted/50 p-3 font-mono text-[11px] text-foreground whitespace-pre-wrap">
                      {log.details}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {logs.length === 0 ? 'No log entries yet.' : 'No logs match the current filters.'}
          </div>
        )}
      </div>
    </div>
  );
};

LogViewer.displayName = 'LogViewer';
