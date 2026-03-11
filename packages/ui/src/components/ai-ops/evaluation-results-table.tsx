'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Clock,
  Cpu,
  Calendar,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EvalResult {
  id: string;
  testCase: string;
  input: string;
  expected: string;
  actual: string;
  score: number;
  passed: boolean;
}

export interface RunInfo {
  model: string;
  date: string;
  durationMs: number;
}

export interface EvaluationResultsTableProps {
  results: EvalResult[];
  runInfo?: RunInfo;
  onRerun?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedCounter
// ---------------------------------------------------------------------------

const AnimatedCounter: React.FC<{ value: number; decimals?: number; className?: string }> = ({
  value,
  decimals = 0,
  className,
}) => {
  const [displayed, setDisplayed] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const duration = 700;
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

function scoreColor(score: number): string {
  if (score >= 0.8) return 'bg-emerald-500';
  if (score >= 0.5) return 'bg-amber-500';
  return 'bg-red-500';
}

function diffHighlight(expected: string, actual: string): React.ReactNode[] {
  const expWords = expected.split(/\s+/);
  const actWords = actual.split(/\s+/);
  const max = Math.max(expWords.length, actWords.length);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < max; i++) {
    const ew = expWords[i] ?? '';
    const aw = actWords[i] ?? '';
    if (ew === aw) {
      nodes.push(<span key={i}>{aw} </span>);
    } else {
      nodes.push(
        <span key={i} className="rounded bg-red-500/20 px-0.5 text-red-600 dark:text-red-400">
          {aw || '\u00A0'}{' '}
        </span>,
      );
    }
  }
  return nodes;
}

// ---------------------------------------------------------------------------
// EvaluationResultsTable
// ---------------------------------------------------------------------------

export const EvaluationResultsTable: React.FC<EvaluationResultsTableProps> = ({
  results,
  runInfo,
  onRerun,
  className,
}) => {
  const [filter, setFilter] = React.useState<'all' | 'pass' | 'fail'>('all');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    let list = [...results];
    if (filter === 'pass') list = list.filter((r) => r.passed);
    if (filter === 'fail') list = list.filter((r) => !r.passed);
    list.sort((a, b) => (sortDir === 'asc' ? a.score - b.score : b.score - a.score));
    return list;
  }, [results, filter, sortDir]);

  const overallScore = results.length > 0
    ? results.reduce((sum, r) => sum + r.score, 0) / results.length
    : 0;
  const passCount = results.filter((r) => r.passed).length;
  const accuracy = results.length > 0 ? (passCount / results.length) * 100 : 0;

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
      {/* Run info header */}
      {runInfo && (
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span className="font-medium text-[hsl(var(--foreground))]">{runInfo.model}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{runInfo.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{(runInfo.durationMs / 1000).toFixed(1)}s</span>
          </div>
          {onRerun && (
            <motion.button
              onClick={onRerun}
              whileTap={{ scale: 0.92 }}
              className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Re-run
            </motion.button>
          )}
        </div>
      )}

      {/* Score header */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-center">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Avg Score
          </div>
          <AnimatedCounter
            value={overallScore * 100}
            decimals={1}
            className="text-3xl font-bold text-[hsl(var(--foreground))]"
          />
          <span className="text-lg text-[hsl(var(--muted-foreground))]">%</span>
        </div>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-center">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
            Accuracy
          </div>
          <AnimatedCounter
            value={accuracy}
            decimals={1}
            className="text-3xl font-bold text-[hsl(var(--foreground))]"
          />
          <span className="text-lg text-[hsl(var(--muted-foreground))]">%</span>
          <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            {passCount}/{results.length} passed
          </div>
        </div>
      </div>

      {/* Filter + sort controls */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-0.5">
          {(['all', 'pass', 'fail'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                f === filter
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              )}
            >
              <Filter className="h-3 w-3" />
              {f === 'all' ? 'All' : f === 'pass' ? 'Pass' : 'Fail'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="flex items-center gap-1 rounded-md border border-[hsl(var(--border))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowUpDown className="h-3 w-3" />
          Score {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>

      {/* Results table */}
      <div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <th className="px-3 py-2 text-left font-medium text-[hsl(var(--muted-foreground))]">Test Case</th>
              <th className="px-3 py-2 text-left font-medium text-[hsl(var(--muted-foreground))]">Expected</th>
              <th className="px-3 py-2 text-left font-medium text-[hsl(var(--muted-foreground))]">Actual</th>
              <th className="px-3 py-2 text-center font-medium text-[hsl(var(--muted-foreground))]">Score</th>
              <th className="px-3 py-2 text-center font-medium text-[hsl(var(--muted-foreground))]">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                  className="cursor-pointer border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))]/50 transition-colors"
                >
                  <td className="px-3 py-2 font-medium text-[hsl(var(--foreground))]">
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ rotate: expandedId === row.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-3 w-3 text-[hsl(var(--muted-foreground))]" />
                      </motion.span>
                      {row.testCase}
                    </div>
                  </td>
                  <td className="max-w-[180px] truncate px-3 py-2 text-[hsl(var(--muted-foreground))]">{row.expected}</td>
                  <td className="max-w-[180px] truncate px-3 py-2 text-[hsl(var(--foreground))]">{row.actual}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.score * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={cn('h-full rounded-full', scoreColor(row.score))}
                        />
                      </div>
                      <span className="font-mono text-[hsl(var(--foreground))]">
                        {(row.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={row.passed ? 'pass' : 'fail'}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          row.passed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400',
                        )}
                      >
                        {row.passed ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {row.passed ? 'Pass' : 'Fail'}
                      </motion.span>
                    </AnimatePresence>
                  </td>
                </tr>
                {/* Expanded row */}
                <AnimatePresence>
                  {expandedId === row.id && (
                    <tr>
                      <td colSpan={5}>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 bg-[hsl(var(--background))] px-4 py-3">
                            <div>
                              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                                Input
                              </span>
                              <p className="whitespace-pre-wrap text-xs text-[hsl(var(--foreground))]">{row.input}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                                  Expected
                                </span>
                                <p className="whitespace-pre-wrap text-xs text-[hsl(var(--foreground))]">{row.expected}</p>
                              </div>
                              <div>
                                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                                  Actual (diff highlighted)
                                </span>
                                <p className="whitespace-pre-wrap text-xs text-[hsl(var(--foreground))]">
                                  {diffHighlight(row.expected, row.actual)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

EvaluationResultsTable.displayName = 'EvaluationResultsTable';
