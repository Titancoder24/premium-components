'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Check, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface VotingPollProps {
  question: string;
  options: PollOption[];
  onVote: (optionId: string) => void;
  totalVotes: number;
  votedOptionId?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const VotingPoll: React.FC<VotingPollProps> = ({
  question,
  options,
  onVote,
  totalVotes,
  votedOptionId,
  className,
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const hasVoted = !!votedOptionId;

  const getPercentage = (votes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const maxVotes = Math.max(...options.map((o) => o.votes), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('rounded-xl border overflow-hidden', className)}
      style={{
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-2">
          <BarChart3
            className="h-5 w-5 mt-0.5 shrink-0"
            style={{ color: 'hsl(var(--primary))' }}
          />
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold leading-snug"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {question}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Users className="h-3 w-3" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="px-4 pb-4 space-y-2">
        <AnimatePresence>
          {options.map((option, index) => {
            const percentage = getPercentage(option.votes);
            const isVoted = votedOptionId === option.id;
            const isLeading = option.votes === maxVotes && totalVotes > 0;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                onClick={() => !hasVoted && onVote(option.id)}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                disabled={hasVoted}
                className={cn(
                  'relative w-full rounded-lg border overflow-hidden text-left transition-all',
                  !hasVoted && 'cursor-pointer hover:shadow-sm',
                  hasVoted && 'cursor-default',
                )}
                style={{
                  borderColor: isVoted
                    ? 'hsl(var(--primary))'
                    : hoveredId === option.id && !hasVoted
                      ? 'hsl(var(--primary) / 0.5)'
                      : 'hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                }}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                    style={{
                      backgroundColor: isVoted
                        ? 'hsl(var(--primary) / 0.15)'
                        : isLeading
                          ? 'hsl(var(--primary) / 0.08)'
                          : 'hsl(var(--muted) / 0.5)',
                    }}
                  />
                )}

                <div className="relative flex items-center gap-3 px-3 py-2.5">
                  {/* Vote indicator / radio */}
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: isVoted
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--border))',
                      backgroundColor: isVoted
                        ? 'hsl(var(--primary))'
                        : 'transparent',
                    }}
                  >
                    <AnimatePresence>
                      {isVoted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check className="h-3 w-3" style={{ color: 'hsl(var(--primary-foreground))' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className={cn('flex-1 text-sm', isVoted && 'font-medium')}
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    {option.label}
                  </span>

                  {/* Percentage */}
                  {hasVoted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={cn(
                        'text-xs font-semibold tabular-nums',
                        isLeading ? 'font-bold' : '',
                      )}
                      style={{
                        color: isLeading
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      {percentage}%
                    </motion.span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

VotingPoll.displayName = 'VotingPoll';
