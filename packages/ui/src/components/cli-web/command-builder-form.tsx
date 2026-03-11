'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Play,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlagDef {
  name: string;
  alias?: string;
  description?: string;
  type: 'boolean' | 'string' | 'number';
  default?: string | boolean | number;
  group?: string;
}

export interface SubcommandDef {
  name: string;
  description?: string;
}

export interface PositionalArgDef {
  name: string;
  description?: string;
  required?: boolean;
}

export interface CommandDef {
  name: string;
  description?: string;
  subcommands?: SubcommandDef[];
  flags?: FlagDef[];
  positionalArgs?: PositionalArgDef[];
}

export interface CommandBuilderFormProps {
  command: CommandDef;
  onRun: (cmd: string) => void;
  onCopy?: (cmd: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCommand(
  command: CommandDef,
  subcommand: string,
  boolFlags: Record<string, boolean>,
  optionValues: Record<string, string>,
  positionalValues: string[],
): string {
  const parts: string[] = [command.name];
  if (subcommand) parts.push(subcommand);

  for (const flag of command.flags ?? []) {
    if (flag.type === 'boolean' && boolFlags[flag.name]) {
      parts.push(`--${flag.name}`);
    } else if (flag.type !== 'boolean' && optionValues[flag.name]) {
      const val = optionValues[flag.name]!;
      parts.push(val.includes(' ') ? `--${flag.name}="${val}"` : `--${flag.name}=${val}`);
    }
  }

  for (const val of positionalValues) {
    if (val.trim()) parts.push(val.includes(' ') ? `"${val}"` : val);
  }

  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// FlagToggle
// ---------------------------------------------------------------------------

const FlagToggle: React.FC<{
  flag: FlagDef;
  enabled: boolean;
  onToggle: (name: string) => void;
}> = ({ flag, enabled, onToggle }) => (
  <div className="flex items-center justify-between gap-3 py-1.5">
    <div className="flex items-center gap-2 min-w-0">
      <code className="text-xs font-mono text-[hsl(var(--foreground))]">--{flag.name}</code>
      {flag.description && (
        <div className="group relative">
          <HelpCircle className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] cursor-help" />
          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[hsl(var(--popover))] px-2.5 py-1.5 text-xs text-[hsl(var(--popover-foreground))] opacity-0 shadow-md transition-opacity group-hover:opacity-100 border border-[hsl(var(--border))]">
            {flag.description}
          </div>
        </div>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(flag.name)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
        enabled ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm mt-0.5',
          enabled ? 'ml-[18px]' : 'ml-0.5',
        )}
      />
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// CollapsibleGroup
// ---------------------------------------------------------------------------

const CollapsibleGroup: React.FC<{
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ label, defaultOpen = true, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-[hsl(var(--border))] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.span>
        {label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CommandBuilderForm
// ---------------------------------------------------------------------------

export const CommandBuilderForm: React.FC<CommandBuilderFormProps> = ({
  command,
  onRun,
  onCopy,
  className,
}) => {
  const [subcommand, setSubcommand] = React.useState('');
  const [boolFlags, setBoolFlags] = React.useState<Record<string, boolean>>({});
  const [optionValues, setOptionValues] = React.useState<Record<string, string>>({});
  const [positionalValues, setPositionalValues] = React.useState<string[]>(
    () => (command.positionalArgs ?? []).map(() => ''),
  );
  const [copied, setCopied] = React.useState(false);
  const [subOpen, setSubOpen] = React.useState(false);

  const cmdString = buildCommand(command, subcommand, boolFlags, optionValues, positionalValues);

  const handleCopy = () => {
    navigator.clipboard?.writeText(cmdString);
    onCopy?.(cmdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFlag = (name: string) => {
    setBoolFlags((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const setOption = (name: string, value: string) => {
    setOptionValues((prev) => ({ ...prev, [name]: value }));
  };

  const setPositional = (index: number, value: string) => {
    setPositionalValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Group flags by category
  const booleanFlags = (command.flags ?? []).filter((f) => f.type === 'boolean');
  const optionFlags = (command.flags ?? []).filter((f) => f.type !== 'boolean');
  const groups = Array.from(new Set((command.flags ?? []).map((f) => f.group ?? 'General')));

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
      <div className="flex items-center gap-2.5 border-b border-[hsl(var(--border))] px-4 py-3">
        <Terminal className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{command.name}</h3>
        {command.description && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            &mdash; {command.description}
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Subcommand selector */}
        {command.subcommands && command.subcommands.length > 0 && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[hsl(var(--muted-foreground))]">
              Subcommand
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSubOpen(!subOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] hover:border-[hsl(var(--ring))] transition-colors"
              >
                <span>{subcommand || 'Select subcommand...'}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', subOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {subOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-10 mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--popover))] py-1 shadow-lg"
                  >
                    {command.subcommands.map((sc) => (
                      <li key={sc.name}>
                        <button
                          type="button"
                          onClick={() => { setSubcommand(sc.name); setSubOpen(false); }}
                          className="flex w-full flex-col items-start px-3 py-1.5 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                          <span className="text-sm font-medium text-[hsl(var(--foreground))]">{sc.name}</span>
                          {sc.description && (
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">{sc.description}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Flag groups */}
        {groups.map((group) => {
          const groupBoolFlags = booleanFlags.filter((f) => (f.group ?? 'General') === group);
          const groupOptFlags = optionFlags.filter((f) => (f.group ?? 'General') === group);
          if (groupBoolFlags.length === 0 && groupOptFlags.length === 0) return null;
          return (
            <CollapsibleGroup key={group} label={group}>
              {groupBoolFlags.map((flag) => (
                <FlagToggle
                  key={flag.name}
                  flag={flag}
                  enabled={!!boolFlags[flag.name]}
                  onToggle={toggleFlag}
                />
              ))}
              {groupOptFlags.map((flag) => (
                <div key={flag.name} className="py-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-mono text-[hsl(var(--foreground))]">--{flag.name}</code>
                    {flag.description && (
                      <div className="group relative">
                        <HelpCircle className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] cursor-help" />
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[hsl(var(--popover))] px-2.5 py-1.5 text-xs text-[hsl(var(--popover-foreground))] opacity-0 shadow-md transition-opacity group-hover:opacity-100 border border-[hsl(var(--border))]">
                          {flag.description}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type={flag.type === 'number' ? 'number' : 'text'}
                    value={optionValues[flag.name] ?? ''}
                    onChange={(e) => setOption(flag.name, e.target.value)}
                    placeholder={String(flag.default ?? '')}
                    className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              ))}
            </CollapsibleGroup>
          );
        })}

        {/* Positional arguments */}
        {(command.positionalArgs ?? []).length > 0 && (
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Arguments
            </span>
            <div className="space-y-2">
              {(command.positionalArgs ?? []).map((arg, i) => (
                <div key={arg.name}>
                  <label className="mb-1 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                    {arg.name}
                    {arg.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={positionalValues[i] ?? ''}
                    onChange={(e) => setPositional(i, e.target.value)}
                    placeholder={arg.description ?? arg.name}
                    className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live preview */}
        <motion.div
          layout
          className="rounded-lg bg-[hsl(var(--muted))] p-3"
        >
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Command Preview
          </div>
          <motion.code
            key={cmdString}
            initial={{ opacity: 0.5, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="block break-all text-sm font-mono text-emerald-500 dark:text-emerald-400"
          >
            $ {cmdString}
          </motion.code>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRun(cmdString)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] px-3 text-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <Copy className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

CommandBuilderForm.displayName = 'CommandBuilderForm';
