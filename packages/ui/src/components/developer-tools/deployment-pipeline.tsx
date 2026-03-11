'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  SkipForward,
  GitCommit,
  User,
  ChevronDown,
  Timer,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StageStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export interface PipelineStage {
  id: string;
  name: string;
  status: StageStatus;
  duration?: number;
  details?: string;
  icon?: React.ElementType;
}

export interface CommitInfo {
  hash: string;
  author: string;
  message: string;
}

export interface DeploymentPipelineProps {
  stages: PipelineStage[];
  commit?: CommitInfo;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<
  StageStatus,
  { color: string; bg: string; lineColor: string }
> = {
  pending: { color: 'text-gray-400 dark:text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', lineColor: 'bg-gray-300 dark:bg-gray-600' },
  running: { color: 'text-blue-500', bg: 'bg-blue-500/10', lineColor: 'bg-blue-400' },
  success: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', lineColor: 'bg-emerald-500' },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', lineColor: 'bg-red-500' },
  skipped: { color: 'text-gray-400 dark:text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', lineColor: 'bg-gray-300 dark:bg-gray-600' },
};

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ---------------------------------------------------------------------------
// StageIcon
// ---------------------------------------------------------------------------

const StageStatusIcon: React.FC<{ status: StageStatus }> = ({ status }) => {
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
    case 'success':
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
    case 'skipped':
      return <SkipForward className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
    case 'pending':
    default:
      return <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
  }
};

// ---------------------------------------------------------------------------
// AnimatedDuration
// ---------------------------------------------------------------------------

const AnimatedDuration: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    const initial = display;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / 600);
      setDisplay(Math.round(initial + (value - initial) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{formatDuration(display)}</span>;
};

// ---------------------------------------------------------------------------
// Connector Line
// ---------------------------------------------------------------------------

const ConnectorLine: React.FC<{ fromStatus: StageStatus; toStatus: StageStatus }> = ({
  fromStatus,
}) => {
  const isComplete = fromStatus === 'success';
  const isFailed = fromStatus === 'failed';

  return (
    <div className="relative mx-1 flex h-0.5 w-8 items-center self-center sm:w-12">
      <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isComplete || isFailed ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'absolute inset-0 origin-left rounded-full',
          isComplete ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : '',
        )}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// DeploymentPipeline
// ---------------------------------------------------------------------------

export const DeploymentPipeline: React.FC<DeploymentPipelineProps> = ({
  stages,
  commit,
  className,
}) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

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
      {/* Commit Header */}
      {commit && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg bg-[hsl(var(--muted))]/50 px-4 py-3">
          <GitCommit className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs text-[hsl(var(--foreground))]">
            {commit.hash.slice(0, 7)}
          </code>
          <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
            <User className="h-3 w-3" /> {commit.author}
          </span>
          <span className="text-xs text-[hsl(var(--foreground))]">{commit.message}</span>
        </div>
      )}

      {/* Pipeline Stages */}
      <div className="flex flex-wrap items-start justify-center gap-y-4">
        {stages.map((stage, idx) => {
          const config = statusConfig[stage.status];
          const isExpanded = expandedId === stage.id;
          const StageIcon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              {idx > 0 && (
                <ConnectorLine
                  fromStatus={stages[idx - 1].status}
                  toStatus={stage.status}
                />
              )}

              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : stage.id)}
                  whileHover={{ y: -2 }}
                  className={cn(
                    'relative flex flex-col items-center rounded-xl border border-[hsl(var(--border))] px-4 py-3 transition-shadow hover:shadow-md',
                    config.bg,
                  )}
                >
                  {/* Pulsing ring for running */}
                  {stage.status === 'running' && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-blue-400"
                      animate={{ opacity: [0.6, 0], scale: [1, 1.08] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}

                  <div className="mb-2">
                    {StageIcon ? (
                      <StageIcon className={cn('h-5 w-5', config.color)} />
                    ) : (
                      <StageStatusIcon status={stage.status} />
                    )}
                  </div>
                  <span className="text-xs font-medium text-[hsl(var(--foreground))]">
                    {stage.name}
                  </span>
                  {stage.duration != null && (
                    <span className="mt-1 flex items-center gap-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                      <Timer className="h-3 w-3" />
                      <AnimatedDuration value={stage.duration} />
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      'mt-1 h-3 w-3 text-[hsl(var(--muted-foreground))] transition-transform',
                      isExpanded && 'rotate-180',
                    )}
                  />
                </motion.button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && stage.details && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="mt-2 w-40 overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
                    >
                      <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {stage.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </motion.div>
  );
};

DeploymentPipeline.displayName = 'DeploymentPipeline';
