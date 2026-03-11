'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Download,
  UserPlus,
  Tag,
  Archive,
  CheckSquare,
  X,
  ChevronDown,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  variant?: 'default' | 'danger';
  requiresConfirmation?: boolean;
}

export interface BulkActionToolbarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onExecuteAction?: (actionId: string) => void | Promise<void>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Default icon map
// ---------------------------------------------------------------------------

const defaultIcons: Record<string, React.ElementType> = {
  delete: Trash2,
  export: Download,
  assign: UserPlus,
  tag: Tag,
  archive: Archive,
};

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------

function AnimatedCount({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// BulkActionToolbar
// ---------------------------------------------------------------------------

export function BulkActionToolbar({
  selectedCount,
  totalCount,
  actions,
  onSelectAll,
  onDeselectAll,
  onExecuteAction,
  className,
}: BulkActionToolbarProps) {
  const [confirmAction, setConfirmAction] = React.useState<string | null>(null);
  const [executing, setExecuting] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isVisible = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleExecute = async (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    if (!action) return;

    if (action.requiresConfirmation && confirmAction !== actionId) {
      setConfirmAction(actionId);
      return;
    }

    setConfirmAction(null);
    setExecuting(actionId);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return p;
        }
        return p + Math.random() * 20;
      });
    }, 150);

    try {
      await onExecuteAction?.(actionId);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setExecuting(null);
        setProgress(0);
      }, 400);
    }
  };

  const cancelConfirm = () => setConfirmAction(null);

  const renderAction = (action: BulkAction) => {
    const Icon = action.icon ?? defaultIcons[action.id] ?? Tag;
    const isDanger = action.variant === 'danger';
    const isExecuting = executing === action.id;

    return (
      <motion.button
        key={action.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        disabled={isExecuting}
        onClick={() => handleExecute(action.id)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60',
          isDanger
            ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
            : 'text-foreground hover:bg-muted',
        )}
      >
        {isExecuting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Icon className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">{action.label}</span>
      </motion.button>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 28 } }}
          exit={{ y: -48, opacity: 0, transition: { duration: 0.2 } }}
          className={cn(
            'relative overflow-hidden rounded-lg border border-border bg-card shadow-sm',
            className,
          )}
        >
          {/* Progress bar */}
          <AnimatePresence>
            {executing && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: 'left' }}
                className="absolute inset-x-0 top-0 h-0.5 bg-primary"
              />
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 px-4 py-2.5">
            {/* Select all checkbox */}
            <button
              type="button"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <CheckSquare
                className={cn('h-4 w-4', allSelected ? 'text-primary' : 'text-muted-foreground')}
              />
            </button>

            {/* Count badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <AnimatedCount value={selectedCount} /> selected
            </span>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1 border-l border-border pl-3 sm:flex">
              {actions.map(renderAction)}
            </div>

            {/* Mobile dropdown */}
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm text-foreground hover:bg-muted"
              >
                Actions
                <motion.span
                  animate={{ rotate: mobileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {mobileOpen && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute left-0 top-10 z-20 w-44 rounded-md border border-border bg-card py-1 shadow-lg"
                  >
                    {actions.map((action) => {
                      const Icon = action.icon ?? defaultIcons[action.id] ?? Tag;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => { setMobileOpen(false); handleExecute(action.id); }}
                          className={cn(
                            'flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted',
                            action.variant === 'danger' && 'text-red-500',
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" /> {action.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Deselect all */}
            <button
              type="button"
              onClick={onDeselectAll}
              className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Deselect all
            </button>
          </div>

          {/* Confirmation overlay */}
          <AnimatePresence>
            {confirmAction && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="overflow-hidden border-t border-border bg-muted/30"
              >
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-foreground">
                    {actions.find((a) => a.id === confirmAction)?.label}{' '}
                    <span className="font-medium">{selectedCount}</span> item
                    {selectedCount !== 1 ? 's' : ''}?
                  </span>
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={cancelConfirm}
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleExecute(confirmAction)}
                      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Confirm
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

BulkActionToolbar.displayName = 'BulkActionToolbar';
