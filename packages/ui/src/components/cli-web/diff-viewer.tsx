'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Columns2,
  Rows3,
  FileText,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiffViewerProps {
  oldText: string;
  newText: string;
  fileName?: string;
  mode?: 'unified' | 'split';
  className?: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'chunk-header';
  oldLineNum?: number;
  newLineNum?: number;
  content: string;
}

interface DiffChunk {
  header: string;
  lines: DiffLine[];
  startOld: number;
  startNew: number;
}

// ---------------------------------------------------------------------------
// Diff computation
// ---------------------------------------------------------------------------

function computeLCS(a: string[], b: string[]): boolean[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const inA = Array(m).fill(false);
  const inB = Array(n).fill(false);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { inA[i - 1] = true; inB[j - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  return [inA, inB];
}

function computeDiff(oldText: string, newText: string): { lines: DiffLine[]; added: number; removed: number } {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const [inOld, inNew] = computeLCS(oldLines, newLines);

  const result: DiffLine[] = [];
  let oi = 0, ni = 0;
  let addedCount = 0, removedCount = 0;
  let oldLineNum = 1, newLineNum = 1;

  while (oi < oldLines.length || ni < newLines.length) {
    if (oi < oldLines.length && inOld[oi] && ni < newLines.length && inNew[ni]) {
      result.push({ type: 'unchanged', oldLineNum: oldLineNum++, newLineNum: newLineNum++, content: oldLines[oi] });
      oi++; ni++;
    } else if (oi < oldLines.length && !inOld[oi]) {
      result.push({ type: 'removed', oldLineNum: oldLineNum++, content: oldLines[oi] });
      removedCount++; oi++;
    } else if (ni < newLines.length && !inNew[ni]) {
      result.push({ type: 'added', newLineNum: newLineNum++, content: newLines[ni] });
      addedCount++; ni++;
    } else {
      if (oi < oldLines.length) { result.push({ type: 'removed', oldLineNum: oldLineNum++, content: oldLines[oi] }); removedCount++; oi++; }
      if (ni < newLines.length) { result.push({ type: 'added', newLineNum: newLineNum++, content: newLines[ni] }); addedCount++; ni++; }
    }
  }
  return { lines: result, added: addedCount, removed: removedCount };
}

function wordDiff(oldStr: string, newStr: string): { old: React.ReactNode; new: React.ReactNode } {
  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);
  const [inO, inN] = computeLCS(oldWords, newWords);
  const oldNode = oldWords.map((w, i) =>
    inO[i] ? <span key={i}>{w}</span> : <span key={i} className="bg-red-400/30 dark:bg-red-500/30 rounded-sm">{w}</span>,
  );
  const newNode = newWords.map((w, i) =>
    inN[i] ? <span key={i}>{w}</span> : <span key={i} className="bg-emerald-400/30 dark:bg-emerald-500/30 rounded-sm">{w}</span>,
  );
  return { old: oldNode, new: newNode };
}

// ---------------------------------------------------------------------------
// DiffViewer
// ---------------------------------------------------------------------------

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldText,
  newText,
  fileName,
  mode: initialMode = 'unified',
  className,
}) => {
  const [viewMode, setViewMode] = React.useState(initialMode);
  const [copied, setCopied] = React.useState<'old' | 'new' | null>(null);
  const [collapsedRanges, setCollapsedRanges] = React.useState<Set<number>>(new Set());
  const changeRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [currentChange, setCurrentChange] = React.useState(0);

  const { lines, added, removed } = React.useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

  // Find change indices for navigation
  const changeIndices = React.useMemo(
    () => lines.reduce<number[]>((acc, l, i) => (l.type === 'added' || l.type === 'removed' ? [...acc, i] : acc), []),
    [lines],
  );

  const handleCopy = (side: 'old' | 'new') => {
    navigator.clipboard?.writeText(side === 'old' ? oldText : newText);
    setCopied(side);
    setTimeout(() => setCopied(null), 2000);
  };

  const jumpToChange = (dir: 'prev' | 'next') => {
    if (changeIndices.length === 0) return;
    const next = dir === 'next'
      ? Math.min(currentChange + 1, changeIndices.length - 1)
      : Math.max(currentChange - 1, 0);
    setCurrentChange(next);
    changeRefs.current[changeIndices[next]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const lineClasses: Record<DiffLine['type'], string> = {
    added: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    removed: 'bg-red-500/10 dark:bg-red-500/15',
    unchanged: '',
    'chunk-header': 'bg-blue-500/5 text-blue-500',
  };

  const prefixChar: Record<DiffLine['type'], string> = {
    added: '+',
    removed: '-',
    unchanged: ' ',
    'chunk-header': '@',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
          {fileName && (
            <span className="truncate text-sm font-medium text-[hsl(var(--foreground))]">{fileName}</span>
          )}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-500 font-medium">+{added}</span>
            <span className="text-red-500 font-medium">-{removed}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nav */}
          <button onClick={() => jumpToChange('prev')} disabled={changeIndices.length === 0} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button onClick={() => jumpToChange('next')} disabled={changeIndices.length === 0} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40">
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Mode toggle */}
          <div className="mx-1 h-4 w-px bg-[hsl(var(--border))]" />
          <button
            onClick={() => setViewMode('unified')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md transition-colors', viewMode === 'unified' ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]')}
            aria-label="Unified view"
          >
            <Rows3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md transition-colors', viewMode === 'split' ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]')}
            aria-label="Split view"
          >
            <Columns2 className="h-3.5 w-3.5" />
          </button>

          {/* Copy */}
          <div className="mx-1 h-4 w-px bg-[hsl(var(--border))]" />
          {(['old', 'new'] as const).map((side) => (
            <button
              key={side}
              onClick={() => handleCopy(side)}
              className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <AnimatePresence mode="wait">
                {copied === side ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-3 w-3 text-emerald-500" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
              {side === 'old' ? 'Old' : 'New'}
            </button>
          ))}
        </div>
      </div>

      {/* Diff body */}
      <div className="overflow-x-auto text-xs font-mono">
        {viewMode === 'unified' ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr
                  key={i}
                  ref={(el) => { changeRefs.current[i] = el as HTMLDivElement | null; }}
                  className={cn(lineClasses[line.type], 'leading-5')}
                >
                  <td className="w-10 select-none pr-1 text-right text-[hsl(var(--muted-foreground))]/50">{line.oldLineNum ?? ''}</td>
                  <td className="w-10 select-none pr-1 text-right text-[hsl(var(--muted-foreground))]/50">{line.newLineNum ?? ''}</td>
                  <td className="w-4 select-none text-center text-[hsl(var(--muted-foreground))]">{prefixChar[line.type]}</td>
                  <td className="whitespace-pre-wrap pr-4 text-[hsl(var(--foreground))]">{line.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-[hsl(var(--border))]">
            {/* Old side */}
            <div>
              {lines.filter((l) => l.type !== 'added').map((line, i) => (
                <div key={i} className={cn('flex leading-5', line.type === 'removed' ? lineClasses.removed : '')}>
                  <span className="w-10 shrink-0 select-none pr-1 text-right text-[hsl(var(--muted-foreground))]/50">{line.oldLineNum ?? ''}</span>
                  <span className="whitespace-pre-wrap pr-2 text-[hsl(var(--foreground))]">{line.content}</span>
                </div>
              ))}
            </div>
            {/* New side */}
            <div>
              {lines.filter((l) => l.type !== 'removed').map((line, i) => (
                <div key={i} className={cn('flex leading-5', line.type === 'added' ? lineClasses.added : '')}>
                  <span className="w-10 shrink-0 select-none pr-1 text-right text-[hsl(var(--muted-foreground))]/50">{line.newLineNum ?? ''}</span>
                  <span className="whitespace-pre-wrap pr-2 text-[hsl(var(--foreground))]">{line.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

DiffViewer.displayName = 'DiffViewer';
