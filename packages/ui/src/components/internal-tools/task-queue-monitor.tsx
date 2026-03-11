'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCw,
  XOctagon,
  ChevronDown,
  RefreshCw,
  Filter,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface QueueJob {
  id: string;
  name: string;
  type: string;
  status: JobStatus;
  progress?: number;
  createdAt: string;
  startedAt?: string;
  duration?: string;
  logs?: string[];
  output?: string;
}

export interface TaskQueueMonitorProps {
  jobs: QueueJob[];
  onRetry?: (jobId: string) => void | Promise<void>;
  onCancel?: (jobId: string) => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  JobStatus,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  queued: {
    icon: Clock,
    color: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    label: 'Queued',
  },
  running: {
    icon: Play,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    label: 'Running',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/40',
    label: 'Failed',
  },
};

// ---------------------------------------------------------------------------
// Job card
// ---------------------------------------------------------------------------

function JobCard({
  job,
  onRetry,
  onCancel,
}: {
  job: QueueJob;
  onRetry?: (id: string) => void | Promise<void>;
  onCancel?: (id: string) => void | Promise<void>;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);
  const config = statusConfig[job.status];
  const Icon = config.icon;

  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetrying(true);
    await onRetry?.(job.id);
    setTimeout(() => setRetrying(false), 600);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel?.(job.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-border bg-card transition-colors hover:border-border/80"
    >
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Status icon */}
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}>
          {job.status === 'running' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className={cn('h-4 w-4', config.color)} />
            </motion.div>
          ) : (
            <Icon className={cn('h-4 w-4', config.color)} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{job.name}</span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {job.type}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Created: {job.createdAt}</span>
            {job.startedAt && <span>Started: {job.startedAt}</span>}
            {job.duration && <span>Duration: {job.duration}</span>}
          </div>
        </div>

        {/* Status badge */}
        <span className={cn('shrink-0 text-xs font-medium', config.color)}>{config.label}</span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {job.status === 'failed' && onRetry && (
            <motion.button
              type="button"
              onClick={handleRetry}
              animate={retrying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </motion.button>
          )}
          {(job.status === 'queued' || job.status === 'running') && onCancel && (
            <motion.button
              type="button"
              onClick={handleCancel}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
            >
              <XOctagon className="h-3.5 w-3.5" />
            </motion.button>
          )}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        </div>
      </div>

      {/* Running progress bar */}
      {job.status === 'running' && job.progress !== undefined && (
        <div className="px-4 pb-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${job.progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="mt-0.5 block text-right text-[10px] text-muted-foreground">
            {Math.round(job.progress)}%
          </span>
        </div>
      )}

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-3">
              {job.output && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-foreground">Output</span>
                  <p className="mt-1 text-xs text-muted-foreground">{job.output}</p>
                </div>
              )}
              {job.logs && job.logs.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-foreground">Logs</span>
                  <div className="mt-1 max-h-32 overflow-y-auto rounded-md bg-muted/50 p-2 font-mono text-[11px] text-muted-foreground dark:bg-muted/30">
                    {job.logs.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
              {!job.output && (!job.logs || job.logs.length === 0) && (
                <p className="text-xs text-muted-foreground">No additional details available.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// TaskQueueMonitor
// ---------------------------------------------------------------------------

export function TaskQueueMonitor({
  jobs,
  onRetry,
  onCancel,
  onRefresh,
  className,
}: TaskQueueMonitorProps) {
  const [filter, setFilter] = React.useState<JobStatus | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval>>();

  React.useEffect(() => {
    if (autoRefresh && onRefresh) {
      intervalRef.current = setInterval(() => onRefresh(), 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, onRefresh]);

  const counts = React.useMemo(() => {
    const c = { queued: 0, running: 0, completed: 0, failed: 0 };
    jobs.forEach((j) => c[j.status]++);
    return c;
  }, [jobs]);

  const filtered = React.useMemo(
    () => (filter === 'all' ? jobs : jobs.filter((j) => j.status === filter)),
    [jobs, filter],
  );

  return (
    <div className={cn('space-y-4 rounded-lg border border-border bg-card p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Task Queue</h3>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setAutoRefresh((v) => !v)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors',
                autoRefresh ? 'bg-primary' : 'bg-muted',
              )}
            >
              <motion.div
                animate={{ x: autoRefresh ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
              />
            </button>
            Auto-refresh
          </label>
          {onRefresh && (
            <motion.button
              type="button"
              onClick={onRefresh}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-2">
        {(['queued', 'running', 'completed', 'failed'] as JobStatus[]).map((status) => {
          const cfg = statusConfig[status];
          return (
            <motion.button
              key={status}
              type="button"
              onClick={() => setFilter((f) => (f === status ? 'all' : status))}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                filter === status
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <Filter className="h-3 w-3" />
              {cfg.label}: {counts[status]}
            </motion.button>
          );
        })}
      </div>

      {/* Job list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              No jobs found{filter !== 'all' ? ` with status "${filter}"` : ''}.
            </motion.div>
          ) : (
            filtered.map((job) => (
              <JobCard key={job.id} job={job} onRetry={onRetry} onCancel={onCancel} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

TaskQueueMonitor.displayName = 'TaskQueueMonitor';
