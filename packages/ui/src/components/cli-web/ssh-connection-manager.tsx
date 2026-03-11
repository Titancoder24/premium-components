'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Wifi,
  WifiOff,
  Plus,
  Trash2,
  Pencil,
  Terminal,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  Clock,
  Activity,
  FolderOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SshConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting';

export interface SshConnection {
  id: string;
  host: string;
  user: string;
  port: number;
  status: SshConnectionStatus;
  label?: string;
  tag?: string;
  lastConnected?: string;
  latency?: number;
}

export interface SshConnectionManagerProps {
  connections: SshConnection[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onAdd: (conn: Omit<SshConnection, 'id' | 'status'>) => void;
  onEdit: (id: string, conn: Partial<SshConnection>) => void;
  onDelete: (id: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<SshConnectionStatus, { label: string; dot: string; text: string }> = {
  connected: { label: 'Connected', dot: 'bg-emerald-500', text: 'text-emerald-500' },
  disconnected: { label: 'Disconnected', dot: 'bg-zinc-400', text: 'text-zinc-400' },
  error: { label: 'Error', dot: 'bg-red-500', text: 'text-red-500' },
  connecting: { label: 'Connecting', dot: 'bg-amber-500', text: 'text-amber-500' },
};

// ---------------------------------------------------------------------------
// AddConnectionForm
// ---------------------------------------------------------------------------

const AddConnectionForm: React.FC<{
  onAdd: SshConnectionManagerProps['onAdd'];
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [host, setHost] = React.useState('');
  const [user, setUser] = React.useState('');
  const [port, setPort] = React.useState('22');
  const [label, setLabel] = React.useState('');
  const [tag, setTag] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!host.trim() || !user.trim()) return;
    onAdd({ host: host.trim(), user: user.trim(), port: Number(port) || 22, label: label.trim() || undefined, tag: tag.trim() || undefined });
    setHost(''); setUser(''); setPort('22'); setLabel(''); setTag('');
  };

  const inputClass = 'w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]';

  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-[hsl(var(--border))] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">New Connection</span>
          <button type="button" onClick={onCancel} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">Host <span className="text-red-500">*</span></label>
            <input type="text" value={host} onChange={(e) => setHost(e.target.value)} placeholder="192.168.1.100" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">User <span className="text-red-500">*</span></label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="root" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">Port</label>
            <input type="number" value={port} onChange={(e) => setPort(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Production" className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs text-[hsl(var(--muted-foreground))]">Tag / Group</label>
            <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="staging" className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="h-8 rounded-lg border border-[hsl(var(--border))] px-3 text-xs text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors">Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="h-8 rounded-lg bg-[hsl(var(--primary))] px-3 text-xs font-medium text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">Add Connection</motion.button>
        </div>
      </div>
    </motion.form>
  );
};

// ---------------------------------------------------------------------------
// ConnectionRow
// ---------------------------------------------------------------------------

const ConnectionRow: React.FC<{
  connection: SshConnection;
  onConnect: () => void;
  onDisconnect: () => void;
  onEdit: (partial: Partial<SshConnection>) => void;
  onDelete: () => void;
}> = ({ connection, onConnect, onDisconnect, onEdit, onDelete }) => {
  const [editing, setEditing] = React.useState(false);
  const [editHost, setEditHost] = React.useState(connection.host);
  const [editUser, setEditUser] = React.useState(connection.user);
  const [editPort, setEditPort] = React.useState(String(connection.port));

  const cfg = statusConfig[connection.status];
  const isLoading = connection.status === 'connecting';

  const handleSave = () => {
    onEdit({ host: editHost, user: editUser, port: Number(editPort) || 22 });
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Status dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className={cn('absolute h-full w-full rounded-full', cfg.dot)} />
          {connection.status === 'connected' && (
            <motion.span
              className={cn('absolute h-full w-full rounded-full', cfg.dot)}
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </span>

        <Server className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />

        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
              {connection.label ?? connection.host}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', cfg.text, connection.status === 'connected' ? 'bg-emerald-500/10' : connection.status === 'error' ? 'bg-red-500/10' : 'bg-[hsl(var(--muted))]')}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="font-mono text-[11px]">{connection.user}@{connection.host}:{connection.port}</span>
            {connection.lastConnected && (
              <>
                <span className="text-[hsl(var(--border))]">|</span>
                <Clock className="h-3 w-3" />
                <span>{connection.lastConnected}</span>
              </>
            )}
            {connection.latency != null && (
              <>
                <span className="text-[hsl(var(--border))]">|</span>
                <Activity className="h-3 w-3" />
                <span>{connection.latency}ms</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {connection.status === 'connected' ? (
            <button onClick={onDisconnect} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-red-500/10 hover:text-red-500 transition-colors" aria-label="Disconnect">
              <WifiOff className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button onClick={onConnect} disabled={isLoading} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors disabled:opacity-40" aria-label="Connect">
              {isLoading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-flex">
                  <Loader2 className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <Wifi className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          {connection.status === 'connected' && (
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors" aria-label="Open terminal">
              <Terminal className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => { setEditing(!editing); setEditHost(connection.host); setEditUser(connection.user); setEditPort(String(connection.port)); }} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors" aria-label="Edit">
            <Pencil className="h-3 w-3" />
          </button>
          <button onClick={onDelete} className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:bg-red-500/10 hover:text-red-500 transition-colors" aria-label="Delete">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Inline edit form */}
      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[hsl(var(--border))] px-4 py-3 flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-[hsl(var(--muted-foreground))]">Host</label>
                <input type="text" value={editHost} onChange={(e) => setEditHost(e.target.value)} className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]" />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-[10px] text-[hsl(var(--muted-foreground))]">User</label>
                <input type="text" value={editUser} onChange={(e) => setEditUser(e.target.value)} className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]" />
              </div>
              <div className="w-16">
                <label className="mb-1 block text-[10px] text-[hsl(var(--muted-foreground))]">Port</label>
                <input type="number" value={editPort} onChange={(e) => setEditPort(e.target.value)} className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-xs text-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="h-7 rounded-md bg-[hsl(var(--primary))] px-3 text-xs font-medium text-[hsl(var(--primary-foreground))]">Save</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// SshConnectionManager
// ---------------------------------------------------------------------------

export const SshConnectionManager: React.FC<SshConnectionManagerProps> = ({
  connections,
  onConnect,
  onDisconnect,
  onAdd,
  onEdit,
  onDelete,
  className,
}) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [collapsedTags, setCollapsedTags] = React.useState<Set<string>>(new Set());

  const tags: string[] = Array.from(new Set(connections.map((c) => c.tag ?? 'Ungrouped')));
  const grouped = tags.map((tag) => ({
    tag,
    items: connections.filter((c) => (c.tag ?? 'Ungrouped') === tag),
  }));

  const toggleTag = (tag: string) => {
    setCollapsedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const connectedCount = connections.filter((c) => c.status === 'connected').length;

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
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Server className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">SSH Connections</h3>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">{connectedCount}/{connections.length} active</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="flex h-7 items-center gap-1 rounded-md bg-[hsl(var(--primary))] px-2.5 text-xs font-medium text-[hsl(var(--primary-foreground))]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && <AddConnectionForm onAdd={(c) => { onAdd(c); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}
      </AnimatePresence>

      {/* Connection groups */}
      <div className="p-4 space-y-3">
        {grouped.map(({ tag, items }) => (
          <div key={tag}>
            {tags.length > 1 && (
              <button
                onClick={() => toggleTag(tag)}
                className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <motion.span animate={{ rotate: collapsedTags.has(tag) ? 0 : 90 }} transition={{ duration: 0.15 }}>
                  <ChevronRight className="h-3 w-3" />
                </motion.span>
                <FolderOpen className="h-3 w-3" />
                {tag} ({items.length})
              </button>
            )}
            <AnimatePresence initial={false}>
              {!collapsedTags.has(tag) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  {items.map((conn) => (
                    <ConnectionRow
                      key={conn.id}
                      connection={conn}
                      onConnect={() => onConnect(conn.id)}
                      onDisconnect={() => onDisconnect(conn.id)}
                      onEdit={(partial) => onEdit(conn.id, partial)}
                      onDelete={() => onDelete(conn.id)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {connections.length === 0 && (
          <div className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No connections configured. Click &quot;Add&quot; to create one.
          </div>
        )}
      </div>
    </motion.div>
  );
};

SshConnectionManager.displayName = 'SshConnectionManager';
