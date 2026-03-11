'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Trash2,
  ChevronDown,
  Check,
  Loader2,
  Clock,
  Coins,
  Hash,
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

export interface RunConfig {
  modelId: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmPlaygroundProps {
  models: ModelOption[];
  onRun: (config: RunConfig) => Promise<string>;
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedCounter
// ---------------------------------------------------------------------------

const AnimatedCounter: React.FC<{ value: number; className?: string }> = ({
  value,
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
      setDisplayed(Math.round(from + (value - from) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{displayed.toLocaleString()}</span>;
};

// ---------------------------------------------------------------------------
// StreamingText — characters fade in one by one
// ---------------------------------------------------------------------------

const StreamingText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={className}>
    {text.split('').map((char, i) => (
      <motion.span
        key={`${i}-${char}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.04, delay: i * 0.012 }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

// ---------------------------------------------------------------------------
// LlmPlayground
// ---------------------------------------------------------------------------

export const LlmPlayground: React.FC<LlmPlaygroundProps> = ({
  models,
  onRun,
  className,
}) => {
  const [selectedModel, setSelectedModel] = React.useState(models[0]?.id ?? '');
  const [modelOpen, setModelOpen] = React.useState(false);
  const [systemPrompt, setSystemPrompt] = React.useState('');
  const [temperature, setTemperature] = React.useState(0.7);
  const [maxTokens, setMaxTokens] = React.useState(1024);
  const [userInput, setUserInput] = React.useState('');
  const [conversation, setConversation] = React.useState<ConversationMessage[]>([]);
  const [streamingText, setStreamingText] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);
  const [tokenCount, setTokenCount] = React.useState(0);
  const [responseTime, setResponseTime] = React.useState(0);
  const [costEstimate, setCostEstimate] = React.useState(0);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!modelOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modelOpen]);

  const currentModel = models.find((m) => m.id === selectedModel);

  const handleRun = async () => {
    const trimmed = userInput.trim();
    if (!trimmed || isRunning) return;

    const newMessages: ConversationMessage[] = [
      ...conversation,
      { role: 'user', content: trimmed },
    ];
    setConversation(newMessages);
    setUserInput('');
    setIsRunning(true);
    setStreamingText('');

    const startMs = performance.now();
    try {
      const result = await onRun({
        modelId: selectedModel,
        systemPrompt,
        temperature,
        maxTokens,
        messages: newMessages,
      });

      // Simulate streaming display
      for (let i = 0; i <= result.length; i++) {
        await new Promise((r) => setTimeout(r, 12));
        setStreamingText(result.slice(0, i));
      }

      const elapsed = performance.now() - startMs;
      setResponseTime(Math.round(elapsed));
      const tokens = Math.ceil(result.split(/\s+/).length * 1.3);
      setTokenCount((prev) => prev + tokens);
      setCostEstimate((prev) => prev + tokens * 0.00003);
      setConversation([...newMessages, { role: 'assistant', content: result }]);
      setStreamingText('');
    } catch {
      setConversation([
        ...newMessages,
        { role: 'assistant', content: 'Error: request failed.' },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setConversation([]);
    setStreamingText('');
    setTokenCount(0);
    setResponseTime(0);
    setCostEstimate(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'flex flex-col rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5',
        className,
      )}
    >
      {/* Header row: model selector + config */}
      <div className="mb-4 flex flex-wrap items-start gap-4">
        {/* Model selector */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setModelOpen((v) => !v)}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm transition-colors hover:bg-[hsl(var(--muted))]',
              modelOpen && 'ring-2 ring-[hsl(var(--ring))]',
            )}
          >
            <span className="font-medium text-[hsl(var(--foreground))]">
              {currentModel?.name ?? 'Select model'}
            </span>
            <motion.span animate={{ rotate: modelOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </motion.span>
          </button>
          <AnimatePresence>
            {modelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 z-20 mt-1 min-w-[200px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
              >
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))]',
                      m.id === selectedModel && 'bg-[hsl(var(--muted))]',
                    )}
                  >
                    <div>
                      <span className="font-medium text-[hsl(var(--foreground))]">{m.name}</span>
                      <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">{m.provider}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      {m.id === selectedModel && (
                        <motion.span
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Check className="h-4 w-4 text-[hsl(var(--primary))]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Temperature slider */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Temp</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="h-1.5 w-24 cursor-pointer accent-[hsl(var(--primary))]"
          />
          <span className="min-w-[2rem] text-xs font-medium text-[hsl(var(--foreground))]">
            {temperature.toFixed(1)}
          </span>
        </div>

        {/* Max tokens */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Max tokens</label>
          <input
            type="number"
            min={1}
            max={128000}
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 1)}
            className="w-20 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
      </div>

      {/* System prompt */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">System prompt</label>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
            {systemPrompt.length} chars
          </span>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          rows={2}
          className="w-full resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
      </div>

      {/* Conversation history */}
      <div className="mb-4 flex-1 overflow-y-auto rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3">
        {conversation.length === 0 && !streamingText && (
          <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
            No messages yet. Start a conversation below.
          </p>
        )}
        <AnimatePresence initial={false}>
          {conversation.map((msg, i) => (
            <motion.div
              key={`${i}-${msg.role}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'mb-2 rounded-lg px-3 py-2 text-sm',
                msg.role === 'user'
                  ? 'ml-8 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'mr-8 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
              )}
            >
              <span className="mb-0.5 block text-[10px] font-semibold uppercase opacity-60">
                {msg.role}
              </span>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {streamingText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mr-8 rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--foreground))]"
          >
            <span className="mb-0.5 block text-[10px] font-semibold uppercase opacity-60">
              assistant
            </span>
            <StreamingText text={streamingText} className="whitespace-pre-wrap" />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-[hsl(var(--foreground))]"
            />
          </motion.div>
        )}
      </div>

      {/* Stats row */}
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          <span>Tokens:</span>
          <AnimatedCounter value={tokenCount} className="font-medium text-[hsl(var(--foreground))]" />
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{responseTime}ms</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-3 w-3" />
          <span>${costEstimate.toFixed(4)}</span>
        </div>
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRun(); }
          }}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
        <motion.button
          onClick={handleRun}
          disabled={!userInput.trim() || isRunning}
          whileTap={{ scale: 0.92 }}
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors',
            userInput.trim() && !isRunning
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
          )}
        >
          {isRunning ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
              <Loader2 className="h-4 w-4" />
            </motion.span>
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run
        </motion.button>
        <motion.button
          onClick={handleClear}
          whileTap={{ scale: 0.92 }}
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </motion.button>
      </div>
    </motion.div>
  );
};

LlmPlayground.displayName = 'LlmPlayground';
