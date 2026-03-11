'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface EnvironmentVariableEditorProps {
  variables: EnvVar[];
  environments: string[];
  activeEnv: string;
  onChange: (variables: EnvVar[], env: string) => void;
  onImport?: (file: File) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const rowVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -40,
    height: 0,
    transition: { duration: 0.2 },
  },
};

const tabUnderlineTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

// ---------------------------------------------------------------------------
// EnvironmentVariableEditor
// ---------------------------------------------------------------------------

export const EnvironmentVariableEditor: React.FC<EnvironmentVariableEditorProps> = ({
  variables,
  environments,
  activeEnv,
  onChange,
  onImport,
  className,
}) => {
  const [localVars, setLocalVars] = React.useState<EnvVar[]>(variables);
  const [currentEnv, setCurrentEnv] = React.useState(activeEnv);
  const [revealedIds, setRevealedIds] = React.useState<Set<string>>(new Set());
  const [dragId, setDragId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isDirty = React.useMemo(() => {
    if (localVars.length !== variables.length) return true;
    return localVars.some((v, i) => {
      const orig = variables[i];
      return !orig || v.key !== orig.key || v.value !== orig.value || v.isSecret !== orig.isSecret;
    });
  }, [localVars, variables]);

  React.useEffect(() => {
    setLocalVars(variables);
  }, [variables]);

  React.useEffect(() => {
    setCurrentEnv(activeEnv);
  }, [activeEnv]);

  const addVariable = () => {
    const newVar: EnvVar = {
      id: crypto.randomUUID(),
      key: '',
      value: '',
      isSecret: false,
    };
    const next = [...localVars, newVar];
    setLocalVars(next);
    onChange(next, currentEnv);
  };

  const removeVariable = (id: string) => {
    const next = localVars.filter((v) => v.id !== id);
    setLocalVars(next);
    setRevealedIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    onChange(next, currentEnv);
  };

  const updateVariable = (id: string, field: keyof EnvVar, val: string | boolean) => {
    const next = localVars.map((v) => (v.id === id ? { ...v, [field]: val } : v));
    setLocalVars(next);
    onChange(next, currentEnv);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const switchEnv = (env: string) => {
    setCurrentEnv(env);
    onChange(localVars, env);
  };

  const handleDragStart = (id: string) => setDragId(id);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const fromIndex = localVars.findIndex((v) => v.id === dragId);
    const toIndex = localVars.findIndex((v) => v.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const next = [...localVars];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved!);
    setLocalVars(next);
  };

  const handleDragEnd = () => {
    setDragId(null);
    onChange(localVars, currentEnv);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) onImport(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-0">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Environment Variables</h3>
          {isDirty && (
            <motion.span
              className="h-2 w-2 rounded-full bg-amber-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              title="Unsaved changes"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {onImport && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".env,.env.*"
                onChange={handleImport}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </button>
            </>
          )}
          <button
            type="button"
            onClick={addVariable}
            className="flex items-center gap-1 rounded-lg bg-[var(--color-primary,theme(colors.blue.600))] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Variable
          </button>
        </div>
      </div>

      {/* Env tabs */}
      <div className="relative flex gap-0 border-b border-border px-5">
        {environments.map((env) => (
          <button
            key={env}
            type="button"
            onClick={() => switchEnv(env)}
            className={cn(
              'relative px-4 py-2.5 text-xs font-medium transition-colors',
              currentEnv === env
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {env}
            {currentEnv === env && (
              <motion.div
                layoutId="env-tab-underline"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-primary,theme(colors.blue.500))]"
                transition={tabUnderlineTransition}
              />
            )}
          </button>
        ))}
      </div>

      {/* Variable list */}
      <div className="p-5 space-y-0">
        <div className="grid grid-cols-[24px_1fr_1fr_72px] gap-2 mb-2 px-1">
          <span />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Key</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Value</span>
          <span />
        </div>

        <AnimatePresence initial={false}>
          {localVars.map((v) => (
            <motion.div
              key={v.id}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              draggable
              onDragStart={() => handleDragStart(v.id)}
              onDragOver={(e) => handleDragOver(e, v.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                'grid grid-cols-[24px_1fr_1fr_72px] gap-2 items-center rounded-lg px-1 py-1.5 transition-colors',
                dragId === v.id && 'opacity-50',
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
              <input
                type="text"
                value={v.key}
                onChange={(e) => updateVariable(v.id, 'key', e.target.value)}
                placeholder="VARIABLE_NAME"
                className="rounded-md border border-border bg-muted/30 px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
              />
              <div className="relative">
                <input
                  type={v.isSecret && !revealedIds.has(v.id) ? 'password' : 'text'}
                  value={v.value}
                  onChange={(e) => updateVariable(v.id, 'value', e.target.value)}
                  placeholder="value"
                  className="w-full rounded-md border border-border bg-muted/30 px-2.5 py-1.5 pr-8 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,theme(colors.blue.500))]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!v.isSecret) {
                      updateVariable(v.id, 'isSecret', true);
                    } else if (revealedIds.has(v.id)) {
                      toggleReveal(v.id);
                    } else {
                      toggleReveal(v.id);
                    }
                  }}
                  onDoubleClick={() => updateVariable(v.id, 'isSecret', !v.isSecret)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  title={v.isSecret ? 'Click to reveal, double-click to unmark as secret' : 'Double-click to mark as secret'}
                >
                  {v.isSecret && !revealedIds.has(v.id) ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeVariable(v.id)}
                className="justify-self-center rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                aria-label="Delete variable"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {localVars.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No variables defined. Click &quot;Add Variable&quot; to get started.
          </p>
        )}
      </div>
    </div>
  );
};

EnvironmentVariableEditor.displayName = 'EnvironmentVariableEditor';
