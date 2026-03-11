'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Copy,
  Check,
  Trash2,
  Plus,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
  scopes?: string[];
}

export interface ApiKeyManagerProps {
  keys: ApiKey[];
  onCreateKey: (name: string, scopes: string[]) => void;
  onRevokeKey: (id: string) => void;
  onCopyKey: (key: string) => void;
  availableScopes?: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 3)}${'•'.repeat(8)}${key.slice(-4)}`;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const statusColors: Record<ApiKey['status'], string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  revoked: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

function CopyButton({ value, onCopy }: { value: string; onCopy: (v: string) => void }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label="Copy API key"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Check className="h-4 w-4 text-emerald-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Copy className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ---------------------------------------------------------------------------
// RevokeConfirm
// ---------------------------------------------------------------------------

function RevokeConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 mt-2">
        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
        <p className="text-sm text-rose-600 dark:text-rose-400 flex-1">
          This action cannot be undone. Revoke this key?
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-600 transition-colors"
        >
          Revoke
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ApiKeyManager
// ---------------------------------------------------------------------------

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  keys,
  onCreateKey,
  onRevokeKey,
  onCopyKey,
  availableScopes = ['read', 'write', 'admin'],
  className,
}) => {
  const [showCreate, setShowCreate] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([]);
  const [revokeConfirmId, setRevokeConfirmId] = React.useState<string | null>(null);
  const [newKeyId, setNewKeyId] = React.useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateKey(newName.trim(), selectedScopes);
    setNewName('');
    setSelectedScopes([]);
    setShowCreate(false);
    if (keys.length > 0) {
      setNewKeyId(keys[0]?.id ?? null);
      setTimeout(() => setNewKeyId(null), 2000);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary,theme(colors.blue.600))] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Key
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="overflow-hidden"
          >
            <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Key name (e.g. Production API)"
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Scopes:</span>
                {availableScopes.map((scope) => (
                  <button
                    key={scope}
                    type="button"
                    onClick={() => toggleScope(scope)}
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border',
                      selectedScopes.includes(scope)
                        ? 'border-[var(--color-primary,theme(colors.blue.500))] bg-[var(--color-primary,theme(colors.blue.500))]/10 text-[var(--color-primary,theme(colors.blue.600))]'
                        : 'border-border text-muted-foreground hover:border-foreground/30',
                    )}
                  >
                    {scope}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="rounded-md bg-[var(--color-primary,theme(colors.blue.600))] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key list */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <AnimatePresence initial={false}>
          {keys.map((apiKey) => (
            <motion.li
              key={apiKey.id}
              variants={rowVariants}
              layout
              exit="exit"
              className={cn(
                'relative rounded-lg border border-border p-3 transition-colors',
                newKeyId === apiKey.id && 'ring-2 ring-[var(--color-primary,theme(colors.blue.500))]/50',
              )}
            >
              {newKeyId === apiKey.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-[var(--color-primary,theme(colors.blue.500))]/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: 1 }}
                />
              )}
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {apiKey.name}
                    </span>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        statusColors[apiKey.status],
                      )}
                    >
                      {apiKey.status}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {maskKey(apiKey.key)}
                  </p>
                  <div className="mt-1 flex gap-3 text-[10px] text-muted-foreground">
                    <span>Created {apiKey.createdAt}</span>
                    {apiKey.lastUsed && <span>Last used {apiKey.lastUsed}</span>}
                  </div>
                </div>

                {apiKey.status === 'active' && (
                  <div className="flex items-center gap-1 shrink-0">
                    <CopyButton value={apiKey.key} onCopy={onCopyKey} />
                    <button
                      type="button"
                      onClick={() =>
                        setRevokeConfirmId(revokeConfirmId === apiKey.id ? null : apiKey.id)
                      }
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                      aria-label="Revoke key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {revokeConfirmId === apiKey.id && (
                  <RevokeConfirm
                    onConfirm={() => {
                      onRevokeKey(apiKey.id);
                      setRevokeConfirmId(null);
                    }}
                    onCancel={() => setRevokeConfirmId(null)}
                  />
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {keys.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No API keys yet. Create one to get started.
        </p>
      )}
    </div>
  );
};

ApiKeyManager.displayName = 'ApiKeyManager';
