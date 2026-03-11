'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  FileText,
  Hash,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchConfig {
  collection: string;
  threshold: number;
}

export interface SearchResult {
  id: string;
  title: string;
  preview: string;
  content: string;
  score: number;
  metadata?: Record<string, string>;
}

export interface VectorSearchExplorerProps {
  collections?: string[];
  onSearch: (query: string, config: SearchConfig) => Promise<SearchResult[]>;
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedCounter
// ---------------------------------------------------------------------------

const AnimatedCounter: React.FC<{ value: number; decimals?: number; className?: string }> = ({
  value,
  decimals = 1,
  className,
}) => {
  const [displayed, setDisplayed] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const from = displayed;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (value - from) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{displayed.toFixed(decimals)}</span>;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function similarityColor(score: number): string {
  if (score >= 0.85) return 'bg-emerald-500';
  if (score >= 0.6) return 'bg-amber-500';
  return 'bg-red-400';
}

// ---------------------------------------------------------------------------
// Shimmer Skeleton
// ---------------------------------------------------------------------------

const ShimmerSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4"
      >
        <div className="mb-2 h-4 w-2/3 rounded bg-[hsl(var(--muted))]" />
        <div className="mb-1 h-3 w-full rounded bg-[hsl(var(--muted))]" />
        <div className="h-3 w-4/5 rounded bg-[hsl(var(--muted))]" />
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// VectorSearchExplorer
// ---------------------------------------------------------------------------

export const VectorSearchExplorer: React.FC<VectorSearchExplorerProps> = ({
  collections = [],
  onSearch,
  className,
}) => {
  const [query, setQuery] = React.useState('');
  const [collection, setCollection] = React.useState(collections[0] ?? '');
  const [collectionOpen, setCollectionOpen] = React.useState(false);
  const [threshold, setThreshold] = React.useState(0.5);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!collectionOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCollectionOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [collectionOpen]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setSearched(true);
    setExpandedId(null);
    try {
      const res = await onSearch(trimmed, { collection, threshold });
      setResults(res.filter((r) => r.score >= threshold));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = React.useMemo(
    () => results.filter((r) => r.score >= threshold),
    [results, threshold],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Enter search query..."
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] py-2 pl-10 pr-3 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <motion.button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          whileTap={{ scale: 0.92 }}
          className={cn(
            'flex h-[38px] items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors',
            query.trim() && !loading
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
          )}
        >
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
              <Loader2 className="h-4 w-4" />
            </motion.span>
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </motion.button>
      </div>

      {/* Controls row */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Collection selector */}
        {collections.length > 0 && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setCollectionOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <FileText className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              {collection || 'Select collection'}
              <motion.span animate={{ rotate: collectionOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
              </motion.span>
            </button>
            <AnimatePresence>
              {collectionOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 z-20 mt-1 w-48 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
                >
                  {collections.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCollection(c); setCollectionOpen(false); }}
                      className={cn(
                        'flex w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                        c === collection ? 'bg-[hsl(var(--muted))] font-medium' : 'hover:bg-[hsl(var(--muted))]',
                        'text-[hsl(var(--foreground))]',
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Threshold slider */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Threshold</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="h-1.5 w-24 cursor-pointer accent-[hsl(var(--primary))]"
          />
          <span className="min-w-[2.5rem] text-xs font-medium text-[hsl(var(--foreground))]">
            {(threshold * 100).toFixed(0)}%
          </span>
        </div>

        {/* Result count */}
        {searched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]"
          >
            <Hash className="h-3 w-3" />
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </motion.div>
        )}
      </div>

      {/* Results */}
      {loading && <ShimmerSkeleton />}

      {!loading && searched && filteredResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]"
        >
          No results found above the similarity threshold.
        </motion.div>
      )}

      <AnimatePresence initial={false}>
        {!loading && filteredResults.map((result, i) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="mb-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] transition-shadow hover:shadow-sm"
          >
            <button
              onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
              className="flex w-full items-start gap-3 p-3 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-[hsl(var(--foreground))]">{result.title}</span>
                  {result.metadata && Object.entries(result.metadata).map(([k, v]) => (
                    <span key={k} className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                      {k}: {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">{result.preview}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', similarityColor(result.score))}
                    />
                  </div>
                  <AnimatedCounter
                    value={result.score * 100}
                    decimals={1}
                    className="min-w-[3rem] text-right text-xs font-mono font-medium text-[hsl(var(--foreground))]"
                  />
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">%</span>
                </div>
                <motion.span
                  animate={{ rotate: expandedId === result.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                </motion.span>
              </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {expandedId === result.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[hsl(var(--border))] px-3 py-3">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      Full Content
                    </span>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-[hsl(var(--foreground))]">
                      {result.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

VectorSearchExplorer.displayName = 'VectorSearchExplorer';
