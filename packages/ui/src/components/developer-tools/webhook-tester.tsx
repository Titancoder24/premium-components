'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  X,
  Loader2,
  Clock,
  ChevronRight,
  History,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface WebhookHeader {
  id: string;
  key: string;
  value: string;
}

export interface WebhookResponse {
  status: number;
  body: string;
  duration: number;
  timestamp: string;
}

export interface WebhookHistoryEntry {
  id: string;
  url: string;
  method: HttpMethod;
  status: number;
  duration: number;
  timestamp: string;
}

export interface WebhookTesterProps {
  defaultUrl?: string;
  defaultMethod?: HttpMethod;
  onSend: (request: {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body?: string;
  }) => Promise<WebhookResponse> | void;
  history?: WebhookHistoryEntry[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  DELETE: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
  if (status >= 300 && status < 400) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
  return 'bg-rose-500/15 text-rose-600 dark:text-rose-400';
}

const headerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// AnimatedCounter
// ---------------------------------------------------------------------------

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    const duration = 400;
    const from = 0;
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// WebhookTester
// ---------------------------------------------------------------------------

export const WebhookTester: React.FC<WebhookTesterProps> = ({
  defaultUrl = '',
  defaultMethod = 'POST',
  onSend,
  history = [],
  className,
}) => {
  const [url, setUrl] = React.useState(defaultUrl);
  const [method, setMethod] = React.useState<HttpMethod>(defaultMethod);
  const [headers, setHeaders] = React.useState<WebhookHeader[]>([]);
  const [body, setBody] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [response, setResponse] = React.useState<WebhookResponse | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);

  const addHeader = () => {
    setHeaders((prev) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: 'key' | 'value', val: string) => {
    setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const handleSend = async () => {
    if (!url.trim()) return;
    setSending(true);
    setResponse(null);

    const headerMap: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key.trim()) headerMap[h.key.trim()] = h.value;
    });

    try {
      const res = await onSend({
        url: url.trim(),
        method,
        headers: headerMap,
        body: method !== 'GET' ? body : undefined,
      });
      if (res) setResponse(res);
    } finally {
      setSending(false);
    }
  };

  const selectHistory = (entry: WebhookHistoryEntry) => {
    setUrl(entry.url);
    setMethod(entry.method);
    setShowHistory(false);
  };

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      <div className="flex">
        {/* Main panel */}
        <div className="flex-1 p-5 space-y-4">
          {/* URL bar */}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,theme(colors.blue.500))]',
                methodColors[method],
              )}
            >
              {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/webhook"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !url.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary,theme(colors.blue.600))] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {sending ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-4 w-4" />
                </motion.span>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle history"
            >
              <History className="h-4 w-4" />
            </button>
          </div>

          {/* Headers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Headers</span>
              <button
                type="button"
                onClick={addHeader}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <AnimatePresence initial={false}>
              {headers.map((h) => (
                <motion.div
                  key={h.id}
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex gap-2 mb-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={h.key}
                    onChange={(e) => updateHeader(h.id, 'key', e.target.value)}
                    placeholder="Key"
                    className="flex-1 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) => updateHeader(h.id, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(h.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Body */}
          {method !== 'GET' && (
            <div>
              <span className="text-xs font-medium text-muted-foreground mb-2 block">Body</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder='{ "event": "test" }'
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,theme(colors.blue.500))] resize-y"
              />
            </div>
          )}

          {/* Response */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="rounded-lg border border-border bg-muted/20 p-4 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', statusColor(response.status))}>
                    {response.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <AnimatedCounter value={response.duration} suffix="ms" />
                  </div>
                </div>
                <pre className="max-h-48 overflow-auto rounded-md bg-card p-3 font-mono text-xs text-foreground">
                  {response.body}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History sidebar */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="border-l border-border overflow-hidden"
            >
              <div className="p-3 w-[220px]">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">History</h4>
                <ul className="space-y-1">
                  {history.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => selectHistory(entry)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted transition-colors"
                      >
                        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold', methodColors[entry.method])}>
                          {entry.method}
                        </span>
                        <span className="flex-1 truncate text-xs text-foreground">{entry.url.replace(/^https?:\/\//, '')}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

WebhookTester.displayName = 'WebhookTester';
