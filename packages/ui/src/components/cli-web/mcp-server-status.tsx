'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  ChevronDown,
  RefreshCw,
  Unplug,
  Eye,
  EyeOff,
  Wrench,
  Zap,
  Clock,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type McpConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface McpTool {
  name: string;
  description: string;
  type?: string;
  enabled?: boolean;
}

export interface McpServer {
  id: string;
  name: string;
  url: string;
  status: McpConnectionStatus;
  tools: McpTool[];
  connectedAt?: string;
}

export interface McpServerStatusProps {
  servers: McpServer[];
  onReconnect: (serverId: string) => void;
  onDisconnect?: (serverId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<
  McpConnectionStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  connected: {
    label: 'Connected',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
  },
  disconnected: {
    label: 'Disconnected',
    dot: 'bg-red-500',
    bg: 'bg-red-500/10',
    text: 'text-red-500',
  },
  connecting: {
    label: 'Connecting',
    dot: 'bg-amber-500',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
  },
};

// ---------------------------------------------------------------------------
// ServerRow
// ---------------------------------------------------------------------------

const ServerRow: React.FC<{
  server: McpServer;
  onReconnect: () => void;
  onDisconnect?: () => void;
}> = ({ server, onReconnect, onDisconnect }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [urlRevealed, setUrlRevealed] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);

  const config = statusConfig[server.status];

  const maskUrl = (url: string) => {
    try {
      const u = new URL(url);
      return `${u.protocol}//${'•'.repeat(8)}:${u.port || '***'}`;
    } catch {
      return '•'.repeat(16);
    }
  };

  const handleReconnect = () => {
    setSpinning(true);
    onReconnect();
    setTimeout(() => setSpinning(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/60"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Status dot with pulse */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className={cn('absolute h-full w-full rounded-full', config.dot)} />
          {server.status === 'connected' && (
            <motion.span
              className={cn('absolute h-full w-full rounded-full', config.dot)}
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </span>

        <Server className="h-4 w-4 shrink-0 text-zinc-400" />

        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {server.name}
            </span>
            <span
              className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', config.bg, config.text)}
            >
              {config.label}
            </span>
            {server.status === 'connected' && (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">
                {server.tools.length} tools
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <button
              onClick={() => setUrlRevealed((v) => !v)}
              className="flex items-center gap-1 transition-colors hover:text-zinc-300"
            >
              {urlRevealed ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </button>
            <span className="truncate font-mono text-[11px]">
              {urlRevealed ? server.url : maskUrl(server.url)}
            </span>
            {server.connectedAt && (
              <>
                <span className="text-zinc-600">·</span>
                <Clock className="h-3 w-3" />
                <span>{server.connectedAt}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {server.status !== 'connecting' && (
            <button
              onClick={handleReconnect}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              aria-label="Reconnect"
            >
              <motion.span
                animate={spinning ? { rotate: 360 } : { rotate: 0 }}
                transition={spinning ? { duration: 0.8, ease: 'linear' } : { duration: 0 }}
                className="inline-flex"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.span>
            </button>
          )}
          {onDisconnect && server.status === 'connected' && (
            <button
              onClick={() => onDisconnect()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
              aria-label="Disconnect"
            >
              <Unplug className="h-3.5 w-3.5" />
            </button>
          )}
          {server.tools.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
              aria-label="Toggle tools"
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable tool list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-700">
              <div className="flex flex-col gap-1">
                {server.tools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/40"
                  >
                    <span className="mt-0.5 shrink-0">
                      {tool.type === 'api' ? (
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Wrench className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {tool.description}
                      </span>
                    </div>
                    {tool.enabled === false && (
                      <span className="ml-auto shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700">
                        disabled
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// McpServerStatus
// ---------------------------------------------------------------------------

export const McpServerStatus: React.FC<McpServerStatusProps> = ({
  servers,
  onReconnect,
  onDisconnect,
  className,
}) => {
  const connectedCount = servers.filter((s) => s.status === 'connected').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900',
        className,
      )}
    >
      {/* Summary header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">MCP Servers</h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {connectedCount}/{servers.length} connected
        </span>
      </div>

      {/* Server list */}
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {servers.map((server) => (
            <ServerRow
              key={server.id}
              server={server}
              onReconnect={() => onReconnect(server.id)}
              onDisconnect={onDisconnect ? () => onDisconnect(server.id) : undefined}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

McpServerStatus.displayName = 'McpServerStatus';
