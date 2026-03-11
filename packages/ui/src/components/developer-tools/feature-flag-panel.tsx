'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  Search,
  Plus,
  ChevronDown,
  ToggleLeft,
  Tag,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  enabled: Record<string, boolean>;
  rollout?: Record<string, number>;
  tags?: string[];
  createdAt: string;
}

export interface FeatureFlagPanelProps {
  flags: FeatureFlag[];
  environments: string[];
  onToggle: (flagId: string, environment: string, enabled: boolean) => void;
  onUpdateRollout?: (flagId: string, environment: string, percent: number) => void;
  onAddFlag?: (name: string, description: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const envColors: Record<string, string> = {
  dev: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  development: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  staging: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  prod: 'bg-red-500/15 text-red-600 dark:text-red-400',
  production: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

const formVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Toggle Switch
// ---------------------------------------------------------------------------

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
        enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm',
          enabled ? 'ml-[18px]' : 'ml-[3px]',
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// StatusDot
// ---------------------------------------------------------------------------

function StatusDot({ enabled }: { enabled: boolean }) {
  return (
    <motion.span
      key={enabled ? 'on' : 'off'}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// FeatureFlagPanel
// ---------------------------------------------------------------------------

export const FeatureFlagPanel: React.FC<FeatureFlagPanelProps> = ({
  flags,
  environments,
  onToggle,
  onUpdateRollout,
  onAddFlag,
  className,
}) => {
  const [activeEnv, setActiveEnv] = React.useState(environments[0] ?? 'dev');
  const [search, setSearch] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return flags;
    return flags.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [flags, search]);

  const allEnabled = filtered.length > 0 && filtered.every((f) => f.enabled[activeEnv]);

  const handleToggleAll = () => {
    const newState = !allEnabled;
    filtered.forEach((f) => onToggle(f.id, activeEnv, newState));
  };

  const handleAddFlag = () => {
    if (!newName.trim() || !onAddFlag) return;
    onAddFlag(newName.trim(), newDesc.trim());
    setNewName('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[hsl(var(--border))] p-4">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Feature Flags</h3>
        </div>

        {/* Environment selector */}
        <div className="relative flex rounded-lg bg-[hsl(var(--muted))]/50 p-0.5">
          {environments.map((env) => (
            <button
              key={env}
              type="button"
              onClick={() => setActiveEnv(env)}
              className={cn(
                'relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeEnv === env
                  ? 'text-[hsl(var(--foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              )}
            >
              {activeEnv === env && (
                <motion.div
                  layoutId="env-indicator"
                  className="absolute inset-0 rounded-md bg-[hsl(var(--card))] shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{env}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flags..."
              className="h-8 w-48 rounded-lg border border-[hsl(var(--border))] bg-transparent pl-8 pr-3 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
            />
          </div>

          {/* Toggle all */}
          <button
            type="button"
            onClick={handleToggleAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            <ToggleLeft className="h-3.5 w-3.5" />
            {allEnabled ? 'Disable all' : 'Enable all'}
          </button>

          {/* Add flag */}
          {onAddFlag && (
            <motion.button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Flag
            </motion.button>
          )}
        </div>
      </div>

      {/* Add Flag Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-b border-[hsl(var(--border))]"
          >
            <div className="flex gap-3 p-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Flag name (e.g., enable-dark-mode)"
                className="h-8 flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-2.5 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description"
                className="h-8 flex-1 rounded-md border border-[hsl(var(--border))] bg-transparent px-2.5 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
              />
              <button
                type="button"
                onClick={handleAddFlag}
                disabled={!newName.trim()}
                className="rounded-md bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-md px-3 py-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flag List */}
      <div className="divide-y divide-[hsl(var(--border))]">
        <AnimatePresence initial={false}>
          {filtered.map((flag) => {
            const isEnabled = flag.enabled[activeEnv] ?? false;
            const rollout = flag.rollout?.[activeEnv];

            return (
              <motion.div
                key={flag.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="flex items-center gap-4 px-4 py-3"
              >
                {/* Status dot */}
                <StatusDot enabled={isEnabled} />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {flag.name}
                    </span>
                    {flag.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-0.5 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--muted-foreground))]"
                      >
                        <Tag className="h-2 w-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  {flag.description && (
                    <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                      {flag.description}
                    </p>
                  )}
                </div>

                {/* Created date */}
                <span className="hidden shrink-0 text-xs text-[hsl(var(--muted-foreground))] sm:block">
                  {flag.createdAt}
                </span>

                {/* Rollout slider */}
                {onUpdateRollout && rollout != null && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={rollout}
                      onChange={(e) =>
                        onUpdateRollout(flag.id, activeEnv, Number(e.target.value))
                      }
                      className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[hsl(var(--primary))] dark:bg-gray-700"
                    />
                    <span className="w-8 text-right text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">
                      {rollout}%
                    </span>
                  </div>
                )}

                {/* Toggle */}
                <ToggleSwitch
                  enabled={isEnabled}
                  onChange={(v) => onToggle(flag.id, activeEnv, v)}
                />

                {/* Env badges */}
                <div className="hidden items-center gap-1 lg:flex">
                  {environments.map((env) => (
                    <span
                      key={env}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium',
                        flag.enabled[env]
                          ? envColors[env.toLowerCase()] ?? 'bg-gray-500/15 text-gray-500'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600',
                      )}
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
          {search ? 'No flags match your search.' : 'No feature flags defined.'}
        </div>
      )}
    </motion.div>
  );
};

FeatureFlagPanel.displayName = 'FeatureFlagPanel';
