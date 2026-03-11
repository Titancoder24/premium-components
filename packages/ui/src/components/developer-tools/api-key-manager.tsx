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
  ShieldOff,
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
  lastUsedAt?: string;
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
  if (key.length <= 8) return '****';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
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
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Copy key"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
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
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([]);
  const [confirmRevokeId, setConfirmRevokeId] = React.useState<string | null>(null);
  const [newKeyId, setNewKeyId] = React.useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateKey(newName.trim(), selectedScopes);
    setNewName('');
    setSelectedScopes([]);
    setShowCreateForm(false);
    if (keys.length > 0) {
      setNewKeyId(keys[keys.length - 1]?.id ?? null);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleRevoke = (id: string) => {
    onRevokeKey(id);
    setConfirmRevokeId(null);
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Key
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4 dark:bg-muted/20">
              <input
                type="text"
                placeholder="Key name (e.g., Production API)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mb-3 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="mb-3">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Scopes</span>
                <div className="flex flex-wrap gap-2">
                  {availableScopes.map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => toggleScope(scope)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        selectedScopes.includes(scope)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80',
                      )}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Generate Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <AnimatePresence initial={false}>
          {keys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              variants={rowVariants}
              layout
              className={cn(
                'group relative rounded-lg border border-border px-4 py-3 transition-colors',
                apiKey.status === 'revoked' && 'opacity-60',
                newKeyId === apiKey.id && 'ring-2 ring-primary/40',
              )}
            >
              {/* New key pulse */}
              {newKeyId === apiKey.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  onAnimationComplete={() => setNewKeyId(null)}
                />
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{apiKey.name}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        apiKey.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                      )}
                    >
                      {apiKey.status === 'active' ? (
                        <Shield className="h-2.5 w-2.5" />
                      ) : (
                        <ShieldOff className="h-2.5 w-2.5" />
                      )}
                      {apiKey.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                      {maskKey(apiKey.key)}
                    </code>
                    <span>Created {apiKey.createdAt}</span>
                    {apiKey.lastUsedAt && <span>Last used {apiKey.lastUsedAt}</span>}
                  </div>
                  {apiKey.scopes && apiKey.scopes.length > 0 && (
                    <div className="mt-1.5 flex gap-1">
                      {apiKey.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {apiKey.status === 'active' && (
                    <>
                      <CopyButton value={apiKey.key} onCopy={onCopyKey} />
                      <button
                        type="button"
                        onClick={() => setConfirmRevokeId(apiKey.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                        aria-label="Revoke key"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Revoke Confirmation */}
              <AnimatePresence>
                {confirmRevokeId === apiKey.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-center gap-3 rounded-md border border-rose-500/20 bg-rose-500/5 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span className="flex-1 text-xs text-rose-600 dark:text-rose-400">
                        This action cannot be undone. Revoke this key?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRevoke(apiKey.id)}
                        className="rounded-md bg-rose-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-rose-600"
                      >
                        Revoke
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRevokeId(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {keys.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No API keys yet. Create one to get started.
        </div>
      )}
    </div>
  );
};

ApiKeyManager.displayName = 'ApiKeyManager';
