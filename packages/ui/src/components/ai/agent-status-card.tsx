'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Pause,
  X,
  RotateCcw,
  Bot,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AgentStatus = 'running' | 'completed' | 'failed' | 'queued';

export interface AgentStatusCardProps {
  agentName: string;
  status: AgentStatus;
  task: string;
  startTime: string;
  progress?: number;
  onPause?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<
  AgentStatus,
  { label: string; color: string; bgColor: string }
> = {
  running: {
    label: 'Running',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  failed: {
    label: 'Failed',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  queued: {
    label: 'Queued',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

// ---------------------------------------------------------------------------
// StatusIcon
// ---------------------------------------------------------------------------

const StatusIcon: React.FC<{ status: AgentStatus }> = ({ status }) => {
  switch (status) {
    case 'running':
      return (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-flex"
        >
          <Loader2 className="h-5 w-5 text-blue-500" />
        </motion.span>
      );
    case 'completed':
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="inline-flex"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </motion.span>
      );
    case 'failed':
      return (
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, -3, 3, -3, 3, 0] }}
          transition={{ duration: 0.4 }}
          className="inline-flex"
        >
          <XCircle className="h-5 w-5 text-red-500" />
        </motion.span>
      );
    case 'queued':
      return <Clock className="h-5 w-5 text-amber-500" />;
  }
};

// ---------------------------------------------------------------------------
// AgentStatusCard
// ---------------------------------------------------------------------------

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  agentName,
  status,
  task,
  startTime,
  progress = 0,
  onPause,
  onCancel,
  onRetry,
  className,
}) => {
  const config = statusConfig[status];
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--muted))]">
            <Bot className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {agentName}
            </h3>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Started {startTime}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1',
            config.bgColor,
          )}
        >
          <StatusIcon status={status} />
          <span className={cn('text-xs font-medium', config.color)}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Task description */}
      <p className="mb-4 text-sm leading-relaxed text-[hsl(var(--foreground))]">
        {task}
      </p>

      {/* Progress bar */}
      {(status === 'running' || status === 'queued') && (
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Progress
            </span>
            <span className="text-xs font-medium text-[hsl(var(--foreground))]">
              {Math.round(clampedProgress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                status === 'running' ? 'bg-blue-500' : 'bg-amber-500',
              )}
            />
          </div>
        </div>
      )}

      {/* Completed progress (full bar) */}
      {status === 'completed' && (
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              Progress
            </span>
            <span className="text-xs font-medium text-emerald-500">100%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <AnimatePresence mode="wait">
        <div className="flex items-center gap-2 border-t border-[hsl(var(--border))] pt-3">
          {status === 'running' && onPause && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onPause}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <Pause className="h-3.5 w-3.5" />
              Pause
            </motion.button>
          )}

          {(status === 'running' || status === 'queued') && onCancel && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onCancel}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </motion.button>
          )}

          {status === 'failed' && onRetry && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onRetry}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:opacity-90"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </motion.button>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

AgentStatusCard.displayName = 'AgentStatusCard';
