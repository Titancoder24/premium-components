'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  ChevronDown,
  WrapText,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface CodeSnippetBlockProps {
  snippets: CodeSnippet[];
  showLineNumbers?: boolean;
  maxLines?: number;
  diffMode?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const languageColors: Record<string, string> = {
  typescript: 'text-blue-500',
  javascript: 'text-amber-500',
  python: 'text-emerald-500',
  rust: 'text-orange-500',
  go: 'text-cyan-500',
  json: 'text-purple-500',
  html: 'text-rose-500',
  css: 'text-pink-500',
  bash: 'text-green-500',
  sql: 'text-indigo-500',
};

// Simple token-based syntax highlighting via CSS classes
function tokenizeLine(line: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let idx = 0;

  const patterns: { regex: RegExp; className: string }[] = [
    // single-line comments
    { regex: /^(\/\/.*|#.*)/, className: 'text-gray-500 dark:text-gray-500 italic' },
    // keywords
    {
      regex: /^(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|async|await|new|throw|try|catch|default|switch|case|break|continue|of|in|def|fn|pub|mut|use|mod|struct|impl|enum)\b/,
      className: 'text-purple-600 dark:text-purple-400 font-semibold',
    },
    // strings (double or single or backtick)
    { regex: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, className: 'text-emerald-600 dark:text-emerald-400' },
    // numbers
    { regex: /^(\d+\.?\d*)/, className: 'text-amber-600 dark:text-amber-400' },
    // booleans/null
    { regex: /^(true|false|null|undefined|None|nil)\b/, className: 'text-blue-600 dark:text-blue-400' },
    // types (capitalized words)
    { regex: /^([A-Z][a-zA-Z0-9_]+)/, className: 'text-cyan-600 dark:text-cyan-400' },
    // punctuation
    { regex: /^([{}()[\];:,.<>=+\-*/&|!?@#%^~]+)/, className: 'text-[hsl(var(--muted-foreground))]' },
    // identifiers / plain text
    { regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/, className: 'text-[hsl(var(--foreground))]' },
    // whitespace
    { regex: /^(\s+)/, className: '' },
  ];

  while (remaining.length > 0) {
    let matched = false;
    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push(
          <span key={idx} className={className}>
            {match[0]}
          </span>,
        );
        remaining = remaining.slice(match[0].length);
        idx++;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push(<span key={idx}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
      idx++;
    }
  }

  return <>{tokens}</>;
}

// ---------------------------------------------------------------------------
// CodeSnippetBlock
// ---------------------------------------------------------------------------

export const CodeSnippetBlock: React.FC<CodeSnippetBlockProps> = ({
  snippets,
  showLineNumbers = true,
  maxLines = 20,
  diffMode = false,
  className,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [wrapLines, setWrapLines] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const snippet = snippets[activeIndex] ?? snippets[0];
  if (!snippet) return null;

  const lines = snippet.code.split('\n');
  const isLong = lines.length > maxLines;
  const visibleLines = expanded || !isLong ? lines : lines.slice(0, maxLines);

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getDiffClass = (line: string) => {
    if (!diffMode) return '';
    if (line.startsWith('+')) return 'bg-emerald-500/10';
    if (line.startsWith('-')) return 'bg-red-500/10';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-2">
        <div className="flex items-center gap-1">
          {/* Language tabs */}
          {snippets.length > 1 ? (
            <div className="relative flex">
              {snippets.map((s, i) => (
                <button
                  key={s.language + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'relative px-3 py-1.5 text-xs font-medium transition-colors',
                    activeIndex === i
                      ? 'text-[hsl(var(--foreground))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                  )}
                >
                  <span className={languageColors[s.language.toLowerCase()] ?? ''}>
                    {s.filename ?? s.language}
                  </span>
                  {activeIndex === i && (
                    <motion.div
                      layoutId="snippet-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <span className={cn('text-xs font-medium', languageColors[snippet.language.toLowerCase()] ?? 'text-[hsl(var(--muted-foreground))]')}>
              {snippet.filename ?? snippet.language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Wrap toggle */}
          <button
            type="button"
            onClick={() => setWrapLines((v) => !v)}
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              wrapLines
                ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
            )}
            aria-label="Toggle line wrap"
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative overflow-auto bg-[hsl(var(--muted))]/20">
        <pre
          className={cn(
            'p-4 font-mono text-xs leading-relaxed',
            wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
          )}
        >
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              className={cn(
                'group flex rounded-sm transition-colors hover:bg-[hsl(var(--muted))]/40',
                getDiffClass(line),
              )}
            >
              {showLineNumbers && (
                <span className="mr-4 inline-block w-8 shrink-0 select-none text-right text-[hsl(var(--muted-foreground))]/50">
                  {i + 1}
                </span>
              )}
              <span className="flex-1">{tokenizeLine(line)}</span>
            </motion.div>
          ))}
        </pre>

        {/* Expand / Collapse */}
        {isLong && (
          <div className="border-t border-[hsl(var(--border))]">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]/40 hover:text-[hsl(var(--foreground))]"
            >
              {expanded ? 'Show less' : `Show ${lines.length - maxLines} more lines`}
              <ChevronDown
                className={cn(
                  'h-3 w-3 transition-transform',
                  expanded && 'rotate-180',
                )}
              />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

CodeSnippetBlock.displayName = 'CodeSnippetBlock';
