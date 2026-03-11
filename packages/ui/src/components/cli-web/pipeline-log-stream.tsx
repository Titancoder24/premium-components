'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowDownToLine,
  Pause,
  Play,
  Filter,
  Hash,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface PipelineLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  stage?: string;
  message: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status?: 'running' | 'completed' | 'failed' | 'pending';
}

export interface PipelineLogStreamProps {
  logs: PipelineLog[];
  stages?: PipelineStage[];
  autoScroll?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const levelConfig: Record<LogLevel, { color: string; bg: string; badge: string }> = {
  INFO: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    badge: 'text-blue-400 bg-blue-500/10',
  },
  WARN: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    badge: 'text-amber-400 bg-amber-500/10',
  },
  ERROR: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    badge: 'text-red-400 bg-red-500/10',
  },
  DEBUG: {
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
    badge: 'text-zinc-500 bg-zinc-500/10',
  },
};

const logEntryVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const stageStatusColors: Record<string, string> = {
  running: 'text-blue-400',
  completed: 'text-emerald-400',
  failed: 'text-red-400',
  pending: 'text-zinc-500',
};

// ---------------------------------------------------------------------------
// StageSection
// ---------------------------------------------------------------------------

const StageSection: React.FC<{
  stage: PipelineStage;
  logs: PipelineLog[];
  defaultOpen?: boolean;
}> = ({ stage, logs, defaultOpen = true }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const statusColor = stageStatusColors[stage.status ?? 'pending'];

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-zinc-800/60"
      >
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-flex"
        >
          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
        </motion.span>
        <span className={cn('text-xs font-bold uppercase tracking-wider', statusColor)}>
          {stage.name}
        </span>
        <span className="text-[10px] text-zinc-600">{logs.length} lines</span>
        {stage.status && (
          <span className={cn('ml-auto text-[10px] capitalize', statusColor)}>
            {stage.status}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="ml-2 border-l border-zinc-700 pl-3">
              {logs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// LogEntry
// ---------------------------------------------------------------------------

const LogEntry: React.FC<{ log: PipelineLog }> = ({ log }) => {
  const config = levelConfig[log.level];

  return (
    <motion.div
      variants={logEntryVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-start gap-2 py-0.5 font-mono text-xs"
    >
      <span className="shrink-0 text-zinc-600">{log.timestamp}</span>
      <span
        className={cn(
          'shrink-0 rounded px-1 py-0.5 text-[10px] font-bold leading-none',
          config.badge,
        )}
      >
        {log.level}
      </span>
      <span
        className={cn(
          'whitespace-pre-wrap',
          log.level === 'ERROR' ? 'text-red-300' :
          log.level === 'WARN' ? 'text-amber-200' :
          log.level === 'DEBUG' ? 'text-zinc-500' :
          'text-zinc-300',
        )}
      >
        {log.message}
      </span>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// PipelineLogStream
// ---------------------------------------------------------------------------

export const PipelineLogStream: React.FC<PipelineLogStreamProps> = ({
  logs,
  stages,
  autoScroll: initialAutoScroll = true,
  className,
}) => {
  const [autoScroll, setAutoScroll] = React.useState(initialAutoScroll);
  const [levelFilter, setLevelFilter] = React.useState<LogLevel | 'ALL'>('ALL');
  const [stageFilter, setStageFilter] = React.useState<string | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = React.useState(false);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    let result = logs;
    if (levelFilter !== 'ALL') {
      result = result.filter((l) => l.level === levelFilter);
    }
    if (stageFilter !== 'ALL') {
      result = result.filter((l) => l.stage === stageFilter);
    }
    return result;
  }, [logs, levelFilter, stageFilter]);

  // Auto-scroll effect
  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // Track scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 40;
    setIsAtBottom(atBottom);
    if (!atBottom && autoScroll) {
      setAutoScroll(false);
    }
  };

  const jumpToBottom = () => {
    setAutoScroll(true);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Group logs by stage if stages are defined
  const hasStages = stages && stages.length > 0;
  const uniqueStages = React.useMemo(() => {
    if (stages) return stages;
    const ids = Array.from(new Set(logs.map((l) => l.stage).filter(Boolean)));
    return ids.map((id) => ({ id: id!, name: id!, status: undefined }));
  }, [stages, logs]);

  const logsByStage = React.useMemo(() => {
    const map = new Map<string, PipelineLog[]>();
    for (const log of filteredLogs) {
      const key = log.stage ?? '__none__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(log);
    }
    return map;
  }, [filteredLogs]);

  const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl dark:border-zinc-600',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5 dark:border-zinc-600">
        <Hash className="h-4 w-4 text-zinc-400" />
        <span className="text-sm font-semibold text-zinc-100">Pipeline Logs</span>
        <span className="text-[10px] text-zinc-500">{filteredLogs.length} lines</span>

        <div className="flex-1" />

        {/* Filter toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            'flex h-6 items-center gap-1 rounded-md px-2 text-[10px] transition-colors',
            showFilters
              ? 'bg-blue-500/20 text-blue-400'
              : 'text-zinc-400 hover:bg-zinc-700',
          )}
        >
          <Filter className="h-3 w-3" />
          Filters
        </motion.button>

        {/* Auto-scroll toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAutoScroll((v) => !v)}
          className={cn(
            'flex h-6 items-center gap-1 rounded-md px-2 text-[10px] transition-colors',
            autoScroll
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-zinc-400 hover:bg-zinc-700',
          )}
        >
          {autoScroll ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          {autoScroll ? 'Scroll Lock' : 'Auto-scroll'}
        </motion.button>
      </div>

      {/* Filter bar */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden border-b border-zinc-700 bg-zinc-800/60"
          >
            <div className="flex flex-wrap items-center gap-3 px-4 py-2">
              {/* Level filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Level</span>
                <div className="flex gap-1">
                  {(['ALL', ...levels] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setLevelFilter(level)}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                        levelFilter === level
                          ? level === 'ALL'
                            ? 'bg-zinc-600 text-zinc-100'
                            : levelConfig[level].badge
                          : 'text-zinc-500 hover:text-zinc-300',
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage filter */}
              {uniqueStages.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">Stage</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setStageFilter('ALL')}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                        stageFilter === 'ALL'
                          ? 'bg-zinc-600 text-zinc-100'
                          : 'text-zinc-500 hover:text-zinc-300',
                      )}
                    >
                      ALL
                    </button>
                    {uniqueStages.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStageFilter(s.id)}
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                          stageFilter === s.id
                            ? 'bg-zinc-600 text-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-300',
                        )}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log output */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ minHeight: 200, maxHeight: 480 }}
      >
        {hasStages && stageFilter === 'ALL' ? (
          uniqueStages.map((stage) => {
            const stageLogs = logsByStage.get(stage.id) ?? [];
            if (stageLogs.length === 0) return null;
            return (
              <StageSection
                key={stage.id}
                stage={stage}
                logs={stageLogs}
              />
            );
          })
        ) : (
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </AnimatePresence>
        )}

        {filteredLogs.length === 0 && (
          <div className="flex items-center justify-center py-8 text-xs text-zinc-600">
            No log entries match the current filters
          </div>
        )}
      </div>

      {/* Jump to bottom FAB */}
      <AnimatePresence>
        {!isAtBottom && !autoScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={jumpToBottom}
            className="absolute bottom-3 right-4 flex h-8 items-center gap-1.5 rounded-full border border-zinc-600 bg-zinc-800 px-3 text-xs text-zinc-300 shadow-lg transition-colors hover:bg-zinc-700"
          >
            <ArrowDownToLine className="h-3 w-3" />
            Jump to bottom
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

PipelineLogStream.displayName = 'PipelineLogStream';
