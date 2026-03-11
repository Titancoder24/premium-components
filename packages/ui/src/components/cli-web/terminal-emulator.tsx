'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minus, Square } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  prompt?: string;
}

export interface TerminalEmulatorProps {
  onCommand: (cmd: string) => Promise<string>;
  prompt?: string;
  welcomeMessage?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let lineCounter = 0;
const nextLineId = () => `tl-${++lineCounter}-${Date.now()}`;

const lineVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// TerminalEmulator
// ---------------------------------------------------------------------------

export const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({
  onCommand,
  prompt = 'user@host:~$',
  welcomeMessage = 'Welcome to the terminal. Type "help" for available commands.',
  className,
}) => {
  const [lines, setLines] = React.useState<TerminalLine[]>(() => [
    { id: nextLineId(), type: 'system', content: welcomeMessage },
  ]);
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [isRunning, setIsRunning] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, isRunning]);

  const focusInput = () => inputRef.current?.focus();

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isRunning) return;

    // Add input line
    const inputLine: TerminalLine = {
      id: nextLineId(),
      type: 'input',
      content: trimmed,
      prompt,
    };

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput('');

    // Handle clear command locally
    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    setLines((prev) => [...prev, inputLine]);
    setIsRunning(true);

    try {
      const result = await onCommand(trimmed);
      const outputLine: TerminalLine = {
        id: nextLineId(),
        type: 'output',
        content: result,
      };
      setLines((prev) => [...prev, outputLine]);
    } catch (err) {
      const errorLine: TerminalLine = {
        id: nextLineId(),
        type: 'error',
        content: err instanceof Error ? err.message : 'Command failed',
      };
      setLines((prev) => [...prev, errorLine]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl dark:border-zinc-600',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5 dark:border-zinc-600">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 text-xs text-zinc-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Minus className="h-3 w-3 text-zinc-500" />
          <Square className="h-3 w-3 text-zinc-500" />
          <X className="h-3 w-3 text-zinc-500" />
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
        style={{ minHeight: 200, maxHeight: 480 }}
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="whitespace-pre-wrap"
            >
              {line.type === 'input' && (
                <span>
                  <span className="text-emerald-400">{line.prompt} </span>
                  <span className="text-zinc-100">{line.content}</span>
                </span>
              )}
              {line.type === 'output' && (
                <span className="text-zinc-300">{line.content}</span>
              )}
              {line.type === 'error' && (
                <span className="text-red-400">{line.content}</span>
              )}
              {line.type === 'system' && (
                <span className="text-zinc-500 italic">{line.content}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-zinc-400"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  .
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input line */}
        {!isRunning && (
          <div className="flex items-center">
            <span className="text-emerald-400">{prompt} </span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-zinc-100 caret-transparent outline-none"
                spellCheck={false}
                autoFocus
              />
              {/* Blinking cursor */}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="pointer-events-none absolute top-0 inline-block h-[1.2em] w-[8px] bg-emerald-400/80"
                style={{ left: `${input.length}ch` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

TerminalEmulator.displayName = 'TerminalEmulator';
