'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Bot,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIResponseSource {
  title: string;
  url: string;
}

export interface AIResponseActions {
  onCopy?: () => void;
  onRegenerate?: () => void;
  onRate?: (rating: 'up' | 'down') => void;
}

export interface AIResponseCardProps {
  content: string;
  model?: string;
  tokenCount?: number;
  sources?: AIResponseSource[];
  actions?: AIResponseActions;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const actionVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.06, duration: 0.2 },
  }),
};

// ---------------------------------------------------------------------------
// AIResponseCard
// ---------------------------------------------------------------------------

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  content,
  model,
  tokenCount,
  sources,
  actions,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [rating, setRating] = React.useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    actions?.onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (r: 'up' | 'down') => {
    setRating(r);
    actions?.onRate?.(r);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
          <Bot className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        <span className="text-sm font-medium text-[hsl(var(--foreground))]">AI Response</span>
        {model && (
          <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">
            <Sparkles className="h-3 w-3" />
            {model}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mb-4 text-sm leading-relaxed text-[hsl(var(--foreground))]">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>

      {/* Sources */}
      {sources && sources.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <div className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Sources</div>
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[hsl(var(--primary))] transition-colors hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {source.title}
            </a>
          ))}
        </div>
      )}

      {/* Footer: meta + actions */}
      <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-[hsl(var(--muted-foreground))]">
          {tokenCount !== undefined && <span>{tokenCount.toLocaleString()} tokens</span>}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-1">
            {actions.onCopy && (
              <motion.button
                custom={0}
                variants={actionVariants}
                initial="hidden"
                animate="visible"
                onClick={handleCopy}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                aria-label="Copy"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </motion.button>
            )}

            {actions.onRegenerate && (
              <motion.button
                custom={1}
                variants={actionVariants}
                initial="hidden"
                animate="visible"
                onClick={actions.onRegenerate}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                aria-label="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </motion.button>
            )}

            {actions.onRate && (
              <>
                <motion.button
                  custom={2}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleRate('up')}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                    rating === 'up'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
                  )}
                  aria-label="Thumbs up"
                >
                  <ThumbsUp className="h-3.5 w-3.5" fill={rating === 'up' ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                  custom={3}
                  variants={actionVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleRate('down')}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                    rating === 'down'
                      ? 'bg-red-500/10 text-red-500'
                      : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
                  )}
                  aria-label="Thumbs down"
                >
                  <ThumbsDown className="h-3.5 w-3.5" fill={rating === 'down' ? 'currentColor' : 'none'} />
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

AIResponseCard.displayName = 'AIResponseCard';
