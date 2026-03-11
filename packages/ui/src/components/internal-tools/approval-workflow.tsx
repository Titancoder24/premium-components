'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Clock,
  SkipForward,
  MessageSquare,
  Send,
  ChevronDown,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'skipped';

export interface ApprovalComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface ApprovalStep {
  id: string;
  approverName: string;
  approverId: string;
  avatarUrl?: string;
  status: ApprovalStatus;
  timestamp?: string;
  comments: ApprovalComment[];
}

export interface ApprovalWorkflowProps {
  steps: ApprovalStep[];
  currentUserId?: string;
  onApprove?: (stepId: string) => void | Promise<void>;
  onReject?: (stepId: string, reason?: string) => void | Promise<void>;
  onComment?: (stepId: string, text: string) => void | Promise<void>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<ApprovalStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40', icon: Clock },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', icon: Check },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40', icon: X },
  skipped: { label: 'Skipped', color: 'text-muted-foreground', bg: 'bg-muted', icon: SkipForward },
};

function getOverallStatus(steps: ApprovalStep[]): { label: string; color: string } {
  if (steps.some((s) => s.status === 'rejected')) return { label: 'Rejected', color: 'text-red-600 dark:text-red-400' };
  if (steps.every((s) => s.status === 'approved' || s.status === 'skipped')) return { label: 'Approved', color: 'text-green-600 dark:text-green-400' };
  return { label: 'In Progress', color: 'text-amber-500' };
}

// ---------------------------------------------------------------------------
// Step icon component
// ---------------------------------------------------------------------------

function StepIcon({ status }: { status: ApprovalStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (status === 'approved') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}
      >
        <Icon className={cn('h-4 w-4', config.color)} />
      </motion.div>
    );
  }

  if (status === 'rejected') {
    return (
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -4, 4, -3, 3, 0] }}
        transition={{ duration: 0.5 }}
        className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}
      >
        <Icon className={cn('h-4 w-4', config.color)} />
      </motion.div>
    );
  }

  if (status === 'pending') {
    return (
      <motion.div
        animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.3)', '0 0 0 8px rgba(245,158,11,0)', '0 0 0 0 rgba(245,158,11,0)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}
      >
        <Icon className={cn('h-4 w-4', config.color)} />
      </motion.div>
    );
  }

  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}>
      <Icon className={cn('h-4 w-4', config.color)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comment thread
// ---------------------------------------------------------------------------

function CommentThread({
  comments,
  stepId,
  onComment,
}: {
  comments: ApprovalComment[];
  stepId: string;
  onComment?: (stepId: string, text: string) => void | Promise<void>;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [text, setText] = React.useState('');

  const handleSubmit = () => {
    if (!text.trim() || !onComment) return;
    onComment(stepId, text.trim());
    setText('');
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <MessageSquare className="h-3 w-3" />
        {comments.length} comment{comments.length !== 1 ? 's' : ''}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-border">
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs"
                >
                  <span className="font-medium text-foreground">{c.authorName}</span>
                  <span className="ml-2 text-muted-foreground">{c.timestamp}</span>
                  <p className="mt-0.5 text-muted-foreground">{c.text}</p>
                </motion.div>
              ))}
              {onComment && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className="rounded-md bg-primary p-1.5 text-primary-foreground disabled:opacity-40"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ApprovalWorkflow
// ---------------------------------------------------------------------------

export function ApprovalWorkflow({
  steps,
  currentUserId,
  onApprove,
  onReject,
  onComment,
  className,
}: ApprovalWorkflowProps) {
  const overall = getOverallStatus(steps);
  const currentPendingStep = steps.find(
    (s) => s.status === 'pending' && s.approverId === currentUserId
  );

  return (
    <div className={cn('w-full rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Approval Workflow</h3>
        <span className={cn('text-sm font-medium', overall.color)}>{overall.label}</span>
      </div>

      {/* Timeline */}
      <div className="px-4 py-4">
        <div className="relative space-y-0">
          {steps.map((step, i) => {
            const isCurrent = step.status === 'pending' && step.approverId === currentUserId;
            const isLast = i === steps.length - 1;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                className="relative flex gap-3 pb-6"
              >
                {/* Vertical line */}
                {!isLast && (
                  <div className="absolute left-4 top-8 h-full w-px -translate-x-1/2 bg-border" />
                )}

                {/* Icon */}
                <div className="relative z-10 shrink-0">
                  <StepIcon status={step.status} />
                </div>

                {/* Content */}
                <div className={cn('flex-1 rounded-lg border px-3 py-2.5', isCurrent ? 'border-primary/50 shadow-[0_0_0_1px] shadow-primary/20' : 'border-border')}>
                  <div className="flex items-center gap-2">
                    {step.avatarUrl ? (
                      <img src={step.avatarUrl} alt="" className="h-5 w-5 rounded-full" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">{step.approverName}</span>
                    <span className={cn('ml-auto text-xs', statusConfig[step.status].color)}>
                      {statusConfig[step.status].label}
                    </span>
                  </div>
                  {step.timestamp && (
                    <p className="mt-1 text-xs text-muted-foreground">{step.timestamp}</p>
                  )}

                  {/* Action buttons for current user */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2 flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => onApprove?.(step.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => onReject?.(step.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        <X className="h-3 w-3" /> Reject
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Comments */}
                  <CommentThread
                    comments={step.comments}
                    stepId={step.id}
                    onComment={onComment}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

ApprovalWorkflow.displayName = 'ApprovalWorkflow';
