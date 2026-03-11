'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  RotateCcw,
  Filter,
  Clock,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WebhookEvent {
  id: string;
  timestamp: string;
  source: string;
  endpoint: string;
  method: string;
  statusCode: number;
  headers?: Record<string, string>;
  requestBody?: unknown;
  responseBody?: unknown;
  duration?: number;
}

export interface WebhookEventLogProps {
  events: WebhookEvent[];
  onRetry?: (eventId: string) => void;
  autoRefresh?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusBadgeClass(code: number): string {
  if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-500';
  if (code >= 400 && code < 500) return 'bg-amber-500/10 text-amber-500';
  if (code >= 500) return 'bg-red-500/10 text-red-500';
  return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch {
    return ts;
  }
}

// ---------------------------------------------------------------------------
// JsonTreeView
// ---------------------------------------------------------------------------

const JsonTreeView: React.FC<{ data: unknown; depth?: number }> = ({ data, depth = 0 }) => {
  const [collapsed, setCollapsed] = React.useState(depth > 1);

  if (data === null || data === undefined) return <span className="text-[hsl(var(--muted-foreground))]">null</span>;
  if (typeof data === 'string') return <span className="text-emerald-500">&quot;{data}&quot;</span>;
  if (typeof data === 'number') return <span className="text-blue-400">{data}</span>;
  if (typeof data === 'boolean') return <span className="text-amber-500">{String(data)}</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-[hsl(var(--muted-foreground))]">[]</span>;
    return (
      <div className="pl-3">
        <button onClick={() => setCollapsed(!collapsed)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
          {collapsed ? <ChevronRight className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />}
          <span className="text-[hsl(var(--muted-foreground))]"> [{data.length}]</span>
        </button>
        {!collapsed && data.map((item, i) => (
          <div key={i} className="pl-3">
            <span className="text-[hsl(var(--muted-foreground))]">{i}: </span>
            <JsonTreeView data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-[hsl(var(--muted-foreground))]">{'{}'}</span>;
    return (
      <div className="pl-3">
        <button onClick={() => setCollapsed(!collapsed)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
          {collapsed ? <ChevronRight className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />}
          <span className="text-[hsl(var(--muted-foreground))]"> {'{'}...{'}'}</span>
        </button>
        {!collapsed && entries.map(([key, val]) => (
          <div key={key} className="pl-3">
            <span className="text-purple-400">{key}</span>
            <span className="text-[hsl(var(--muted-foreground))]">: </span>
            <JsonTreeView data={val} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

// ---------------------------------------------------------------------------
// EventRow
// ---------------------------------------------------------------------------

const EventRow: React.FC<{
  event: WebhookEvent;
  onRetry?: () => void;
}> = ({ event, onRetry }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'request' | 'response' | 'headers'>('request');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const payload = activeTab === 'headers'
      ? JSON.stringify(event.headers, null, 2)
      : activeTab === 'request'
        ? JSON.stringify(event.requestBody, null, 2)
        : JSON.stringify(event.responseBody, null, 2);
    navigator.clipboard?.writeText(payload ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isError = event.statusCode >= 400;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[hsl(var(--muted))]/50 transition-colors"
      >
        <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
        </motion.span>

        <span className="w-16 shrink-0 font-mono text-xs text-[hsl(var(--muted-foreground))]">
          {formatTimestamp(event.timestamp)}
        </span>

        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', statusBadgeClass(event.statusCode))}>
          {event.statusCode}
        </span>

        <span className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase">
          {event.method}
        </span>

        <span className="flex-1 truncate text-xs font-mono text-[hsl(var(--foreground))]">
          {event.endpoint}
        </span>

        <span className="shrink-0 truncate text-xs text-[hsl(var(--muted-foreground))]">
          {event.source}
        </span>

        {event.duration != null && (
          <span className="shrink-0 text-[10px] text-[hsl(var(--muted-foreground))]">
            {event.duration}ms
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[hsl(var(--border))] px-4 py-3">
              {/* Tabs */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {(['request', 'response', 'headers'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                        activeTab === tab
                          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCopy} className="flex h-6 items-center gap-1 rounded px-2 text-[10px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors">
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="h-3 w-3 text-emerald-500" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Copy className="h-3 w-3" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    Copy
                  </button>
                  {isError && onRetry && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRetry()}
                      className="flex h-6 items-center gap-1 rounded bg-red-500/10 px-2 text-[10px] font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retry
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="rounded-md bg-[hsl(var(--muted))] p-3 font-mono text-xs max-h-64 overflow-auto">
                {activeTab === 'headers' && (
                  event.headers ? <JsonTreeView data={event.headers} /> : <span className="text-[hsl(var(--muted-foreground))]">No headers</span>
                )}
                {activeTab === 'request' && (
                  event.requestBody ? <JsonTreeView data={event.requestBody} /> : <span className="text-[hsl(var(--muted-foreground))]">No request body</span>
                )}
                {activeTab === 'response' && (
                  event.responseBody ? <JsonTreeView data={event.responseBody} /> : <span className="text-[hsl(var(--muted-foreground))]">No response body</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// WebhookEventLog
// ---------------------------------------------------------------------------

export const WebhookEventLog: React.FC<WebhookEventLogProps> = ({
  events,
  onRetry,
  autoRefresh: initialAutoRefresh = false,
  className,
}) => {
  const [filterEndpoint, setFilterEndpoint] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | '2xx' | '4xx' | '5xx'>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(initialAutoRefresh);
  const [countdown, setCountdown] = React.useState(30);

  // Auto-refresh countdown
  React.useEffect(() => {
    if (!autoRefreshEnabled) { setCountdown(30); return; }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoRefreshEnabled]);

  // Filter events
  const filtered = React.useMemo(() => {
    return events.filter((e) => {
      if (filterEndpoint && !e.endpoint.toLowerCase().includes(filterEndpoint.toLowerCase())) return false;
      if (filterStatus === '2xx' && (e.statusCode < 200 || e.statusCode >= 300)) return false;
      if (filterStatus === '4xx' && (e.statusCode < 400 || e.statusCode >= 500)) return false;
      if (filterStatus === '5xx' && e.statusCode < 500) return false;
      return true;
    });
  }, [events, filterEndpoint, filterStatus]);

  // Stats
  const totalCount = events.length;
  const successCount = events.filter((e) => e.statusCode >= 200 && e.statusCode < 300).length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
  const errorCount = events.filter((e) => e.statusCode >= 400).length;

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
      {/* Stats header */}
      <div className="border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Webhook Events</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors',
                showFilters ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={cn(
                'flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors',
                autoRefreshEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
              )}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', autoRefreshEnabled && 'animate-spin')} style={autoRefreshEnabled ? { animationDuration: '3s' } : undefined} />
              {autoRefreshEnabled ? `${countdown}s` : 'Auto'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[hsl(var(--muted-foreground))]">Total:</span>
            <span className="font-semibold text-[hsl(var(--foreground))]">{totalCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[hsl(var(--muted-foreground))]">Success:</span>
            <span className="font-semibold text-emerald-500">{successRate}%</span>
          </div>
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="font-semibold text-red-500">{errorCount} errors</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4 py-2.5">
              <input
                type="text"
                placeholder="Filter by endpoint..."
                value={filterEndpoint}
                onChange={(e) => setFilterEndpoint(e.target.value)}
                className="flex-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              />
              <div className="flex items-center gap-1">
                {(['all', '2xx', '4xx', '5xx'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={cn(
                      'rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
                      filterStatus === s
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event list */}
      <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {filtered.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onRetry={onRetry ? () => onRetry(event.id) : undefined}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
            {events.length === 0 ? 'No webhook events received yet.' : 'No events match the current filters.'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

WebhookEventLog.displayName = 'WebhookEventLog';
