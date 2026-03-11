'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RAGSource {
  title: string;
  url: string;
  relevanceScore: number;
  snippet: string;
}

export interface RAGSourceCitationProps {
  sources: RAGSource[];
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRelevanceColor(score: number): string {
  if (score >= 0.8) return 'bg-emerald-500';
  if (score >= 0.5) return 'bg-amber-500';
  return 'bg-red-400';
}

// ---------------------------------------------------------------------------
// RAGSourceCitation
// ---------------------------------------------------------------------------

export const RAGSourceCitation: React.FC<RAGSourceCitationProps> = ({
  sources,
  expanded = false,
  onToggle,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      {/* Toggle header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <span>Sources ({sources.length})</span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </motion.span>
      </button>

      {/* Expandable list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-[hsl(var(--border))] px-4 py-3">
              {sources.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="rounded-lg border border-[hsl(var(--border))] p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--primary))] hover:underline"
                    >
                      {source.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="shrink-0 text-[11px] text-[hsl(var(--muted-foreground))]">
                      {Math.round(source.relevanceScore * 100)}%
                    </span>
                  </div>

                  {/* Relevance bar */}
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.relevanceScore * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', getRelevanceColor(source.relevanceScore))}
                    />
                  </div>

                  {/* Snippet */}
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {source.snippet}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

RAGSourceCitation.displayName = 'RAGSourceCitation';
