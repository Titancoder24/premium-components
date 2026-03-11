'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  Plus,
  Trash2,
  Clock,
  HardDrive,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

type PlaygroundTab = 'headers' | 'params' | 'body' | 'auth';
type ResponseTab = 'body' | 'headers';

export interface ApiPlaygroundProps {
  baseUrl?: string;
  defaultMethod?: HttpMethod;
  defaultHeaders?: Record<string, string>;
  onSendRequest: (request: {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    body?: string;
  }) => Promise<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    time: number;
    size: number;
  }>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  PATCH: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  DELETE: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const tabs: { key: PlaygroundTab; label: string }[] = [
  { key: 'headers', label: 'Headers' },
  { key: 'params', label: 'Params' },
  { key: 'body', label: 'Body' },
  { key: 'auth', label: 'Auth' },
];

let pairId = 0;
const newPair = (key = '', value = ''): KeyValuePair => ({
  id: `kv-${++pairId}`,
  key,
  value,
  enabled: true,
});

function statusColor(code: number) {
  if (code < 300) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
  if (code < 400) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
  return 'bg-red-500/15 text-red-600 dark:text-red-400';
}

function colorizeJson(raw: string): React.ReactNode[] {
  const lines = raw.split('\n');
  return lines.map((line, i) => {
    const colored = line
      .replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-purple-600 dark:text-purple-400">"$1"</span>')
      .replace(/:\s*"([^"]*)"/g, ': <span class="text-emerald-600 dark:text-emerald-400">"$1"</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-blue-600 dark:text-blue-400">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-600 dark:text-amber-400">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="text-gray-400">$1</span>');
    return (
      <div key={i} dangerouslySetInnerHTML={{ __html: colored }} className="whitespace-pre" />
    );
  });
}

// ---------------------------------------------------------------------------
// KeyValueEditor
// ---------------------------------------------------------------------------

function KeyValueEditor({
  pairs,
  onChange,
}: {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
}) {
  const add = () => onChange([...pairs, newPair()]);
  const remove = (id: string) => onChange(pairs.filter((p) => p.id !== id));
  const update = (id: string, field: 'key' | 'value', val: string) =>
    onChange(pairs.map((p) => (p.id === id ? { ...p, [field]: val } : p)));

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {pairs.map((pair) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <input
              value={pair.key}
              onChange={(e) => update(pair.id, 'key', e.target.value)}
              placeholder="Key"
              className="h-8 flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-2.5 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
            />
            <input
              value={pair.value}
              onChange={(e) => update(pair.id, 'value', e.target.value)}
              placeholder="Value"
              className="h-8 flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-2.5 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
            />
            <button
              type="button"
              onClick={() => remove(pair.id)}
              className="shrink-0 rounded p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ApiPlayground
// ---------------------------------------------------------------------------

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  baseUrl = '',
  defaultMethod = 'GET',
  defaultHeaders,
  onSendRequest,
  className,
}) => {
  const [method, setMethod] = React.useState<HttpMethod>(defaultMethod);
  const [url, setUrl] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<PlaygroundTab>('headers');
  const [responseTab, setResponseTab] = React.useState<ResponseTab>('body');
  const [methodOpen, setMethodOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [headers, setHeaders] = React.useState<KeyValuePair[]>(() => {
    if (!defaultHeaders) return [newPair()];
    return Object.entries(defaultHeaders).map(([k, v]) => newPair(k, v));
  });
  const [params, setParams] = React.useState<KeyValuePair[]>([newPair()]);
  const [body, setBody] = React.useState('');
  const [authToken, setAuthToken] = React.useState('');

  const [response, setResponse] = React.useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    time: number;
    size: number;
  } | null>(null);

  const toRecord = (pairs: KeyValuePair[]) =>
    pairs
      .filter((p) => p.enabled && p.key.trim())
      .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.key]: p.value }), {});

  const send = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const h = toRecord(headers);
      if (authToken) h['Authorization'] = `Bearer ${authToken}`;
      const res = await onSendRequest({
        method,
        url: `${baseUrl}${url}`,
        headers: h,
        params: toRecord(params),
        body: method !== 'GET' ? body : undefined,
      });
      setResponse(res);
      setResponseTab('body');
    } finally {
      setLoading(false);
    }
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
      {/* URL Bar */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] p-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMethodOpen(!methodOpen)}
            className={cn(
              'flex h-9 items-center gap-1 rounded-lg px-3 text-xs font-bold',
              methodColors[method],
            )}
          >
            {method}
            <ChevronDown className="h-3 w-3" />
          </button>
          <AnimatePresence>
            {methodOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute left-0 top-full z-20 mt-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
              >
                {methods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMethod(m); setMethodOpen(false); }}
                    className={cn(
                      'block w-full rounded px-3 py-1.5 text-left text-xs font-bold',
                      methodColors[m],
                      m === method && 'ring-1 ring-[hsl(var(--ring))]',
                    )}
                  >
                    {m}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {baseUrl && (
          <span className="shrink-0 text-xs text-[hsl(var(--muted-foreground))]">
            {baseUrl}
          </span>
        )}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/endpoint"
          className="h-9 flex-1 rounded-lg border border-[hsl(var(--border))] bg-transparent px-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
        />
        <motion.button
          type="button"
          onClick={send}
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="flex h-9 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
              <Loader2 className="h-4 w-4" />
            </motion.span>
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </motion.button>
      </div>

      {/* Request Tabs */}
      <div className="relative flex border-b border-[hsl(var(--border))]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative px-4 py-2.5 text-xs font-medium transition-colors',
              activeTab === tab.key
                ? 'text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="playground-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'headers' && (
            <motion.div key="headers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <KeyValueEditor pairs={headers} onChange={setHeaders} />
            </motion.div>
          )}
          {activeTab === 'params' && (
            <motion.div key="params" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <KeyValueEditor pairs={params} onChange={setParams} />
            </motion.div>
          )}
          {activeTab === 'body' && (
            <motion.div key="body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "key": "value" }'
                rows={8}
                className="w-full resize-y rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3 font-mono text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              />
            </motion.div>
          )}
          {activeTab === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <label className="mb-1.5 block text-xs font-medium text-[hsl(var(--muted-foreground))]">
                Bearer Token
              </label>
              <input
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter token..."
                className="h-9 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent px-3 font-mono text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Response */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden border-t border-[hsl(var(--border))]"
          >
            <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4 py-2.5">
              <span className={cn('rounded-md px-2 py-0.5 text-xs font-bold', statusColor(response.status))}>
                {response.status} {response.statusText}
              </span>
              <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="h-3 w-3" /> {response.time}ms
              </span>
              <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                <HardDrive className="h-3 w-3" /> {response.size}B
              </span>

              <div className="ml-auto flex">
                {(['body', 'headers'] as ResponseTab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setResponseTab(t)}
                    className={cn(
                      'relative px-3 py-1 text-xs font-medium capitalize',
                      responseTab === t
                        ? 'text-[hsl(var(--foreground))]'
                        : 'text-[hsl(var(--muted-foreground))]',
                    )}
                  >
                    {t}
                    {responseTab === t && (
                      <motion.div
                        layoutId="response-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-72 overflow-auto p-4 font-mono text-xs leading-relaxed">
              {responseTab === 'body' ? (
                <div className="text-[hsl(var(--foreground))]">{colorizeJson(response.body)}</div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-purple-600 dark:text-purple-400">{k}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">: </span>
                      <span className="text-[hsl(var(--foreground))]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

ApiPlayground.displayName = 'ApiPlayground';
