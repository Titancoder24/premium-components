'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OutputColor = 'success' | 'error' | 'warning' | 'info' | 'dim' | 'default';

export interface TextBlock {
  type: 'text';
  content: string;
  color?: OutputColor;
  bold?: boolean;
}

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface ProgressBlock {
  type: 'progress';
  label: string;
  value: number;
  max?: number;
}

export interface SpinnerBlock {
  type: 'spinner';
  label: string;
}

export interface SectionBlock {
  type: 'section';
  title: string;
}

export interface ListBlock {
  type: 'list';
  style: 'numbered' | 'bulleted';
  items: string[];
}

export interface CodeBlock {
  type: 'code';
  content: string;
  language?: string;
}

export type OutputBlock =
  | TextBlock
  | TableBlock
  | ProgressBlock
  | SpinnerBlock
  | SectionBlock
  | ListBlock
  | CodeBlock;

export interface CliOutputRendererProps {
  blocks: OutputBlock[];
  streaming?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const colorMap: Record<OutputColor, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
  dim: 'text-zinc-500',
  default: 'text-zinc-200',
};

const colorIconMap: Partial<Record<OutputColor, React.ReactNode>> = {
  success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
  error: <XCircle className="h-3.5 w-3.5 text-red-400" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
  info: <Info className="h-3.5 w-3.5 text-blue-400" />,
};

const blockVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Sub-renderers
// ---------------------------------------------------------------------------

const TextRenderer: React.FC<{ block: TextBlock }> = ({ block }) => {
  const icon = block.color ? colorIconMap[block.color] : null;
  return (
    <div className={cn('flex items-start gap-2', colorMap[block.color ?? 'default'])}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <span className={cn('whitespace-pre-wrap', block.bold && 'font-bold')}>{block.content}</span>
    </div>
  );
};

const TableRenderer: React.FC<{ block: TableBlock }> = ({ block }) => {
  const colWidths = block.headers.map((h, ci) =>
    Math.max(h.length, ...block.rows.map((r) => (r[ci] ?? '').length)),
  );

  const pad = (str: string, width: number) => str + ' '.repeat(Math.max(0, width - str.length));
  const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');

  return (
    <div className="overflow-x-auto font-mono text-xs text-zinc-300">
      <div className="text-zinc-100 font-bold">
        {block.headers.map((h, i) => ` ${pad(h, colWidths[i])} `).join('|')}
      </div>
      <div className="text-zinc-600">{separator}</div>
      {block.rows.map((row, ri) => (
        <motion.div
          key={ri}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ri * 0.03 }}
        >
          {row.map((cell, ci) => ` ${pad(cell, colWidths[ci])} `).join('|')}
        </motion.div>
      ))}
    </div>
  );
};

const ProgressRenderer: React.FC<{ block: ProgressBlock }> = ({ block }) => {
  const max = block.max ?? 100;
  const pct = Math.min(100, Math.max(0, (block.value / max) * 100));
  const filled = Math.round(pct / 2.5);
  const empty = 40 - filled;

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="w-24 truncate text-zinc-400">{block.label}</span>
      <div className="flex items-center">
        <span className="text-zinc-600">[</span>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 'auto' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden text-emerald-400"
        >
          {'█'.repeat(filled)}
        </motion.span>
        <span className="text-zinc-700">{'░'.repeat(empty)}</span>
        <span className="text-zinc-600">]</span>
      </div>
      <span className="text-zinc-300">{Math.round(pct)}%</span>
    </div>
  );
};

const SpinnerRenderer: React.FC<{ block: SpinnerBlock }> = ({ block }) => (
  <div className="flex items-center gap-2 text-xs text-zinc-400">
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="inline-flex"
    >
      <Loader2 className="h-3.5 w-3.5" />
    </motion.span>
    <span>{block.label}</span>
  </div>
);

const SectionRenderer: React.FC<{ block: SectionBlock }> = ({ block }) => (
  <div className="mt-1">
    <span className="font-bold text-zinc-100">{block.title}</span>
    <div className="mt-0.5 h-px bg-zinc-700" />
  </div>
);

const ListRenderer: React.FC<{ block: ListBlock }> = ({ block }) => (
  <div className="flex flex-col gap-0.5 text-zinc-300">
    {block.items.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.04 }}
      >
        <span className="text-zinc-500">
          {block.style === 'numbered' ? `${i + 1}. ` : '  • '}
        </span>
        {item}
      </motion.div>
    ))}
  </div>
);

const CodeBlockRenderer: React.FC<{ block: CodeBlock }> = ({ block }) => (
  <div className="rounded-md bg-zinc-800/80 px-3 py-2">
    {block.language && (
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">
        {block.language}
      </span>
    )}
    <pre className="whitespace-pre-wrap text-xs text-emerald-300">{block.content}</pre>
  </div>
);

// ---------------------------------------------------------------------------
// StreamingWrapper
// ---------------------------------------------------------------------------

const StreamingBlock: React.FC<{ block: OutputBlock; index: number; streaming: boolean }> = ({
  block,
  index,
  streaming,
}) => (
  <motion.div
    variants={blockVariants}
    initial="initial"
    animate="animate"
    transition={
      streaming
        ? { delay: index * 0.08, type: 'spring', stiffness: 400, damping: 25 }
        : { duration: 0.2 }
    }
  >
    {block.type === 'text' && <TextRenderer block={block} />}
    {block.type === 'table' && <TableRenderer block={block} />}
    {block.type === 'progress' && <ProgressRenderer block={block} />}
    {block.type === 'spinner' && <SpinnerRenderer block={block} />}
    {block.type === 'section' && <SectionRenderer block={block} />}
    {block.type === 'list' && <ListRenderer block={block} />}
    {block.type === 'code' && <CodeBlockRenderer block={block} />}
  </motion.div>
);

// ---------------------------------------------------------------------------
// CliOutputRenderer
// ---------------------------------------------------------------------------

export const CliOutputRenderer: React.FC<CliOutputRendererProps> = ({
  blocks,
  streaming = false,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.25 }}
    className={cn(
      'flex flex-col gap-2 rounded-xl bg-zinc-900 p-4 font-mono text-sm dark:bg-zinc-950',
      className,
    )}
  >
    <AnimatePresence initial={false}>
      {blocks.map((block, i) => (
        <StreamingBlock key={`${block.type}-${i}`} block={block} index={i} streaming={streaming} />
      ))}
    </AnimatePresence>
  </motion.div>
);

CliOutputRenderer.displayName = 'CliOutputRenderer';
