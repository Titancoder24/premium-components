'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  X,
  Loader2,
  Clock,
  ChevronDown,
  History,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HeaderPair {
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
  }) => Promise<WebhookResponse>;
  history?: WebhookHistoryEntry[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE'];

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};

function statusColor(status: number): string {
  if (status < 300) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (status < 400) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
}

const headerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

let headerId = 0;
function nextHeaderId(): string {
  headerId += 1;
  return `hdr-${headerId}`;
}

// ---------------------------------------------------------------------------
// AnimatedCounter
// ---------------------------------------------------------------------------

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = React.useState(0);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    const start = performance.now();
    const duration = 400;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return <span>{display}{suffix}</span>;
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
  const [headers, setHeaders] = React.useState<HeaderPair[]>([]);
  const [body, setBody] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [response, setResponse] = React.useState<WebhookResponse | null>(null);
  const [showMethodDropdown, setShowMethodDropdown] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  const addHeader = () => {
    setHeaders((prev) => [...prev, { id: nextHeaderId(), key: '', value: '' }]);
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: 'key' | 'value', val: string) => {
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h)),
    );
  };

  const handleSend = async () => {
    if (!url.trim() || sending) return;
    setSending(true);
    setResponse(null);
    try {
      const headerMap: Record<string, string> = {};
      headers.forEach((h) => { if (h.key.trim()) headerMap[h.key] = h.value; });
      const res = await onSend({ url, method, headers: headerMap, body: body || undefined });
      setResponse(res);
    } finally {
      setSending(false);
    }
  };

  const loadHistoryEntry = (entry: WebhookHistoryEntry) => {
    setUrl(entry.url);
    setMethod(entry.method);
    setShowHistory(false);
  };

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      <div className="flex">
        {/* Main Panel */}
        <div className="flex-1 p-5">
          {/* URL + Method */}
          <div className="mb-4 flex gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMethodDropdown((v) => !v)}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  methodColors[method],
                )}
              >
                {method}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {showMethodDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-10 mt-1 rounded-lg border border-border bg-card py-1 shadow-lg"
                  >
                    {methods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMethod(m); setShowMethodDropdown(false); }}
                        className={cn(
                          'block w-full px-4 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-muted',
                          methodColors[m],
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <input
              type="text"
              placeholder="https://api.example.com/webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!url.trim() || sending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {sending ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="inline-flex"
                >
                  <Loader2 className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send
            </button>
          </div>

          {/* Headers */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Headers</span>
              <button
                type="button"
                onClick={addHeader}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {headers.map((h) => (
                  <motion.div
                    key={h.id}
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex gap-2 overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Key"
                      value={h.key}
                      onChange={(e) => updateHeader(h.id, 'key', e.target.value)}
                      className="w-1/3 rounded-md border border-border bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={h.value}
                      onChange={(e) => updateHeader(h.id, 'value', e.target.value)}
                      className="flex-1 rounded-md border border-border bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(h.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Body */}
          {(method === 'POST' || method === 'PUT') && (
            <div className="mb-4">
              <span className="mb-2 block text-xs font-medium text-muted-foreground">Body</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "event": "test" }'
                rows={5}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="rounded-lg border border-border bg-muted/30 p-4 dark:bg-muted/10"
              >
                <div className="mb-3 flex items-center gap-3">
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

        {/* History Sidebar */}
        {history.length > 0 && (
          <div className="w-56 border-l border-border p-4">
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <History className="h-3.5 w-3.5" />
              History ({history.length})
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1.5"
                >
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => loadHistoryEntry(entry)}
                      className="w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-[10px] font-bold', methodColors[entry.method])}>
                          {entry.method}
                        </span>
                        <span className={cn('text-[10px] font-semibold', statusColor(entry.status))}>
                          {entry.status}
                        </span>
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">{entry.url}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

WebhookTester.displayName = 'WebhookTester';
