'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Tenant {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface TenantSwitcherProps {
  tenants: Tenant[];
  activeTenantId: string;
  onSwitch: (tenantId: string) => void;
  onCreate?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function TenantAvatar({
  tenant,
  size = 32,
}: {
  tenant: Tenant;
  size?: number;
}) {
  const initials = tenant.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (tenant.avatarUrl) {
    return (
      <img
        src={tenant.avatarUrl}
        alt={tenant.name}
        className="rounded-md object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];
  const colorIndex =
    tenant.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md text-white font-semibold',
        colors[colorIndex],
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role Badge
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: string }) {
  const colorMap: Record<string, string> = {
    owner:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    admin:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    member:
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  const cls = colorMap[role.toLowerCase()] || colorMap.member;

  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium capitalize', cls)}>
      {role}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TenantSwitcher({
  tenants,
  activeTenantId,
  onSwitch,
  onCreate,
  className,
}: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [switching, setSwitching] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()),
  );

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setFocusedIndex(-1);
    }
  }, [open]);

  const handleSwitch = (tenantId: string) => {
    if (tenantId === activeTenantId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    setTimeout(() => {
      onSwitch(tenantId);
      setSwitching(false);
      setOpen(false);
      setQuery('');
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filtered.length) {
          handleSwitch(filtered[focusedIndex].id);
        }
        break;
      case 'Escape':
        setOpen(false);
        setQuery('');
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <AnimatePresence mode="wait">
        <motion.button
          key={switching ? 'switching' : activeTenant?.id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'flex items-center gap-2.5 rounded-lg border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] px-3 py-2 text-left transition-colors',
            'hover:bg-[var(--color-muted,#f3f4f6)] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800',
            open && 'ring-2 ring-[var(--color-primary,#3b82f6)]/30',
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {activeTenant && <TenantAvatar tenant={activeTenant} size={24} />}
          <span className="max-w-[140px] truncate text-sm font-medium text-[var(--color-foreground,#111827)] dark:text-gray-100">
            {activeTenant?.name ?? 'Select workspace'}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground,#6b7280)]" />
          </motion.div>
        </motion.button>
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-[var(--color-border,#e5e7eb)] bg-[var(--color-surface,#ffffff)] shadow-lg dark:border-gray-700 dark:bg-gray-900"
            role="listbox"
          >
            {/* Search */}
            <div className="border-b border-[var(--color-border,#e5e7eb)] p-2 dark:border-gray-700">
              <div className="flex items-center gap-2 rounded-md bg-[var(--color-muted,#f3f4f6)] px-2.5 py-1.5 dark:bg-gray-800">
                <Search className="h-3.5 w-3.5 text-[var(--color-muted-foreground,#6b7280)]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search workspaces..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  className="flex-1 bg-transparent text-xs text-[var(--color-foreground,#111827)] outline-none placeholder:text-[var(--color-muted-foreground,#6b7280)] dark:text-gray-100"
                />
              </div>
            </div>

            {/* Tenant list */}
            <div className="max-h-56 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--color-muted-foreground,#6b7280)]">
                  No workspaces found
                </p>
              ) : (
                filtered.map((tenant, index) => {
                  const isActive = tenant.id === activeTenantId;
                  const isFocused = index === focusedIndex;

                  return (
                    <motion.button
                      key={tenant.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSwitch(tenant.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                        isActive
                          ? 'bg-[var(--color-primary,#3b82f6)]/10 dark:bg-blue-950/40'
                          : isFocused
                            ? 'bg-[var(--color-muted,#f3f4f6)] dark:bg-gray-800'
                            : 'hover:bg-[var(--color-muted,#f3f4f6)] dark:hover:bg-gray-800',
                      )}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                    >
                      <TenantAvatar tenant={tenant} size={28} />
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium text-[var(--color-foreground,#111827)] dark:text-gray-100">
                          {tenant.name}
                        </span>
                        {tenant.role && (
                          <div className="mt-0.5">
                            <RoleBadge role={tenant.role} />
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Check className="h-4 w-4 text-[var(--color-primary,#3b82f6)]" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Create button */}
            {onCreate && (
              <div className="border-t border-[var(--color-border,#e5e7eb)] p-1.5 dark:border-gray-700">
                <motion.button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onCreate();
                  }}
                  whileHover={{ x: 2 }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--color-muted,#f3f4f6)] dark:hover:bg-gray-800"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-dashed border-[var(--color-border,#e5e7eb)] dark:border-gray-600">
                    <Plus className="h-3.5 w-3.5 text-[var(--color-muted-foreground,#6b7280)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-muted-foreground,#6b7280)]">
                    Create New Workspace
                  </span>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

TenantSwitcher.displayName = 'TenantSwitcher';
