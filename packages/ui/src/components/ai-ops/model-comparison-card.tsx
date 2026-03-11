'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Play,
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Clock,
  Coins,
  Hash,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

export interface ModelResponse {
  text: string;
  latencyMs: number;
  tokens: number;
  cost: number;
}

export interface ModelComparisonCardProps {
  models: ModelOption[];
  onRun: (
    prompt: string,
    models: [string, string],
  ) => Promise<[ModelResponse, ModelResponse]>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
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
// ModelSelector Dropdown
// ---------------------------------------------------------------------------

const ModelDropdown: React.FC<{
  models: ModelOption[];
  selected: string;
  onChange: (id: string) => void;
}> = ({ models, selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = models.find((m) => m.id === selected);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
      >
        {current?.name ?? 'Select'}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-20 mt-1 w-48 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
          >
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-left transition-colors',
                  m.id === selected ? 'bg-[hsl(var(--muted))]' : 'hover:bg-[hsl(var(--muted))]',
                )}
              >
                <span className="text-[hsl(var(--foreground))]">{m.name}</span>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{m.provider}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ModelComparisonCard
// ---------------------------------------------------------------------------

export const ModelComparisonCard: React.FC<ModelComparisonCardProps> = ({
  models,
  onRun,
  className,
}) => {
  const [prompt, setPrompt] = React.useState('');
  const [leftId, setLeftId] = React.useState(models[0]?.id ?? '');
  const [rightId, setRightId] = React.useState(models[1]?.id ?? models[0]?.id ?? '');
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<[ModelResponse, ModelResponse] | null>(null);
  const [ratings, setRatings] = React.useState<[number, number]>([0, 0]);
  const [showDiff, setShowDiff] = React.useState(false);

  const handleRun = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setResults(null);
    setRatings([0, 0]);
    try {
      const res = await onRun(prompt, [leftId, rightId]);
      setResults(res);
    } finally {
      setRunning(false);
    }
  };

  const metrics = React.useMemo(() => {
    if (!results) return null;
    const [a, b] = results;
    return {
      latency: { left: a.latencyMs, right: b.latencyMs, winner: a.latencyMs <= b.latencyMs ? 'left' : 'right' },
      tokens: { left: a.tokens, right: b.tokens, winner: a.tokens <= b.tokens ? 'left' : 'right' },
      cost: { left: a.cost, right: b.cost, winner: a.cost <= b.cost ? 'left' : 'right' },
    } as const;
  }, [results]);

  const WinnerBadge = ({ show }: { show: boolean }) => (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
        </motion.span>
      )}
    </AnimatePresence>
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
      {/* Prompt input */}
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          rows={3}
          className="w-full resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
      </div>

      {/* Model selectors row */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <ModelDropdown models={models} selected={leftId} onChange={setLeftId} />
        <button
          onClick={handleRun}
          disabled={running || !prompt.trim()}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity',
            (running || !prompt.trim()) && 'opacity-50 cursor-not-allowed',
          )}
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run Both
        </button>
        <ModelDropdown models={models} selected={rightId} onChange={setRightId} />
      </div>

      {/* Diff toggle */}
      {results && (
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => setShowDiff((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            {showDiff ? <ToggleRight className="h-4 w-4 text-[hsl(var(--primary))]" /> : <ToggleLeft className="h-4 w-4" />}
            Diff
          </button>
        </div>
      )}

      {/* Response areas */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {[0, 1].map((i) => {
          const modelId = i === 0 ? leftId : rightId;
          const model = models.find((m) => m.id === modelId);
          const response = results?.[i as 0 | 1];
          const rating = ratings[i as 0 | 1];
          return (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
            >
              <div className="border-b border-[hsl(var(--border))] px-3 py-2 text-xs font-semibold text-[hsl(var(--foreground))]">
                {model?.name ?? 'Model'}
              </div>
              <div className="min-h-[120px] flex-1 p-3 text-sm text-[hsl(var(--foreground))]">
                {running ? (
                  <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs">Generating...</span>
                  </div>
                ) : response ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="whitespace-pre-wrap text-xs leading-relaxed"
                  >
                    {response.text}
                  </motion.p>
                ) : (
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    Response will appear here...
                  </span>
                )}
              </div>
              {/* Rating buttons */}
              {response && (
                <div className="flex items-center gap-1 border-t border-[hsl(var(--border))] px-3 py-1.5">
                  <button
                    onClick={() => setRatings((r) => { const n = [...r] as [number, number]; n[i as 0 | 1] = 1; return n; })}
                    className={cn('rounded p-1 transition-colors', rating === 1 ? 'text-emerald-500' : 'text-[hsl(var(--muted-foreground))] hover:text-emerald-500')}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setRatings((r) => { const n = [...r] as [number, number]; n[i as 0 | 1] = -1; return n; })}
                    className={cn('rounded p-1 transition-colors', rating === -1 ? 'text-red-500' : 'text-[hsl(var(--muted-foreground))] hover:text-red-500')}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Metrics comparison */}
      <AnimatePresence>
        {metrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'latency' as const, icon: Clock, label: 'Latency', unit: 'ms', decimals: 0 },
                { key: 'tokens' as const, icon: Hash, label: 'Tokens', unit: '', decimals: 0 },
                { key: 'cost' as const, icon: Coins, label: 'Cost', unit: '$', decimals: 4 },
              ]).map(({ key, icon: Icon, label, unit, decimals }) => {
                const m = metrics[key];
                return (
                  <div key={key} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                      <Icon className="h-3 w-3" />
                      {label}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <WinnerBadge show={m.winner === 'left'} />
                        <span className="font-mono">
                          {unit === '$' && '$'}<AnimatedCounter value={m.left} decimals={decimals} />
                          {unit && unit !== '$' && ` ${unit}`}
                        </span>
                      </div>
                      <span className="text-[hsl(var(--muted-foreground))]">vs</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">
                          {unit === '$' && '$'}<AnimatedCounter value={m.right} decimals={decimals} />
                          {unit && unit !== '$' && ` ${unit}`}
                        </span>
                        <WinnerBadge show={m.winner === 'right'} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

ModelComparisonCard.displayName = 'ModelComparisonCard';
